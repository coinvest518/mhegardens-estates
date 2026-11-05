"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarCheck, Check, ExternalLink, Loader2, Phone } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { CONTACT_TOPICS, ContactRequestSchema, type ContactTopic } from "@/lib/contact"
import { SITE } from "@/lib/site"

/**
 * Links to "#contact-credit", "#contact-agent", "#contact-auction" or "#contact-landbank" open the matching popup.
 * Code can also open one with a message already filled in:
 *   window.dispatchEvent(new CustomEvent("mhe:contact", { detail: { topic: "landbank", message: "..." } }))
 */
const CONTACT_RE = /#contact-(credit|agent|auction|landbank)$/

type Errors = Partial<Record<"need" | "name" | "phone" | "email" | "consent", string>>

function ContactForm({
  topic,
  onNavigate,
  initialMessage = "",
}: {
  topic: ContactTopic
  onNavigate: () => void
  initialMessage?: string
}) {
  const t = CONTACT_TOPICS[topic]
  const { user } = useAuth()
  const [need, setNeed] = useState("")
  const [name, setName] = useState(user?.displayName ?? "")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState(user?.email ?? "")
  const [message, setMessage] = useState(initialMessage)
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const fix = (k: keyof Errors) => setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = ContactRequestSchema.safeParse({
      topic,
      need,
      name,
      phone,
      email,
      message: message || undefined,
      consent: consent ? true : undefined,
      website,
    })
    if (!parsed.success) {
      const errs: Errors = {}
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof Errors
        if (!errs[k]) errs[k] = issue.message
      }
      setErrors(errs)
      return
    }
    setErrors({})
    setBusy(true)
    setSubmitError(null)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.")
        return
      }
      setDone(true)
    } catch {
      setSubmitError("Network error. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    const booking = topic === "credit" ? SITE.creditHelp.bookingUrl : topic === "agent" ? SITE.agent.bookingUrl : SITE.consultBookingUrl
    return (
      <div className="space-y-5" data-testid={`contact-done-${topic}`}>
        <div className="mx-auto w-fit rounded-full bg-mist p-3">
          <Check className="h-6 w-6 text-leaf" />
        </div>
        <h3 className="text-center text-2xl font-bold text-pine">Got it, {name.trim().split(/\s+/)[0]}.</h3>
        {booking ? (
          <a
            href={booking}
            target="_blank"
            rel="noreferrer noopener"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-goldenrod px-5 py-3.5 font-semibold text-ink"
          >
            <CalendarCheck className="h-4 w-4" /> Pick a time now
          </a>
        ) : (
          <p className="flex items-start gap-2 rounded-xl bg-mist p-3 text-ink">
            <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-leaf" /> {t.thanks}
          </p>
        )}
        {topic === "credit" && (
          <>
            {SITE.creditHelp.affiliateLinks.length > 0 && (
              <div className="space-y-2">
                <p className="font-semibold text-pine">Tools that help build credit</p>
                {SITE.creditHelp.affiliateLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer noopener sponsored"
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 font-medium hover:border-leaf"
                  >
                    {l.label} <ExternalLink className="h-4 w-4 text-slate" />
                  </a>
                ))}
              </div>
            )}
            <p className="text-slate">
              Meanwhile, county tax auctions don&apos;t use a credit check.{" "}
              <Link href="/auctions" onClick={onNavigate} className="font-semibold text-leaf underline underline-offset-4">
                See upcoming auctions
              </Link>
            </p>
          </>
        )}
        {topic === "auction" && (
          <a
            href={SITE.auctionsInternationalUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-leaf px-5 py-3 font-semibold text-leaf"
          >
            Browse live auctions <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4" data-testid={`contact-form-${topic}`}>
      <div>
        <h3 className="text-2xl font-bold text-pine">{t.title}</h3>
        <p className="mt-1 text-slate">{t.intro}</p>
      </div>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <fieldset>
        <legend className="mb-2 font-semibold text-ink">{t.question}</legend>
        <div className="grid gap-2" role="radiogroup">
          {t.options.map((o) => (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={need === o.value}
              onClick={() => { setNeed(o.value); fix("need") }}
              className={`rounded-xl border px-4 py-3 text-left font-medium transition-colors ${
                need === o.value ? "border-leaf bg-mist text-pine" : "border-border bg-white hover:border-leaf/60"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        {errors.need && <p className="mt-1 text-sm text-destructive">{errors.need}</p>}
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`c-name-${topic}`}>Name</Label>
          <Input id={`c-name-${topic}`} autoComplete="name" value={name} onChange={(e) => { setName(e.target.value); fix("name") }} aria-invalid={!!errors.name} className="h-11" />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`c-phone-${topic}`}>Phone</Label>
          <Input id={`c-phone-${topic}`} type="tel" autoComplete="tel" placeholder="(518) 555-0123" value={phone} onChange={(e) => { setPhone(e.target.value); fix("phone") }} aria-invalid={!!errors.phone} className="h-11" />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`c-email-${topic}`}>Email</Label>
        <Input id={`c-email-${topic}`} type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); fix("email") }} aria-invalid={!!errors.email} className="h-11" />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`c-msg-${topic}`}>Anything else? (optional)</Label>
        <Textarea id={`c-msg-${topic}`} rows={2} value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-start gap-3">
          <Checkbox id={`c-consent-${topic}`} checked={consent} onCheckedChange={(v) => { setConsent(v === true); fix("consent") }} className="mt-0.5" />
          <Label htmlFor={`c-consent-${topic}`} className="text-sm font-normal leading-snug text-slate">
            I agree to be contacted by {SITE.name} and its partner agent, {SITE.agent.name} of {SITE.agent.company}, by phone,
            text or email about my request.
          </Label>
        </div>
        {errors.consent && <p className="text-sm text-destructive">{errors.consent}</p>}
      </div>
      {submitError && (
        <p role="alert" className="text-sm text-destructive">
          {submitError}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-goldenrod px-5 py-3.5 font-semibold text-ink disabled:opacity-60"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {busy ? "Sending…" : "Send"}
      </button>
    </form>
  )
}

export function ContactModal() {
  const [topic, setTopic] = useState<ContactTopic | null>(null)
  const [session, setSession] = useState(0)
  const [initialMessage, setInitialMessage] = useState("")

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement | null)?.closest?.("a")
      const m = (a?.getAttribute("href") ?? "").match(CONTACT_RE)
      if (!m) return
      e.preventDefault()
      setSession((s) => s + 1)
      setInitialMessage("")
      setTopic(m[1] as ContactTopic)
    }
    const onOpen = (e: Event) => {
      const { topic: t, message } = (e as CustomEvent<{ topic: ContactTopic; message?: string }>).detail ?? {}
      if (!t || !(t in CONTACT_TOPICS)) return
      setSession((s) => s + 1)
      setInitialMessage(message ?? "")
      setTopic(t)
    }
    document.addEventListener("click", onClick, true)
    window.addEventListener("mhe:contact", onOpen)
    return () => {
      document.removeEventListener("click", onClick, true)
      window.removeEventListener("mhe:contact", onOpen)
    }
  }, [])

  return (
    <Dialog open={topic !== null} onOpenChange={(o) => !o && setTopic(null)}>
      <DialogContent className="sm:max-w-lg max-h-[92dvh] overflow-y-auto p-5 sm:p-8" data-testid="contact-modal">
        <DialogTitle className="sr-only">{topic ? CONTACT_TOPICS[topic].title : "Contact"}</DialogTitle>
        <DialogDescription className="sr-only">Tell us what you need and how to reach you.</DialogDescription>
        {topic && (
          <ContactForm
            key={`${topic}-${session}`}
            topic={topic}
            initialMessage={initialMessage}
            onNavigate={() => setTopic(null)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
