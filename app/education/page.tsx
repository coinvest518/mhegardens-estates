import type { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { SiteFooter } from "@/components/site-footer"
import { GuideStore } from "@/components/guide-store"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BUNDLE } from "@/lib/education"
import { FAQ } from "@/lib/faq"
import { LESSONS } from "@/lib/learn"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: `Learn: tax deeds, auctions, land banks and guides — ${SITE.name}`,
  description:
    "Free lessons on tax liens vs. tax deeds, online tax auctions and land banks in New York, plus ebooks on land investing and wholesaling.",
}

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        <section className="px-5 pb-14 pt-32 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h1 className="max-w-3xl text-4xl font-bold text-pine text-balance md:text-6xl">Learn before you buy.</h1>
            <p className="mt-6 max-w-2xl text-lg text-slate text-pretty md:text-xl">
              Free lessons on how tax-foreclosed property is sold in New York, and guides you can keep. Questions while
              you read? <Link href="/#ask" className="font-semibold text-leaf underline underline-offset-4">Ask our guide</Link>.
            </p>
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-6 lg:px-8" aria-labelledby="lessons">
          <div className="mx-auto max-w-5xl">
            <h2 id="lessons" className="text-3xl font-bold text-pine">
              Free lessons
            </h2>
            <ol className="mt-6 border-t border-border" data-testid="lesson-list">
              {LESSONS.map((l, i) => (
                <li key={l.slug} className="border-b border-border">
                  <Link href={`/learn/${l.slug}`} className="group grid gap-x-6 gap-y-1 py-6 sm:grid-cols-[3rem_1fr_auto] sm:items-baseline">
                    <span className="font-display text-2xl font-bold text-goldenrod" aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block text-xl font-bold text-ink group-hover:text-leaf md:text-2xl">{l.title}</span>
                      <span className="mt-1 block text-slate text-pretty">{l.description}</span>
                    </span>
                    <span className="text-sm text-slate">{l.minutes} min read</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-mist px-5 py-20 sm:px-6 lg:px-8" aria-labelledby="store">
          <div className="mx-auto max-w-5xl">
            <h2 id="store" className="text-3xl font-bold text-pine">
              Guides you can keep
            </h2>
            <p className="mt-2 max-w-2xl text-slate text-pretty">
              Two are free. The bundle is three ebooks for ${BUNDLE.priceUSD}, sold through Buy Me a Coffee.
            </p>
            <div className="mt-8">
              <GuideStore />
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-pine">Common questions</h2>
            <Accordion type="single" collapsible className="mt-6 border-t border-border">
              {FAQ.map((item, idx) => (
                <AccordionItem key={item.q} value={`item-${idx}`} className="border-border">
                  <AccordionTrigger className="py-4 text-left text-base font-semibold text-ink">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-[15px] leading-relaxed text-slate text-pretty">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
