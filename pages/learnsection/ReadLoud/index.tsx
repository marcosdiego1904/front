"use client"

import { useState } from "react";
import React from "react";
import { ChevronDown, Menu, X, RotateCcw, SkipForward, Check } from "lucide-react";
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
      <nav className="read-navbar">
        <div className="read-navbar-container">
          <div className="read-navbar-content">
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="read-navbar-button"
            >
              <Menu className="h-5 w-5" />
              <span>Lamp to My Feet</span>
              <img src={logo} alt="Lamp Icon" className="read-navbar-logo" />
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer overlay */}
      <div
        className={`read-drawer-overlay ${drawerOpen ? "read-drawer-overlay-open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      ></div>

      {/* Drawer sidebar */}
      <aside className={`read-drawer ${drawerOpen ? "read-drawer-open" : ""}`}>
        <div className="read-drawer-header">
          <div className="read-drawer-header-content" onClick={() => handleNavClick("/")}>
            <span className="read-drawer-title">Lamp to My Feet</span>
            <img src={logo} alt="Lamp Icon" className="read-drawer-logo" />
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="read-drawer-close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="read-drawer-nav">
          <button onClick={() => handleNavClick("/")} className="read-drawer-link">
            Home
          </button>
          <button onClick={() => handleNavClick("/bible-search")} className="read-drawer-link">
            Bible Search
          </button>
          <button onClick={() => handleNavClick("/about")} className="read-drawer-link">
            About
          </button>
          <button onClick={() => handleNavClick("/support")} className="read-drawer-link">
            Support Us
          </button>
          {isAuthenticated && (
            <button onClick={() => handleNavClick("/dashboard")} className="read-drawer-link">
              Dashboard
            </button>
          )}

          <div className="read-drawer-divider">
            {!isAuthenticated ? (
              <>
                <button onClick={handleLoginClick} className="read-drawer-link">
                  Log In
                </button>
                <div className="read-drawer-cta">
                  <button onClick={handleStartClick} className="read-drawer-cta-button">
                    Start for Free
                  </button>
                </div>
              </>
            ) : (
              <div className="read-drawer-cta">
                <button onClick={() => handleNavClick("/dashboard")} className="read-drawer-cta-button">
                  Dashboard
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>

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
            <h1 className="read-title">Boost Your Memory with the Power of Speech!</h1>

            {/* Instructions */}
            <div className="read-instructions">
              <p className="read-instruction">
                Read the verse <strong className="read-highlight">out loud <span className="read-accent">3</span> to <span className="read-accent">5</span> times</strong>, focusing on its meaning.
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
                Continue to Break Down
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
                {showInfo ? "Hide explanation" : "How does this technique work?"}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${showInfo ? "rotate-180" : ""}`}
                />
              </button>

              {/* Explanation with smooth animation */}
              <div className={`read-explanation-content ${showInfo ? "read-explanation-open" : ""}`}>
                {showInfo && (
                  <div className="read-explanation-inner">
                    <p className="read-explanation-text">
                      Speaking aloud engages both your <strong className="read-highlight">visual and auditory memory</strong>, reinforcing what you learn. Studies show that <strong className="read-highlight">reading out loud improves retention by up to 50%</strong> compared to silent reading.
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
