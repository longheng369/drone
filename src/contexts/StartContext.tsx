import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface StartContextType {
  isStarted: boolean;
  isPreparation: boolean;
  isLeftTimerStopped: boolean;
  isRightTimerStopped: boolean;
  startMatch: () => void;
  stopLeftTimer: () => void;
  stopRightTimer: () => void;
  resetMatch: () => void;
}

const StartContext = createContext<StartContextType | undefined>(undefined);

export const useStartContext = (): StartContextType => {
  const context = useContext(StartContext);
  if (!context) {
    throw new Error('useStartContext must be used within a StartProvider');
  }
  return context;
};

interface StartProviderProps {
  children: ReactNode;
}

export const StartProvider: React.FC<StartProviderProps> = ({ children }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [isPreparation, setIsPreparation] = useState(false);
  const [isLeftTimerStopped, setIsLeftTimerStopped] = useState(false);
  const [isRightTimerStopped, setIsRightTimerStopped] = useState(false);

  // Start the match and handle preparation
  const startMatch = () => {
    setIsPreparation(true);
    setIsStarted(false);
    setIsLeftTimerStopped(false);
    setIsRightTimerStopped(false);
  };

  // Handle preparation timer
  useEffect(() => {
    let preparationTimer: NodeJS.Timeout;

    if (isPreparation) {
      preparationTimer = setTimeout(() => {
        setIsPreparation(false);
        setIsStarted(true);
      }, 10000); // 10-second preparation period
    }

    return () => {
      clearTimeout(preparationTimer);
    };
  }, [isPreparation]);

  // Stop Left Timer
  const stopLeftTimer = () => {
    setIsLeftTimerStopped(true);
  };

  // Stop Right Timer
  const stopRightTimer = () => {
    setIsRightTimerStopped(true);
  };

  // Reset the match
  const resetMatch = () => {
    setIsStarted(false);
    setIsPreparation(false);
    setIsLeftTimerStopped(false);
    setIsRightTimerStopped(false);
  };

  return (
    <StartContext.Provider
      value={{
        isStarted,
        isPreparation,
        isLeftTimerStopped,
        isRightTimerStopped,
        startMatch,
        stopLeftTimer,
        stopRightTimer,
        resetMatch,
      }}
    >
      {children}
    </StartContext.Provider>
  );
};
