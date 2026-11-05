import Link from "next/link"
import { Home, MapPin, MessageCircle, Tag, TrendingUp } from "lucide-react"
import { PlatMap } from "@/components/plat-map"
import { SITE } from "@/lib/site"

const ROLES = [
  { href: "/#consult-buyer", icon: Home, label: "I want to buy", hint: "A home or land" },
  { href: "/#consult-seller", icon: Tag, label: "I want to sell", hint: "A house or a lot" },
  { href: "/#consult-investor", icon: TrendingUp, label: "I want to invest", hint: "Auctions, flips, rentals" },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-pine text-[#eef4f0]">
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-14 lg:pb-20">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6">
            <p className="flex items-center gap-2 text-sm text-[#cfe0d7] mb-5">
              <MapPin className="h-4 w-4 text-goldenrod" aria-hidden />
              Albany and the Capital Region, {SITE.region}
            </p>

            <h1 className="text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.1rem] font-bold text-white text-balance">
              Own land or a home in Upstate New York.
            </h1>

            <p className="mt-5 text-lg text-[#cfe0d7] max-w-xl text-pretty">
              With a mortgage, a first-time buyer program, a county tax auction or the land bank — we help you find
              the way that fits your money and your credit. Free to start.
            </p>

            <div className="mt-8">
              <p className="font-display text-xl font-semibold text-white mb-3">What brings you here?</p>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {ROLES.map(({ href, icon: Icon, label, hint }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 rounded-xl bg-white/[0.07] border border-white/15 px-4 py-3.5 sm:py-4 transition-colors hover:bg-goldenrod hover:border-goldenrod hover:text-ink"
                  >
                    <Icon className="h-5 w-5 text-goldenrod group-hover:text-ink flex-shrink-0" aria-hidden />
                    <span>
                      <span className="block font-semibold text-white group-hover:text-ink">{label}</span>
                      <span className="block text-sm text-[#b9cdc3] group-hover:text-ink/80">{hint}</span>
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                href="/#ask"
                className="mt-4 inline-flex items-center gap-2 text-[#cfe0d7] underline decoration-goldenrod/60 underline-offset-4 hover:text-white"
              >
                <MessageCircle className="h-4 w-4 text-goldenrod" aria-hidden />
                Not sure yet? Ask a question first
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-white/12 bg-pine-deep/60 p-3 sm:p-5">
              <PlatMap className="w-full h-auto" />
              <p className="mt-3 px-1 text-sm text-[#b9cdc3]">
                Three ways to get a lot like these: apply to the land bank, bid at a county auction, or buy one that&apos;s
                listed — with or without a mortgage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
