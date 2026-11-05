import { z } from "zod"

/**
 * The "See if you qualify" questionnaire: questions for each path and the rules
 * that decide where a person is sent. Shared by the popup and the lead API so the
 * server always recomputes the outcome itself.
 */

export type Option = { value: string; label: string; hint?: string }
export type Question = { id: string; title: string; subtitle?: string; options: Option[] }
export type Role = "buyer" | "seller" | "investor"
export type Answers = Record<string, string>

export const ROLE_QUESTION: Question = {
  id: "role",
  title: "What brings you here?",
  subtitle: "Takes about a minute. No credit check.",
  options: [
    { value: "buyer", label: "I want to buy", hint: "A home, land, or land to build on" },
    { value: "seller", label: "I want to sell", hint: "A house or land" },
    { value: "investor", label: "I want to invest", hint: "Auctions, flips, rentals" },
  ],
}

export const QUESTIONS: Record<Role, Question[]> = {
  buyer: [
    {
      id: "buyWhat",
      title: "What do you want to buy?",
      options: [
        { value: "home", label: "A home" },
        { value: "land", label: "Land" },
        { value: "not-sure", label: "Not sure yet" },
      ],
    },
    {
      id: "buyHow",
      title: "How do you want to buy it?",
      options: [
        { value: "mortgage", label: "With a mortgage", hint: "The regular way, through a lender" },
        { value: "auction", label: "Tax auction or tax deed", hint: "Bid on county properties" },
        { value: "land-bank", label: "Land bank property", hint: "Apply instead of bidding" },
        { value: "fix-flip", label: "Fix and flip", hint: "Buy, fix up, sell or rent" },
        { value: "not-sure", label: "Not sure — show me my options" },
      ],
    },
    {
      id: "funds",
      title: "How much do you have saved toward this?",
      subtitle: "For a down payment, deposit or purchase.",
      options: [
        { value: "under-2500", label: "Under $2,500" },
        { value: "2500-10000", label: "$2,500 – $10,000" },
        { value: "10000-25000", label: "$10,000 – $25,000" },
        { value: "25000-plus", label: "$25,000 or more" },
      ],
    },
    {
      id: "credit",
      title: "What's your credit score, roughly?",
      options: [
        { value: "680-plus", label: "680 or higher" },
        { value: "580-679", label: "580 – 679" },
        { value: "under-580", label: "Under 580" },
        { value: "not-sure", label: "Not sure" },
      ],
    },
    {
      id: "buyerType",
      title: "Which sounds most like you?",
      options: [
        { value: "first-time-certified", label: "First-time buyer", hint: "I've taken a homebuyer class" },
        { value: "first-time-new", label: "First-time buyer", hint: "I haven't taken a class yet" },
        { value: "repeat", label: "I've bought before" },
        { value: "cash", label: "I'm paying cash" },
      ],
    },
  ],
  seller: [
    {
      id: "sellWhat",
      title: "What are you selling?",
      options: [
        { value: "house", label: "A house" },
        { value: "multi-family", label: "A multi-family or rental" },
        { value: "land", label: "Land or a vacant lot" },
      ],
    },
    {
      id: "situation",
      title: "What's going on with the property?",
      options: [
        { value: "behind-taxes", label: "Behind on property taxes" },
        { value: "behind-mortgage", label: "Behind on the mortgage" },
        { value: "inherited", label: "I inherited it" },
        { value: "vacant", label: "It's vacant or needs work" },
        { value: "just-selling", label: "I just want to sell" },
      ],
    },
    {
      id: "onDeed",
      title: "Is your name on the deed?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "family", label: "A family member's name is" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "timeline",
      title: "How soon do you want to sell?",
      options: [
        { value: "asap", label: "As soon as possible" },
        { value: "1-3", label: "In 1 – 3 months" },
        { value: "3-6", label: "In 3 – 6 months" },
        { value: "exploring", label: "Just exploring" },
      ],
    },
  ],
  investor: [
    {
      id: "strategy",
      title: "What kind of deals are you after?",
      options: [
        { value: "auctions", label: "Tax auctions" },
        { value: "land-bank", label: "Land bank properties" },
        { value: "fix-flip", label: "Fix and flip" },
        { value: "rentals", label: "Rentals / buy and hold" },
        { value: "land", label: "Land" },
      ],
    },
    {
      id: "budget",
      title: "How much can you put in?",
      options: [
        { value: "under-10k", label: "Under $10,000" },
        { value: "10-50k", label: "$10,000 – $50,000" },
        { value: "50-150k", label: "$50,000 – $150,000" },
        { value: "150k-plus", label: "$150,000 or more" },
      ],
    },
    {
      id: "financing",
      title: "How will you pay?",
      options: [
        { value: "cash", label: "Cash" },
        { value: "hard-money", label: "Hard money or private lender" },
        { value: "mortgage", label: "A mortgage" },
        { value: "not-sure", label: "Not sure yet" },
      ],
    },
  ],
}

export type Outcome = "agent" | "agent-fha" | "credit" | "alt-path" | "seller" | "investor"

/** Decide where a person goes based on their answers. */
export function getOutcome(role: Role, a: Answers): Outcome {
  if (role === "seller") return "seller"
  if (role === "investor") return "investor"

  // Buyers
  const nonMortgage = ["auction", "land-bank", "fix-flip"].includes(a.buyHow)
  if (nonMortgage) return "alt-path"
  if (a.buyerType === "cash") return "agent"
  if (a.credit === "680-plus") return "agent"
  if (a.credit === "580-679") return "agent-fha"
  return "credit" // under 580 or not sure
}

export const OUTCOME_LABEL: Record<Outcome, string> = {
  agent: "Ready for agent (680+ or cash)",
  "agent-fha": "Agent — FHA / first-time route (580–679)",
  credit: "Credit help first (under 580 or unsure)",
  "alt-path": "Auction / land bank / fix-and-flip path",
  seller: "Seller",
  investor: "Investor",
}

export function labelFor(questionId: string, value: string, role?: Role): string {
  if (questionId === "role") return ROLE_QUESTION.options.find((o) => o.value === value)?.label ?? value
  const pools = role ? [QUESTIONS[role]] : Object.values(QUESTIONS)
  for (const qs of pools) {
    const q = qs.find((x) => x.id === questionId)
    const o = q?.options.find((x) => x.value === value)
    if (o) return o.hint ? `${o.label} (${o.hint})` : o.label
  }
  return value
}

export function questionTitle(questionId: string, role: Role): string {
  return QUESTIONS[role].find((q) => q.id === questionId)?.title ?? questionId
}

export const ContactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(120),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a phone number")
    .max(30)
    .regex(/^[0-9+().\-\s]+$/, "Please enter a valid phone number"),
  email: z.string().trim().email("Please enter a valid email").max(160),
  consent: z.literal(true, { message: "Please agree so we can contact you" }),
})
export type Contact = z.infer<typeof ContactSchema>

/** Server-side check: every question for the role answered with a known option. */
export const SubmissionSchema = ContactSchema.extend({
  role: z.enum(["buyer", "seller", "investor"]),
  answers: z.record(z.string(), z.string().max(40)),
  message: z.string().trim().max(2000).optional(),
  website: z.string().max(0).optional(),
}).superRefine((d, ctx) => {
  for (const q of QUESTIONS[d.role]) {
    const v = d.answers[q.id]
    if (!v || !q.options.some((o) => o.value === v)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["answers", q.id], message: "Missing answer" })
    }
  }
})
export type Submission = z.infer<typeof SubmissionSchema>
