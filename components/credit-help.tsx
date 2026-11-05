import Link from "next/link"
import { SITE } from "@/lib/site"

const HELP = [
  { title: "Credit repair", body: "We go through your report with you and dispute what's wrong." },
  { title: "Credit building", body: "A simple plan to raise your score toward the number you need." },
  { title: "Savings plan", body: "A down payment goal, plus programs that match what you save." },
]

export function CreditHelp() {
  const href = SITE.creditHelp.bookingUrl ?? "/#contact-credit"
  const external = Boolean(SITE.creditHelp.bookingUrl)
  return (
    <section id="credit" className="py-16 sm:py-20 px-5 sm:px-6 lg:px-8 bg-pine text-[#eef4f0] scroll-mt-20">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-balance">Credit not ready yet? Start here.</h2>
          <p className="mt-4 text-lg text-[#cfe0d7] text-pretty">
            A low score doesn&apos;t end the conversation. We work on your credit and savings with you so you come back
            ready — and county auctions and the land bank don&apos;t use a credit check at all.
          </p>
          <Link
            href={href}
            {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
            className="mt-7 inline-flex items-center justify-center rounded-xl bg-goldenrod px-6 py-3.5 font-semibold text-ink hover:bg-[#f4c94e]"
          >
            Get credit help
          </Link>
        </div>
        <dl className="divide-y divide-white/12 border-y border-white/12">
          {HELP.map((h) => (
            <div key={h.title} className="py-5">
              <dt className="font-display text-xl font-semibold text-goldenrod">{h.title}</dt>
              <dd className="mt-1 text-[#cfe0d7]">{h.body}</dd>
            </div>
          ))}
          {SITE.creditHelp.affiliateLinks.length > 0 && (
            <div className="py-5">
              <dt className="font-semibold text-white">Tools that help build credit</dt>
              <dd className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                {SITE.creditHelp.affiliateLinks.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer noopener sponsored" className="underline underline-offset-4 decoration-goldenrod hover:text-white">
                    {l.label}
                  </a>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  )
}
