"use client"

import { useState } from "react";
import React from "react";
import { Menu, X, RotateCcw, SkipForward, Check, Lightbulb } from "lucide-react";
import { useAuth } from "../../../src/auth/context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../../../src/oil-lamp.png";
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

// Advanced function to normalize text for comparison
const normalizeForComparison = (text: string) => {
  if (!text) return "";

  // 1. Convert to lowercase
  // 2. Remove punctuation except apostrophes
  // 3. Remove extra spaces
  return text
    .toLowerCase()
    .replace(/[^\w\s']/g, "")
    .trim();
};

// Function to hide words with special case handling
const hideWords = (
  verse: string,
  interval = 4
): { hiddenVerse: string[]; answers: string[]; answerIndices: number[] } => {
  if (!verse || verse.trim() === "") {
    return { hiddenVerse: [], answers: [], answerIndices: [] };
  }

  // Split by whitespace and filter empty strings
  const words = verse.split(/\s+/).filter(word => word.length > 0);

  // Adjust interval for short verses
  const effectiveInterval = words.length < interval * 2 ? Math.max(2, Math.floor(words.length / 2)) : interval;

  const answerIndices: number[] = [];
  const answers: string[] = [];
  let currentAnswerIndex = 0;

  const hiddenVerse = words.map((word, i) => {
    if (i % effectiveInterval === 0) {
      answers.push(word);
      answerIndices.push(currentAnswerIndex);
      currentAnswerIndex++;
      return "_____";
    } else {
      answerIndices.push(-1);
      return word;
    }
  });

  return { hiddenVerse, answers, answerIndices };
};

const FillInTheBlanksSection = ({
  verse,
  onNext,
  prevStep,
  currentStep,
  totalSteps,
  steps,
  onReset,
  onSkip
}: Props) => {
  const { hiddenVerse, answers, answerIndices } = hideWords(verse);
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(answers.length).fill(""));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleNavClick = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
    setDrawerOpen(false);
  };

  const handleStartClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
    setDrawerOpen(false);
  };

  const handleChange = (answerIndex: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[answerIndex] = value;
    setUserAnswers(newAnswers);
  };

  const isCorrect = (answerIndex: number) => {
    if (answerIndex < 0 || answerIndex >= answers.length) return false;

    const expectedNormalized = normalizeForComparison(answers[answerIndex]);
    const userNormalized = normalizeForComparison(userAnswers[answerIndex] || "");

    return userNormalized === expectedNormalized;
  };

  const allCorrect = userAnswers.every((_, answerIndex) => isCorrect(answerIndex));

  return (
    <>
      {/* Navbar */}
      <nav className="fillblanks-navbar">
        <div className="fillblanks-navbar-container">
          <div className="fillblanks-navbar-content">
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="fillblanks-navbar-button"
            >
              <Menu className="h-5 w-5" />
              <span>Lamp to My Feet</span>
              <img src={logo} alt="Lamp Icon" className="fillblanks-navbar-logo" />
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer overlay */}
      <div
        className={`fillblanks-drawer-overlay ${drawerOpen ? "fillblanks-drawer-overlay-open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      ></div>

      {/* Drawer sidebar */}
      <aside className={`fillblanks-drawer ${drawerOpen ? "fillblanks-drawer-open" : ""}`}>
        <div className="fillblanks-drawer-header">
          <div className="fillblanks-drawer-header-content" onClick={() => handleNavClick("/")}>
            <span className="fillblanks-drawer-title">Lamp to My Feet</span>
            <img src={logo} alt="Lamp Icon" className="fillblanks-drawer-logo" />
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="fillblanks-drawer-close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="fillblanks-drawer-nav">
          <button onClick={() => handleNavClick("/")} className="fillblanks-drawer-link">
            Home
          </button>
          <button onClick={() => handleNavClick("/bible-search")} className="fillblanks-drawer-link">
            Bible Search
          </button>
          <button onClick={() => handleNavClick("/about")} className="fillblanks-drawer-link">
            About
          </button>
          <button onClick={() => handleNavClick("/support")} className="fillblanks-drawer-link">
            Support Us
          </button>
          {isAuthenticated && (
            <button onClick={() => handleNavClick("/dashboard")} className="fillblanks-drawer-link">
              Dashboard
            </button>
          )}

          <div className="fillblanks-drawer-divider">
            {!isAuthenticated ? (
              <>
                <button onClick={handleLoginClick} className="fillblanks-drawer-link">
                  Log In
                </button>
                <div className="fillblanks-drawer-cta">
                  <button onClick={handleStartClick} className="fillblanks-drawer-cta-button">
                    Start for Free
                  </button>
                </div>
              </>
            ) : (
              <div className="fillblanks-drawer-cta">
                <button onClick={() => handleNavClick("/dashboard")} className="fillblanks-drawer-cta-button">
                  Dashboard
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>

      <main className="fillblanks-main-container">
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

        <div className="fillblanks-content-wrapper">
          <div className="fillblanks-card">
            {/* Progress Timeline */}
            <div className="fillblanks-progress-section">
              <div className="fillblanks-progress-bar-wrapper">
                <div className="fillblanks-progress-steps">
                  {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                      <div
                        className={`fillblanks-progress-step ${
                          index < currentStep
                            ? "fillblanks-progress-step-completed"
                            : index === currentStep
                              ? "fillblanks-progress-step-active"
                              : "fillblanks-progress-step-pending"
                        }`}
                      >
                        {index < currentStep ? <Check className="w-4 h-4" /> : step.id}
                      </div>
                      {index < steps.length - 1 && (
                        <div className="fillblanks-progress-connector">
                          <div
                            className={`fillblanks-progress-connector-fill ${
                              index < currentStep ? "fillblanks-progress-connector-completed" : ""
                            }`}
                          ></div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="fillblanks-progress-label">
                <p className="fillblanks-progress-text">
                  Step {currentStep + 1} of {totalSteps}: {steps[currentStep].label}
                </p>
              </div>
            </div>

            {/* Title */}
            <h1 className="fillblanks-title">Time to Prove It — Fill the Blanks</h1>

            {/* Instruction */}
            <p className="fillblanks-instruction">
              Complete the missing words. You know this. Trust your memory.
            </p>

            {/* Verse display with blanks */}
            <div className="fillblanks-verse-container">
              <p className="fillblanks-verse">
                {hiddenVerse.map((word, verseIndex) => {
                  if (word === "_____") {
                    const answerIndex = answerIndices[verseIndex];
                    return (
                      <span key={verseIndex}>
                        <input
                          type="text"
                          className={`fillblanks-input ${
                            userAnswers[answerIndex]
                              ? isCorrect(answerIndex)
                                ? "fillblanks-input-correct"
                                : "fillblanks-input-incorrect"
                              : ""
                          }`}
                          value={userAnswers[answerIndex]}
                          onChange={(e) => handleChange(answerIndex, e.target.value)}
                          placeholder="_____"
                        />
                      </span>
                    );
                  } else {
                    return <span key={verseIndex}> {word} </span>;
                  }
                })}
              </p>
            </div>

            {/* Hint message */}
            {!allCorrect && (
              <div className="fillblanks-hint">
                <Lightbulb className="fillblanks-hint-icon" />
                <p className="fillblanks-hint-text">
                  <strong>Tip:</strong> Don't worry about punctuation or capitalization—just get the words right.
                </p>
              </div>
            )}

            {/* Action Bar */}
            <div className="fillblanks-action-bar">
              <button onClick={prevStep} className="fillblanks-back-button">
                ← Back
              </button>

              <button
                className="fillblanks-continue-button"
                onClick={onNext}
                disabled={!allCorrect}
              >
                Perfect — Final Challenge
              </button>

              <div className="fillblanks-action-buttons">
                <button onClick={onReset} className="fillblanks-reset-button" title="Reset">
                  <RotateCcw className="w-4 h-4 transition-transform duration-200 group-hover:-rotate-180" />
                  <span className="hidden sm:inline">Reset</span>
                </button>

                {currentStep < totalSteps - 1 && (
                  <button onClick={onSkip} className="fillblanks-skip-button" title="Skip to End">
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

export default FillInTheBlanksSection;
