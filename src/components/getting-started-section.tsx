import { motion } from "framer-motion"
import {
  staggerContainer,
  fadeInUp,
  scaleInSpring,
  defaultViewport,
  buttonHover,
  buttonTap,
} from "@/lib/animations"

export default function GettingStartedSection() {
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
    <motion.section
      className="relative py-20 bg-white overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={staggerContainer}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/40 to-orange-200/40 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-yellow-200/40 to-amber-200/40 rounded-full blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -20, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-orange-100/30 to-amber-100/30 rounded-full blur-2xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Header - Centered at top like method section */}
        <motion.div className="mb-16" variants={fadeInUp}>
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-6 font-inter"
            variants={fadeInUp}
          >
            Start Your Transformation in{" "}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Minutes</span>
          </motion.h2>
          <motion.p
            className="text-xl text-[#2C3E50]/80 max-w-3xl mx-auto leading-relaxed font-medium"
            variants={fadeInUp}
          >
            No complicated setup. No overwhelming lessons. Just 3 simple steps to your first memorized verse.
          </motion.p>
        </motion.div>

        {/* Steps Grid - 3 columns like method section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={staggerContainer}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-amber-100/50 relative"
              variants={scaleInSpring}
              whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(217, 119, 6, 0.4)" }}
            >
              {/* Step number badge */}
              <motion.div
                className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-base shadow-lg"
                whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {index + 1}
              </motion.div>

              {/* Emoji icon */}
              <div className="mb-6 flex justify-center">
                <motion.div
                  className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl"
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-6xl transition-transform duration-300">{step.emoji}</div>
                </motion.div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-4 font-inter">{step.title}</h3>

              {/* Description */}
              <p className="text-base text-[#2C3E50]/75 leading-relaxed mb-4">{step.description}</p>

              {/* Time badge */}
              <div className="inline-block bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
                {step.time}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section - Centered at bottom like method section */}
        <motion.div className="text-center" variants={fadeInUp}>
          <motion.p
            className="text-xl text-[#2C3E50]/80 mb-8 font-medium"
            variants={fadeInUp}
          >
            Most Christians experience their first mental click within{" "}
            <span className="text-amber-600 font-bold">24 hours</span>
          </motion.p>

          <motion.button
            className="group relative px-10 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:from-emerald-500 hover:to-emerald-400 shadow-lg"
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            <span className="relative z-10">Get Armed — Free Forever</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-300/20 rounded-xl"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  )
}
