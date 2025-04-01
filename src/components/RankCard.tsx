// src/components/RankCard.tsx
import React from 'react';
import { BiblicalRank } from '../utils/RankingSystem';

interface RankCardProps {
  currentRank: BiblicalRank;
  progress: number;
  versesToNextRank: number;
  versesCount: number;
  onLevelUp?: () => void;
  canLevelUp: boolean;
}

const RankCard: React.FC<RankCardProps> = ({
  currentRank,
  progress,
  versesToNextRank,
  versesCount,
  onLevelUp,
  canLevelUp
}) => {
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
          ></div>
        </div>
        <div className="rank-info">
          <span className="verses-count">{versesCount} verses memorized</span>
          {currentRank.nextLevel && (
            <span>
              {versesToNextRank} more verse{versesToNextRank !== 1 ? 's' : ''} to reach {currentRank.nextLevel}
            </span>
          )}
          {canLevelUp && onLevelUp && (
            <button 
              className="level-up-btn"
              onClick={onLevelUp}
            >
              Level Up!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RankCard;