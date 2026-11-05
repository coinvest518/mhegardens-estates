import "server-only"
import { createRemoteJWKSet, decodeJwt, jwtVerify } from "jose"

/** Google's public keys for Firebase ID tokens. */
const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
)

export type FirebaseUser = { uid: string; email?: string }

/**
 * Check a Firebase ID token (from user.getIdToken()) without the Admin SDK.
 * Returns the user, or null if the token is missing, expired, forged or for another project.
 *
 * Local testing only: with FIREBASE_AUTH_EMULATOR_HOST set (and not on Vercel), emulator tokens are accepted.
 * They aren't signed, so this path checks project and expiry but not the signature — the same thing the
 * Firebase Admin SDK does against the emulator. Never set FIREBASE_AUTH_EMULATOR_HOST in Vercel.
 */
export async function verifyFirebaseToken(token: string | null | undefined): Promise<FirebaseUser | null> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  if (!token || !projectId) return null
  const issuer = `https://securetoken.google.com/${projectId}`

  try {
    if (process.env.FIREBASE_AUTH_EMULATOR_HOST && !process.env.VERCEL) {
      const claims = decodeJwt(token)
      const now = Math.floor(Date.now() / 1000)
      if (claims.aud !== projectId || claims.iss !== issuer || !claims.sub || (claims.exp ?? 0) < now) return null
      return { uid: claims.sub, email: claims.email as string | undefined }
    }

    const { payload } = await jwtVerify(token, JWKS, { issuer, audience: projectId, algorithms: ["RS256"] })
    const authTime = Number(payload.auth_time ?? 0)
    if (!payload.sub || authTime > Math.floor(Date.now() / 1000) + 60) return null
    return { uid: payload.sub, email: payload.email as string | undefined }
  } catch {
    return null
  }
}
