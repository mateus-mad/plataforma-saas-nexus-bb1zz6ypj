import { HeroSection } from '@/components/landing/HeroSection'
import { GrowthSection } from '@/components/landing/GrowthSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { IntegrationSection } from '@/components/landing/IntegrationSection'
import { RoadmapSection } from '@/components/landing/RoadmapSection'
import { AboutSection } from '@/components/landing/AboutSection'

export default function LandingPage() {
  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans selection:bg-primary/30">
      <HeroSection />
      <GrowthSection />
      <FeaturesSection />
      <IntegrationSection />
      <RoadmapSection />
      <AboutSection />
    </div>
  )
}
