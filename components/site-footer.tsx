import Link from "next/link"
import { SITE, consultHref } from "@/lib/site"
import { BUNDLE } from "@/lib/education"

const EXPLORE_LINKS = [
  { href: "/#ways", label: "Ways to buy" },
  { href: "/#who", label: "Buy · Sell · Invest" },
  { href: "/#credit", label: "Credit help" },
  { href: "/auctions", label: "Auctions" },
]

const LEARN_LINKS = [
  { href: "/education", label: "All guides" },
  { href: "/education#tax-deeds", label: "Tax deeds" },
  { href: "/education#buying-land-under-1000", label: "Buying land for under $1,000" },
  { href: "/education#buy-a-home-programs", label: "First-time buyer programs" },
]

export function SiteFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <img src="/brand/logo-96.png" alt="" width={32} height={32} className="h-8 w-8 rounded-md" />
              <span className="text-xl font-bold">{SITE.name}</span>
            </div>
            <p className="text-secondary-foreground/80 text-pretty mb-5 text-sm">{SITE.tagline}</p>
            <Link
              href={consultHref()}
              className="inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-bold text-accent-foreground hover:bg-accent/90"
            >
              Book a free consultation
            </Link>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              {EXPLORE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-secondary-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Learn</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              {LEARN_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-secondary-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={BUNDLE.buyLink} target="_blank" rel="noreferrer noopener" className="hover:text-secondary-foreground transition-colors">
                  Guide bundle — ${BUNDLE.priceUSD} ↗
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li>
                <a href={`mailto:${SITE.email}`} className="hover:text-secondary-foreground transition-colors break-all">
                  {SITE.email}
                </a>
              </li>
              <li>Partner agent: {SITE.agent.name}, {SITE.agent.company}</li>
              <li>{SITE.region}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-12 pt-8 space-y-3 text-xs text-secondary-foreground/65">
          <p className="text-pretty max-w-4xl">
            {SITE.name} shares general education about buying, selling and investing in real estate. It is not
            legal, tax or financial advice. Credit score, down payment and program rules vary by lender and
            program. Real estate agent services are provided by {SITE.agent.name} of {SITE.agent.company}.
          </p>
          <p>&copy; {new Date().getFullYear()} {SITE.name}</p>
        </div>
      </div>
    </footer>
  )
}
