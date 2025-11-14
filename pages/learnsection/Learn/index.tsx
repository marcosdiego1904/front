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

  const steps = [
    { id: 1, label: "Get Ready", shortLabel: "Start" },
    { id: 2, label: "Read & Lock In", shortLabel: "Read" },
    { id: 3, label: "Break It Down", shortLabel: "Break" },
    { id: 4, label: "Prove It", shortLabel: "Test" },
    { id: 5, label: "Master It", shortLabel: "Write" },
    { id: 6, label: "Completed!", shortLabel: "Done" },
  ];

  // 🔹 Si no hay versículo seleccionado, mostramos un mensaje de carga
  if (!selectedVerse) {
    return <p>Loading...</p>;
  }

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const restartLesson = () => setStep(1);
  const skipToWriteSection = () => setStep(5);

  return (
    <main className="learn-main-container">
      <div className="learn-content-container">
        {step === 1 && (
          <IntroSection
            onNext={nextStep}
            cite={selectedVerse.verse_reference}
            verse={selectedVerse.text_nlt}
            context={selectedVerse.context_nlt}
            currentStep={step - 1}
            totalSteps={steps.length}
            steps={steps}
            onReset={restartLesson}
            onSkip={skipToWriteSection}
          />
        )}
        {step === 2 && (
          <ReadAloudSection
            cite={selectedVerse.verse_reference}
            verse={selectedVerse.text_nlt}
            onNext={nextStep}
            prevStep={prevStep}
            currentStep={step - 1}
            totalSteps={steps.length}
            steps={steps}
            onReset={restartLesson}
            onSkip={skipToWriteSection}
          />
        )}
        {step === 3 && (
          <VerseBreakdownSection
            verse={selectedVerse.text_nlt}
            onNext={nextStep}
            prevStep={prevStep}
            currentStep={step - 1}
            totalSteps={steps.length}
            steps={steps}
            onReset={restartLesson}
            onSkip={skipToWriteSection}
          />
        )}
        {step === 4 && (
          <FillInTheBlanksSection
            verse={selectedVerse.text_nlt}
            onNext={nextStep}
            prevStep={prevStep}
            currentStep={step - 1}
            totalSteps={steps.length}
            steps={steps}
            onReset={restartLesson}
            onSkip={skipToWriteSection}
          />
        )}
        {step === 5 && (
          <WriteFromMemorySection
            cite={selectedVerse.verse_reference}
            verse={selectedVerse.text_nlt}
            onNext={nextStep}
            prevStep={prevStep}
            currentStep={step - 1}
            totalSteps={steps.length}
            steps={steps}
            onReset={restartLesson}
            onSkip={skipToWriteSection}
          />
        )}
        {step === 6 && (
          <FinalScreen
            onRestart={restartLesson}
            prevStep={prevStep}
            verse={selectedVerse}
            currentStep={step - 1}
            totalSteps={steps.length}
            steps={steps}
            onReset={restartLesson}
          />
        )}
      </div>
    </main>
  );
};

export default LearnSection;
