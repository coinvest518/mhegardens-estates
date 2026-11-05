import type { Metadata } from "next"
import Link from "next/link"
import { Check, ExternalLink, FileText } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { SiteFooter } from "@/components/site-footer"
import { LandBankEntry } from "@/components/land-bank-entry"
import { LandBankMembers } from "@/components/land-bank-members"
import {
  LAND_BANK,
  LAND_BANK_AGENT_FEE,
  LAND_BANK_BLOCKERS,
  LAND_BANK_COSTS,
  LAND_BANK_DOCUMENTS,
  LAND_BANK_RULES,
  LAND_BANK_STEPS,
  formatDeadline,
  landBankDeadline,
} from "@/lib/land-bank"
import { getLandBankList, splitForVisitors, summarize } from "@/lib/land-bank-listings"
import { SITE } from "@/lib/site"

// The Land Bank posts a new list each month; re-read it every 6 hours.
export const revalidate = 21600

export const metadata: Metadata = {
  title: `Albany County Land Bank: this month's list and how to apply — ${SITE.name}`,
  description:
    "This month's Albany County Land Bank For Sale List — vacant lots and houses — plus a plain-English guide to the purchase application, documents, costs and deadlines.",
}

const FORMS = [
  { label: "Property Purchase Application (English, PDF)", href: LAND_BANK.links.applicationEnglish },
  { label: "Solicitud de compra (Spanish, PDF)", href: LAND_BANK.links.applicationSpanish },
  { label: "Sign the property viewing waiver online", href: LAND_BANK.links.viewingWaiverSign },
  { label: "Property viewing waiver (PDF)", href: LAND_BANK.links.viewingWaiverPdf },
  { label: "Book free application help with the Land Bank", href: LAND_BANK.links.applicationSupport },
  { label: "Lots for Less program (vacant lots, rolling applications)", href: LAND_BANK.links.lotsForLess },
  { label: "Land Bank first-time homebuyer program", href: LAND_BANK.links.firstTimeBuyer },
]

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-ink text-pretty">
          <Check className="mt-1 h-4 w-4 flex-shrink-0 text-leaf" aria-hidden />
          {t}
        </li>
      ))}
    </ul>
  )
}

