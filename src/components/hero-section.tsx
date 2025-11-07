import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import bibleApiService from "../services/bibleApi"

export default function HeroSection() {
  const [searchValue, setSearchValue] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)
  const [selectedTranslation, setSelectedTranslation] = useState(bibleApiService.getDefaultTranslation().id)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTopicPopover, setActiveTopicPopover] = useState<string | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const availableTranslations = bibleApiService.getAvailableTranslations()

  useEffect(() => {
    setAnimateIn(true)
  }, [])

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-gray-200/30 via-gray-300/20 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-gray-300/25 via-gray-200/15 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-amber-100/10 via-orange-100/10 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 w-full py-20">
        <div className="space-y-12 text-center">
          {/* Badge */}
          <div
            className={`flex justify-center transition-all duration-700 ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-sm animate-float-subtle">
              <span className="text-xl">🕊️</span>
              <span className="text-sm font-semibold text-amber-700">Biblical Learning Reimagined</span>
            </div>
          </div>

          <h1
            className={`text-4xl sm:text-5xl lg:text-7xl font-bold text-[#2C3E50] leading-tight transition-all duration-700 delay-100 ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          >
            Strengthen Your{" "}
            <span className="text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text">Faith</span>,
            One Verse at a Time
          </h1>

          <p
            className={`text-lg sm:text-xl text-[#2C3E50]/80 max-w-3xl mx-auto transition-all duration-700 delay-200 ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          >
            Search any Bible verse instantly and master it through 4 proven learning methods. Start in under 2 minutes.
          </p>

          <div
            className={`max-w-2xl mx-auto transition-all duration-700 delay-300 ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          >
            <div
              className={`relative group transition-all duration-300 ${isSearchFocused ? "scale-105 shadow-2xl" : ""}`}
            >
              <div
                className={`absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity ${isSearchFocused ? "opacity-100" : ""}`}
              ></div>
              <div
                className={`relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ${isSearchFocused ? "bg-white/90 backdrop-blur-2xl border-amber-300" : "group-hover:bg-white/85 group-hover:backdrop-blur-xl"}`}
              >
                <div className="flex items-center flex-1">
                  <div className="pl-6 pr-3">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="flex-1 py-5 text-base sm:text-lg outline-none text-[#2C3E50] placeholder:text-gray-400 bg-transparent pr-4 sm:pr-0"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isLoading || !searchValue.trim()}
                  className="relative overflow-hidden m-2 px-8 sm:px-10 py-5 sm:py-6 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-semibold rounded-xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg group/button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">{isLoading ? 'Searching...' : 'Search'}</span>
                  <div className="absolute inset-0 -translate-x-full group-hover/button:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </Button>
              </div>

              {/* Bible Version Selector - Mobile First */}
              <div className="mt-3 flex items-center justify-center gap-2">
                <label htmlFor="version-select" className="text-sm text-[#2C3E50]/60 font-medium">
                  Bible Version:
                </label>
                <select
                  id="version-select"
                  value={selectedTranslation}
                  onChange={(e) => setSelectedTranslation(e.target.value)}
                  className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 bg-white/60 backdrop-blur-sm text-[#2C3E50] hover:bg-white/80 hover:border-amber-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent cursor-pointer"
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
                <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                  {error}
                </div>
              )}
            </div>
          </div>

          <div
            className={`flex flex-wrap items-center justify-center gap-2 transition-all duration-700 delay-400 ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          >
            <span className="text-base font-medium text-[#2C3E50]/60">Popular:</span>
            {popularVerses.map((verse, index) => (
              <button
                key={index}
                onClick={() => handlePopularVerseClick(verse)}
                className="px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-gray-200 text-[#2C3E50]/80 text-sm hover:bg-amber-50/80 hover:backdrop-blur-md hover:border-amber-300 hover:text-[#2C3E50] transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
              >
                {verse}
              </button>
            ))}
          </div>

          <p
            className={`text-sm text-[#2C3E50]/50 transition-all duration-700 delay-500 ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          >
            or explore by topic:
          </p>

          <div
            className={`flex flex-wrap items-center justify-center gap-4 transition-all duration-700 delay-600 ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          >
            {topics.map((topic, index) => (
              <div key={index} className="relative" ref={activeTopicPopover === topic.name ? popoverRef : null}>
                <button
                  onClick={() => handleTopicClick(topic.name)}
                  className={`group px-8 py-4 rounded-2xl bg-gradient-to-br from-white/70 to-amber-50/40 backdrop-blur-sm border transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-lg ${
                    activeTopicPopover === topic.name
                      ? 'border-amber-400 from-amber-50/90 to-orange-50/90 scale-110'
                      : 'border-gray-200 hover:border-amber-300 hover:from-amber-50/80 hover:to-orange-50/80'
                  } hover:backdrop-blur-md`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl group-hover:scale-125 transition-transform duration-300">
                      {topic.emoji}
                    </span>
                    <span className="text-[#2C3E50] font-semibold text-base">{topic.name}</span>
                  </div>
                </button>

                {/* Topic Popover */}
                {activeTopicPopover === topic.name && (
                  <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-200/50 p-4 min-w-[280px]">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-[#2C3E50]">Try these verses:</h3>
                        <button
                          onClick={() => setActiveTopicPopover(null)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label="Close"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="space-y-2">
                        {topic.verses.map((verse, vIndex) => (
                          <button
                            key={vIndex}
                            onClick={() => handleVerseSelect(verse)}
                            className="w-full text-left px-3 py-2 rounded-lg bg-gradient-to-r from-amber-50/50 to-orange-50/50 hover:from-amber-100/70 hover:to-orange-100/70 border border-amber-200/30 hover:border-amber-300 transition-all duration-200 text-sm text-[#2C3E50] font-medium hover:scale-105 hover:shadow-md"
                          >
                            {verse}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Arrow pointing up */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/90 border-l border-t border-amber-200/50 rotate-45 backdrop-blur-xl"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div
            className={`pt-8 transition-all duration-700 delay-700 ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          >
            <div className="flex flex-col items-center gap-2 text-[#2C3E50]/50 animate-bounce">
              <span className="text-sm">Scroll to learn more</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
