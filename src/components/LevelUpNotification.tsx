// src/components/LevelUpNotification.tsx
import React, { useState, useEffect } from 'react';
import { BiblicalRank } from '../utils/RankingSystem';

interface LevelUpNotificationProps {
  show: boolean;
  onClose: () => void;
  currentRank: BiblicalRank;
  nextRank: BiblicalRank | null;
}

const LevelUpNotification: React.FC<LevelUpNotificationProps> = ({
  show,
  onClose,
  currentRank,
  nextRank
}) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (show) {
      setAnimationClass('level-up-show');
      
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        setAnimationClass('level-up-hide');
        setTimeout(() => {
          onClose();
        }, 500);
      }, 5000);
      
      return () => clearTimeout(timer);
    } else {
      setAnimationClass('');
    }
  }, [show, onClose]);

  if (!show || !nextRank) return null;

  return (
    <div className={`level-up-notification ${animationClass}`}>
      <div className="level-up-content">
        <div className="level-up-header">
          <h3>Level Up!</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="level-transition">
          <div className="old-level">
            <div className="level-icon">
              {currentRank.icon}
            </div>
            <div className="level-name">{currentRank.level}</div>
          </div>
          
          <div className="level-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </div>
          
          <div className="new-level">
            <div className="level-icon">
              {nextRank.icon}
            </div>
            <div className="level-name">{nextRank.level}</div>
          </div>
        </div>
        
        <div className="level-up-message">
          <p>{nextRank.phrase}</p>
        </div>
        
        <button className="continue-btn" onClick={onClose}>
          Continue Journey
        </button>
      </div>
    </div>
  );
};

export default LevelUpNotification;