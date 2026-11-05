"use client"

import { useCallback, useEffect, useState } from "react"
import { ExternalLink, Loader2, Lock } from "lucide-react"
import { AuctionEventCard } from "@/components/auction-event-card"
import { AuthDialog } from "@/components/auth-dialog"
import { useAuth } from "@/components/auth-provider"
import type { AuctionEvent, AuctionTeaser } from "@/lib/auction-types"
import { SITE } from "@/lib/site"

type Source = { name: string; href: string; what: string; group: string }

/**
 * The rest of the auctions. Signed out: which auctions and when, plus a free sign-up.
 * Signed in: every auction's deadlines, promo codes and links, and the sites we check — from /api/auctions.
 */
export function AuctionMembers({ teasers, sourceCount }: { teasers: AuctionTeaser[]; sourceCount: number }) {
  const { user, loading, configured } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup")
  const [data, setData] = useState<{ events: AuctionEvent[]; sources: Source[] } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!user) return
    setError(null)
    try {
      const token = await user.getIdToken()
      const res = await fetch("/api/auctions", { headers: { authorization: `Bearer ${token}` }, cache: "no-store" })
      if (!res.ok) throw new Error(String(res.status))
      setData(await res.json())
    } catch {
      setError("We couldn't load the member details. Check your connection and try again.")
    }
  }, [user])

  useEffect(() => {
    if (user) void load()
    else setData(null)
  }, [user, load])

  if (user) {
    if (error)
      return (
        <div className="rounded-2xl bg-paper p-6 ring-1 ring-inset ring-border" role="alert">
          <p className="text-ink">{error}</p>
          <button onClick={() => void load()} className="mt-3 font-semibold text-leaf underline underline-offset-4">
            Try again
          </button>
        </div>
      )
    if (!data)
      return (
        <p className="flex items-center gap-2 py-6 text-slate" role="status">
          <Loader2 className="h-5 w-5 animate-spin text-leaf" aria-hidden />
          Loading every auction…
        </p>
      )
    const groups = [...new Set(data.sources.map((s) => s.group))]
    return (
      <div className="space-y-10" data-testid="auctions-member">
        {data.events.length > 1 && (
          <div className="grid gap-5">
            <p className="text-sm font-semibold text-ink">Also coming up</p>
            {data.events.slice(1).map((e) => (
              <AuctionEventCard key={e.id} event={e} />
            ))}
          </div>
        )}
        <section className="rounded-2xl bg-white p-6 ring-1 ring-inset ring-border md:p-8" aria-labelledby="sources" data-testid="sources">
          <h3 id="sources" className="text-2xl font-bold text-pine">
            The sites we use
          </h3>
          <p className="mt-1 text-slate">Where we look for auctions, land bank lots and foreclosed homes.</p>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            {groups.map((g) => (
              <div key={g}>
                <p className="font-semibold text-leaf">{g}</p>
                <ul className="mt-2 space-y-4">
                  {data.sources
                    .filter((s) => s.group === g)
                    .map((s) => (
                      <li key={s.href}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1.5 font-semibold text-pine underline decoration-goldenrod decoration-2 underline-offset-4 hover:text-leaf"
                        >
                          {s.name}
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                        <p className="mt-1 text-sm text-slate text-pretty">{s.what}</p>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 border-t border-border pt-5 text-[15px] text-slate">
            Want more? Our{" "}
            <a href={SITE.community.url} target="_blank" rel="noreferrer noopener" className="font-semibold text-leaf underline underline-offset-4">
              {SITE.community.name} community<span className="sr-only"> (opens in a new tab)</span>
            </a>{" "}
            is on Buy Me a Coffee.
          </p>
        </section>
      </div>
    )
  }

  const openAuth = (mode: "signup" | "signin") => {
    setAuthMode(mode)
    setAuthOpen(true)
  }

  return (
    <div data-testid="auctions-locked">
      {teasers.length > 0 && (
        <>
          <p className="text-sm font-semibold text-ink">Also coming up</p>
          <ul className="mt-2 border-t border-border">
            {teasers.map((t) => (
              <li key={t.id} className="grid gap-1 border-b border-border py-4 sm:grid-cols-[1fr_auto] sm:items-center" data-testid="auction-locked">
                <div>
                  <p className="font-semibold text-ink">{t.title}</p>
                  <p className="text-sm text-slate">
                    {t.county}. Opens {t.openDate}.
                  </p>
                </div>
                <p className="flex items-center gap-2 text-sm text-slate sm:justify-end">
                  <Lock className="h-4 w-4 text-leaf" aria-hidden />
                  Closes {t.closeDate}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="mt-6 rounded-2xl bg-pine p-7 text-white md:p-9">
        <h3 className="text-2xl font-bold text-white">Free members see the rest</h3>
        <ul className="mt-3 space-y-1.5 text-[#d6e3dc]">
          <li>Registration deadlines and links for every auction</li>
          <li>Promo codes that skip the one-time $10 bidder fee</li>
          <li>The {sourceCount} sites we check for auctions, land bank lots and foreclosed homes</li>
          <li>The full Land Bank list and every down payment program</li>
        </ul>
        {loading ? (
          <div className="mt-6 h-12" aria-hidden />
        ) : configured ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={() => openAuth("signup")}
              className="inline-flex items-center justify-center rounded-xl bg-goldenrod px-6 py-3 font-semibold text-ink hover:bg-[#f4c94e]"
              data-testid="auctions-unlock"
            >
              Create a free account
            </button>
            <button onClick={() => openAuth("signin")} className="px-2 py-2 font-semibold text-white underline underline-offset-4">
              I have an account — sign in
            </button>
          </div>
        ) : null}
      </div>
      {configured && (
        <AuthDialog
          key={authMode}
          open={authOpen}
          onOpenChange={setAuthOpen}
          initialMode={authMode}
          signupDescription="Free. Unlocks every auction's deadlines and promo codes, the sites we use, the full Land Bank list and every down payment program."
        />
      )}
    </div>
  )
}
