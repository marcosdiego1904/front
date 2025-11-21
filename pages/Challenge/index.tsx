import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  fadeInUp,
  staggerContainer,
  scaleInSpring,
  buttonHover,
  buttonTap,
  defaultViewport,
  mobileViewport,
} from "@/lib/animations";
import { BookOpen, Calendar, Trophy, ChevronRight, Flame, Heart, Shield, Crown } from "lucide-react";

// 30-Day Challenge Verse Data
const challengeWeeks = [
  {
    week: 1,
    theme: "Identity & Worth",
    icon: Heart,
    color: "from-rose-500 to-pink-500",
    bgColor: "from-rose-50 to-pink-50",
    borderColor: "border-rose-200",
    verses: [
      { day: 1, verse: "Jeremiah 29:11", hook: "Feeling lost about your future?" },
      { day: 2, verse: "Psalm 139:14", hook: "Ever looked in the mirror and felt not enough?" },
      { day: 3, verse: "1 Timothy 4:12", hook: '"You\'re too young."' },
      { day: 4, verse: "Isaiah 43:1", hook: "Ever feel like just a number?" },
      { day: 5, verse: "Romans 8:1", hook: "Can't stop replaying your mistakes?" },
      { day: 6, verse: "Zephaniah 3:17", hook: "When's the last time someone celebrated you?" },
      { day: 7, verse: "Ephesians 2:10", hook: "Feel like you have no purpose?" },
    ],
  },
  {
    week: 2,
    theme: "Anxiety, Fear & Hard Seasons",
    icon: Shield,
    color: "from-blue-500 to-indigo-500",
    bgColor: "from-blue-50 to-indigo-50",
    borderColor: "border-blue-200",
    verses: [
      { day: 8, verse: "Isaiah 41:10", hook: "It's 3 AM. Your brain won't stop." },
      { day: 9, verse: "Philippians 4:6-7", hook: "Your brain won't shut off at night?" },
      { day: 10, verse: "Psalm 23:4", hook: "Ever felt completely alone in darkness?" },
      { day: 11, verse: "2 Timothy 1:7", hook: "Fear is running your decisions?" },
      { day: 12, verse: "Matthew 11:28", hook: "Exhausted and nobody notices?" },
      { day: 13, verse: "Psalm 46:1", hook: "When everything falls apart at once" },
      { day: 14, verse: "Isaiah 40:31", hook: "Running on empty?" },
    ],
  },
  {
    week: 3,
    theme: "Relationships, Forgiveness & Love",
    icon: Heart,
    color: "from-amber-500 to-orange-500",
    bgColor: "from-amber-50 to-orange-50",
    borderColor: "border-amber-200",
    verses: [
      { day: 15, verse: "1 Corinthians 13:4-5", hook: "We quote this at weddings but do we live it?" },
      { day: 16, verse: "Proverbs 17:17", hook: "How many real friends do you have?" },
      { day: 17, verse: "Ephesians 4:32", hook: "Holding a grudge that's eating you alive?" },
      { day: 18, verse: "Colossians 3:13", hook: "They don't deserve forgiveness? Neither did you." },
      { day: 19, verse: "Matthew 6:14", hook: "Forgiveness feels impossible sometimes" },
      { day: 20, verse: "Romans 12:18", hook: "Some people are just hard to love" },
      { day: 21, verse: "1 John 4:19", hook: "Don't know how to love? Start here." },
    ],
  },
  {
    week: 4,
    theme: "Strength, Faith & Finishing Strong",
    icon: Crown,
    color: "from-emerald-500 to-teal-500",
    bgColor: "from-emerald-50 to-teal-50",
    borderColor: "border-emerald-200",
    verses: [
      { day: 22, verse: "Philippians 4:13", hook: "Most misquoted verse ever. Here's what it really means." },
      { day: 23, verse: "Joshua 1:9", hook: "About to do something terrifying?" },
      { day: 24, verse: "Proverbs 3:5-6", hook: "Control freak? This verse is for you." },
      { day: 25, verse: "Romans 8:28", hook: "Bad things keep happening. Where's God?" },
      { day: 26, verse: "Hebrews 11:1", hook: "What even is faith?" },
      { day: 27, verse: "James 1:2-3", hook: "Joy in suffering? That sounds insane." },
      { day: 28, verse: "2 Corinthians 12:9", hook: "Weakness isn't failure." },
      { day: 29, verse: "Galatians 6:9", hook: "Ready to give up?" },
      { day: 30, verse: "Psalm 119:105", hook: "30 days. 30 verses. This is why." },
    ],
  },
];

