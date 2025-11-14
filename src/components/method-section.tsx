import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  staggerContainer,
  fadeInUp,
  scaleInSpring,
  defaultViewport,
  cardHover,
  buttonHover,
  buttonTap,
} from "@/lib/animations"

export default function MethodSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const features = [
    {
      icon: <div className="text-6xl transition-transform duration-300 group-hover:scale-110">📖</div>,
      title: "1. Absorb & Lock It In",
      description:
        "First, we break the verse into simple pieces and you read it aloud. This combination of deconstruction and auditory learning makes it easy to grasp and remember.",
    },
    {
      icon: <div className="text-6xl transition-transform duration-300 group-hover:scale-110">🎮</div>,
      title: "2. Practice Until It Sticks",
      description:
        'Fun, interactive exercises like "Fill in the Blanks" challenge you to recall what you\'ve learned, turning practice into a rewarding game.',
    },
    {
      icon: <div className="text-6xl transition-transform duration-300 group-hover:scale-110">🏆</div>,
      title: "3. Master It For Life",
      description:
        "The final step: write the verse from memory. This powerful act of recall solidifies your knowledge, locking it in for good.",
    },
  ]

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardIndex: number) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
  }

  return (
    <motion.section
      className="bg-white py-20 px-4 font-inter relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={staggerContainer}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-[#FFD700] rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-[#E8B86D] rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Header */}
        <motion.div className="mb-16" variants={fadeInUp}>
          <motion.h2
            className="text-5xl font-black text-[#2C3E50] mb-6 leading-tight"
            variants={fadeInUp}
          >
            A Simple Method That <span className="text-[#E8B86D]">Feels Like a Game</span>
          </motion.h2>
          <motion.p
            className="text-xl text-[#2C3E50]/80 max-w-3xl mx-auto leading-relaxed font-medium"
            variants={fadeInUp}
          >
            The human brain forgets 90% of what it reads. Our 3-step, science-backed method builds lasting memory by
            engaging your senses.
          </motion.p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={staggerContainer}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center transition-all duration-700 ease-out cursor-pointer relative overflow-hidden border border-[#E8B86D]/20 shadow-lg"
              variants={scaleInSpring}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={() => setHoveredCard(index)}
              whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >
              {/* Glare effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.3 }}
                transition={{ duration: 0.3 }}
                style={{
                  background:
                    hoveredCard === index
                      ? "linear-gradient(45deg, transparent 30%, rgba(232, 184, 109, 0.4) 50%, transparent 70%)"
                      : "none",
                }}
              />

              <div className="relative z-10">
                <motion.div
                  className="mb-6 flex justify-center"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="p-4 bg-gradient-to-br from-[#FFD700]/10 to-[#E8B86D]/10 rounded-2xl">
                    {feature.icon}
                  </div>
                </motion.div>
                <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">{feature.title}</h3>
                <p className="text-base text-[#2C3E50]/75 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div className="text-center" variants={fadeInUp}>
          <motion.button
            className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:from-orange-500 hover:to-orange-400 relative overflow-hidden group"
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            <span className="relative z-10">See It Work — Start Now</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20"
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
