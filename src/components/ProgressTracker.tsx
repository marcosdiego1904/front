import React from "react";
import "./ProgressTracker.css";

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  currentStep,
  totalSteps,
  stepNames,
}) => {
  return (
    <div className="progress-tracker-container">
      <div className="progress-steps">
        {stepNames.map((name, index) => (
          <div
            key={index}
            className={`progress-step ${
              index + 1 === currentStep
                ? "active"
                : index + 1 < currentStep
                ? "completed"
                : ""
            }`}
          >
            <div className="step-circle">
              {index + 1 < currentStep ? (
                <span className="checkmark">✓</span>
              ) : (
                index + 1
              )}
            </div>
            
            <span className="step-name">{name}</span>
            
            {index < totalSteps - 1 && (
              <div 
                className={`step-connector ${
                  index + 1 < currentStep ? "completed" : ""
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
      
      <div className="progress-text">
        Step {currentStep} of {totalSteps}: {stepNames[currentStep - 1]}
      </div>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressTracker;