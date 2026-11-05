"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, Lock } from "lucide-react"
import { AuthDialog } from "@/components/auth-dialog"
import { useAuth } from "@/components/auth-provider"
import { LockedProgramEntry, ProgramEntry } from "@/components/program-entry"
import { SECTION_TITLE, type Program, type ProgramTeaser } from "@/lib/program-types"

const SECTIONS: Program["section"][] = ["match", "grant", "closed"]

/**
 * The member half of the programs page. Signed out: locked rows plus a free sign-up.
 * Signed in: the full list, fetched from /api/programs with the user's Firebase token.
 */
export function MemberPrograms({ teasers, total }: { teasers: ProgramTeaser[]; total: number }) {
  const { user, loading, configured } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup")
  const [programs, setPrograms] = useState<Program[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!user) return
    setError(null)
    try {
      const token = await user.getIdToken()
      const res = await fetch("/api/programs", { headers: { authorization: `Bearer ${token}` }, cache: "no-store" })
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as { programs: Program[] }
      setPrograms(data.programs)
    } catch {
      setError("We couldn't load the full list. Check your connection and try again.")
    }
  }, [user])

  useEffect(() => {
    if (user) void load()
    else setPrograms(null)
  }, [user, load])

  const openAuth = (mode: "signup" | "signin") => {
    setAuthMode(mode)
    setAuthOpen(true)
  }

  // Signed in: the full list, grouped.
  if (user) {
    if (error) {
      return (
        <div className="rounded-2xl bg-paper p-6 ring-1 ring-inset ring-border" role="alert">
          <p className="text-ink">{error}</p>
          <button onClick={() => void load()} className="mt-3 font-semibold text-leaf underline underline-offset-4">
            Try again
          </button>
        </div>
      )
    }
    if (!programs) {
      return (
        <p className="flex items-center gap-2 py-10 text-slate" role="status">
          <Loader2 className="h-5 w-5 animate-spin text-leaf" aria-hidden />
          Loading your full list…
        </p>
      )
    }
    return (
      <div data-testid="programs-member-list">
        {SECTIONS.map((section) => {
          const items = programs.filter((p) => p.section === section)
          if (!items.length) return null
          return (
            <section key={section} className="mt-14 first:mt-0" aria-labelledby={`section-${section}`}>
              <h2 id={`section-${section}`} className="text-2xl font-bold text-pine md:text-3xl">
                {SECTION_TITLE[section]}
              </h2>
              {section === "closed" && (
                <p className="mt-2 max-w-2xl text-slate text-pretty">
                  Out of money or between rounds. They're here so you don't waste a trip — and so you can ask to be told
                  when they reopen.
                </p>
              )}
              <div className="mt-4">
                {items.map((p) => (
                  <ProgramEntry key={p.id} program={p} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    )
  }

  // Signed out (or still checking): locked rows and the free sign-up.
  return (
    <div data-testid="programs-locked">
      <h2 className="text-2xl font-bold text-pine md:text-3xl">{teasers.length} more programs, free with an account</h2>
      <p className="mt-2 max-w-2xl text-slate text-pretty">
        City and county grants, more matched savings, and the programs that are out of money right now — with who
        qualifies, how to apply and who to call.
      </p>

      <div className="mt-4">
        {teasers.map((t) => (
          <LockedProgramEntry key={t.id} teaser={t} />
        ))}
      </div>

      <div className="mt-2 rounded-2xl bg-pine p-7 text-white md:p-10">
        <div className="flex items-start gap-4">
          <span className="hidden rounded-xl bg-white/10 p-3 sm:block" aria-hidden>
            <Lock className="h-6 w-6 text-goldenrod" />
          </span>
          <div>
            <h3 className="text-2xl font-bold text-white md:text-3xl">See all {total} programs</h3>
            <p className="mt-2 max-w-xl text-[#d6e3dc] text-pretty">
              A free account unlocks the full list. It also saves your answers when you check if you qualify.
            </p>
            {loading ? (
              <div className="mt-6 h-12" aria-hidden />
            ) : configured ? (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={() => openAuth("signup")}
                  className="inline-flex items-center justify-center rounded-xl bg-goldenrod px-6 py-3 font-semibold text-ink hover:bg-[#f4c94e]"
                  data-testid="programs-unlock"
                >
                  Create a free account
                </button>
                <button onClick={() => openAuth("signin")} className="px-2 py-2 font-semibold text-white underline underline-offset-4">
                  I have an account — sign in
                </button>
              </div>
            ) : (
              <Link
                href="/#consult"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-goldenrod px-6 py-3 font-semibold text-ink hover:bg-[#f4c94e]"
              >
                See if you qualify
              </Link>
            )}
          </div>
        </div>
      </div>

      {configured && (
        <AuthDialog
          key={authMode}
          open={authOpen}
          onOpenChange={setAuthOpen}
          initialMode={authMode}
          signupDescription={`Free. Unlocks all ${total} down payment programs and saves your answers when you check if you qualify.`}
        />
      )}
    </div>
  )
}
