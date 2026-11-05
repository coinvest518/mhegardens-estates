import { Download, ExternalLink } from "lucide-react"
import { PRODUCTS, type Product } from "@/lib/education"

const price = (p: Product) => (p.priceUSD === 0 ? "Free" : `$${p.priceUSD}`)

/** Product art, or a cover drawn from the title when there isn't any. */
function Cover({ product: p, className = "" }: { product: Product; className?: string }) {
  if (p.cover) {
    return (
      // Product art is hosted by Buy Me a Coffee; plain <img> keeps it as-is.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={p.cover.src}
        alt={p.cover.alt}
        width={p.cover.width}
        height={p.cover.height}
        loading="lazy"
        className={`h-auto w-full rounded-lg object-contain ${className}`}
      />
    )
  }
  return (
    <div
      className={`flex aspect-[2/3] w-full flex-col justify-between rounded-lg bg-pine p-4 text-white shadow-[0_8px_24px_-12px_rgba(16,48,42,0.6)] ${className}`}
      role="img"
      aria-label={`Cover of ${p.title}`}
    >
      <span className="text-xs font-semibold text-goldenrod">Free guide</span>
      <span className="font-display text-xl font-bold leading-tight text-balance">{p.title}</span>
      <span>
        <span className="block h-0.5 w-8 bg-goldenrod" />
        <span className="mt-2 block text-xs leading-snug text-[#cfe0d7]">{p.subtitle}</span>
      </span>
    </div>
  )
}

function BuyButton({ product: p, size = "md" }: { product: Product; size?: "md" | "lg" }) {
  const paid = p.priceUSD > 0
  const Icon = p.external ? ExternalLink : Download
  return (
    <a
      href={p.href}
      target="_blank"
      rel="noreferrer noopener"
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold ${
        size === "lg" ? "px-6 py-3.5 text-lg" : "px-5 py-3"
      } ${paid ? "bg-goldenrod text-ink hover:bg-[#f4c94e]" : "bg-leaf text-white hover:bg-pine"}`}
      data-testid={`buy-${p.id}`}
    >
      {p.cta}
      {paid ? ` — $${p.priceUSD}` : ""}
      <Icon className="h-4 w-4" aria-hidden />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}

export function GuideStore() {
  const [featured, ...rest] = PRODUCTS
  return (
    <div>
      {/* The paid bundle gets the big slot. */}
      <article
        className="grid items-center gap-8 rounded-2xl bg-white p-5 ring-1 ring-inset ring-border md:p-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12"
        aria-labelledby={`p-${featured.id}`}
        data-testid={`product-${featured.id}`}
      >
        <div className="rounded-xl bg-mist p-3 sm:p-5">
          <Cover product={featured} />
        </div>
        <div>
          <p className="text-sm font-semibold text-leaf">{featured.format}</p>
          <h3 id={`p-${featured.id}`} className="mt-1 text-3xl font-bold text-pine text-balance md:text-4xl">
            {featured.title}
          </h3>
          <p className="mt-2 text-lg text-slate text-pretty">{featured.summary}</p>
          {featured.includes && (
            <ul className="mt-6 space-y-4 border-l-2 border-goldenrod pl-5">
              {featured.includes.map((b) => (
                <li key={b.title}>
                  <p className="font-semibold text-ink">{b.title}</p>
                  <p className="mt-0.5 text-[15px] text-slate text-pretty">{b.summary}</p>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <BuyButton product={featured} size="lg" />
            <span className="text-sm text-slate">Checkout on Buy Me a Coffee</span>
          </div>
        </div>
      </article>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {rest.map((p) => (
          <article
            key={p.id}
            className="grid gap-5 rounded-2xl bg-white p-5 ring-1 ring-inset ring-border sm:grid-cols-[150px_1fr] sm:gap-6 sm:p-6"
            aria-labelledby={`p-${p.id}`}
            data-testid={`product-${p.id}`}
          >
            <div className="w-36 sm:w-auto">
              <Cover product={p} />
            </div>
            <div className="flex min-w-0 flex-col">
              <p className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-leaf px-2.5 py-0.5 font-semibold text-white">{price(p)}</span>
                <span className="text-slate">{p.format}</span>
              </p>
              <h3 id={`p-${p.id}`} className="mt-2 text-xl font-bold text-ink text-balance">
                {p.title}
              </h3>
              <p className="mt-1 text-[15px] text-slate text-pretty">{p.summary}</p>
              <ul className="mt-3 space-y-1.5">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2.5 text-[15px] text-ink text-pretty">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-goldenrod" aria-hidden />
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-1">
                <BuyButton product={p} />
                {p.priceNote && <p className="mt-2 text-sm text-slate">{p.priceNote}</p>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
