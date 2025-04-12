// src/components/LevelUpNotification.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useRanking } from '../auth/context/RankingContext';

const LevelUpNotification: React.FC = () => {
  const [animationClass, setAnimationClass] = useState('');
  const { 
    currentRank, 
    nextRank, 
    showLevelUpNotification, 
    closeLevelUpNotification 
  } = useRanking();
  
  // Usar refs para gestionar temporizadores y evitar fugas de memoria
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Limpiar temporizadores existentes cuando el componente se desmonta o cambian las dependencias
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    // Limpiar temporizadores existentes primero
    if (timerRef.current) clearTimeout(timerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    
    if (showLevelUpNotification) {
      setAnimationClass('level-up-show');
      
      // Auto-cerrar después de 5 segundos
      timerRef.current = setTimeout(() => {
        setAnimationClass('level-up-hide');
        
        closeTimerRef.current = setTimeout(() => {
          closeLevelUpNotification();
        }, 500);
      }, 5000);
    } else {
      setAnimationClass('');
    }
  }, [showLevelUpNotification, closeLevelUpNotification]);

  // Validación adicional para prevenir problemas de renderizado
  if (!showLevelUpNotification || !nextRank || !currentRank) return null;

  return (
    <div 
      className={`level-up-notification ${animationClass}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="level-up-title"
    >
      <div className="level-up-content">
        <div className="level-up-header">
          <h3 id="level-up-title">¡Subiste de Nivel!</h3>
          <button 
            className="close-btn" 
            onClick={closeLevelUpNotification}
            aria-label="Cerrar notificación"
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
          onClick={closeLevelUpNotification}
          aria-label="Continuar con el nuevo rango"
        >
          Continuar Jornada
        </button>
      </div>
    </div>
  );
};

export default LevelUpNotification;