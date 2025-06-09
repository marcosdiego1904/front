import { useState } from "react";

interface Props {
  verse: string;
  onNext: () => void;
  prevStep: () => void;
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

const FillInTheBlanksSection = ({ verse, onNext, prevStep }: Props) => {
  const { hiddenVerse, answers, answerIndices } = hideWords(verse);
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(answers.length).fill(""));

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
    <main className="main-container2">
      <div className="intro-section fill-blanks-section">
        <h1 className="title">Fill in the Blanks</h1>
        <p className="instruction">Complete the missing words from the verse.</p>

        {/* Verse display with blanks */}
        <p className="verse">
          {hiddenVerse.map((word, verseIndex) => {
            if (word === "_____") {
              const answerIndex = answerIndices[verseIndex];
              return (
                <span key={verseIndex}>
                  <input
                    type="text"
                    className={`blank-input ${
                      userAnswers[answerIndex]
                        ? isCorrect(answerIndex)
                          ? "correct"
                          : "incorrect"
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

        {/* Feedback message */}
        {!allCorrect && (
          <p className="hint">
            <strong>Hint:</strong> Hidden words may include punctuation and capitalization, 
            but your answer will be accepted regardless of these details.
          </p>
        )}

        {/* Buttons */}
        <div className="button-group">
          <button className="button back-button" onClick={prevStep}>← Back</button>
          <button 
            className="button continue-button" 
            onClick={onNext} 
            disabled={!allCorrect}
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
};

export default FillInTheBlanksSection;