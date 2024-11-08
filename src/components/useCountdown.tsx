import { useState, useRef, useCallback, useEffect } from 'react';

interface UseCountdownReturn {
  timeLeft: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

const useCountdown = (initialTime: number, onEnd?: () => void): UseCountdownReturn => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start the countdown
  const start = useCallback(() => {
    if (intervalRef.current) return; // Prevent multiple intervals

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          if (onEnd) onEnd(); // Trigger onEnd callback if provided
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [onEnd]);

  // Stop the countdown
  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Reset the countdown
  const reset = useCallback(() => {
    stop();
    setTimeLeft(initialTime);
  }, [initialTime, stop]);

  // Clear interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { timeLeft, start, stop, reset };
};

export default useCountdown;
