import { Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDataContext } from "../Context";

const { Option } = Select;

const Volunteer: React.FC = () => {
   const [activeButtons, setActiveButtons] = useState<number[]>([]);
   const [selectOption, setSelectOption] = useState<number>(1);
   const [isEditing, setIsEditing] = useState<boolean>(false); // State to track editing mode
   const {
      formatTime,
      preparation,
      isLoading,
      appendToArrayInPreparationDatabaseEntry,
      setLeftTeamScore,
      setRightTeamScore
   } = useDataContext();

   // console.log(preparation?.missions?.map((mis) => console.log(mis.mission.includes("red"))))

   // const missionScore = preparation?.missions.reduce((acc : any, mission: any) => {
   //    return acc + mission.score;
   // }, 0);

   const redScore = preparation?.missions?.reduce((acc : any, mission: any) => {
      return mission?.mission?.includes("red") ? acc + mission.score : acc;
   }, 0);
   
   const blueScore = preparation?.missions?.reduce((acc: any, mission: any) => {
      return mission?.mission?.includes("blue") ? acc + mission.score : acc;
   }, 0);



   const [preparationTime, setPreparationTime] = useState<number>(10);

   useEffect(() => {
      localStorage.setItem("volunteer_point", "1");
   }, []);

   // const preparationInterval = setInterval(() => {
   //    setPreparationTime(preparation - 1);
   // }, 1000);

   useEffect(() => {
      let preparationInterval: NodeJS.Timeout | undefined;
      setPreparationTime(10);
      if (preparation.preparing) {
         preparationInterval = setInterval(() => {
            setPreparationTime((prev) => {
               if (prev <= 0) {
                  clearInterval(preparationInterval); // Stop the interval when it reaches zero
                  return 0; // Ensure it does not go below zero
               }
               return prev - 1;
            });
         }, 1000);
      }

      // Cleanup function to clear the interval when isStart changes or the component unmounts
      return () => {
         clearInterval(preparationInterval);
      };
   }, [preparation.preparing]);

   const missionss = preparation?.missions;

   // console.log(missionss?.length === 4)

   const isMissionActive = (missionName: string): boolean => {
      return missionss?.some((mission: any) => mission.mission === missionName);
   };

   //  console.log()

   // Define the missions and scores based on the selected option
   const getMissions = (option: number) => {
      switch (option) {
         case 1:
            return [
               { name: "Mission 1", score: 3 },
               { name: "Mission 2", score: 3 },
               { name: "Mission 1", score: 3 },
               { name: "Mission 2", score: 3 },
            ];
         case 2:
            return [
               { name: "Mission 3", score: 3 },
               { name: "Mission 4", score: 8 },
               { name: "Mission 3", score: 3 },
               { name: "Mission 4", score: 8 },
            ];
         case 3:
            return [
               { name: "Mission 5", score: 6 },
               { name: "Mission 6", score: 6 },
               { name: "Mission 5", score: 6 },
               { name: "Mission 6", score: 6 },
            ];
         case 4:
            return [
               { name: "Mission 7", score: 10 },
               { name: "Mission 8", score: 2 },
               { name: "Mission 7", score: 10 },
               { name: "Mission 8", score: 2 },
            ];
         default:
            return [];
      }
   };

   const missions = getMissions(
      Number(localStorage.getItem("volunteer_point"))
   );

   const handleButtonClick = (buttonId: number, score: number) => {
      setActiveButtons(
         (prev) =>
            prev.includes(buttonId)
               ? prev.filter((id) => id !== buttonId) // Remove if already active
               : [...prev, buttonId] // Add if not active
      );

      // const currentTime = new Date().toLocaleTimeString();
      // Display message based on team
      if (buttonId < 2) {
         appendToArrayInPreparationDatabaseEntry({
            score,
            mission: missions[buttonId].name + " red",
         });
         // setLeftTeamScore(redScore)
      } else {
         appendToArrayInPreparationDatabaseEntry({
            score,
            mission: missions[buttonId].name + " blue",
         });
         // setRightTeamScore(100)
      }
   };

   const handleSelectChange = (value: number) => {
      setSelectOption(value);
      setActiveButtons([]); // Reset active buttons when changing options
      localStorage.setItem("volunteer_point", value.toString());
   };

   const toggleEdit = () => {
      setIsEditing((prev) => !prev);
   };

   // Check if all buttons are active
   const allActive = activeButtons.length === missions.length;

   if (isLoading) {
      return (
         <div className="h-screen flex flex-col gap-2 items-center justify-center">
            <span>Loading</span>
            <span className="loading loading-dots loading-lg"></span>
         </div>
      );
   }
   return (
      <div className="flex flex-col h-screen bg-white">
         <div className="flex w-full">
            <Select
               value={Number(localStorage.getItem("volunteer_point"))}
               onChange={handleSelectChange}
               placeholder="Select an option"
               className="w-full h-16 volunteer-select"
               disabled={!isEditing}
            >
               <Option value={1}>Point 1</Option>
               <Option value={2}>Point 2</Option>
               <Option value={3}>Point 3</Option>
               <Option value={4}>Point 4</Option>
            </Select>

            <button
               onClick={toggleEdit}
               className={`px-4 py-2 text-xl ${
                  isEditing
                     ? "bg-blue-600 text-white"
                     : "bg-green-600 text-white"
               }`}
            >
               {isEditing ? "Done" : "Edit"}
            </button>
         </div>

         {preparation.preparing ? (
            <div className="flex-1 flex flex-col justify-center items-center">
               <span className="text-3xl">Preparing</span>
               <span className="text-[4rem]">
                  {formatTime(preparationTime)}
               </span>
            </div>
         ) : (
            <div className="flex-1">
               {!allActive ? (
                  <div>
                     <h1 className="text-3xl font-bold italic text-center mt-3">
                        Round {preparation.round}
                     </h1>
                     <div className="grid grid-cols-2 mt-8">
                        <div>
                           <h1 className="text-red-600 font-bold text-2xl text-center">
                              {preparation.left_team}
                           </h1>
                           <div className="flex flex-col gap-4 items-center w-full mt-4">
                              {missions.slice(0, 2).map((mission, index) => (
                                 <button
                                    key={index}
                                    onClick={() =>
                                       handleButtonClick(index, mission.score)
                                    }
                                    className={`p-8 rounded flex flex-col items-center justify-center ${
                                       isMissionActive(mission.name + " red")
                                          ? "bg-green-500 text-white"
                                          : "bg-red-600 text-gray-700"
                                    }`}
                                 >
                                    <div className="font-bold text-2xl text-white">
                                       {mission.name}
                                    </div>
                                    <div className="text-white text-lg">
                                       (Score: {mission.score})
                                    </div>
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div>
                           <h1 className="text-blue-600 font-bold text-2xl text-center">
                              {preparation.right_team}
                           </h1>
                           <div className="flex flex-col gap-4 items-center w-full mt-4">
                              {missions.slice(2).map((mission, index) => (
                                 <button
                                    key={index + 2}
                                    onClick={() =>
                                       handleButtonClick(
                                          index + 2,
                                          mission.score
                                       )
                                    }
                                    className={`p-8 rounded flex flex-col items-center justify-center ${
                                       isMissionActive(mission.name + " blue")
                                          ? "bg-green-500 text-white"
                                          : "bg-blue-600 text-gray-700"
                                    }`}
                                 >
                                    <div className="font-bold text-2xl text-white">
                                       {mission.name}
                                    </div>
                                    <div className="text-white text-lg">
                                       (Score: {mission.score})
                                    </div>
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>
                     <div className="flex justify-between w-full"></div>
                  </div>
               ) : (
                  <div className="h-full flex justify-center items-center">
                     <p className="text-green-500 text-3xl">Done!</p>
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

export default Volunteer;
