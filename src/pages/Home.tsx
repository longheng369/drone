import React, { useEffect, useRef, useState } from "react";
import { useDataContext } from "../Context"; 
import { useNavigate } from "react-router-dom";
import { Team } from "../Interface";
import { useHomeContext } from "../contexts/HomeContext";
import sound from "../assets/mixkit-arcade-game-jump-coin-216.wav"

const Home: React.FC = () => {
   const {
      selectedLeftTeam,
      selectedRightTeam,
      setSelectedLeftTeam,
      setSelectedRightTeam,
      formatTime,
      reset,
      appendData
   } = useDataContext();

   const playAudio = () => {
      const audio = new Audio(sound);
      audio.play().catch((error) => {
         console.error("Error playing audio:", error);
      });
   };


   const {is_preparing, set_is_preparing} = useHomeContext();

   const preparing_time_interval = useRef<NodeJS.Timeout | undefined>(undefined);


   const [preparing_time, set_preparing_time] = useState<number>(10);

   const handlePreparing = () => {
      playAudio();
      set_is_preparing(true);
      // localStorage.setItem("is_preparing", 'true');
      appendData({is_preparing: true, to_submit: false})
   }

   useEffect(() => {

      if (is_preparing) {
         preparing_time_interval.current = setInterval(() => {
            set_preparing_time((prev) => {
               if (prev <= 0) {
                  if (preparing_time_interval.current) clearInterval(preparing_time_interval.current);
                  appendData({is_preparing : false});
                  return 0;
               }
               return prev - 1;
            });
         }, 1000);
      }
   
      return () => {
         if (preparing_time_interval.current) {
            clearInterval(preparing_time_interval.current)
            appendData({is_preparing : false});
         };
      };

   }, [is_preparing]);

   const navigate = useNavigate(); 

   useEffect(() => {
      if (preparing_time === 0) {
         // localStorage.setItem('is_preparing', 'false');
         setTimeout(() => {
            navigate("/start");
         }, 300)
      }
   }, [preparing_time])

   const handleSelectedLeftTeam = (left_team_name: string) => {
      // localStorage.setItem('left_team_name', left_team_name);
      setSelectedLeftTeam(left_team_name);
      appendData({left_team: left_team_name})
   }

   const handleSelectedRightTeam = (right_team_name: string) => {
      // localStorage.setItem('right_team_name', right_team_name);
      setSelectedRightTeam(right_team_name);
      appendData({right_team: right_team_name})
   }

   const channel = new BroadcastChannel('my_channel');
   const click = () => {
      // Create a new Broadcast Channel
      channel.postMessage('Hello from another tab!');

   }
   

   const teams : Team[] = [
      { id: 1, team_name: 'RCL' },
      { id: 2, team_name: 'SoloBot' },
      { id: 3, team_name: 'Wildfire FPV' },
      { id: 4, team_name: 'CAM BOT' },
      { id: 5, team_name: 'CheeseCake' },
      { id: 6, team_name: 'Mini Quads I' },
      { id: 7, team_name: 'Alphaflight' },
      { id: 8, team_name: 'StonerFPV' },
      { id: 9, team_name: 'Mini Quads II' },
      {id: 10, team_name: 'Leng FPV'}
   ];

   return (
      <div className="h-screen bg-gray-800 flex flex-col">
         <div>
            <div className="grid grid-cols-[2fr_0.3fr_2fr]">
               <div>
                  <div className="bg-gradient-to-r from-red-500 w-full text-center text-3xl text-white p-2">
                     {selectedLeftTeam !== '' ? selectedLeftTeam : "Please Select Team"}
                  </div>
               </div>
               <div
                  className="bg-gray-800 text-white flex flex-col items-center justify-center w-full"
               >
                  <span className="italic font-[500] text-3xl">Vs</span>
               </div>
               <div>
                  <div className="bg-gradient-to-l from-blue-600 text-3xl w-full text-center text-white p-2">
                     {selectedRightTeam !== '' ? selectedRightTeam : "Please Select Team"}
                  </div>
               </div>
            </div>
         </div>

         {is_preparing ? (
            <div className="w-full flex items-center justify-center flex-1 h-full text-white text-[8rem]">
               {formatTime(preparing_time)}
            </div>
         ) : (
            <div className="w-full flex-1 grid grid-cols-2">
               {/* Left side */}
               <div className="h-full overflow-y-auto">
                  <div className="grid grid-rows-8 gap-1 p-4 text-white">
                     {teams
                        // .filter((team) => team.team_name !== selectedRightTeam) // Prevent selecting the right-side team
                        .map((team) => (
                           <div
                              key={team.id}
                              onClick={() => handleSelectedLeftTeam(team.team_name)} // Set left-side team on click
                              className={`flex items-center justify-center cursor-pointer p-2 ${
                                 selectedLeftTeam === team.team_name
                                    ? "bg-gradient-to-r from-transparent via-gray-600 to-transparent text-white"
                                    : ""
                              }`} 
                           >
                              {team.team_name}
                           </div>
                        ))}
                  </div>
               </div>
               {/* Right side */}
               <div className="h-full overflow-y-auto">
                  <div className="border-l-2 border-gray-400 grid grid-rows-8 gap-1 p-4 text-white">
                     {teams
                        // .filter((team) => team.team_name !== selectedLeftTeam) // Prevent selecting the left-side team
                        .map((team) => (
                           <div
                              key={team.id}
                              onClick={() => handleSelectedRightTeam(team.team_name)} // Set right-side team on click
                              className={`flex items-center justify-center cursor-pointer p-2 ${
                                 selectedRightTeam === team.team_name
                                    ? "bg-gradient-to-r from-transparent via-gray-600 to-transparent text-white"
                                    : ""
                              }`} 
                           >
                              {team.team_name}
                           </div>
                        ))}
                  </div>
               </div>
            </div>
         )}

         {selectedLeftTeam && selectedRightTeam && (
            <div className="w-full flex justify-center gap-4 p-10 ">
               <button
                  onClick={reset}
                  className="text-center bg-gray-800 border hover:bg-gray-900 text-white px-4 py-2"
               >
                  Reset
               </button>
               <button
                  onClick={handlePreparing}
                  className="bg-yellow-500 text-black p-3"
               >
                  Prepare
               </button>

               <button onClick={click}>click</button>
            </div>
         )}
         
      </div>
   );
};

export default Home;
