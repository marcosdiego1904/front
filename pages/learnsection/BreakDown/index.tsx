"use client"

import { useState } from "react";
import React from "react";
import { RotateCcw, SkipForward, Check, ChevronLeft, ChevronRight } from "lucide-react";
import HomepageNavigation from "../../../src/components/homepage-navigation";
import "./style.css";

interface Step {
  id: number;
  label: string;
  shortLabel: string;
}

interface Props {
  verse: string;
  onNext: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
  steps: Step[];
  onReset: () => void;
  onSkip: () => void;
}

const fragmentVerse = (verse: string): string[] => {
  return verse
    .split(/[,;.:]/) // Split by common punctuation
    .map(fragment => fragment.trim().replace(/^["""]|["""]$/g, "")) // Remove surrounding quotes
    .filter(Boolean);
};

const VerseBreakdownSection = ({
  verse,
  onNext,
  prevStep,
  currentStep,
  totalSteps,
  steps,
  onReset,
  onSkip
}: Props) => {
  const verseParts = fragmentVerse(verse);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextFragment = () => {
    if (currentIndex < verseParts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevFragment = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <>
      {/* Homepage Navigation */}
      <HomepageNavigation />

      <main className="breakdown-main-container">
        {/* Decorative background orbs */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-10 w-40 h-40 bg-[#FFD700] rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-48 h-48 bg-[#E8B86D] rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-orange-100/30 to-amber-100/30 rounded-full blur-2xl"></div>
        </div>

        {/* Decorative book icon */}
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

        <div className="breakdown-content-wrapper">
          <div className="breakdown-card">
            {/* Progress Timeline */}
            <div className="breakdown-progress-section">
              <div className="breakdown-progress-bar-wrapper">
                <div className="breakdown-progress-steps">
                  {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                      <div
                        className={`breakdown-progress-step ${
                          index < currentStep
                            ? "breakdown-progress-step-completed"
                            : index === currentStep
                              ? "breakdown-progress-step-active"
                              : "breakdown-progress-step-pending"
                        }`}
                      >
                        {index < currentStep ? <Check className="w-4 h-4" /> : step.id}
                      </div>
                      {index < steps.length - 1 && (
                        <div className="breakdown-progress-connector">
                          <div
                            className={`breakdown-progress-connector-fill ${
                              index < currentStep ? "breakdown-progress-connector-completed" : ""
                            }`}
                          ></div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="breakdown-progress-label">
                <p className="breakdown-progress-text">
                  Step {currentStep + 1} of {totalSteps}: {steps[currentStep].label}
                </p>
              </div>
            </div>

            {/* Title */}
            <h1 className="breakdown-title">Now We're Locking It In — Piece by Piece</h1>

            {/* Instruction */}
            <p className="breakdown-instruction">
              Read each fragment below. Focus on what it means. This is how your brain remembers forever.
            </p>

            {/* Fragment container */}
            <div className="breakdown-fragment-container">
              {/* Fragment progress bar */}
              <div className="breakdown-fragment-progress-bar">
                <div
                  className="breakdown-fragment-progress-fill"
                  style={{ width: `${((currentIndex + 1) / verseParts.length) * 100}%` }}
                ></div>
              </div>

              <p className="breakdown-fragment-counter">
                Fragment {currentIndex + 1} of {verseParts.length}
              </p>

              {/* Current fragment */}
              <div className="breakdown-verse-fragment-wrapper">
                <p className="breakdown-verse-fragment">{verseParts[currentIndex]}</p>
              </div>

              {/* Fragment navigation */}
              <div className="breakdown-fragment-navigation">
                <button
                  className="breakdown-fragment-prev-button"
                  onClick={prevFragment}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <button
                  className="breakdown-fragment-next-button"
                  onClick={currentIndex < verseParts.length - 1 ? nextFragment : onNext}
                >
                  <span className="hidden sm:inline">
                    {currentIndex < verseParts.length - 1 ? "Next Fragment →" : "Ready to Test Yourself"}
                  </span>
                  <span className="sm:hidden">
                    {currentIndex < verseParts.length - 1 ? "Next" : "Test"}
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="breakdown-action-bar">
              <button onClick={prevStep} className="breakdown-back-button">
                ← Back
              </button>

              <button className="breakdown-continue-button" onClick={onNext}>
                I've Got This — Let's Test It
              </button>

              <div className="breakdown-action-buttons">
                <button onClick={onReset} className="breakdown-reset-button" title="Reset">
                  <RotateCcw className="w-4 h-4 transition-transform duration-200 group-hover:-rotate-180" />
                  <span className="hidden sm:inline">Reset</span>
                </button>

                {currentStep < totalSteps - 1 && (
                  <button onClick={onSkip} className="breakdown-skip-button" title="Skip to End">
                    <span className="hidden sm:inline">Skip</span>
                    <SkipForward className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default VerseBreakdownSection;
