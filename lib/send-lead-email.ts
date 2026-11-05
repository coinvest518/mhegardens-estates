import { Resend } from "resend"

export const FALLBACK_FROM = "onboarding@resend.dev"

export function emailConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    recipients: process.env.LEAD_TO_EMAIL?.split(",").map((e) => e.trim()).filter(Boolean) ?? [],
    from: (process.env.LEAD_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || FALLBACK_FROM).trim(),
  }
}

/**
 * Email a lead to the team. Tries the configured sender first, then Resend's
 * built-in sender (works even if the custom domain lapses).
 * Returns the sender that worked, or null if email isn't set up or every try failed.
 */
export async function sendLeadEmail(msg: { subject: string; html: string; replyTo: string }): Promise<string | null> {
  const { apiKey, recipients, from } = emailConfig()
  if (!apiKey || recipients.length === 0) {
    console.error("[email] missing RESEND_API_KEY or LEAD_TO_EMAIL", { hasKey: Boolean(apiKey), recipientCount: recipients.length })
    return null
  }
  const resend = new Resend(apiKey)
  const senders = from === FALLBACK_FROM ? [from] : [from, FALLBACK_FROM]
  for (const sender of senders) {
    try {
      const { error } = await resend.emails.send({ from: sender, to: recipients, ...msg })
      if (!error) return sender
      console.error("[email] resend error", { sender, message: error.message })
    } catch (err) {
      console.error("[email] send threw", { sender, err })
    }
  }
  return null
}

/** Best-effort email to the person who filled the form (needs a verified domain in Resend). */
export async function sendConfirmation(to: string, sender: string, msg: { subject: string; html: string; replyTo: string }) {
  const { apiKey } = emailConfig()
  if (!apiKey) return
  try {
    const { error } = await new Resend(apiKey).emails.send({ from: sender, to: [to], ...msg })
    if (error) console.warn("[email] confirmation not sent", { message: error.message })
  } catch (err) {
    console.warn("[email] confirmation threw", err)
  }
}
