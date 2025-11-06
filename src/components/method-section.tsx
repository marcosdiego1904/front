
import type React from "react"
import { useState, useEffect, useRef } from "react"

export default function MethodSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.2,
        rootMargin: "-50px 0px",
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const features = [
    {
      icon: <div className="text-6xl transition-transform duration-300 group-hover:scale-110">📖</div>,
      title: "1. Absorb & Understand",
      description:
        "First, we break the verse into simple pieces and you read it aloud. This combination of deconstruction and auditory learning makes it easy to grasp and remember.",
    },
    {
      icon: <div className="text-6xl transition-transform duration-300 group-hover:scale-110">🎮</div>,
      title: "2. Practice Through Play",
      description:
        'Fun, interactive exercises like "Fill in the Blanks" challenge you to recall what you\'ve learned, turning practice into a rewarding game.',
    },
    {
      icon: <div className="text-6xl transition-transform duration-300 group-hover:scale-110">🏆</div>,
      title: "3. Master for Life",
      description:
        "The final step: write the verse from memory. This powerful act of recall solidifies your knowledge, locking it in for good.",
    },
  ]

  return (
    <section ref={sectionRef} className="bg-white py-20 px-4 font-inter relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FFD700] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#E8B86D] rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Header */}
        <div
          className={`mb-16 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-5xl font-black text-[#2C3E50] mb-6 leading-tight">
            A Simple Method That <span className="text-[#E8B86D]">Feels Like a Game</span>
          </h2>
          <p className="text-xl text-[#2C3E50]/80 max-w-3xl mx-auto leading-relaxed font-medium">
            The human brain forgets 90% of what it reads. Our 3-step, science-backed method builds lasting memory by
            engaging your senses.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center transition-all duration-700 ease-out cursor-pointer relative overflow-hidden border border-[#E8B86D]/20 shadow-lg hover:shadow-2xl ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{
                transitionDelay: isVisible ? `${600 + index * 200}ms` : "0ms",
              }}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={() => setHoveredCard(index)}
            >
              {/* Glare effect */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none`}
                style={{
                  background:
                    hoveredCard === index
                      ? "linear-gradient(45deg, transparent 30%, rgba(232, 184, 109, 0.4) 50%, transparent 70%)"
                      : "none",
                }}
              />

              <div className="relative z-10">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-gradient-to-br from-[#FFD700]/10 to-[#E8B86D]/10 rounded-2xl">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">{feature.title}</h3>
                <p className="text-base text-[#2C3E50]/75 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div
          className={`text-center transition-all duration-800 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            transitionDelay: isVisible ? "1400ms" : "0ms",
          }}
        >
          <button className="bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:from-[#34495E] hover:to-[#2C3E50] hover:shadow-2xl hover:-translate-y-1 hover:scale-105 relative overflow-hidden group">
            <span className="relative z-10">See The Method in Action</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#E8B86D]/20 to-[#FFD700]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </section>
  )
}

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
