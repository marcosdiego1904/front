
import { useState, useEffect, useRef } from "react"

export default function TransformationSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [animateElements, setAnimateElements] = useState({
    headline: false,
    subtitle: false,
    beforeAfter: false,
    scenarios: false,
    cta: false,
  })
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Sequential animations
          setTimeout(() => setAnimateElements((prev) => ({ ...prev, headline: true })), 200)
          setTimeout(() => setAnimateElements((prev) => ({ ...prev, subtitle: true })), 400)
          setTimeout(() => setAnimateElements((prev) => ({ ...prev, beforeAfter: true })), 600)
          setTimeout(() => setAnimateElements((prev) => ({ ...prev, scenarios: true })), 800)
          setTimeout(() => setAnimateElements((prev) => ({ ...prev, cta: true })), 1000)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-gradient-to-br from-gray-50 via-gray-100/50 to-gray-50 overflow-hidden font-inter"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-yellow-200/20 to-amber-200/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-orange-100/10 to-amber-100/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
          <svg width="200" height="100" viewBox="0 0 200 100" className="text-amber-400">
            <path
              d="M20 50 Q100 20 180 50"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
            <polygon points="175,45 185,50 175,55" fill="currentColor" />
          </svg>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main headline */}
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-bold text-[#2C3E50] mb-6 transition-all duration-700 ${
              animateElements.headline ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            The Moment Everything{" "}
            <span className="text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text">Changes</span>
          </h2>
          <p
            className={`text-lg md:text-xl text-[#2C3E50]/80 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
              animateElements.subtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            That life-changing "mental click" when you realize:{" "}
            <span className="font-bold text-amber-600">"God is real. This works. I want more."</span>
          </p>
        </div>

        {/* Before/After transformation showcase */}
        <div
          className={`relative grid md:grid-cols-2 gap-8 mb-20 transition-all duration-700 delay-400 ${
            animateElements.beforeAfter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full p-3 shadow-lg animate-pulse">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Before State */}
          <div className="bg-gradient-to-br from-gray-100/80 to-gray-200/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-300/50 shadow-lg hover:shadow-xl transition-all duration-300 relative">
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
          </div>

          {/* After State */}
          <div className="bg-gradient-to-br from-amber-50/90 to-orange-50/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-amber-200/70 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 to-orange-100/30 rounded-2xl"></div>
            <div className="absolute top-4 right-4">
              <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">After</div>
            </div>
            <div className="relative text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
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
              </div>
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">Scripture Becomes Your Secret Weapon</h3>
              <p className="text-[#2C3E50]/70 leading-relaxed">
                When anxiety hits, you instantly recall the perfect verse. When facing decisions, God's wisdom flows
                naturally. The Bible transforms from textbook to trusted ally.
              </p>
            </div>
          </div>
        </div>

        {/* Real-life scenario examples */}
        <div
          className={`grid md:grid-cols-3 gap-6 mb-16 transition-all duration-700 delay-600 ${
            animateElements.scenarios ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Anxiety Scenario */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 relative">
            <div className="absolute -top-3 left-6">
              <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-lg">😌</div>
            </div>
            <div className="pt-4">
              <p className="text-[#2C3E50] font-medium mb-3 italic">
                "When anxiety overwhelms me, Philippians 4:6-7 instantly brings peace. It's like having God's calm wash
                over me."
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-amber-600 font-semibold">Anxiety → Peace</span>
                <div className="flex text-amber-400">{"★".repeat(5)}</div>
              </div>
            </div>
          </div>

          {/* Decision Scenario */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 relative">
            <div className="absolute -top-3 left-6">
              <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-lg">💡</div>
            </div>
            <div className="pt-4">
              <p className="text-[#2C3E50] font-medium mb-3 italic">
                "Proverbs 3:5-6 guides every major decision. I trust His path instead of my own understanding, and
                clarity always comes."
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-amber-600 font-semibold">Confusion → Clarity</span>
                <div className="flex text-amber-400">{"★".repeat(5)}</div>
              </div>
            </div>
          </div>

          {/* Challenge Scenario */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 relative">
            <div className="absolute -top-3 left-6">
              <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-lg">💪</div>
            </div>
            <div className="pt-4">
              <p className="text-[#2C3E50] font-medium mb-3 italic">
                "Isaiah 41:10 transforms my fear into courage. When challenges seem impossible, God's strength becomes
                my strength."
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-amber-600 font-semibold">Fear → Courage</span>
                <div className="flex text-amber-400">{"★".repeat(5)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          className={`text-center transition-all duration-700 delay-800 ${
            animateElements.cta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <button className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-slate-700 hover:to-slate-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            Experience Your First Mental Click
          </button>
        </div>
      </div>
    </section>
  )
}
