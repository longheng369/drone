import { useDataContext } from "../Context";

const Goal : React.FC = () => {
   const {data, isLoading, stopLeftTime, stopRightTime} = useDataContext();
   // const time = new Date().toLocaleTimeString();

   const handleClickLeft = async() => {
      stopLeftTime();
      // console.log(time)
   }

   const handleClickRight = async () => {
      stopRightTime();
   }

   if (isLoading) {
      return (
         <div className="flex flex-col justify-center items-center h-screen">
            <span>Loading</span>
            <span className="loading loading-dots loading-lg"></span>
         </div>
      );
   }
   
   
   if(!data?.is_start_matching) {
      return <div className="flex flex-col h-screen items-center justify-center">Not Start Matching Yet</div>
   }
   return (
      <div className="grid grid-cols-2 gap-4 p-8">
         <button onClick={handleClickLeft} className="bg-red-600 text-center p-10 text-white rounded-md text-3xl">Left</button>
         <button onClick={handleClickRight} className="bg-blue-600 text-center p-10 text-white rounded-md text-3xl">Right</button>
      </div>
   )
}

export default Goal