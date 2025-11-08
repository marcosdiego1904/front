
import { useState, useEffect, useRef } from "react"

export default function SocialProofSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedElements, setAnimatedElements] = useState({
    header: false,
    testimonials: [false, false, false],
    cta: false,
  })
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)

          // Sequential animations
          setTimeout(() => {
            setAnimatedElements((prev) => ({ ...prev, header: true }))
          }, 200)

          setTimeout(() => {
            setAnimatedElements((prev) => ({
              ...prev,
              testimonials: [true, false, false],
            }))
          }, 600)

          setTimeout(() => {
            setAnimatedElements((prev) => ({
              ...prev,
              testimonials: [true, true, false],
            }))
          }, 800)

          setTimeout(() => {
            setAnimatedElements((prev) => ({
              ...prev,
              testimonials: [true, true, true],
            }))
          }, 1000)

          setTimeout(() => {
            setAnimatedElements((prev) => ({ ...prev, cta: true }))
          }, 1400)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

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
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-amber-50/30 via-orange-50/20 to-yellow-50/30 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-yellow-200/20 to-amber-200/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-orange-100/10 to-amber-100/10 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Header - Centered at top like method section */}
        <div
          className={`mb-16 transition-all duration-1000 ease-out ${
            animatedElements.header ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 font-inter">
            Real Stories, Real{" "}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Transformation
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto font-inter leading-relaxed">
            See how Christians are rediscovering their most powerful ally
          </p>
        </div>

        {/* Testimonial Cards Grid - 3 columns like method section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-700 border border-amber-100/50 text-left ${
                animatedElements.testimonials[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{
                transitionDelay: animatedElements.testimonials[index] ? `${600 + index * 200}ms` : "0ms",
              }}
            >
              {/* Avatar */}
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 flex-shrink-0">
                  {testimonial.avatar}
                </div>
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
            </div>
          ))}
        </div>

        {/* CTA Section - Centered at bottom like method section */}
        <div
          className={`text-center transition-all duration-800 ease-out ${
            animatedElements.cta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            transitionDelay: animatedElements.cta ? "1400ms" : "0ms",
          }}
        >
          <p className="text-xl text-slate-700 mb-8 font-inter">
            Join 2,847+ Christians who transformed their relationship with Scripture
          </p>
          <button className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-12 py-4 rounded-full text-lg font-semibold hover:from-slate-700 hover:to-slate-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-inter">
            Start Your Bible Romance Today
          </button>
        </div>
      </div>
    </section>
  )
}
