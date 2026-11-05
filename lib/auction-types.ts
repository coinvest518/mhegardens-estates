/** One county or city tax foreclosure auction. Client-safe type; the data lives in lib/auctions.ts (server only). */
export interface AuctionEvent {
  id: string
  title: string
  county: string
  eventType: string
  openDate: string
  closeDate: string
  registrationDue: string
  auctionUrl?: string
  registrationUrl: string
  promoCode?: string
  packetEsignUrl?: string
  packetDownloadUrl?: string
  absenteeUrl?: string
  propertyListUrl?: string
  termsUrl?: string
  catalogUrl?: string
  leadPaintUrl?: string
  fairHousingUrl?: string
  faqUrl?: string
  notes?: string
}

/** What visitors see before signing in: which auction and when, not the how. */
export type AuctionTeaser = Pick<AuctionEvent, "id" | "title" | "county" | "eventType" | "openDate" | "closeDate">
