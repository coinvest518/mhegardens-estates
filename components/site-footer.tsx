import Link from "next/link"
import { SITE } from "@/lib/site"
import { BUNDLE } from "@/lib/education"

const LINKS = [
  { href: "/#ways", label: "Ways to buy" },
  { href: "/#ask", label: "Ask a question" },
  { href: "/#credit", label: "Credit help" },
  { href: "/programs", label: "Down payment help" },
  { href: "/land-bank", label: "Land bank list" },
  { href: "/auctions", label: "Tax auctions" },
  { href: "/education", label: "Learn" },
  { href: "/#consult", label: "See if you qualify" },
]

export function SiteFooter() {
  return (
    <footer className="bg-pine-deep text-[#cfe0d7] px-5 sm:px-6 lg:px-8 pt-14 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/brand/logo-96.png" alt="" width={32} height={32} className="h-8 w-8 rounded-lg" />
              <span className="font-display text-xl font-bold text-white">{SITE.name}</span>
            </div>
            <p className="mt-3 text-pretty">Land and homes in Upstate New York, the regular way or the auction way.</p>
          </div>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white hover:underline underline-offset-4 decoration-goldenrod">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={BUNDLE.buyLink} target="_blank" rel="noreferrer noopener" className="hover:text-white hover:underline underline-offset-4 decoration-goldenrod">
                  Ebook bundle (${BUNDLE.priceUSD})
                </a>
              </li>
              <li>
                <a href={SITE.community.url} target="_blank" rel="noreferrer noopener" className="hover:text-white hover:underline underline-offset-4 decoration-goldenrod">
                  Community
                </a>
              </li>
            </ul>
          </nav>

          <div className="space-y-2">
            <a href={`mailto:${SITE.email}`} className="block break-all text-white hover:underline underline-offset-4 decoration-goldenrod">
              {SITE.email}
            </a>
            <p>
              Partner agent: {SITE.agent.name}, {SITE.agent.company}
            </p>
            <p>Albany and the Capital Region</p>
          </div>
        </div>

        <div className="mt-12 border-t border-white/12 pt-6 space-y-2 text-sm text-[#9fb8ac]">
          <p className="max-w-3xl text-pretty">
            {SITE.name} shares general education about buying, selling and investing in real estate. It is not legal, tax
            or financial advice. Credit, down payment and program rules vary by lender and program. Real estate agent
            services are provided by {SITE.agent.name} of {SITE.agent.company}.
          </p>
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
