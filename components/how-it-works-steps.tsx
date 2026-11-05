import Link from "next/link"

const STEPS = [
  { title: "Answer a few questions", body: "Buying, selling or investing — plus your savings and credit range. About a minute." },
  { title: "See your best path", body: "Mortgage, first-time buyer program, credit help first, or auctions and the land bank." },
  { title: "Free 30-minute call", body: "We go over your options. No cost, no credit check to talk." },
  { title: "Buy with a plan", body: "Work with our partner agent or let us guide you through an auction or land bank application." },
]

export function HowItWorksSteps() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 px-5 sm:px-6 lg:px-8 bg-mist scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-pine text-balance max-w-2xl">How it works</h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative pl-14 lg:pl-0 lg:pt-14">
              <span
                className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-pine font-display text-lg font-bold text-goldenrod"
                aria-hidden
              >
                {i + 1}
              </span>
              <h3 className="text-xl font-semibold text-pine">{s.title}</h3>
              <p className="mt-1.5 text-slate text-pretty">{s.body}</p>
            </li>
          ))}
        </ol>
        <Link
          href="/#consult"
          className="mt-10 inline-flex items-center justify-center rounded-xl bg-leaf px-6 py-3.5 font-semibold text-white hover:bg-pine"
        >
          Start with step one
        </Link>
      </div>
    </section>
  )
}
