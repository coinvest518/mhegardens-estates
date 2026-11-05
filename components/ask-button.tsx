"use client"

/**
 * Jumps to the AI guide on the homepage and either asks `question` right away
 * (send) or types it into the box for the person to finish (prefill).
 */
export function AskButton({
  question,
  mode = "send",
  className = "",
  children,
}: {
  question: string
  mode?: "send" | "prefill"
  className?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        document.getElementById("ask")?.scrollIntoView({ behavior: "smooth", block: "start" })
        window.dispatchEvent(new CustomEvent("mhe:ask", { detail: { question, mode } }))
      }}
    >
      {children}
    </button>
  )
}
