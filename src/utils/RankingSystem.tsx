// src/utils/RankingSystem.tsx
import React from 'react';

// Define the biblical rank interface
export interface BiblicalRank {
  level: string;
  icon: React.ReactNode;
  phrase: string;
  minVerses: number;
  maxVerses: number;
  nextLevel: string | null;
}

// Collection of all biblical ranks
export const biblicalRanks: BiblicalRank[] = [
  {
    level: "Saul Level",
    icon: <SaulIcon />,
    phrase: "You have taken the first step on the path of knowledge.",
    minVerses: 1,
    maxVerses: 5,
    nextLevel: "Nicodemus Level"
  },
  {
    level: "Nicodemus Level",
    icon: <NicodemusIcon />,
    phrase: "Like Nicodemus, you sought answers and have begun to find wisdom in His word.",
    minVerses: 6,
    maxVerses: 10,
    nextLevel: "Thomas Level"
  },
  {
    level: "Thomas Level",
    icon: <ThomasIcon />,
    phrase: "Like Thomas, you seek evidence and deepen your understanding. Faith grows with each verse!",
    minVerses: 11,
    maxVerses: 15,
    nextLevel: "Disciple Level"
  },
  {
    level: "Disciple Level",
    icon: <DiscipleIcon />,
    phrase: "You have moved from doubt to following. You now walk as a disciple, with His word guiding your steps.",
    minVerses: 16,
    maxVerses: 25,
    nextLevel: "Apostle Level"
  },
  {
    level: "Apostle Level",
    icon: <ApostleIcon />,
    phrase: "From follower to messenger. Like the apostles, you now carry the Word in your heart.",
    minVerses: 26,
    maxVerses: 35,
    nextLevel: "Prophet Level"
  },
  {
    level: "Prophet Level",
    icon: <ProphetIcon />,
    phrase: "Your understanding deepens. Like the prophets, you begin to see beyond the words.",
    minVerses: 36,
    maxVerses: 45,
    nextLevel: "Daniel Level"
  },
  {
    level: "Daniel Level",
    icon: <DanielIcon />,
    phrase: "The wisdom and discernment of Daniel now accompany you. Mysteries are revealed before your eyes.",
    minVerses: 46,
    maxVerses: 55,
    nextLevel: "David Level"
  },
  {
    level: "David Level",
    icon: <DavidIcon />,
    phrase: "Your heart, like David's, beats to the rhythm of Scripture. The Word has become your song.",
    minVerses: 56,
    maxVerses: 65,
    nextLevel: "Paul Level"
  },
  {
    level: "Paul Level",
    icon: <PaulIcon />,
    phrase: "Like Paul, you have experienced a transformation. What began as knowledge is now part of who you are.",
    minVerses: 66,
    maxVerses: 75,
    nextLevel: "Solomon Level"
  },
  {
    level: "Solomon Level",
    icon: <SolomonIcon />,
    phrase: "The wisdom of Solomon is yours. You have treasured the Word and it has enriched you with understanding.",
    minVerses: 76,
    maxVerses: Infinity,
    nextLevel: null
  }
];

// Calculate rank based on verse count
export function calculateUserRank(versesCount: number): {
  currentRank: BiblicalRank;
  progress: number;
  versesToNextRank: number;
} {
  // Find the current rank based on verse count
  const currentRank = biblicalRanks.find(
    rank => versesCount >= rank.minVerses && versesCount <= rank.maxVerses
  ) || biblicalRanks[0]; // Default to first rank if not found
  
  // Calculate progress percentage within current level
  const levelRange = currentRank.maxVerses - currentRank.minVerses + 1;
  const versesInCurrentLevel = versesCount - currentRank.minVerses + 1;
  const progress = Math.min((versesInCurrentLevel / levelRange) * 100, 100);
  
  // Calculate verses needed for next rank
  let versesToNextRank = 0;
  if (currentRank.nextLevel) {
    versesToNextRank = currentRank.maxVerses + 1 - versesCount;
  }
  
  return {
    currentRank,
    progress,
    versesToNextRank
  };
}

