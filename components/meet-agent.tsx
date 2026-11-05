import Link from "next/link"
import { Languages } from "lucide-react"
import { SITE } from "@/lib/site"

export function MeetAgent() {
  const { name, company, languages, bookingUrl } = SITE.agent
  const first = name.split(" ")[0]
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")

  return (
    <section id="agent" className="py-16 sm:py-20 px-5 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-7 sm:gap-10 items-start">
        {/* Placeholder until a headshot is added */}
        <div
          className="flex-shrink-0 flex h-28 w-28 sm:h-36 sm:w-36 items-center justify-center rounded-2xl bg-pine font-display text-4xl font-bold text-goldenrod"
          aria-hidden
        >
          {initials}
        </div>
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-pine">Meet {first}, our partner agent</h2>
          <p className="mt-2 text-slate">
            {name}, real estate agent with {company}
          </p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-mist px-3 py-1.5 text-sm font-medium text-pine">
            <Languages className="h-4 w-4" aria-hidden /> Speaks {languages}
          </p>
          <p className="mt-4 text-lg text-ink text-pretty">
            When you&apos;re ready to buy or sell the regular way, {first} works with you from the first showing to the
            closing table.
          </p>
          <Link
            href={bookingUrl ?? "/#contact-agent"}
            {...(bookingUrl ? { target: "_blank", rel: "noreferrer noopener" } : {})}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-leaf px-6 py-3.5 font-semibold text-white hover:bg-pine"
          >
            Talk with {first}
          </Link>
        </div>
      </div>
    </section>
  )
}