export default function ChallengePage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleStartChallenge = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Hero Section */}
      <motion.section
        className="relative py-20 md:py-28 lg:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Animated background orbs */}
        {!isMobile && (
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 30, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.15, 1],
                y: [0, -40, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        )}

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full text-amber-700 font-semibold text-sm border border-amber-200">
              <Flame className="w-4 h-4" />
              30-Day Challenge
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#2C3E50] mb-6 leading-tight"
            style={{ fontFamily: "Lora, serif" }}
          >
            30 Verses.{" "}
            <span className="text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text">
              30 Days.
            </span>
            <br />
            One Transformed Mind.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl md:text-2xl text-[#2C3E50]/70 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Join the challenge that's helping thousands hide God's Word in their hearts.
            One verse a day. Life-changing truth. Are you in?
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={fadeInUp}>
            <motion.button
              onClick={handleStartChallenge}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              Start the Challenge
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        initial="hidden"
        whileInView="visible"
        viewport={isMobile ? mobileViewport : defaultViewport}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "Lora, serif" }}>
              How It Works
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              A simple system designed for real transformation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "One Verse Daily",
                description: "Each day you'll receive a carefully selected verse with a powerful hook that speaks to real-life struggles.",
              },
              {
                icon: BookOpen,
                title: "Memorize & Meditate",
                description: "Use our proven 5-step method to move each verse from your screen to your heart in minutes.",
              },
              {
                icon: Trophy,
                title: "Transform Your Mind",
                description: "By day 30, you'll have 30 scriptures ready to deploy against anxiety, doubt, and fear.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={scaleInSpring}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center hover:border-emerald-400/30 transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Weekly Verses Section */}
      <motion.section
        className="py-16 md:py-24 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={isMobile ? mobileViewport : defaultViewport}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C3E50] mb-4" style={{ fontFamily: "Lora, serif" }}>
              Your{" "}
              <span className="text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text">
                30-Day Journey
              </span>
            </h2>
            <p className="text-lg text-[#2C3E50]/70 max-w-2xl mx-auto">
              Four weeks. Four themes. Thirty life-changing verses.
            </p>
          </motion.div>

          <div className="space-y-8">
            {challengeWeeks.map((week, weekIndex) => (
              <motion.div
                key={week.week}
                variants={fadeInUp}
                className={`bg-gradient-to-br ${week.bgColor} rounded-3xl p-6 sm:p-8 border ${week.borderColor}`}
              >
                {/* Week Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${week.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <week.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2C3E50]/60 uppercase tracking-wide">
                      Week {week.week}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#2C3E50]">
                      {week.theme}
                    </h3>
                  </div>
                </div>

                {/* Verses Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {week.verses.map((verse) => (
                    <motion.div
                      key={verse.day}
                      className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`w-8 h-8 bg-gradient-to-br ${week.color} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                          {verse.day}
                        </span>
                        <span className="font-bold text-[#2C3E50]">{verse.verse}</span>
                      </div>
                      <p className="text-sm text-[#2C3E50]/60 italic">"{verse.hook}"</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section
        className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#2C3E50] via-slate-800 to-[#2C3E50]"
        initial="hidden"
        whileInView="visible"
        viewport={isMobile ? mobileViewport : defaultViewport}
        variants={staggerContainer}
      >
        <div className="max-w-4xl mx-auto text-center relative">
          {/* Decorative elements */}
          {!isMobile && (
            <>
              <motion.div
                className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-10 -right-10 w-52 h-52 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </>
          )}

          <motion.div variants={fadeInUp} className="relative z-10">
            <div className="mb-8">
              <span className="text-6xl">🔥</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "Lora, serif" }}
            >
              Ready to Transform Your Mind?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              In 30 days, you could have 30 powerful scriptures memorized and ready to guide you through any situation life throws at you.
            </p>
            <motion.button
              onClick={handleStartChallenge}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-12 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              Join the Challenge
              <ChevronRight className="w-5 h-5" />
            </motion.button>
            <p className="mt-6 text-gray-400 text-sm">
              Free to join. Start anytime. No credit card required.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer spacing */}
      <div className="h-8 bg-gradient-to-br from-white via-gray-50 to-white" />
    </div>
  );
}
