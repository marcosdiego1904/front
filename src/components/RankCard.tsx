// src/components/RankCard.tsx
import React from 'react';
import { BiblicalRank } from '../utils/RankingSystem';
import { useRanking } from '../auth/context/RankingContext';

// Define the props that can be received directly
interface RankCardProps {
  currentRank?: BiblicalRank;
  progress?: number;
  versesToNextRank?: number;
  versesCount?: number;
  onLevelUp?: () => void;
  canLevelUp?: boolean;
}

const RankCard: React.FC<RankCardProps> = (props) => {
  // Obtain data from context
  let context;
  try {
    context = useRanking();
  } catch (error) {
    // If context is not available, we'll use props only
    context = {
      currentRank: undefined,
      progress: 0,
      versesToNextRank: 0,
      versesCount: 0,
      levelUp: () => {},
      canLevelUp: false
    };
  }
  
  // Determine whether to use direct props or context
  const currentRank = props.currentRank || context.currentRank;
  const progress = props.progress !== undefined ? props.progress : context.progress;
  const versesToNextRank = props.versesToNextRank !== undefined ? props.versesToNextRank : context.versesToNextRank;
  const versesCount = props.versesCount !== undefined ? props.versesCount : context.versesCount;
  const levelUp = props.onLevelUp || context.levelUp;
  const canLevelUp = props.canLevelUp !== undefined ? props.canLevelUp : context.canLevelUp;

  // Validate that critical data is available
  if (!currentRank) {
    return <div className="rank-card">Loading rank information...</div>;
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
          <span className="verses-count">{versesCount} verse{versesCount !== 1 ? 's' : ''} memorized</span>
          {currentRank.nextLevel && (
            <span>
              {versesToNextRank > 0 ? (
                `${versesToNextRank} more verse${versesToNextRank !== 1 ? 's' : ''} to reach ${currentRank.nextLevel}`
              ) : (
                `Ready to advance to ${currentRank.nextLevel}!`
              )}
            </span>
          )}
          {canLevelUp && (
            <button 
              className="level-up-btn"
              onClick={levelUp}
              aria-label="Level up to next rank"
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