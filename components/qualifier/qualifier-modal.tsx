"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Qualifier } from "@/components/qualifier/qualifier"
import { SITE } from "@/lib/site"
import type { Role } from "@/lib/qualifier"

/** Any link to "#consult" (e.g. "/#consult") opens the qualifier popup instead of jumping down the page. */
/** Links to "#consult" open the qualifier; "#consult-buyer" / "-seller" / "-investor" start it on that path. */
const QUALIFY_RE = /#consult(?:-(buyer|seller|investor))?$/

export function QualifierModal() {
  const [open, setOpen] = useState(false)
  const [session, setSession] = useState(0)
  const [role, setRole] = useState<Role | null>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement | null)?.closest?.("a")
      if (!a) return
      const m = (a.getAttribute("href") ?? "").match(QUALIFY_RE)
      if (!m) return
      e.preventDefault()
      setRole((m[1] as Role | undefined) ?? null)
      setSession((s) => s + 1) // fresh questionnaire each time it opens
      setOpen(true)
    }
    // Capture phase: runs before Next.js <Link> handles the click, so the page doesn't jump.
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg max-h-[92dvh] overflow-y-auto p-5 sm:p-8" data-testid="qualifier-modal">
        <DialogTitle className="sr-only">See if you qualify — {SITE.name}</DialogTitle>
        <DialogDescription className="sr-only">A few quick questions to find your best path to buying, selling or investing.</DialogDescription>
        <Qualifier key={session} initialRole={role} onNavigate={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
