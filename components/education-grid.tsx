import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BUNDLE } from "@/lib/education"
import { LESSONS } from "@/lib/learn"
import { FAQ } from "@/lib/faq"

export function EducationGrid() {
  return (
    <section id="education" className="py-16 sm:py-20 px-5 sm:px-6 lg:px-8 bg-mist scroll-mt-20">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-pine text-balance">Read up first</h2>
          <p className="mt-3 text-lg text-slate text-pretty">
            Free lessons on how tax-foreclosed property is sold in New York, plus guides you can keep.
          </p>
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {LESSONS.map((l) => (
              <li key={l.slug}>
                <Link href={`/learn/${l.slug}`} className="flex items-start justify-between gap-4 py-4 hover:text-leaf">
                  <span className="font-semibold text-ink">{l.title}</span>
                  <span className="flex-shrink-0 text-sm text-slate">{l.minutes} min</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/education" className="font-semibold text-leaf underline underline-offset-4 hover:text-pine">
              All lessons and guides
            </Link>
            <a href={BUNDLE.buyLink} target="_blank" rel="noreferrer noopener" className="font-semibold text-leaf underline underline-offset-4 hover:text-pine">
              Ebook bundle, ${BUNDLE.priceUSD}<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>

        <div id="faq">
          <h2 className="text-3xl sm:text-4xl font-bold text-pine text-balance">Common questions</h2>
          <Accordion type="single" collapsible className="mt-6 border-t border-border">
            {FAQ.map((item, idx) => (
              <AccordionItem key={item.q} value={`item-${idx}`} className="border-border">
                <AccordionTrigger className="text-left text-base font-semibold text-ink py-4">{item.q}</AccordionTrigger>
                <AccordionContent className="text-slate text-[15px] leading-relaxed text-pretty">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
