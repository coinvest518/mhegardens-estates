"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUp, RotateCcw } from "lucide-react"

type Msg = { role: "user" | "assistant"; content: string }

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi! I'm the MHE Gardens guide. Ask me anything about buying land or a home, tax auctions, the land bank, credit, or selling. You can write in English, Kreyòl or Español.",
}

const SUGGESTIONS = [
  "What credit score do I need to buy a house?",
  "How do county tax auctions work?",
  "What is a land bank?",
  "I'm behind on my property taxes. Can I sell?",
]

/** Tiny formatter: paragraphs, "- " bullet lists and **bold**. No HTML from the model is rendered. */
function Formatted({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/)
  const inline = (s: string, k: string) =>
    s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? <strong key={`${k}-${i}`}>{part.slice(2, -2)}</strong> : <span key={`${k}-${i}`}>{part}</span>
    )
  return (
    <>
      {blocks.map((b, bi) => {
        const lines = b.split("\n").filter(Boolean)
        if (lines.length && lines.every((l) => /^\s*([-*•]|\d+\.)\s+/.test(l))) {
          return (
            <ul key={bi} className="my-1.5 list-disc pl-5 space-y-1">
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\s*([-*•]|\d+\.)\s+/, ""), `${bi}-${li}`)}</li>
              ))}
            </ul>
          )
        }
        return (
          <p key={bi} className="my-1.5 first:mt-0 last:mb-0">
            {lines.map((l, li) => (
              <span key={li}>
                {inline(l, `${bi}-${li}`)}
                {li < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        )
      })}
    </>
  )
}

function newSessionId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function AskAI() {
  const [messages, setMessages] = useState<Msg[]>([GREETING])
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sessionId = useRef<string>("")
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const sendRef = useRef<(text: string) => void>(() => {})

  useEffect(() => {
    try {
      sessionId.current = sessionStorage.getItem("mhe-chat-session") || newSessionId()
      sessionStorage.setItem("mhe-chat-session", sessionId.current)
    } catch {
      sessionId.current = newSessionId()
    }
  }, [])

  useEffect(() => {
    const el = listRef.current
    if (el && messages.length > 1) el.scrollTop = el.scrollHeight
  }, [messages])

  const send = async (text: string) => {
    const q = text.trim()
    if (!q || busy) return
    setError(null)
    setInput("")
    const history = [...messages.filter((m) => m !== GREETING), { role: "user" as const, content: q }]
    setMessages([GREETING, ...history, { role: "assistant", content: "" }])
    setBusy(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history, sessionId: sessionId.current }),
      })
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "The guide couldn't answer. Try again.")
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let answer = ""
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        answer += decoder.decode(value, { stream: true })
        setMessages([GREETING, ...history, { role: "assistant", content: answer }])
      }
      if (!answer.trim()) throw new Error("The guide didn't answer. Try asking another way.")
    } catch (e) {
      setMessages([GREETING, ...history])
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.")
    } finally {
      setBusy(false)
    }
  }

  sendRef.current = send

  // Buttons elsewhere on the page can ask a question (or start one) here.
  useEffect(() => {
    const onAsk = (e: Event) => {
      const { question, mode } = (e as CustomEvent<{ question: string; mode: "send" | "prefill" }>).detail ?? {}
      if (!question) return
      if (mode === "prefill") {
        setInput(question)
        setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 400)
      } else {
        sendRef.current(question)
      }
    }
    window.addEventListener("mhe:ask", onAsk)
    return () => window.removeEventListener("mhe:ask", onAsk)
  }, [])

  const reset = () => {
    setMessages([GREETING])
    setError(null)
    setInput("")
  }

  const asked = messages.length > 1
  const lastIsEmptyAssistant = busy && messages[messages.length - 1]?.role === "assistant" && !messages[messages.length - 1].content

  return (
    <section id="ask" className="py-16 sm:py-20 px-5 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">
        <div className="lg:col-span-2">
          <h2 className="text-3xl sm:text-4xl font-bold text-pine text-balance">Ask anything about buying land or a home</h2>
          <p className="mt-3 text-lg text-slate text-pretty">
            Our AI guide answers in plain words — in English, Kreyòl or Español. It&apos;s general information, not legal or
            financial advice.
          </p>
          <p className="mt-4 text-slate">
            Ready for answers about your own situation?{" "}
            <Link href="/#consult" className="font-semibold text-leaf underline underline-offset-4">
              See if you qualify
            </Link>
            .
          </p>
        </div>

        <div className="lg:col-span-3 rounded-2xl border border-border bg-card overflow-hidden" data-testid="ask-ai">
          <div className="flex items-center justify-between gap-3 border-b border-border bg-mist px-4 py-3">
            <div className="flex items-center gap-2.5">
              <img src="/brand/logo-96.png" alt="" width={28} height={28} className="h-7 w-7 rounded-md" />
              <span className="font-semibold text-pine">MHE Gardens guide</span>
            </div>
            {asked && (
              <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-pine">
                <RotateCcw className="h-3.5 w-3.5" /> New chat
              </button>
            )}
          </div>

          <div ref={listRef} className="h-[22rem] sm:h-[26rem] overflow-y-auto px-4 py-4 space-y-3" aria-live="polite" data-testid="ask-ai-messages">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-leaf px-4 py-2.5 text-white">{m.content}</div>
                </div>
              ) : m.content ? (
                <div key={i} className="flex">
                  <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-mist px-4 py-2.5 text-ink leading-relaxed" data-testid="ask-ai-answer">
                    <Formatted text={m.content} />
                  </div>
                </div>
              ) : null
            )}
            {lastIsEmptyAssistant && (
              <div className="flex" aria-label="The guide is typing">
                <div className="rounded-2xl rounded-bl-md bg-mist px-4 py-3.5 flex gap-1.5">
                  <span className="chat-dot h-2 w-2 rounded-full bg-slate" />
                  <span className="chat-dot h-2 w-2 rounded-full bg-slate" style={{ animationDelay: "0.15s" }} />
                  <span className="chat-dot h-2 w-2 rounded-full bg-slate" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            )}
            {!asked && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-leaf/40 bg-white px-3.5 py-2 text-left text-sm text-leaf hover:bg-leaf hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>

          {asked && !busy && (
            <div className="border-t border-border bg-[#fffbea] px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
              <p className="text-sm text-ink">Want answers for your own situation?</p>
              <Link href="/#consult" className="inline-flex items-center justify-center rounded-lg bg-goldenrod px-4 py-2 text-sm font-semibold text-ink">
                See if you qualify
              </Link>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="flex items-end gap-2 border-t border-border p-3"
          >
            <label htmlFor="ask-input" className="sr-only">
              Your question
            </label>
            <textarea
              ref={inputRef}
              id="ask-input"
              rows={1}
              maxLength={1000}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  send(input)
                }
              }}
              placeholder="Type your question…"
              className="min-h-12 max-h-32 flex-1 resize-none rounded-xl border border-input bg-background px-3.5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-leaf text-white disabled:opacity-40"
              aria-label="Send"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
