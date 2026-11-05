import "server-only"

/** The sites we check for deals. Members only — it's part of what a free account unlocks. */
export type Source = { name: string; href: string; what: string; group: "Auctions" | "Land bank" | "Foreclosed homes" }

export const SOURCES: Source[] = [
  {
    name: "Auctions International — Real Estate",
    href: "https://www.auctionsinternational.com",
    what: "Where most Upstate county and city tax foreclosure auctions run. New events show up under Real Estate.",
    group: "Auctions",
  },
  {
    name: "Albany County's auction page",
    href: "https://www.AlbanyCoAuction.com",
    what: "Shortcut to Albany County's current tax foreclosure auction, property list and terms.",
    group: "Auctions",
  },
  {
    name: "AuctionZip",
    href: "https://www.auctionzip.com",
    what: "Search “tax foreclosed” near Albany to see county auctions coming up, with dates.",
    group: "Auctions",
  },
  {
    name: "Erie County tax foreclosure sales",
    href: "https://www3.erie.gov/ecrpts",
    what: "Erie County's in-person auction in Buffalo. Property lists post ahead of the sale.",
    group: "Auctions",
  },
  {
    name: "Albany County Land Bank — For Sale List",
    href: "https://www.albanycountylandbank.org/for-sale-list",
    what: "New list the first business day of every month. We read it for you on our Land Bank page.",
    group: "Land bank",
  },
  {
    name: "Albany County Land Bank — Lots for Less",
    href: "https://www.albanycountylandbank.org/lotsforless",
    what: "Vacant lots you can apply for any time, not just by the monthly deadline.",
    group: "Land bank",
  },
  {
    name: "HUD Homes",
    href: "https://www.hudhomestore.gov",
    what: "Homes from FHA foreclosures. People who'll live in the home get first chance to bid.",
    group: "Foreclosed homes",
  },
  {
    name: "Fannie Mae HomePath",
    href: "https://www.homepath.fanniemae.com",
    what: "Fannie Mae-owned homes, with a first look for buyers who'll live there.",
    group: "Foreclosed homes",
  },
]
