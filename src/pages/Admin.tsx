import React, { useRef, useState } from 'react';
import { db } from '../firebase'; // Import initialized Firebase database
import { ref, set } from 'firebase/database';

const Admin: React.FC = () => {
  // State for both intervals
  const [isFirstIntervalRunning, setIsFirstIntervalRunning] = useState(false);
  const [isSecondIntervalRunning, setIsSecondIntervalRunning] = useState(false);
  
  const firstIntervalRef = useRef(false); // Ref for first interval running state
  const secondIntervalRef = useRef(false); // Ref for second interval running state
  const firstIntervalIdRef = useRef<NodeJS.Timeout | null>(null); // Ref for first interval ID
  const secondIntervalIdRef = useRef<NodeJS.Timeout | null>(null); // Ref for second interval ID
  
  const [firstCountdown, setFirstCountdown] = useState(240); // First interval countdown (4 minutes)
  const [secondCountdown, setSecondCountdown] = useState(240); // Second interval countdown (2 minutes)

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const startIntervals = () => {
    setIsFirstIntervalRunning(true);
    setIsSecondIntervalRunning(true);
    
    firstIntervalRef.current = true; // Update ref for first interval
    secondIntervalRef.current = true; // Update ref for second interval

    // Reset countdowns
    setFirstCountdown(240);
    setSecondCountdown(240);

    // Start first interval
    firstIntervalIdRef.current = setInterval(() => {
      if (!firstIntervalRef.current) {
        clearInterval(firstIntervalIdRef.current!);
        return;
      }

      setFirstCountdown((prevCountdown) => {
        if (prevCountdown <= 0) {
          clearInterval(firstIntervalIdRef.current!);
          firstIntervalIdRef.current = null;
          setIsFirstIntervalRunning(false);
          return 0; // Stop countdown at 0
        }

        const intervalRef = ref(db, 'intervalValue1'); // Reference for first interval in Firebase
        set(intervalRef, prevCountdown - 1) // Decrement the countdown
          .catch((error) => {
            console.error('Error writing to database:', error);
          });

        return prevCountdown - 1; // Decrement countdown
      });
    }, 1000); // Every 1 second

    // Start second interval
    secondIntervalIdRef.current = setInterval(() => {
      if (!secondIntervalRef.current) {
        clearInterval(secondIntervalIdRef.current!);
        return;
      }

      setSecondCountdown((prevCountdown) => {
        if (prevCountdown <= 0) {
          clearInterval(secondIntervalIdRef.current!);
          secondIntervalIdRef.current = null;
          setIsSecondIntervalRunning(false);
          return 0; // Stop countdown at 0
        }

        const intervalRef = ref(db, 'intervalValue2'); // Reference for second interval in Firebase
        set(intervalRef, prevCountdown - 1) // Decrement the countdown
          .catch((error) => {
            console.error('Error writing to database:', error);
          });

        return prevCountdown - 1; // Decrement countdown
      });
    }, 1000); // Every 1 second
  };

  const stopIntervals = () => {
    setIsFirstIntervalRunning(false);
    setIsSecondIntervalRunning(false);

    firstIntervalRef.current = false; // Update the ref for first interval
    secondIntervalRef.current = false; // Update the ref for second interval

    if (firstIntervalIdRef.current) {
      clearInterval(firstIntervalIdRef.current); // Clear the first interval
      firstIntervalIdRef.current = null; // Reset the first interval ID
    }

    if (secondIntervalIdRef.current) {
      clearInterval(secondIntervalIdRef.current); // Clear the second interval
      secondIntervalIdRef.current = null; // Reset the second interval ID
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-2xl mb-4'>Admin Page</h1>

      {/* Countdown Display for First Interval */}
      <div className='text-3xl mb-4'>{formatTime(firstCountdown)}</div>
      
      {/* Countdown Display for Second Interval */}
      <div className='text-3xl mb-4'>{formatTime(secondCountdown)}</div>

      {/* Interval Controls */}
      <div className='mb-4'>
        {isFirstIntervalRunning || isSecondIntervalRunning ? (
          <button
            onClick={stopIntervals}
            className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
          >
            Stop Intervals
          </button>
        ) : (
          <button
            onClick={startIntervals}
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          >
            Start Intervals
          </button>
        )}
      </div>
    </div>
  );
};

export default Admin;