// Check if user can level up
export function canLevelUp(versesCount: number): boolean {
  const { currentRank } = calculateUserRank(versesCount);
  return versesCount === currentRank.maxVerses && currentRank.nextLevel !== null;
}

// Biblical Rank Icons
// Saul Icon - Stones or blindness symbol
function SaulIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="12" r="3" />
      <circle cx="16" cy="12" r="3" />
      <path d="M3 8c0-1.5 1-3 3-3 1 0 2 .5 3 2 1-1.5 2-2 3-2 2 0 3 1.5 3 3" />
    </svg>
  );
}

// Nicodemus Icon - Lamp or torch
function NicodemusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2v4" />
      <path d="m4.93 10.93 2.83-2.83" />
      <path d="M2 18h2" />
      <path d="M20 18h2" />
      <path d="m19.07 10.93-2.83-2.83" />
      <path d="M12 6a6 6 0 0 0-6 6c0 3 3 4 3 6h6c0-2 3-3 3-6a6 6 0 0 0-6-6z" />
    </svg>
  );
}

// Thomas Icon - Hand with extended finger
function ThomasIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

// Disciple Icon - Sandals or footprints
function DiscipleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 2.28-5 5-5h0c2.72 0 4.97 2.28 5 5 .03 2.5-1 3.5-1 5.62V16h-8Z" />
      <path d="M12 16v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-2.28-5-5-5h0" />
      <path d="M8 16v6" />
      <path d="M16 19v-3c0-1.65 1-2.5 1-4a3 3 0 0 0-6 0" />
      <path d="M17 19h2a2 2 0 0 0 0-4h-1" />
    </svg>
  );
}

// Apostle Icon - Boat with net
function ApostleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l18-5" />
      <path d="M12 19c0-7.97 6.5-13 9-13" />
      <path d="M9 19c0-5.97 3.5-9 6-9" />
      <path d="M6 19c0-2.97 1.5-5 3-5" />
      <path d="M3 19h18" />
      <path d="M3 7l9 5 9-5" />
      <path d="M3 7v12" />
      <path d="M21 7v12" />
    </svg>
  );
}

// Prophet Icon - Scroll with quill
function ProphetIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
      <path d="M8 9h1" />
    </svg>
  );
}

// Daniel Icon - Lion or star
function DanielIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="m3 7 3-3 3 3-3 3Z" />
      <path d="m15 7 3-3 3 3-3 3Z" />
      <path d="M3 21 6 18l3 3-3 3Z" />
      <path d="m15 21 3-3 3 3-3 3Z" />
    </svg>
  );
}

// David Icon - Harp or crown
function DavidIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8c0-3.5 2.5-6 6.5-6 4 0 4.5 3 4.5 5 0 3-2 4-2 9 0 1.5 1 2 1 2" />
      <path d="M19 9c0-1 .5-2 2-2" />
      <path d="M21 12c0-1-.5-2-2-2" />
      <path d="M21 15c0-1-.5-2-2-2" />
      <path d="M21 18c0-1-.5-2-2-2" />
    </svg>
  );
}

// Paul Icon - Broken chains
function PaulIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-2-2a2.5 2.5 0 0 0-3 2.5V14l-2 4 4-2 4 2-2-4Z" />
      <path d="M14.5 12A2.5 2.5 0 0 0 17 9.5c0-1.38-.5-2-2-2a2.5 2.5 0 0 0-3 2.5V12l-2 4 4-2 4 2-2-4Z" />
    </svg>
  );
}

// Solomon Icon - Temple or crown with gems
function SolomonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20" />
      <path d="M12 4v16" />
      <path d="M17 8v.8A6 6 0 0 1 13.8 17v0H10v0a6.5 6.5 0 0 1-4-6c0-1.67 1-3 2.5-3 2 0 3 1.5 3.5 4" />
      <path d="M18 12h.4a2 2 0 0 1 1.9 2.8L19 19" />
      <path d="M5.9 18.1 6 12l2-4 1-1" />
    </svg>
  );
}