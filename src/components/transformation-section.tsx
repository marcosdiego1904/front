import { motion } from "framer-motion"
import {
  staggerContainer,
  fadeInUp,
  slideInLeft,
  slideInRight,
  scaleInSpring,
  defaultViewport,
  buttonHover,
  buttonTap,
} from "@/lib/animations"

export default function TransformationSection() {
  return (
    <motion.section
      className="relative py-20 md:py-32 bg-gradient-to-br from-gray-50 via-gray-100/50 to-gray-50 overflow-hidden font-inter"
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={staggerContainer}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-yellow-200/20 to-amber-200/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-orange-100/10 to-amber-100/10 rounded-full blur-2xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main headline */}
        <motion.div className="text-center mb-16" variants={fadeInUp}>
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2C3E50] mb-6"
            variants={fadeInUp}
          >
            The Moment Everything{" "}
            <span className="text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text">Changes</span>
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-[#2C3E50]/80 max-w-3xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            That life-changing "mental click" when you realize:{" "}
            <span className="font-bold text-amber-600">"God is real. This works. I want more."</span>
          </motion.p>
        </motion.div>

        {/* Before/After transformation showcase */}
        <motion.div
          className="relative grid md:grid-cols-2 gap-8 mb-20"
          variants={staggerContainer}
        >
          {/* Arrow in center on desktop */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
            <motion.div
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full p-3 shadow-lg"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.div>
          </div>

          {/* Before State */}
          <motion.div
            className="bg-gradient-to-br from-gray-100/80 to-gray-200/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-300/50 shadow-lg hover:shadow-xl transition-all duration-300 relative"
            variants={slideInLeft}
            whileHover={{ y: -5 }}
          >
            <div className="absolute top-4 right-4">
              <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">Before</div>
            </div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-600"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  <path d="M8 7h8M8 11h6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">Bible Study Feels Like Homework</h3>
              <p className="text-[#2C3E50]/70 leading-relaxed">
                You read verses, think "that's nice," then forget them by tomorrow. Scripture feels distant from your
                real problems.
              </p>
            </div>
          </motion.div>

          {/* After State */}
          <motion.div
            className="bg-gradient-to-br from-amber-50/90 to-orange-50/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-amber-200/70 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
            variants={slideInRight}
            whileHover={{ y: -5, borderColor: "rgb(251, 191, 36)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 to-orange-100/30 rounded-2xl"></div>
            <div className="absolute top-4 right-4">
              <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">After</div>
            </div>
            <div className="relative text-center mb-6">
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-white"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">Scripture Becomes Your Secret Weapon</h3>
              <p className="text-[#2C3E50]/70 leading-relaxed">
                When anxiety hits, you instantly recall the perfect verse. When facing decisions, God's wisdom flows
                naturally. The Bible transforms from textbook to trusted ally.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Real-life scenario examples */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-16"
          variants={staggerContainer}
        >
          {[
            {
              emoji: "😌",
              quote: "When anxiety overwhelms me, Philippians 4:6-7 instantly brings peace. It's like having God's calm wash over me.",
              author: "Sarah M., Denver",
              transformation: "Anxiety → Peace"
            },
            {
              emoji: "💡",
              quote: "Proverbs 3:5-6 guides every major decision. I trust His path instead of my own understanding, and clarity always comes.",
              author: "Michael R., Atlanta",
              transformation: "Confusion → Clarity"
            },
            {
              emoji: "💪",
              quote: "Isaiah 41:10 transforms my fear into courage. When challenges seem impossible, God's strength becomes my strength.",
              author: "Jennifer K., Austin",
              transformation: "Fear → Courage"
            }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-amber-200/50 shadow-lg text-left relative"
              variants={scaleInSpring}
              whileHover={{ y: -8, boxShadow: "0 20px 40px -12px rgba(217, 119, 6, 0.3)" }}
            >
              <div className="absolute -top-3 left-6">
                <motion.div
                  className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-lg"
                  whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {testimonial.emoji}
                </motion.div>
              </div>
              <div className="pt-4">
                <p className="text-[#2C3E50] font-medium mb-3 italic">
                  "{testimonial.quote}"
                </p>
                <p className="text-[#2C3E50]/70 text-sm mb-3 font-semibold">
                  — {testimonial.author}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-amber-600 font-semibold">{testimonial.transformation}</span>
                  <div className="flex text-amber-400">{"★".repeat(5)}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          variants={fadeInUp}
        >
          <motion.p
            className="text-xl text-[#2C3E50]/80 mb-8 font-medium"
            variants={fadeInUp}
          >
            Join <span className="text-emerald-600 font-bold">12,847 Christians</span> who've armed themselves with Scripture
          </motion.p>
          <motion.button
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 shadow-lg"
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            Experience Your First Victory — Free
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  )
}
