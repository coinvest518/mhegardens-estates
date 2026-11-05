import { getLandBankList, sortByValue } from "@/lib/land-bank-listings"
import { verifyFirebaseToken } from "@/lib/verify-firebase-token"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** This month's full Land Bank list, for signed-in users only. */
export async function GET(req: Request) {
  const header = req.headers.get("authorization") ?? ""
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null
  const user = await verifyFirebaseToken(token)
  const headers = { "content-type": "application/json", "cache-control": "private, no-store" }
  if (!user) return new Response(JSON.stringify({ error: "Sign in to see the full list." }), { status: 401, headers })

  const list = await getLandBankList()
  return new Response(JSON.stringify({ ...list, listings: sortByValue(list.listings) }), { status: 200, headers })
}
