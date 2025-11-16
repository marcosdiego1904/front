import { motion } from "framer-motion"
import {
  staggerContainer,
  fadeInUp,
  scaleInSpring,
  defaultViewport,
  mobileViewport,
  buttonHover,
  buttonTap,
} from "@/lib/animations"
import { useIsMobile } from "@/hooks/use-mobile"

export default function SocialProofSection() {
  const isMobile = useIsMobile()

  const testimonials = [
    {
      name: "Sarah M.",
      quote: "I finally understand why people say the Bible is alive",
      story:
        "Before: Bible felt like homework. After: I instinctively turn to Scripture when stressed. It's become my trusted companion.",
      avatar: "SM",
    },
    {
      name: "Marcus T.",
      quote: "My anxiety decreased 80% since I started",
      story:
        "Before: Panic attacks were weekly. After: When anxiety hits, Philippians 4:6-7 floods my mind automatically. Game changer.",
      avatar: "MT",
    },
    {
      name: "Jennifer L.",
      quote: "My kids ask me why I'm so peaceful now",
      story:
        "Before: Constant worry about decisions. After: I have God's wisdom memorized for every situation. My family notices the difference.",
      avatar: "JL",
    },
  ]

  return (
    <motion.section
      className="py-16 md:py-20 bg-gradient-to-br from-amber-50/30 via-orange-50/20 to-yellow-50/30 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={isMobile ? mobileViewport : defaultViewport}
      variants={staggerContainer}
    >
      {/* Background decorative elements - disabled on mobile for performance */}
      {!isMobile && (
        <div className="absolute inset-0 opacity-30">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 15, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-yellow-200/20 to-amber-200/20 rounded-full blur-xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -15, 0],
            }}
            transition={{
              duration: 6,
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
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Header - Centered at top like method section */}
        <motion.div className="mb-16" variants={fadeInUp}>
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 font-inter"
            variants={fadeInUp}
          >
            Real Stories, Real{" "}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Transformation
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-slate-600 max-w-3xl mx-auto font-inter leading-relaxed"
            variants={fadeInUp}
          >
            See how Christians are rediscovering their most powerful ally
          </motion.p>
        </motion.div>

        {/* Testimonial Cards Grid - 3 columns like method section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={staggerContainer}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-amber-100/50 text-left"
              variants={scaleInSpring}
              whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(217, 119, 6, 0.4)" }}
            >
              {/* Avatar */}
              <div className="flex items-center mb-6">
                <motion.div
                  className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 flex-shrink-0"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  {testimonial.avatar}
                </motion.div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-lg font-inter">{testimonial.name}</h3>
                  <div className="flex text-yellow-400 text-sm">{"★".repeat(5)}</div>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-slate-700 font-medium mb-4 text-lg leading-relaxed font-inter">
                "{testimonial.quote}"
              </blockquote>

              {/* Story */}
              <p className="text-slate-600 text-sm leading-relaxed font-inter">{testimonial.story}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section - Centered at bottom like method section */}
        <motion.div className="text-center" variants={fadeInUp}>
          <motion.p
            className="text-xl text-slate-700 mb-8 font-inter"
            variants={fadeInUp}
          >
            Join 2,847+ Christians who transformed their relationship with Scripture
          </motion.p>
          <motion.button
            className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-12 py-4 rounded-full text-lg font-semibold hover:from-slate-700 hover:to-slate-600 transition-all duration-300 shadow-lg font-inter"
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            Start Your Bible Romance Today
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  )
}
