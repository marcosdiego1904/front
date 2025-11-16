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
    level: "Nicodemus",
    icon: <NicodemusIcon />,
    phrase: "Like Nicodemus, you've come seeking truth. You asked the question: 'How can I grow?' This is where transformation begins.",
    minVerses: 1,
    maxVerses: 3,
    nextLevel: "Thomas"
  },
  {
    level: "Thomas",
    icon: <ThomasIcon />,
    phrase: "Like Thomas, you seek evidence. You're building your faith one verse at a time. Doubt isn't weakness—it's the path to unshakeable belief.",
    minVerses: 4,
    maxVerses: 8,
    nextLevel: "Peter"
  },
  {
    level: "Peter",
    icon: <PeterIcon />,
    phrase: "Like Peter, you're passionate and committed, even when you stumble. You've left the boat. You're walking on water, learning to trust.",
    minVerses: 9,
    maxVerses: 16,
    nextLevel: "John"
  },
  {
    level: "John",
    icon: <JohnIcon />,
    phrase: "Like John, you're drawing close. You're understanding what it means to be loved and to love. Scripture is becoming personal.",
    minVerses: 17,
    maxVerses: 27,
    nextLevel: "Paul"
  },
  {
    level: "Paul",
    icon: <PaulIcon />,
    phrase: "Like Paul on the Damascus road, you've experienced transformation. What began as knowledge is now part of who you are. You're a new creation.",
    minVerses: 28,
    maxVerses: 40,
    nextLevel: "David"
  },
  {
    level: "David",
    icon: <DavidIcon />,
    phrase: "Like David, your heart beats to the rhythm of Scripture. You don't just know the Word—you sing it, dance it, live it. A heart after God's own.",
    minVerses: 41,
    maxVerses: 55,
    nextLevel: "Daniel"
  },
  {
    level: "Daniel",
    icon: <DanielIcon />,
    phrase: "Like Daniel in the lion's den, nothing shakes you. You've hidden the Word so deep that trials can't remove it. Your faith is unshakeable.",
    minVerses: 56,
    maxVerses: 75,
    nextLevel: "Solomon"
  },
  {
    level: "Solomon",
    icon: <SolomonIcon />,
    phrase: "Like Solomon, you possess wisdom beyond measure. You've treasured the Word above gold. You are among the elite few who have climbed this mountain.",
    minVerses: 76,
    maxVerses: 100,
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

  // Si el usuario ha superado el máximo del último nivel (100 versos), progreso es 100%
  if (versesCount >= 100 && currentRank.level === "Solomon") {
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
function NicodemusIcon() {
  return (
    <img src={lantern} className="rank-icon" alt="Nicodemus - The Seeker" />
  );
}

function ThomasIcon() {
  return (
    <img src={hello} className="rank-icon" alt="Thomas - The Doubter" />
  );
}

function PeterIcon() {
  return (
    <img src={boat} className="rank-icon" alt="Peter - The Follower" />
  );
}

function JohnIcon() {
  return (
    <img src={christian} className="rank-icon" alt="John - The Beloved" />
  );
}

function PaulIcon() {
  return (
    <img src={weakness} className="rank-icon" alt="Paul - The Transformed" />
  );
}

function DavidIcon() {
  return (
    <img src={heart} className="rank-icon" alt="David - The Worshipper" />
  );
}

function DanielIcon() {
  return (
    <img src={lion} className="rank-icon" alt="Daniel - The Faithful" />
  );
}

function SolomonIcon() {
  return (
    <img src={crown} className="rank-icon" alt="Solomon - The Wise King" />
  );
}