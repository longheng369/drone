import React, { useEffect, useState } from "react";
import useCountdown from "../components/useCountdown";

const MatchControls: React.FC = () => {

  const [isLeftTimeStop, setIsLeftTimeStop] = useState<boolean>(false);
  const [isRightTimeStop, setIsRightTimeStop] = useState<boolean>(false);

  const preparationTimer = useCountdown(10, handlePreparationEnd); // 10-second preparation countdown
  const mainTimer = useCountdown(60, () => console.log("Main timer ended"));
  const leftTimer = useCountdown(60, () => console.log("Left timer ended"));
  const rightTimer = useCountdown(60, () => console.log("Right timer ended"));

  // Function to start all match timers after preparation countdown ends
  function handlePreparationEnd() {
    mainTimer.start();
    leftTimer.start();
    rightTimer.start();
    setIsLeftTimeStop(false);
    setIsRightTimeStop(false);
  }

  // Start preparation countdown when the match is initiated
  const handleStartMatch = () => {
    preparationTimer.reset(); // Reset and start preparation countdown
    preparationTimer.start();
    setIsLeftTimeStop(false);
    setIsRightTimeStop(false);
  };

  function stopLeftTimer() {
    leftTimer.stop();
    setIsLeftTimeStop(true);
  }

  function stopRightTimer() {
    rightTimer.stop();
    setIsRightTimeStop(true);
  }

  const resetMatch = () => {
    preparationTimer.stop();
    mainTimer.reset();
    leftTimer.reset();
    rightTimer.reset();
    setIsLeftTimeStop(false);
    setIsRightTimeStop(false);
  };

  useEffect(() => {
    if (isLeftTimeStop && isRightTimeStop) {
      mainTimer.stop();
    }
  }, [isLeftTimeStop, isRightTimeStop, mainTimer]);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-lg space-y-4">
      <div className="text-center space-y-2">
        {preparationTimer.timeLeft > 0 ? (
          <p className="text-lg font-semibold text-yellow-600">
            Preparation Time: {preparationTimer.timeLeft} seconds
          </p>
        ) : (
          <p className="text-lg font-semibold text-blue-600">
            Match Time: {mainTimer.timeLeft} seconds
          </p>
        )}
        <p className="text-sm text-red-500">Left Team Time: {leftTimer.timeLeft} seconds</p>
        <p className="text-sm text-green-500">Right Team Time: {rightTimer.timeLeft} seconds</p>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={stopLeftTimer}
          className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-200"
        >
          Right Team Reached Goal
        </button>
        <button
          onClick={handleStartMatch}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
        >
          Start Match
        </button>
        <button
          onClick={stopRightTimer}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-200"
        >
          Left Team Reached Goal
        </button>
        <button
          onClick={resetMatch}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-200"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default MatchControls;
