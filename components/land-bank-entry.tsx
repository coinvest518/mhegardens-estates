"use client"

import { Lock, MapPin, MessageSquare } from "lucide-react"
import type { LandBankListing } from "@/lib/land-bank-parse"

export const KIND_LABEL: Record<LandBankListing["kind"], string> = {
  lot: "Vacant lot",
  building: "House or building",
  commercial: "Commercial",
  other: "Property",
}

export const money = (n: number | null) => (n === null ? "Ask" : `$${n.toLocaleString("en-US")}`)

export function lotSize(l: Pick<LandBankListing, "widthFt" | "lengthFt" | "acres">): string | null {
  const dims = l.widthFt && l.lengthFt ? `${l.widthFt} by ${l.lengthFt} ft` : null
  const acres = l.acres ? `${l.acres} acres` : null
  return [dims, acres].filter(Boolean).join(", ") || null
}

export const mapLink = (l: Pick<LandBankListing, "address" | "city">) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${l.address}, ${l.city}, NY`)}`

/** Open the Land Bank help popup with this property already written in. */
export function askAbout(l: LandBankListing, cycle: string | null) {
  window.dispatchEvent(
    new CustomEvent("mhe:contact", {
      detail: {
        topic: "landbank",
        message: `I'm interested in ${l.address}, ${l.city} (parcel ${l.parcelId})${cycle ? ` on the ${cycle} Land Bank list` : ""}.`,
      },
    })
  )
}

/** A full property row, used for the listings everyone can see. */
export function LandBankEntry({ listing: l, cycle }: { listing: LandBankListing; cycle: string | null }) {
  const size = lotSize(l)
  return (
    <article
      className="grid gap-4 border-t border-border py-8 md:grid-cols-[250px_1fr] md:gap-10"
      data-testid="listing"
      aria-labelledby={`l-${l.parcelId}`}
    >
      <div>
        <p className="text-sm font-semibold text-leaf">{KIND_LABEL[l.kind]}</p>
        <p className="mt-1 font-display text-[1.75rem] font-bold leading-tight text-pine md:text-3xl">{money(l.price)}</p>
        {l.packageSize && <p className="mt-1 text-sm text-slate">for all {l.packageSize} lots together</p>}
        {size && <p className="mt-2 text-sm text-slate">{size}</p>}
      </div>
      <div className="min-w-0">
        <h3 id={`l-${l.parcelId}`} className="text-xl font-bold text-ink md:text-2xl">
          {l.address}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-slate">
          <MapPin className="h-4 w-4 flex-shrink-0 text-leaf" aria-hidden />
          {l.neighborhood && l.neighborhood !== l.city ? `${l.neighborhood}, ${l.city}` : l.city}
        </p>
        {l.details && <p className="mt-3 text-ink">{l.details}</p>}
        {l.packageNote && (
          <p className="mt-3 rounded-lg bg-[#fbeab9] px-3 py-2 text-[15px] text-ink ring-1 ring-inset ring-goldenrod">
            {l.packageNote}.
          </p>
        )}
        <p className="mt-3 text-sm text-slate">Parcel {l.parcelId}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button
            onClick={() => askAbout(l, cycle)}
            className="inline-flex items-center gap-2 rounded-xl bg-leaf px-4 py-2.5 font-semibold text-white hover:bg-pine"
          >
            <MessageSquare className="h-4 w-4" aria-hidden />
            Ask about this property
          </button>
          <a
            href={mapLink(l)}
            target="_blank"
            rel="noreferrer noopener"
            className="font-semibold text-pine underline decoration-goldenrod decoration-2 underline-offset-4 hover:text-leaf"
          >
            See it on a map<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </article>
  )
}

/** One row of the compact list members see. */
export function LandBankRow({ listing: l, cycle }: { listing: LandBankListing; cycle: string | null }) {
  const size = lotSize(l)
  return (
    <li className="grid gap-x-6 gap-y-1 border-t border-border py-4 sm:grid-cols-[1fr_auto] sm:items-center" data-testid="listing-row">
      <div className="min-w-0">
        <p className="font-semibold text-ink">
          {l.address}
          <span className="font-normal text-slate"> — {l.neighborhood && l.neighborhood !== l.city ? `${l.neighborhood}, ${l.city}` : l.city}</span>
        </p>
        <p className="text-sm text-slate">
          {KIND_LABEL[l.kind]}
          {size ? `, ${size}` : ""}
          {l.details ? `. ${l.details}` : ""}
          {l.packageNote ? `. ${l.packageNote}` : ""}
          <span className="ml-1 whitespace-nowrap">(parcel {l.parcelId})</span>
        </p>
      </div>
      <div className="flex items-center gap-4 sm:justify-end">
        <p className="min-w-[5.5rem] font-display text-xl font-bold text-pine sm:text-right">
          {money(l.price)}
          {l.packageSize && <span className="block text-xs font-normal text-slate">all {l.packageSize} lots</span>}
        </p>
        <button onClick={() => askAbout(l, cycle)} className="rounded-lg px-3 py-2 text-sm font-semibold text-leaf ring-1 ring-inset ring-leaf hover:bg-mist">
          Ask about it
        </button>
        <a
          href={mapLink(l)}
          target="_blank"
          rel="noreferrer noopener"
          className="text-sm font-semibold text-pine underline decoration-goldenrod underline-offset-4"
        >
          Map<span className="sr-only"> for {l.address} (opens in a new tab)</span>
        </a>
      </div>
    </li>
  )
}

/** A property a signed-out visitor can't see yet: price, area and size show, the address doesn't. */
export function LockedRow({
  price,
  neighborhood,
  city,
  acres,
  kind,
  packageSize,
}: {
  price: number | null
  neighborhood: string
  city: string
  acres: number | null
  kind: LandBankListing["kind"]
  packageSize?: number
}) {
  return (
    <li className="grid gap-x-6 gap-y-1 border-t border-border py-4 sm:grid-cols-[1fr_auto] sm:items-center" data-testid="listing-locked">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 flex-shrink-0 text-leaf" aria-hidden />
          <span className="h-4 w-40 rounded bg-mist" aria-hidden />
          <span className="text-slate">— {neighborhood && neighborhood !== city ? `${neighborhood}, ${city}` : city}</span>
        </div>
        <p className="mt-1 text-sm text-slate">
          {KIND_LABEL[kind]}
          {acres ? `, ${acres} acres` : ""}
        </p>
      </div>
      <p className="font-display text-xl font-bold text-pine sm:text-right">
        {money(price)}
        {packageSize && <span className="block text-xs font-normal text-slate">all {packageSize} lots</span>}
      </p>
    </li>
  )
}
