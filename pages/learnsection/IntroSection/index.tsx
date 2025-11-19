"use client"

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { ChevronDown, Menu, X, ArrowLeft, RotateCcw, SkipForward, Check } from "lucide-react";
import { useAuth } from "../../../src/auth/context/AuthContext";
import logo from "../../../src/oil-lamp.png";
import "./style.css";

interface Step {
  id: number;
  label: string;
  shortLabel: string;
}

interface Props {
  cite: string;
  verse: string;
  context: string;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
  steps: Step[];
  onReset: () => void;
  onSkip: () => void;
}

const IntroSection = ({
  cite,
  verse,
  context,
  onNext,
  currentStep,
  totalSteps,
  steps,
  onReset,
  onSkip
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <>
      {/* Navbar */}
      <nav className="intro-navbar">
        <div className="intro-navbar-container">
          <div className="intro-navbar-content">
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="intro-navbar-button"
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
              <span>Lamp to My Feet</span>
              <img src={logo} alt="" aria-hidden="true" className="intro-navbar-logo" />
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer overlay */}
      <div
        className={`intro-drawer-overlay ${drawerOpen ? "intro-drawer-overlay-open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      ></div>

      {/* Drawer sidebar */}
      <aside className={`intro-drawer ${drawerOpen ? "intro-drawer-open" : ""}`}>
        <div className="intro-drawer-header">
          <div className="intro-drawer-header-content" onClick={() => handleNavClick("/")}>
            <span className="intro-drawer-title">Lamp to My Feet</span>
            <img src={logo} alt="Lamp Icon" className="intro-drawer-logo" />
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="intro-drawer-close"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="intro-drawer-nav">
          <button
            onClick={() => handleNavClick("/")}
            className="intro-drawer-link"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick("/bible-search")}
            className="intro-drawer-link"
          >
            Bible Search
          </button>
          <button
            onClick={() => handleNavClick("/about")}
            className="intro-drawer-link"
          >
            About
          </button>
          <button
            onClick={() => handleNavClick("/support")}
            className="intro-drawer-link"
          >
            Support Us
          </button>
          {isAuthenticated && (
            <button
              onClick={() => handleNavClick("/dashboard")}
              className="intro-drawer-link"
            >
              Dashboard
            </button>
          )}

          <div className="intro-drawer-divider">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={handleLoginClick}
                  className="intro-drawer-link"
                >
                  Log In
                </button>
                <div className="intro-drawer-cta">
                  <button
                    onClick={handleStartClick}
                    className="intro-drawer-cta-button"
                  >
                    Start for Free
                  </button>
                </div>
              </>
            ) : (
              <div className="intro-drawer-cta">
                <button
                  onClick={() => handleNavClick("/dashboard")}
                  className="intro-drawer-cta-button"
                >
                  Dashboard
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>

      <main className="intro-main-container">
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

      <div className="intro-content-wrapper">
        <div className="intro-card">
          {/* Progress Timeline */}
          <div className="intro-progress-section">
            {/* Progress bar container */}
            <div className="intro-progress-bar-wrapper">
              <div className="intro-progress-steps">
                {steps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div
                      className={`intro-progress-step ${
                        index < currentStep
                          ? "intro-progress-step-completed"
                          : index === currentStep
                            ? "intro-progress-step-active"
                            : "intro-progress-step-pending"
                      }`}
                    >
                      {index < currentStep ? <Check className="w-4 h-4" /> : step.id}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="intro-progress-connector">
                        <div
                          className={`intro-progress-connector-fill ${
                            index < currentStep ? "intro-progress-connector-completed" : ""
                          }`}
                        ></div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Current step label */}
            <div className="intro-progress-label">
              <p className="intro-progress-text">
                Step {currentStep + 1} of {totalSteps}: {steps[currentStep].label}
              </p>
            </div>
          </div>

          {/* Title with icon */}
          <div className="intro-title-section">
            <div className="intro-icon-badge">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <h2 className="intro-title">
              You're About to Master <span className="intro-title-highlight">{cite}</span>
            </h2>
          </div>

          {/* Verse display box */}
          <div className="intro-verse-box">
            <div className="intro-verse-quote-mark">"</div>
            <blockquote className="intro-verse-text">
              "{verse}"
            </blockquote>
          </div>

          {/* Context */}
          {context && (
            <p className="intro-context-text">
              {context}
            </p>
          )}

          {/* Action Bar: Return | Start Learning | Reset & Skip */}
          <div className="intro-action-bar">
            {/* Left: Return to Home */}
            <button
              onClick={() => navigate(-1)}
              className="intro-return-button"
              aria-label="Return to previous page"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Return to Home</span>
              <span className="sm:hidden">Back</span>
            </button>

            {/* Center: Start Learning (Primary CTA) */}
            <button className="intro-start-button" onClick={onNext}>
              Let's Memorize This
            </button>

            {/* Right: Reset & Skip */}
            <div className="intro-action-buttons">
              <button
                onClick={onReset}
                className="intro-reset-button"
                aria-label="Reset lesson to beginning"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Reset</span>
              </button>

              {currentStep < totalSteps - 1 && (
                <button
                  onClick={onSkip}
                  className="intro-skip-button"
                  aria-label="Skip to final step"
                >
                  <span>Skip</span>
                  <SkipForward className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {/* Toggle explanation */}
          <div className="intro-explanation-section">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="intro-toggle-button"
            >
              How you'll remember this forever
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Explanation content with smooth animation */}
            <div
              className={`intro-explanation-content ${isOpen ? "intro-explanation-open" : ""}`}
            >
              {isOpen && (
                <div className="intro-explanation-inner">
                  <h3 className="intro-explanation-title">What Happens Next</h3>
                  <p className="intro-explanation-text">
                    You'll read this verse aloud to <span className="intro-explanation-highlight">lock it into your memory</span>.
                    Then we'll break it down into pieces you can actually remember. Finally, you'll write it from memory—and be amazed at what you can do.
                  </p>
                  <p className="intro-explanation-text">
                    <strong>In 5 minutes, you'll have memorized this verse so deeply you'll remember it years from now.</strong> Let's go.
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

export default IntroSection;
