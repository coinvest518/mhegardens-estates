/** Shared, client-safe types for the down payment programs list. The data itself lives in lib/programs.ts (server only). */

export type ProgramStatus = "open" | "check" | "closed"

export type ProgramLink = { label: string; href: string }

export type Program = {
  id: string
  section: "match" | "grant" | "closed"
  name: string
  org: string
  phone?: string
  email?: string
  kind: string
  amount: string
  amountNote?: string
  area: string
  status: ProgramStatus
  statusNote: string
  summary: string
  eligibility: string[]
  howToApply?: string
  links: ProgramLink[]
}

/** What signed-out visitors see for a locked program: the kind of help, how much and where — not the name or details. */
export type ProgramTeaser = Pick<Program, "id" | "section" | "kind" | "amount" | "area" | "status">

export const STATUS_LABEL: Record<ProgramStatus, string> = {
  open: "Taking applications",
  check: "Call to confirm funds",
  closed: "Not open right now",
}

export const SECTION_TITLE: Record<Program["section"], string> = {
  match: "Matched savings",
  grant: "Grants and forgivable loans",
  closed: "Not open right now",
}
