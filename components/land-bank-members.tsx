"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Loader2, Lock, Search } from "lucide-react"
import { AuthDialog } from "@/components/auth-dialog"
import { useAuth } from "@/components/auth-provider"
import { KIND_LABEL, LandBankRow, LockedRow } from "@/components/land-bank-entry"
import type { LandBankListing } from "@/lib/land-bank-parse"

type Teaser = {
  key: string
  neighborhood: string
  city: string
  price: number | null
  acres: number | null
  kind: LandBankListing["kind"]
  packageSize?: number
}

const PREVIEW_ROWS = 8
const MAX_PRICES = [1000, 5000, 15000, 50000]

/**
 * The rest of this month's Land Bank list. Signed out: a locked preview and a free sign-up.
 * Signed in: the whole list from /api/land-bank, with search and filters.
 */
export function LandBankMembers({
  teasers,
  lockedCount,
  total,
  cycle,
}: {
  teasers: Teaser[]
  lockedCount: number
  total: number
  cycle: string | null
}) {
  const { user, loading, configured } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup")
  const [listings, setListings] = useState<LandBankListing[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [q, setQ] = useState("")
  const [kind, setKind] = useState<LandBankListing["kind"] | "all">("all")
  const [city, setCity] = useState("all")
  const [maxPrice, setMaxPrice] = useState<number | null>(null)

  const load = useCallback(async () => {
    if (!user) return
    setError(null)
    try {
      const token = await user.getIdToken()
      const res = await fetch("/api/land-bank", { headers: { authorization: `Bearer ${token}` }, cache: "no-store" })
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as { listings: LandBankListing[] }
      setListings(data.listings)
    } catch {
      setError("We couldn't load the full list. Check your connection and try again.")
    }
  }, [user])

  useEffect(() => {
    if (user) void load()
    else setListings(null)
  }, [user, load])

  const kinds = useMemo(() => [...new Set((listings ?? []).map((l) => l.kind))], [listings])
  const cities = useMemo(() => [...new Set((listings ?? []).map((l) => l.city))].sort(), [listings])
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return (listings ?? []).filter(
      (l) =>
        (kind === "all" || l.kind === kind) &&
        (city === "all" || l.city === city) &&
        (maxPrice === null || (l.price !== null && l.price <= maxPrice)) &&
        (!needle || `${l.address} ${l.neighborhood} ${l.city} ${l.parcelId}`.toLowerCase().includes(needle))
    )
  }, [listings, q, kind, city, maxPrice])

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
    if (!listings) {
      return (
        <p className="flex items-center gap-2 py-10 text-slate" role="status">
          <Loader2 className="h-5 w-5 animate-spin text-leaf" aria-hidden />
          Loading the full list…
        </p>
      )
    }
    const field = "h-11 rounded-xl border border-input bg-white px-3 text-[15px] text-ink"
    return (
      <div data-testid="listings-member">
        <h2 className="text-2xl font-bold text-pine md:text-3xl">Every property on the {cycle ?? "current"} list</h2>
        <div className="mt-5 grid gap-3 rounded-2xl bg-mist p-4 md:grid-cols-[1fr_auto_auto] md:items-end">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-ink">Search</span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate" aria-hidden />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Street, neighborhood or parcel"
                className={`${field} w-full pl-9`}
              />
            </span>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-ink">Town or city</span>
            <select value={city} onChange={(e) => setCity(e.target.value)} className={`${field} w-full md:w-44`}>
              <option value="all">All</option>
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-ink">Price up to</span>
            <select
              value={maxPrice ?? ""}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
              className={`${field} w-full md:w-40`}
            >
              <option value="">Any price</option>
              {MAX_PRICES.map((p) => (
                <option key={p} value={p}>
                  ${p.toLocaleString("en-US")}
                </option>
              ))}
            </select>
          </label>
          {kinds.length > 1 && (
            <div className="flex flex-wrap gap-2 md:col-span-3" role="group" aria-label="Type of property">
              {(["all", ...kinds] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setKind(k)}
                  aria-pressed={kind === k}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold ring-1 ring-inset ${
                    kind === k ? "bg-leaf text-white ring-leaf" : "bg-white text-ink ring-border hover:ring-leaf"
                  }`}
                >
                  {k === "all" ? "All types" : KIND_LABEL[k]}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="mt-4 text-slate" role="status">
          Showing {shown.length} of {listings.length}, cheapest first.
        </p>
        {shown.length ? (
          <ul className="mt-2">
            {shown.map((l) => (
              <LandBankRow key={l.parcelId} listing={l} cycle={cycle} />
            ))}
          </ul>
        ) : (
          <p className="mt-6 rounded-xl bg-paper p-5 text-ink ring-1 ring-inset ring-border">
            Nothing matches those filters. Try a higher price or another town.
          </p>
        )}
      </div>
    )
  }

  const openAuth = (mode: "signup" | "signin") => {
    setAuthMode(mode)
    setAuthOpen(true)
  }

  return (
    <div data-testid="listings-locked">
      <h2 className="text-2xl font-bold text-pine md:text-3xl">{lockedCount} more on this month&apos;s list</h2>
      <p className="mt-2 max-w-2xl text-slate text-pretty">
        Addresses and parcel numbers for every property, with search by town and price, are free with an account.
      </p>
      <ul className="mt-4">
        {teasers.slice(0, PREVIEW_ROWS).map(({ key, ...t }) => (
          <LockedRow key={key} {...t} />
        ))}
      </ul>
      {lockedCount > PREVIEW_ROWS && (
        <p className="border-t border-border pt-4 text-slate">…and {lockedCount - PREVIEW_ROWS} more.</p>
      )}

      <div className="mt-6 rounded-2xl bg-pine p-7 text-white md:p-10">
        <div className="flex items-start gap-4">
          <span className="hidden rounded-xl bg-white/10 p-3 sm:block" aria-hidden>
            <Lock className="h-6 w-6 text-goldenrod" />
          </span>
          <div>
            <h3 className="text-2xl font-bold text-white md:text-3xl">See all {total} properties</h3>
            <p className="mt-2 max-w-xl text-[#d6e3dc] text-pretty">
              A free account unlocks the whole list, plus every down payment program we track.
            </p>
            {loading ? (
              <div className="mt-6 h-12" aria-hidden />
            ) : configured ? (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={() => openAuth("signup")}
                  className="inline-flex items-center justify-center rounded-xl bg-goldenrod px-6 py-3 font-semibold text-ink hover:bg-[#f4c94e]"
                  data-testid="listings-unlock"
                >
                  Create a free account
                </button>
                <button onClick={() => openAuth("signin")} className="px-2 py-2 font-semibold text-white underline underline-offset-4">
                  I have an account — sign in
                </button>
              </div>
            ) : (
              <Link
                href="/#contact-landbank"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-goldenrod px-6 py-3 font-semibold text-ink hover:bg-[#f4c94e]"
              >
                Get help with the Land Bank
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
          signupDescription={`Free. Unlocks all ${total} properties on this month's Land Bank list and every down payment program we track.`}
        />
      )}
    </div>
  )
}
