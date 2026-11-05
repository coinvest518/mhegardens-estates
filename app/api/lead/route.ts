import { NextResponse } from "next/server"
import {
  OUTCOME_LABEL,
  QUESTIONS,
  SubmissionSchema,
  getOutcome,
  labelFor,
  type Outcome,
  type Submission,
} from "@/lib/qualifier"
import { sendConfirmation, sendLeadEmail } from "@/lib/send-lead-email"
import { SITE } from "@/lib/site"
import { getSupabase } from "@/lib/supabase-server"

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)

const row = (label: string, value: string) => `<p style="margin:4px 0"><strong>${escape(label)}:</strong> ${escape(value)}</p>`

const ROLE_LABEL = { buyer: "Buyer", seller: "Seller", investor: "Investor" } as const

function leadEmail(d: Submission, outcome: Outcome) {
  const answers = QUESTIONS[d.role].map((q) => row(q.title, labelFor(q.id, d.answers[q.id], d.role))).join("")
  return {
    subject: `[${SITE.name}] ${ROLE_LABEL[d.role]} · ${OUTCOME_LABEL[outcome]} — ${d.name}`,
    html: `
      <h2 style="margin:0 0 8px">New ${ROLE_LABEL[d.role].toLowerCase()} lead</h2>
      <p style="margin:0 0 12px;padding:8px 12px;background:#eef6ee;border-radius:6px"><strong>Result:</strong> ${escape(OUTCOME_LABEL[outcome])}</p>
      ${row("Name", d.name)}
      ${row("Phone", d.phone)}
      ${row("Email", d.email)}
      <hr style="border:none;border-top:1px solid #ddd;margin:12px 0"/>
      ${answers}
      ${d.message ? `<p><strong>Message:</strong><br/>${escape(d.message).replace(/\n/g, "<br/>")}</p>` : ""}
      <p style="color:#666;font-size:12px;margin-top:12px">Agreed to be contacted by ${escape(SITE.name)} and its partner agent.</p>
    `,
  }
}

function confirmationEmail(d: Submission, outcome: Outcome) {
  const first = escape(d.name.trim().split(/\s+/)[0])
  const agentFirst = SITE.agent.name.split(" ")[0]
  const next: Record<Outcome, string> = {
    agent: `You look ready to work with an agent. Our partner agent ${SITE.agent.name} (${SITE.agent.company}) will help you get pre-approved, find the right place and close.`,
    "agent-fha": `With a 580–679 score, FHA and first-time buyer programs are the usual way in. ${agentFirst} will go over the programs that fit you, including down payment matching.`,
    credit: `Let's get your credit ready first. We'll go through your report with you and build a plan to raise your score. In the meantime, county tax auctions and land bank properties don't use a credit check.`,
    "alt-path": `We'll help you buy through county tax auctions or the land bank — no credit check needed.`,
    seller: `We'll talk through listing your property with ${SITE.agent.name} or a fast, as-is offer.`,
    investor: `We'll go over upcoming auctions, land bank listings and the numbers before you buy.`,
  }
  const booking =
    outcome === "credit"
      ? SITE.creditHelp.bookingUrl
      : outcome === "agent" || outcome === "agent-fha" || outcome === "seller"
        ? SITE.agent.bookingUrl ?? SITE.consultBookingUrl
        : SITE.consultBookingUrl
  const cta = booking
    ? `<p><a href="${booking}" style="display:inline-block;background:#edba2f;color:#17201d;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold">Pick a time for your free call</a></p>`
    : `<p>We'll call or text you within one business day to set up your free 30-minute call.</p>`
  return {
    subject: `Your next step — ${SITE.name}`,
    replyTo: SITE.email,
    html: `
      <p>Hi ${first},</p>
      <p>Thanks for answering our questions. ${escape(next[outcome])}</p>
      ${cta}
      <p>— The ${escape(SITE.name)} team<br/>${escape(SITE.email)}</p>
    `,
  }
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 })
  }

  // Bots that fill the hidden field get a quiet "ok" and nothing is sent.
  const b = body as Record<string, unknown> | null
  if (b && typeof b.website === "string" && b.website.length > 0) return NextResponse.json({ ok: true })

  const parsed = SubmissionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check your answers and try again." }, { status: 400 })
  }
  const data = parsed.data
  const outcome = getOutcome(data.role, data.answers)

  // 1) Save the lead (when Supabase is set up). A saved lead counts as received even if email fails.
  let leadId: string | null = null
  const db = getSupabase()
  if (db) {
    const { data: rowData, error } = await db
      .from("leads")
      .insert({ role: data.role, outcome, name: data.name, phone: data.phone, email: data.email, answers: data.answers, message: data.message ?? null })
      .select("id")
      .single()
    if (error) console.error("[lead] supabase insert failed", error.message)
    else leadId = rowData?.id ?? null
  }

  // 2) Email the lead to the team
  const sentFrom = await sendLeadEmail({ ...leadEmail(data, outcome), replyTo: data.email })
  if (!sentFrom) {
    if (leadId) return NextResponse.json({ ok: true, outcome })
    console.error("[lead] UNSENT LEAD", JSON.stringify({ outcome, role: data.role, name: data.name, phone: data.phone, email: data.email, answers: data.answers }))
    return NextResponse.json(
      { ok: false, error: `We couldn't send your request right now. Please email us at ${SITE.email}.` },
      { status: 502 }
    )
  }
  if (db && leadId) {
    const { error } = await db.from("leads").update({ email_sent: true }).eq("id", leadId)
    if (error) console.warn("[lead] supabase update failed", error.message)
  }

  // 3) Confirmation to the person (only works once a domain is verified in Resend)
  await sendConfirmation(data.email, sentFrom, confirmationEmail(data, outcome))

  return NextResponse.json({ ok: true, outcome })
}
