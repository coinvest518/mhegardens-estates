import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { AskAI } from "@/components/ask-ai"
import { WaysToBuy } from "@/components/ways-to-buy"
import { HowItWorksSteps } from "@/components/how-it-works-steps"
import { WhoWeHelp } from "@/components/who-we-help"
import { CreditHelp } from "@/components/credit-help"
import { MeetAgent } from "@/components/meet-agent"
import { EducationGrid } from "@/components/education-grid"
import { QualifierSection } from "@/components/qualifier/qualifier-section"
import { SiteFooter } from "@/components/site-footer"

// The hero shows this month's Land Bank list; refresh every 6 hours.
export const revalidate = 21600

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <AskAI />
        <WaysToBuy />
        <HowItWorksSteps />
        <WhoWeHelp />
        <CreditHelp />
        <MeetAgent />
        <EducationGrid />
        <QualifierSection />
      </main>
      <SiteFooter />
    </div>
  )
}
