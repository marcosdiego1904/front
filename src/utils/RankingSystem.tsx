// src/utils/RankingSystem.tsx (función corregida)
import React from 'react';
import Paths from './images/path.png'
import boat from './images/boat.png'
import crown from './images/crown.png'
import heart from './images/heart.png'
import hello from './images/hello.png'
import lantern from './images/lantern.png'
import lion from './images/lion.png'
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

// Calculate rank based on verse count - FUNCIÓN CORREGIDA
export function calculateUserRank(versesCount: number): {
  currentRank: BiblicalRank;
  progress: number;
  versesToNextRank: number;
} {
  // Si no hay versículos memorizados, establecer en 0 (nivel mínimo)
  if (versesCount <= 0) {
    const firstRank = biblicalRanks[0];
    return {
      currentRank: firstRank,
      progress: 0,
      versesToNextRank: firstRank.minVerses // Necesitas 1 versículo para empezar
    };
  }
  
  // Encontrar el rango actual basado en el conteo de versículos
  let currentRank = biblicalRanks[0]; // Valor predeterminado
  
  // Buscar el rango adecuado según los versículos
  for (const rank of biblicalRanks) {
    if (versesCount >= rank.minVerses && versesCount <= rank.maxVerses) {
      currentRank = rank;
      break;
    }
  }
  
  // Si superamos el conteo máximo, usar el último rango
  if (versesCount > biblicalRanks[biblicalRanks.length - 2].maxVerses) {
    currentRank = biblicalRanks[biblicalRanks.length - 1];
  }
  
  // Calcular el porcentaje de progreso dentro del nivel actual
  let progress = 0;
  const levelRange = currentRank.maxVerses - currentRank.minVerses + 1;
  
  if (levelRange === Infinity) {
    // Para el nivel máximo con versesCount infinito
    progress = 100;
  } else {
    const versesInCurrentLevel = versesCount - currentRank.minVerses + 1;
    // Asegurarnos de que el progreso esté entre 0 y 100
    progress = Math.min(Math.max((versesInCurrentLevel / levelRange) * 100, 0), 100);
  }
  
  // Calcular versículos necesarios para el siguiente rango
  let versesToNextRank = 0;
  if (currentRank.nextLevel) {
    // Solamente si hay un siguiente nivel
    versesToNextRank = Math.max(currentRank.maxVerses + 1 - versesCount, 0);
  }
  
  return {
    currentRank,
    progress,
    versesToNextRank
  };
}

// Check if user can level up - FUNCIÓN CORREGIDA
export function canLevelUp(versesCount: number): boolean {
  // Si no hay versículos, no se puede subir de nivel
  if (versesCount <= 0) {
    return false;
  }
  
  const { currentRank } = calculateUserRank(versesCount);
  
  // Se puede subir de nivel si alcanzamos el máximo de versículos del nivel actual
  // y existe un siguiente nivel al que subir
  return versesCount >= currentRank.maxVerses && currentRank.nextLevel !== null;
}

// Biblical Rank Icons
function SaulIcon() {
  return (
    <img src={Paths} className="rank-icon" alt="Saul Level" />
  );
}

function NicodemusIcon() {
  return (
    <img src={lantern} className="rank-icon" alt="Nicodemus Level" />
  );
}

function ThomasIcon() {
  return (
    <img src={hello} className="rank-icon" alt="Thomas Level" />
  );
}

function DiscipleIcon() {
  return (
    <img src={christian} className="rank-icon" alt="Disciple Level" />
  );
}

function ApostleIcon() {
  return (
    <img src={boat} className="rank-icon" alt="Apostle Level" />
  );
}

function ProphetIcon() {
  return (
    <img src={scroll} className="rank-icon" alt="Prophet Level" />
  );
}

function DanielIcon() {
  return (
    <img src={lion} className="rank-icon" alt="Daniel Level" />
  );
}

function DavidIcon() {
  return (
    <img src={heart} className="rank-icon" alt="David Level" />
  );
}

function PaulIcon() {
  return (
    <img src={weakness} className="rank-icon" alt="Paul Level" />
  );
}

function SolomonIcon() {
  return (
    <img src={crown} className="rank-icon" alt="Solomon Level" />
  );
}