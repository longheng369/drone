import { useEffect, useRef, useState } from "react";
import { useDataContext } from "../Context";
import { ref, update } from "firebase/database";
import { db } from "../firebase";
import { LuGoal } from "react-icons/lu";
import { Modal, Input } from "antd"; // Import Modal and other components
 
const Goal: React.FC = () => {
   const { data, isLoading, stopLeftTime, stopRightTime, formatTime } = useDataContext();
   const leftTimeInterval = useRef<NodeJS.Timeout | null>(null);
   const rightTimeInterval = useRef<NodeJS.Timeout | null>(null);
   const [leftTime, setLeftTime] = useState<number>(240);
   const [rightTime, setRightTime] = useState<number>(240);
   
   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
   const [editingTime, setEditingTime] = useState<number>(0);
   const [isEditingLeft, setIsEditingLeft] = useState<boolean>(true); // to determine which time is being edited

   const updateTime = async (key: string , value: any) => {
      const timeRef = ref(db, "submit");
      update(timeRef, {[key]: value})
         .then(() => {
            console.log("Time updated successfully!", value);
         })
         .catch((error) => {
            console.log("Failed to update time:", error)
         })
   };

   const handleClickLeft = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      stopLeftTime();
      if (leftTimeInterval.current) clearInterval(leftTimeInterval.current);
      setLeftTime(prev => prev);
      updateTime("left_team_time" , leftTime);
   };

   const handleClickRight = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      stopRightTime();
      if (rightTimeInterval.current) clearInterval(rightTimeInterval.current);
      setRightTime(prev => prev);
      updateTime("right_team_time", rightTime);
   };

   const handleEditClick = (e: React.MouseEvent<HTMLButtonElement> , isLeft: boolean) => {
      e.preventDefault();
      setIsEditingLeft(isLeft);
      setEditingTime(isLeft ? leftTime : rightTime);
      setIsModalOpen(true);
   };

   const handleModalOk = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (isEditingLeft) {
         setLeftTime(editingTime);
         updateTime("left_team_time", editingTime);
      } else {
         setRightTime(editingTime);
         updateTime("right_team_time", editingTime);
      }
      setIsModalOpen(false);
   };

   const handleModalCancel = () => {
      setIsModalOpen(false);
   };

   // // Set initial time values from database and start the interval if needed
   // useEffect(() => {
   //    if (data) {
   //       setLeftTime(data.left_team_time || 240); // Set initial left time from data
   //       setRightTime(data.right_team_time || 240); // Set initial right time from data
   //    }
   // }, [data]);

   useEffect(() => {
      if (data?.is_start_matching) {
         leftTimeInterval.current = setInterval(() => {
            setLeftTime((prev) => {
               if (prev <= 0) {
                  if (leftTimeInterval.current) clearInterval(leftTimeInterval.current);
                  return 0;
               }
               return prev - 1;
            });
         }, 1000);

         rightTimeInterval.current = setInterval(() => {
            setRightTime((prev) => {
               if (prev <= 0) {
                  if (rightTimeInterval.current) clearInterval(rightTimeInterval.current);
                  return 0;
               }
               return prev - 1;
            });
         }, 1000);
      } else {
         if (leftTimeInterval.current) clearInterval(leftTimeInterval.current);
         if (rightTimeInterval.current) clearInterval(rightTimeInterval.current);
      }

      // Clean up intervals on component unmount
      return () => {
         if (leftTimeInterval.current) clearInterval(leftTimeInterval.current);
         if (rightTimeInterval.current) clearInterval(rightTimeInterval.current);
      };
   }, [data?.is_start_matching]);

   if (isLoading) {
      return (
         <div className="flex flex-col justify-center items-center h-screen">
            <span>Loading</span>
            <span className="loading loading-dots loading-lg"></span>
         </div>
      );
   }

   if(!data?.is_start_matching && !data?.to_submit) {
      return <div className="flex flex-col h-screen items-center justify-center bg-gray-800" >
         <div className="h-full w-full flex-col font-anton tracking-wide uppercase text-white bg-gradient-to-br from-red-800  to-blue-800 flex justify-center items-center text-3xl">
            <div>Not Start Matching Yet</div>
            <span className="loading loading-ball loading-lg"></span>
            <span className="loading loading-ring loading-lg"></span>
         </div>
      </div>
   }

   return (
      <div className="flex flex-col pt-10 px-8">
         <div className="text-[2rem] font-anton text-center uppercase flex gap-4 justify-center items-center">
            Goal <LuGoal />
         </div>

         <div className="bg-red-100 rounded-md p-4 mt-2">
            <button onClick={handleClickLeft} className={`w-full tracking-wide text-[2rem] font-anton p-10 rounded-md ${data?.is_left_time_stop ? "bg-green-500" : "bg-red-600"} text-white`}>
               {data?.left_team}
            </button>
            <div className="flex justify-between items-center mt-4">
               <div className="font-anton">TIME : {formatTime(leftTime)}</div>
               <button onClick={(e) => handleEditClick(e,true)} className="p-2 px-3 rounded-md bg-gray-400 text-white">Edit</button>
            </div>
         </div>

         <div className="bg-blue-100 rounded-md p-4 mt-4">
            <button onClick={handleClickRight} className={`w-full tracking-wide text-[2rem] font-anton p-10 rounded-md ${data?.is_right_time_stop ? "bg-green-500" : "bg-blue-600"} text-white`}>
               {data?.right_team}
            </button>
            <div className="flex justify-between items-center mt-4">
               <div className="font-anton">TIME : {formatTime(rightTime)}</div>
               <button onClick={(e) => handleEditClick(e, false)} className="p-2 px-3 rounded-md bg-gray-400 text-white">Edit</button>
            </div>
         </div>

         {data?.to_submit && 
            <div className="text-center mt-8 font-anton uppercase">The Match is Over!</div>
         }

         {/* Modal for editing time */}
         <Modal title="Edit Time" visible={isModalOpen} onOk={handleModalOk} onCancel={handleModalCancel}>
            <Input
               type="number"
               value={editingTime}
               onChange={(e) => setEditingTime(Number(e.target.value))}
               placeholder="Enter new time in seconds"
            />
         </Modal>
      </div>
   );
}

export default Goal;
