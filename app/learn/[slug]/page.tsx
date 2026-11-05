import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { SiteFooter } from "@/components/site-footer"
import { LESSONS, getLesson, type Block } from "@/lib/learn"
import { SITE } from "@/lib/site"

export function generateStaticParams() {
  return LESSONS.map((l) => ({ slug: l.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const lesson = getLesson((await params).slug)
  if (!lesson) return {}
  return { title: `${lesson.title} — ${SITE.name}`, description: lesson.description }
}

function BlockView({ block }: { block: Block }) {
  if ("p" in block) return <p className="text-lg leading-relaxed text-ink text-pretty">{block.p}</p>
  if ("note" in block)
    return <p className="rounded-xl bg-mist px-4 py-3 text-[15px] text-slate text-pretty">{block.note}</p>
  if ("list" in block)
    return (
      <ul className="space-y-3">
        {block.list.map((t) => (
          <li key={t} className="flex gap-3 text-lg leading-relaxed text-ink text-pretty">
            <span className="mt-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-goldenrod" aria-hidden />
            {t}
          </li>
        ))}
      </ul>
    )
  if ("steps" in block)
    return (
      <ol className="space-y-5">
        {block.steps.map((s, i) => (
          <li key={s.title} className="flex gap-4">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-pine font-display font-bold text-goldenrod" aria-hidden>
              {i + 1}
            </span>
            <div>
              <p className="text-lg font-semibold text-ink">{s.title}</p>
              <p className="mt-0.5 leading-relaxed text-slate text-pretty">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    )
  const { columns, rows } = block.table
  const hasRowHeads = columns[0] !== ""
  const table = (
    <table className="w-full border-collapse text-left text-[15px]">
      <thead>
        <tr className="border-b-2 border-pine">
          {hasRowHeads && <th className="py-2 pr-4" />}
          {columns.map((c, i) => (
            <th key={i} scope="col" className="py-2 pr-4 font-semibold text-pine">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label} className="border-b border-border align-top">
            <th scope="row" className="py-3 pr-4 font-semibold text-ink">
              {r.label}
            </th>
            {r.cells.map((c, i) => (
              <td key={i} className="py-3 pr-4 text-slate">
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
  // A comparison of several options reads better on a phone as one block per option.
  if (!hasRowHeads || columns.length < 3) return table
  return (
    <>
      <div className="hidden sm:block">{table}</div>
      <div className="space-y-4 sm:hidden">
        {columns.map((c, ci) => (
          <section key={c} className="rounded-2xl bg-white p-5 ring-1 ring-inset ring-border">
            <h3 className="font-display text-xl font-bold text-pine">{c}</h3>
            <dl className="mt-3 space-y-3">
              {rows.map((r) => (
                <div key={r.label}>
                  <dt className="text-sm font-semibold text-ink">{r.label}</dt>
                  <dd className="text-slate">{r.cells[ci]}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </>
  )
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const lesson = getLesson((await params).slug)
  if (!lesson) notFound()
  const updated = new Date(`${lesson.updated}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  const others = LESSONS.filter((l) => l.slug !== lesson.slug)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="px-5 pb-20 pt-28 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl" data-testid="lesson">
          <Link href="/education" className="text-sm font-semibold text-leaf underline underline-offset-4">
            All lessons
          </Link>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-pine text-balance md:text-5xl">{lesson.title}</h1>
          <p className="mt-4 text-xl text-slate text-pretty">{lesson.description}</p>
          <p className="mt-4 text-sm text-slate">
            {lesson.minutes} minute read. Checked {updated}.
          </p>

          <div className="mt-10 space-y-12">
            {lesson.sections.map((s) => (
              <section key={s.heading} aria-labelledby={`h-${s.heading}`}>
                <h2 id={`h-${s.heading}`} className="text-2xl font-bold text-pine md:text-3xl">
                  {s.heading}
                </h2>
                <div className="mt-4 space-y-5">
                  {s.blocks.map((b, i) => (
                    <BlockView key={i} block={b} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <Link
            href={lesson.next.href}
            className="group mt-14 flex items-center justify-between gap-4 rounded-2xl bg-pine p-6 text-white hover:bg-pine-deep"
            data-testid="lesson-next"
          >
            <span>
              <span className="block text-sm font-semibold text-goldenrod">Next</span>
              <span className="mt-1 block font-display text-xl font-bold md:text-2xl">{lesson.next.label}</span>
            </span>
            <ArrowRight className="h-6 w-6 flex-shrink-0 text-goldenrod transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>

          <section className="mt-12" aria-labelledby="sources">
            <h2 id="sources" className="text-lg font-bold text-ink">
              Sources
            </h2>
            <ul className="mt-3 space-y-2">
              {lesson.sources.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noreferrer noopener" className="text-[15px] text-leaf underline underline-offset-4 hover:text-pine">
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12 border-t border-border pt-8" aria-labelledby="more">
            <h2 id="more" className="text-lg font-bold text-ink">
              More lessons
            </h2>
            <ul className="mt-3 space-y-3">
              {others.map((l) => (
                <li key={l.slug}>
                  <Link href={`/learn/${l.slug}`} className="font-semibold text-pine underline decoration-goldenrod decoration-2 underline-offset-4 hover:text-leaf">
                    {l.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </main>
      <SiteFooter />
    </div>
  )
}
