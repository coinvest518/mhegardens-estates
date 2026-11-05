import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { GUIDES } from "@/lib/education"
import { FAQ } from "@/lib/faq"

export function EducationGrid() {
  return (
    <section id="education" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 reveal">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">Learn first</p>
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Guides on land, auctions and buying</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Plain-English guides on tax deeds, land auctions and first-time buyer programs.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 reveal-stagger">
          {GUIDES.map((g) => (
            <Card key={g.id} className="hover-lift border border-border bg-card flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="p-2.5 bg-primary/10 rounded-xl w-fit">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wider rounded-full px-2.5 py-1 ${
                      g.gated ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                    }`}
                  >
                    {g.gated ? "In the $20 bundle" : "Free"}
                  </span>
                </div>
                <CardTitle className="text-base leading-snug">{g.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-3">
                <p className="text-sm text-muted-foreground text-pretty flex-1 line-clamp-5">{g.summary}</p>
                <Link
                  href={`/education#${g.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80"
                >
                  {g.gated ? "See what's inside" : "Read the guide"} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mb-16">
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Link href="/education">
              All guides <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="max-w-3xl mx-auto" id="faq">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Common questions</h3>
          <Accordion type="single" collapsible className="bg-card border border-border rounded-2xl px-6">
            {FAQ.map((item, idx) => (
              <AccordionItem key={item.q} value={`item-${idx}`}>
                <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-pretty">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
