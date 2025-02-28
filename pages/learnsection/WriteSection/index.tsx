import { useState } from "react";
import "./style.css";

interface Props {
  verse: string;
  cite: string;
  onNext: () => void;
  prevStep: () => void;
}

// Helper function to clean text (removes punctuation, trims spaces, ignores case)
// Helper function to clean text (removes punctuation, trims spaces, ignores case & quotes)
const cleanText = (text: string) => 
  text.replace(/[.,;:!?“”"'`]/g, "").trim().toLowerCase();


const WriteFromMemorySection = ({ verse, cite, onNext, prevStep }: Props) => {
  const [userInput, setUserInput] = useState("");

  // Normalize and split the verse & user input into words
  const words = cleanText(verse).split(/\s+/);
  const userWords = cleanText(userInput).split(/\s+/);

  // Check if each word is correct
  const isCorrect = (index: number) => words[index] === (userWords[index] || "");

  // Ensure entire verse is correct (same length & all words match)
  const allCorrect = words.length === userWords.length && words.every((_, i) => isCorrect(i));

  return (
    <main className="main-container3">
      <div className="intro-section">
        {/* Título */}
        <h1 className="title">Write the Verse from Memory</h1>
        <p className="instruction">
          Try to write the verse from memory. The system will check for mistakes automatically.
        </p>

        {/* Display verse reference */}
        <h2 className="verse-citation">{cite}</h2>

        {/* User input area */}
        <textarea
          className="memory-input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type the verse here..."
        />

        {/* Display words with color coding */}
        <p className="verse">
          {words.map((word, i) => (
            <span key={i} className={isCorrect(i) ? "correct-word" : "incorrect-word"}>
              {userWords[i] || "..."}{" "}
            </span>
          ))}
        </p>

        {/* Feedback message */}
        {!allCorrect && <p className="hint">Keep trying! Make sure every word matches exactly.</p>}

        {/* Buttons */}
        <div className="button-group">
          <button className="button back-button" onClick={prevStep}>← Back</button>
          <button className="button continue-button" onClick={onNext} disabled={!allCorrect}>
            Finish Learning 🎉
          </button>
        </div>
      </div>
    </main>
  );
};

export default WriteFromMemorySection;
