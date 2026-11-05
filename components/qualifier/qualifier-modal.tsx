"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Qualifier } from "@/components/qualifier/qualifier"
import { SITE } from "@/lib/site"

/** Any link to "#consult" (e.g. "/#consult") opens the qualifier popup instead of jumping down the page. */
export const QUALIFY_HASH = "#consult"

export function QualifierModal() {
  const [open, setOpen] = useState(false)
  const [session, setSession] = useState(0)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement | null)?.closest?.("a")
      if (!a) return
      const href = a.getAttribute("href") ?? ""
      if (!href.endsWith(QUALIFY_HASH)) return
      e.preventDefault()
      setSession((s) => s + 1) // fresh questionnaire each time it opens
      setOpen(true)
    }
    // Capture phase: runs before Next.js <Link> handles the click, so the page doesn't jump.
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg max-h-[92vh] overflow-y-auto p-6 sm:p-8" data-testid="qualifier-modal">
        <DialogTitle className="sr-only">See if you qualify — {SITE.name}</DialogTitle>
        <DialogDescription className="sr-only">A few quick questions to find your best path to buying, selling or investing.</DialogDescription>
        <Qualifier key={session} onNavigate={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
