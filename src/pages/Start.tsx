import React, { useEffect, useState } from "react";
import { useDataContext } from "../Context"; // Import the custom hook
// import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import {
  obstacles_round_1_blue,
  obstacles_round_1_red,
  obstacles_round_2_blue,
  obstacles_round_2_red,
} from "../data";
import useCountdown from "../components/useCountdown";
import { Input, Modal } from "antd";

const Start: React.FC = () => {
  const {
    selectedLeftTeam,
    selectedRightTeam,
    reset,
    appendData,
    data,
    isLoading,
    // leftTime,
    // rightTime,
    stopLeftTime,
    stopRightTime,
    handleSubmit,
    initialMatchingTime,
    // initialPreparationTime
  } = useDataContext();

  // const {isPreparation, isStarted, stopLeftTimer, stopRightTimer } = useStartContext();

  const [redScore, setRedScore] = useState<string>("");
  const [blueScore, setBlueScore] = useState<string>("");


  const [isEditLeft, setIsEditLeft] = useState<boolean>(false);
  const [isEditRight, setIsEditRight] = useState<boolean>(false);
  const [isEditLeftTime, setIsEditLeftTime] = useState<boolean>(false);
  const [isEditRightTime, setIsEditRightTime] = useState<boolean>(false);
  const [leftTeamTime, setLeftTeamTime] = useState<number>(initialMatchingTime);
  const [rightTeamTime, setRightTeamTime] = useState<number>(initialMatchingTime);

  const [isLeftTimeStop, setIsLeftTimeStop] = useState<boolean>(false);
  const [isRightTimeStop, setIsRightTimeStop] = useState<boolean>(false);

  // const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isPreparing, setIsPreparing] = useState<boolean>(true);
  const preparationTimer = useCountdown(10, () =>{handlePreparationEnd(); setIsPreparing(false);}); // 10-second preparation countdown
  const mainTimer = useCountdown(initialMatchingTime, () => {appendData({to_submit: true,is_left_time_stop: false, is_right_time_stop: false });});
  const leftTimer = useCountdown(initialMatchingTime, () => console.log("Left timer ended"));
  const rightTimer = useCountdown(initialMatchingTime, () => console.log("Right timer ended"));

  // Function to start all match timers after preparation countdown ends
  function handlePreparationEnd() {
    mainTimer.start();
    leftTimer.start();
    rightTimer.start();
    setIsLeftTimeStop(false);
    setIsRightTimeStop(false);

    const startMatchingData = {
      is_start_matching: true,
      left_time_start: true,
      right_time_start: true,
      is_left_time_stop: false,
      is_right_time_stop: false,
      left_team_time: 0,
      right_team_time: 0,
      is_prepare_before_start: false
    };

    appendData(startMatchingData);

  }

  useEffect(() => {
    setRightTeamTime(rightTimer.timeLeft);
  },[rightTimer.timeLeft]);


  useEffect(() => {
    setLeftTeamTime(leftTimer.timeLeft);
  },[leftTimer.timeLeft]);

  // Start preparation countdown when the match is initiated
  const handleStartMatch = () => {
    appendData({is_prepare_before_start: true});
    setIsRightTimeStop(false);
    setIsLeftTimeStop(false);
    // setIsStarted(true);
    preparationTimer.reset(); // Reset and start preparation countdown
    preparationTimer.start();
  };

  // useEffect(() => {
    
  // }, [data?.]);


  function stopLeftTimer() {
    leftTimer.stop();
    setIsLeftTimeStop(true);
    appendData({is_left_time_stop: true});                 
  }

  function stopRightTimer() {
    rightTimer.stop();
    setIsRightTimeStop(true);
    appendData({is_right_time_stop: true});
  }


  const resetMatch = () => {
    preparationTimer.stop();
    mainTimer.reset();
    leftTimer.reset();
    rightTimer.reset();
    setIsLeftTimeStop(false);
    setIsRightTimeStop(false);

    reset();
  };

  useEffect(() => {
    if(data?.is_left_time_stop){
      stopLeftTimer();
    }
    if(data?.is_right_time_stop){
      stopRightTimer();
    }

    if(data?.is_left_time_stop && data?.is_right_time_stop) {
      mainTimer.stop();
      stopLeftTimer();
      stopLeftTimer();
      appendData({to_submit: true});
    }
  },[data?.is_left_time_stop, data?.is_right_time_stop])

  useEffect(() => {
    if(data?.to_submit){
      stopLeftTimer();
      stopRightTimer();
    }
  }, [data?.to_submit])

  useEffect(() => {
    setRedScore(
      data?.scores_red?.reduce((pre: any, item: any) => pre + item.score, 0)
    );
    setBlueScore(
      data?.scores_blue?.reduce((pre: any, item: any) => pre + item.score, 0)
    );
  }, [data?.scores_red, data?.scores_blue]);

  useEffect(() => {
    if (data?.scores_blue?.length === 16) {
      stopRightTime();
    }
    if (data?.scores_red?.length === 16) {
      stopLeftTime();
    }
  }, [data?.scores_blue, data?.scores_red]);

  useEffect(() => {

    if (isLeftTimeStop && isRightTimeStop) {
      appendData({ is_start_matching: false });
      appendData({ to_submit: true });
    }
  }, [isLeftTimeStop, isRightTimeStop]);


  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const changeScoreLeft = (value: string) => {
    // Remove leading zeros and validate the input
    const formattedValue = value.replace(/^0+/, ""); // Remove leading zeros
    const parsedValue = parseInt(formattedValue, 10); // Parse to integer

    // If the input is valid, set it; otherwise, set an empty string or 0
    if (!isNaN(parsedValue)) {
      setRedScore(formattedValue); // Set the formatted string
    } else {
      setRedScore(""); // Optional: reset to an empty string if input is invalid
    }
  };

  const changeScoreRight = (value: string) => {
    // Remove leading zeros and validate the input
    const formattedValue = value.replace(/^0+/, ""); // Remove leading zeros
    const parsedValue = parseInt(formattedValue, 10); // Parse to integer

    // If the input is valid, set it; otherwise, set an empty string or 0
    if (!isNaN(parsedValue)) {
      setBlueScore(formattedValue); // Set the formatted string
    } else {
      setBlueScore(""); // Optional: reset to an empty string if input is invalid
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <span>Loading</span>
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  const getObstacleActiveStateBlue = (active: string, round: number) => {
    return (data?.scores_blue ?? []).some(
      (score: any) =>
        score.active_comparison === active && score.round === round
    );
  };

  const getObstacleActiveStateRed = (active: string, round: number) => {
    return (data?.scores_red ?? []).some(
      (score: any) =>
        score.active_comparison === active && score.round === round
    );
  };

  return (
    <div className="h-screen flex flex-col">
      <div>
        <div className="grid grid-cols-[2fr_0.3fr_2fr] bg-gray-800">
          <div>
            <div className="bg-gradient-to-r text-3xl from-red-600 w-full text-center text-white p-2">
              {data?.left_team}
            </div>
          </div>
          <div className="text-white flex flex-col items-center justify-center w-full">
            <span className="italic font-[500] text-3xl">Vs</span>
          </div>
          <div>
            <div className="bg-gradient-to-l text-3xl from-blue-600 w-full text-center text-white p-2">
              {data?.right_team}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gray-800 grid grid-cols-2 pt-4">
        {/* <==== Left ===> */}
        <div className="text-white grid grid-cols-2 gap-3 p-5 border-r-2">
          <div className="flex flex-col gap-3">
            <div className="text-center text-lg">Round 1</div>
            {obstacles_round_1_red.map((obstacle) => (
              <Card
                key={obstacle.id}
                text={obstacle.obstacle_name}
                score={obstacle.score}
                active={getObstacleActiveStateRed(
                  obstacle.active_comparison,
                  obstacle.round
                )}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 border-l border-gray-400">
            <div className="text-center text-lg">Round 2</div>
            {obstacles_round_2_red.map((obstacle) => (
              <Card
                key={obstacle.id}
                text={obstacle.obstacle_name}
                score={obstacle.score}
                active={getObstacleActiveStateRed(
                  obstacle.active_comparison,
                  obstacle.round
                )}
              />
            ))}
          </div>
        </div>

        {/* <==== Right ====> */}
        <div className="text-white grid grid-cols-2 gap-3 p-5">
          <div className="flex flex-col gap-3">
            <div className="text-center text-lg">Round 2</div>
            {obstacles_round_1_blue.map((obstacle) => (
              <Card
                key={obstacle.id}
                text={obstacle.obstacle_name}
                score={obstacle.score}
                active={getObstacleActiveStateBlue(
                  obstacle.active_comparison,
                  obstacle.round
                )}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 border-l border-gray-400">
            <div className="text-center text-lg">Round 1</div>
            {obstacles_round_2_blue.map((obstacle) => (
              <Card
                key={obstacle.id}
                text={obstacle.obstacle_name}
                score={obstacle.score}
                active={getObstacleActiveStateBlue(
                  obstacle.active_comparison,
                  obstacle.round
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="h-[15vh] text-white text-xl bg-gray-800 grid grid-cols-[1fr_0.3fr_1fr]">
        <div className="bg-gray-800">
          <div className="flex items-center gap-3 justify-center">
            <input
              disabled={!isEditLeft}
              value={redScore || ""}
              readOnly={!isEditLeft}
              onChange={(e) => changeScoreLeft(e.target.value)}
              type="number"
              className="text-white border bg-transparent px-2 py-1 w-[6rem]"
            />
            <button
              onClick={() => setIsEditLeft(!isEditLeft)}
              className={`text-white bg-gray-800 px-3 py-1 h-full border ${
                isEditLeft ? "bg-orange-400 text-black border-yellow-500" : ""
              }`}
            >
              {isEditLeft ? "Submit" : "Edit"}
            </button>
          </div>

          <div className="flex justify-center items-center mt-4">
            <button onClick={stopLeftTimer} className={`font-anton border tracking-wider hover:bg-red-600 py-2 px-4 ${isLeftTimeStop ? "bg-red-600" : ""}`}>
              {formatTime(leftTeamTime)}
            </button>
          <button onClick={() => setIsEditLeftTime(!isEditLeftTime)} className="ml-3 px-3 py-2 border">Edit</button>
          </div>


          <Modal
              open={isEditLeftTime}
              onCancel={() => setIsEditLeftTime(false)}
              onOk={() => setIsEditLeftTime(false)}
              title="Edit Time Left"
            >
              <div>
                <Input value={leftTeamTime} onChange={(e) => setLeftTeamTime(Number(e.target.value))}/>
              </div>
            </Modal>

        </div>

        <div className="flex items-center justify-center text-[2.2rem] font-anton tracking-widest">
          {isPreparing ? preparationTimer.timeLeft : ""}
        </div>
        
        <div className="bg-gray-800">
          <div className="flex items-center gap-3 justify-center">
            <input
              disabled={!isEditRight}
              value={blueScore || ""}
              readOnly={!isEditRight}
              onChange={(e) => changeScoreRight(e.target.value)}
              type="number"
              className="text-white border bg-transparent px-2 py-1 w-[6rem]"
            />
            <button
              onClick={() => setIsEditRight(!isEditRight)}
              className={`text-white bg-gray-800 px-3 py-1 h-full border ${
                isEditRight ? "bg-orange-400 text-black border-yellow-500" : ""
              }`}
            >
              {isEditRight ? "Submit" : "Edit"}
            </button>
          </div>
          
          <div className="flex justify-center items-center mt-4">
            <button onClick={stopRightTimer} className={`font-anton border tracking-wider hover:bg-red-600 py-2 px-4 ${isRightTimeStop ? "bg-red-600" : ""}`}>
              {formatTime(rightTeamTime)}
            </button>
            <button onClick={() => setIsEditRightTime(!isEditRightTime)} className="ml-3 px-3 py-2 border">Edit</button>

            <Modal
              open={isEditRightTime}
              onCancel={() => setIsEditRightTime(false)}
              onOk={() => setIsEditRightTime(false)}
              title="Edit Time Right"
            >
              <div>
                <Input value={rightTeamTime} onChange={(e) => setRightTeamTime(Number(e.target.value))}/>
              </div>
            </Modal>
          </div>
        
        </div>
        
      </div>

      <div className="h-[15vh] bg-gray-800 flex items-center justify-center">
        <div className="grid grid-cols-[1fr_10fr_1fr] w-full px-4">
          <div></div>
          {data?.to_submit ? (
            <div className="flex justify-center">
              <button
                onClick={() =>
                  handleSubmit({
                    left_team: selectedLeftTeam,
                    left_team_scores: Number(redScore) || 0,
                    left_team_time: leftTeamTime,
                    right_team: selectedRightTeam,
                    right_team_scores: Number(blueScore) || 0,
                    right_team_time: rightTeamTime,
                  })
                }
                className={`px-4 py-3 text-lg text-center bg-yellow-500`}
              >
                Submit
              </button>
              <button
                onClick={reset}
                className="border hover:bg-gray-900 text-white px-4 py-3 ml-5"
              >
                Reset
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="grid grid-cols-2 w-3/12 gap-4 ">
                <button
                  className={`text-black text-lg font-anton uppercase px-4 py-3 ${
                    data?.is_prepare_before_start
                      ? "bg-green-500 cursor-not-allowed hover:bg-green-500"
                      : data?.is_start_matching ? "bg-green-500 cursor-not-allowed hover:bg-green-500" : "bg-yellow-500 font-[500] hover:bg-yellow-600"
                  }`}
                  onClick={handleStartMatch}
                  disabled={data?.is_start_matching || data?.is_prepare_before_start}
                >
                  Start
                </button>
                <button
                  onClick={resetMatch}
                  className="text-white border hover:bg-gray-900 px-4 py-3"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Start;
