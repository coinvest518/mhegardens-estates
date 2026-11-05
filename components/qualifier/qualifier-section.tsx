import { CheckCircle2 } from "lucide-react"
import { Qualifier } from "@/components/qualifier/qualifier"
import { SITE } from "@/lib/site"

export function QualifierSection() {
  return (
    <section id="consult" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 scroll-mt-16">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-10 items-start">
        <div className="lg:col-span-2 reveal">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">Free consultation</p>
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">See if you qualify</h2>
          <p className="text-muted-foreground text-pretty mb-6">
            Answer a few quick questions and we&apos;ll show you your best path — then book your free 30-minute call.
            No credit check.
          </p>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> Takes about a minute</li>
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> Agent help in {SITE.agent.languages}</li>
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> Credit help if you need it first</li>
          </ul>
        </div>

        <div className="lg:col-span-3 reveal" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8" data-testid="qualifier-inline">
            <Qualifier />
          </div>
        </div>
      </div>
    </section>
  )
}
