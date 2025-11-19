"use client"

import { useState } from "react";
import React from "react";
import { ChevronDown, RotateCcw, SkipForward, Check } from "lucide-react";
import HomepageNavigation from "../../../src/components/homepage-navigation";
import "./style.css";

interface Step {
  id: number;
  label: string;
  shortLabel: string;
}

interface Props {
  cite: string;
  verse: string;
  onNext: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
  steps: Step[];
  onReset: () => void;
  onSkip: () => void;
}

const ReadAloudSection = ({
  cite,
  verse,
  onNext,
  prevStep,
  currentStep,
  totalSteps,
  steps,
  onReset,
  onSkip
}: Props) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      {/* Homepage Navigation */}
      <HomepageNavigation />

      <main className="read-main-container">
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

        <div className="read-content-wrapper">
          <div className="read-card">
            {/* Progress Timeline */}
            <div className="read-progress-section">
              <div className="read-progress-bar-wrapper">
                <div className="read-progress-steps">
                  {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                      <div
                        className={`read-progress-step ${
                          index < currentStep
                            ? "read-progress-step-completed"
                            : index === currentStep
                              ? "read-progress-step-active"
                              : "read-progress-step-pending"
                        }`}
                      >
                        {index < currentStep ? <Check className="w-4 h-4" /> : step.id}
                      </div>
                      {index < steps.length - 1 && (
                        <div className="read-progress-connector">
                          <div
                            className={`read-progress-connector-fill ${
                              index < currentStep ? "read-progress-connector-completed" : ""
                            }`}
                          ></div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="read-progress-label">
                <p className="read-progress-text">
                  Step {currentStep + 1} of {totalSteps}: {steps[currentStep].label}
                </p>
              </div>
            </div>

            {/* Title */}
            <h1 className="read-title">Read This Out Loud Right Now</h1>

            {/* Instructions */}
            <div className="read-instructions">
              <p className="read-instruction">
                Read the verse below <strong className="read-highlight">OUT LOUD at least <span className="read-accent">3 times</span></strong>. Don't skip this step—your memory depends on it.
              </p>
            </div>

            {/* Verse display */}
            <div className="read-verse-container">
              <h2 className="read-cite">{cite}</h2>
              <p className="read-verse">"{verse}"</p>
            </div>

            {/* Action Bar */}
            <div className="read-action-bar">
              <button onClick={prevStep} className="read-back-button">
                ← Back
              </button>

              <button className="read-continue-button" onClick={onNext}>
                I've Read It — Next Step
              </button>

              <div className="read-action-buttons">
                <button onClick={onReset} className="read-reset-button" title="Reset">
                  <RotateCcw className="w-4 h-4 transition-transform duration-200 group-hover:-rotate-180" />
                  <span className="hidden sm:inline">Reset</span>
                </button>

                {currentStep < totalSteps - 1 && (
                  <button onClick={onSkip} className="read-skip-button" title="Skip to End">
                    <span className="hidden sm:inline">Skip</span>
                    <SkipForward className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                )}
              </div>
            </div>

            {/* How does this work section - after buttons */}
            <div className="read-explanation-section">
              <button className="read-info-btn" onClick={() => setShowInfo(!showInfo)}>
                {showInfo ? "Got it" : "Why read it out loud?"}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${showInfo ? "rotate-180" : ""}`}
                />
              </button>

              {/* Explanation with smooth animation */}
              <div className={`read-explanation-content ${showInfo ? "read-explanation-open" : ""}`}>
                {showInfo && (
                  <div className="read-explanation-inner">
                    <p className="read-explanation-text">
                      Reading aloud activates both <strong className="read-highlight">visual and auditory pathways</strong> in your brain. You'll remember this 2X better than if you just read it silently. That's it. Simple, but it works.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ReadAloudSection;
