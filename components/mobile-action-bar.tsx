"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MessageCircle } from "lucide-react"

/** Phone-only bar pinned to the bottom: the two things people come to do. Shows after the first screen. */
export function MobileActionBar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 320)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={`lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 backdrop-blur px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-200 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!show}
      data-testid="mobile-action-bar"
    >
      <div className="flex gap-2.5">
        <Link
          href="/#consult"
          tabIndex={show ? 0 : -1}
          className="flex-1 inline-flex items-center justify-center rounded-xl bg-goldenrod px-4 py-3.5 font-semibold text-ink"
        >
          See if you qualify
        </Link>
        <Link
          href="/#ask"
          tabIndex={show ? 0 : -1}
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-leaf px-4 py-3 font-semibold text-leaf"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          Ask
        </Link>
      </div>
    </div>
  )
}
