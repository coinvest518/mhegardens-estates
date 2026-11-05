import Link from "next/link"
import { CalendarCheck, ClipboardCheck, Handshake, KeyRound } from "lucide-react"
import { consultHref } from "@/lib/site"

const STEPS = [
  {
    number: "01",
    icon: CalendarCheck,
    title: "Book a free 30-minute call",
    body: "Tell us if you're buying, selling or investing, and what you're looking for.",
  },
  {
    number: "02",
    icon: ClipboardCheck,
    title: "We look at your starting point",
    body: "Your savings, your credit range and your timeline. No judgment — everyone starts somewhere.",
  },
  {
    number: "03",
    icon: Handshake,
    title: "Get matched to the right path",
    body: "Ready to buy the regular way? You work with our agent. Not yet? We help with credit, programs, or auctions and land bank deals.",
  },
  {
    number: "04",
    icon: KeyRound,
    title: "Close with a plan",
    body: "We stay with you through the paperwork, the deadlines and the next steps until the keys or the deed are yours.",
  },
]

export function HowItWorksSteps() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 reveal">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">How it works</p>
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Four steps, starting with a free call</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border border border-border rounded-2xl overflow-hidden reveal-stagger">
          {STEPS.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="relative flex flex-col p-8 bg-card">
                <span className="text-5xl font-black text-primary/15 leading-none mb-4 select-none">{step.number}</span>
                <div className="mb-4 p-2.5 bg-primary/10 rounded-xl w-fit">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{step.body}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center reveal">
          <Link
            href={consultHref()}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold px-8 py-3 rounded-lg"
          >
            <CalendarCheck className="h-4 w-4" />
            Book a free consultation
          </Link>
        </div>
      </div>
    </section>
  )
}
