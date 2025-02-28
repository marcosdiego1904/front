import { useState } from "react";
import "./style.css";

interface Props {
  verse: string;
  onNext: () => void;
  prevStep: () => void;
}

// Function to clean punctuation from words
const cleanWord = (word: string) => word.replace(/[.,;:!?]/g, "");

// Function to hide words at regular intervals and track correct answers
const hideWords = (
  verse: string
): { hiddenVerse: string[]; answers: string[]; answerIndices: number[] } => {
  if (!verse) return { hiddenVerse: [], answers: [], answerIndices: [] };

  const words = verse.split(" ");
  const answerIndices: number[] = [];
  const answers: string[] = [];
  let currentAnswerIndex = 0;

  const hiddenVerse = words.map((word, i) => {
    if (i % 4 === 0) {
      const cleanAnswer = cleanWord(word);
      answers.push(cleanAnswer);
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
    newAnswers[answerIndex] = value.trim();
    setUserAnswers(newAnswers);
  };

  const isCorrect = (answerIndex: number) => {
    const cleanInput = (text: string) => text.replace(/[.,;:!?]/g, "").trim().toLowerCase();
    return cleanInput(userAnswers[answerIndex] || "") === cleanInput(answers[answerIndex] || "");
  };

  const allCorrect = userAnswers.every((_, answerIndex) => isCorrect(answerIndex));

  return (
    <main className="main-container2">
      <div className="intro-section">
        {/* Título */}
        <h1 className="title">Fill in the Blanks</h1>
        <p className="instruction">Complete the missing words from the verse.</p>

        {/* Render verse with blanks */}
        <p className="verse">
          {hiddenVerse.map((word, verseIndex) => {
            if (word === "_____") {
              const answerIndex = answerIndices[verseIndex];
              return (
                <input
                  key={verseIndex}
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
              );
            } else {
              return <span key={verseIndex}> {word} </span>;
            }
          })}
        </p>

        {/* Feedback message */}
        {!allCorrect && <p className="hint">Fill in all blanks correctly to continue.</p>}

        {/* Buttons */}
        <div className="button-group">
          <button className="button back-button" onClick={prevStep}>← Back</button>
          <button className="button continue-button" onClick={onNext} disabled={!allCorrect}>
            Continue
          </button>
        </div>
      </div>
    </main>
  );
};

export default FillInTheBlanksSection;
