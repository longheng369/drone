import React from 'react'

interface CardInterface {
   active?: boolean;
   score: number;
   text: string;
}

const Card : React.FC<CardInterface> = ({active = false,score, text}) => {
  return (
    <div className={`text-white bg-gray-800 flex items-center gap-3 justify-center w-full h-full ${active ? 'bg-green-500' : ""}`}>
      <span>{text}</span> 
      <span>( Score {score} )</span>
    </div>
  )
}

export default Card