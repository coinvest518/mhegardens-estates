import { Qualifier } from "@/components/qualifier/qualifier"
import { SITE } from "@/lib/site"

export function QualifierSection() {
  return (
    <section id="consult" className="py-16 sm:py-20 px-5 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-10 items-start">
        <div className="lg:col-span-2">
          <h2 className="text-3xl sm:text-4xl font-bold text-pine text-balance">See if you qualify</h2>
          <p className="mt-3 text-lg text-slate text-pretty">
            A few quick questions, then your best path and a free 30-minute call. No credit check.
          </p>
          <p className="mt-4 text-slate">Agent help in {SITE.agent.languages}.</p>
        </div>
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-8 shadow-[0_1px_0_rgba(24,61,51,0.04)]" data-testid="qualifier-inline">
            <Qualifier />
          </div>
        </div>
      </div>
    </section>
  )
}
