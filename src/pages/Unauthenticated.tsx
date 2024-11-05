import { FaRegSadTear } from "react-icons/fa";
const Unauthenticated : React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center gap-3">
      <span className="text-3xl">Unauthenticated !</span>
      <FaRegSadTear className="text-[3rem]"/>

   </div>
  )
}

export default Unauthenticated