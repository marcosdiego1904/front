"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface Struggle {
  id: string
  question: string
  verse: string
  reference: string
  explanation: string
}

const struggles: Struggle[] = [
  {
    id: "overwhelmed",
    question: "Feeling Overwhelmed?",
    verse:
      "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
    reference: "Philippians 4:6-7",
    explanation:
      "Notice the shift? This isn't just a nice thought—it's your new strategy. The feeling of being overwhelmed is now a trigger to connect with God, whose peace becomes your guard. This is the 'Mental Click'—when Scripture becomes your most practical ally.",
  },
  {
    id: "decision",
    question: "Facing a Hard Decision?",
    verse:
      "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    reference: "Proverbs 3:5-6",
    explanation:
      "See how this changes everything? Instead of wrestling alone with decisions, you now have a clear process: trust, submit, receive guidance. This verse transforms confusion into a pathway to divine wisdom.",
  },
  {
    id: "alone",
    question: "Feeling Alone?",
    verse: "The Lord your God goes with you; he will never leave you nor forsake you.",
    reference: "Deuteronomy 31:6",
    explanation:
      "Feel that shift? Loneliness isn't your reality anymore—it's just a feeling that reminds you of this truth. You're never actually alone. This verse becomes your anchor in every moment of isolation.",
  },
]

