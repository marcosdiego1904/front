import { lazy, Suspense } from "react"
import HeroSection from "@/components/hero-section"

// Lazy load sections below the fold for better performance
const TurningPointSection = lazy(() => import("@/components/turning-point-section"))
const DailyBattlesSection = lazy(() => import("@/components/daily-battles-section"))
const MethodSection = lazy(() => import("@/components/method-section"))
const TransformationSection = lazy(() => import("@/components/transformation-section"))
const SocialProofSection = lazy(() => import("@/components/social-proof-section"))
const GettingStartedSection = lazy(() => import("@/components/getting-started-section"))

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* HeroSection loads immediately for fast initial paint */}
      <HeroSection />

      {/* Below-fold sections lazy load for better performance */}
      <Suspense fallback={<div className="min-h-[50vh] bg-gradient-to-br from-white via-gray-50 to-white" />}>
        <TurningPointSection />
        <DailyBattlesSection />
        <MethodSection />
        <TransformationSection />
        <SocialProofSection />
        <GettingStartedSection />
      </Suspense>
    </main>
  )
}
