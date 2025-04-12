// src/components/RankCard.tsx
import React from 'react';
import { useRanking } from '../auth/context/RankingContext';

const RankCard: React.FC = () => {
  // Usar el contexto de ranking en lugar de pasar props
  const { 
    currentRank, 
    progress, 
    versesToNextRank, 
    versesCount, 
    levelUp, 
    canLevelUp 
  } = useRanking();

  // Validar que los datos críticos estén disponibles
  if (!currentRank) {
    return <div className="rank-card">Cargando información de rango...</div>;
  }

  return (
    <div className="rank-card">
      <div className="rank-badge">
        {currentRank.icon}
        <span className="rank-title">{currentRank.level}</span>
        <div className="rank-phrase">{currentRank.phrase}</div>
      </div>
      <div className="rank-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
          ></div>
        </div>
        <div className="rank-info">
          <span className="verses-count">{versesCount} versículo{versesCount !== 1 ? 's' : ''} memorizado{versesCount !== 1 ? 's' : ''}</span>
          {currentRank.nextLevel && (
            <span>
              {versesToNextRank > 0 ? (
                `${versesToNextRank} versículo${versesToNextRank !== 1 ? 's' : ''} más para alcanzar ${currentRank.nextLevel}`
              ) : (
                `¡Listo para avanzar a ${currentRank.nextLevel}!`
              )}
            </span>
          )}
          {canLevelUp && (
            <button 
              className="level-up-btn"
              onClick={levelUp}
              aria-label="Subir de nivel"
            >
              ¡Subir de Nivel!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RankCard;