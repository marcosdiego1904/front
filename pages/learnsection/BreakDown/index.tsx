import { useState } from "react";

interface Props {
  verse: string;
  onNext: () => void;
  prevStep: () => void;
}

const fragmentVerse = (verse: string): string[] => {
  return verse
    .split(/[,;.:]/) // Split by common punctuation
    .map(fragment => fragment.trim().replace(/^["""]|["""]$/g, "")) // Remove surrounding quotes
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
      <div className="intro-section breakdown-section">
        {/* Encabezado */}
        <h1 className="title">Breaking it Down: Memorizing Step by Step</h1>

        {/* Instrucción más compacta */}
        <p className="instruction breakdown-instruction">
          Let's make it easier! Read each fragment out loud and focus on its meaning.
        </p>

        {/* Contenedor del fragmento de versículo */}
        <div className="fragment-container">
          {/* Barra de progreso mejorada */}
          <div className="fragment-progress-bar">
            <div 
              className="fragment-progress-fill" 
              style={{ width: `${((currentIndex + 1) / verseParts.length) * 100}%` }}
            ></div>
          </div>
          
          <p className="fragment-counter">Fragment {currentIndex + 1} of {verseParts.length}</p>
          
          {/* Fragmento actual del versículo con mejor visualización */}
          <div className="verse-fragment-wrapper">
            <p className="verse-fragment">{verseParts[currentIndex]}</p>
          </div>
        </div>

        {/* Navegación entre fragmentos con botones consistentes */}
        <div className="fragment-navigation">
          <div className="button-group">
            {/* Siempre mostramos el botón "Previous" pero lo deshabilitamos si estamos en el primer fragmento */}
            <button 
              className="button prev-button" 
              onClick={prevFragment} 
              disabled={currentIndex === 0}
            >
              ← Previous
            </button>

            {currentIndex < verseParts.length - 1 ? (
              <button className="button next-button" onClick={nextFragment}>
                Next Fragment →
              </button>
            ) : (
              <button className="button continue-button" onClick={onNext}>
                Continue to Next Step
              </button>
            )}
          </div>
          
          {/* Botón de regreso */}
          <button className="button back-button" onClick={prevStep}>← Back</button>
        </div>
      </div>
    </main>
  );
};

export default VerseBreakdownSection;