import { useState } from "react";
import "./style.css";

interface Props {
  verse: string;
  onNext: () => void;
  prevStep: () => void;
}

const fragmentVerse = (verse: string): string[] => {
  return verse
    .split(/[,;.:]/) // Split by common punctuation
    .map(fragment => fragment.trim().replace(/^["“”]|["“”]$/g, "")) // Remove surrounding quotes
    .filter(Boolean);
};


const VerseBreakdownSection = ({ verse, onNext, prevStep }: Props) => {
  const verseParts = fragmentVerse(verse);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextFragment = () => {
    if (currentIndex < verseParts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevFragment = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <main className="main-container2">
      <div className="intro-section">
        {/* Título */}
        <h1 className="title">Breaking it Down: Memorizing Step by Step</h1>

        {/* Instrucción */}
        <p className="instruction">
          Let's make it easier! Read each fragment out loud and focus on its meaning.
        </p>

        {/* Barra de progreso */}
        <p className="progress">Fragment {currentIndex + 1} of {verseParts.length}</p>

        {/* Mostrar solo la parte actual del versículo */}
        <p className="verse-part">{verseParts[currentIndex]}</p>

        {/* Contenedor de botones */}
        <div className="button-group">
          {currentIndex > 0 && (
            <button className="button prev-button" onClick={prevFragment}>
              ← Previous
            </button>
          )}

          {currentIndex < verseParts.length - 1 ? (
            <button className="button next-button" onClick={nextFragment}>
              Next Fragment →
            </button>
          ) : (
            <button className="button continue-button" onClick={onNext}>
              Continue to the Next Step
            </button>
          )}
        </div>

        {/* Botón de regreso */}
        <button className="button back-button" onClick={prevStep}>← Back</button>
      </div>
    </main>
  );
};

export default VerseBreakdownSection;
