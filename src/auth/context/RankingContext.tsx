// src/context/RankingContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BiblicalRank, biblicalRanks, calculateUserRank, canLevelUp as checkLevelUp } from '../../utils/RankingSystem';

interface RankingContextType {
  currentRank: BiblicalRank;
  nextRank: BiblicalRank | null;
  versesCount: number;
  progress: number;
  versesToNextRank: number;
  canLevelUp: boolean;
  showLevelUpNotification: boolean;
  addVerse: () => void;
  levelUp: () => void;
  closeLevelUpNotification: () => void;
}

const RankingContext = createContext<RankingContextType | undefined>(undefined);

interface RankingProviderProps {
  children: ReactNode;
  initialVerseCount?: number;
}

export const RankingProvider: React.FC<RankingProviderProps> = ({ 
  children, 
  initialVerseCount = 0 
}) => {
  const [versesCount, setVersesCount] = useState<number>(initialVerseCount);
  const [showLevelUpNotification, setShowLevelUpNotification] = useState<boolean>(false);
  
  // Utilizamos la función existente para calcular el rango
  const { currentRank, progress, versesToNextRank } = calculateUserRank(versesCount);
  
  // Encontrar el siguiente rango
  const currentRankIndex = biblicalRanks.findIndex(rank => rank.level === currentRank.level);
  const nextRank = currentRankIndex < biblicalRanks.length - 1 
    ? biblicalRanks[currentRankIndex + 1] 
    : null;
  
  // Verificar si puede subir de nivel usando la función existente
  const canLevelUp = checkLevelUp(versesCount);
  
  // Añadir un versículo (memorizado)
  const addVerse = () => {
    setVersesCount(prevCount => prevCount + 1);
  };
  
  // Función para subir de nivel
  const levelUp = () => {
    if (canLevelUp) {
      setShowLevelUpNotification(true);
    }
  };
  
  // Cerrar notificación de subida de nivel
  const closeLevelUpNotification = () => {
    setShowLevelUpNotification(false);
  };
  
  const value = {
    currentRank,
    nextRank,
    versesCount,
    progress,
    versesToNextRank,
    canLevelUp,
    showLevelUpNotification,
    addVerse,
    levelUp,
    closeLevelUpNotification
  };
  
  return (
    <RankingContext.Provider value={value}>
      {children}
    </RankingContext.Provider>
  );
};

// Hook personalizado para usar el contexto de ranking
export const useRanking = (): RankingContextType => {
  const context = useContext(RankingContext);
  if (context === undefined) {
    throw new Error('useRanking debe ser usado dentro de un RankingProvider');
  }
  return context;
};

export default RankingContext;