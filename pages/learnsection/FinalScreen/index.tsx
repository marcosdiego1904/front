import React, { useEffect, useState } from "react";
import { useAuth } from "../../../src/auth/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../../src/config/api";
import "./style.css";

interface Props {
  onRestart?: () => void;
  prevStep?: () => void;
  verse?: {
    id: number;
    text_nlt: string;
    verse_reference: string;
    context_nlt: string;
  };
}

// Define the response type to match the API
interface SaveVerseResponse {
  message: string;
  isNew: boolean;
}

const FinalScreen = ({ onRestart, prevStep, verse }: Props) => {
  const { isAuthenticated, getAuthHeader } = useAuth();
  const navigate = useNavigate();
  const [saveStatus, setSaveStatus] = useState<{
    isSaving: boolean;
    success: boolean | null;
    message: string;
  }>({
    isSaving: false,
    success: null,
    message: "",
  });

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

        const response = await axios.post<SaveVerseResponse>(
          `${API_BASE_URL}/user/memorized-verses`,
          {
            verseId: verse.id,
            verseReference: verse.verse_reference,
            verseText: verse.text_nlt,
            contextText: verse.context_nlt,
          },
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
        
        // More specific error handling with type checking
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

  // Navigation handlers
  const handleGoHome = () => navigate("/");
  const handleViewProfile = () => navigate("/profile");

  return (
    <main className="main-container4">
      <div className="final-container">
        <h1>🎉 Congratulations! 🎉</h1>
        <p>You have successfully completed the memorization process.</p>
        <p>Keep practicing to strengthen your memory!</p>

        {/* Show verse saving status for logged-in users */}
        {isAuthenticated && verse && (
          <div className={`save-status ${saveStatus.success === false ? 'save-error' : ''}`}>
            {saveStatus.isSaving ? (
              <div className="saving-indicator">
                <div className="spinner"></div>
                <span>{saveStatus.message}</span>
              </div>
            ) : (
              <p>{saveStatus.message}</p>
            )}
          </div>
        )}

        {/* Not logged in message */}
        {!isAuthenticated && verse && (
          <div className="login-prompt">
            <p>Sign in to save your memorized verses and track your progress!</p>
            <button onClick={() => navigate("/login")} className="login-link">Sign in</button>
          </div>
        )}

        <div className="final-buttons">
          <button className="button home-btn" onClick={handleGoHome}>
            Go to Home
          </button>
          {onRestart && (
            <button className="button restart-btn" onClick={onRestart}>
              Restart Lesson 🔁
            </button>
          )}
          {isAuthenticated && (
            <button 
              className="button profile-btn" 
              onClick={handleViewProfile}
            >
              View Profile
            </button>
          )}
        </div>

        {/* Back Button */}
        {prevStep && (
          <div className="button-group">
            <button className="button back-button" onClick={prevStep}>← Back</button>
          </div>
        )}
      </div>
    </main>
  );
};

export default FinalScreen;