import type { Metadata, Viewport } from "next"
import "@fontsource-variable/public-sans"
import "@fontsource-variable/bricolage-grotesque"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/components/auth-provider"
import { QualifierModal } from "@/components/qualifier/qualifier-modal"
import { MobileActionBar } from "@/components/mobile-action-bar"
import { ContactModal } from "@/components/contact-modal"
import { SITE } from "@/lib/site"
import "./globals.css"

const title = `${SITE.name} — Buy land and homes in Upstate New York`
const description =
  "Buy a home or land with a mortgage, a first-time buyer program, a county tax auction or the land bank. Credit help, help for sellers and investors, and an AI guide. See if you qualify in a minute."

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
  themeColor: "#183d33",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
          <QualifierModal />
          <ContactModal />
          <MobileActionBar />
        </AuthProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
