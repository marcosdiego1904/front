// src/components/LevelUpNotification.tsx
import React, { useState, useEffect, useRef } from 'react';
import { BiblicalRank } from '../utils/RankingSystem';
import { useRanking } from '../auth/context/RankingContext';

// Define the props that can be received directly
interface LevelUpNotificationProps {
  show?: boolean;
  onClose?: () => void;
  currentRank?: BiblicalRank;
  nextRank?: BiblicalRank | null;
}

const LevelUpNotification: React.FC<LevelUpNotificationProps> = (props) => {
  const [animationClass, setAnimationClass] = useState('');
  
  // Obtain data from context
  let context;
  try {
    context = useRanking();
  } catch (error) {
    // If context is not available, we'll use props only
    context = {
      showLevelUpNotification: false,
      closeLevelUpNotification: () => {},
      currentRank: undefined,
      nextRank: undefined
    };
  }
  
  // Determine whether to use direct props or context
  const show = props.show !== undefined ? props.show : context.showLevelUpNotification;
  const onClose = props.onClose || context.closeLevelUpNotification;
  const currentRank = props.currentRank || context.currentRank;
  const nextRank = props.nextRank !== undefined ? props.nextRank : context.nextRank;
  
  // Use refs to manage timers and prevent memory leaks
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clean up existing timers when the component unmounts or dependencies change
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    // Clean up existing timers first
    if (timerRef.current) clearTimeout(timerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    
    if (show) {
      setAnimationClass('level-up-show');
      
      // Auto-close after 5 seconds
      timerRef.current = setTimeout(() => {
        setAnimationClass('level-up-hide');
        
        closeTimerRef.current = setTimeout(() => {
          onClose();
        }, 500);
      }, 5000);
    } else {
      setAnimationClass('');
    }
  }, [show, onClose]);

  // Additional validation to prevent rendering issues
  if (!show || !nextRank || !currentRank) return null;

  return (
    <div 
      className={`level-up-notification ${animationClass}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="level-up-title"
    >
      <div className="level-up-content">
        <div className="level-up-header">
          <h3 id="level-up-title">Level Up!</h3>
          <button 
            className="close-btn" 
            onClick={onClose}
            aria-label="Close notification"
          >
            ×
          </button>
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
        
        <button 
          className="continue-btn" 
          onClick={onClose}
          aria-label="Continue with new rank"
        >
          Continue Journey
        </button>
      </div>
    </div>
  );
};

export default LevelUpNotification;