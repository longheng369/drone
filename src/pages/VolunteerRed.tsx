import { useEffect, useState } from "react";
import { useDataContext } from "../Context";
import { decodeToken } from "../tokenUtils";


const VolunteerRed: React.FC = () => {
const [activeButtons, setActiveButtons] = useState<{ id: number; color: string; round: number }[]>([]);

const { data, isLoading, appendScoresRed } = useDataContext();


   useEffect(() => {

      if(data?.is_start_matching === false){
         setActiveButtons([]);
      }

   }, [data?.is_start_preparing, data?.is_start_matching,]);



// const redScores = [
//    { obstacle: '1', score: 3, round: 1 },
//    { obstacle: '2', score: 3, round: 1 },
//    { obstacle: '1', score: 3, round: 2 },
//    { obstacle: '2', score: 3, round: 2 },
// ];

const isActive = (mission: { obstacle: string; score: number }, round: number) => {
   return (data?.scores_red ?? []).some(
      (score : any) => score.obstacle === mission.obstacle && score.score === mission.score && score.round === round
   );
};


const handleButtonClick = async (buttonId: number, mission: { obstacle: string; score: number }, color: string, round: number, active_comparison: string) => {
   if (activeButtons.some((btn) => btn.id === buttonId && btn.color === color && btn.round === round)) return;

   setActiveButtons((prev) => [...prev, { id: buttonId, color, round }]);
   appendScoresRed({ obstacle: mission.obstacle, score: mission.score, round, active_comparison });
};

// console.log(activeButtons.length === 4)


const getMissions = (option: string) => {
   switch (option) {
      case "1":
      return [
         { obstacle: "1", score: 3, active_comparison: 'obstacle 1 red' },
         { obstacle: "3", score: 3, active_comparison: 'obstacle 3 red' },
         { obstacle: "1", score: 3, active_comparison: 'obstacle 1 red' },
         { obstacle: "3", score: 3, active_comparison: 'obstacle 3 red' }
      ];
      case "2":
      return [
         { obstacle: "2", score: 3, active_comparison: 'obstacle 2 red' },
         { obstacle: "4", score: 8, active_comparison: 'obstacle 4 red' },
         { obstacle: "2", score: 3, active_comparison: 'obstacle 2 red' },
         { obstacle: "4", score: 8, active_comparison: 'obstacle 4 red' }
      ];
      case "3":
      return [
         { obstacle: "5", score: 6, active_comparison: 'obstacle 5 red' },
         { obstacle: "6", score: 6, active_comparison: 'obstacle 6 red' },
         { obstacle: "5", score: 6, active_comparison: 'obstacle 5 red' },
         { obstacle: "6", score: 6, active_comparison: 'obstacle 6 red' }
      ];
      case "4":
      return [
         { obstacle: "7", score: 10, active_comparison: 'obstacle 7 red' },
         { obstacle: "8", score: 2, active_comparison: 'obstacle 8 red' },
         { obstacle: "7", score: 10, active_comparison: 'obstacle 7 red' },
         { obstacle: "8", score: 2, active_comparison: 'obstacle 8 red' }
      ];
      default:
      return [];
   }
};

const token = decodeToken(localStorage.getItem("token")!);
const missions = getMissions(token.pairingPoint!);

if (isLoading) {
   return (
      <div className="flex flex-col justify-center items-center h-screen">
         <span>Loading</span>
         <span className="loading loading-dots loading-lg"></span>
      </div>
   );
}


if(!data?.is_start_matching) {
   return <div className="flex flex-col h-screen items-center justify-center bg-gray-800" >
      <div className="h-full w-full text-white flex justify-center items-center text-3xl" style={{background: "radial-gradient(circle, #EF4444, rgba(31, 41, 55, 0.5))"}}>
         Not Start Matching Yet
      </div>
   </div>
}

return (
   <div className="flex flex-col">

      {data?.to_submit ? <div className="flex flex-col justify-center items-center h-screen text-2xl">The match is done</div> :

      <div>
         {activeButtons.length === 4 ? 
         <div className="h-screen flex flex-col justify-center items-center">
            <div className="text-green-500 font-[500] text-3xl italic">Done!</div>
            {/* <button onClick={() => location.reload()} className="flex flex-col items-center mt-10 hover:bg-gray-200 p-3 px-5 rounded-lg">
               <MdRefresh className="text-[3rem] text-gray-500" />
               <span>Refresh</span>
            </button> */}
         </div> : ""}

         <div className="p-8 pt-2">
            <div className="flex items-center gap-3 mt-6">
               <span className="text-gray-500 text-lg">Round 1</span>
               <div className="flex-1 h-[1px] bg-gray-300"></div>
            </div>

            <div className="flex gap-4 mt-3">
               {missions.slice(0, 2).map((mission, index) => (
                  <button
                  key={`round1-${index}`}
                  onClick={() => handleButtonClick(index, mission, "red", 1, mission.active_comparison!)}
                  className={`w-full flex flex-col items-center justify-center bg-red-600 text-white rounded-xl p-2 leading-9 gap-1 ${isActive(mission, 1) ? "active" : ""}`}
                  >
                  <span className="text-lg">Obstacle</span>
                  <h1 className="text-[2.5rem] font-bold italic">{mission.obstacle}</h1>
                  <span className="text-lg">{mission.score} Score</span>
                  </button>
               ))}
            </div>

            <div className="flex items-center gap-3 mt-4">
               <span className="text-gray-500 text-lg">Round 2</span>
               <div className="flex-1 h-[1px] bg-gray-300"></div>
            </div>

            <div className="flex gap-4 mt-3">
               {missions.slice(2, 4).map((mission, index) => (
                  <button
                  key={`round2-${index}`}
                  onClick={() => handleButtonClick(index + 2, mission, "red", 2, mission.active_comparison!)}
                  className={`w-full flex flex-col items-center justify-center bg-red-600 text-white rounded-xl p-2 leading-9 gap-1 ${isActive(mission, 2) ? "active" : ""}`}
                  >
                  <span className="text-lg">Obstacle</span>
                  <h1 className="text-[2.5rem] font-bold italic">{mission.obstacle}</h1>
                  <span className="text-lg">{mission.score} Score</span>
                  </button>
               ))}
            </div>

          </div>
      </div>
      }

   </div>
);
};

export default VolunteerRed;
