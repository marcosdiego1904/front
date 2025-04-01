// src/utils/RankingSystem.tsx
import React from 'react';
import Paths from './images/path.png'
import boat from './images/boat.png'
import crown from './images/crown.png'
import heart from './images/heart.png'
import hello from './images/hello.png'
import lantern from './images/lion.png'
import lion from './images/path.png'
import scroll from './images/scroll.png'
import weakness from './images/weakness.png'
import christian from './images/christian.png'
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
    <img src={Paths}/>
  );
}

// Nicodemus Icon - Lamp or torch
function NicodemusIcon() {
  return (
    <img src={lantern}/>
  );
}

// Thomas Icon - Hand with extended finger
function ThomasIcon() {
  return (
    <img src={hello}/>
  );
}

// Disciple Icon - Sandals or footprints
function DiscipleIcon() {
  return (
    <img src={christian}/>
  );
}

// Apostle Icon - Boat with net
function ApostleIcon() {
  return (
    <img src={boat}/>
  );
}

// Prophet Icon - Scroll with quill
function ProphetIcon() {
  return (
    <img src={scroll}/>
  );
}

// Daniel Icon - Lion or star
function DanielIcon() {
  return (
    <img src={lion}/>
  );
}

// David Icon - Harp or crown
function DavidIcon() {
  return (
    <img src={heart}/>
  );
}

// Paul Icon - Broken chains
function PaulIcon() {
  return (
    <img src={weakness}/>
  );
}

// Solomon Icon - Temple or crown with gems
function SolomonIcon() {
  return (
    <img src={crown}/>
  );
}