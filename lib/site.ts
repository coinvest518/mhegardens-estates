/**
 * One place for the site's name, contact details and outside links.
 * Links set to null are placeholders. Until they're added, the qualifier's
 * results screen says "we'll call you" instead of showing a booking button.
 */
export const SITE = {
  name: "MHE Gardens",
  tagline: "Land and homes in Upstate New York — the regular way or the auction way.",
  url: "https://www.mhegardens.com",
  email: "mhegardens518@gmail.com",
  region: "Upstate New York",

  /** cal.com 30-minute consultation link, shown on qualifier results. TODO: add it. */
  consultBookingUrl: null as string | null,

  agent: {
    name: "Ruth Dorval",
    company: "Open Doors LLC",
    languages: "English and Haitian Creole",
    /** TODO: Ruth's cal.com link for buyer/seller consults. */
    bookingUrl: null as string | null,
  },

  creditHelp: {
    /** TODO: cal.com link for credit repair calls. */
    bookingUrl: null as string | null,
    /** TODO: affiliate product links for credit building tools. */
    affiliateLinks: [] as { label: string; href: string }[],
  },

  auctionsInternationalUrl: "https://www.auctionsinternational.com/liveauctions/",
} as const

/** Every "book a consultation" button links here; the qualifier popup intercepts it. */
export const CONSULT_HREF = "/#consult"

/** Where consult buttons point. Always the qualifier — booking links appear on its results screen. */
export function consultHref(): string {
  return CONSULT_HREF
}
