import React from 'react'

function SignIn() {
  return (
    <div className='w-full h-full mt-[10%] ' >
      <div className=' flex items-center justify-center ' >
        <form className=' p-2 w-[80%] h-full ' >
            <div className='flex flex-col w-full h-full mt-1 text-[#222222] text-[12px] font-semibold ' >
                <label className='m-1' >Login using Email</label>
                <input id='email' type="email" 
                    className='border-2 rounded-[5px] m-1 w-[100%] h-[46px] text-[16px] ' />
            </div>
            <div className='flex flex-col w-full h-full mt-1 text-[#222222] text-[12px] font-semibold ' >
                <label className='m-1' >Login using Mobile Number</label>
                <input id='number' type="number" 
                    className='border-2 rounded-[5px] m-1 w-[100%] h-[46px] ' />
            </div>
            <div className='w-full h-[46px] flex items-center justify-center mt-2 border-0 bg-[#056DDC] rounded-[100px] ' >
                <button className='font-[Outfit] font-bold text-[16px] text-[#FFFFFF] tracking-[1%] leading-[auto] ' >
                    Submit
                </button>
            </div>
            <div className='w-full h-[42px] flex items-center justify-center mt-[15%] border-0 shadow-md bg-[#FFFFFF] rounded-[21px] ' >
                <button className='font-[Roboto] font-bold text-[17px] text-[#056DDC] tracking-[6%] leading-[auto] ' >
                    Login Using SSO
                </button>
            </div>
            
        </form>
      </div>
    </div>
  )
}

export default SignIn
