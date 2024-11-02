import React, { useEffect, useRef, useState } from "react";
import { useDataContext } from "../Context"; // Import the custom hook
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { obstacles_round_1_blue, obstacles_round_1_red, obstacles_round_2_blue, obstacles_round_2_red } from "../data";


const Start: React.FC = () => {
   const {
      selectedLeftTeam,
      selectedRightTeam,
      reset,
      startMatching,
      stopMainTime,
      isLeftTimeStop,
      isRightTimeStop,
      appendData,
      data,
      isLoading,
      leftTime,
      rightTime,
      stopLeftTime,
      stopRightTime,
      handleSubmit
   } = useDataContext();

   const [redScore, setRedScore] = useState<string>("");
   const [blueScore, setBlueScore] = useState<string>("");

   const initialLeftTimeStart = useRef(data?.left_time_start);
   const initialRightTimeStart = useRef(data?.right_time_start);

   const [isEditLeft, setIsEditLeft] = useState<boolean>(false);
   const [isEditRight, setIsEditRight] = useState<boolean>(false);

   const [rightTeamName, setRightTeamName] = useState('');
   const [leftTeamName, setLeftTeamName] = useState('');

   const navigate = useNavigate();

   useEffect(() => {
      // Check if `left_time_start` has changed from true to false after the initial render
      if (initialLeftTimeStart.current !== undefined && initialLeftTimeStart.current === true && data?.left_time_start === false) {
         stopLeftTime();
      }

      // Check if `right_time_start` has changed from true to false after the initial render
      if (initialRightTimeStart.current !== undefined && initialRightTimeStart.current === true && data?.right_time_start === false) {
         stopRightTime();
      }

      // Update the initial states to the latest values
      initialLeftTimeStart.current = data?.left_time_start;
      initialRightTimeStart.current = data?.right_time_start;
   }, [data?.left_time_start, data?.right_time_start]);

   
useEffect(() => {
// Function to fetch team names from local storage
const fetchTeamNames = () => {
   const rightTeam = localStorage.getItem('right_team_name');
   const leftTeam = localStorage.getItem('left_team_name');

   if (rightTeam) {
      setRightTeamName(rightTeam);
   }

   if (leftTeam) {
      setLeftTeamName(leftTeam);
   }
};

// Fetch the initial team names when the component mounts
fetchTeamNames();

// Event listener for local storage changes
const handleStorageChange = (event: StorageEvent) => {
   if (event.key === 'right_team_name' || event.key === 'left_team_name') {
      fetchTeamNames(); // Update state with new values
   }
};

window.addEventListener('storage', handleStorageChange);

// Cleanup the event listener on component unmount
return () => {
   window.removeEventListener('storage', handleStorageChange);
};
}, []);


   // const blueScores = [
   //    { obstacle: '1', score: 3, round: 1, active_comparison: 'obstacle 1 blue' },
   //    { obstacle: '2', score: 3, round: 1, active_comparison: 'obstacle 2 blue' },
   //    { obstacle: '1', score: 3, round: 2, active_comparison: 'obstacle 1 blue' },
   //    { obstacle: '2', score: 3, round: 2, active_comparison: 'obstacle 2 blue'  }, 
   // ];

   // const redScores = [
   //    { obstacle: '1', score: 3, round: 1 },
   //    { obstacle: '2', score: 3, round: 1 },
   //    { obstacle: '1', score: 3, round: 2 },
   //    { obstacle: '2', score: 3, round: 2 }, 
   // ];

   useEffect(() => {
      setRedScore(data?.scores_red?.reduce((pre: any, item: any) => pre + item.score, 0));
      setBlueScore(data?.scores_blue?.reduce((pre: any, item: any) => pre + item.score, 0));
   },[data?.scores_red, data?.scores_blue]);

   useEffect(() => {
      if(data?.scores_blue?.length === 16) {
         stopRightTime();
      }
      if(data?.scores_red?.length === 16) {
         stopLeftTime();
      }
   },[data?.scores_blue, data?.scores_red])

  
   // useEffect(() => {
   //    // Check if teams are not selected and redirect to home page
   //    if (selectedLeftTeam === '' || selectedRightTeam === '') {
   //          navigate("/"); // Redirect to home if no team selected
   //    }
   // }, [selectedLeftTeam, selectedRightTeam, navigate]);

   useEffect(() => {
      const updateIsStartMatching = async () => {
            await appendData({ is_start_matching: false });
      };

      if (isLeftTimeStop && isRightTimeStop) {
            stopMainTime();
            updateIsStartMatching();
            appendData({ to_submit: true });
      }
   }, [isLeftTimeStop, isRightTimeStop]);


   // Format time as MM:SS
   const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
   };

   const changeScoreLeft = (value: string) => {
      // Remove leading zeros and validate the input
      const formattedValue = value.replace(/^0+/, ''); // Remove leading zeros
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
      const formattedValue = value.replace(/^0+/, ''); // Remove leading zeros
      const parsedValue = parseInt(formattedValue, 10); // Parse to integer
   
      // If the input is valid, set it; otherwise, set an empty string or 0
      if (!isNaN(parsedValue)) {
         setBlueScore(formattedValue); // Set the formatted string
      } else {
         setBlueScore(''); // Optional: reset to an empty string if input is invalid
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
      return (data?.scores_blue ?? []).some((score: any) => score.active_comparison === active && score.round === round);
   };

   const getObstacleActiveStateRed = (active: string, round: number) => {
      return (data?.scores_red ?? []).some((score : any) => score.active_comparison === active && score.round === round);
   };

   return (
      <div className="h-screen flex flex-col">
            <div>
               <div className="grid grid-cols-[2fr_0.3fr_2fr] bg-gray-800">
                  <div>
                        <div className="bg-gradient-to-r text-xl from-red-600 w-full text-center text-white p-2">
                           {leftTeamName}
                        </div>
                  </div>
                  <div className="text-white flex flex-col items-center justify-center w-full">
                        <span className="italic font-[500] text-3xl">Vs</span>
                  </div>
                  <div>
                        <div className="bg-gradient-to-l text-xl from-blue-600 w-full text-center text-white p-2">
                           {rightTeamName}
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
                              active={getObstacleActiveStateRed(obstacle.active_comparison, obstacle.round)}
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
                              active={getObstacleActiveStateRed(obstacle.active_comparison, obstacle.round)}
                           />
                        ))}
                  </div>
               </div>

               {/* <==== Right ====> */}
               <div className="text-white grid grid-cols-2 gap-3 p-5">
                  <div className="flex flex-col gap-3">
                        <div className="text-center text-lg">Round 2</div>
                        {obstacles_round_1_blue.map((obstacle, i) => (
                           <Card 
                              key={obstacle.id}
                              text={obstacle.obstacle_name} 
                              score={obstacle.score} 
                              active={getObstacleActiveStateBlue(obstacle.active_comparison, obstacle.round)}
                           />
                        ))}
                  </div>
                  
                  <div className="flex flex-col gap-3 border-l border-gray-400">
                        <div className="text-center text-lg">Round 1</div>
                        {obstacles_round_2_blue.map((obstacle, i) => (
                           <Card 
                              key={obstacle.id}
                              text={obstacle.obstacle_name} 
                              score={obstacle.score} 
                              active={getObstacleActiveStateBlue(obstacle.active_comparison, obstacle.round)}
                           />
                        ))}
                  </div>
               </div>
            </div>


            <div className="grid grid-cols-2 bg-gray-800">
               <div className="text-center text-white flex flex-col justify-center gap-3">
                  <div className="flex items-center gap-3 justify-center">
                     <input disabled={!isEditLeft} value={redScore || ''} readOnly={!isEditLeft} onChange={(e) => changeScoreLeft(e.target.value)} type="number" className="text-white border bg-transparent px-2 py-1 w-[6rem]"/>
                     <button onClick={() => setIsEditLeft(!isEditLeft)} className={`text-white bg-gray-800 px-3 h-full border ${isEditLeft ? "bg-yellow-400 text-black border-yellow-500" : ''}`}>{ isEditLeft ? "Submit" : "Edit" }</button>
                  </div>
                  <span className="text-2xl">{formatTime(leftTime)}</span>
                  <div><button onClick={stopLeftTime} className="p-2 px-4 border text-white inline">Stop</button></div>

               </div>
               <div className="text-center text-white flex flex-col justify-center gap-3">
                  <div className="flex items-center gap-3 justify-center">
                     <input disabled={!isEditRight} value={blueScore || ''} readOnly={!isEditRight} onChange={(e) => changeScoreRight(e.target.value)} type="number" className="text-white border bg-transparent px-2 py-1 w-[6rem]"/>
                     <button onClick={() => setIsEditRight(!isEditRight)} className={`text-white bg-gray-800 px-3 h-full border ${isEditRight ? "bg-yellow-400 text-black border-yellow-500" : ''}`}>{ isEditRight ? "Submit" : "Edit" }</button>
                  </div>
                  <span className="text-2xl">{formatTime(rightTime)}</span>
                  <div><button onClick={stopRightTime} className="p-2 px-4 border text-white inline">Stop</button></div>
               </div>
            </div>


            <div className="h-[15vh] bg-gray-800 flex items-center justify-center">
               <div className="grid grid-cols-[1fr_10fr_1fr] w-full px-4">
                  <div></div>
                  {data?.to_submit ? (
                        <div className="flex justify-center">
                           <button
                              onClick={() => handleSubmit({left_team: selectedLeftTeam, left_team_scores: Number(redScore) || 0, left_team_time: leftTime, right_team: selectedRightTeam, right_team_scores: Number(blueScore) || 0, right_team_time: rightTime})}
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
                                    className={`text-black text-lg bg-yellow-500 font-[500] uppercase px-4 py-3 hover:bg-yellow-600 ${data?.is_start_matching ? "bg-[#0fdb0f] cursor-not-allowed hover:bg-[#0fdb0f]" : ""}`}
                                    onClick={startMatching}
                                    disabled={data?.is_start_matching}
                              >
                                    Start
                              </button>
                              <button
                                    onClick={reset}
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
