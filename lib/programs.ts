import "server-only"
import type { Program, ProgramTeaser } from "@/lib/program-types"

/** Date the programs below were last checked against each program's own site. Update when you re-check. */
export const CHECKED_ON = "2026-11-05"

/** Programs shown in full to everyone. The rest need a free account. */
export const PUBLIC_PROGRAM_IDS = ["hdp", "five-star-savings-club"] as const

/** A program whose status flips on a date (e.g. a funding round closing). */
type Scheduled = Program & { after?: { at: string; status: Program["status"]; statusNote: string } }

const PROGRAMS: Scheduled[] = [
  {
    id: "hdp",
    section: "grant",
    name: "Homebuyer Dream Program (HDP)",
    org: "Federal Home Loan Bank of New York, through participating lenders",
    kind: "Grant",
    amount: "Up to $30,000",
    amountNote: "Can stack up to $60,000 with HDP Plus and Wealth Builder",
    area: "New York State",
    status: "open",
    statusNote:
      "The 2026 round is open until Nov 27, 2026 at 5 PM ET, or until the money runs out. Each lender has its own share, and some have already run out.",
    after: {
      at: "2026-11-27T22:00:00Z",
      status: "closed",
      statusNote: "The 2026 round has closed. The 2027 round opens Feb 8, 2027.",
    },
    summary:
      "The biggest grant on this list. Each lender sets its own amount — Sunmark and Five Star advertise up to $15,000, Family First from $20,000. HDP Plus reaches incomes up to 120% of area median, and Wealth Builder is for first-generation buyers.",
    eligibility: [
      "First-time homebuyer",
      "At least $1,000 of your own money in the purchase",
      "Finish a homebuyer counseling course",
      "Keep the home as your main home for 5 years",
      "Income limit in the Albany area: about $92,880 for a 1–2 person household",
    ],
    howToApply:
      "There's no direct application. Get your mortgage through a participating lender — they reserve the grant when your loan is approved. Call a few and ask if they still have 2026 HDP money.",
    links: [
      { label: "Participating lenders", href: "https://www.fhlbny.com/community/housing-programs/hdp-suite/participating-members" },
      { label: "Program details", href: "https://www.fhlbny.com/community/housing-programs/" },
    ],
  },
  {
    id: "five-star-savings-club",
    section: "match",
    name: "Home Savings Club",
    org: "Five Star Bank",
    kind: "Matched savings",
    amount: "Up to $3,000",
    amountNote: "$3 for every $1 you save",
    area: "New York State",
    status: "open",
    statusNote: "Live on Five Star's site with no end date posted. The bank can change it without notice.",
    summary:
      "Save in a dedicated account and the bank adds $3 for every $1 you save, paid as a credit at closing. It takes $25 to open the account.",
    eligibility: [
      "First-time homebuyer",
      "Household income at or under 80% of area median",
      "New York resident",
      "Save for at least 10 months and reach your goal within 24 months",
    ],
    howToApply: "Enroll through a Five Star Bank mortgage originator.",
    links: [{ label: "Program page", href: "https://www.five-starbank.com/home-savings-club" }],
  },
  {
    id: "ahp-matched-savings",
    section: "match",
    name: "Albany Matched Savings Program",
    org: "Affordable Housing Partnership (AHP), 255 Orange St, Albany",
    phone: "(518) 434-1730",
    kind: "Matched savings",
    amount: "Up to $1,500",
    amountNote: "$3 for every $1 you save",
    area: "City of Albany",
    status: "check",
    statusNote:
      "AHP's page says enrollment ended in June 2026 and hasn't been updated since. Call and ask if a new round is open before counting on it.",
    summary:
      "Save for 6 to 10 months and AHP matches $3 for every $1 — save $500, get $1,500. The match can build your down payment or pay off collections and credit cards.",
    eligibility: [
      "Live in the City of Albany",
      "First-time homebuyer",
      "Income under 100% of area median (about $116,125 for a household of 4)",
    ],
    howToApply:
      "Take AHP's free Homebuyer 101 class (first Tuesday of each month, online at 5:30 PM), then meet with a housing advisor.",
    links: [{ label: "Program page", href: "https://www.ahphome.org/news/albany-matched-savings-program" }],
  },
  {
    id: "sonyma-dpal",
    section: "grant",
    name: "SONYMA Down Payment Assistance Loan (DPAL and DPAL Plus)",
    org: "State of New York Mortgage Agency (SONYMA)",
    kind: "Forgivable loan",
    amount: "Up to $15,000",
    amountNote: "DPAL Plus: up to $30,000 for incomes at or under 60% of area median",
    area: "New York State",
    status: "open",
    statusNote:
      "Regular DPAL is ongoing. DPAL Plus has a limited pot ($7.5 million) and is first come, first served — move fast.",
    summary:
      "A 0% loan with no monthly payments, forgiven over 10 years. Regular DPAL is the higher of 3% of the price or $3,000, up to $15,000. It adds 0.40% to your SONYMA mortgage rate.",
    eligibility: [
      "Use a SONYMA first mortgage",
      "Put in at least 1% of the price in your own cash",
      "Finish homebuyer education before approval",
    ],
    howToApply: "Apply only through a SONYMA participating lender, together with the SONYMA mortgage.",
    links: [
      { label: "DPAL Plus 2026 terms (PDF)", href: "https://hcr.ny.gov/system/files/documents/2026/06/dpal-plus-2026-termsheet-final.pdf" },
      { label: "NY Homes and Community Renewal", href: "https://hcr.ny.gov" },
    ],
  },
  {
    id: "albany-hap",
    section: "grant",
    name: "Home Acquisition Program (HAP)",
    org: "City of Albany — Albany Community Development Agency (ACDA)",
    phone: "(518) 434-5265",
    kind: "Deferred loan",
    amount: "Up to $14,900",
    area: "City of Albany",
    status: "check",
    statusNote:
      "The program is live, but its federal money is limited and first come, first served. Call ACDA to confirm funds before relying on it.",
    summary:
      "Helps with the down payment and closing costs on a 1–4 unit home in the City of Albany. Forgiven over 5 years.",
    eligibility: [
      "Income under 80% of area median",
      "Assets under $40,000",
      "Homebuyer counseling",
      "Apply at least 45 days before closing",
    ],
    links: [
      { label: "Application and guidelines", href: "https://www.albanyny.gov/748/Home-Improvement-Programs" },
      { label: "Guidelines (PDF)", href: "https://www.albanyny.gov/DocumentCenter/View/14266/HAP-Guidelines-3182026-PDF" },
    ],
  },
  {
    id: "rhjf",
    section: "grant",
    name: "Reparative Housing Justice Fund (RHJF)",
    org: "Touhey Foundation, through AHP",
    phone: "(518) 434-1730 x401",
    email: "staff@ahphome.org",
    kind: "Grant",
    amount: "Up to $10,000",
    amountNote: "$5,000 in Cohoes, Rensselaer, Schenectady, Troy, Watervliet, Amsterdam and Green Island",
    area: "Albany and nearby cities",
    status: "check",
    statusNote: "The application is current (August 2025). The remaining balance isn't published — ask AHP.",
    summary: "A grant for Black first-time homebuyers: up to $10,000 when buying in Albany, $5,000 in nearby cities.",
    eligibility: [
      "Black first-time homebuyer",
      "Liquid assets under $40,000",
      "ID, a mortgage pre-approval letter and a loan estimate for a conditional award",
    ],
    howToApply: "Bring your documents to an AHP advisor at 255 Orange St, Albany.",
    links: [
      {
        label: "Application (PDF)",
        href: "https://static1.squarespace.com/static/61cb345fc5811d2e3d886a89/t/68a093ef30845d622c85ac49/1755354095940/RHJF+Application+8.16.25.pdf",
      },
    ],
  },
  {
    id: "acrha-acq-rehab",
    section: "grant",
    name: "Acquisition/Rehabilitation Grant",
    org: "Albany County Rural Housing Alliance (ACRHA), Voorheesville",
    phone: "(518) 765-2425",
    kind: "Forgivable grant",
    amount: "Up to $40,000",
    amountNote: "51% goes to repairs, 49% to down payment and closing costs",
    area: "Albany County",
    status: "check",
    statusNote: "Funded in rounds that run out and refill. Call to ask if spots are open now.",
    summary: "The largest single grant here, for a home that needs work — at least half goes to repairs.",
    eligibility: [
      "Buying anywhere in Albany County",
      "Put in at least $1,500 of your own",
      "Homebuyer education course and mortgage pre-qualification",
      "10-year note — you stay in the home",
    ],
    links: [
      { label: "Program listing", href: "https://www.homesavecapitalregion.org/down-payment-programs.html" },
      { label: "ACRHA", href: "https://acrha.org" },
    ],
  },
  {
    id: "troy-rensselaer",
    section: "grant",
    name: "Troy Homeownership Incentive Program (HIP) and Rensselaer County Homebuyer Program",
    org: "TRIP HomeOwnership Center",
    phone: "(518) 690-0020",
    kind: "Grant",
    amount: "$15,000–$20,000",
    amountNote: "In Troy. Elsewhere in Rensselaer County, up to $20,000–$35,000. Some 2026 listings show higher Troy amounts.",
    area: "Troy and Rensselaer County",
    status: "check",
    statusNote: "The county program is subject to availability. Call TRIP for current amounts.",
    summary: "Grants for buying a 1–2 family home in Troy, or a home elsewhere in Rensselaer County.",
    eligibility: [
      "Income under 80% of area median",
      "Show $1,500 in savings",
      "TRIP pre-purchase course",
      "10-year lien — you stay in the home",
    ],
    links: [
      { label: "City of Troy programs", href: "https://www.troyny.gov/199/Programs-Grants" },
      { label: "TRIP down payment help", href: "https://www.triponline.org/down-payment-assistance" },
    ],
  },
  {
    id: "habitat-capital-district",
    section: "closed",
    name: "Habitat for Humanity Capital District",
    org: "207 Sheridan Ave, Albany",
    phone: "(518) 462-2993",
    email: "homes@habitatcd.org",
    kind: "Affordable home purchase",
    amount: "30% of income",
    amountNote: "Your mortgage payment stays at or under 30% of your income",
    area: "Albany and Troy",
    status: "closed",
    statusNote: "No application cycle is open right now. Applications open only when construction starts on the next homes.",
    summary:
      "Habitat builds and fixes up homes and sells them to first-time buyers with an affordable mortgage. It's building now in Sheridan Hollow, the South End and North Central Troy.",
    eligibility: [
      "First-time buyer (no home owned in the last 3 years)",
      "Income 50–80% of area median",
      "Lived or worked in Albany, Rensselaer or southern Saratoga County for at least a year",
      "$1,000 saved by the deadline, a homebuyer education certificate, a lender pre-qualification letter and sweat equity",
    ],
    howToApply:
      "Email homes@habitatcd.org to get on the notification list. When a cycle opens, apply online, by mail or in person at 207 Sheridan Ave — not by email or fax.",
    links: [
      { label: "Application process", href: "https://www.habitatcd.org/application-process" },
      { label: "Requirements", href: "https://www.habitatcd.org/program-requirements" },
    ],
  },
  {
    id: "buyers-choice",
    section: "closed",
    name: "Buyer's Choice Program",
    org: "Albany Community Land Trust, through AHP",
    phone: "(518) 426-1296",
    kind: "Down payment and repairs",
    amount: "Up to $40,000",
    amountNote: "Up to $20,000 for the down payment plus up to $20,000 for repairs",
    area: "City of Albany",
    status: "closed",
    statusNote: "Out of funds. Call the land trust to ask about future rounds.",
    summary:
      "Up to $20,000 toward the down payment plus up to $20,000 for repairs on a one-family home in the City of Albany.",
    eligibility: ["One-family home in the City of Albany"],
    links: [],
  },
  {
    id: "first-home-club",
    section: "closed",
    name: "First Home Club",
    org: "Federal Home Loan Bank of New York",
    kind: "Matched savings",
    amount: "Retired",
    amountNote: "Was a 4-to-1 savings match up to $7,500",
    area: "New York State",
    status: "closed",
    statusNote: "Replaced by the Homebuyer Dream Program. Some sites still describe it — don't plan around it.",
    summary: "The original 4-to-1 savings match. It was retired in favor of the Homebuyer Dream grants above.",
    eligibility: [],
    links: [],
  },
]

/** Every program with its status as of `now` (rounds that have closed flip automatically). */
export function getPrograms(now = new Date()): Program[] {
  return PROGRAMS.map(({ after, ...p }) =>
    after && now >= new Date(after.at) ? { ...p, status: after.status, statusNote: after.statusNote } : p
  )
}

export function getPublicPrograms(now = new Date()): Program[] {
  const ids: readonly string[] = PUBLIC_PROGRAM_IDS
  return getPrograms(now).filter((p) => ids.includes(p.id))
}

/** Programs that need an account, in full. Only send these to signed-in users. */
export function getMemberPrograms(now = new Date()): Program[] {
  const ids: readonly string[] = PUBLIC_PROGRAM_IDS
  return getPrograms(now).filter((p) => !ids.includes(p.id))
}

export function getMemberTeasers(now = new Date()): ProgramTeaser[] {
  return getMemberPrograms(now).map(({ id, section, kind, amount, area, status }) => ({ id, section, kind, amount, area, status }))
}
