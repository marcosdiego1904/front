import Navigation from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import TurningPointSection from "@/components/turning-point-section"
import MethodSection from "@/components/method-section"
import TransformationSection from "@/components/transformation-section"
import SocialProofSection from "@/components/social-proof-section"
import GettingStartedSection from "@/components/getting-started-section"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <TurningPointSection />
      <MethodSection />
      <TransformationSection />
      <SocialProofSection />
      <GettingStartedSection />
    </main>
  )
}
