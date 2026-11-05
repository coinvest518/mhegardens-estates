import Link from "next/link"
import { CalendarCheck, Languages } from "lucide-react"
import { SITE, consultHref } from "@/lib/site"

export function MeetAgent() {
  const { name, company, languages, bookingUrl } = SITE.agent
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")

  return (
    <section id="agent" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 flex flex-col sm:flex-row gap-8 items-center reveal">
          {/* Placeholder until a headshot is added */}
          <div
            className="flex-shrink-0 w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-white"
            aria-hidden
          >
            {initials}
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-2">Meet our agent</p>
            <h2 className="text-3xl font-bold text-foreground mb-1">{name}</h2>
            <p className="text-muted-foreground mb-3">Real estate agent · {company}</p>
            <p className="inline-flex items-center gap-2 text-sm text-foreground mb-4">
              <Languages className="h-4 w-4 text-primary" /> Speaks {languages}
            </p>
            <p className="text-muted-foreground text-pretty mb-6">
              When you&apos;re ready to buy or sell the regular way, {name.split(" ")[0]} works with you from
              the first showing to the closing table.
            </p>
            <Link
              href={bookingUrl ?? consultHref()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <CalendarCheck className="h-4 w-4" /> Book a free consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
