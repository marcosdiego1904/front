import { useState } from "react";
import './style.css';

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
            <div className="intro-section">
                {/* Título principal */}
                <h1 className="title">Boost Your Memory with the Power of Speech!</h1>

                {/* Instrucción */}
                <p className="instruction">
                    Read the verse <strong className="highlight">out loud <span style={{color:'red'}}>3</span> to <span style={{color:'red'}}>5</span> times</strong>, focusing on its meaning.
                </p>

                {/* Botón para mostrar la explicación */}
                <button className="info-btn" onClick={() => setShowInfo(!showInfo)}>
                    {showInfo ? "Hide explanation 🔼" : "How does this technique work? 🔽"}
                </button>

                {/* Explicación con animación */}
                <div className={`explanation-container ${showInfo ? "show" : ""}`}>
                    <p className="explanation">
                        Speaking aloud engages both your <strong className="highlight">visual and auditory memory</strong>, reinforcing what you learn.
                        Studies show that <strong className="highlight">reading out loud improves retention by up to 50%</strong> compared to silent reading.
                    </p>
                </div>

                {/* Versículo */}
                <h2 className="cite">{cite}</h2>
                <p className="verse">{verse}</p>

                {/* Botones de navegación */}
                <div className="button-group">
                    <button className="button back-button" onClick={prevStep}>← Back</button>
                    <button className="button continue-button" onClick={onNext}>Continue</button>
                </div>
            </div>
        </main>
    );
};

export default ReadAloudSection;
