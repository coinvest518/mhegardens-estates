import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BUNDLE, GUIDES } from "@/lib/education"
import { FAQ } from "@/lib/faq"

export function EducationGrid() {
  return (
    <section id="education" className="py-16 sm:py-20 px-5 sm:px-6 lg:px-8 bg-mist scroll-mt-20">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-pine text-balance">Read up first</h2>
          <p className="mt-3 text-lg text-slate text-pretty">
            Plain-English guides on tax deeds, cheap land and first-time buyer programs. One is free; three come in a $
            {BUNDLE.priceUSD} bundle.
          </p>
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {GUIDES.map((g) => (
              <li key={g.id}>
                <Link href={`/education#${g.id}`} className="flex items-start justify-between gap-4 py-4 hover:text-leaf">
                  <span className="font-semibold text-ink">{g.title}</span>
                  <span
                    className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      g.gated ? "bg-white text-slate border border-border" : "bg-leaf text-white"
                    }`}
                  >
                    {g.gated ? "Bundle" : "Free"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/education" className="mt-5 inline-block font-semibold text-leaf underline underline-offset-4 hover:text-pine">
            See all guides
          </Link>
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
