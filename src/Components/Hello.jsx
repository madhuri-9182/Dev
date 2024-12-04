import React from 'react'
import { useNavigate } from 'react-router-dom'

function Hello() {

  const navigate = useNavigate();
// Hello
    const naviToAuth = () =>{
      navigate('/auth/signup')
    }
    const naviToClient =() =>{
      
      
          navigate('/client/dashboard');
    }
    const naviToInternal =() =>{
      
      
          navigate('/internal/dashboard');
    }
    const naviToAgency =() =>{
      
      
          navigate('/agency/dashboard');
    }
    const naviToInterviewer =() =>{
      
      
          navigate('/interviewer/dashboard');
    }

  return (
    <div className=' w-screen h-screen flex flex-col justify-center items-center' >
      <h1 className='text-6xl mb-10 flex items-center justify-center'>Hello From Hiring Dog</h1>
      <div className='flex gap-4 ' >
        <button onClick={naviToAuth} className={` w-[200px] h-[50px] bg-green-600  text-[24px] text-white font-bold border border-green-800 rounded-3xl shadow-2xl
          transition ease-in-out duration-300  hover:scale-105 hover:bg-green-700  `}>
          Authentication
        </button>
        <button onClick={naviToClient} className={` w-[200px] h-[50px] bg-blue-600  text-[24px] text-white font-bold border border-blue-800 rounded-3xl shadow-2xl
          transition ease-in-out duration-300  hover:scale-105 hover:bg-blue-700  `}>
          Client 
        </button>
        <button onClick={naviToInternal} className={` w-[200px] h-[50px] bg-blue-600  text-[24px] text-white font-bold border border-blue-800 rounded-3xl shadow-2xl
          transition ease-in-out duration-300  hover:scale-105 hover:bg-blue-700  `}>
          Internal 
        </button>
        <button onClick={naviToAgency} className={` w-[200px] h-[50px] bg-blue-600  text-[24px] text-white font-bold border border-blue-800 rounded-3xl shadow-2xl
          transition ease-in-out duration-300  hover:scale-105 hover:bg-blue-700  `}>
          Agency 
        </button>
        <button onClick={naviToInterviewer} className={` w-[200px] h-[50px] bg-blue-600  text-[24px] text-white font-bold border border-blue-800 rounded-3xl shadow-2xl
          transition ease-in-out duration-300  hover:scale-105 hover:bg-blue-700  `}>
          Interviewer 
        </button>
        
      </div>
    </div>
  )
}

export default Hello
