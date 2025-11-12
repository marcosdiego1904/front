import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import IntroSection from "../IntroSection";
import ReadAloudSection from "../ReadLoud";
import VerseBreakdownSection from "../BreakDown";
import FillInTheBlanksSection from "../FillBlanks";
import WriteFromMemorySection from '../WriteSection';
import FinalScreen from "../FinalScreen";

import "./style.css";

const LearnSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedVerse = location.state?.selectedVerse;

  // ✅ Verificar en consola si se recibió el versículo correctamente
  useEffect(() => {
    console.log("Verse received in LearnSection:", selectedVerse);
    if (!selectedVerse) {
      console.warn("No verse received, redirecting...");
      navigate("/");
    }
  }, [selectedVerse, navigate]);

  const [step, setStep] = useState(1);

  // 🔹 Si no hay versículo seleccionado, mostramos un mensaje de carga
  if (!selectedVerse) {
    return <p>Loading...</p>;
  }

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const restartLesson = () => setStep(1);

  return (
    <main className="learn-main-container">
      <div className="learn-content-container">
        {step === 1 && (
          <IntroSection
            onNext={nextStep}
            cite={selectedVerse.verse_reference}
            verse={selectedVerse.text_nlt}
            context={selectedVerse.context_nlt}
          />
        )}
        {step === 2 && (
          <ReadAloudSection
            cite={selectedVerse.verse_reference}
            verse={selectedVerse.text_nlt}
            onNext={nextStep}
            prevStep={prevStep}
          />
        )}
        {step === 3 && (
          <VerseBreakdownSection
            verse={selectedVerse.text_nlt}
            onNext={nextStep}
            prevStep={prevStep}
          />
        )}
        {step === 4 && (
          <FillInTheBlanksSection
            verse={selectedVerse.text_nlt}
            onNext={nextStep}
            prevStep={prevStep}
          />
        )}
        {step === 5 && (
          <WriteFromMemorySection
            cite={selectedVerse.verse_reference}
            verse={selectedVerse.text_nlt}
            onNext={nextStep}
            prevStep={prevStep}
          />
        )}
        {step === 6 && (
          <FinalScreen
            onRestart={restartLesson}
            prevStep={prevStep}
            verse={selectedVerse} // Pass the complete verse object to FinalScreen
          />
        )}
      </div>
    </main>
  );
};

export default LearnSection;
