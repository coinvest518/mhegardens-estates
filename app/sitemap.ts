import type { MetadataRoute } from "next"
import { LESSONS } from "@/lib/learn"
import { SITE } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: `${SITE.url}/`, lastModified, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE.url}/programs`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/land-bank`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/auctions`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/education`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    ...LESSONS.map((l) => ({ url: `${SITE.url}/learn/${l.slug}`, lastModified: new Date(`${l.updated}T12:00:00Z`), changeFrequency: "monthly" as const, priority: 0.7 })),
  ]
}
