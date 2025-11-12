"use client"

import React from "react"
import type { ReactElement } from "react"
import { useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, ArrowLeft, Check, Menu, X, SkipForward, RotateCcw } from "lucide-react"
import Link from "next/link"

export default function MethodPage(): ReactElement {
  const [currentStep, setCurrentStep] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const steps = [
    { id: 1, label: "Introduction", shortLabel: "Intro" },
    { id: 2, label: "Read Aloud", shortLabel: "Read" },
    { id: 3, label: "Break Down", shortLabel: "Break" },
    { id: 4, label: "Master", shortLabel: "Master" },
  ]

  const stepContent = [
    {
      verse:
        "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
      description: "Let's begin by reading this powerful verse together. Take your time to absorb its meaning.",
      buttonText: "Start Learning",
    },
    {
      verse:
        "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
      description: "Now, read this verse out loud. Hearing your own voice helps cement it in your memory.",
      buttonText: "Continue to Break Down",
      icon: "🔊",
    },
    {
      verse:
        "For God so loved the world | that he gave his only begotten Son | that whosoever believeth in him | should not perish | but have everlasting life",
      description: "Notice how we've broken the verse into manageable phrases. Each piece builds on the last.",
      buttonText: "Continue to Master",
      isBreakdown: true,
    },
    {
      verse:
        "For ___ so loved the ___, that he gave his only ___ Son, that whosoever ___ in him should not ___, but have everlasting ___.",
      description: "Fill in the blanks to test your memory. You're almost there!",
      buttonText: "Complete & Celebrate",
      isFillIn: true,
    },
  ]

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkipToEnd = () => {
    setCurrentStep(steps.length - 1)
  }

  const handleReset = () => {
    setCurrentStep(0)
    setShowExplanation(false)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="inline-flex items-center gap-2 font-lora text-base sm:text-lg font-semibold text-[#2C3E50] hover:text-[#E8B86D] transition-colors duration-200"
            >
              <Menu className="h-5 w-5" />
              <span>Lamp to My Feet</span>
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)}
      ></div>

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-200/50 flex items-center justify-between">
          <Link
            href="/"
            className="font-lora text-xl font-semibold text-gray-900 hover:text-[#E8B86D] transition-colors duration-200"
            onClick={() => setDrawerOpen(false)}
          >
            Lamp to My Feet
          </Link>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-6 space-y-2">
          <Link
            href="/#method"
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-all duration-200"
            onClick={() => setDrawerOpen(false)}
          >
            The Method
          </Link>
          <Link
            href="/#categories"
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-all duration-200"
            onClick={() => setDrawerOpen(false)}
          >
            Verse Categories
          </Link>
          <Link
            href="/#mission"
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-all duration-200"
            onClick={() => setDrawerOpen(false)}
          >
            Our Mission
          </Link>
          <div className="pt-4 border-t border-gray-200/50 mt-4">
            <Link
              href="/#login"
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-all duration-200"
              onClick={() => setDrawerOpen(false)}
            >
              Log In
            </Link>
            <div className="mt-2">
              <Link
                href="/#start"
                className="block w-full px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-base font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-gray-800 hover:to-gray-700 transition-all duration-200 text-center"
                onClick={() => setDrawerOpen(false)}
              >
                Start for Free
              </Link>
            </div>
          </div>
        </nav>
      </aside>

      <main className="min-h-screen pt-[68px] bg-gradient-to-br from-[#FEFCF8] via-[#FEF7EE] to-[#FEFCF8] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-40 h-40 bg-[#FFD700] rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-48 h-48 bg-[#E8B86D] rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-orange-100/30 to-amber-100/30 rounded-full blur-2xl"></div>
        </div>

        <div className="absolute top-1/4 right-1/5 opacity-15">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: "0.5s" }}
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#D97706" strokeWidth="1.5" />
            <path
              d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
              stroke="#D97706"
              strokeWidth="1.5"
            />
            <path d="M8 7h8M8 11h6" stroke="#D97706" strokeWidth="1" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-2">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-10 lg:p-12 border border-[#E8B86D]/30 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[#2C3E50] hover:text-[#E8B86D] transition-colors duration-200 font-medium group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
                <span className="hidden sm:inline">Return to Home</span>
                <span className="sm:hidden">Home</span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#2C3E50]/60 hover:text-[#E8B86D] transition-colors duration-200 font-medium group p-2 rounded-lg hover:bg-amber-50/50"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4 transition-transform duration-200 group-hover:-rotate-180" />
                  <span className="hidden sm:inline">Reset</span>
                </button>

                {currentStep < steps.length - 1 && (
                  <button
                    onClick={handleSkipToEnd}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#2C3E50]/60 hover:text-[#E8B86D] transition-colors duration-200 font-medium group p-2 rounded-lg hover:bg-amber-50/50"
                    title="Skip to End"
                  >
                    <span className="hidden sm:inline">Skip</span>
                    <SkipForward className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                )}
              </div>
            </div>

            <div className="mb-10">
              {/* Progress bar container */}
              <div className="relative mb-3">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                      <button
                        onClick={() => index <= currentStep && setCurrentStep(index)}
                        disabled={index > currentStep}
                        className={`relative z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                          index < currentStep
                            ? "bg-[#FFD700] text-[#2C3E50] shadow-md cursor-pointer hover:scale-110"
                            : index === currentStep
                              ? "bg-[#FFD700] text-[#2C3E50] shadow-lg ring-3 ring-[#FFD700]/30"
                              : "bg-[#2C3E50]/10 text-[#2C3E50]/40 cursor-not-allowed"
                        }`}
                      >
                        {index < currentStep ? <Check className="w-4 h-4" /> : step.id}
                      </button>
                      {index < steps.length - 1 && (
                        <div className="flex-1 h-1 mx-1 sm:mx-2 rounded-full overflow-hidden bg-[#2C3E50]/10">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              index < currentStep ? "bg-[#FFD700] w-full" : "bg-transparent w-0"
                            }`}
                          ></div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Current step label */}
              <div className="text-center">
                <p className="text-sm sm:text-base text-[#2C3E50] font-medium">
                  Step {currentStep + 1} of {steps.length}:{" "}
                  <span className="text-[#E8B86D] font-semibold">{steps[currentStep].label}</span>
                </p>
              </div>
            </div>

            <div className="mb-8 flex items-center justify-center gap-3 flex-wrap">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#E8B86D] rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C3E50] font-lora">
                You have selected <span className="text-[#E8B86D]">John 3:16</span>
              </h2>
            </div>

            <div className="bg-gradient-to-br from-amber-50/90 to-orange-50/70 rounded-2xl p-5 sm:p-7 lg:p-8 mb-8 border-l-4 border-[#FFD700] shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 text-[#FFD700]/10 text-8xl sm:text-9xl font-serif leading-none pointer-events-none">
                "
              </div>

              <blockquote className="font-lora text-base sm:text-lg lg:text-xl text-[#2C3E50] leading-relaxed italic relative z-10">
                {stepContent[currentStep].isBreakdown ? (
                  <span>
                    {stepContent[currentStep].verse.split("|").map((phrase, i) => (
                      <span key={i} className="inline-block">
                        <span className="bg-white/60 px-2 py-1 rounded">{phrase.trim()}</span>
                        {i < stepContent[currentStep].verse.split("|").length - 1 && (
                          <span className="text-[#FFD700] mx-2 text-xl">•</span>
                        )}
                      </span>
                    ))}
                  </span>
                ) : stepContent[currentStep].isFillIn ? (
                  <span>
                    {stepContent[currentStep].verse.split("___").map((part, i) => (
                      <span key={i}>
                        {part}
                        {i < stepContent[currentStep].verse.split("___").length - 1 && (
                          <input
                            type="text"
                            placeholder="..."
                            className="inline-block w-20 sm:w-28 mx-1 px-2 py-1 border-b-2 border-[#FFD700] bg-white/80 text-[#2C3E50] focus:outline-none focus:border-[#E8B86D] rounded-sm"
                          />
                        )}
                      </span>
                    ))}
                  </span>
                ) : (
                  `"${stepContent[currentStep].verse}"`
                )}
              </blockquote>

              {stepContent[currentStep].icon && (
                <div className="absolute bottom-3 right-3 text-5xl sm:text-6xl opacity-20">
                  {stepContent[currentStep].icon}
                </div>
              )}
            </div>

            <p className="text-base sm:text-lg lg:text-xl text-[#2C3E50]/80 mb-10 font-nunito-sans leading-relaxed text-center max-w-3xl mx-auto">
              {stepContent[currentStep].description}
            </p>

            <div className="flex justify-between items-center gap-3 mb-8">
              <button
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
                className={`inline-flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ${
                  currentStep === 0
                    ? "opacity-0 cursor-not-allowed pointer-events-none"
                    : "bg-white border-2 border-[#2C3E50]/20 text-[#2C3E50] hover:border-[#E8B86D] hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:scale-105 shadow-md hover:shadow-lg"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <button
                onClick={handleNextStep}
                disabled={currentStep === steps.length - 1}
                className={`inline-flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white px-6 sm:px-10 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg ${
                  currentStep === steps.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-xl"
                }`}
              >
                {stepContent[currentStep].buttonText}
                {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

            <div className="border-t border-[#E8B86D]/20 pt-6">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-2 text-[#FFD700] hover:text-[#E8B86D] transition-colors duration-200 mx-auto font-medium group text-sm sm:text-base"
              >
                Why does this method work?
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${showExplanation ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ${showExplanation ? "max-h-96 opacity-100 mt-5" : "max-h-0 opacity-0"}`}
              >
                <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/60 rounded-xl p-5 sm:p-6 text-left border border-[#E8B86D]/30">
                  <h3 className="font-bold text-[#2C3E50] mb-3 text-base sm:text-lg font-lora">
                    The Science Behind The Method
                  </h3>
                  <p className="text-[#2C3E50]/80 leading-relaxed font-nunito-sans mb-3 text-sm sm:text-base">
                    Our method combines three scientifically-proven learning techniques:{" "}
                    <span className="font-semibold text-[#E8B86D]">spaced repetition</span>,{" "}
                    <span className="font-semibold text-[#E8B86D]">active recall</span>, and{" "}
                    <span className="font-semibold text-[#E8B86D]">multi-sensory engagement</span>.
                  </p>
                  <p className="text-[#2C3E50]/80 leading-relaxed font-nunito-sans text-sm sm:text-base">
                    By breaking verses into manageable chunks and engaging both visual and auditory pathways, we help
                    your brain form strong, lasting neural connections. The fill-in-the-blank exercise forces active
                    recall, which is proven to be 50% more effective than passive re-reading.
                  </p>
                </div>
              </div>
            </div>

            {currentStep === steps.length - 1 && (
              <div className="mt-6 animate-fade-in border-t border-[#E8B86D]/20 pt-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-8 border border-green-200 text-center">
                  <div className="text-5xl sm:text-6xl mb-4">🎉</div>
                  <h3 className="font-bold text-xl sm:text-2xl text-[#2C3E50] mb-3 font-lora">Congratulations!</h3>
                  <p className="text-[#2C3E50]/80 font-nunito-sans mb-5 text-sm sm:text-base max-w-2xl mx-auto">
                    You've completed all 4 steps. Ready to start memorizing verses for real?
                  </p>
                  <Link href="/">
                    <button className="bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white px-8 py-3 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      Start Your Bible Romance
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
