import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import bibleApiService from "../services/bibleApi"
import { motion } from "framer-motion"
import {
  staggerContainer,
  fadeInUp,
  scaleInSpring,
  defaultViewport,
  mobileViewport,
  buttonHover,
  buttonTap,
  cardHover
} from "@/lib/animations"
import { useIsMobile } from "@/hooks/use-mobile"

export default function HeroSection() {
  const [searchValue, setSearchValue] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [selectedTranslation, setSelectedTranslation] = useState(bibleApiService.getDefaultTranslation().id)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTopicPopover, setActiveTopicPopover] = useState<string | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const availableTranslations = bibleApiService.getAvailableTranslations()

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setActiveTopicPopover(null)
      }
    }

    if (activeTopicPopover) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activeTopicPopover])

  const handleSearch = async () => {
    if (!searchValue.trim()) return

    // Validate reference
    const validation = bibleApiService.validateReference(searchValue)
    if (!validation.isValid) {
      setError(validation.message || 'Invalid reference')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const verse = await bibleApiService.searchVerse(searchValue, selectedTranslation)

      // Navigate to Learn page with the verse
      const normalizedVerse = {
        id: verse.id,
        text_nlt: verse.text_nlt,
        verse_reference: verse.verse_reference,
        context_nlt: verse.context_nlt,
      }

      navigate('/learn', { state: { selectedVerse: normalizedVerse } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search verse. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handlePopularVerseClick = (verse: string) => {
    setSearchValue(verse)
    setError(null)
  }

  const handleTopicClick = (topicName: string) => {
    if (activeTopicPopover === topicName) {
      setActiveTopicPopover(null)
    } else {
      setActiveTopicPopover(topicName)
    }
  }

  const handleVerseSelect = (verse: string) => {
    setSearchValue(verse)
    setError(null)
    setActiveTopicPopover(null)
    // Scroll to search bar
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const popularVerses = ["John 3:16", "Psalm 23:1", "Romans 8:28", "Philippians 4:13"]

  const topics = [
    {
      name: "Faith",
      emoji: "✝️",
      verses: ["Hebrews 11:1", "Romans 10:17", "James 2:17"]
    },
    {
      name: "Hope",
      emoji: "🌟",
      verses: ["Romans 15:13", "Jeremiah 29:11", "Psalm 39:7"]
    },
    {
      name: "Love",
      emoji: "❤️",
      verses: ["1 Corinthians 13:4-7", "John 13:34", "1 John 4:8"]
    },
    {
      name: "Strength",
      emoji: "💪",
      verses: ["Philippians 4:13", "Isaiah 40:31", "Psalm 46:1"]
    },
    {
      name: "Peace",
      emoji: "🕊️",
      verses: ["John 14:27", "Philippians 4:6-7", "Romans 15:13"]
    },
  ]

  return (
    <motion.section
      className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Animated background blobs - disabled on mobile for performance */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-gray-200/30 via-gray-300/20 to-transparent rounded-full blur-3xl"
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-gray-300/25 via-gray-200/15 to-transparent rounded-full blur-3xl"
            animate={{
              y: [0, 30, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-amber-100/10 via-orange-100/10 to-transparent rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 w-full py-20 pb-64">
        <motion.div
          className="space-y-12 text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            className="flex justify-center"
            variants={fadeInUp}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-sm"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-xl">🕊️</span>
              <span className="text-sm font-semibold text-amber-700">Biblical Learning Reimagined</span>
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[#2C3E50] leading-tight"
            variants={fadeInUp}
          >
            Memorize Any Bible Verse in{" "}
            <span className="text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text">10 Minutes</span>
            <br />
            — Remember It Forever
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-[#2C3E50]/80 max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            Most Christians can't recall a single verse when they need it most. <strong>Change that today.</strong>
          </motion.p>

          <motion.div
            className="max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            <div
              className={`flex flex-col sm:flex-row items-stretch bg-white border-[3px] sm:rounded-full rounded-2xl overflow-hidden transition-all duration-300 ${isSearchFocused ? "shadow-[0_6px_28px_rgba(217,119,6,0.35)] -translate-y-0.5" : "shadow-[0_4px_20px_rgba(217,119,6,0.2)]"}`}
              style={{ borderColor: 'rgb(217, 119, 6)' }}
            >
                <div className="flex items-center flex-1">
                  <div className="pl-5 pr-3 sm:pl-6 sm:pr-4">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value)
                      setError(null)
                    }}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder="Try 'John 3:16', 'Psalm 23', or 'Romans 8:28'..."
                    disabled={isLoading}
                    className="flex-1 py-4 sm:py-[1.125rem] px-2 text-sm sm:text-lg outline-none text-[#2C3E50] placeholder:text-gray-400 bg-transparent"
                  />
                </div>
                <motion.button
                  onClick={handleSearch}
                  disabled={isLoading || !searchValue.trim()}
                  className="relative overflow-hidden px-8 sm:px-10 py-4 sm:py-[1.125rem] bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-base sm:text-lg font-bold transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed border-t-2 sm:border-t-0 sm:border-l-2 border-emerald-500/30"
                  whileHover={!isLoading && searchValue.trim() ? buttonHover : {}}
                  whileTap={!isLoading && searchValue.trim() ? buttonTap : {}}
                >
                  <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                    {isLoading ? (
                      'Searching...'
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Search
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </motion.button>
            </div>

            {/* Bible Version Selector - Mobile First */}
            <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-2">
              <label htmlFor="version-select" className="text-sm text-[#2C3E50]/60 font-medium">
                Bible Version:
              </label>
              <select
                id="version-select"
                value={selectedTranslation}
                onChange={(e) => setSelectedTranslation(e.target.value)}
                className="w-full sm:w-auto text-sm px-4 py-2 rounded-lg border border-gray-300 bg-white/90 backdrop-blur-sm text-[#2C3E50] shadow-sm hover:bg-white hover:border-amber-400 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent cursor-pointer font-medium"
              >
                {availableTranslations.map((translation) => (
                  <option key={translation.id} value={translation.id}>
                    {translation.name} - {translation.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {error}
              </motion.div>
            )}
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-2"
            variants={fadeInUp}
          >
            <span className="text-base font-medium text-[#2C3E50]/60">Popular:</span>
            {popularVerses.map((verse, index) => (
              <motion.button
                key={index}
                onClick={() => handlePopularVerseClick(verse)}
                className="px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-gray-200 text-[#2C3E50]/80 text-sm hover:bg-amber-50/80 hover:backdrop-blur-md hover:border-amber-300 hover:text-[#2C3E50] transition-all duration-300 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {verse}
              </motion.button>
            ))}
          </motion.div>

          <motion.p
            className="text-sm text-[#2C3E50]/50"
            variants={fadeInUp}
          >
            or explore by topic:
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-4"
            variants={fadeInUp}
          >
            {topics.map((topic, index) => (
              <div key={index} className="relative" ref={activeTopicPopover === topic.name ? popoverRef : null}>
                <motion.button
                  onClick={() => handleTopicClick(topic.name)}
                  className={`group px-8 py-4 rounded-2xl bg-gradient-to-br from-white/70 to-amber-50/40 backdrop-blur-sm border transition-all duration-300 shadow-sm hover:shadow-lg ${
                    activeTopicPopover === topic.name
                      ? 'border-amber-400 from-amber-50/90 to-orange-50/90 scale-110'
                      : 'border-gray-200 hover:border-amber-300 hover:from-amber-50/80 hover:to-orange-50/80'
                  } hover:backdrop-blur-md`}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.span
                      className="text-3xl"
                      whileHover={{ scale: 1.25, rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {topic.emoji}
                    </motion.span>
                    <span className="text-[#2C3E50] font-semibold text-base">{topic.name}</span>
                  </div>
                </motion.button>

                {/* Topic Popover */}
                {activeTopicPopover === topic.name && (
                  <motion.div
                    className="absolute top-full mt-3 left-1/2 -translate-x-1/2 z-[100]"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Arrow pointing up */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/90 border-l border-t border-amber-200/50 rotate-45 backdrop-blur-xl -z-10"></div>
                    <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-200/50 p-4 min-w-[280px]">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-[#2C3E50]">Try these verses:</h3>
                        <motion.button
                          onClick={() => setActiveTopicPopover(null)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label="Close"
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </motion.button>
                      </div>
                      <div className="space-y-2">
                        {topic.verses.map((verse, vIndex) => (
                          <motion.button
                            key={vIndex}
                            onClick={() => handleVerseSelect(verse)}
                            className="w-full text-left px-3 py-2 rounded-lg bg-gradient-to-r from-amber-50/50 to-orange-50/50 hover:from-amber-100/70 hover:to-orange-100/70 border border-amber-200/30 hover:border-amber-300 transition-all duration-200 text-sm text-[#2C3E50] font-medium hover:shadow-md"
                            whileHover={{ scale: 1.05, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {verse}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator - positioned relative to full section for perfect centering */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        variants={fadeInUp}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-[#2C3E50]/50"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span className="text-sm">Scroll to learn more</span>
          <motion.svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{
              y: [0, 5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
