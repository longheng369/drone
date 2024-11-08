import { useDataContext } from "../Context";
import { decodeToken } from "../tokenUtils";
import sound from "../assets/mixkit-select-click-1109.wav";
import sound1 from "../assets/mixkit-negative-tone-interface-tap-2569.wav";
import { LuGoal } from "react-icons/lu";

const VolunteerBlue: React.FC = () => {
  const { data, isLoading, appendScoresBlue, deleteScoreBlue, appendData } = useDataContext();

  // const blueScores = [
  //    { obstacle: '1', score: 3, round: 1 },
  //    { obstacle: '2', score: 3, round: 1 },
  //    { obstacle: '1', score: 3, round: 2 },
  //    { obstacle: '2', score: 3, round: 2 },
  // ];

  const playAudio = () => {
    const audio = new Audio(sound);
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  };

  const playAudio1 = () => {
    const audio = new Audio(sound1);
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  };

  const isActive = (
    mission: { obstacle: string; score: number },
    round: number
  ) => {
    return (data?.scores_blue ?? []).some(
      (score: any) =>
        score.obstacle === mission.obstacle &&
        score.score === mission.score &&
        score.round === round
    );
  };

  const handleButtonClick = async (
    mission: { obstacle: string; score: number; active_comparison: string },
    round: number,
    active_comparison: string
  ) => {
    if (
      (data?.scores_blue ?? []).some(
        (score: any) =>
          score.obstacle === mission.obstacle &&
          score.score === mission.score &&
          score.round === round
      )
    ) {
      playAudio1();
      deleteScoreBlue(mission.active_comparison, round);
    } else {
      playAudio();
      appendScoresBlue({
        obstacle: mission.obstacle,
        score: mission.score,
        round,
        active_comparison,
      });
    }
  };

  const getMissions = (option: string) => {
    switch (option) {
      case "1":
        return {
          round1: [
            { obstacle: "1", score: 3, active_comparison: "obstacle 1 blue" },
            { obstacle: "2", score: 3, active_comparison: "obstacle 2 blue" },
            { obstacle: "3", score: 3, active_comparison: "obstacle 3 blue" },
          ],
          round2: [
            { obstacle: "1", score: 3, active_comparison: "obstacle 1 blue" },
            { obstacle: "2", score: 3, active_comparison: "obstacle 2 blue" },
            { obstacle: "3", score: 3, active_comparison: "obstacle 3 blue" },
          ],
        };
      case "2":
        return {
          round1: [
            { obstacle: "4", score: 8, active_comparison: "obstacle 4 blue" },
            { obstacle: "5", score: 6, active_comparison: "obstacle 5 blue" },
          ],
          round2: [
            { obstacle: "4", score: 8, active_comparison: "obstacle 4 blue" },
            { obstacle: "5", score: 6, active_comparison: "obstacle 5 blue" },
          ],
        };
      case "3":
        return {
          round1: [
            { obstacle: "6", score: 6, active_comparison: "obstacle 6 blue" },
          ],
          round2: [
            { obstacle: "6", score: 6, active_comparison: "obstacle 6 blue" },
          ],
        };
      case "4":
        return {
          round1: [
            { obstacle: "7", score: 10, active_comparison: "obstacle 7 blue" },
            { obstacle: "8", score: 2, active_comparison: "obstacle 8 blue" },
          ],
          round2: [
            { obstacle: "7", score: 10, active_comparison: "obstacle 7 blue" },
            { obstacle: "8", score: 2, active_comparison: "obstacle 8 blue" },
          ],
        };
      default:
          return {round1: [], round2: []};
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

  if(!data?.is_start_matching && !data?.to_submit) {
     return <div className="flex flex-col h-screen items-center justify-center bg-gray-800" >
        <div className="h-full font-anton uppercase flex-col tracking-wide w-full text-white flex justify-center items-center text-3xl" style={{background: "radial-gradient(circle, rgba(29, 78, 216, 1), rgba(31, 41, 55, 0.5))"}}>
          <div>Pair {token.pairingPoint}</div>
          <div>Matching Not Start Yet</div>
        </div>
     </div>
  }

  return (
    <div className="flex flex-col">
      {data?.to_submit ? (
        <div className="flex flex-col justify-center items-center h-screen text-2xl bg-gray-800">
          <div
            className="h-full w-full text-white flex justify-center items-center text-3xl font-anton tracking-wide uppercase"
            style={{background: "radial-gradient(circle, rgba(29, 78, 216, 1), rgba(31, 41, 55, 0.5))"}}
          >
            The match is done
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
    
          <h1 className="font-anton uppercase text-center mt-4 text-2xl text-blue-600">
            Volunteer Red Pair Point {token.pairingPoint}
          </h1>
          <div className="flex items-center mt-2">
            <div className="w-full h-[1px] bg-gray-300"></div>
            <h2 className="text-nowrap px-3 text-2xl font-anton uppercase">
              Round 1
            </h2>
            <div className="w-full h-[1px] bg-gray-300"></div>
          </div>

          <div className="flex flex-col gap-4 px-4 mt-4">
            {missions.round1.map((mission, index) => (
              <button
                key={`round1-${index}`}
                onClick={() =>
                  handleButtonClick(mission, 1, mission.active_comparison!)
                }
                className={`w-full h-[8vh] grid grid-cols-3 font-anton bg-blue-600 text-white rounded-xl px-3 py-1 uppercase leading-9 ${
                  isActive(mission, 1) ? "active" : ""
                }`}
              >
                <div className="flex flex-col h-full justify-start items-start">Obstacle</div>
                <h1 className="text-[2rem] h-full font-bold italic flex justify-center items-center">
                  {mission.obstacle}
                </h1>
                <span className="text-lg flex h-full justify-end items-end">{mission.score} Score</span>
              </button>
            ))}
          </div>

          <div className="flex items-center mt-4">
            <div className="w-full h-[1px] bg-gray-300"></div>
            <h2 className="text-nowrap px-3 text-2xl font-anton uppercase">
              Round 2
            </h2>
            <div className="w-full h-[1px] bg-gray-300"></div>
          </div>

          <div className="flex flex-col gap-4 px-4 mt-4">
            {missions.round2.map((mission, index) => (
              <button
                key={`round2-${index}`}
                onClick={() =>
                  handleButtonClick(mission, 2, mission.active_comparison!)
                }
                className={`w-full h-[8vh] grid grid-cols-3 font-anton bg-blue-600 text-white rounded-xl px-3 py-1 uppercase leading-9 ${
                  isActive(mission, 2) ? "active" : ""
                }`}
              >
                <div className="flex flex-col justify-start items-start">Obstacle</div>
                <h1 className="text-[2rem] h-full font-bold italic flex justify-center items-center">
                  {mission.obstacle}
                </h1>
                <span className="text-lg flex h-full justify-end items-end">{mission.score} Score</span>
              </button>
            ))}
            {token.pairingPoint === '2' ? <button onClick={() => {appendData({is_right_time_stop: true})}} className={`${data?.is_right_time_stop ? "bg-green-600" : "bg-blue-600"} w-full mt-10 flex items-center gap-2 justify-center text-[1.75rem] font-anton uppercase text-white rounded-xl py-4 leading-9`}>Final <LuGoal/></button> : ""}
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerBlue;
