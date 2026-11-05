"use client"

import { useState } from "react"
import { BookOpen, ExternalLink, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BUNDLE, GUIDES, type Guide } from "@/lib/education"

function GuideAction({ guide, className = "" }: { guide: Guide; className?: string }) {
  if (guide.gated) {
    return (
      <Button asChild className={`bg-primary hover:bg-primary/90 text-primary-foreground ${className}`}>
        <a href={BUNDLE.buyLink} target="_blank" rel="noreferrer noopener">
          Get the bundle — ${BUNDLE.priceUSD} <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
        </a>
      </Button>
    )
  }
  if (guide.pdfPath) {
    return (
      <Button asChild className={`bg-primary hover:bg-primary/90 text-primary-foreground ${className}`}>
        <a href={guide.pdfPath} target="_blank" rel="noreferrer noopener">
          Read the free guide <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
        </a>
      </Button>
    )
  }
  return null
}

export function EducationArticles() {
  const [openId, setOpenId] = useState<string | null>(null)
  const open = GUIDES.find((g) => g.id === openId) ?? null

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        {GUIDES.map((guide) => (
          <Card
            key={guide.id}
            id={guide.id}
            className="border-border bg-card flex flex-col scroll-mt-24"
          >
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <span
                  className={`text-xs font-semibold rounded-full px-2.5 py-1 ${
                    guide.gated ? "bg-mist text-slate border border-border" : "bg-leaf text-white"
                  }`}
                >
                  {guide.gated ? `In the $${BUNDLE.priceUSD} bundle` : "Free"}
                  {guide.pages ? ` · ${guide.pages} pages` : ""}
                </span>
              </div>
              <CardTitle className="text-xl leading-snug">{guide.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 flex-1">
              <p className="text-sm text-muted-foreground text-pretty line-clamp-4">{guide.summary}</p>
              <div>
                <p className="text-sm font-semibold text-pine mb-2">You&apos;ll learn</p>
                <ul className="space-y-1.5">
                  {guide.takeaways.map((t) => (
                    <li key={t} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5 flex-shrink-0">✓</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-2">
                <GuideAction guide={guide} className="flex-1" />
                <Button variant="outline" onClick={() => setOpenId(guide.id)} className="border-primary text-primary hover:bg-primary/10">
                  <Eye className="mr-1.5 h-4 w-4" /> Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open !== null} onOpenChange={(v) => !v && setOpenId(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle>{open.title}</DialogTitle>
                <DialogDescription>
                  {open.gated ? `Part of the ${BUNDLE.title}.` : "Free guide."}
                  {open.pages ? ` ${open.pages} pages.` : ""}
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm text-muted-foreground text-pretty">{open.summary}</p>
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">What you&apos;ll learn</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {open.takeaways.map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <GuideAction guide={open} className="w-full" />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
