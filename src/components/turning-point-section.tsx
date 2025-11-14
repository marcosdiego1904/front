
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  staggerContainer,
  fadeInUp,
  scaleInSpring,
  defaultViewport,
  cardHover,
  buttonHover,
  buttonTap,
} from "@/lib/animations"

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

  const handleStruggleSelect = (struggleId: string) => {
    setSelectedStruggle(struggleId)
    setIsRevealed(true)
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
    <motion.section
      id="turning-point-section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white"
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={staggerContainer}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100/30 via-transparent to-gray-50/20"></div>

      {/* Dynamic Background Shift */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-amber-50/60 via-yellow-50/30 to-orange-50/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Header */}
        <AnimatePresence>
          {!selectedStruggle && (
            <motion.div
              className="text-center mb-12 sm:mb-16"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-relaxed"
                style={{ color: "#2C3E50" }}
                variants={fadeInUp}
              >
                From Text on a Page to{" "}
                <span className="text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text">Weapon</span>
                <br />
                in Your Life
              </motion.h2>
              <motion.p
                className="text-xl max-w-3xl mx-auto leading-relaxed font-medium"
                style={{ color: "#2C3E50", opacity: 0.8 }}
                variants={fadeInUp}
              >
                The Bible isn't a distant textbook; it's a practical guide for your daily life.
                <br />
                <strong>Choose a real-life situation below to experience the shift.</strong>
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Experience */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {!selectedStruggle ? (
              /* Initial State - Three Cards */
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {struggles.map((struggle, index) => (
                  <motion.div
                    key={struggle.id}
                    onClick={() => handleStruggleSelect(struggle.id)}
                    className="cursor-pointer"
                    variants={scaleInSpring}
                    whileHover={{
                      scale: 1.05,
                      y: -8,
                      transition: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="bg-slate-800 backdrop-blur-sm rounded-2xl p-8 sm:p-10 text-center shadow-xl border border-slate-700/50 group h-[240px] flex flex-col justify-center"
                      style={{
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                      }}
                      whileHover={{
                        borderColor: "rgb(251, 191, 36)",
                        backgroundColor: "rgb(51, 65, 85)",
                        boxShadow: "0 12px 48px rgba(251, 191, 36, 0.3)",
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
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
            /* Selected State - Focused Card */
            <motion.div
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                {/* Card Container */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden"
                    style={{
                      minHeight: "400px",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {!isRevealed ? (
                        /* Front of Card - Problem State */
                        <motion.div
                          key="front"
                          className="p-10 sm:p-12 text-center flex flex-col justify-center min-h-[400px]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.div
                            className="mb-8"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                          >
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
                          </motion.div>

                          <motion.h3
                            className="font-lora text-2xl sm:text-3xl mb-6"
                            style={{ color: "#2C3E50" }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            The Bible isn't silent on this. It offers a direct strategy.
                          </motion.h3>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <Button
                              onClick={handleReveal}
                              size="lg"
                              className="mx-auto bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-nunito-sans font-semibold text-lg px-8 py-4 rounded-xl transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                              Show Me The Verse I Need
                            </Button>
                          </motion.div>
                        </motion.div>
                      ) : (
                        /* Back of Card - Solution State */
                        <motion.div
                          key="back"
                          className="p-6 sm:p-8 text-center flex flex-col justify-center min-h-[350px] relative overflow-hidden"
                          style={{
                            background: "linear-gradient(135deg, #FEFEFE 0%, #FAF8F5 50%, #F5F3EF 100%)",
                          }}
                          initial={{ opacity: 0, rotateY: -90 }}
                          animate={{ opacity: 1, rotateY: 0 }}
                          exit={{ opacity: 0, rotateY: 90 }}
                          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                        {/* Subtle Accent Border */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-orange-500"></div>
                        {/* Light Ray Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-transparent to-orange-50/20 pointer-events-none"></div>

                        <div className="relative z-10">
                          {/* Transformed Icon */}
                          <div className="mb-6">
                            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4 shadow-lg">
                              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            </div>
                          </div>

                          <blockquote
                            className="font-lora text-xl sm:text-2xl leading-relaxed mb-6 italic font-medium text-balance"
                            style={{
                              color: "#1F2937",
                              lineHeight: "1.5",
                            }}
                          >
                            "{selectedStruggleData?.verse}"
                          </blockquote>

                          <p
                            className="font-nunito-sans text-base font-bold mb-6 tracking-wide"
                            style={{ color: "#D97706" }}
                          >
                            - {selectedStruggleData?.reference}
                          </p>

                          <div
                            className="bg-amber-50/80 rounded-xl p-5 mb-6 backdrop-blur-sm border border-amber-100"
                            style={{
                              boxShadow: "0 4px 16px rgba(217, 119, 6, 0.08)",
                            }}
                          >
                            <p
                              className="font-nunito-sans text-sm sm:text-base leading-relaxed text-balance"
                              style={{ color: "#374151" }}
                            >
                              {selectedStruggleData?.explanation}
                            </p>
                          </div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <Button
                              size="lg"
                              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                              className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-nunito-sans font-semibold text-base px-8 py-3 rounded-xl transform transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl mb-3 border border-emerald-500/20"
                            >
                              Learn Your First Life-Changing Verse — Free
                            </Button>
                          </motion.div>

                          <motion.div
                            className="mt-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <motion.button
                              onClick={handleReset}
                              className="font-nunito-sans text-base text-slate-700 hover:text-slate-900 transition-colors duration-200 underline hover:no-underline font-medium"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Try another situation
                            </motion.button>
                          </motion.div>
                        </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  )
}
