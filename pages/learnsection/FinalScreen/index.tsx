import React from "react";
import "./style.css";

interface Props {
  onRestart?: () => void;
  prevStep?: () => void;
}

const FinalScreen = ({ onRestart, prevStep }: Props) => {
  return (
    <main className="main-container4">
      <div className="final-container">
        <h1>🎉 Congratulations! 🎉</h1>
        <p>You have successfully completed the memorization process.</p>
        <p>Keep practicing to strengthen your memory!</p>

        <div className="final-buttons">
          <button className="button home-btn" onClick={() => window.location.href = "/"}>
            Go to Home
          </button>
          {onRestart && (
            <button className="button restart-btn" onClick={onRestart}>
              Restart Lesson 🔁
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
