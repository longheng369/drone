// import { useEffect, useState } from "react";
// import { useDataContext } from "../Context";
// import { ref, update } from "firebase/database";
// import { db } from "../firebase";
// import { LuGoal } from "react-icons/lu";
// import { Modal, Input } from "antd"; // Import Modal and other components
// import useCountdown from "../components/useCountdown";

// const Goal: React.FC = () => {
//   const {
//     data,
//     isLoading,
//     // stopLeftTime,
//     // stopRightTime,
//     formatTime,
//     appendData,
//     // reset
//   } = useDataContext();
 
//   const preparationTimer = useCountdown(60,() => console.log("preparation end")); // 10-second preparation countdown
//   const mainTimer = useCountdown(240, () => console.log("Main timer ended"));
//   const leftTimer = useCountdown(240, () => console.log("Left timer ended"));
//   const rightTimer = useCountdown(240, () => console.log("Right timer ended"));
//   // const [isLeftTimeStop, setIsLeftTimeStop] = useState<boolean>(false);
//   // const [isRightTimeStop, setIsRightTimeStop] = useState<boolean>(false);

//   // Start preparation countdown when the match is initiated
//   const handleStartMatch = () => {
//     appendData({ is_prepare_before_start: true });
//     setIsRightTimeStop(false);
//     setIsLeftTimeStop(false);
//     // setIsStarted(true);
//     preparationTimer.reset(); // Reset and start preparation countdown
//     preparationTimer.start();
//   };

//   function stopLeftTimer() {
//     leftTimer.stop();
//     setIsLeftTimeStop(true);
//     appendData({ is_left_time_stop: true });
//   }

//   function stopRightTimer() {
//     rightTimer.stop();
//     setIsRightTimeStop(true);
//     appendData({ is_right_time_stop: true });
//   }


//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [editingTime, setEditingTime] = useState<number>(0);
//   const [isEditingLeft, setIsEditingLeft] = useState<boolean>(true); // to determine which time is being edited

//   const updateTime = async (key: string, value: any) => {
//     const timeRef = ref(db, "submit");
//     update(timeRef, { [key]: value })
//       .then(() => {
//         console.log("Time updated successfully!", value);
//       })
//       .catch((error) => {
//         console.log("Failed to update time:", error);
//       });
//   };

//   const handleClickLeft = async (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     stopLeftTimer();
//   };

//   const handleClickRight = async (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     stopRightTimer();
//   };

//   const handleEditClick = (
//     e: React.MouseEvent<HTMLButtonElement>,
//     isLeft: boolean
//   ) => {
//     e.preventDefault();
//     setIsEditingLeft(isLeft);
    
//   };

//   const handleModalOk = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
    
//   };

//   const handleModalCancel = () => {
//     setIsModalOpen(false);
//   };

//   useEffect(() => {
    
//     if (data?.is_start_matching) {
//       mainTimer.start();
//       leftTimer.start();
//       rightTimer.start();
//     } else {
//       mainTimer.reset();
//       leftTimer.reset();
//       rightTimer.reset();
//     }
//   }, [
//     data?.is_prepare_before_start,
//     data?.is_start_matching,
//     data?.is_preparing,
//   ]);
  

//   if (isLoading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen">
//         <span>Loading</span>
//         <span className="loading loading-dots loading-lg"></span>
//       </div>
//     );
//   }


//   if (!data?.is_start_matching && !data?.to_submit) {
//     return (
//       <div className="flex flex-col h-screen items-center justify-center bg-gray-800">
//         <div className="h-full w-full flex-col font-anton tracking-wide uppercase text-white bg-gradient-to-br from-red-800  to-blue-800 flex justify-center items-center text-3xl">
//           <div>Not Start Matching Yet</div>
//           <span className="loading loading-ball loading-lg"></span>
//           <span className="loading loading-ring loading-lg"></span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col pt-10 px-8">
//       <div className="text-[2rem] font-anton text-center uppercase flex gap-4 justify-center items-center">
//         Goal <LuGoal />
//       </div>

//       <div className="bg-red-100 rounded-md p-4 mt-2">
//         <button
//           onClick={handleClickLeft}
//           className={`w-full tracking-wide text-[2rem] font-anton p-10 rounded-md ${
//             data?.is_left_time_stop ? "bg-green-500" : "bg-red-600"
//           } text-white`}
//         >
//           {data?.left_team}
//         </button>
//         <div className="flex justify-between items-center mt-4">
//           <div className="font-anton">TIME : {formatTime(leftTimer.timeLeft)}</div>
//           <button
//             onClick={(e) => handleEditClick(e, true)}
//             className="p-2 px-3 rounded-md bg-gray-400 text-white"
//           >
//             Edit
//           </button>
//         </div>
//       </div>

//       <div className="bg-blue-100 rounded-md p-4 mt-4">
//         <button
//           onClick={handleClickRight}
//           className={`w-full tracking-wide text-[2rem] font-anton p-10 rounded-md ${
//             data?.is_right_time_stop ? "bg-green-500" : "bg-blue-600"
//           } text-white`}
//         >
//           {data?.right_team}
//         </button>
//         <div className="flex justify-between items-center mt-4">
//           <div className="font-anton">TIME : {formatTime(rightTimer.timeLeft)}</div>
//           <button
//             onClick={(e) => handleEditClick(e, false)}
//             className="p-2 px-3 rounded-md bg-gray-400 text-white"
//           >
//             Edit
//           </button>
//         </div>
//       </div>

//       {data?.to_submit && (
//         <div className="text-center mt-8 font-anton uppercase">
//           The Match is Over!
//         </div>
//       )}

//       {/* Modal for editing time */}
//       <Modal
//         title="Edit Time"
//         visible={isModalOpen}
//         onOk={handleModalOk}
//         onCancel={handleModalCancel}
//       >
//         <Input
//           type="number"
//           value={editingTime}
//           onChange={(e) => setEditingTime(Number(e.target.value))}
//           placeholder="Enter new time in seconds"
//         />
//       </Modal>
//     </div>
//   );

  
// };

// export default Goal;

import React from 'react'

const Goal: React.FC = () => {
  return (
    <div>Goal</div>
  )
}

export default Goal