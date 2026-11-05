import { z } from "zod"

/**
 * Small, topic-specific contact popups (credit help, talk with Ruth, auction help).
 * Each asks one question about what the person needs, plus contact details.
 */
export type ContactTopic = "credit" | "agent" | "auction" | "landbank"

export const CONTACT_TOPICS: Record<
  ContactTopic,
  { title: string; intro: string; question: string; options: { value: string; label: string }[]; thanks: string }
> = {
  credit: {
    title: "Get credit help",
    intro: "Tell us where you're starting. We'll reach out to set up a free call about your credit.",
    question: "What do you need help with?",
    options: [
      { value: "raise-score", label: "Raise my score so I can buy" },
      { value: "fix-errors", label: "Fix mistakes on my credit report" },
      { value: "collections", label: "Collections or charge-offs" },
      { value: "build-new", label: "Build credit from scratch" },
    ],
    thanks: "We'll call or text you within one business day to set up your free credit call.",
  },
  agent: {
    title: "Talk with Ruth",
    intro: "Ruth Dorval of Open Doors LLC speaks English and Haitian Creole. Tell her what you're looking for.",
    question: "What do you want to talk about?",
    options: [
      { value: "buying", label: "Buying a home" },
      { value: "selling", label: "Selling a home or land" },
      { value: "pre-approval", label: "Getting pre-approved" },
      { value: "other", label: "Something else" },
    ],
    thanks: "Ruth or our team will call or text you within one business day.",
  },
  auction: {
    title: "Get help with an auction",
    intro: "From finding a property to getting your registration in on time — tell us where you are.",
    question: "Where are you at?",
    options: [
      { value: "find-property", label: "I want to find a property" },
      { value: "registration", label: "I need help registering" },
      { value: "research", label: "I found a property — help me research it" },
      { value: "next-auctions", label: "Tell me when the next auctions open" },
    ],
    thanks: "We'll call or text you within one business day.",
  },
  landbank: {
    title: "Get help buying from the Land Bank",
    intro: "Applications are due by 2 PM on the last Tuesday of each month. Tell us where you are and we'll help you get yours in.",
    question: "What do you need help with?",
    options: [
      { value: "pick-property", label: "Picking a property" },
      { value: "viewing", label: "Setting up a viewing" },
      { value: "application", label: "Filling out the application" },
      { value: "budget", label: "My budget and timeline (Form A)" },
    ],
    thanks: "We'll call or text you within one business day — before this month's deadline if we can.",
  },
}

export const ContactRequestSchema = z
  .object({
    topic: z.enum(["credit", "agent", "auction", "landbank"]),
    need: z.string().min(1, "Choose one").max(40),
    name: z.string().trim().min(1, "Please enter your name").max(120),
    phone: z
      .string()
      .trim()
      .min(7, "Please enter a phone number")
      .max(30)
      .regex(/^[0-9+().\-\s]+$/, "Please enter a valid phone number"),
    email: z.string().trim().email("Please enter a valid email").max(160),
    message: z.string().trim().max(2000).optional(),
    consent: z.literal(true, { message: "Please agree so we can contact you" }),
    website: z.string().max(0).optional(),
  })
  .superRefine((d, ctx) => {
    if (!CONTACT_TOPICS[d.topic].options.some((o) => o.value === d.need)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["need"], message: "Choose one" })
    }
  })
export type ContactRequest = z.infer<typeof ContactRequestSchema>
