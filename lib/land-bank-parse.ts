import { getDocumentProxy, getResolvedPDFJS } from "unpdf"

/** One property from the Albany County Land Bank's monthly For Sale List. */
export type LandBankListing = {
  parcelId: string
  neighborhood: string
  address: string
  city: string
  /** Asking price in dollars; for a package, the price for the whole package. */
  price: number | null
  priceText: string
  widthFt: number | null
  lengthFt: number | null
  acres: number | null
  /** Property class as printed, without extra details (e.g. "Residential Vacant Lot"). */
  propertyClass: string
  kind: "lot" | "building" | "commercial" | "other"
  /** Extra facts printed with the class (e.g. "3 BD / 1 BA · 1,100 sq ft · Built 2026"). */
  details?: string
  /** For lots that must be bought together. */
  packageNote?: string
  packageSize?: number
}

export type ParsedList = { cycle: string | null; listings: LandBankListing[] }

const COLUMNS = [
  { key: "parcelId", re: /^parcel\s*id/i },
  { key: "neighborhood", re: /^neighborhood/i },
  { key: "address", re: /^street\s*address/i },
  { key: "city", re: /^city$/i },
  { key: "price", re: /^asking\s*price/i },
  { key: "width", re: /^parcel\s*width/i },
  { key: "length", re: /^parcel\s*length/i },
  { key: "acres", re: /^parcel\s*acres/i },
  { key: "class", re: /^property\s*class/i },
] as const
type ColKey = (typeof COLUMNS)[number]["key"]

const PARCEL_RE = /^\d+(\.\d+)?-\d+-\d+(\.\d+)?$/
const MONTH_RE = /^(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}$/i

type Item = { s: string; x: number; y: number; w: number }

const num = (s: string | undefined): number | null => {
  const n = Number.parseFloat((s ?? "").replace(/[^0-9.]/g, ""))
  return Number.isFinite(n) && n > 0 ? n : null
}
const sentenceCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

function kindOf(cls: string): LandBankListing["kind"] {
  if (/commercial|industrial/i.test(cls)) return "commercial"
  if (/vacant\s*lot|\bland\b/i.test(cls)) return "lot"
  if (/building|family|house|home|structure|residential/i.test(cls)) return "building"
  return "other"
}

/**
 * Reads the Land Bank's For Sale List PDF. The table's columns are centered, so each piece of text
 * goes to the column whose heading center is nearest. Text on its own line (a second line of a cell,
 * or a package price spanning several rows) joins the nearest property row.
 */
