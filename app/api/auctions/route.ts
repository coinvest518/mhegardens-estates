import { getUpcomingAuctions } from "@/lib/auctions"
import { SOURCES } from "@/lib/sources"
import { verifyFirebaseToken } from "@/lib/verify-firebase-token"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Full details for every upcoming auction (deadlines, promo codes, links) and the sites we use — members only. */
export async function GET(req: Request) {
  const header = req.headers.get("authorization") ?? ""
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null
  const user = await verifyFirebaseToken(token)
  const headers = { "content-type": "application/json", "cache-control": "private, no-store" }
  if (!user) return new Response(JSON.stringify({ error: "Sign in to see every auction." }), { status: 401, headers })
  return new Response(JSON.stringify({ events: getUpcomingAuctions(), sources: SOURCES }), { status: 200, headers })
}
