"use client"

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../src/auth/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Menu, X, Check, RotateCcw, Home, User } from "lucide-react";
import axios from "axios";
import API_BASE_URL from "../../../src/config/api";
import logo from "../../../src/oil-lamp.png";
import "./style.css";

interface Step {
  id: number;
  label: string;
  shortLabel: string;
}

interface Props {
  onRestart?: () => void;
  prevStep?: () => void;
  verse?: {
    id: number;
    text_nlt: string;
    verse_reference: string;
    context_nlt: string;
  };
  currentStep: number;
  totalSteps: number;
  steps: Step[];
  onReset: () => void;
}

// Define the response type to match the API
interface SaveVerseResponse {
  message: string;
  isNew: boolean;
}

const FinalScreen = ({ onRestart, prevStep, verse, currentStep, totalSteps, steps, onReset }: Props) => {
  const { isAuthenticated, getAuthHeader } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    isSaving: boolean;
    success: boolean | null;
    message: string;
  }>({
    isSaving: false,
    success: null,
    message: "",
  });

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

  // Save the verse to the user's profile if they're authenticated
  useEffect(() => {
    const saveMemorizedVerse = async () => {
      if (!isAuthenticated || !verse) return;

      try {
        setSaveStatus({
          isSaving: true,
          success: null,
          message: "Saving verse to your profile...",
        });

        const dataToSend = {
          verseId: verse.id,
          verseReference: verse.verse_reference,
          verseText: verse.text_nlt,
          contextText: verse.context_nlt,
        };

        const response = await axios.post<SaveVerseResponse>(
          `${API_BASE_URL}/user/memorized-verses`,
          dataToSend,
          {
            headers: getAuthHeader(),
          }
        );

        setSaveStatus({
          isSaving: false,
          success: true,
          message: response.data.isNew
            ? "Verse added to your memorized collection!"
            : "Verse memorization updated in your collection!",
        });
      } catch (error) {
        console.error("Error saving memorized verse:", error);

        let errorMessage = "Failed to save verse to your profile.";

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            errorMessage = "Your session has expired. Please log in again.";
          } else if (error.response?.status === 400) {
            errorMessage = "Invalid verse data. Please try again.";
          } else if (!error.response && error.request) {
            errorMessage = "Network error. Please check your connection.";
          }
        }

        setSaveStatus({
          isSaving: false,
          success: false,
          message: errorMessage,
        });
      }
    };

    saveMemorizedVerse();
  }, [isAuthenticated, verse, getAuthHeader]);

  return (
    <>
      {/* Navbar */}
      <nav className="final-navbar">
        <div className="final-navbar-container">
          <div className="final-navbar-content">
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="final-navbar-button"
            >
              <Menu className="h-5 w-5" />
              <span>Lamp to My Feet</span>
              <img src={logo} alt="Lamp Icon" className="final-navbar-logo" />
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer overlay */}
      <div
        className={`final-drawer-overlay ${drawerOpen ? "final-drawer-overlay-open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      ></div>

      {/* Drawer sidebar */}
      <aside className={`final-drawer ${drawerOpen ? "final-drawer-open" : ""}`}>
        <div className="final-drawer-header">
          <div className="final-drawer-header-content" onClick={() => handleNavClick("/")}>
            <span className="final-drawer-title">Lamp to My Feet</span>
            <img src={logo} alt="Lamp Icon" className="final-drawer-logo" />
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="final-drawer-close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="final-drawer-nav">
          <button onClick={() => handleNavClick("/")} className="final-drawer-link">
            Home
          </button>
          <button onClick={() => handleNavClick("/bible-search")} className="final-drawer-link">
            Bible Search
          </button>
          <button onClick={() => handleNavClick("/about")} className="final-drawer-link">
            About
          </button>
          <button onClick={() => handleNavClick("/support")} className="final-drawer-link">
            Support Us
          </button>
          {isAuthenticated && (
            <button onClick={() => handleNavClick("/dashboard")} className="final-drawer-link">
              Dashboard
            </button>
          )}

          <div className="final-drawer-divider">
            {!isAuthenticated ? (
              <>
                <button onClick={handleLoginClick} className="final-drawer-link">
                  Log In
                </button>
                <div className="final-drawer-cta">
                  <button onClick={handleStartClick} className="final-drawer-cta-button">
                    Start for Free
                  </button>
                </div>
              </>
            ) : (
              <div className="final-drawer-cta">
                <button onClick={() => handleNavClick("/dashboard")} className="final-drawer-cta-button">
                  Dashboard
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>

      <main className="final-main-container">
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

        <div className="final-content-wrapper">
          <div className="final-card">
            {/* Progress Timeline - All completed */}
            <div className="final-progress-section">
              <div className="final-progress-bar-wrapper">
                <div className="final-progress-steps">
                  {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                      <div className="final-progress-step final-progress-step-completed">
                        <Check className="w-4 h-4" />
                      </div>
                      {index < steps.length - 1 && (
                        <div className="final-progress-connector">
                          <div className="final-progress-connector-fill final-progress-connector-completed"></div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="final-progress-label">
                <p className="final-progress-text">
                  All Steps Completed! 🎉
                </p>
              </div>
            </div>

            {/* Congratulations header */}
            <div className="final-celebration">
              <span className="final-celebration-icon">🏆</span>
              <h1 className="final-title">You Just Did What 90% of People Can't</h1>
              <span className="final-celebration-icon">🏆</span>
            </div>

            <p className="final-description">
              You didn't just read {verse?.verse_reference || "this verse"}—you <strong>mastered it</strong>.
              This verse is now locked in your memory. You'll remember this for years.
            </p>

            <p className="final-tip">
              <strong>That feeling you have right now?</strong> That's what real progress feels like.
            </p>

            {/* Verse saving status for logged-in users */}
            {isAuthenticated && verse && (
              <div className={`final-status-message ${
                saveStatus.success === true
                  ? 'final-status-success'
                  : saveStatus.success === false
                    ? 'final-status-error'
                    : 'final-status-loading'
              }`}>
                {saveStatus.isSaving ? (
                  <div className="final-loading-indicator">
                    <div className="final-spinner"></div>
                    <span>{saveStatus.message}</span>
                  </div>
                ) : (
                  <div>
                    <p>{saveStatus.message}</p>
                    {saveStatus.success && (
                      <p className="final-achievement-text">
                        <strong>🔥 Keep going.</strong> The more verses you memorize, the easier it gets. Your brain is building momentum.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Not logged in message - HIGH CONVERSION MOMENT */}
            {!isAuthenticated && verse && (
              <div className="final-login-prompt">
                <div className="final-urgent-message">
                  <p className="final-login-text">
                    <strong>⚠️ You're about to lose this progress.</strong>
                  </p>
                  <p className="final-login-subtext">
                    You just memorized {verse.verse_reference}. But without an account, you won't be able to track it, review it, or build on this win.
                  </p>
                  <p className="final-login-subtext">
                    <strong>Create a free account now</strong> and never lose a verse again.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/register")}
                  className="final-signup-button-primary"
                >
                  Save My Progress — Free Forever
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="final-login-button-secondary"
                >
                  I already have an account
                </button>
              </div>
            )}

            {/* Action buttons */}
            <div className="final-actions">
              <button
                className="final-action-button final-home-button"
                onClick={() => navigate("/")}
              >
                <Home className="w-5 h-5" />
                <span>Go to Home</span>
              </button>

              {onRestart && (
                <button
                  className="final-action-button final-restart-button"
                  onClick={onReset}
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Restart Lesson</span>
                </button>
              )}

              {isAuthenticated && (
                <button
                  className="final-action-button final-profile-button"
                  onClick={() => navigate("/profile")}
                >
                  <User className="w-5 h-5" />
                  <span>View Profile</span>
                </button>
              )}
            </div>

            {/* Back button */}
            {prevStep && (
              <div className="final-back-section">
                <button onClick={prevStep} className="final-back-button">
                  ← Back
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default FinalScreen;
