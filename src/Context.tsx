import React, {
   createContext,
   useContext,
   useState,
   useRef,
   ReactNode,
   useEffect,
} from "react";
import {
   ref,
   set,
   onValue,
   update,
   get
} from "firebase/database";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useHomeContext } from "./contexts/HomeContext";

interface SubmitData {
   left_team?: string | number | null | undefined;
   left_team_scores: number;
   left_team_time: number;
   right_team?:  string | number | null | undefined;
   right_team_scores: number;
   right_team_time: number;
}

interface ContextType {
   selectedLeftTeam: string;
   selectedRightTeam:  string;
   setSelectedLeftTeam: (team_name:  string) => void;
   setSelectedRightTeam: (team_name:  string ) => void;

   isPreparing: boolean;
   preparingTime: number;
   setPreparingTime: (time: number) => void;

   leftTeamScore: number;
   rightTeamScore: number;
   setLeftTeamScore: (score: number) => void;
   setRightTeamScore: (score: number) => void;

   formatTime: (second: number) => string;
   reset: () => void;

   mainTime: number;
   setMainTime: (time: number) => void;
   stopMainTime: () => void;

   leftTime: number;
   rightTime: number;
   stopLeftTime: () => void;
   stopRightTime: () => void;

   preparation_start: () => void;
   startMatching: () => void;

   isLoading: boolean;
   toSubmit: boolean;
   setToSubmit: (submit: boolean) => void;
   data: any;
   fetchDatabaseEntry: (data: any) => void;

   isLeftTimeStop: boolean;
   isRightTimeStop: boolean;

   appendData: (data: any, column?: string) => void;
   appendScoresBlue: (scores: { obstacle: any; score: number, round: number, active_comparison: string }) => void;
   appendScoresRed: (scores: { obstacle: any; score: number, round: number, active_comparison: string }) => void;
   createDatabaseEntry: (data: any) => void;

   handleSubmit: (data: SubmitData) => void;
}



