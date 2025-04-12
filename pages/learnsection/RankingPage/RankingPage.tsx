// src/pages/RankingPage.tsx
import React from 'react';
import { RankingProvider } from '../../../src/auth/context/RankingContext';
import RankCard from '../../../src/components/RankCard';
import LevelUpNotification from '../../../src/components/LevelUpNotification';
import '../../../src/components/RankingStyles.css';

interface RankingPageProps {
  initialVerseCount?: number;
}

const RankingPage: React.FC<RankingPageProps> = ({ initialVerseCount = 0 }) => {
  return (
    <RankingProvider initialVerseCount={initialVerseCount}>
      <div className="ranking-page">
        <h2>Your Biblical Journey</h2>
        <RankCard />
        <LevelUpNotification />
        <VerseActionButtons />
      </div>
    </RankingProvider>
  );
};

// Helper component for adding verses (to simulate progress)
const VerseActionButtons: React.FC = () => {
  const { addVerse, versesCount } = useRanking();
  
  return (
    <div className="verse-actions">
      <button 
        className="add-verse-btn" 
        onClick={addVerse}
        aria-label="Add a memorized verse"
      >
        Memorize a Verse (+1)
      </button>
      
      <p className="verse-counter">
        Total verses memorized: {versesCount}
      </p>
    </div>
  );
};

export default RankingPage;