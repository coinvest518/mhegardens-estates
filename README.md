# MHE Gardens — mhegardens.vercel.app

Land and home buying site for Upstate New York: ways to buy (mortgage, first-time buyer and down payment matching programs, county tax auctions, land bank, fix and flip), help for sellers and investors, credit help, guides, and a free-consultation form.

## Run locally

```bash
npm install
npm run dev
```

## Settings

- `lib/site.ts` — business name, contact email, agent details, and the booking / affiliate links (placeholders are `null` until added).
- `lib/auctions.ts` — auction list. Closed auctions hide themselves (the Auctions page rebuilds daily).
- `lib/education.ts` — guides and the bundle link.

## Environment variables (Vercel)

| Name | What it's for |
| --- | --- |
| `RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL` | Consultation form emails |
| `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID` | User sign-in (Firebase Auth). If these are missing, the sign-in button is hidden. |
