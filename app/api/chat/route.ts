import { z } from "zod"
import { buildSystemPrompt } from "@/lib/chat-knowledge"
import { getSupabase } from "@/lib/supabase-server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 30

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
})
const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(20),
  sessionId: z.string().max(64).optional(),
})

/** OpenAI-compatible chat providers, tried in order. Each needs its key set in Vercel. */
const PROVIDERS = [
  {
    name: "mistral",
    key: () => process.env.MISTRAL_API_KEY,
    url: "https://api.mistral.ai/v1/chat/completions",
    model: () => process.env.MISTRAL_CHAT_MODEL || "mistral-small-latest",
  },
  {
    name: "nvidia",
    key: () => process.env.NVIDIA_API_KEY,
    url: "https://integrate.api.nvidia.com/v1/chat/completions",
    model: () => process.env.NVIDIA_CHAT_MODEL || "meta/llama-3.3-70b-instruct",
  },
]

// Best-effort per-instance rate limit: 20 messages per 10 minutes per visitor.
const WINDOW_MS = 10 * 60 * 1000
const LIMIT = 20
const hits = new Map<string, number[]>()
function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return recent.length > LIMIT
}

const json = (status: number, error: string) =>
  new Response(JSON.stringify({ error }), { status, headers: { "content-type": "application/json" } })

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown"
  if (rateLimited(ip)) return json(429, "You're sending messages quickly. Wait a few minutes and try again.")

  let parsed
  try {
    parsed = BodySchema.safeParse(await req.json())
  } catch {
    return json(400, "Invalid request")
  }
  if (!parsed.success) return json(400, "Messages must be under 2,000 characters.")
  const { messages, sessionId } = parsed.data
  const total = messages.reduce((n, m) => n + m.content.length, 0)
  if (total > 12000) return json(400, "This conversation is long. Start a new one to keep going.")

  const payload = [{ role: "system", content: buildSystemPrompt() }, ...messages.slice(-12)]

  let upstream: Response | null = null
  let used = ""
  for (const p of PROVIDERS) {
    const key = p.key()
    if (!key) continue
    try {
      const res = await fetch(p.url, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${key}`, accept: "text/event-stream" },
        body: JSON.stringify({ model: p.model(), messages: payload, stream: true, temperature: 0.3, max_tokens: 500 }),
      })
      if (res.ok && res.body) {
        upstream = res
        used = p.name
        break
      }
      console.error("[chat] provider failed", { provider: p.name, status: res.status, body: (await res.text()).slice(0, 300) })
    } catch (err) {
      console.error("[chat] provider threw", { provider: p.name, err })
    }
  }
  if (!upstream?.body) return json(503, "The guide is offline right now. Tap “See if you qualify” and we'll answer on your free call.")

  const reader = upstream.body.getReader()
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  let buffer = ""
  let answer = ""

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read()
      if (done) {
        controller.close()
        void saveChat(sessionId, messages[messages.length - 1].content, answer, used)
        return
      }
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() ?? ""
      for (const line of lines) {
        const data = line.trim()
        if (!data.startsWith("data:")) continue
        const body = data.slice(5).trim()
        if (body === "[DONE]") continue
        try {
          const delta = JSON.parse(body)?.choices?.[0]?.delta?.content
          if (typeof delta === "string" && delta) {
            answer += delta
            controller.enqueue(encoder.encode(delta))
          }
        } catch {
          // ignore keep-alive or partial lines
        }
      }
    },
    cancel() {
      void reader.cancel()
    },
  })

  return new Response(stream, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-chat-provider": used },
  })
}

async function saveChat(sessionId: string | undefined, question: string, answer: string, provider: string) {
  const db = getSupabase()
  if (!db || !sessionId) return
  const { error } = await db.from("chat_messages").insert([
    { session_id: sessionId, role: "user", content: question },
    { session_id: sessionId, role: "assistant", content: answer || `(no answer from ${provider})` },
  ])
  if (error) console.warn("[chat] supabase insert failed", error.message)
}
