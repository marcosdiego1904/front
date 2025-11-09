import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import "./style.css";

interface Props {
  cite: string;
  verse: string;
  context: string;
  onNext: () => void;
}

const IntroSection = ({ cite, verse, context, onNext }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <main className="main-container1">
      <div className="intro-section">
        {/* Botón de regreso mejorado */}
        <div className="header">
          <button className="return-button" onClick={() => navigate(-1)}>
            Return
          </button>
        </div>

        {/* Información principal */}
        <h2 className="cite">You have selected {cite}</h2>
        <div className="verse-container">
          <p className="verse">"{verse}"</p>
        </div>
        <p className="context">{context}</p>

        {/* Botón para comenzar el aprendizaje mejorado */}
        <button className="start-learning-btn" onClick={onNext}>
          Start Learning
        </button>

        {/* Toggle para mostrar la explicación mejorado */}
        <button className="toggle-explanation" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Hide Explanation ▲" : "Why does this method work? ▼"}
        </button>

        {/* Contenido de la explicación con animación */}
        {isOpen && (
          <div className="explanation-content">
            <h3>🚀 The Science Behind This Method</h3>
            <p>
              Memory experts and neuroscientists agree: the best way to retain information is to engage multiple cognitive processes.
              This method is based on three scientifically proven learning techniques:
            </p>

            <h4>🧠 1. Active Recall</h4>
            <p>
              Studies show that retrieving information from memory strengthens neural pathways.
              Instead of passively reading, this system forces you to recall verses, improving retention.
            </p>

            <h4>🔁 2. Spaced Repetition</h4>
            <p>
              The forgetting curve (Ebbinghaus, 1885) proves that revisiting information at spaced intervals 
              helps move knowledge from short-term to long-term memory.
            </p>

            <h4>🔍 3. Chunking & Progressive Learning</h4>
            <p>
              Research shows that breaking down large amounts of text into smaller, meaningful chunks 
              (like splitting a verse into fragments) improves recall and understanding.
            </p>

            <p className="bold">✨ This is why our approach helps you memorize faster and more effectively!</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default IntroSection;