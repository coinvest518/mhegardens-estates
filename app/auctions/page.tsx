import type { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { SiteFooter } from "@/components/site-footer"
import { AuctionHub } from "@/components/auction-hub"
import { AuctionMembers } from "@/components/auction-members"
import { getUpcomingAuctions } from "@/lib/auctions"
import { SOURCES } from "@/lib/sources"
import { formatDeadline, landBankDeadline } from "@/lib/land-bank"
import { getLandBankList, splitForVisitors, summarize } from "@/lib/land-bank-listings"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: `Land Bank and Tax Auctions in Upstate NY — ${SITE.name}`,
  description:
    "This month's Albany County Land Bank list, upcoming county tax-foreclosure auctions in Upstate New York, how to register, and what to check before you bid.",
}

// Rebuild every 6 hours so closed auctions drop off and the new land bank list shows up.
export const revalidate = 21600

async function LandBankFeature() {
  const list = await getLandBankList()
  const stats = summarize(list)
  const { open } = splitForVisitors(list)
  const deadline = landBankDeadline(list.cycle)
  const isOpen = new Date() <= deadline

  return (
    <section className="mb-16 grid gap-8 rounded-2xl border border-border bg-white p-6 md:grid-cols-[1.1fr_1fr] md:p-9" aria-labelledby="lb" data-testid="auctions-land-bank">
      <div>
        <p className="text-sm font-semibold text-leaf">No bidding — you apply</p>
        <h2 id="lb" className="mt-1 text-2xl font-bold text-pine md:text-3xl">
          Albany County Land Bank{list.cycle ? `: ${list.cycle} list` : ""}
        </h2>
        <p className="mt-3 text-ink text-pretty">
          {stats.total > 0
            ? `${stats.total} properties${stats.minPrice !== null ? `, lots from $${stats.minPrice.toLocaleString("en-US")}` : ""}. `
            : "A new list of vacant lots and houses posts on the first business day of each month. "}
          {stats.total > 0 && (isOpen ? `Apply by ${formatDeadline(deadline)}.` : "Applications for this list have closed.")}
        </p>
        <p className="mt-2 text-slate text-pretty">
          The Land Bank picks buyers by their plan and their money, not the highest bid. You view the property, send an
          application with a budget and proof of funds, and the Board decides.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/land-bank#list" className="inline-flex items-center justify-center rounded-xl bg-leaf px-5 py-3 font-semibold text-white hover:bg-pine">
            See the list
          </Link>
          <Link href="/land-bank#apply" className="inline-flex items-center justify-center rounded-xl border border-leaf px-5 py-3 font-semibold text-leaf hover:bg-mist">
            How to apply
          </Link>
        </div>
        <p className="mt-5 text-[15px] text-slate">
          Not sure which way fits?{" "}
          <Link href="/learn/auction-vs-land-bank-vs-listing" className="font-semibold text-leaf underline underline-offset-4">
            Compare auctions, the land bank and regular sales
          </Link>
        </p>
      </div>
      {open.length > 0 && (
        <div>
          <p className="font-semibold text-ink">Lowest-priced right now</p>
          <ul className="mt-2">
            {open.map((l) => (
              <li key={l.parcelId} className="flex items-baseline justify-between gap-4 border-t border-border py-3">
                <span className="min-w-0">
                  <span className="block font-semibold text-ink">{l.address}</span>
                  <span className="block text-sm text-slate">
                    {l.neighborhood && l.neighborhood !== l.city ? `${l.neighborhood}, ${l.city}` : l.city}
                    {l.acres ? `, ${l.acres} acres` : ""}
                  </span>
                </span>
                <span className="font-display text-xl font-bold text-pine">
                  {l.price !== null ? `$${l.price.toLocaleString("en-US")}` : "Ask"}
                </span>
              </li>
            ))}
          </ul>
          <Link href="/land-bank#list" className="mt-2 inline-block text-sm font-semibold text-leaf underline underline-offset-4">
            {stats.total - open.length} more with a free account
          </Link>
        </div>
      )}
    </section>
  )
}

export default function AuctionsPage() {
  const upcoming = getUpcomingAuctions()
  const [featured = null, ...rest] = upcoming
  // Only which auction and when goes to the browser for the locked ones.
  const teasers = rest.map(({ id, title, county, eventType, openDate, closeDate }) => ({ id, title, county, eventType, openDate, closeDate }))

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="relative">
        <AuctionHub
          featured={featured}
          upcomingCount={upcoming.length}
          landBank={<LandBankFeature />}
          members={<AuctionMembers teasers={teasers} sourceCount={SOURCES.length} />}
        />
      </main>
      <SiteFooter />
    </div>
  )
}
