import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { SiteFooter } from "@/components/site-footer"
import { AuctionHub } from "@/components/auction-hub"
import { AUCTION_EVENTS } from "@/lib/auctions"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: `Tax Auctions in Upstate NY — ${SITE.name}`,
  description:
    "Upcoming county tax-foreclosure auctions in Upstate New York, how to register, and what to check before you bid.",
}

// Rebuild this page once a day so closed auctions drop off on their own.
export const revalidate = 86400

export default function AuctionsPage() {
  const now = Date.now()
  const upcoming = AUCTION_EVENTS.filter((e) => {
    const closes = new Date(e.closeDate).getTime()
    return Number.isNaN(closes) || closes >= now
  }).sort((a, b) => new Date(a.openDate).getTime() - new Date(b.openDate).getTime())

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="relative">
        <AuctionHub upcoming={upcoming} />
      </main>
      <SiteFooter />
    </div>
  )
}
