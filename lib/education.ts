export type Guide = {
  id: string
  title: string
  summary: string
  takeaways: string[]
  pdfPath?: string
  pages?: number
  gated?: boolean
  inBundle?: boolean
}

export const BUYME_LINK = "https://buymeacoffee.com/Daniel22"

export const GUIDES: Guide[] = [
  {
    id: "tax-deeds",
    title: "Tax Deeds: How counties sell title outright",
    summary:
      "When property owners go years without paying their taxes, the county takes title and sells the deed at auction. This guide walks through the difference between liens and deeds, how the redemption period works, and what you actually walk away with after the gavel drops.",
    takeaways: [
      "When a county uses lien certificates vs. selling the deed outright",
      "Redemption-period rules — how long the prior owner has to reclaim",
      "Clearing title after sale: quiet-title actions, title insurance, and timing",
    ],
    pages: 24,
    gated: true,
    inBundle: true,
  },
  {
    id: "buying-land-under-1000",
    title: "Buying Land for Under $1,000",
    summary:
      "Real walkthrough of the auctions where parcels still go for triple-digits. Where to find them, how to read a parcel list, and the due-diligence checklist that separates a $0 lot from a $5K lot.",
    takeaways: [
      "Where these auctions actually happen — county sites, surplus lists, and aggregators",
      "What makes a lot worth $0 vs. worth $5K (zoning, utilities, access)",
      "Pre-bid due diligence checklist — the 6 things to verify before you raise the paddle",
    ],
    pages: 32,
    gated: true,
    inBundle: true,
  },
  {
    id: "buy-a-home-programs",
    title: "Buy a Home with These Free Programs",
    summary:
      "A practical guide to state and federal programs designed to put first-time buyers into a home with very little down — and how to stack them with other strategies.",
    takeaways: [
      "State and federal first-time-buyer programs worth knowing",
      "Income caps and household-size rules — who actually qualifies",
      "How to combine buyer assistance with low-cost land strategies",
    ],
    pdfPath: "/pdfs/buy-a-home-programs.pdf",
    pages: 18,
    gated: false,
    inBundle: false,
  },
  {
    id: "wholesaler-contract-pack",
    title: "Wholesaler Contract Pack",
    summary:
      "Assignment-of-contract setup, disclosures, and sample language to structure a flip with no money down.",
    takeaways: [
      "What 'assignment of contract' actually means and when it's enforceable",
      "Structuring a no-money-down flip — escrow, EMD, and assignment fees",
      "Legal disclosures by state — when you have to disclose your role as wholesaler",
    ],
    pages: 26,
    gated: true,
    inBundle: true,
  },
]

export const BUNDLE = {
  id: "land-success-bundle",
  title: "Land & Real Estate Success Bundle (3-ebook package)",
  priceUSD: 20,
  includes: GUIDES.filter((g) => g.inBundle).map((g) => g.id),
  buyLink: BUYME_LINK,
}

export default GUIDES
