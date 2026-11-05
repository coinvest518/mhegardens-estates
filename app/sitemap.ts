import type { MetadataRoute } from "next"
import { SITE } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: `${SITE.url}/`, lastModified, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE.url}/auctions`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/education`, lastModified, changeFrequency: "monthly", priority: 0.7 },
  ]
}
