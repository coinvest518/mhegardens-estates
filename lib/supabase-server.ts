import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Server-only Supabase client. Uses the service role key, so it must never be
 * imported into client components. Returns null when Supabase isn't set up yet,
 * and every caller treats saving as best-effort.
 */
let client: SupabaseClient | null | undefined

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null
  return client
}
