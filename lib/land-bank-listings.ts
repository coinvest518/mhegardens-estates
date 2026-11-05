import "server-only"
import { unstable_cache } from "next/cache"
import { parseLandBankPdf, type LandBankListing } from "@/lib/land-bank-parse"
import { LAND_BANK } from "@/lib/land-bank"

export type { LandBankListing }

export type LandBankList = {
  /** e.g. "November 2026" */
  cycle: string | null
  /** The Land Bank's own PDF for this month, for "see the official list". */
  pdfUrl: string | null
  fetchedAt: string
  listings: LandBankListing[]
}

/** Teaser for a property a signed-out visitor can't see yet: no address or parcel ID. */
export type LandBankTeaser = Pick<LandBankListing, "neighborhood" | "city" | "price" | "acres" | "kind" | "packageSize"> & {
  key: string
}

/** Properties shown to everyone. The rest need a free account. */
export const PUBLIC_LISTING_COUNT = 3

const UA = "MHEGardensListings/1.0 (+https://www.mhegardens.xyz)"

async function fetchList(): Promise<LandBankList> {
  const page = await fetch(LAND_BANK.links.forSaleList, {
    headers: { "user-agent": UA },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  })
  if (!page.ok) throw new Error(`list page ${page.status}`)
  const html = await page.text()
  const href = html.match(/href="([^"]*for-sale-list[^"]*\.pdf)"/i)?.[1]
  if (!href) throw new Error("no PDF link on the list page")
  const pdfUrl = new URL(href.replace(/&amp;/g, "&"), LAND_BANK.links.forSaleList).toString()

  const res = await fetch(pdfUrl, { headers: { "user-agent": UA }, cache: "no-store", signal: AbortSignal.timeout(12000) })
  if (!res.ok) throw new Error(`list PDF ${res.status}`)
  const { cycle, listings } = await parseLandBankPdf(new Uint8Array(await res.arrayBuffer()))
  if (!listings.length) throw new Error("no rows found in the list PDF")
  return { cycle, pdfUrl, fetchedAt: new Date().toISOString(), listings }
}

// Cached for 6 hours. A failed read throws, so it isn't cached and the next visit tries again.
const cachedList = unstable_cache(fetchList, ["land-bank-list-v1"], { revalidate: 6 * 3600, tags: ["land-bank"] })

/** This month's Land Bank list, or an empty list (with the official page as a fallback link) if it can't be read. */
export async function getLandBankList(): Promise<LandBankList> {
  try {
    return await cachedList()
  } catch (err) {
    console.error("[land-bank] couldn't read the For Sale List:", String(err))
    return { cycle: null, pdfUrl: null, fetchedAt: new Date().toISOString(), listings: [] }
  }
}

/** Cheapest first; among equal prices, bigger lots first. */
export function sortByValue(listings: LandBankListing[]): LandBankListing[] {
  return [...listings].sort((a, b) => (a.price ?? 1e12) - (b.price ?? 1e12) || (b.acres ?? 0) - (a.acres ?? 0))
}

export function splitForVisitors(list: LandBankList) {
  const sorted = sortByValue(list.listings)
  const open = sorted.slice(0, PUBLIC_LISTING_COUNT)
  const locked = sorted.slice(PUBLIC_LISTING_COUNT)
  const teasers: LandBankTeaser[] = locked.map((l, i) => ({
    key: `t${i}`,
    neighborhood: l.neighborhood,
    city: l.city,
    price: l.price,
    acres: l.acres,
    kind: l.kind,
    packageSize: l.packageSize,
  }))
  return { open, lockedCount: locked.length, teasers }
}

export function summarize(list: LandBankList) {
  const prices = list.listings.map((l) => l.price).filter((p): p is number => p !== null)
  const count = (k: LandBankListing["kind"]) => list.listings.filter((l) => l.kind === k).length
  return {
    total: list.listings.length,
    lots: count("lot"),
    buildings: count("building"),
    commercial: count("commercial"),
    minPrice: prices.length ? Math.min(...prices) : null,
    maxPrice: prices.length ? Math.max(...prices) : null,
    cities: [...new Set(list.listings.map((l) => l.city).filter(Boolean))],
  }
}
