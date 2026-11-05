"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarCheck, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AccountButton } from "@/components/account-button"
import { SITE, consultHref } from "@/lib/site"

const NAV_LINKS = [
  { href: "/#ways", label: "Ways to buy" },
  { href: "/#who", label: "Buy · Sell · Invest" },
  { href: "/#credit", label: "Credit help" },
  { href: "/auctions", label: "Auctions" },
  { href: "/education", label: "Guides" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  // Only the homepage has a dark hero behind the nav; every other page (and the open mobile menu) needs the solid bar.
  const solid = isScrolled || isOpen || pathname !== "/"

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0)
      setIsScrolled(scrollTop > 60)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const linkTone = solid ? "text-foreground" : "text-white/90 drop-shadow"

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div
        className="absolute top-0 left-0 h-[2px] bg-accent transition-[width] duration-150 ease-out z-10"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2.5" aria-label={`${SITE.name} home`}>
            <img src="/brand/logo-96.png" alt="" width={36} height={36} className="h-9 w-9 rounded-md" />
            <span className={`text-lg font-bold tracking-tight transition-colors duration-300 ${solid ? "text-foreground" : "text-white drop-shadow"}`}>
              {SITE.name}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-300 hover:text-primary ${linkTone}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <AccountButton
              className={`text-sm transition-colors duration-300 ${
                solid ? "text-foreground hover:text-primary" : "text-white/85 hover:text-white hover:bg-white/10"
              }`}
            />
            <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              <Link href={consultHref()}>
                <CalendarCheck className="mr-1.5 h-4 w-4" />
                Free consultation
              </Link>
            </Button>
          </div>

          <button
            className={`lg:hidden p-2 rounded-md transition-colors ${
              solid ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"
            }`}
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[520px] opacity-100 visible" : "max-h-0 opacity-0 invisible"
          }`}
        >
          <div className="border-t border-border/60">
            <div className="px-1 pt-2 pb-4 space-y-0.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 text-base font-medium text-foreground hover:text-primary rounded-md hover:bg-muted/50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 pb-1 px-3 flex flex-col gap-2">
                <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  <Link href={consultHref()} onClick={() => setIsOpen(false)}>
                    <CalendarCheck className="mr-1.5 h-4 w-4" />
                    Book a free consultation
                  </Link>
                </Button>
                <AccountButton className="w-full justify-center border border-border text-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
