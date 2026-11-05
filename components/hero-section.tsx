import Link from "next/link"
import { ArrowRight, CalendarCheck, Gavel } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SITE, consultHref } from "@/lib/site"

const QUICK_FACTS = [
  { label: "Buyers, sellers & investors", detail: "One team, every path" },
  { label: "Free 30-minute call", detail: "No cost, no pressure" },
  { label: "Credit help", detail: "If you're not ready yet" },
  { label: SITE.region, detail: "Albany & the Capital Region" },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-primary/40 text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <p
              className="mb-5 text-xs font-semibold tracking-widest uppercase text-accent hero-enter"
              style={{ animationDelay: "80ms" }}
            >
              Land &amp; homes · {SITE.region}
            </p>

            <h1
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] mb-5 text-balance hero-enter"
              style={{ animationDelay: "200ms" }}
            >
              Own land or a home.
              <br />
              <span className="text-accent">We&apos;ll show you the way&nbsp;in.</span>
            </h1>

            <p
              className="text-lg text-white/80 mb-8 text-pretty max-w-xl hero-enter"
              style={{ animationDelay: "320ms" }}
            >
              Buy with a mortgage, a first-time buyer program, or the less-known way — county tax
              auctions and land bank properties. Selling or investing? We help with that too.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 hero-enter" style={{ animationDelay: "440ms" }}>
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8 hover-lift"
              >
                <Link href={consultHref()}>
                  <CalendarCheck className="mr-2 h-5 w-5" />
                  Book a free consultation
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm px-8 hover-lift"
              >
                <Link href="/#ways">
                  See ways to buy
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div
              className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5 border-t border-white/15 pt-8 hero-enter"
              style={{ animationDelay: "560ms" }}
            >
              {QUICK_FACTS.map(({ label, detail }) => (
                <div key={label}>
                  <div className="text-sm font-bold text-accent leading-snug">{label}</div>
                  <div className="text-xs text-white/65 mt-1">{detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 hero-enter" style={{ animationDelay: "300ms" }}>
            <div className="relative mx-2 sm:mx-6 lg:mx-0">
              <div className="absolute -inset-3 bg-gradient-to-br from-accent/30 to-primary/30 rounded-3xl blur-xl" />
              <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5]">
                <img
                  src="/images/hero-home-on-land.webp"
                  alt="A small home on a wooded lot"
                  width={880}
                  height={880}
                  className="w-full h-full object-cover"
                  fetchPriority="high"
                />
              </div>
              <div className="absolute -bottom-5 left-4 sm:-left-5 bg-background text-foreground border border-border rounded-xl shadow-xl p-3 flex items-center gap-2.5 max-w-[240px]">
                <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                  <Gavel className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Auctions &amp; land bank</div>
                  <div className="text-[11px] text-muted-foreground">Ways in most people never hear about</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
