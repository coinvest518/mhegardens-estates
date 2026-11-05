import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { SiteFooter } from "@/components/site-footer"
import { MemberPrograms } from "@/components/member-programs"
import { ProgramEntry } from "@/components/program-entry"
import { CHECKED_ON, getMemberTeasers, getPrograms, getPublicPrograms } from "@/lib/programs"
import { SITE } from "@/lib/site"

// Re-render hourly so a funding round that closes on a date shows as closed.
export const revalidate = 3600

export const metadata: Metadata = {
  title: `Down payment help for first-time buyers — ${SITE.name}`,
  description:
    "Matched savings, grants and forgivable loans for first-time homebuyers in Albany and the Capital Region, with funding status and how to apply.",
}

const checkedOn = new Date(`${CHECKED_ON}T12:00:00Z`).toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "America/New_York",
})

const GATE = [
  {
    title: "A free homebuyer class",
    body: "Homebuyer 101 or a HUD counseling certificate. AHP runs one free online, the first Tuesday of each month at 5:30 PM.",
  },
  { title: "$1,000 to $1,500 saved", body: "Most programs want to see some of your own money in the deal." },
  { title: "12 months of on-time payments", body: "Rent, phone, car — a clean year of paying on time." },
]

export default function ProgramsPage() {
  const now = new Date()
  const publicPrograms = getPublicPrograms(now)
  const teasers = getMemberTeasers(now)
  const total = getPrograms(now).length

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        <section className="px-5 pb-12 pt-32 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h1 className="max-w-3xl text-4xl font-bold text-pine text-balance md:text-6xl">
              Money to help you buy your first home.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate text-pretty md:text-xl">
              Matched savings, grants and forgivable loans for first-time buyers in Albany and the Capital Region. We
              checked every program on {checkedOn}. Money comes and goes, so call before you count on one.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#consult-buyer"
                className="inline-flex items-center justify-center rounded-xl bg-leaf px-6 py-3 font-semibold text-white hover:bg-pine"
              >
                See which ones fit me
              </Link>
              <Link
                href="/#ask"
                className="inline-flex items-center justify-center rounded-xl border border-leaf px-6 py-3 font-semibold text-leaf hover:bg-mist"
              >
                Ask our guide a question
              </Link>
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 sm:px-6 lg:px-8" aria-labelledby="gate">
          <div className="mx-auto max-w-5xl rounded-2xl bg-mist p-7 md:p-10">
            <h2 id="gate" className="text-2xl font-bold text-pine md:text-3xl">
              Almost every program asks for the same three things
            </h2>
            <p className="mt-2 max-w-2xl text-slate text-pretty">Get these done first and most doors below open.</p>
            <ul className="mt-6 grid gap-6 md:grid-cols-3">
              {GATE.map((g) => (
                <li key={g.title} className="flex gap-3">
                  <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-leaf" aria-hidden>
                    <Check className="h-4 w-4 text-white" />
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{g.title}</p>
                    <p className="mt-1 text-[15px] text-slate text-pretty">{g.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-7 text-[15px] text-ink">
              Payment history not there yet?{" "}
              <Link href="/#contact-credit" className="font-semibold text-leaf underline underline-offset-4">
                Get credit help
              </Link>
            </p>
          </div>
        </section>

        <section className="px-5 pb-8 sm:px-6 lg:px-8" aria-labelledby="open-now" data-testid="programs-public">
          <div className="mx-auto max-w-5xl">
            <h2 id="open-now" className="text-2xl font-bold text-pine md:text-3xl">
              Two programs taking applications now
            </h2>
            <div className="mt-4">
              {publicPrograms.map((p) => (
                <ProgramEntry key={p.id} program={p} />
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 pt-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <MemberPrograms teasers={teasers} total={total} />
          </div>
        </section>

        <section className="bg-pine px-5 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">Not sure which ones fit you?</h2>
              <p className="mt-2 max-w-xl text-[#d6e3dc] text-pretty">
                Answer a few questions. On the free call we go over the programs you can stack with your savings and
                credit.
              </p>
            </div>
            <Link
              href="/#consult-buyer"
              className="inline-flex flex-shrink-0 items-center justify-center rounded-xl bg-goldenrod px-6 py-3 font-semibold text-ink hover:bg-[#f4c94e]"
            >
              See if you qualify
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
