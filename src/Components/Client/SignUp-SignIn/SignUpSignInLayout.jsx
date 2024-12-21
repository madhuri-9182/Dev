import React from 'react'
import { NavLink,Link, Outlet } from 'react-router-dom'
import SignUp from './SignUp'

function SignUpSignInLayout() {
  return (
    <div className='h-screen w-full' >
        

      <div className='w-full h-full flex bg-gradient-to-b from-[#0575E6] via-[#02298A] to-[#021B79] ' >
         <div className='w-[44%] h-full  ' >
              <div className='w-full h-[55%] flex justify-center items-end  ' >
                <div className='font-semibold items-center justify-center  '>
                  <p className='text-[40px] leading-[46.88px] text-[#056DDC] ' >Hiring Dog</p>
                  <p className='text-[36px] leading-[42.19px] text-[#FFFFFF] ' >INTERVIEW PLATFORM</p>
                </div>
              </div>
              <div className='w-full h-[45%]  ' >
                <div className='h-[600px] w-[600px] bg-transparent fixed left-[-15%] top-[55%] rounded-full border-[1px] border-[#056DDC] 
                lg:h-[550px] lg:w-[550px]
                md:h-[500px] md:w-[500px] 
                sm:h-[400px] sm:w-[400px] 
                xs:h-[300px] xs:w-[300px]'>
                </div>
                <div className='h-[600px] w-[600px] bg-transparent fixed left-[-10%] top-[60%] rounded-full border-[1px] border-[#056DDC] 
                lg:h-[550px] lg:w-[550px]
                md:h-[500px] md:w-[500px] 
                sm:h-[400px] sm:w-[400px] 
                xs:h-[300px] xs:w-[300px]'>
                </div>
              </div>
         </div>
         <div className='w-[56%] h-full flex justify-center items-center  ' >

            <div className=' w-[55%] xl:h-[80%] sm:h-[90%] rounded-[35px] midcustom_lgp-4 bg-[#FFFFFF] flex flex-col items-center '>
              <div>
                <div className='p-2 text-[#056DDC] w-[100%] flex items-center justify-center ' >
                  <nav className='RegisterNav flex items-center justify-center font-bold leading-[19.92px] w-full h-[80px] text-[17px] text-center tracking-wide gap-5 '>
                  <div className='flex items-center text-center justify-center'>  
                    <NavLink to="signin/loginmail"
                      className={({ isActive }) => 
                      `${isActive ? "underline underline-offset-8 text-[#056DDC]  " : " border-0 shadow-md rounded-[22px] "} p-2 w-full rounded-lg`} >
                      Sign In </NavLink>
                  </div>
                  {/*  SignUp button is temporarily removed */}
                  {/* <div className='flex items-center text-center justify-center'>  
                    <NavLink to="signup"
                      className={({ isActive }) => 
                      `${isActive ? "underline underline-offset-8 text-[#056DDC] " : " border-0 shadow-md rounded-[22px] "} p-2  w-full rounded-lg `} >
                      Sign Up </NavLink>
                  </div>   */}
                  </nav>
                </div>
              </div>
              <div className=' w-full h-full ' >
                <Outlet/>
              </div>
            </div>

         </div>
      </div>



    </div>
  )
}

export default SignUpSignInLayout
    