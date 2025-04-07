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
import '../../../src/components/ProgressTracker.css';

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

  // Toggle navbar visibility by manipulating the navbar that's already in the DOM
  const toggleNavbar = () => {
    const navbar = document.querySelector('nav.navbar');
    if (navbar) {
      if (navbarVisible) {
        // Hide navbar
        navbar.style.transform = 'translateY(-100%)';
        setTimeout(() => {
          navbar.style.display = 'none';
          setNavbarVisible(false);
        }, 300); // Match transition time
      } else {
        // Show navbar
        navbar.style.display = 'flex';
        // Force reflow
        navbar.offsetHeight;
        navbar.style.transform = 'translateY(0)';
        setNavbarVisible(true);
      }
    }
  };

  // Hide navbar initially and when changing steps
  useEffect(() => {
    const navbar = document.querySelector('nav.navbar');
    if (navbar) {
      // Add transition style if not already there
      navbar.style.transition = 'transform 0.3s ease';
      // Hide navbar
      navbar.style.transform = 'translateY(-100%)';
      setTimeout(() => {
        navbar.style.display = 'none';
      }, 300); // Match transition time
    }
    setNavbarVisible(false);
  }, [step]);

  // Init navbar setup on component mount
  useEffect(() => {
    const navbar = document.querySelector('nav.navbar');
    if (navbar) {
      // Make sure navbar is initially positioned and styled correctly
      navbar.style.position = 'fixed';
      navbar.style.top = '0';
      navbar.style.left = '0';
      navbar.style.width = '100%';
      navbar.style.zIndex = '1500';
      navbar.style.transition = 'transform 0.3s ease';
      navbar.style.transform = 'translateY(-100%)';
      navbar.style.display = 'none';
      navbar.style.backgroundColor = 'rgba(22, 34, 61, 0.95)';
      navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    }
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