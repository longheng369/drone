// import React, { useEffect, useRef, useState } from "react";
// import { useDataContext } from "../Context";
// import Z from "../shapes/Z";

// const ScoreBoard: React.FC = () => {
//     const { formatTime, data } = useDataContext();
//     const [timeLeft, setTimeLeft] = useState<number>(240);
//     const [preparingTime, setPreparingTime] = useState<number>(5);
//     const [left_team_name, set_left_team_name] = useState<string>('');
//     const [right_team_name, set_right_team_name] = useState<string>('');
//     const [start_match, set_start_match] = useState<boolean>(false);
//     const [is_preparing, set_is_preparing] = useState<boolean>(false);
//     let interval = useRef<NodeJS.Timeout | undefined>(undefined);

//     useEffect(() => {
//         // Load team names from localStorage on mount
//         const leftTeamName = localStorage.getItem('left_team_name') || '';
//         const rightTeamName = localStorage.getItem('right_team_name') || '';
        
//         set_left_team_name(leftTeamName);
//         set_right_team_name(rightTeamName);
        
//         const handleStorageChange = (event: StorageEvent) => {
//             if (event.key === 'left_team_name') {
//                 set_left_team_name(event.newValue || '');
//             }
//             if (event.key === 'right_team_name') {
//                 set_right_team_name(event.newValue || '');
//             }
//             if (event.key === 'start_match') {
//                 set_start_match(true);
//             }
//             if (event.key === 'is_preparing') {
//                 set_is_preparing(event.newValue === 'true');
//             }
//         };

//         window.addEventListener('storage', handleStorageChange);
        
//         // Cleanup event listener on component unmount
//         return () => {
//             window.removeEventListener('storage', handleStorageChange);
//         };
//     }, []);

//     useEffect(() => {
//         if (is_preparing) {
//             // Start the interval for preparing time
//             interval.current = setInterval(() => {
//                 setPreparingTime((prev) => {
//                     if (prev <= 0) {
//                         clearInterval(interval.current);
//                         return 0;
//                     }
//                     return prev - 1;
//                 });
//             }, 1000);
//         } else {
//             // Clear the interval if is_preparing changes to false
//             clearInterval(interval.current);
//             setPreparingTime(5);
//         }
        
//         // Cleanup function to clear the interval when the component unmounts
//         return () => {
//             clearInterval(interval.current);
//             setPreparingTime(5);
//         };
//     }, [is_preparing]);

//     return (
//         <div className="h-screen w-screen relative flex flex-col container-scoreboard">
//             <div className="w-full h-full grid grid-cols-[2fr_0.5fr_2fr] text-white">
//                 <div className="relative">
//                     <div className="absolute text-[3.3rem] top-[45.3vh] font-[500] w-[86%] text-end">
//                         <div className="uppercase">{left_team_name ?? ""}</div>
//                     </div>
//                 </div>
//                 <div className="relative">
//                     <div className="text-[6rem] font-[500] absolute bottom-[3rem] text-center left-[50%] translate-x-[-50%]">
//                         {is_preparing ? formatTime(preparingTime) : ""}
//                     </div>
//                 </div>
//                 <div className="relative">
//                     <div className="absolute text-[3.3rem] top-[45.3vh] w-[90%] text-start font-[500] right-0">
//                         <div className="uppercase">{right_team_name ?? ""}</div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ScoreBoard;



const ScoreBoard : React.FC = () => {
  return (
    <div className="grid grid-cols-[1fr_0.3fr_1fr] bg-gray-800 overflow-hidden">

        <div className="flex flex-col h-screen" style={{backgroundImage: "linear-gradient(to right, rgba(165, 28, 45, 0.9) 50%, transparent)"}}>
             {/* <!-- Left Side --> */}
            <div >
                <div className="shape-container flex flex-col w-[80%] h-[25vh] relative float-start">
                    <div className="w-10/12 h-[40%] bg-red-700 skew-x-[-35deg] relative left-[-6%]">
                        <div className="bg-gray-800 absolute skew-x-[-1deg] w-[90%] h-[80%] bottom-0 right-[-23.6%]"></div>
                    </div>
                    <div className="relative bg-[#ff0000] w-[85%] h-[26%] skew-x-[-32deg] left-[-10%]">
                        <div className="bg-red-700 w-[80%] h-[30%] skew-x-[-8deg] absolute left-[-5%]"></div>
                        <div className="bg-red-700 w-[8%] h-[30%] skew-x-[-8deg] absolute left-[85%]"></div>
                    </div>
                    <div className="w-[40%] h-[14%] bg-gray-800 skew-x-[-39deg] absolute left-[-10%] bottom-[20%]"></div>
                    <div className="w-[9%] h-[20.2%] bg-[#ff0000] absolute bottom-0 skew-x-[-50deg] left-[-5%]"></div>
                </div>
            </div>
            <div className="flex-1">
                
            </div>
            <div>heheh</div>
        </div>
   

    <div className="text-white text-center">VS</div>

    <div className="flex flex-col h-screen" style={{backgroundImage: "linear-gradient(to left, rgba(25, 62, 180, 0.9) 50%, transparent)"}}>

    {/* <!-- Right Side (Mirrored) --> */}
    <div >
        <div className="shape-container flex flex-col w-[80%] float-end h-[25vh] relative right-[0]">
            {/* <!-- Mirror the skew and positions --> */}
            <div className="w-10/12 h-[40%] bg-[#0049ab] skew-x-[35deg] relative right-[-22%] ">
                <div className="bg-gray-800 absolute skew-x-[1deg] w-[90%] h-[80%] bottom-0 left-[-22.6%]"></div>
            </div>
            <div className="relative bg-[#006dff] w-[85%] h-[26%] skew-x-[32deg] right-[-22%]">
                <div className="bg-[#0049ab] w-[80%] h-[30%] skew-x-[8deg] absolute right-[-5%]"></div>
                <div className="bg-[#0049ab] w-[8%] h-[30%] skew-x-[8deg] absolute right-[85%]"></div>
            </div>
            <div className="w-[40%] h-[14%] bg-gray-800 skew-x-[39deg] absolute right-[-10%] bottom-[20%]"></div>
            <div className="w-[9%] h-[20.2%] bg-[#006dff] absolute bottom-0 skew-x-[50deg] right-[-5%]"></div>
        </div>
    </div>

    <div className="flex-1 ">

       
    </div>
    <div className="text-white">heheh</div>

    </div>

    
</div>

  )
}

export default ScoreBoard
