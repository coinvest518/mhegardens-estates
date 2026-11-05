import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { RevealObserver } from "@/components/reveal-observer"
import { AuthProvider } from "@/components/auth-provider"
import { QualifierModal } from "@/components/qualifier/qualifier-modal"
import { SITE } from "@/lib/site"
import "./globals.css"

const title = `${SITE.name} — Buy land and homes in Upstate New York`
const description =
  "Buy a home or land the regular way or the auction way. Mortgages, first-time buyer and down payment matching programs, county tax auctions, land bank properties, credit help, and help for sellers and investors. Book a free 30-minute consultation."

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    siteName: SITE.name,
    images: [{ url: "/brand/logo-512.jpg", width: 512, height: 512, alt: SITE.name }],
  },
  icons: {
    icon: "/brand/logo-96.png",
    apple: "/brand/logo-192.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
        <AuthProvider>
          {children}
          <QualifierModal />
        </AuthProvider>
        <Toaster />
        <Analytics />
        <RevealObserver />
      </body>
    </html>
  )
}
