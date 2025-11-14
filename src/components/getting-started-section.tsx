
import { useEffect, useRef, useState } from "react"

export default function GettingStartedSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Animate steps sequentially
          setTimeout(() => setVisibleSteps([0]), 200)
          setTimeout(() => setVisibleSteps([0, 1]), 400)
          setTimeout(() => setVisibleSteps([0, 1, 2]), 600)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const steps = [
    {
      emoji: "📱",
      title: "Sign Up",
      description: "Pick your biggest struggle right now",
      time: "Takes 30 seconds",
    },
    {
      emoji: "🎧",
      title: "Learn Your Verse",
      description: "Follow our 3-step method: Absorb, Practice, Master",
      time: "Just 5-10 minutes",
    },
    {
      emoji: "⭐",
      title: "Experience the Click",
      description: "Apply your verse in real life and feel the transformation",
      time: "Your first 'aha!' moment",
    },
  ]

  return (
    <section ref={sectionRef} className="relative py-20 bg-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/40 to-orange-200/40 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-yellow-200/40 to-amber-200/40 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-orange-100/30 to-amber-100/30 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Header - Centered at top like method section */}
        <div
          className={`mb-16 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-6 font-inter">
            Start Your Transformation in{" "}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Minutes</span>
          </h2>
          <p className="text-xl text-[#2C3E50]/80 max-w-3xl mx-auto leading-relaxed font-medium">
            No complicated setup. No overwhelming lessons. Just 3 simple steps to your first memorized verse.
          </p>
        </div>

        {/* Steps Grid - 3 columns like method section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-700 border border-amber-100/50 relative ${
                visibleSteps.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{
                transitionDelay: visibleSteps.includes(index) ? `${600 + index * 200}ms` : "0ms",
              }}
            >
              {/* Step number badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-base shadow-lg">
                {index + 1}
              </div>

              {/* Emoji icon */}
              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl">
                  <div className="text-6xl transition-transform duration-300 hover:scale-110">{step.emoji}</div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-4 font-inter">{step.title}</h3>

              {/* Description */}
              <p className="text-base text-[#2C3E50]/75 leading-relaxed mb-4">{step.description}</p>

              {/* Time badge */}
              <div className="inline-block bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
                {step.time}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section - Centered at bottom like method section */}
        <div
          className={`text-center transition-all duration-800 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            transitionDelay: isVisible ? "1400ms" : "0ms",
          }}
        >
          <p className="text-xl text-[#2C3E50]/80 mb-8 font-medium">
            Most Christians experience their first mental click within{" "}
            <span className="text-amber-600 font-bold">24 hours</span>
          </p>

          <button className="group relative px-10 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:from-emerald-500 hover:to-emerald-400 hover:scale-105 hover:shadow-2xl">
            <span className="relative z-10">Get Armed — Free Forever</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-300/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </section>
  )
}
