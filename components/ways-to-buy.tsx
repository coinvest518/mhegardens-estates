import Link from "next/link"
import { AskButton } from "@/components/ask-button"

type Action = { kind: "link"; href: string; label: string } | { kind: "ask"; question: string; label: string }

const WAYS: { name: string; what: string; credit: string; money: string; speed: string; action: Action }[] = [
  {
    name: "Mortgage",
    what: "Buy a listed home or lot through a lender, with our partner agent.",
    credit: "About 680+ for conventional loans. FHA and first-time programs can start near 580.",
    money: "A down payment — FHA can be 3.5% with 580+. Less score usually means more down.",
    speed: "About 1–2 months from offer to keys.",
    action: { kind: "link", href: "/#consult-buyer", label: "Check if I qualify" },
  },
  {
    name: "Down payment matching",
    what: "Programs that add money to what you save, so you reach your down payment sooner.",
    credit: "Depends on the program. Many are for first-time buyers.",
    money: "Your savings, matched. Income limits often apply.",
    speed: "You save over months, then buy with a mortgage.",
    action: { kind: "ask", question: "What down payment matching programs can help first-time buyers in the Albany area?", label: "Ask about matching programs" },
  },
  {
    name: "County tax auction",
    what: "Counties sell tax-foreclosed land and houses online, mostly spring through fall.",
    credit: "No credit check.",
    money: "Cash. A deposit when you win, then the full price soon after.",
    speed: "Set auction dates. Register a few days before bidding closes.",
    action: { kind: "link", href: "/auctions", label: "See upcoming auctions" },
  },
  {
    name: "Land bank",
    what: "A nonprofit sells vacant lots and houses to buyers who apply with a plan.",
    credit: "They review your application, your plan and proof of funds — not a bidding war.",
    money: "Often low prices, plus money to fix the property up.",
    speed: "Weeks to a few months for approval.",
    action: { kind: "ask", question: "How do I buy a property from the Albany County Land Bank?", label: "Ask how the land bank works" },
  },
  {
    name: "Fix and flip",
    what: "Buy a property that needs work, fix it, then sell or rent it.",
    credit: "Cash or a private / hard-money lender.",
    money: "Purchase plus repairs. We run the numbers with you first.",
    speed: "Depends on the repairs.",
    action: { kind: "link", href: "/#consult-investor", label: "Talk about a flip" },
  },
]

function WayAction({ action, className }: { action: Action; className: string }) {
  return action.kind === "link" ? (
    <Link href={action.href} className={className}>
      {action.label}
    </Link>
  ) : (
    <AskButton question={action.question} className={className}>
      {action.label}
    </AskButton>
  )
}

export function WaysToBuy() {
  return (
    <section id="ways" className="py-16 sm:py-20 px-5 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-pine text-balance">Five ways to buy, side by side</h2>
          <p className="mt-3 text-lg text-slate text-pretty">
            Most people only hear about mortgages. Here&apos;s what each way asks of your credit and your wallet.
          </p>
        </div>

        {/* Desktop: comparison table */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-[15px]">
            <caption className="sr-only">Ways to buy compared by credit, money and time</caption>
            <thead className="bg-mist text-pine">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-semibold w-[22%]">Way to buy</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Credit</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Money</th>
                <th scope="col" className="px-5 py-3.5 font-semibold w-[18%]">How long</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {WAYS.map((w) => (
                <tr key={w.name} className="align-top">
                  <th scope="row" className="px-5 py-5">
                    <span className="block font-display text-lg font-semibold text-pine">{w.name}</span>
                    <span className="block mt-1 font-normal text-sm text-slate">{w.what}</span>
                    <WayAction action={w.action} className="mt-3 inline-block text-left text-sm font-semibold text-leaf underline underline-offset-4 decoration-leaf/40 hover:decoration-leaf" />
                  </th>
                  <td className="px-5 py-5 text-ink">{w.credit}</td>
                  <td className="px-5 py-5 text-ink">{w.money}</td>
                  <td className="px-5 py-5 text-slate">{w.speed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: one block per way */}
        <div className="md:hidden space-y-3">
          {WAYS.map((w) => (
            <details key={w.name} className="group rounded-xl border border-border bg-card open:shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 [&::-webkit-details-marker]:hidden">
                <span>
                  <span className="block font-display text-lg font-semibold text-pine">{w.name}</span>
                  <span className="block text-sm text-slate">{w.what}</span>
                </span>
                <span className="text-2xl leading-none text-leaf transition-transform group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <dl className="grid gap-3 border-t border-border px-4 py-4 text-[15px]">
                <div>
                  <dt className="font-semibold text-pine">Credit</dt>
                  <dd className="text-ink">{w.credit}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-pine">Money</dt>
                  <dd className="text-ink">{w.money}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-pine">How long</dt>
                  <dd className="text-slate">{w.speed}</dd>
                </div>
                <WayAction action={w.action} className="mt-1 inline-flex w-full items-center justify-center rounded-xl border-2 border-leaf px-4 py-3 font-semibold text-leaf" />
              </dl>
            </details>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between rounded-2xl bg-mist px-5 py-5">
          <p className="text-ink">
            <span className="font-semibold">Not sure which fits?</span> Tell the guide your savings and credit range and
            it will compare them for you.
          </p>
          <AskButton
            mode="prefill"
            question="Which way to buy fits me? I have about $____ saved and my credit score is about ____."
            className="inline-flex items-center justify-center rounded-xl bg-leaf px-5 py-3 font-semibold text-white hover:bg-pine"
          >
            Ask which way fits me
          </AskButton>
        </div>
        <p className="mt-3 text-sm text-slate">Credit and down payment rules vary by lender and program.</p>
      </div>
    </section>
  )
}
