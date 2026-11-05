import Link from "next/link"
import { ArrowRight, ShieldCheck, TrendingUp, Wallet } from "lucide-react"
import { SITE, consultHref } from "@/lib/site"

const HELP = [
  { icon: ShieldCheck, title: "Credit repair", body: "We go through your report with you and dispute what's wrong." },
  { icon: TrendingUp, title: "Credit building", body: "A simple plan to raise your score toward the number you need." },
  { icon: Wallet, title: "Savings plan", body: "Set a down payment goal and find programs that match what you save." },
]

export function CreditHelp() {
  const href = SITE.creditHelp.bookingUrl ?? consultHref()
  return (
    <section id="credit" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary text-secondary-foreground scroll-mt-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="reveal">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">Credit not ready yet?</p>
          <h2 className="text-4xl font-bold mb-4 text-balance">We help you get there</h2>
          <p className="text-lg text-secondary-foreground/80 text-pretty mb-8">
            A low score doesn&apos;t end the conversation. We work with you on your credit and savings so
            you come back ready — and in the meantime, auctions and land bank properties don&apos;t need a
            credit check at all.
          </p>
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-bold text-accent-foreground hover:bg-accent/90"
          >
            Get credit help <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 reveal-stagger">
          {HELP.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4 rounded-2xl bg-secondary-foreground/5 border border-secondary-foreground/15 p-5">
              <div className="p-2.5 rounded-xl bg-accent/20 h-fit">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-bold mb-1">{title}</h3>
                <p className="text-sm text-secondary-foreground/75 text-pretty">{body}</p>
              </div>
            </div>
          ))}
          {SITE.creditHelp.affiliateLinks.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-1">
              {SITE.creditHelp.affiliateLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer noopener sponsored"
                  className="text-sm font-semibold text-accent hover:underline"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
