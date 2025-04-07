import { useState } from "react";

interface Props {
  cite: string;
  verse: string;
  onNext: () => void;
  prevStep: () => void;
}

const ReadAloudSection = ({ cite, verse, onNext, prevStep }: Props) => {
  const [showInfo, setShowInfo] = useState(false);
  
  return (
    <main className="main-container1">
      <div className="intro-section read-aloud-section">
        {/* Encabezado más compacto */}
        <h1 className="title">Boost Your Memory with the Power of Speech!</h1>
        
        <div className="read-aloud-instructions">
          <p className="instruction">
            Read the verse <strong className="highlight">out loud <span className="text-accent">3</span> to <span className="text-accent">5</span> times</strong>, focusing on its meaning.
            <button className="info-btn" onClick={() => setShowInfo(!showInfo)}>
              {showInfo ? "Hide explanation ▲" : "How does this technique work? ▼"}
            </button>
          </p>
          
          {/* Explicación con animación mejorada */}
          <div className={`explanation-container ${showInfo ? "show" : ""}`}>
            <p className="explanation">
              Speaking aloud engages both your <strong className="highlight">visual and auditory memory</strong>, reinforcing what you learn.
              Studies show that <strong className="highlight">reading out loud improves retention by up to 50%</strong> compared to silent reading.
            </p>
          </div>
        </div>

        {/* Contenedor del versículo con mejor uso del espacio */}
        <div className="verse-container">
          <h2 className="cite">{cite}</h2>
          <p className="verse">{verse}</p>
        </div>

        {/* Botones de navegación con mejor alineación */}
        <div className="button-group">
          <button className="button back-button" onClick={prevStep}>← Back</button>
          <button className="button continue-button" onClick={onNext}>Continue</button>
        </div>
      </div>
    </main>
  );
};

export default ReadAloudSection;