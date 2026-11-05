import { z } from "zod"
import { buildSystemPrompt } from "@/lib/chat-knowledge"
import { getSupabase } from "@/lib/supabase-server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
})
const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(20),
  sessionId: z.string().max(64).optional(),
})

/**
 * OpenAI-compatible chat providers, tried in order. Each needs its key set in Vercel.
 * Each provider lists models to try, so a retired model (404/410) falls through to the next one.
 * Set MISTRAL_CHAT_MODEL / NVIDIA_CHAT_MODEL in Vercel to put a different model first.
 */
const PROVIDERS = [
  {
    name: "mistral",
    key: () => process.env.MISTRAL_API_KEY,
    url: "https://api.mistral.ai/v1/chat/completions",
    models: () => [process.env.MISTRAL_CHAT_MODEL, "mistral-small-latest", "ministral-8b-latest", "open-mistral-nemo"],
  },
  {
    name: "nvidia",
    key: () => process.env.NVIDIA_API_KEY,
    url: "https://integrate.api.nvidia.com/v1/chat/completions",
    models: () => [
      process.env.NVIDIA_CHAT_MODEL,
      "deepseek-ai/deepseek-v4.1-flash",
      "google/gemma-3-12b-it",
      "nvidia/nemotron-3.5-lightning-30b-a3b",
      "google/gemma-4-31b-it",
    ],
  },
]

/** Wait up to this long for a model to start answering, and this long in total across all tries. */
const FIRST_TOKEN_MS = 9000
const TOTAL_BUDGET_MS = 24000

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
  const deadline = Date.now() + TOTAL_BUDGET_MS
  providers: for (const p of PROVIDERS) {
    const key = p.key()
    if (!key) continue
    const models = [...new Set(p.models().filter((m): m is string => !!m))]
    for (const model of models) {
      const left = deadline - Date.now()
      if (left < 2000) break providers
      // Give up on a model that hasn't started answering in time, but never cut off an answer mid-stream.
      const ctrl = new AbortController()
      const timer = setTimeout(() => ctrl.abort(), Math.min(FIRST_TOKEN_MS, left))
      try {
        const res = await fetch(p.url, {
          method: "POST",
          headers: { "content-type": "application/json", authorization: `Bearer ${key}`, accept: "text/event-stream" },
          body: JSON.stringify({ model, messages: payload, stream: true, temperature: 0.3, max_tokens: 600 }),
          signal: ctrl.signal,
        })
        clearTimeout(timer)
        if (res.ok && res.body) {
          upstream = res
          used = `${p.name}:${model}`
          break providers
        }
        console.error("[chat] model failed", { provider: p.name, model, status: res.status, body: (await res.text()).slice(0, 300) })
        // A bad or missing key fails every model the same way; anything else (retired, busy, rate-limited) may be per-model.
        if (res.status === 401 || res.status === 403) continue providers
      } catch (err) {
        clearTimeout(timer)
        const timedOut = ctrl.signal.aborted
        console.error("[chat] model " + (timedOut ? "timed out" : "threw"), { provider: p.name, model, err: String(err) })
        if (!timedOut) continue providers
      }
    }
  }
  if (!upstream?.body) return json(503, "The guide is offline right now. Tap “See if you qualify” and we'll answer on your free call.")

  const reader = upstream.body.getReader()
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  let buffer = ""
  let raw = ""
  let answer = ""
  const EMPTY = "I couldn't put an answer together just now. Try asking another way, or tap “See if you qualify” and we'll go over it on your free call."
  // Some models stream their reasoning inside <think>…</think>; only the answer after it is shown.
  const visible = (text: string) => {
    if ("<think>".startsWith(text.trimStart()) && text.trim().length < 7) return ""
    return text.replace(/<think>[\s\S]*?(?:<\/think>|$)/g, "").trimStart()
  }

  const stream = new ReadableStream<Uint8Array>({
    // Keep reading until there is visible text to send or the answer ends. Returning from pull()
    // without enqueueing would leave the reader waiting forever (e.g. on the opening role-only chunk).
    async pull(controller) {
      for (;;) {
        const { done, value } = await reader.read()
        if (done) {
          if (!answer.trim()) {
            answer = EMPTY
            controller.enqueue(encoder.encode(EMPTY))
          }
          controller.close()
          void saveChat(sessionId, messages[messages.length - 1].content, answer, used)
          return
        }
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""
        let sent = false
        for (const line of lines) {
          const data = line.trim()
          if (!data.startsWith("data:")) continue
          const body = data.slice(5).trim()
          if (body === "[DONE]") continue
          try {
            const delta = JSON.parse(body)?.choices?.[0]?.delta?.content
            if (typeof delta === "string" && delta) {
              raw += delta
              const shown = visible(raw)
              if (shown.length > answer.length && shown.startsWith(answer)) {
                controller.enqueue(encoder.encode(shown.slice(answer.length)))
                answer = shown
                sent = true
              }
            }
          } catch {
            // ignore keep-alive or partial lines
          }
        }
        if (sent) return
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
