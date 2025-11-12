"use client"

import type React from "react"

import { useState } from "react"

interface TabContent {
  id: string
  label: string
  icon: React.ReactNode
  verse: string
  reference: string
}

const tabsData: TabContent[] = [
  {
    id: "anxious",
    label: "When you feel anxious",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
        />
      </svg>
    ),
    verse:
      "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
    reference: "Philippians 4:6-7",
  },
  {
    id: "guidance",
    label: "When you need guidance",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
        />
      </svg>
    ),
    verse:
      "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    reference: "Proverbs 3:5-6",
  },
  {
    id: "strength",
    label: "When you lack strength",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    verse:
      "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    reference: "Isaiah 40:31",
  },
  {
    id: "patience",
    label: "When you need patience",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    verse:
      "Be completely humble and gentle; be patient, bearing with one another in love. Make every effort to keep the unity of the Spirit through the bond of peace.",
    reference: "Ephesians 4:2-3",
  },
]

export default function ScriptureFinderSection() {
  const [activeTab, setActiveTab] = useState("anxious")
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleTabClick = (tabId: string) => {
    if (tabId === activeTab) return

    setIsTransitioning(true)
    setTimeout(() => {
      setActiveTab(tabId)
      setIsTransitioning(false)
    }, 150)
  }

  const activeContent = tabsData.find((tab) => tab.id === activeTab)

  return (
    <section className="bg-[#2D343E] text-[#F8F8F8] py-20 font-inter">
      <div className="max-w-7xl mx-auto px-6">
        {/* Headlines */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">An Answer for Every Moment</h2>
          <p className="text-lg text-[#F8F8F8] max-w-3xl mx-auto leading-relaxed">
            Life is complex. Your wisdom should be accessible. Find the exact verse you need for the challenge you're
            facing, right when you need it most.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Left column - Tabs (35%) */}
          <div className="lg:col-span-4">
            <div className="space-y-2">
              {tabsData.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 relative group ${
                    activeTab === tab.id
                      ? "text-[#FFD700] bg-[#FFD700]/5"
                      : "text-[#888] hover:text-[#AAA] hover:bg-white/5"
                  }`}
                >
                  {/* Active indicator bar */}
                  {activeTab === tab.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#FFD700] rounded-r"></div>
                  )}

                  <div className="flex items-center space-x-3 ml-3">
                    <div
                      className={`transition-colors duration-200 ${
                        activeTab === tab.id ? "text-[#FFD700]" : "text-[#888] group-hover:text-[#AAA]"
                      }`}
                    >
                      {tab.icon}
                    </div>
                    <span className="text-lg font-medium">{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right column - Content (65%) */}
          <div className="lg:col-span-8">
            <div className="bg-white/5 rounded-2xl p-12 min-h-[400px] flex flex-col justify-center">
              <div className={`transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
                {activeContent && (
                  <>
                    <blockquote className="font-lora text-2xl leading-relaxed mb-8 text-[#F8F8F8]">
                      "{activeContent.verse}"
                    </blockquote>
                    <cite className="font-lora italic text-base text-[#FFD700] not-italic">
                      — {activeContent.reference}
                    </cite>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button className="bg-[#FFD700] text-[#2D343E] px-8 py-4 rounded-lg font-inter font-semibold text-lg hover:bg-[#FFD700]/90 transition-colors duration-200 shadow-lg hover:shadow-xl">
            Explore All Verse Categories
          </button>
        </div>
      </div>
    </section>
  )
}
