import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import IntroSection from "../IntroSection";
import ReadAloudSection from "../ReadLoud";
import VerseBreakdownSection from "../BreakDown";
import FillInTheBlanksSection from "../FillBlanks";
import WriteFromMemorySection from '../WriteSection';
import FinalScreen from "../FinalScreen";

//import "./style.css";
import '../../../src/components/ProgressTracker.css';

// Importamos el Navbar pero no lo vamos a usar directamente
import Navbar from "../../../src/Navbar";

const LearnSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedVerse = location.state?.selectedVerse;
  const [navbarVisible, setNavbarVisible] = useState(false);

  // ✅ Verificar en consola si se recibió el versículo correctamente
  useEffect(() => {
    console.log("Verse received in LearnSection:", selectedVerse);
    if (!selectedVerse) {
      console.warn("No verse received, redirecting...");
      navigate("/");
    }
  }, [selectedVerse, navigate]);

  const [step, setStep] = useState(1);

  // Define step names for the progress tracker
  const stepNames = [
    "Introduction",
    "Read Aloud",
    "Break Down",
    "Fill Blanks",
    "Write",
    "Complete"
  ];
  
  const totalSteps = stepNames.length;

  // Controlador de visibilidad del navbar con clases CSS en lugar de manipulación directa
  const toggleNavbar = () => {
    const navbar = document.querySelector('nav.navbar') as HTMLElement;
    if (navbar) {
      if (navbarVisible) {
        // Aplicar clase para ocultar
        navbar.classList.remove('learn-navbar-visible');
        navbar.classList.add('learn-navbar-hidden');
        setTimeout(() => {
          setNavbarVisible(false);
        }, 300);
      } else {
        // Aplicar clase para mostrar
        navbar.classList.remove('learn-navbar-hidden');
        navbar.classList.add('learn-navbar-visible');
        setNavbarVisible(true);
      }
    }
  };

  // Ocultar navbar inicialmente y cuando se cambia de paso
  useEffect(() => {
    const navbar = document.querySelector('nav.navbar') as HTMLElement;
    if (navbar) {
      navbar.classList.add('learn-navbar-hidden');
      navbar.classList.remove('learn-navbar-visible');
      setNavbarVisible(false);
    }
  }, [step]);

  // Inicialización al montar el componente - agregar estilos una vez
  useEffect(() => {
    // Crear estilos para el navbar si no existen
    if (!document.getElementById('learn-navbar-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'learn-navbar-styles';
      styleEl.innerHTML = `
        .learn-navbar-hidden {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          z-index: 1500 !important;
          transform: translateY(-100%) !important;
          transition: transform 0.3s ease !important;
        }
        .learn-navbar-visible {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          z-index: 1500 !important;
          transform: translateY(0) !important;
          transition: transform 0.3s ease !important;
          background-color: rgba(22, 34, 61, 0.95) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
        }
      `;
      document.head.appendChild(styleEl);
    }

    // Aplicar clase inicial al navbar
    const navbar = document.querySelector('nav.navbar') as HTMLElement;
    if (navbar) {
      navbar.classList.add('learn-navbar-hidden');
    }

    // Limpieza al desmontar
    return () => {
      const navbar = document.querySelector('nav.navbar') as HTMLElement;
      if (navbar) {
        navbar.classList.remove('learn-navbar-hidden', 'learn-navbar-visible');
      }
    };
  }, []);

  // 🔹 Si no hay versículo seleccionado, mostramos un mensaje de carga
  if (!selectedVerse) {
    return <p>Loading...</p>;
  }

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const restartLesson = () => setStep(1);

  // Compact Progress Tracker Component - Defined inline for simplicity
  const ProgressTracker = () => (
    <div className="progress-tracker-container">
      <div className="progress-steps">
        {stepNames.map((name, index) => (
          <div 
            key={index}
            className={`progress-step ${
              index + 1 === step 
                ? "active" 
                : index + 1 < step 
                  ? "completed" 
                  : ""
            }`}
          >
            <div className="step-circle">
              {index + 1 < step ? (
                <span className="checkmark">✓</span>
              ) : (
                index + 1
              )}
            </div>
            <span className="step-name">{name}</span>
            {index < totalSteps - 1 && (
              <div 
                className={`step-connector ${
                  index + 1 < step ? "completed" : ""
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
      
      <div className="progress-text">
        Step {step} of {totalSteps}: {stepNames[step - 1]}
      </div>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill"
          style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <main className="learn-main-container">
      {/* Navbar toggle button */}
      <button 
        className={`navbar-toggle-btn ${navbarVisible ? 'active' : ''}`} 
        onClick={toggleNavbar}
      >
        <i className={`bi ${navbarVisible ? 'bi-x' : 'bi-list'}`}></i>
      </button>
      
      {/* Always show the tracker */}
      <ProgressTracker />
      
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
      
      {/* Overlay to close navbar when clicked outside */}
      {navbarVisible && (
        <div className="navbar-overlay" onClick={toggleNavbar}></div>
      )}
    </main>
  );
};

export default LearnSection;