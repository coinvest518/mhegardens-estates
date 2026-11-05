import Link from "next/link"
import { ArrowRight, Building2, Gavel, Hammer, Home, PiggyBank } from "lucide-react"
import { consultHref } from "@/lib/site"

const WAYS = [
  {
    icon: Home,
    title: "Buy with a mortgage",
    body:
      "The regular way. Conventional loans usually want a credit score around 680 or higher. FHA and first-time buyer programs can start lower — around 580 — with a bigger down payment.",
    tag: "Most common",
  },
  {
    icon: PiggyBank,
    title: "Down payment matching",
    body:
      "Programs that match the money you save, so your down payment or deposit grows faster. We help you find the ones you qualify for.",
    tag: "First-time buyers",
  },
  {
    icon: Gavel,
    title: "County tax auctions",
    body:
      "Counties sell tax-foreclosed land and houses at public auctions, mostly online. No credit check and no license — you need a bidder account and the money ready.",
    tag: "No credit check",
  },
  {
    icon: Building2,
    title: "Land bank properties",
    body:
      "Land banks sell vacant lots and houses through an application instead of a bidding war. Prices can be low, and you show a plan for the property.",
    tag: "Low prices",
  },
  {
    icon: Hammer,
    title: "Fix and flip",
    body:
      "Buy a property that needs work, fix it up, then sell or rent it. We help you run the numbers before you buy.",
    tag: "Investors",
  },
]

export function WaysToBuy() {
  return (
    <section id="ways" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 reveal">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">Ways to buy</p>
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">There&apos;s more than one way in</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Most people only hear about mortgages. Here are all the paths we help with — on the call,
            we figure out which one fits you.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal-stagger">
          {WAYS.map(({ icon: Icon, title, body, tag }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 hover-lift"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">{tag}</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground text-pretty leading-relaxed flex-1">{body}</p>
              <Link
                href={consultHref()}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80"
              >
                Ask about this <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}

          <div className="flex flex-col justify-between rounded-2xl bg-secondary text-secondary-foreground p-6">
            <div>
              <h3 className="text-lg font-bold mb-2">Not sure which fits?</h3>
              <p className="text-sm text-secondary-foreground/80 text-pretty">
                That&apos;s what the free call is for. Tell us your goal, your savings and your credit
                range — we&apos;ll lay out your options.
              </p>
            </div>
            <Link
              href={consultHref()}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground hover:bg-accent/90"
            >
              Book a free consultation
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Credit score and down payment rules vary by lender and program. We&apos;ll go over the details on your call.
        </p>
      </div>
    </section>
  )
}
