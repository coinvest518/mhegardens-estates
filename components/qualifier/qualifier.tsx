"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CalendarCheck, Check, ExternalLink, Gavel, Loader2, Phone, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ContactSchema,
  QUESTIONS,
  ROLE_QUESTION,
  getOutcome,
  type Answers,
  type Option,
  type Outcome,
  type Question,
  type Role,
} from "@/lib/qualifier"
import { SITE } from "@/lib/site"
import { useAuth } from "@/components/auth-provider"

type ContactState = { name: string; phone: string; email: string; consent: boolean; website: string }
type ContactErrors = Partial<Record<"name" | "phone" | "email" | "consent", string>>

function OptionButton({ option, selected, onClick }: { option: Option; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`w-full text-left rounded-xl border px-4 py-3.5 transition-colors flex items-center justify-between gap-3 ${
        selected ? "border-primary bg-primary/10" : "border-border bg-background hover:border-primary/60 hover:bg-muted/40"
      }`}
    >
      <span>
        <span className="block font-semibold text-foreground">{option.label}</span>
        {option.hint && <span className="block text-sm text-muted-foreground">{option.hint}</span>}
      </span>
      <span
        className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${
          selected ? "border-primary bg-primary text-primary-foreground" : "border-input"
        }`}
        aria-hidden
      >
        {selected && <Check className="w-3 h-3" />}
      </span>
    </button>
  )
}

function BookingButton({ href, label }: { href: string | null; label: string }) {
  if (!href) return null
  return (
    <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
      <a href={href} target="_blank" rel="noreferrer noopener">
        <CalendarCheck className="mr-2 h-4 w-4" /> {label}
      </a>
    </Button>
  )
}

function WeWillCall() {
  return (
    <p className="flex items-start gap-2 rounded-xl bg-muted/50 p-3 text-sm text-foreground">
      <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
      We&apos;ll call or text you within one business day to set up your free 30-minute call.
    </p>
  )
}

function OutcomeView({ outcome, firstName, onNavigate }: { outcome: Outcome; firstName: string; onNavigate?: () => void }) {
  const { agent, creditHelp, consultBookingUrl } = SITE
  const agentBooking = agent.bookingUrl ?? consultBookingUrl

  const content: Record<Outcome, { title: string; body: React.ReactNode; actions: React.ReactNode }> = {
    agent: {
      title: `${firstName}, you look ready to work with an agent`,
      body: (
        <>
          <p>
            Our partner agent <strong>{agent.name}</strong> ({agent.company}, speaks {agent.languages}) can help you get
            pre-approved, find the right place and get to closing.
          </p>
          <p>
            Next step: a free 30-minute call. After that, you sign a buyer agreement with {agent.name.split(" ")[0]} so she can
            represent you through the whole process.
          </p>
          <p>We&apos;ll also check which down payment matching programs you qualify for — they can stretch your savings.</p>
        </>
      ),
      actions: agentBooking ? <BookingButton href={agentBooking} label={`Book with ${agent.name.split(" ")[0]}`} /> : <WeWillCall />,
    },
    "agent-fha": {
      title: `${firstName}, you can likely start with FHA or a first-time buyer program`,
      body: (
        <>
          <p>
            With a score between 580 and 679, FHA and first-time buyer programs are the usual way in. Expect a bigger down
            payment than with a 680+ score.
          </p>
          <p>
            Down payment matching programs can help you save that faster. On your call, <strong>{agent.name}</strong> (
            {agent.company}) will go over the programs that fit you, then you sign a buyer agreement so she can represent you.
          </p>
        </>
      ),
      actions: agentBooking ? <BookingButton href={agentBooking} label={`Book with ${agent.name.split(" ")[0]}`} /> : <WeWillCall />,
    },
    credit: {
      title: `${firstName}, let's get your credit ready first`,
      body: (
        <>
          <p>Most home loans need a score of at least 580. We&apos;ll help you get there:</p>
          <ul className="space-y-1.5">
            <li className="flex gap-2"><Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" /> Go through your credit report and dispute what&apos;s wrong</li>
            <li className="flex gap-2"><Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" /> A simple plan to build your score</li>
            <li className="flex gap-2"><Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" /> Savings and matching programs for your down payment</li>
          </ul>
          <p>
            In the meantime, county tax auctions and land bank properties don&apos;t use a credit check — there may be a way in
            sooner.
          </p>
        </>
      ),
      actions: (
        <>
          {creditHelp.bookingUrl ? <BookingButton href={creditHelp.bookingUrl} label="Book a credit help call" /> : <WeWillCall />}
          {creditHelp.affiliateLinks.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Tools that help build credit</p>
              {creditHelp.affiliateLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer noopener sponsored"
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm font-medium hover:border-primary"
                >
                  {l.label} <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </a>
              ))}
            </div>
          )}
          <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
            <Link href="/auctions" onClick={onNavigate}>
              <Gavel className="mr-2 h-4 w-4" /> See tax auctions (no credit check)
            </Link>
          </Button>
        </>
      ),
    },
    "alt-path": {
      title: `${firstName}, let's do it the auction and land bank way`,
      body: (
        <>
          <p>No credit check needed. We help you:</p>
          <ul className="space-y-1.5">
            <li className="flex gap-2"><Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" /> Find properties at county tax auctions and the land bank</li>
            <li className="flex gap-2"><Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" /> Register, research and plan your bids</li>
            <li className="flex gap-2"><Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" /> Or buy from properties we have — and we do the legwork</li>
          </ul>
        </>
      ),
      actions: (
        <>
          {consultBookingUrl ? <BookingButton href={consultBookingUrl} label="Book your free call" /> : <WeWillCall />}
          <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
            <Link href="/auctions" onClick={onNavigate}>
              <Gavel className="mr-2 h-4 w-4" /> See upcoming auctions
            </Link>
          </Button>
        </>
      ),
    },
    seller: {
      title: `${firstName}, let's talk about your property`,
      body: (
        <p>
          You can list it with <strong>{agent.name}</strong> ({agent.company}) or ask about a fast, as-is offer — including if
          you&apos;re behind on taxes or payments, or inherited the property.
        </p>
      ),
      actions: agentBooking ? <BookingButton href={agentBooking} label="Book your free call" /> : <WeWillCall />,
    },
    investor: {
      title: `${firstName}, let's find your next deal`,
      body: <p>On your call we go over upcoming auctions, land bank listings and off-market properties — and run the numbers before you buy.</p>,
      actions: (
        <>
          {consultBookingUrl ? <BookingButton href={consultBookingUrl} label="Book your free call" /> : <WeWillCall />}
          <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
            <Link href="/auctions" onClick={onNavigate}>
              <Gavel className="mr-2 h-4 w-4" /> See upcoming auctions
            </Link>
          </Button>
        </>
      ),
    },
  }

  const c = content[outcome]
  return (
    <div className="space-y-5" data-testid={`qualifier-result-${outcome}`}>
      <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit">
        <Check className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-2xl font-bold text-foreground text-center text-balance">{c.title}</h3>
      <div className="space-y-3 text-muted-foreground text-pretty">{c.body}</div>
      <div className="space-y-3">{c.actions}</div>
    </div>
  )
}

