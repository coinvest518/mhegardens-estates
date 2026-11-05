"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { AccountButton } from "@/components/account-button"
import { SITE } from "@/lib/site"

const NAV_LINKS = [
  { href: "/#ways", label: "Ways to buy" },
  { href: "/#ask", label: "Ask a question" },
  { href: "/#credit", label: "Credit help" },
  { href: "/auctions", label: "Auctions" },
  { href: "/education", label: "Guides" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  // The homepage hero is dark; everywhere else (and with the menu open) the bar is solid.
  const solid = isScrolled || isOpen || pathname !== "/"

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const tone = solid ? "text-ink" : "text-[#eef4f0]"

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        solid ? "bg-white/95 backdrop-blur border-b border-border" : "bg-pine"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2.5" aria-label={`${SITE.name} home`}>
            <img src="/brand/logo-96.png" alt="" width={36} height={36} className="h-9 w-9 rounded-lg" />
            <span className={`font-display text-xl font-bold ${solid ? "text-pine" : "text-white"}`}>{SITE.name}</span>
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={`text-[15px] font-medium hover:underline underline-offset-4 decoration-goldenrod ${tone}`}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <AccountButton className={`text-[15px] ${solid ? "text-ink hover:bg-mist" : "text-[#eef4f0] hover:bg-white/10 hover:text-white"}`} />
            <Link href="/#consult" className="inline-flex items-center rounded-xl bg-goldenrod px-4 py-2.5 text-[15px] font-semibold text-ink hover:bg-[#f4c94e]">
              See if you qualify
            </Link>
          </div>

          <button
            className={`lg:hidden -mr-2 p-2.5 rounded-lg ${solid ? "text-ink hover:bg-mist" : "text-white hover:bg-white/10"}`}
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-200 ${
            isOpen ? "max-h-[560px] opacity-100 visible" : "max-h-0 opacity-0 invisible"
          }`}
        >
          <div className="border-t border-border pt-2 pb-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-1 py-3.5 text-lg font-medium text-ink border-b border-border/60"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-2.5">
              <Link
                href="/#consult"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center rounded-xl bg-goldenrod px-4 py-3.5 font-semibold text-ink"
              >
                See if you qualify
              </Link>
              <AccountButton className="w-full justify-center border border-border text-ink h-12 text-base" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
