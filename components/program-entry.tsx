import { ExternalLink, Lock, Mail, MapPin, Phone } from "lucide-react"
import { STATUS_LABEL, type Program, type ProgramStatus, type ProgramTeaser } from "@/lib/program-types"

const STATUS_STYLE: Record<ProgramStatus, string> = {
  open: "bg-leaf text-white",
  check: "bg-[#fbeab9] text-ink ring-1 ring-inset ring-goldenrod",
  closed: "bg-mist text-slate",
}

export function StatusBadge({ status }: { status: ProgramStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${STATUS_STYLE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  )
}

/** Left column of a program row: what kind of help, how much, and where. Shown for locked rows too. */
function AmountColumn({ kind, amount, amountNote, area }: Pick<Program, "kind" | "amount" | "amountNote" | "area">) {
  return (
    <div>
      <p className="text-sm font-semibold text-leaf">{kind}</p>
      <p className="mt-1 font-display text-[1.75rem] font-bold leading-tight text-pine text-balance md:text-3xl">{amount}</p>
      {amountNote && <p className="mt-1.5 text-sm text-slate text-pretty">{amountNote}</p>}
      <p className="mt-3 flex items-center gap-1.5 text-sm text-slate">
        <MapPin className="h-4 w-4 flex-shrink-0 text-leaf" aria-hidden />
        {area}
      </p>
    </div>
  )
}

export function ProgramEntry({ program: p }: { program: Program }) {
  return (
    <article
      className="grid gap-5 border-t border-border py-9 md:grid-cols-[250px_1fr] md:gap-10"
      data-testid={`program-${p.id}`}
      aria-labelledby={`program-${p.id}-name`}
    >
      <AmountColumn {...p} />
      <div className="min-w-0">
        <h3 id={`program-${p.id}-name`} className="text-xl font-bold text-ink md:text-2xl text-balance">
          {p.name}
        </h3>
        <p className="mt-1 text-slate">{p.org}</p>
        {(p.phone || p.email) && (
          <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[15px]">
            {p.phone && (
              <a href={`tel:${p.phone.replace(/[^0-9]/g, "").slice(0, 10)}`} className="inline-flex items-center gap-1.5 font-medium text-leaf hover:underline">
                <Phone className="h-4 w-4" aria-hidden />
                {p.phone}
              </a>
            )}
            {p.email && (
              <a href={`mailto:${p.email}`} className="inline-flex items-center gap-1.5 font-medium text-leaf hover:underline">
                <Mail className="h-4 w-4" aria-hidden />
                {p.email}
              </a>
            )}
          </p>
        )}

        <div className="mt-4 rounded-xl bg-paper p-4 ring-1 ring-inset ring-border">
          <StatusBadge status={p.status} />
          <p className="mt-2 text-[15px] text-ink text-pretty">{p.statusNote}</p>
        </div>

        <p className="mt-4 text-ink text-pretty leading-relaxed">{p.summary}</p>

        {p.eligibility.length > 0 && (
          <div className="mt-5">
            <h4 className="font-semibold text-ink">Who qualifies</h4>
            <ul className="mt-2 space-y-1.5">
              {p.eligibility.map((e) => (
                <li key={e} className="flex gap-2.5 text-slate text-pretty">
                  <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-goldenrod" aria-hidden />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        )}

        {p.howToApply && (
          <div className="mt-5">
            <h4 className="font-semibold text-ink">How to apply</h4>
            <p className="mt-1.5 text-slate text-pretty">{p.howToApply}</p>
          </div>
        )}

        {p.links.length > 0 && (
          <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {p.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 font-semibold text-pine underline decoration-goldenrod decoration-2 underline-offset-4 hover:text-leaf"
              >
                {l.label}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ))}
          </p>
        )}
      </div>
    </article>
  )
}

/** A program a signed-out visitor can't see yet: the amount and area show, the name and details don't. */
export function LockedProgramEntry({ teaser: t }: { teaser: ProgramTeaser }) {
  return (
    <article className="grid gap-5 border-t border-border py-8 md:grid-cols-[250px_1fr] md:gap-10" data-testid="program-locked">
      <AmountColumn {...t} />
      <div className="min-w-0">
        <div className="space-y-2.5" aria-hidden>
          <div className="h-6 w-4/5 max-w-md rounded-md bg-mist" />
          <div className="h-4 w-3/5 max-w-xs rounded-md bg-mist" />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <StatusBadge status={t.status} />
          <span className="inline-flex items-center gap-1.5 text-[15px] text-slate">
            <Lock className="h-4 w-4 text-leaf" aria-hidden />
            Name, who qualifies and how to apply are in the full list
          </span>
        </div>
      </div>
    </article>
  )
}
