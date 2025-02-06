import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const LoginUsingNumber =() => {
    
    const[mobileNumber, setMobileNumber] = useState('');
    const[otp, setOtp] = useState(['', '', '', '']);

    const handleMobileNumberChange = (e) =>{
        setMobileNumber(e.target.value);
    }

    const handleOtpChange = (e, index) => {
        const newOtp = [...otp];
        newOtp[index] = e.target.value;
        setOtp(newOtp);

    if (e.target.value.length === 1 && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
        }
    }

    const HandleSubmit = (e) =>{
        e.preventDefault();
        const otpValue = otp.join('');
    }

    const navigate = useNavigate();
    const handleNavigate = () =>{
        navigate('/auth/signin/loginmail');
    }


  return (
    <div className='w-full h-full mt-[5%] ' >
      <div className=' flex items-center justify-center ' >
        <form className=' p-2 w-[80%] h-full font-[Outfit] font-medium ' >
            <div className='flex flex-col w-full h-full mt-1 text-[#222222] text-[12px] font-semibold ' >
                <label className='m-1' >Enter Mobile Number</label>
                <input id='number' type="number" value={mobileNumber} onChange={handleMobileNumberChange}
                    className='border-2 rounded-[5px] m-1 w-[100%] h-[46px] text-[18px] tracking-wide ' />
            </div>
            <div className='flex items-center justify-end p-1 font-[Outfit] font-medium text-[#056DDC] ' > <button> Send OTP </button> </div>
            <div className='flex flex-col w-full h-full mt-1 text-[#222222] text-[12px] font-semibold ' >
                <label className='m-1' >Enter OTP</label>
                <div className='flex space-x-2 text-[18px] ' >
                {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  className="p-1 border-2 rounded-[5px] w-[52px] h-[46px] "
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                />
              ))}
                </div>
            </div>
            <div className='w-full h-[46px] flex items-center justify-center mt-[10%] border-0 bg-[#056DDC] rounded-[100px] ' >
                <button type='submit' className='font-[Outfit] font-bold text-[16px] text-[#FFFFFF] tracking-[1%] leading-[auto] ' >
                    Submit
                </button>
            </div>
            <div className='w-full h-[42px] flex items-center justify-center mt-[5%] border-0 shadow-md bg-[#FFFFFF] rounded-[21px] ' >
                <button onClick={handleNavigate} className=' font-bold text-[17px] text-[#056DDC] tracking-[6%] leading-[auto] ' >
                    Login Using Email
                </button>
            </div>
            <div className='w-full h-[42px] flex items-center justify-center mt-[5%] border-0 shadow-md bg-[#FFFFFF] rounded-[21px] ' >
                <button className=' font-bold text-[17px] text-[#056DDC] tracking-[6%] leading-[auto] ' >
                    Login Using SSO
                </button>
            </div>
            
        </form>
      </div>
    </div>
  )
}

export default LoginUsingNumber

