import topRight from "../assets/topRight.svg";
import topLeft from "../assets/topLeft.svg";
import bottomRight from "../assets/bottomRight.svg"
import bottomLeft from "../assets/bottomLeft.svg"
import middleLeft from "../assets/middleLeft.svg";
import middleRight from "../assets/middleRight.svg";
import vs from "../assets/vs.svg"
import { db } from "../firebase";
import { off, onValue, ref } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import { useDataContext } from "../Context";


const ScoreBoardNew : React.FC = () => {

   const {formatTime} = useDataContext();
   const [data, setData] = useState<any>('');
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const preparationTimeInterval = useRef<NodeJS.Timeout | null>(null);
   const [preparationTime, setPreparationTime] = useState<number>(10);
   const matchTimeInteval = useRef<NodeJS.Timeout | null>(null);
   const [matchTime, setMatchTime] = useState<number>(240);
   const [submitData , setSubmitData] = useState<any>("");

   useEffect(() => {
      const dbRef = ref(db, "data");
      const submitRef = ref(db, "submit");

      // Set up a real-time listener for the 'data' collection
      const unsubscribeData = onValue(dbRef, (snapshot) => {
         if (snapshot.exists()) {
            setData(snapshot.val());
            setIsLoading(false);
         } else {
            console.log("No data available");
         }
      }, (error) => {
         console.error("Error fetching data:", error);
      });

      // Set up a real-time listener for the 'submit' collection
      const unsubscribeSubmit = onValue(submitRef, (snapshot) => {
         if (snapshot.exists()) {
            setSubmitData(snapshot.val());
         } else {
            console.log("No submit data available");
         }
      }, (error) => {
         console.error("Error fetching submit data:", error);
      });

      // Cleanup listeners on unmount
      return () => {
         off(dbRef, "value", unsubscribeData);
         off(submitRef, "value", unsubscribeSubmit);
      };
   }, []);

   useEffect(() =>{
      if(!isLoading) {
         if(data?.is_preparing) {
            preparationTimeInterval.current = setInterval(() => {
               setPreparationTime((prev) => {
                  if(prev <= 0) {
                     if(preparationTimeInterval.current) clearInterval(preparationTimeInterval.current);
                     setPreparationTime(10);
                     return 0;
                  }
                  return prev - 1;
               })
            }, 1000);
         } else {
            // Clear interval if `is_preparing` is false
            if (preparationTimeInterval.current) {
               clearInterval(preparationTimeInterval.current);
               preparationTimeInterval.current = null;
               setPreparationTime(10);
            }
         }
      }

   },[data?.is_preparing]);
  
   useEffect(() => {
      if (!isLoading) {
         // Clear any existing interval first
         if (matchTimeInteval.current) {
            clearInterval(matchTimeInteval.current);
         }
         
         if (data?.is_start_matching) {
            // Set up a new interval only if match has started
            matchTimeInteval.current = setInterval(() => {
               setMatchTime((prev) => {
                  if (prev <= 0) {
                     if (matchTimeInteval.current) clearInterval(matchTimeInteval.current);
                     setMatchTime(240); // Reset the match time
                     return 0; // Ensure it returns 0 when the time is up
                  }
                  return prev - 1; // Decrement time
               });
            }, 1000);
         } else {
            // If match is not started, reset the timer
            if (matchTimeInteval.current) {
               clearInterval(matchTimeInteval.current);
               matchTimeInteval.current = null; // Clear reference
               setMatchTime(240); // Reset to initial time
            }
         }
      }
   }, [data?.is_start_matching]);
   
   

   if(!isLoading) {
      // console.log(data?.is_start_matching)
      console.log(submitData)
      // console.log(preparationTime)
   return (
      <div className="grid grid-rows-[1fr_2fr_1fr] h-screen bg-gray-800">

         <div className="grid grid-cols-[1fr_0.3fr_1fr] ">
            <div className="bg-gradient-to-r from-red-800">
               <div className="w-[80%]">
                  <img src={topLeft} alt="" />
               </div>
            </div>
            <div ></div>
            <div className="bg-gradient-to-l from-blue-800">
               <div className="w-[80%] float-end">
                  <img src={topRight} alt="" />
               </div>
            </div>
         </div>

         <div className="grid grid-cols-[1fr_0.3fr_1fr]">
            <div className="flex items-center bg-gradient-to-r from-red-800">
               <div className="w-full relative">
                  <h1 className="absolute top-[-35%] right-[10%] font-anton uppercase tracking-wide text-[4.5rem] text-white">{data?.left_team}</h1>
                  <img src={middleLeft} alt="" />
               </div>
            </div>
            <div className="w-full">
               <div className="flex justify-center items-center relative top-[20%] left-[50%] translate-x-[-50%] w-full">
                  <img src={vs} alt="" className="w-4/12"/>
               </div>
            </div>
            <div className="transition-all duration-150 bg-gradient-to-l from-blue-800">
               <div className="w-full relative top-[50%] translate-y-[-50%] transition-all duration-300">
                  <h1 className="absolute top-[-35%] left-[10%] font-anton uppercase tracking-wide text-[4.5rem] text-white">{data?.right_team}</h1>
                  <img src={middleRight} alt="" />
               </div>
            </div>
         </div>

         <div className="grid grid-cols-[1fr_0.3fr_1fr] ">
            <div className="flex items-end bg-gradient-to-r from-red-800">
               <div className="w-[80%]">
                  <img src={bottomLeft} alt="" />
               </div>
            </div>
            <div className="relative">
               <div className="absolute w-[200%] h-[20vh] text-white bottom-[90%] left-[50%] translate-x-[-50%]">
                  {data?.is_preparing ? <span className="text-[8rem] text-center block font-anton uppercase tracking-wide">{formatTime(preparationTime)}</span> :
                  data?.is_start_matching ? <span className="text-[8rem] text-center block font-anton uppercase tracking-wide">{formatTime(matchTime)}</span> :
                  data?.to_submit ? 
                  <div>
                     <div className="font-anton text-[2.8rem] flex justify-between tracking-wide" >
                        <div className="text-red-500">{submitData?.left_team_scores}</div>
                        <div >SCORE</div>
                        <div className="text-blue-500">{submitData?.right_team_scores}</div>
                     </div>

                     <div className="font-anton text-[2.8rem] flex justify-between tracking-wide" >
                        <div className="text-red-500">{formatTime(submitData?.left_team_time)}</div>
                        <div>FLIGHT Time</div>
                        <div className="text-blue-500">{formatTime(submitData?.right_team_time)}</div>
                     </div>
                  </div>
                  : ""
                  }
                 
                  
               </div>
            </div>
            <div className="relative bg-gradient-to-l from-blue-800">
               <div className="w-[80%] absolute bottom-0 right-0">
                  <img src={bottomRight} alt="" />
               </div>
            </div>
         </div>
      </div>
   )
   }
}

export default ScoreBoardNew