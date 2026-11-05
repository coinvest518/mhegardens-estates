import Link from "next/link"
import { ArrowRight, Check, Home, Tag, TrendingUp } from "lucide-react"
import { consultHref } from "@/lib/site"

const GROUPS = [
  {
    id: "buyers",
    icon: Home,
    title: "Buyers",
    image: "/images/home-by-the-water.webp",
    imageAlt: "A small home with a deck by the water",
    points: [
      "First-time buyers and people buying again",
      "Homes, land, or land to build on",
      "Mortgage, matching programs, auctions or land bank",
    ],
    cta: "I want to buy",
  },
  {
    id: "sellers",
    icon: Tag,
    title: "Sellers",
    image: "/images/home-with-a-view.webp",
    imageAlt: "A small home with a mountain view",
    points: [
      "Houses or vacant land you want to sell",
      "Behind on taxes or payments, or inherited a property",
      "List with our agent or get a fast, as-is offer",
    ],
    cta: "I want to sell",
  },
  {
    id: "investors",
    icon: TrendingUp,
    title: "Investors",
    image: null,
    imageAlt: "",
    points: [
      "Auction research and registration help",
      "Land bank and off-market properties",
      "Fix-and-flip and rental numbers before you buy",
    ],
    cta: "I want to invest",
  },
]

export function WhoWeHelp() {
  return (
    <section id="who" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 reveal">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">Who we help</p>
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Buying, selling or investing</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 reveal-stagger">
          {GROUPS.map(({ id, icon: Icon, title, image, imageAlt, points, cta }) => (
            <div key={id} id={id} className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden scroll-mt-24">
              {image ? (
                <img src={image} alt={imageAlt} width={760} height={760} loading="lazy" className="aspect-[16/10] w-full object-cover" />
              ) : (
                <div className="aspect-[16/10] w-full bg-gradient-to-br from-secondary to-primary/60 flex items-center justify-center">
                  <TrendingUp className="h-14 w-14 text-white/70" aria-hidden />
                </div>
              )}
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">{title}</h3>
                </div>
                <ul className="space-y-2 flex-1">
                  {points.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={consultHref()}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10"
                >
                  {cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
