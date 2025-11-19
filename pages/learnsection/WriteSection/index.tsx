"use client"

import { useState } from "react";
import React from "react";
import { Menu, X, RotateCcw, SkipForward, Check, Edit3 } from "lucide-react";
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
  cite: string;
  onNext: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
  steps: Step[];
  onReset: () => void;
  onSkip: () => void;
}

// Helper function to normalize text for comparison
// Removes all punctuation except apostrophes, normalizes whitespace, and converts to lowercase
// This ensures users don't need to type quotes, periods, or other punctuation
const cleanText = (text: string) => {
  if (!text) return "";

  return text
    .toLowerCase()
    .replace(/[^\w\s']/g, "") // Remove all non-word characters except apostrophes
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
};

const WriteFromMemorySection = ({
  verse,
  cite,
  onNext,
  prevStep,
  currentStep,
  totalSteps,
  steps,
  onReset,
  onSkip
}: Props) => {
  const [userInput, setUserInput] = useState("");
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

  // Normalize and split the verse & user input into words
  const words = cleanText(verse).split(/\s+/);
  const userWords = cleanText(userInput).split(/\s+/);

  // Check if each word is correct
  const isCorrect = (index: number) => words[index] === (userWords[index] || "");

  // Ensure entire verse is correct (same length & all words match)
  const allCorrect = words.length === userWords.length && words.every((_, i) => isCorrect(i));

  return (
    <>
      {/* Navbar */}
      <nav className="write-navbar">
        <div className="write-navbar-container">
          <div className="write-navbar-content">
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="write-navbar-button"
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
              <span>Lamp to My Feet</span>
              <img src={logo} alt="" aria-hidden="true" className="write-navbar-logo" />
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer overlay */}
      <div
        className={`write-drawer-overlay ${drawerOpen ? "write-drawer-overlay-open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      ></div>

      {/* Drawer sidebar */}
      <aside className={`write-drawer ${drawerOpen ? "write-drawer-open" : ""}`}>
        <div className="write-drawer-header">
          <div className="write-drawer-header-content" onClick={() => handleNavClick("/")}>
            <span className="write-drawer-title">Lamp to My Feet</span>
            <img src={logo} alt="Lamp Icon" className="write-drawer-logo" />
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="write-drawer-close"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="write-drawer-nav">
          <button onClick={() => handleNavClick("/")} className="write-drawer-link">
            Home
          </button>
          <button onClick={() => handleNavClick("/bible-search")} className="write-drawer-link">
            Bible Search
          </button>
          <button onClick={() => handleNavClick("/about")} className="write-drawer-link">
            About
          </button>
          <button onClick={() => handleNavClick("/support")} className="write-drawer-link">
            Support Us
          </button>
          {isAuthenticated && (
            <button onClick={() => handleNavClick("/dashboard")} className="write-drawer-link">
              Dashboard
            </button>
          )}

          <div className="write-drawer-divider">
            {!isAuthenticated ? (
              <>
                <button onClick={handleLoginClick} className="write-drawer-link">
                  Log In
                </button>
                <div className="write-drawer-cta">
                  <button onClick={handleStartClick} className="write-drawer-cta-button">
                    Start for Free
                  </button>
                </div>
              </>
            ) : (
              <div className="write-drawer-cta">
                <button onClick={() => handleNavClick("/dashboard")} className="write-drawer-cta-button">
                  Dashboard
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>

      <main className="write-main-container">
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

        <div className="write-content-wrapper">
          {/* First Container - Info, Instructions & Actions */}
          <div className="write-card write-info-card">
            {/* Progress Timeline */}
            <div className="write-progress-section">
              <div className="write-progress-bar-wrapper">
                <div className="write-progress-steps">
                  {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                      <div
                        className={`write-progress-step ${
                          index < currentStep
                            ? "write-progress-step-completed"
                            : index === currentStep
                              ? "write-progress-step-active"
                              : "write-progress-step-pending"
                        }`}
                      >
                        {index < currentStep ? <Check className="w-4 h-4" /> : step.id}
                      </div>
                      {index < steps.length - 1 && (
                        <div className="write-progress-connector">
                          <div
                            className={`write-progress-connector-fill ${
                              index < currentStep ? "write-progress-connector-completed" : ""
                            }`}
                          ></div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="write-progress-label">
                <p className="write-progress-text">
                  Step {currentStep + 1} of {totalSteps}: {steps[currentStep].label}
                </p>
              </div>
            </div>

            {/* Title */}
            <h1 className="write-title">Final Test — Write It From Memory</h1>

            {/* Instruction */}
            <p className="write-instruction">
              Write the entire verse below. From memory. No peeking. You've got this.
            </p>

            {/* Verse citation */}
            <div className="write-citation-container">
              <Edit3 className="write-citation-icon" />
              <h2 className="write-citation">{cite}</h2>
            </div>

            {/* Action Bar */}
            <div className="write-action-bar">
              <button onClick={prevStep} className="write-back-button" aria-label="Go back to previous step">
                ← Back
              </button>

              <button
                className="write-continue-button"
                onClick={onNext}
                disabled={!allCorrect}
              >
                I've Mastered This 🏆
              </button>

              <div className="write-action-buttons">
                <button onClick={onReset} className="write-reset-button" aria-label="Reset lesson to beginning">
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Reset</span>
                </button>

                {currentStep < totalSteps - 1 && (
                  <button onClick={onSkip} className="write-skip-button" aria-label="Skip to final step">
                    <span>Skip</span>
                    <SkipForward className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Second Container - Input & Feedback Workspace */}
          <div className="write-card write-workspace-card">
            {/* User input area */}
            <div className="write-input-container">
              <textarea
                className="write-memory-input"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type the verse here..."
                rows={6}
              />
            </div>

            {/* Display words with color coding */}
            <div className="write-feedback-container">
              <p className="write-feedback-label">Your progress:</p>
              <p className="write-verse-feedback">
                {words.map((word, i) => (
                  <span key={i} className={isCorrect(i) ? "write-correct-word" : "write-incorrect-word"}>
                    {userWords[i] || "..."}{" "}
                  </span>
                ))}
              </p>
            </div>

            {/* Feedback message */}
            {!allCorrect && (
              <div className="write-hint">
                <p className="write-hint-text">
                  Almost there! Double-check the highlighted words above.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default WriteFromMemorySection;
