/**
 * Free lessons ("Learn"). Plain-English explainers on how tax-foreclosed property is sold in New York.
 * Facts were checked against the sources listed on each lesson on Nov 5, 2026. Update `updated` when you re-check.
 */

export type Block =
  | { p: string }
  | { list: string[] }
  | { steps: { title: string; body: string }[] }
  | { table: { columns: string[]; rows: { label: string; cells: string[] }[] } }
  | { note: string }

export type Lesson = {
  slug: string
  title: string
  /** One sentence for lists and search results. */
  description: string
  minutes: number
  updated: string
  sections: { heading: string; blocks: Block[] }[]
  sources: { label: string; href: string }[]
  /** Where to send the reader next. */
  next: { label: string; href: string }
}

export const LESSONS: Lesson[] = [
  {
    slug: "tax-liens-vs-tax-deeds",
    title: "Tax liens vs. tax deeds: what you actually buy",
    description:
      "With a lien you buy someone's tax debt. With a deed you buy the property. Here's how each works, and which one New York uses.",
    minutes: 6,
    updated: "2026-11-05",
    sections: [
      {
        heading: "The short answer",
        blocks: [
          {
            list: [
              "A tax lien is a debt. You pay the owner's overdue taxes and get the right to be paid back, usually with interest. You don't own the property.",
              "A tax deed is the property. The county already took it for unpaid taxes and sells it. The winning bidder gets a deed.",
            ],
          },
          {
            p: "Most of New York, including Albany and the Capital Region, sells tax deeds: the county forecloses and auctions the property itself.",
          },
        ],
      },
      {
        heading: "How a tax lien works",
        blocks: [
          {
            p: "In states that sell liens, the county auctions off the right to collect the unpaid taxes. The owner then has a set time, called the redemption period, to pay it off with interest. If they pay, you get your money back plus interest. If they don't, you can start a foreclosure to take the property — which takes more time, legal costs and patience.",
          },
          {
            p: "In New York, lien sales are rare. A few downstate places, like Nassau County on Long Island, sell lien certificates. New York City sells its tax liens, but not to individual investors. If a course promises easy tax lien profits in Upstate New York, be careful: that's not how it works here.",
          },
        ],
      },
      {
        heading: "How a tax deed works in New York",
        blocks: [
          {
            p: "Most New York counties enforce property taxes under Article 11 of the Real Property Tax Law. When taxes go unpaid — generally for about two years — the county starts a foreclosure against the property itself (called in rem). If nobody pays, the county takes title and sells the property, usually at an online auction.",
          },
          {
            list: [
              "The foreclosure cuts off the old owner's title and most claims against the property, including mortgages and judgments.",
              "Recorded easements and rights of way stay with the property.",
              "Federal tax liens follow federal rules, so check whether the IRS has a claim.",
              "Many counties don't let the former owner bid on their own property.",
            ],
          },
        ],
      },
      {
        heading: "What changed in 2024: the surplus goes back to the owner",
        blocks: [
          {
            p: "In 2023 the U.S. Supreme Court ruled in Tyler v. Hennepin County that a county can't keep the extra money when a foreclosed home sells for more than the taxes owed. New York changed its law in April 2024 to match.",
          },
          {
            p: "Now, after a sale, the county works out the surplus — what's left after back taxes, interest, fees and costs — and tells the former owner, who has three years to claim it. Some counties paused their auctions while they changed their rules, so auction calendars may look different than they used to.",
          },
        ],
      },
      {
        heading: "What this means if you're buying",
        blocks: [
          {
            list: [
              "You're buying the property as is, usually without seeing inside.",
              "The county gives you a deed with no promises about condition, and getting title insurance can take extra work.",
              "Budget for the price, the auction fees, repairs and upcoming taxes — and have cash, because most auctions want a deposit right away.",
              "The land bank is another way to buy foreclosed property, by application instead of bidding.",
            ],
          },
          { note: "This is general education, not legal advice. Rules change and every county writes its own auction terms — read them before you bid." },
        ],
      },
    ],
    sources: [
      { label: "Phillips Lytle: New York's response to Tyler v. Hennepin County (2025)", href: "https://phillipslytle.com/a-review-of-new-yorks-response-to-tyler-v-hennepin-county/" },
      { label: "NY Courts: Schoharie County surplus decision, Nov 2025", href: "https://www.nycourts.gov/reporter/3dseries/2025/2025_25269.htm" },
      { label: "Ulster County Comptroller: auction audit (2025)", href: "https://comptroller.ulstercountyny.gov/wp-content/uploads/2025/07/Ulster-County-Auction-Audit-1.pdf" },
      { label: "Tompkins County 2025 tax foreclosure auction terms", href: "https://www.estatesale.com/sales/view/783369.html" },
      { label: "Erie County bidder and purchaser FAQ (2026)", href: "https://www3.erie.gov/ecrpts/sites/www3.erie.gov.ecrpts/files/2026-08/bidder-and-purchaser-faq.pdf" },
    ],
    next: { label: "How online tax auctions work, step by step", href: "/learn/online-tax-auctions" },
  },
  {
    slug: "online-tax-auctions",
    title: "How online county tax auctions work, step by step",
    description:
      "From the registration packet to the deed: what bidding on a tax-foreclosed property online actually takes, and what it really costs.",
    minutes: 7,
    updated: "2026-11-05",
    sections: [
      {
        heading: "Who runs them",
        blocks: [
          {
            p: "Most Upstate counties now sell their tax-foreclosed property online through an auction company such as Auctions International. Albany County, for example, held spring, summer and fall online auctions in 2026. Each county sets its own terms, so the details below are examples — always read the terms for the auction you're in.",
          },
        ],
      },
      {
        heading: "The steps",
        blocks: [
          {
            steps: [
              { title: "Find the auction and its catalog", body: "Each listing shows the parcels, opening and closing dates, and the terms of sale. Our Auctions page lists what's coming up." },
              { title: "Make a bidder account", body: "Sign up on the auction company's site. Expect to give a card to verify who you are." },
              { title: "Send that auction's registration packet", body: "Every auction has its own packet and deadline — you fill out a new one even if you've bid before. Late packets usually aren't accepted." },
              { title: "Research every parcel you like", body: "Check the tax map, zoning, road access, utilities, flood zone and anything that stays with the property, like easements. You usually can't go inside, so drive by and look." },
              { title: "Set your top price — with fees", body: "Decide the most you'll pay before bidding opens, counting the buyer's premium, deposit, filing fees, repairs and taxes." },
              { title: "Bid", body: "Lots usually close one after another on the last day. A bid near the end extends the clock (soft close), so the price can keep moving. Bids can't be taken back." },
              { title: "Pay the deposit right away", body: "Winners usually pay a deposit, the buyer's premium and fees within days. Small bids are often paid in full." },
              { title: "Pay the rest and close", body: "The county's attorney prepares the deed after you pay the balance. You're responsible for taxes from then on — tell the tax collectors where to send the bills." },
            ],
          },
        ],
      },
      {
        heading: "What it really costs: an example",
        blocks: [
          {
            p: "Cayuga County's 2025 terms on Auctions International show how fast it adds up. On a $10,000 winning bid paid by card:",
          },
          {
            table: {
              columns: ["", "Amount"],
              rows: [
                { label: "Deposit (20% of the bid)", cells: ["$2,000"] },
                { label: "Buyer's premium (12.77% by card)", cells: ["$1,277"] },
                { label: "Administrative fee", cells: ["$200"] },
                { label: "Due right after the auction", cells: ["$3,477"] },
              ],
            },
          },
          {
            p: "Then the other $8,000 of the bid comes due at closing. Paying with certified funds lowered that county's buyer's premium to 10%. Other auctions add filing fees and New York's transfer tax ($2 for every $500 of the price), or require a minimum deposit such as $2,500.",
          },
        ],
      },
      {
        heading: "Mistakes that cost people",
        blocks: [
          {
            list: [
              "Missing the registration packet deadline.",
              "Bidding on a sliver of land with no road access, or a lot too small to build on.",
              "Forgetting the buyer's premium and fees when setting a top price.",
              "Not paying on time. Defaulting can mean losing your deposit, extra fees and being banned from future auctions.",
            ],
          },
          { note: "This is general education, not legal advice. Every county writes its own terms of sale." },
        ],
      },
    ],
    sources: [
      { label: "Cayuga County 2025 auction terms and bidder certification", href: "https://www.cayugacounty.gov/DocumentCenter/View/31031/2025-Auction-Procedure-Terms-and-Bidder-Certification-PDF" },
      { label: "City of North Tonawanda 2025 tax auction catalog", href: "https://www.northtonawanda.org/documents/Website/2025/2025%20North%20Tonawanda%20Tax%20Catalog.pdf" },
      { label: "Albany County 2026 online tax foreclosure auctions (Auctions International)", href: "https://www.auctionzip.com/Listings/4143159.html" },
      { label: "Tompkins County 2025 auction terms (soft close, no retracting bids)", href: "https://www.estatesale.com/sales/view/783369.html" },
    ],
    next: { label: "What a land bank is, and how buying from one works", href: "/learn/what-is-a-land-bank" },
  },
  {
    slug: "what-is-a-land-bank",
    title: "What a land bank is, and how buying from one works",
    description:
      "Land banks sell vacant and tax-foreclosed property by application, not bidding. Here's how the Albany County Land Bank does it.",
    minutes: 5,
    updated: "2026-11-05",
    sections: [
      {
        heading: "What it is",
        blocks: [
          {
            p: "A land bank is a nonprofit that takes in vacant, abandoned and tax-foreclosed property and gets it back into use. Albany County created its land bank in 2014. Instead of auctioning everything to the highest bidder, it picks buyers who have a real plan and the money to carry it out.",
          },
        ],
      },
      {
        heading: "How it's different from an auction",
        blocks: [
          {
            list: [
              "You apply instead of bidding. Each property has an asking price, and you make an offer on the application.",
              "The Board picks the buyer based on your plan, your money, your experience, your offer and what it does for the neighborhood.",
              "You must see the property in person first.",
              "The deal comes with rules: an enforcement mortgage holds you to finishing the work within about a year, and some properties require you to live there for 5 years.",
              "Prices can be low. On the November 2026 list, vacant lots started at $600.",
            ],
          },
        ],
      },
      {
        heading: "How the Albany County Land Bank works",
        blocks: [
          {
            steps: [
              { title: "A new list each month", body: "The For Sale List posts on the first business day of the month." },
              { title: "View, check zoning, gather documents", body: "See the property, confirm your plan with the town or city, and put together the application, budget, ID, tax return, proof of funds and a $50 fee per applicant." },
              { title: "Apply by the deadline", body: "Applications are due by 2:00 PM on the last Tuesday of the month — by email as one PDF, by mail or in person." },
              { title: "The Board decides", body: "It meets on the third Tuesday of the month, and you hear back by that Friday." },
              { title: "Close and do the work", body: "At closing you pay closing costs plus a 3% asset management fee, then finish the work your plan promised." },
            ],
          },
          {
            p: "The Land Bank also runs a Lots for Less program for vacant lots, with applications taken on a rolling basis, and a first-time homebuyer program.",
          },
        ],
      },
      {
        heading: "Is it right for you?",
        blocks: [
          {
            list: [
              "Good fit: you have a clear plan, some savings or a pre-qualification, and you can finish work within a year.",
              "Harder fit: you're behind on property taxes or a mortgage, or have open code violations — those have to be fixed first.",
            ],
          },
          { note: "This is general education. The Land Bank's own application and website are the final word." },
        ],
      },
    ],
    sources: [
      { label: "Albany County Land Bank: process overview", href: "https://www.albanycountylandbank.org/process-overview" },
      { label: "Albany County Land Bank: applications", href: "https://www.albanycountylandbank.org/applications" },
      { label: "Albany County Land Bank: Property Purchase Application (v3.2022)", href: "https://www.albanycountylandbank.org/s/FinalDraft2022Application20221130.pdf" },
      { label: "Albany County Land Bank: For Sale List", href: "https://www.albanycountylandbank.org/for-sale-list" },
    ],
    next: { label: "See this month's Land Bank list", href: "/land-bank" },
  },
  {
    slug: "auction-vs-land-bank-vs-listing",
    title: "Auction, land bank or a regular sale: which fits you?",
    description:
      "Three ways to buy, side by side: what each asks of your credit, your cash and your time — and who each one is best for.",
    minutes: 4,
    updated: "2026-11-05",
    sections: [
      {
        heading: "Side by side",
        blocks: [
          {
            table: {
              columns: ["County tax auction", "Land bank", "Regular sale"],
              rows: [
                { label: "How you buy", cells: ["Bid online", "Send an application", "Make an offer with an agent"] },
                { label: "Credit check", cells: ["No", "Yes, a background and credit check", "Yes, if you use a mortgage"] },
                { label: "Competition", cells: ["Other bidders set the price", "The Board picks a buyer", "Other offers"] },
                { label: "Seeing it first", cells: ["Usually from outside only", "Required, inside for buildings", "Showings and an inspection"] },
                { label: "Money up front", cells: ["Deposit, premium and fees within days", "$50 per applicant, plus proof of funds", "Down payment and closing costs"] },
                { label: "How you pay", cells: ["Usually cash", "Cash, a loan or a funding letter", "Usually a mortgage"] },
                { label: "Rules after", cells: ["Few", "Finish work in about a year; sometimes live there 5 years", "Few, unless a program has its own"] },
                { label: "Best for", cells: ["Cash buyers who can handle risk", "People with a plan and some money", "First-time buyers who want move-in ready"] },
              ],
            },
          },
        ],
      },
      {
        heading: "How to choose",
        blocks: [
          {
            list: [
              "Credit around 680 or higher, or cash: a regular sale with our partner agent is often the simplest path.",
              "Credit around 580 to 679: look at FHA and first-time buyer programs — and down payment help.",
              "Low credit but some cash and a plan: the land bank or an auction can work, since auctions don't check credit.",
              "Not sure: answer a few questions and we'll point you to the way that fits.",
            ],
          },
        ],
      },
    ],
    sources: [
      { label: "Albany County Land Bank: Property Purchase Application (v3.2022)", href: "https://www.albanycountylandbank.org/s/FinalDraft2022Application20221130.pdf" },
      { label: "Cayuga County 2025 auction terms", href: "https://www.cayugacounty.gov/DocumentCenter/View/31031/2025-Auction-Procedure-Terms-and-Bidder-Certification-PDF" },
    ],
    next: { label: "See if you qualify", href: "/#consult" },
  },
]

export const getLesson = (slug: string) => LESSONS.find((l) => l.slug === slug) ?? null
