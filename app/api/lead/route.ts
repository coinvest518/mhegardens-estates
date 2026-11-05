import { NextResponse } from "next/server"
import { Resend } from "resend"
import {
  OUTCOME_LABEL,
  QUESTIONS,
  SubmissionSchema,
  getOutcome,
  labelFor,
  type Outcome,
  type Submission,
} from "@/lib/qualifier"
import { SITE } from "@/lib/site"

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)

const row = (label: string, value: string) => `<p style="margin:4px 0"><strong>${escape(label)}:</strong> ${escape(value)}</p>`

const ROLE_LABEL = { buyer: "Buyer", seller: "Seller", investor: "Investor" } as const

function leadEmail(d: Submission, outcome: Outcome) {
  const answers = QUESTIONS[d.role]
    .map((q) => row(q.title, labelFor(q.id, d.answers[q.id], d.role)))
    .join("")
  const html = `
    <h2 style="margin:0 0 8px">New ${ROLE_LABEL[d.role].toLowerCase()} lead</h2>
    <p style="margin:0 0 12px;padding:8px 12px;background:#eef6ee;border-radius:6px"><strong>Result:</strong> ${escape(OUTCOME_LABEL[outcome])}</p>
    ${row("Name", d.name)}
    ${row("Phone", d.phone)}
    ${row("Email", d.email)}
    <hr style="border:none;border-top:1px solid #ddd;margin:12px 0"/>
    ${answers}
    ${d.message ? `<p><strong>Message:</strong><br/>${escape(d.message).replace(/\n/g, "<br/>")}</p>` : ""}
    <p style="color:#666;font-size:12px;margin-top:12px">Agreed to be contacted by ${escape(SITE.name)} and its partner agent.</p>
  `
  return { subject: `[${SITE.name}] ${ROLE_LABEL[d.role]} · ${OUTCOME_LABEL[outcome]} — ${d.name}`, html }
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
    outcome === "credit" ? SITE.creditHelp.bookingUrl : outcome === "agent" || outcome === "agent-fha" || outcome === "seller" ? SITE.agent.bookingUrl ?? SITE.consultBookingUrl : SITE.consultBookingUrl
  const cta = booking
    ? `<p><a href="${booking}" style="display:inline-block;background:#c8642c;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold">Pick a time for your free call</a></p>`
    : `<p>We'll call or text you within one business day to set up your free 30-minute call.</p>`
  return {
    subject: `Your next step — ${SITE.name}`,
    html: `
      <p>Hi ${first},</p>
      <p>Thanks for answering our questions. ${escape(next[outcome])}</p>
      ${cta}
      <p>— The ${escape(SITE.name)} team<br/>${escape(SITE.email)}</p>
    `,
  }
}

const sendFail = () =>
  NextResponse.json(
    { ok: false, error: `We couldn't send your request right now. Please email us at ${SITE.email}.` },
    { status: 502 }
  )

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 })
  }

  // Bots that fill the hidden field get a quiet "ok" and nothing is sent.
  const b = body as Record<string, unknown> | null
  if (b && typeof b.website === "string" && b.website.length > 0) {
    return NextResponse.json({ ok: true })
  }

  const parsed = SubmissionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check your answers and try again." }, { status: 400 })
  }
  const data = parsed.data
  const outcome = getOutcome(data.role, data.answers)

  const apiKey = process.env.RESEND_API_KEY
  const recipients = process.env.LEAD_TO_EMAIL?.split(",").map((e) => e.trim()).filter(Boolean) ?? []
  const from = (process.env.LEAD_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev").trim()

  if (!apiKey || recipients.length === 0) {
    console.error("[lead] missing RESEND_API_KEY or LEAD_TO_EMAIL", { hasKey: Boolean(apiKey), recipientCount: recipients.length })
    return NextResponse.json(
      { ok: false, error: `We couldn't send your request right now. Please email us at ${SITE.email}.` },
      { status: 500 }
    )
  }

  const resend = new Resend(apiKey)
  try {
    const { error } = await resend.emails.send({ from, to: recipients, replyTo: data.email, ...leadEmail(data, outcome) })
    if (error) {
      console.error("[lead] resend error", { message: error.message })
      return sendFail()
    }
  } catch (err) {
    console.error("[lead] send threw", err)
    return sendFail()
  }

  // Confirmation to the person. Best-effort: the lead is already delivered if this fails.
  try {
    const { error } = await resend.emails.send({ from, to: [data.email], replyTo: SITE.email, ...confirmationEmail(data, outcome) })
    if (error) console.warn("[lead] confirmation email not sent", { message: error.message })
  } catch (err) {
    console.warn("[lead] confirmation email threw", err)
  }

  return NextResponse.json({ ok: true, outcome })
}