const Context = createContext<ContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({
   children,
}) => {
   const {set_is_preparing} = useHomeContext();
   const [selectedLeftTeam, setSelectedLeftTeam] = useState<string>('');
   const [selectedRightTeam, setSelectedRightTeam] = useState<string>('');
   const [isPreparing, setIsPreparing] = useState<boolean>(false);
   const [preparingTime, setPreparingTime] = useState<number>(10);

   const [leftTeamScore, setLeftTeamScore] = useState<number>(0);
   const [rightTeamScore, setRightTeamScore] = useState<number>(0);

   const leftTimeRef = useRef<(() => void) | null>(null);
   const rightTimeRef = useRef<(() => void) | null>(null);
   const mainTimeRef = useRef<(() => void) | null>(null);
   const praprationIntervalRef = useRef<(() => void) | null>(null);
   

   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [toSubmit, setToSubmit] = useState<boolean>(false);
   const [data, setData] = useState<any>("");
   // const [isStartMatching, setIsStartMatching] = useState<boolean>(false);
   const [leftTime, setLeftTime] = useState<number>(240);
   const [mainTime, setMainTime] = useState<number>(240);
   const [rightTime, setRightTime] = useState<number>(240);
   const [isLeftTimeStop, setIsLeftTimeStop] = useState<boolean>(false);
   const [isRightTimeStop, setIsRightTimeStop] = useState<boolean>(false);

   const navigate = useNavigate();

   const formatTime = (seconds: number): string => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs
         .toString()
         .padStart(2, "0")}`;
   };

   useEffect(() => {
      const handleData = (fetchedData: any) => {
         setData(fetchedData);
         setIsLoading(false);
      };
      fetchDatabaseEntry(handleData);
   }, []);

   const fetchDatabaseEntry = (callback: (data: any) => void) => {
      const dbRef = ref(db, "data");
      onValue(dbRef, (snapshot) => {
         const data = snapshot.val();
         setData(data);
         callback(data);
      }, (error) => {
         console.error("Error fetching database entry:", error);
         setIsLoading(false);
      });
   };

   const createDatabaseEntry = async (data: any) => {
      try {
         const dbRef = ref(db, "data");
         await set(dbRef, data);
         console.log("Database entry created:", data);
      } catch (error) {
         console.error("Error creating database entry:", error);
      }
   };


   const appendScoresBlue = async (newScore: { obstacle: any; score: number, round: number, active_comparison: string }) => {
      try {
         const dbRef = ref(db, 'data/scores_blue'); // Reference to the scores-blue path

         // Fetch existing scores
         const snapshot = await get(dbRef);
         const existingScores = snapshot.exists() ? snapshot.val() : []; // Get existing scores or start with an empty array

         // Append the new score
         const updatedScores = [...existingScores, newScore]; // Create a new array with existing and new scores

         // Set the updated array back to the database
         await set(dbRef, updatedScores); // Set the scores array to the database

         console.log("Scores updated:", updatedScores);
      } catch (error) {
         console.error("Error updating scores:", error);
      }
   };

   const appendScoresRed = async (newScore: { obstacle: any; score: number, round: number, active_comparison: string }) => {
      try {
         const dbRef = ref(db, 'data/scores_red'); // Reference to the scores-blue path

         // Fetch existing scores
         const snapshot = await get(dbRef);
         const existingScores = snapshot.exists() ? snapshot.val() : []; // Get existing scores or start with an empty array

         // Append the new score
         const updatedScores = [...existingScores, newScore]; // Create a new array with existing and new scores

         // Set the updated array back to the database
         await set(dbRef, updatedScores); // Set the scores array to the database

         console.log("Scores updated:", updatedScores);
      } catch (error) {
         console.error("Error updating scores:", error);
      }
   };

   const appendData = async (data: any, key: string = "") => {
      try {
         const dbRef = ref(db, `data/${key}`);
         await update(dbRef, data);
         console.log("Data appended successfully");
      } catch (error) {
         console.error("Error creating database entry:", error);
      }
   };

   const preparation_start = async () => {
      setIsPreparing(true);
      
      const preparationData = {
         left_team: selectedLeftTeam,
         right_team: selectedRightTeam,
         is_preparing: true,
         is_start_preparing: true,
         is_start_matching: false,
         left_time_start: false,
         right_time_start: false,
      };
      const preparingInterval = setInterval(() => {
         setPreparingTime((prev) => {
            if (prev <= 1) {
               clearInterval(preparingInterval);
               appendData({ is_preparing: false, is_start_preparing: false });
               setIsPreparing(false);
            }
            return prev - 1;
         });
      }, 1000);

      await createDatabaseEntry(preparationData);
      praprationIntervalRef.current = () => clearInterval(preparingInterval);
      return () => {
         clearInterval(preparingInterval);
      };
   };

   const startMatching = async () => {
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
      };

      localStorage.setItem('start_left', 'true');
      localStorage.setItem('start_right', 'true');
      localStorage.setItem('start_match', 'true');

      const leftTimeInterval = setInterval(() => {
         setLeftTime((prev) => {
            if (prev <= 1) {
               clearInterval(leftTimeInterval);
               setIsLeftTimeStop(true);
               return 0;
            }
            return prev - 1;
         });
      }, 1000);

      const mainTimeInterval = setInterval(() => {
         setMainTime((prev) => {
            if (prev <= 1) {
               clearInterval(mainTimeInterval);
               return 0;
            }
            return prev - 1;
         });
      }, 1000);

      const rightTimeInterval = setInterval(() => {
         setRightTime((prev) => {
            if (prev <= 1) {
               clearInterval(rightTimeInterval);
               setIsRightTimeStop(true);
               return 0;
            }
            return prev - 1;
         });
      }, 1000);

      await appendData(startMatchingData);

      leftTimeRef.current = () => clearInterval(leftTimeInterval);
      mainTimeRef.current = () => clearInterval(mainTimeInterval);
      rightTimeRef.current = () => clearInterval(rightTimeInterval);

      return () => {
         clearInterval(mainTimeInterval);
         clearInterval(leftTimeInterval);
         clearInterval(rightTimeInterval);
      };
   };

   const handleSubmit = async (data: SubmitData) => {
      const submitData = {left_team: data.left_team, left_team_scores: data.left_team_scores, left_team_time: data.left_team_time ,right_team: data.right_team, right_team_scores: data.right_team_scores, right_team_time: data.right_team_time };

      const submitRef = ref(db, 'submit');

      set(submitRef, submitData)
         .then(() => {
            message.success("Submit Done!")
            console.log("Data submitted successfully");
         })
         .catch((error) => {
            console.error("Error submitting data:", error);
         });
   }

   const stopLeftTime = async () => {
      if (leftTimeRef.current) leftTimeRef.current();
      setIsLeftTimeStop(true);
      await appendData({ left_team_time: leftTime, is_left_time_stop: true, left_time_start: false });
   };

   const stopRightTime = async () => {
      if (rightTimeRef.current) rightTimeRef.current();
      setIsRightTimeStop(true);
      await appendData({ right_team_time: rightTime, is_right_time_stop: true, right_time_start: false });
   };

   const stopMainTime = () => {
      if (mainTimeRef.current) mainTimeRef.current();
   };

// Context API - Reset Function
const reset = async () => {
   if (praprationIntervalRef.current) praprationIntervalRef.current();
   
   // Reset all necessary states
   set_is_preparing(false);
   setSelectedLeftTeam('');
   setSelectedRightTeam('');
   setPreparingTime(10);
   setLeftTime(240);
   setRightTime(240);
   setMainTime(240);
   setLeftTeamScore(0);
   setRightTeamScore(0);

   stopMainTime();
   stopRightTime();
   stopLeftTime();

   setIsLeftTimeStop(false);
   setIsRightTimeStop(false);

   // Clear localStorage items
   localStorage.setItem('is_preparing', 'false');
   localStorage.removeItem('start_left');
   localStorage.removeItem('start_right');
   localStorage.setItem('left_team_name', ''); // Clear left team name
   localStorage.setItem('right_team_name', ''); // Clear right team name
   localStorage.removeItem('start_match');
   navigate('/')

   await appendData({ 
       is_preparing: false, 
       is_start_preparing: false, 
       is_start_matching : false, 
       left_team: "", 
       right_team: "", 
       scores_red: [], 
       scores_blue: [], 
       to_submit: false
   });

};


   return (
      <Context.Provider
         value={{
            selectedLeftTeam,
            selectedRightTeam,
            setSelectedLeftTeam,
            setSelectedRightTeam,
            isPreparing,
            preparingTime,
            setPreparingTime,
            leftTeamScore,
            rightTeamScore,
            setLeftTeamScore,
            setRightTeamScore,
            formatTime,
            reset,
            mainTime,
            setMainTime,
            stopMainTime,
            leftTime,
            rightTime,
            stopLeftTime,
            stopRightTime,
            preparation_start,
            startMatching,
            isLoading,
            toSubmit,
            setToSubmit,
            data,
            fetchDatabaseEntry,
            isLeftTimeStop,
            isRightTimeStop,
            appendData,
            appendScoresBlue,
            appendScoresRed,
            createDatabaseEntry,
            handleSubmit
         }}
      >
         {children}
      </Context.Provider>
   );
};

export const useDataContext = () => {
   const context = useContext(Context);
   if (context === undefined) {
      throw new Error("useDataContext must be used within a DataProvider");
   }
   return context;
};