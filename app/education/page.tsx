import type { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { SiteFooter } from "@/components/site-footer"
import { EducationArticles } from "@/components/education-articles"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BUNDLE } from "@/lib/education"
import { FAQ } from "@/lib/faq"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: `Guides — ${SITE.name}`,
  description:
    "Plain-English guides on tax deeds, buying land for under $1,000, first-time buyer programs and wholesale contracts.",
}

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="relative">
        <section className="pt-32 pb-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-pine text-balance mb-6">
              Tax deeds, land auctions and first-time buying.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto mb-8">
              One guide is free. The other three come in a ${BUNDLE.priceUSD} bundle. Questions while you read?
              Ask our AI guide.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={BUNDLE.buyLink}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Get the bundle — ${BUNDLE.priceUSD}
              </a>
              <Link
                href="/#ask"
                className="inline-flex items-center justify-center rounded-lg border border-primary px-6 py-3 font-semibold text-primary hover:bg-primary/10"
              >
                Ask our guide a question
              </Link>
            </div>
          </div>
        </section>

        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <EducationArticles />
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-pine mb-8 text-center">Common questions</h2>
            <Accordion type="single" collapsible className="bg-card border border-border rounded-2xl px-6">
              {FAQ.map((item, idx) => (
                <AccordionItem key={item.q} value={`item-${idx}`}>
                  <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-pretty">{item.a}</AccordionContent>
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
