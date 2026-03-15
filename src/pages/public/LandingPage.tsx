import { HeroSection } from '@/components/landing/HeroSection'
import { GrowthSection } from '@/components/landing/GrowthSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { RoadmapSection } from '@/components/landing/RoadmapSection'
import { AboutSection } from '@/components/landing/AboutSection'

export default function LandingPage() {
  return (
    <div className="bg-slate-950 text-slate-50 min-h-screen font-sans selection:bg-primary/30">
      <HeroSection />
      <GrowthSection />
      <FeaturesSection />
      <RoadmapSection />
      <AboutSection />
    </div>
  )
}
