import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

export default function DailyBattlesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [animateElements, setAnimateElements] = useState({
    headline: false,
    problem: false,
    stats: false,
    comparison: false,
    scripture: false,
    cta: false,
  })
  const sectionRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Sequential animations
          setTimeout(() => setAnimateElements((prev) => ({ ...prev, headline: true })), 200)
          setTimeout(() => setAnimateElements((prev) => ({ ...prev, problem: true })), 400)
          setTimeout(() => setAnimateElements((prev) => ({ ...prev, stats: true })), 600)
          setTimeout(() => setAnimateElements((prev) => ({ ...prev, comparison: true })), 800)
          setTimeout(() => setAnimateElements((prev) => ({ ...prev, scripture: true })), 1000)
          setTimeout(() => setAnimateElements((prev) => ({ ...prev, cta: true })), 1200)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleStartClick = () => {
    navigate("/register")
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden font-inter"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main headline */}
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 transition-all duration-700 ${
              animateElements.headline ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            You're in a Daily Battle.{" "}
            <span className="text-transparent bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text">
              And You're Fighting Unarmed.
            </span>
          </h2>
          <p
            className={`text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
              animateElements.problem ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Every day you face anxiety, fear, temptation, and tough decisions. Most Christians lose these battles
            because they can't recall Scripture when it matters most.
          </p>
        </div>

        {/* Statistics */}
        <div
          className={`grid md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto transition-all duration-700 delay-400 ${
            animateElements.stats ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center border-2 border-red-400/30">
                <span className="text-4xl font-bold text-red-400">87%</span>
              </div>
            </div>
            <p className="text-center text-gray-300 text-lg leading-relaxed">
              Of Christians <span className="font-bold text-white">can't recall a single verse</span> when facing
              real-life struggles
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-emerald-400/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center border-2 border-emerald-400/40">
                <span className="text-4xl font-bold text-emerald-400">3x</span>
              </div>
            </div>
            <p className="text-center text-gray-300 text-lg leading-relaxed">
              Those who memorize Scripture report <span className="font-bold text-white">3x higher peace and clarity</span> in daily challenges
            </p>
          </div>
        </div>

        {/* Before/After Comparison */}
        <div
          className={`grid md:grid-cols-2 gap-8 mb-20 transition-all duration-700 delay-600 ${
            animateElements.comparison ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Before - Unarmed */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/30 shadow-lg relative">
            <div className="absolute top-4 right-4">
              <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-semibold border border-red-400/30">
                Unarmed
              </div>
            </div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-400"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Without Scripture Memory</h3>
              <ul className="text-left text-gray-300 space-y-3">
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span>Anxiety overwhelms you with no clear response</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span>Decisions feel impossible without divine guidance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span>Temptation wins because you have no defense</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span>The Bible feels distant from your daily struggles</span>
                </li>
              </ul>
            </div>
          </div>

          {/* After - Armed */}
          <div className="bg-gradient-to-br from-amber-900/40 via-orange-900/30 to-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-amber-400/30 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-2xl"></div>
            <div className="absolute top-4 right-4">
              <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-semibold border border-emerald-400/40">
                Armed
              </div>
            </div>
            <div className="relative text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-white"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">With Scripture in Your Heart</h3>
              <ul className="text-left text-gray-200 space-y-3">
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-2">✓</span>
                  <span className="font-medium">Peace replaces anxiety instantly with Phil 4:6-7</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-2">✓</span>
                  <span className="font-medium">Clarity guides every decision with Prov 3:5-6</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-2">✓</span>
                  <span className="font-medium">Strength defeats temptation with 1 Cor 10:13</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-400 mr-2">✓</span>
                  <span className="font-medium">God's Word becomes your practical weapon</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Biblical Foundation */}
        <div
          className={`max-w-4xl mx-auto mb-16 transition-all duration-700 delay-800 ${
            animateElements.scripture ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-slate-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border-2 border-amber-400/30 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5"></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>

            <div className="relative">
              <div className="text-center mb-6">
                <div className="inline-block p-3 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
                    <path d="M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h16v2H4v-2zm0 4h10v2H4v-2z" />
                  </svg>
                </div>
                <p className="text-amber-400 font-semibold text-sm uppercase tracking-wide mb-4">
                  God's Command
                </p>
              </div>

              <blockquote className="text-2xl md:text-3xl text-white text-center leading-relaxed font-medium mb-6 italic">
                "Take... the sword of the Spirit, which is the word of God."
              </blockquote>

              <p className="text-center text-amber-400 font-bold text-lg mb-6">
                — Ephesians 6:17
              </p>

              <p className="text-gray-300 text-center text-lg leading-relaxed max-w-2xl mx-auto">
                Scripture isn't just for Sunday mornings. It's your <span className="font-bold text-white">weapon</span> for Monday's anxiety,
                Wednesday's temptation, and Friday's tough decision. But you can't use what you can't remember.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          className={`text-center transition-all duration-700 delay-1000 ${
            animateElements.cta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-xl text-gray-300 mb-8 font-medium">
            Join <span className="text-emerald-400 font-bold">12,847 Christians</span> who've armed themselves with Scripture
          </p>

          <button
            onClick={handleStartClick}
            className="group relative px-10 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:from-emerald-500 hover:to-emerald-400 hover:scale-105 hover:shadow-2xl shadow-lg"
          >
            <span className="relative z-10">Arm Yourself With Your First Verse — Free</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <p className="text-gray-400 text-sm mt-4">
            Takes 10 minutes. Remember it forever.
          </p>
        </div>
      </div>
    </section>
  )
}