export function Qualifier({ onNavigate, initialRole = null }: { onNavigate?: () => void; initialRole?: Role | null }) {
  const [role, setRole] = useState<Role | null>(initialRole)
  const [answers, setAnswers] = useState<Answers>({})
  const [step, setStep] = useState(initialRole ? 1 : 0) // 0 = role, 1..n = questions, n+1 = contact
  const [contact, setContact] = useState<ContactState>({ name: "", phone: "", email: "", consent: false, website: "" })
  const { user } = useAuth()

  // Signed-in visitors don't have to retype their name and email.
  useEffect(() => {
    if (!user) return
    setContact((c) => ({
      ...c,
      name: c.name || user.displayName || "",
      email: c.email || user.email || "",
    }))
  }, [user])
  const [errors, setErrors] = useState<ContactErrors>({})
  const fix = (k: keyof ContactErrors) => setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e))
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [outcome, setOutcome] = useState<Outcome | null>(null)

  const questions: Question[] = role ? QUESTIONS[role] : []
  const totalSteps = 1 + (role ? questions.length : 4) + 1
  const contactStep = 1 + questions.length
  const isContact = role !== null && step === contactStep
  const question: Question | null = step === 0 ? ROLE_QUESTION : role && step <= questions.length ? questions[step - 1] : null
  const progress = outcome ? 100 : Math.round((step / totalSteps) * 100)

  const pick = (value: string) => {
    if (step === 0) {
      const r = value as Role
      if (r !== role) setAnswers({})
      setRole(r)
      setStep(1)
      return
    }
    if (!question) return
    setAnswers((a) => ({ ...a, [question.id]: value }))
    setStep((s) => s + 1)
  }

  const back = () => {
    setSubmitError(null)
    setStep((s) => Math.max(0, s - 1))
  }

  const restart = () => {
    setRole(null)
    setAnswers({})
    setStep(0)
    setOutcome(null)
    setErrors({})
    setSubmitError(null)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) return
    const parsed = ContactSchema.safeParse({ ...contact, consent: contact.consent ? true : undefined })
    if (!parsed.success) {
      const errs: ContactErrors = {}
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof ContactErrors
        if (!errs[k]) errs[k] = issue.message
      }
      setErrors(errs)
      return
    }
    setErrors({})
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...parsed.data, role, answers, website: contact.website }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.")
        return
      }
      setOutcome((data.outcome as Outcome) ?? getOutcome(role, answers))
    } catch {
      setSubmitError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const firstName = useMemo(() => contact.name.trim().split(/\s+/)[0] || "Thanks", [contact.name])

  return (
    <div className="w-full">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-6 pr-8">
        {step > 0 && !outcome ? (
          <button type="button" onClick={back} className="p-1.5 -ml-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : (
          <span className="w-8" aria-hidden />
        )}
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${Math.max(progress, 4)}%` }} />
        </div>
      </div>

      {outcome ? (
        <>
          <OutcomeView outcome={outcome} firstName={firstName} onNavigate={onNavigate} />
          <button type="button" onClick={restart} className="mt-6 mx-auto flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <RotateCcw className="h-3.5 w-3.5" /> Start over
          </button>
        </>
      ) : isContact ? (
        <form onSubmit={submit} noValidate className="space-y-4" data-testid="qualifier-contact">
          <div>
            <h3 className="text-2xl font-bold text-foreground text-balance">Almost done — where should we reach you?</h3>
            <p className="text-muted-foreground mt-1">We&apos;ll show your results on the next screen.</p>
          </div>
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={contact.website}
            onChange={(e) => setContact((c) => ({ ...c, website: e.target.value }))}
            style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
          />
          <div className="space-y-1.5">
            <Label htmlFor="q-name">Name</Label>
            <Input id="q-name" autoComplete="name" value={contact.name} onChange={(e) => { setContact((c) => ({ ...c, name: e.target.value })); fix("name") }} aria-invalid={!!errors.name} />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="q-phone">Phone</Label>
            <Input id="q-phone" type="tel" autoComplete="tel" placeholder="(518) 555-0123" value={contact.phone} onChange={(e) => { setContact((c) => ({ ...c, phone: e.target.value })); fix("phone") }} aria-invalid={!!errors.phone} />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="q-email">Email</Label>
            <Input id="q-email" type="email" autoComplete="email" placeholder="you@example.com" value={contact.email} onChange={(e) => { setContact((c) => ({ ...c, email: e.target.value })); fix("email") }} aria-invalid={!!errors.email} />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-start gap-3">
              <Checkbox id="q-consent" checked={contact.consent} onCheckedChange={(v) => { setContact((c) => ({ ...c, consent: v === true })); fix("consent") }} className="mt-0.5" />
              <Label htmlFor="q-consent" className="text-sm font-normal text-muted-foreground leading-snug">
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
          <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
              </>
            ) : (
              <>
                See my results <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      ) : question ? (
        <div data-testid={`qualifier-step-${question.id}`}>
          <h3 className="text-2xl font-bold text-foreground text-balance">{question.title}</h3>
          {question.subtitle && <p className="text-muted-foreground mt-1">{question.subtitle}</p>}
          <div role="radiogroup" aria-label={question.title} className="mt-5 space-y-2.5">
            {question.options.map((o) => (
              <OptionButton
                key={o.value}
                option={o}
                selected={step === 0 ? role === o.value : answers[question.id] === o.value}
                onClick={() => pick(o.value)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