export default function TurningPointSection() {
  const [selectedStruggle, setSelectedStruggle] = useState<string | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    const section = document.getElementById("turning-point-section")
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [])

  const handleStruggleSelect = (struggleId: string) => {
    setSelectedStruggle(struggleId)
    setIsRevealed(false)
    setTimeout(() => {
      const element = document.getElementById("turning-point-section")
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)
  }

  const handleReveal = () => {
    setTimeout(() => {
      setIsRevealed(true)
    }, 150)
  }

  const handleReset = () => {
    setSelectedStruggle(null)
    setIsRevealed(false)
  }

  const selectedStruggleData = struggles.find((s) => s.id === selectedStruggle)

  return (
    <section
      id="turning-point-section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100/30 via-transparent to-gray-50/20"></div>

      {/* Dynamic Background Shift */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ${
          isRevealed ? "bg-gradient-to-br from-amber-50/60 via-yellow-50/30 to-orange-50/40 opacity-100" : "opacity-0"
        }`}
      ></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Header */}
        <div
          className={`text-center mb-12 sm:mb-16 transition-all duration-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ color: "#2C3E50" }}>
            From Text on a Page to{" "}
            <span className="text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text">Power</span>{" "}
            in Your Life
          </h2>
          <p
            className="text-xl max-w-3xl mx-auto leading-relaxed font-medium"
            style={{ color: "#2C3E50", opacity: 0.8 }}
          >
            The Bible isn't a distant textbook; it's a practical guide for your daily life.
            <br />
            <strong>Choose a real-life situation below to experience the shift.</strong>
          </p>
        </div>

        {/* Interactive Experience */}
        <div className="max-w-4xl mx-auto">
          {!selectedStruggle ? (
            /* Initial State - Three Cards */
            <div
              className={`grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 transition-all duration-800 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              {struggles.map((struggle, index) => (
                <div
                  key={struggle.id}
                  onClick={() => handleStruggleSelect(struggle.id)}
                  className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div
                    className="bg-slate-800 backdrop-blur-sm rounded-2xl p-8 sm:p-10 text-center shadow-xl hover:shadow-2xl border border-slate-700/50 transition-all duration-300 group-hover:border-amber-400 group-hover:bg-slate-700 group-hover:shadow-amber-500/30 min-h-[200px] flex flex-col justify-center"
                    style={{
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    {/* Struggle Icon */}
                    <div className="mb-6 flex justify-center">
                      <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center group-hover:bg-amber-500/20 transition-all duration-300 group-hover:shadow-lg">
                        {struggle.id === "overwhelmed" && (
                          <svg
                            className="w-6 h-6 text-white group-hover:text-amber-400 transition-colors duration-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        )}
                        {struggle.id === "decision" && (
                          <svg
                            className="w-6 h-6 text-white group-hover:text-amber-400 transition-colors duration-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                        {struggle.id === "alone" && (
                          <svg
                            className="w-6 h-6 text-white group-hover:text-amber-400 transition-colors duration-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        )}
                      </div>
                    </div>

                    <h3 className="font-nunito-sans text-xl sm:text-2xl font-semibold group-hover:text-amber-400 transition-colors duration-300 text-white">
                      {struggle.question}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Selected State - Focused Card */
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                {/* Card Container */}
                <div
                  className={`relative transition-all duration-700 ${
                    selectedStruggle ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                >
                  <div
                    className={`bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 ${
                      isRevealed ? "transform-gpu" : ""
                    }`}
                    style={{
                      minHeight: "400px",
                      perspective: "1000px",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {!isRevealed ? (
                      /* Front of Card - Problem State */
                      <div className="p-10 sm:p-12 text-center flex flex-col justify-center min-h-[400px]">
                        <div className="mb-8">
                          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-6">
                            <svg
                              className="w-8 h-8 text-slate-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13M0 12a9 9 0 1118 0 9 9 0 01-18 0z"
                              />
                            </svg>
                          </div>
                        </div>

                        <h3 className="font-lora text-2xl sm:text-3xl mb-6" style={{ color: "#2C3E50" }}>
                          The Bible isn't silent on this. It offers a direct strategy.
                        </h3>

                        <Button
                          onClick={handleReveal}
                          size="lg"
                          className="mx-auto bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-nunito-sans font-semibold text-lg px-8 py-4 rounded-xl transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          Reveal My Spiritual Weapon
                        </Button>
                      </div>
                    ) : (
                      /* Back of Card - Solution State */
                      <div
                        className="p-6 sm:p-8 text-center flex flex-col justify-center min-h-[350px] animate-fade-in"
                        style={{
                          background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #F59E0B 100%)",
                        }}
                      >
                        {/* Light Ray Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/30 via-transparent to-amber-200/20 pointer-events-none"></div>

                        <div className="relative z-10">
                          {/* Transformed Icon */}
                          <div className="mb-4">
                            <div className="w-12 h-12 mx-auto rounded-full bg-white/90 flex items-center justify-center mb-4 shadow-lg animate-pulse">
                              <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            </div>
                          </div>

                          <blockquote
                            className="font-lora text-lg sm:text-xl leading-snug mb-4 italic font-medium text-balance"
                            style={{
                              color: "#1F2937",
                              textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                              lineHeight: "1.3",
                            }}
                          >
                            "{selectedStruggleData?.verse}"
                          </blockquote>

                          <p
                            className="font-nunito-sans text-base font-semibold mb-5 tracking-wide"
                            style={{ color: "#374151" }}
                          >
                            - {selectedStruggleData?.reference}
                          </p>

                          <div
                            className="bg-white/90 rounded-xl p-4 mb-5 backdrop-blur-sm border border-white/50"
                            style={{
                              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                            }}
                          >
                            <p
                              className="font-nunito-sans text-sm sm:text-base leading-relaxed text-balance"
                              style={{ color: "#1F2937" }}
                            >
                              {selectedStruggleData?.explanation}
                            </p>
                          </div>

                          <Button
                            size="lg"
                            className="bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-nunito-sans font-semibold text-base px-8 py-3 rounded-xl transform transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl mb-3 border border-slate-600/20"
                          >
                            Learn Your First Life-Changing Verse
                          </Button>

                          <div className="mt-3">
                            <button
                              onClick={handleReset}
                              className="font-nunito-sans text-base text-slate-700 hover:text-slate-900 transition-colors duration-200 underline hover:no-underline font-medium"
                            >
                              Try another situation
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
