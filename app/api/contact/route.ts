import { NextResponse } from "next/server"
import { CONTACT_TOPICS, ContactRequestSchema } from "@/lib/contact"
import { sendLeadEmail } from "@/lib/send-lead-email"
import { SITE } from "@/lib/site"
import { getSupabase } from "@/lib/supabase-server"

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)
const row = (label: string, value: string) => `<p style="margin:4px 0"><strong>${escape(label)}:</strong> ${escape(value)}</p>`

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 })
  }
  const b = body as Record<string, unknown> | null
  if (b && typeof b.website === "string" && b.website.length > 0) return NextResponse.json({ ok: true })

  const parsed = ContactRequestSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 400 })
  const d = parsed.data
  const topic = CONTACT_TOPICS[d.topic]
  const need = topic.options.find((o) => o.value === d.need)?.label ?? d.need

  let saved = false
  const db = getSupabase()
  if (db) {
    const { error } = await db
      .from("leads")
      .insert({ role: d.topic, outcome: d.topic, name: d.name, phone: d.phone, email: d.email, answers: { need: d.need }, message: d.message ?? null })
    if (error) console.error("[contact] supabase insert failed", error.message)
    else saved = true
  }

  const sent = await sendLeadEmail({
    subject: `[${SITE.name}] ${topic.title} — ${d.name}`,
    replyTo: d.email,
    html: `
      <h2 style="margin:0 0 8px">${escape(topic.title)}</h2>
      ${row("Name", d.name)}
      ${row("Phone", d.phone)}
      ${row("Email", d.email)}
      ${row(topic.question, need)}
      ${d.message ? `<p><strong>Message:</strong><br/>${escape(d.message).replace(/\n/g, "<br/>")}</p>` : ""}
      <p style="color:#666;font-size:12px;margin-top:12px">Agreed to be contacted by ${escape(SITE.name)} and its partner agent.</p>
    `,
  })

  if (!sent && !saved) {
    console.error("[contact] UNSENT REQUEST", JSON.stringify({ topic: d.topic, need: d.need, name: d.name, phone: d.phone, email: d.email }))
    return NextResponse.json(
      { ok: false, error: `We couldn't send your request right now. Please email us at ${SITE.email}.` },
      { status: 502 }
    )
  }
  return NextResponse.json({ ok: true })
}
