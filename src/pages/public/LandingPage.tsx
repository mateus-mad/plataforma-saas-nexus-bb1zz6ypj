import { HeroSection } from '@/components/landing/HeroSection'
import { SystemOverviewSection } from '@/components/landing/SystemOverviewSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { ComplianceSection } from '@/components/landing/ComplianceSection'
import { AboutSection } from '@/components/landing/AboutSection'

export default function LandingPage() {
  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans selection:bg-primary/30">
      <HeroSection />
      <SystemOverviewSection />
      <FeaturesSection />
      <ComplianceSection />
      <AboutSection />
    </div>
  )
}
