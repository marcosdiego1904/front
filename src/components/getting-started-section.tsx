
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
      description: "Choose your first life situation (anxiety, decisions, or strength)",
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

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-800 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-6 font-inter">
            Start Your Transformation in{" "}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Minutes</span>
          </h2>
          <p className="text-xl text-[#2C3E50]/80 max-w-3xl mx-auto leading-relaxed">
            No complicated setup. No overwhelming lessons. Just 3 simple steps to your first memorized verse.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="relative">
            {/* Timeline line - vertical */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-200 via-orange-200 to-amber-200 transform -translate-x-1/2 hidden sm:block"></div>

            {/* Steps */}
            <div className="flex flex-col gap-12">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`relative transition-all duration-700 delay-${index * 200} ${
                    visibleSteps.includes(index)
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-8 scale-95"
                  }`}
                >
                  {/* Step card */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100/50 relative z-10">
                    {/* Step number */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>

                    {/* Emoji icon */}
                    <div className="text-5xl mb-4">{step.emoji}</div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-[#2C3E50] mb-3 font-inter">{step.title}</h3>

                    {/* Description */}
                    <p className="text-[#2C3E50]/70 mb-4 leading-relaxed">{step.description}</p>

                    {/* Time */}
                    <div className="inline-block bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
                      {step.time}
                    </div>
                  </div>

                  {/* Connection arrow (vertical) */}
                  {index < steps.length - 1 && (
                    <div className="hidden sm:block absolute left-1/2 -bottom-6 transform -translate-x-1/2 z-20">
                      <div className="w-8 h-8 bg-white rounded-full border-4 border-amber-300 flex items-center justify-center">
                        <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div
          className={`text-center transition-all duration-800 delay-800 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-lg text-[#2C3E50]/80 mb-8 font-medium">
            Most Christians experience their first mental click within{" "}
            <span className="text-amber-600 font-bold">24 hours</span>
          </p>

          <button className="group relative px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:from-slate-700 hover:to-slate-800 hover:scale-105 hover:shadow-xl">
            <span className="relative z-10">Get Your First Verse Now - Free</span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </section>
  )
}