export default async function LandBankPage() {
  const list = await getLandBankList()
  const stats = summarize(list)
  const { open, lockedCount, teasers } = splitForVisitors(list)
  const now = new Date()
  const deadline = landBankDeadline(list.cycle, now)
  const closed = now > deadline
  const read = new Date(list.fetchedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "America/New_York" })
  const typeLine = [
    stats.lots ? `${stats.lots} vacant lot${stats.lots === 1 ? "" : "s"}` : null,
    stats.buildings ? `${stats.buildings} house${stats.buildings === 1 ? "" : "s"} or building${stats.buildings === 1 ? "" : "s"}` : null,
    stats.commercial ? `${stats.commercial} commercial` : null,
  ]
    .filter(Boolean)
    .join(" and ")

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <section className="px-5 pb-12 pt-32 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h1 className="max-w-3xl text-4xl font-bold text-pine text-balance md:text-6xl">
              Buy from the Albany County Land Bank.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate text-pretty md:text-xl">
              The county&apos;s nonprofit land bank sells vacant lots and houses through an application, not a bidding
              war. It looks at your plan and your money, not just your offer.
            </p>
            {stats.total > 0 && (
              <div className="mt-8 max-w-2xl border-l-4 border-goldenrod bg-white py-4 pl-5 pr-4 text-lg text-ink shadow-[0_1px_0_rgba(23,32,29,0.06)]" data-testid="land-bank-callout">
                <p>
                  <strong>
                    {list.cycle ?? "This month's"} list: {stats.total} properties
                  </strong>{" "}
                  — {typeLine}
                  {stats.minPrice !== null ? `, from $${stats.minPrice.toLocaleString("en-US")}` : ""}.
                </p>
                <p className="mt-1 text-slate">
                  {closed
                    ? `Applications for this list closed ${formatDeadline(deadline)}. The next list posts on the first business day of next month.`
                    : `Applications due ${formatDeadline(deadline)}.`}
                </p>
              </div>
            )}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#list" className="inline-flex items-center justify-center rounded-xl bg-leaf px-6 py-3 font-semibold text-white hover:bg-pine">
                See this month&apos;s list
              </a>
              <a href="#apply" className="inline-flex items-center justify-center rounded-xl border border-leaf px-6 py-3 font-semibold text-leaf hover:bg-mist">
                How to apply
              </a>
            </div>
            <p className="mt-6 max-w-2xl text-sm text-slate">
              {SITE.name} isn&apos;t part of the Land Bank. We read its public list and help buyers get their applications
              in.
            </p>
          </div>
        </section>

        <section id="list" className="scroll-mt-24 px-5 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            {stats.total > 0 ? (
              <>
                <h2 className="text-2xl font-bold text-pine md:text-3xl">The {open.length} lowest-priced right now</h2>
                <p className="mt-2 text-slate">
                  From the Land Bank&apos;s {list.cycle ?? "current"} For Sale List, read {read}. Always check{" "}
                  <a
                    href={list.pdfUrl ?? LAND_BANK.links.forSaleList}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-semibold text-leaf underline underline-offset-4"
                  >
                    the official list<span className="sr-only"> (opens in a new tab)</span>
                  </a>{" "}
                  before you apply.
                </p>
                <div className="mt-4" data-testid="listings-public">
                  {open.map((l) => (
                    <LandBankEntry key={l.parcelId} listing={l} cycle={list.cycle} />
                  ))}
                </div>
                <div className="mt-10">
                  <LandBankMembers teasers={teasers} lockedCount={lockedCount} total={stats.total} cycle={list.cycle} />
                </div>
              </>
            ) : (
              <div className="rounded-2xl bg-mist p-7" data-testid="listings-unavailable">
                <h2 className="text-2xl font-bold text-pine">See this month&apos;s list on the Land Bank&apos;s site</h2>
                <p className="mt-2 max-w-2xl text-slate">
                  We couldn&apos;t load the list right now. The Land Bank posts it on the first business day of each month.
                </p>
                <a
                  href={LAND_BANK.links.forSaleList}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-leaf px-5 py-3 font-semibold text-white hover:bg-pine"
                >
                  Open the For Sale List <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              </div>
            )}
          </div>
        </section>

        <section id="apply" className="scroll-mt-24 bg-mist px-5 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-pine md:text-4xl">How to apply</h2>
            <p className="mt-2 max-w-2xl text-slate text-pretty">
              From the Land Bank&apos;s Property Purchase Application and its website. Only complete applications get
              reviewed.
            </p>
            <ol className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
              {LAND_BANK_STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-pine font-display text-lg font-bold text-goldenrod" aria-hidden>
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-ink">{s.title}</h3>
                    <p className="mt-1 text-slate text-pretty">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-pine md:text-3xl">What to send</h2>
              <div className="mt-5">
                <Bullets items={LAND_BANK_DOCUMENTS.required} />
              </div>
              <h3 className="mt-8 text-lg font-bold text-ink">Sometimes also</h3>
              <div className="mt-3">
                <Bullets items={LAND_BANK_DOCUMENTS.sometimes} />
              </div>
              <p className="mt-6 rounded-xl bg-paper p-4 text-[15px] text-ink ring-1 ring-inset ring-border">
                Send one clear PDF to{" "}
                <a href={`mailto:${LAND_BANK.applicationsEmail}`} className="font-semibold text-leaf underline underline-offset-4">
                  {LAND_BANK.applicationsEmail}
                </a>
                , mail the original to {LAND_BANK.address}, or drop it off {LAND_BANK.hours.toLowerCase()}. They don&apos;t
                accept photos of the application.
              </p>
            </div>
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-pine md:text-3xl">What it costs</h2>
                <div className="mt-5">
                  <Bullets items={LAND_BANK_COSTS} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-pine md:text-3xl">Fix these first</h2>
                <p className="mt-2 text-slate">Your application can&apos;t move forward while you have:</p>
                <div className="mt-4">
                  <Bullets items={LAND_BANK_BLOCKERS} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-pine md:text-3xl">Rules that can come with it</h2>
                <div className="mt-5">
                  <Bullets items={LAND_BANK_RULES} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 sm:px-6 lg:px-8" aria-labelledby="forms">
          <div className="mx-auto max-w-5xl">
            <h2 id="forms" className="text-2xl font-bold text-pine md:text-3xl">
              Official forms and links
            </h2>
            <ul className="mt-5 grid gap-x-10 gap-y-3 md:grid-cols-2">
              {FORMS.map((f) => (
                <li key={f.href}>
                  <a
                    href={f.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-start gap-2 font-semibold text-pine underline decoration-goldenrod decoration-2 underline-offset-4 hover:text-leaf"
                  >
                    <FileText className="mt-1 h-4 w-4 flex-shrink-0" aria-hidden />
                    {f.label}
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-slate">
              Questions for the Land Bank itself: {LAND_BANK.phone},{" "}
              <a href={`mailto:${LAND_BANK.infoEmail}`} className="text-leaf underline underline-offset-4">
                {LAND_BANK.infoEmail}
              </a>
              .
            </p>
          </div>
        </section>

        <section className="bg-pine px-5 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-white">Want a hand with your application?</h2>
            <p className="mt-3 max-w-2xl text-[#d6e3dc] text-pretty">
              We help you pick a property, plan the work and the budget, and get everything in before the deadline.{" "}
              {LAND_BANK_AGENT_FEE} {SITE.agent.name} of {SITE.agent.company} can be that agent.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#contact-landbank"
                className="inline-flex items-center justify-center rounded-xl bg-goldenrod px-6 py-3 font-semibold text-ink hover:bg-[#f4c94e]"
              >
                Get application help
              </Link>
              <Link
                href="/#contact-agent"
                className="inline-flex items-center justify-center rounded-xl border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10"
              >
                Talk with {SITE.agent.name.split(" ")[0]}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
