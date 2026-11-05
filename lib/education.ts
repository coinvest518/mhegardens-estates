/**
 * The guides store. Two products live on Buy Me a Coffee (streets2entrepreneurs); one free PDF is on this site.
 * Titles, prices and contents match the Buy Me a Coffee listings (checked Nov 5, 2026).
 */

export const STORE_URL = "https://buymeacoffee.com/streets2entrepreneurs"

export type Product = {
  id: string
  title: string
  /** Short line under the title. */
  subtitle: string
  format: string
  /** 0 = free. */
  priceUSD: number
  priceNote?: string
  href: string
  cta: string
  external: boolean
  /** Product art. Without one, the store draws a cover from the title. */
  cover?: { src: string; width: number; height: number; alt: string }
  summary: string
  includes?: { title: string; summary: string }[]
  points: string[]
}

export const PRODUCTS: Product[] = [
  {
    id: "land-success-bundle",
    title: "Land & Real Estate Success Bundle",
    subtitle: "Three ebooks on buying land and building wealth without banks",
    format: "3 ebooks, instant download",
    priceUSD: 20,
    href: "https://buymeacoffee.com/streets2entrepreneurs/e/454280",
    cta: "Get the bundle",
    external: true,
    cover: {
      src: "https://cdn.buymeacoffee.com/uploads/rewards/2025-09-06/1/033538_Orange_Business_eBook_Digital_Product_Mockup_Instagram_Post.png@1200w_0e.png",
      width: 1200,
      height: 1200,
      alt: "The three ebooks in the Land & Real Estate Success Bundle",
    },
    summary:
      "For new investors, nonprofit founders and entrepreneurs who want to get into land and real estate with little money up front. Each ebook comes with checklists, sample scripts and deal structures.",
    includes: [
      {
        title: "Land Investing 101: From Vacant Lots to Profitable Assets",
        summary: "Finding undervalued and tax-delinquent land, seller financing, and a due diligence checklist for zoning, surveys and utilities.",
      },
      {
        title: "Real Estate Power Moves: Building Wealth Without Banks",
        summary: "Creative financing like taking over back taxes and lease options, grants for nonprofit projects, and income from tiny homes, farming and retreats.",
      },
      {
        title: "The Investor's Blueprint: Community, Cash Flow & Legacy",
        summary: "Pairing profit with community purpose, nonprofit and for-profit deal structures, and eco-friendly income projects.",
      },
    ],
    points: ["Checklists, scripts and deal structures in every book", "Instant digital download"],
  },
  {
    id: "wholesaling-ebook",
    title: "Wholesaling Real Estate",
    subtitle: "A free beginner's guide, with contract templates",
    format: "Ebook, instant download",
    priceUSD: 0,
    priceNote: "Free, or pay what you want",
    href: "https://buymeacoffee.com/streets2entrepreneurs/e/508592",
    cta: "Get it free",
    external: true,
    cover: {
      src: "https://cdn.buymeacoffee.com/uploads/rewards/2026-02-09/1/140155_aa4107f09faa46ac96e0ef82d715366c.png@1200w_0e.png",
      width: 1200,
      height: 1800,
      alt: "Cover of the free Wholesaling Real Estate ebook",
    },
    summary:
      "How to work in real estate without buying houses, taking loans or risking your own money — in plain words, no guru course.",
    points: [
      "Find motivated sellers with free tools",
      "Lock up a deal without buying the property",
      "How contracts work, and how to assign a deal and get paid",
      "Beginner contract templates and sample wholesaler agreements",
    ],
  },
  {
    id: "homeownership-programs",
    title: "Unlocking Affordable Homeownership",
    subtitle: "Government programs and low down payment options",
    format: "14-page PDF",
    priceUSD: 0,
    href: "/pdfs/buy-a-home-programs.pdf",
    cta: "Download the free PDF",
    external: false,
    summary:
      "A practical guide to the programs that help first-time buyers into a home with very little down, and where to find homes and land through them.",
    points: [
      "The basics of affordable home buying",
      "Single-family, multifamily and land sources",
      "Loan programs worth knowing, plus a quick reference directory",
    ],
  },
]

const bundle = PRODUCTS[0]

/** The paid bundle, for links around the site. */
export const BUNDLE = {
  id: bundle.id,
  title: bundle.title,
  priceUSD: bundle.priceUSD,
  buyLink: bundle.href,
}
