/**
 * Hero illustration: a county tax-map style plat with three highlighted lots —
 * the three ways in (land bank, county auction, listed for sale).
 * Pure SVG, no image download. The highlighted lots draw themselves in once.
 */
const STREET = "#2a5a4b"
const LOT_LINE = "rgba(234,241,237,0.22)"

// Parcel grid: [x, y, w, h]
const BLOCKS: [number, number, number, number][] = [
  // block A (top left)
  [20, 20, 58, 70], [78, 20, 46, 70], [124, 20, 52, 70], [176, 20, 44, 70],
  [20, 90, 70, 64], [90, 90, 40, 64], [130, 90, 48, 64], [178, 90, 42, 64],
  // block B (top right)
  [262, 20, 64, 52], [326, 20, 54, 52], [380, 20, 60, 52],
  [262, 72, 44, 82], [306, 72, 70, 82], [376, 72, 64, 82],
  // block C (bottom left)
  [20, 196, 52, 80], [72, 196, 62, 80], [134, 196, 86, 80],
  [20, 276, 88, 64], [108, 276, 58, 64], [166, 276, 54, 64],
  // block D (bottom right)
  [262, 196, 72, 60], [334, 196, 50, 60], [384, 196, 56, 60],
  [262, 256, 50, 84], [312, 256, 66, 84], [378, 256, 62, 84],
]

const HIGHLIGHTS = [
  { label: "Land bank", d: "M90 90 H130 V154 H90 Z", len: 208, tag: { x: 64, y: 168 }, delay: 0.2 },
  { label: "County auction", d: "M306 72 H376 V154 H306 Z", len: 304, tag: { x: 290, y: 164 }, delay: 0.55 },
  { label: "Listed for sale", d: "M134 196 H220 V276 H134 Z", len: 332, tag: { x: 126, y: 290 }, delay: 0.9 },
]

export function PlatMap({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 460 360"
      role="img"
      aria-labelledby="plat-title plat-desc"
      className={className}
    >
      <title id="plat-title">Map of lots</title>
      <desc id="plat-desc">
        A tax-map style drawing of city blocks with three lots highlighted: a land bank lot, a county auction lot and a lot listed for sale.
      </desc>

      {/* Streets */}
      <rect x="0" y="0" width="460" height="360" fill="none" />
      <rect x="220" y="0" width="42" height="360" fill={STREET} opacity="0.55" />
      <rect x="0" y="154" width="460" height="42" fill={STREET} opacity="0.55" />
      <line x1="241" y1="6" x2="241" y2="354" stroke="#edba2f" strokeOpacity="0.35" strokeDasharray="8 10" />
      <line x1="6" y1="175" x2="454" y2="175" stroke="#edba2f" strokeOpacity="0.35" strokeDasharray="8 10" />

      {/* Lot lines */}
      {BLOCKS.map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill="none" stroke={LOT_LINE} strokeWidth="1" />
      ))}

      {/* Street names, set like a tax map */}
      <text x="250" y="120" fill="rgba(234,241,237,0.5)" fontSize="9" letterSpacing="2" transform="rotate(-90 250 120)" style={{ fontFamily: "var(--font-body)" }}>
        Third Ave
      </text>

      {/* Highlighted lots */}
      {HIGHLIGHTS.map((h) => (
        <g key={h.label}>
          <path
            d={h.d}
            className="parcel-draw"
            style={{ "--len": h.len, animationDelay: `${h.delay}s` } as React.CSSProperties}
            fill="rgba(237,186,47,0.22)"
            stroke="#edba2f"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <g className="parcel-tag" style={{ animationDelay: `${h.delay + 0.9}s` }}>
            <rect x={h.tag.x} y={h.tag.y} width={h.label.length * 7.6 + 20} height="26" rx="13" fill="#edba2f" />
            <text x={h.tag.x + 10} y={h.tag.y + 17.5} fill="#17201d" fontSize="13" fontWeight="600" style={{ fontFamily: "var(--font-body)" }}>
              {h.label}
            </text>
          </g>
        </g>
      ))}

      {/* North arrow */}
      <g transform="translate(428 330)" opacity="0.55">
        <path d="M0 -14 L6 4 L0 0 L-6 4 Z" fill="#eaf1ed" />
        <text x="-3.5" y="16" fill="#eaf1ed" fontSize="9" style={{ fontFamily: "var(--font-body)" }}>
          N
        </text>
      </g>
    </svg>
  )
}
