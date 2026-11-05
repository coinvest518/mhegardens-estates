import Link from "next/link"
import { Check } from "lucide-react"

const GROUPS = [
  {
    id: "buyers",
    href: "/#consult-buyer",
    title: "Buying",
    points: ["First home or buying again", "A house, land, or land to build on", "Low credit? We start with a plan"],
    cta: "Start as a buyer",
  },
  {
    id: "sellers",
    href: "/#consult-seller",
    title: "Selling",
    points: ["A house or a vacant lot", "Behind on taxes or payments, or inherited", "List with our agent or get an as-is offer"],
    cta: "Start as a seller",
  },
  {
    id: "investors",
    href: "/#consult-investor",
    title: "Investing",
    points: ["Auction research and registration", "Land bank and off-market properties", "Flip and rental numbers before you buy"],
    cta: "Start as an investor",
  },
]

export function WhoWeHelp() {
  return (
    <section id="who" className="py-16 sm:py-20 px-5 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-pine text-balance max-w-2xl">Buying, selling or investing</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          {GROUPS.map((g) => (
            <div key={g.id} id={g.id} className="border-t-4 border-goldenrod pt-5 scroll-mt-24 flex flex-col">
              <h3 className="text-2xl font-semibold text-pine">{g.title}</h3>
              <ul className="mt-4 space-y-2.5 flex-1">
                {g.points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-ink">
                    <Check className="h-5 w-5 text-leaf flex-shrink-0 mt-0.5" aria-hidden />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={g.href}
                className="mt-6 inline-flex items-center justify-center rounded-xl border-2 border-leaf px-5 py-3 font-semibold text-leaf hover:bg-leaf hover:text-white"
              >
                {g.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
