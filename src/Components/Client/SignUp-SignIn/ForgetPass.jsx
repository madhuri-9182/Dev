import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'




function ForgetPass() {
  return (
    <div className='h-screen w-full' >
        <div className='flex h-screen w-full bg-gradient-to-b from-[#0575E6] via-[#02298A] to-[#021B79] items-center justify-around'>
            <div className='flex flex-col ' >
              <div className='font-[Roboto] font-semibold items-center justify-center '>
                <p className='text-[40px] leading-[46.88px] text-[#056DDC] ' >Hiring dog</p>
                <p className='text-[36px] leading-[42.19px] text-[#FFFFFF] ' >INTERVIEW PLATFORM</p>
              </div>
            </div>  
            <div className=' w-[485px] h-[599px] rounded-[35px] p-4 bg-[#FFFFFF] flex flex-col items-center '>
              <div>
                <div className='p-2 text-[#056DDC] w-[100%] flex items-start justify-center  ' >
                  <nav className='RegisterNav flex items-center justify-center font-[Roboto] font-bold leading-[19.92px] w-full h-[80px] text-[17px] text-center tracking-wide gap-5'>
                  <div className='flex items-center text-center justify-center'>  
                    <NavLink to="#"
                      className={({ isActive }) => 
                      `${isActive ? "underline decoration-[#056DDC] decoration-[3px] underline-offset-8 text-[#056DDC]   " : " border-0 shadow-md rounded-[22px] "} p-2 w-full rounded-lg`} >
                      Forget Password </NavLink>
                      
                  </div>  
                  </nav>
                </div>
              </div>
              <div className=' w-full h-full ' >
              <div className='w-full h-full mt-[10%] ' >
      <div className=' flex items-center justify-center ' >
        <form className=' p-2 w-[80%] h-full ' >
            <div className='flex flex-col w-full h-full mt-1 text-[#222222]  font-medium font-[Outfit] ' >
               <p className='ml-[3%] mb-[6%]' >Please enter your registered E-mail Id</p>
            </div>
            <div className='flex flex-col w-full h-full mt-1 text-[#222222]  font-medium ' >
                <label className='m-1 font-[Outfit]' >E-Mail Id :</label>
                <input id='email' type="email" 
                    className='border-2 rounded-[5px] m-1 w-[100%] h-[46px] ' />
            </div>
            <div className='w-full h-[46px] flex items-center justify-center mt-[8%] border-0 bg-[#056DDC] rounded-[100px] ' >
                <button  className='font-[Outfit] font-bold text-[16px] text-[#FFFFFF] tracking-[1%] leading-[auto] ' >
                    Submit
                </button>
            </div>
            
            
        </form>
      </div>
    </div>
              </div>
            </div>
            <div className='h-[600px] w-[600px] bg-transparent fixed left-[-15%] top-[55%] rounded-full  border-[1px] border-[#056DDC] '></div>
            <div className='h-[600px] w-[600px]  fixed left-[-10%] top-[60%]  rounded-full  border-[1px] border-[#056DDC] '></div>
        </div>
    </div>
  )
}

export default ForgetPass
