import React, { useState } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom';


const SignUp = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirm_Password] = useState("");
    const [phone, setPhone] = useState("");
    const [errorMessage, setErrorMessage] = useState([])

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        console.log(phone);
        console.log(typeof (errorMessage));


        try {
            setErrorMessage([])
            const response = await axios.post('http://127.0.0.1:8000/api/signup/', { name, email, password, confirm_password, phone })
            console.log(response);
            if (response.status === 201) {
                navigate('/auth/signin/loginmail')
            }

        } catch (error) {
            console.log(error);
            if (error) {
                let err = []
                if (error?.response?.data?.phone) {
                    setErrorMessage(error?.response?.data?.phone)
                } else if (error.response.data.email) {
                    setErrorMessage(error.response.data.email);
                }
                else if (error.response.data.non_field_errors) {
                    setErrorMessage(error.response.data.non_field_errors);
                } else {
                    setErrorMessage(error.response.data.error);

                }
            }
        }
    }

    return (
        <div className='w-full h-full   ' >
            <div className=' flex items-center justify-center ' >
                <form className=' p-2 w-[80%] h-full ' onSubmit={handleSignUp} >
                    <div className='flex flex-col w-full h-full  text-[#222222] text-[12px] font-semibold ' >
                        <label className='m-1' >Name</label>
                        <input id='name' type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value) }}
                            required
                            className='border-2 rounded-[5px] m-1 w-[100%] h-[39px] text-[16px] ' />
                    </div>
                    <div className='flex flex-col w-full h-full  text-[#222222] text-[12px] font-semibold ' >
                        <label className='m-1' >Mobile Number</label>
                        <input id='number' type="text"
                            value={phone}
                            onChange={(e) => { setPhone(e.target.value) }}
                            required
                            className='border-2 rounded-[5px] m-1 w-[100%] h-[39px] text-[16px] ' />
                    </div>
                    <div className='flex flex-col w-full h-full  text-[#222222] text-[12px] font-semibold ' >
                        <label className='m-1' >Email</label>
                        <input id='email' type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                            required
                            className='border-2 rounded-[5px] m-1 w-[100%] h-[39px] text-[16px] ' />
                    </div>
                    <div className='flex flex-col w-full h-full  text-[#222222] text-[12px] font-semibold ' >
                        <label className='m-1' >Password</label>
                        <input id='password' type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            required
                            className='border-2 rounded-[5px] m-1 w-[100%] h-[39px] text-[16px] ' />
                    </div>
                    <div className='flex flex-col w-full h-full  text-[#222222] text-[12px] font-semibold ' >
                        <label className='m-1' >Confirm Password</label>
                        <input id='password_confirmation' type="password"
                            value={confirm_password}
                            onChange={(e) => { setConfirm_Password(e.target.value) }}
                            required
                            className='border-2 rounded-[5px] m-1 w-[100%] h-[39px] text-[16px] ' />
                    </div>
                    <div className="flex flex-grow" >
                        {errorMessage.length > 0 && (
                            <ul className="text-center text-red-500">
                                {errorMessage.map((message, index) => (
                                    <li key={index}>{message}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className='w-full h-[46px] flex items-center justify-center mt-[8%] border-0 bg-[#056DDC] rounded-[100px] ' >
                        <button type='submit'

                            className=' w-full h-[46px] font-[Outfit] font-bold text-[16px] text-[#FFFFFF] tracking-[1%] leading-[auto] ' >
                            Submit
                        </button>
                    </div>


                </form>
            </div>
        </div>
    )
}

export default SignUp
