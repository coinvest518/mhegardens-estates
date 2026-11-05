/**
 * What we know about buying from the Albany County Land Bank, from its Property Purchase
 * Application (version 3.2022, still the current form) and its website (checked Nov 5, 2026).
 * The /land-bank page and the AI guide both read from here, so they always agree.
 */

const SITE = "https://www.albanycountylandbank.org"

export const LAND_BANK = {
  name: "Albany County Land Bank",
  phone: "(518) 407-0309",
  applicationsEmail: "applications@albanycountylandbank.org",
  infoEmail: "info@albanycountylandbank.org",
  address: "111 Washington Avenue, Suite 601, Albany, NY 12210",
  hours: "Monday to Friday, 9:30 AM to 4:30 PM",
  links: {
    site: SITE,
    forSaleList: `${SITE}/for-sale-list`,
    applications: `${SITE}/applications`,
    processOverview: `${SITE}/process-overview`,
    applicationEnglish: `${SITE}/s/FinalDraft2022Application20221130.pdf`,
    applicationSpanish:
      "https://static1.squarespace.com/static/5947fe9a2994cac227744c26/t/67781d20d4b5e832f1e369d5/1735925026639/Spanish-Final%2BDraft%2B2022%2BApplication%2B20221130.pdf",
    viewingWaiverSign:
      "https://na4.documents.adobe.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhDSNXpn9QmCjTCWkFLJJr7VJd2RFNNKb8o25UkkguGHjZfrGBZWSncGt7wpEp0ZvKQ%2A",
    viewingWaiverPdf: `${SITE}/s/20231211-ACLB-Property-Waiver-and-Release.pdf`,
    applicationSupport: `${SITE}/scheduleapplicationsupport`,
    lotsForLess: `${SITE}/lotsforless`,
    firstTimeBuyer: `${SITE}/first-time-homebuyer-program`,
  },
} as const

/** The buying process, in order. */
export const LAND_BANK_STEPS: { title: string; body: string }[] = [
  {
    title: "Pick a property from this month's list",
    body: "A new list goes up on the first business day of each month. One property per application — the only exception is lots that touch each other.",
  },
  {
    title: "See it in person first",
    body: "The Land Bank requires it. For a building, sign the property viewing waiver first, then call (518) 407-0309 to book a showing or go with a realtor. Vacant lots you can visit on your own.",
  },
  {
    title: "Check your plan with the town or city",
    body: "Ask the local planning or codes office if your plan fits zoning and building codes. Money spent on drawings or permits before the Land Bank approves you is at your own risk.",
  },
  {
    title: "Gather your documents",
    body: "The signed pages of the application, a budget and timeline (Form A), photo ID, your latest tax return, proof of funds and a $50 fee for each applicant. The full list is below.",
  },
  {
    title: "Send it in by the deadline",
    body: "Email one clear PDF to applications@albanycountylandbank.org (no phone photos), mail the original, or drop it off. It must arrive by 2:00 PM on the last Tuesday of the month. Call to confirm they got it.",
  },
  {
    title: "Wait for the Board's decision",
    body: "A committee reviews offers, then the Board of Directors decides at its meeting on the third Tuesday of the month. You hear back by that Friday. They weigh your experience, your money, your offer, your plan and what it does for the neighborhood.",
  },
  {
    title: "Close",
    body: "If you're picked, a Land Bank attorney contacts you to start closing. Properties are sold as is.",
  },
  {
    title: "Finish the work within a year",
    body: "An enforcement mortgage holds you to your plan. Expect check-ins at 30 days (permits and insurance), inspections around 90, 210 and 300 days, and a final inspection before it's released.",
  },
]

export const LAND_BANK_DOCUMENTS = {
  required: [
    "Signed purchaser certification, terms and conditions, enforcement mortgage and viewing pages (pages 4–7)",
    "Background and credit check authorization (this page asks for your Social Security number — send it only to the Land Bank)",
    "Form A: project budget and timeline (rehab can take at most 12 months)",
    "Copy of photo ID for every applicant",
    "Your most recent tax return",
    "Proof of funds: bank statement, loan pre-qualification letter, letter of credit or funding commitment",
    "Processing fee: $50 per applicant, by check or money order to Albany County Land Bank Corporation",
  ],
  sometimes: [
    "Letters of support from neighbors or community members",
    "Local property manager agreement (landlords who don't live in Albany County or a county next to it)",
    "Form B: rental pro forma, if you'll rent it out",
    "LLC or nonprofit papers and a list of all members or partners",
  ],
}

export const LAND_BANK_COSTS = [
  "$50 processing fee per applicant when you apply",
  "Closing costs, plus a 3% asset management fee paid to the Land Bank",
  "Any back taxes or water bills still owed on the property",
  "Your repairs or building costs — keep extra money set aside for surprises",
]

/** Things that stop an application until they're fixed. */
export const LAND_BANK_BLOCKERS = [
  "Being behind on property taxes or a mortgage",
  "Open code violations, unpaid property or school taxes, liens or housing judgments",
  "An unresolved foreclosure",
]

export const LAND_BANK_RULES = [
  "If you said you'll live there, you may have to live there for 5 years.",
  "You may need the Land Bank's OK to sell within 5 years.",
  "Rentals on properties the Land Bank put grant money into may have to serve renters at or under 100% of area median income for 10 years.",
  "A side lot you buy may have to be merged with the property you already own next to it.",
]

/** Their buyer-agent fee: worth knowing when you work with an agent. */
export const LAND_BANK_AGENT_FEE =
  "For sales of $10,000 or more, the Land Bank may pay $500 at closing to the buyer's licensed real estate agent."

/** Applications are due at 2:00 PM Eastern on the last Tuesday of the list's month. */
export function landBankDeadline(cycle: string | null, now = new Date()): Date {
  let year = now.getUTCFullYear()
  let month = now.getUTCMonth()
  const m = cycle?.match(/^([A-Za-z]+)\s+(\d{4})$/)
  if (m) {
    const idx = new Date(`${m[1]} 1, 2000`).getMonth()
    if (!Number.isNaN(idx)) {
      month = idx
      year = Number(m[2])
    }
  }
  const lastDay = new Date(Date.UTC(year, month + 1, 0))
  const back = (lastDay.getUTCDay() - 2 + 7) % 7 // 2 = Tuesday
  const day = lastDay.getUTCDate() - back
  // 2 PM in New York is 19:00 UTC in winter, 18:00 UTC in summer.
  const winter = new Date(Date.UTC(year, month, day, 19))
  const nyHour = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric", hourCycle: "h23" }).format(winter)
  )
  return nyHour === 14 ? winter : new Date(Date.UTC(year, month, day, 18))
}

export function formatDeadline(d: Date): string {
  return d.toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}
