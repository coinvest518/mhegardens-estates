import Link from "next/link"
import { ArrowRight, CalendarDays, ExternalLink, Gavel, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuctionEventCard } from "@/components/auction-event-card"
import type { AuctionEvent } from "@/lib/auction-types"
import { SITE } from "@/lib/site"

const BASICS = [
  {
    title: "No credit check",
    description: "County tax auctions don't look at your credit. You need a bidder account, a registration packet, and the money ready.",
  },
  {
    title: "No real estate license",
    description: "Most tax-foreclosure auctions are open to the public.",
  },
  {
    title: "Register early",
    description: "Each auction has its own packet and deadline — usually a couple of days before bidding closes. Late packets aren't accepted.",
  },
  {
    title: "Research before you bid",
    description: "Check zoning, access, utilities and title risk using county property records before you place a bid.",
  },
]

const STEPS = [
  "Create a bidder account on the auction site (a card is used to verify your identity).",
  "Request or download that auction's registration packet and return it before the deadline.",
  "Research the parcels you like and set your top price before bidding opens.",
  "Bid online, and have your deposit and payment ready if you win.",
]

export function AuctionHub({
  featured,
  upcomingCount,
  landBank,
  members,
}: {
  featured: AuctionEvent | null
  upcomingCount: number
  landBank?: React.ReactNode
  /** The rest of the auctions, locked until sign-in. */
  members?: React.ReactNode
}) {
  return (
    <section className="pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-pine mb-5 text-balance">
            Land bank and tax auctions in Upstate New York
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Two ways to buy tax-foreclosed land and houses for less: apply to the Albany County Land Bank, or bid at a
            county auction. Here&apos;s this month&apos;s land bank list, the auctions coming up, and how to get ready.
          </p>
        </div>

        {landBank}

        {/* Upcoming auctions */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <h2 className="text-2xl font-bold text-pine">Upcoming auctions</h2>
            <a
              href={SITE.auctionsInternationalUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80"
            >
              All live auctions on Auctions International <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {upcomingCount === 0 ? (
            <Card className="border-dashed border-border bg-card">
              <CardContent className="py-10 text-center space-y-3">
                <CalendarDays className="h-8 w-8 text-primary mx-auto" />
                <p className="font-semibold text-foreground">No upcoming auctions listed right now.</p>
                <p className="text-sm text-muted-foreground max-w-xl mx-auto text-pretty">
                  Most Upstate county auctions run from spring through fall. Book a free call and we&apos;ll tell you
                  when the next ones open — and help you get registered in time.
                </p>
                <Button asChild>
                  <Link href="/#contact-auction">Tell me when the next ones open</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5">
              {featured && (
                <div data-testid="auction-featured">
                  <p className="mb-2 text-sm font-semibold text-ink">Closing next</p>
                  <AuctionEventCard event={featured} />
                </div>
              )}
              {members}
            </div>
          )}
        </div>

        {/* Basics + how to register */}
        <div className="grid lg:grid-cols-2 gap-6 mb-16">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">The basics</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {BASICS.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground text-pretty">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">How to register for an online auction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <ol className="space-y-3">
                {STEPS.map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-pretty">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="text-sm text-muted-foreground text-pretty">
                What it really costs, and the mistakes to avoid:{" "}
                <Link href="/learn/online-tax-auctions" className="font-semibold text-leaf underline underline-offset-4">
                  read the step-by-step lesson
                </Link>
                . Want someone to walk you through it? We help with registration, research and bidding plans.
              </p>
              <Button asChild className="w-full">
                <Link href="/#contact-auction">
                  <Gavel className="mr-2 h-4 w-4" /> Get help with an auction
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
