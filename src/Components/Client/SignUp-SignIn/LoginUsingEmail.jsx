import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';










const LoginUsingEmail = () =>{
    const [isPasswordVisisble, setIsPasswordVisible] = useState(false);
    const togglePassVisibility = () => {
        setIsPasswordVisible(!isPasswordVisisble);
    };

    
    
    const navigate = useNavigate();
    const handleLGNNavigation = () => {
        navigate('/auth/signin/loginnumber')
        
      };
    const nav = useNavigate();
    const handleFPNavigation = () =>{
        nav('/auth/forgetpass')
    }
    

    const [errorMessage,setErrorMessage]=useState("");
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [loading,setLoading]=useState(false)

// Backend works
        //Check for email and password
        //send the request
        // if response status code is 200. (same the acces token to the local storage or to cookies)
        //redirect user to dashboard section.




        // if response code is other than 200.
        //display the error in the ui to the user.

    const handleLoginViaEmail = async (e) =>{
        e.preventDefault();
        console.log("Helllo");
        console.log(email,password);
        setLoading(true)
        
        try {
            setErrorMessage("")
            const response = await axios.post('http://127.0.0.1:8000/api/login/',{ email,password});
            localStorage.setItem('token', response.data.data.access );
            if (response.status === 200 ) {
                setLoading(false)
                setErrorMessage( "you are logged in")
                navigate('/client/settings')
            }
            console.log(response)
        } catch (error) {
            console.log(error);
            if(error){
                const err=error?.response?.data?.error[0]?.error
                setErrorMessage(err)
                setLoading(false)
                console.log(err);
                
            }
            
            
        }
    }
   
 
  return (
    <div className='w-full h-full mt-[5%] ' >
      <div className=' flex items-center justify-center ' >
        <form onSubmit={handleLoginViaEmail} className=' p-2 w-[80%] h-full ' >
            <div className='flex flex-col w-full h-full mt-1 text-[#222222] text-[12px] font-semibold ' >
                <label className='m-1' >Login using Email</label>
                <input id='email' type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                    className='border-2 rounded-[5px] m-1 w-[100%] h-[46px] text-[16px] ' />
            </div>
            <div className='flex flex-col w-full h-full mt-1 text-[#222222] text-[12px] font-semibold ' >
                <label className='m-1' >Password</label>
                <div className='flex items-center justify-between border-2 rounded-[5px] m-1 w-[100%] h-[46px] ' >
                    <input id='number'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        type={isPasswordVisisble ? "text" : "password" } 
                        className=' w-[100%] h-[43px] text-[14px] tracking-wide  outline-none ' />
                    <button 
                        type='button'
                        className=' mr-1 '
                        onClick={togglePassVisibility}>
                            {isPasswordVisisble ? <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Edit / Hide"> <path id="Vector" d="M3.99989 4L19.9999 20M16.4999 16.7559C15.1473 17.4845 13.6185 17.9999 11.9999 17.9999C8.46924 17.9999 5.36624 15.5478 3.5868 13.7788C3.1171 13.3119 2.88229 13.0784 2.7328 12.6201C2.62619 12.2933 2.62616 11.7066 2.7328 11.3797C2.88233 10.9215 3.11763 10.6875 3.58827 10.2197C4.48515 9.32821 5.71801 8.26359 7.17219 7.42676M19.4999 14.6335C19.8329 14.3405 20.138 14.0523 20.4117 13.7803L20.4146 13.7772C20.8832 13.3114 21.1182 13.0779 21.2674 12.6206C21.374 12.2938 21.3738 11.7068 21.2672 11.38C21.1178 10.9219 20.8827 10.6877 20.4133 10.2211C18.6338 8.45208 15.5305 6 11.9999 6C11.6624 6 11.3288 6.02241 10.9999 6.06448M13.3228 13.5C12.9702 13.8112 12.5071 14 11.9999 14C10.8953 14 9.99989 13.1046 9.99989 12C9.99989 11.4605 10.2135 10.9711 10.5608 10.6113" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                            : 
                            <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9944 15.5C13.9274 15.5 15.4944 13.933 15.4944 12C15.4944 10.067 13.9274 8.5 11.9944 8.5C10.0614 8.5 8.49439 10.067 8.49439 12C8.49439 13.933 10.0614 15.5 11.9944 15.5ZM11.9944 13.4944C11.1691 13.4944 10.5 12.8253 10.5 12C10.5 11.1747 11.1691 10.5056 11.9944 10.5056C12.8197 10.5056 13.4888 11.1747 13.4888 12C13.4888 12.8253 12.8197 13.4944 11.9944 13.4944Z" fill="#0F0F0F"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 5C7.18879 5 3.9167 7.60905 2.1893 9.47978C0.857392 10.9222 0.857393 13.0778 2.1893 14.5202C3.9167 16.391 7.18879 19 12 19C16.8112 19 20.0833 16.391 21.8107 14.5202C23.1426 13.0778 23.1426 10.9222 21.8107 9.47978C20.0833 7.60905 16.8112 5 12 5ZM3.65868 10.8366C5.18832 9.18002 7.9669 7 12 7C16.0331 7 18.8117 9.18002 20.3413 10.8366C20.9657 11.5128 20.9657 12.4872 20.3413 13.1634C18.8117 14.82 16.0331 17 12 17C7.9669 17 5.18832 14.82 3.65868 13.1634C3.03426 12.4872 3.03426 11.5128 3.65868 10.8366Z" fill="#0F0F0F"></path> </g></svg> }
                    </button>
                </div>    
            </div>
            <div className=' flex items-center justify-between ' >
                <div className=' flex items-center p-1 ' >
                    <input type="checkbox" className='w-[15px] h-[15px] font-[1px] text-[#D9CFFB] rounded-[2px] mr-1 ' />
                   <span className='font-[Outfit] font-medium ' >Remeber Me</span>
                </div>
                <div className='flex items-center p-1 font-[Outfit] font-medium text-[#056DDC] ' > 
                    <button type='button' onClick={handleFPNavigation} > Forgot Password? </button> </div>
            </div>
            <h1 className=' text-center font-[Outfit] font-bold text-[20px] text-red-500'>{errorMessage}</h1>
            <div className='w-full h-[46px] flex items-center justify-center  border-0 bg-[#056DDC] rounded-[100px] mt-[5%] ' >
                
                <button 
                type='submit' 
                onClick={(e)=>{handleLoginViaEmail}}
                className='w-full h-[46px] font-[Outfit] font-bold text-[16px] text-[#FFFFFF] tracking-[1%] leading-[auto] ' >
                    Submit
                </button>
            </div>
            <div className='w-full h-[42px] flex items-center justify-center mt-[5%] border-0 shadow-md bg-[#FFFFFF] rounded-[21px] ' >
                <button onClick={handleLGNNavigation} className='w-full h-[42px] font-[Roboto] font-bold text-[17px] text-[#056DDC] tracking-[6%] leading-[auto] ' >
                    Login Using Mobile Number
                </button>
            </div>
            <div className='w-full h-[42px] flex items-center justify-center mt-[5%] border-0 shadow-md bg-[#FFFFFF] rounded-[21px] ' >
                <button className='w-full h-[42px] font-[Roboto] font-bold text-[17px] text-[#056DDC] tracking-[6%] leading-[auto] ' >
                    Login Using SSO
                </button>
            </div>
            
        </form>
      </div>
    </div>
  )
};

export default LoginUsingEmail




