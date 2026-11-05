import { CHECKED_ON, getMemberPrograms } from "@/lib/programs"
import { verifyFirebaseToken } from "@/lib/verify-firebase-token"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** The full down payment programs list, for signed-in users only. */
export async function GET(req: Request) {
  const header = req.headers.get("authorization") ?? ""
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null
  const user = await verifyFirebaseToken(token)
  const headers = { "content-type": "application/json", "cache-control": "private, no-store" }

  if (!user) {
    return new Response(JSON.stringify({ error: "Sign in to see every program." }), { status: 401, headers })
  }
  return new Response(JSON.stringify({ checkedOn: CHECKED_ON, programs: getMemberPrograms() }), { status: 200, headers })
}
