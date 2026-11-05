import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AuctionEvent } from "@/lib/auction-types"

/** Everything about one auction: dates, registration, promo code and links. */
export function AuctionEventCard({ event }: { event: AuctionEvent }) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-leaf">{event.county}</p>
            <CardTitle className="text-xl mt-1.5">{event.title}</CardTitle>
          </div>
          <Badge className="bg-primary/10 text-primary border border-primary/20 self-start">{event.eventType}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-5 text-sm">
        <div className="space-y-1.5 text-muted-foreground">
          <p><span className="font-semibold text-foreground">Opens:</span> {event.openDate}</p>
          <p><span className="font-semibold text-foreground">Closes:</span> {event.closeDate}</p>
          <p><span className="font-semibold text-foreground">Register by:</span> {event.registrationDue}</p>
        </div>
        <div className="space-y-1.5">
          <a href={event.registrationUrl} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1.5 font-semibold text-primary">
            Create a bidder account <ArrowRight className="h-4 w-4" />
          </a>
          {event.promoCode && (
            <p className="text-muted-foreground">
              Promo code <span className="rounded bg-mist px-1.5 py-0.5 font-mono font-semibold text-ink">{event.promoCode}</span> skips the one-time $10
              bidder fee
            </p>
          )}
          {event.packetEsignUrl && (
            <a href={event.packetEsignUrl} target="_blank" rel="noreferrer noopener" className="flex items-center gap-1.5 font-semibold text-primary">
              Request the e-sign packet <ArrowRight className="h-4 w-4" />
            </a>
          )}
          {event.packetDownloadUrl && (
            <a href={event.packetDownloadUrl} target="_blank" rel="noreferrer noopener" className="flex items-center gap-1.5 font-semibold text-primary">
              Download the printable packet <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>
        <div className="space-y-2">
          {event.auctionUrl && (
            <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto">
              <a href={event.auctionUrl} target="_blank" rel="noreferrer noopener">See the properties</a>
            </Button>
          )}
          <p className="text-xs text-muted-foreground text-pretty">
            {event.notes ? `${event.notes} ` : ""}Dates can change — confirm on Auctions International before registering.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