export async function parseLandBankPdf(data: Uint8Array): Promise<ParsedList> {
  const pdfjs = await getResolvedPDFJS()
  const pdf = await getDocumentProxy(data)
  let cycle: string | null = null
  let centers: { key: ColKey; c: number }[] | null = null
  const rows: Record<ColKey, string>[] = []

  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n)
    const viewport = page.getViewport({ scale: 1 })
    const content = await page.getTextContent()
    const items: Item[] = []
    for (const raw of content.items as { str?: string; transform: number[]; width: number }[]) {
      const s = raw.str?.trim()
      if (!s) continue
      // Map into what you see on screen, so rotated (landscape) pages read left to right.
      const m = pdfjs.Util.transform(viewport.transform, raw.transform)
      items.push({ s, x: m[4], y: m[5], w: raw.width })
    }

    cycle ??= items.find((i) => MONTH_RE.test(i.s))?.s ?? null

    // Column headings on this page (the list repeats them on every page).
    const headerY = items.find((i) => COLUMNS[0].re.test(i.s))?.y
    if (headerY !== undefined) {
      const found = COLUMNS.map((col) => {
        const h = items.find((i) => Math.abs(i.y - headerY) <= 12 && col.re.test(i.s))
        return h ? { key: col.key, c: h.x + h.w / 2 } : null
      })
      if (found.every(Boolean)) centers = found as { key: ColKey; c: number }[]
    }
    if (!centers) continue
    const cols = centers

    const body = items.filter((i) => headerY === undefined || i.y > headerY + 4)
    // Group into lines.
    const lines: { y: number; items: Item[] }[] = []
    for (const it of [...body].sort((a, b) => a.y - b.y)) {
      const line = lines.find((l) => Math.abs(l.y - it.y) <= 3)
      if (line) line.items.push(it)
      else lines.push({ y: it.y, items: [it] })
    }
    const colOf = (it: Item): ColKey => {
      const mid = it.x + it.w / 2
      return cols.reduce((best, c) => (Math.abs(c.c - mid) < Math.abs(best.c - mid) ? c : best)).key
    }
    const isParcelLine = (l: { items: Item[] }) => l.items.some((i) => colOf(i) === "parcelId" && PARCEL_RE.test(i.s))
    const parcelLines = lines.filter(isParcelLine)
    const extra = new Map<number, Item[]>()
    for (const l of lines) {
      if (isParcelLine(l)) continue
      if (/^page \d+ of \d+$/i.test(l.items.map((i) => i.s).join(" "))) continue
      let best: { y: number } | null = null
      for (const p of parcelLines) if (!best || Math.abs(p.y - l.y) < Math.abs(best.y - l.y)) best = p
      if (best && Math.abs(best.y - l.y) <= 14) extra.set(best.y, [...(extra.get(best.y) ?? []), ...l.items])
    }
    for (const p of parcelLines) {
      const cells = Object.fromEntries(COLUMNS.map((c) => [c.key, ""])) as Record<ColKey, string>
      const all = [...p.items, ...(extra.get(p.y) ?? [])].sort((a, b) => a.y - b.y || a.x - b.x)
      for (const it of all) {
        const k = colOf(it)
        cells[k] = cells[k] ? `${cells[k]} ${it.s}` : it.s
      }
      rows.push(cells)
    }
  }

  const listings: LandBankListing[] = rows.map((r) => {
    const cls = r.class.replace(/\s+/g, " ").trim()
    const split = cls.match(/^(.*?\))\s+(\d.*)$/)
    const propertyClass = split ? split[1] : cls
    return {
      parcelId: r.parcelId.split(" ")[0],
      neighborhood: r.neighborhood.trim(),
      address: r.address.trim(),
      city: r.city.trim(),
      price: num(r.price.match(/\$\s*[\d,]+/)?.[0]),
      priceText: r.price.trim(),
      widthFt: num(r.width),
      lengthFt: num(r.length),
      acres: num(r.acres),
      propertyClass,
      kind: kindOf(propertyClass),
      ...(split ? { details: split[2].trim() } : {}),
    }
  })

  // Lots that must be bought together share one price and a note spread over their rows.
  const isPackagePart = (l: LandBankListing) => l.price === null || /package|must be|purchased as/i.test(l.propertyClass)
  for (let i = 0; i < listings.length; ) {
    if (!isPackagePart(listings[i])) {
      i++
      continue
    }
    let j = i
    while (j < listings.length && isPackagePart(listings[j])) j++
    const group = listings.slice(i, j)
    const note = group
      .map((g) => g.propertyClass)
      .filter((t) => t && /[a-z]/i.test(t))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()
    const price = group.find((g) => g.price !== null)?.price ?? null
    if (group.length > 1 || /package/i.test(note)) {
      for (const g of group) {
        g.price = price
        g.priceText = price ? `$${price.toLocaleString("en-US")}` : g.priceText
        g.packageNote = note ? sentenceCase(note) : "Sold as a package"
        g.packageSize = group.length
        g.propertyClass = /vacant\s*lot/i.test(note) ? "Residential Vacant Lot" : "Package"
        g.kind = kindOf(g.propertyClass)
      }
    }
    i = j
  }

  return { cycle: cycle ? sentenceCase(cycle.split(" ")[0]) + " " + cycle.split(" ")[1] : null, listings: listings.filter((l) => l.address) }
}
