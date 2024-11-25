import React,{useState} from 'react'
import '../../../App.css'


const  PasswordReset = ()=> {
    const [isPasswordVisisbleNewPass, setIsPasswordVisibleNewPass] = useState(false);
    const [isPasswordVisisbleCnfPass, setIsPasswordVisibleCnfPass] = useState(false);
    const toggleNewPassVisibility = () => {
        setIsPasswordVisibleNewPass(!isPasswordVisisbleNewPass);
    };
    const toggleCnfPassVisibility = () => {
        setIsPasswordVisibleCnfPass(!isPasswordVisisbleCnfPass);
    };
    
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [isMatch, setIsMatch] = useState(false);
    const [criteria,setCriteria] = useState({
      length:false,
      uppercase:false,
      number:false,
      specialChar:false,
    });

    const handlePasswordChange = (e) => {
      const value = e.target.value;
      setPassword(e.target.value);
      setIsMatch( e.target.value !== '' && e.target.value === confirmPassword  );
      setCriteria({
        length:value.length >= 8 && value.length <=20,
        uppercase:/[A-Z]/.test(value),
        number:/\d/.test(value),
        specialChar:/[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    };
    const handleConfirmPasswordChange = (e) => {
      setConfirmPassword(e.target.value)
      setIsMatch( e.target.value !== '' && e.target.value === password )
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
    }

    

  return (
    <div className='flex w-full h-full  ' >
         <div className='parent flex justify-center items-center w-[100%]   '>
            <form className=' flex flex-col justify-center gap-[5%] w-[85%] h-[100%] ' >
                <div className='entry w-full ' >
                    <div className='w-full font-[Outfit] font-medium text-[#222222] ' >
                      <label for="NewPassword">New Password</label>
                      <div className='flex items-center justify-between border-2 rounded-[5px] m-1 w-[100%] h-[46px] ' >
                        <input type={isPasswordVisisbleNewPass ? "text" : "password" } id='newPassword' value={password} onChange={handlePasswordChange}  
                        className=' w-[100%] h-[43px] text-[15px] tracking-wider  outline-none ' />
                        <button 
                             type='button'
                             className=' mr-1 '
                             onClick={toggleNewPassVisibility}>
                                {isPasswordVisisbleNewPass ? <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Edit / Hide"> <path id="Vector" d="M3.99989 4L19.9999 20M16.4999 16.7559C15.1473 17.4845 13.6185 17.9999 11.9999 17.9999C8.46924 17.9999 5.36624 15.5478 3.5868 13.7788C3.1171 13.3119 2.88229 13.0784 2.7328 12.6201C2.62619 12.2933 2.62616 11.7066 2.7328 11.3797C2.88233 10.9215 3.11763 10.6875 3.58827 10.2197C4.48515 9.32821 5.71801 8.26359 7.17219 7.42676M19.4999 14.6335C19.8329 14.3405 20.138 14.0523 20.4117 13.7803L20.4146 13.7772C20.8832 13.3114 21.1182 13.0779 21.2674 12.6206C21.374 12.2938 21.3738 11.7068 21.2672 11.38C21.1178 10.9219 20.8827 10.6877 20.4133 10.2211C18.6338 8.45208 15.5305 6 11.9999 6C11.6624 6 11.3288 6.02241 10.9999 6.06448M13.3228 13.5C12.9702 13.8112 12.5071 14 11.9999 14C10.8953 14 9.99989 13.1046 9.99989 12C9.99989 11.4605 10.2135 10.9711 10.5608 10.6113" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                                : 
                                <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9944 15.5C13.9274 15.5 15.4944 13.933 15.4944 12C15.4944 10.067 13.9274 8.5 11.9944 8.5C10.0614 8.5 8.49439 10.067 8.49439 12C8.49439 13.933 10.0614 15.5 11.9944 15.5ZM11.9944 13.4944C11.1691 13.4944 10.5 12.8253 10.5 12C10.5 11.1747 11.1691 10.5056 11.9944 10.5056C12.8197 10.5056 13.4888 11.1747 13.4888 12C13.4888 12.8253 12.8197 13.4944 11.9944 13.4944Z" fill="#0F0F0F"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 5C7.18879 5 3.9167 7.60905 2.1893 9.47978C0.857392 10.9222 0.857393 13.0778 2.1893 14.5202C3.9167 16.391 7.18879 19 12 19C16.8112 19 20.0833 16.391 21.8107 14.5202C23.1426 13.0778 23.1426 10.9222 21.8107 9.47978C20.0833 7.60905 16.8112 5 12 5ZM3.65868 10.8366C5.18832 9.18002 7.9669 7 12 7C16.0331 7 18.8117 9.18002 20.3413 10.8366C20.9657 11.5128 20.9657 12.4872 20.3413 13.1634C18.8117 14.82 16.0331 17 12 17C7.9669 17 5.18832 14.82 3.65868 13.1634C3.03426 12.4872 3.03426 11.5128 3.65868 10.8366Z" fill="#0F0F0F"></path> </g></svg> }
                        </button>
                        <span className=' mr-1 '>
                                {isMatch && ( <svg width="28px" height="28px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#2ECC71" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.096"></g><g id="SVGRepo_iconCarrier"> <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="#2ECC71"></path> </g></svg>
                                )}
                        </span>
                        
                      </div> 
                    </div> 
                    <div className='w-full font-[Outfit] font-medium text-[#222222] ' >
                      <label for="NewPassword">Confirm Password</label>
                      <div className='flex items-center justify-between border-2 rounded-[5px] m-1 w-[100%] h-[46px] ' >
                        <input id='confirmPassword' value={confirmPassword} onChange={handleConfirmPasswordChange} type={isPasswordVisisbleCnfPass ? "text" : "password" } 
                        className=' w-[100%] h-[43px] text-[15px] tracking-wider  outline-none ' />
                        <button 
                             type='button'
                             className=' mr-1 '
                             onClick={toggleCnfPassVisibility}>
                                {isPasswordVisisbleCnfPass ? <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Edit / Hide"> <path id="Vector" d="M3.99989 4L19.9999 20M16.4999 16.7559C15.1473 17.4845 13.6185 17.9999 11.9999 17.9999C8.46924 17.9999 5.36624 15.5478 3.5868 13.7788C3.1171 13.3119 2.88229 13.0784 2.7328 12.6201C2.62619 12.2933 2.62616 11.7066 2.7328 11.3797C2.88233 10.9215 3.11763 10.6875 3.58827 10.2197C4.48515 9.32821 5.71801 8.26359 7.17219 7.42676M19.4999 14.6335C19.8329 14.3405 20.138 14.0523 20.4117 13.7803L20.4146 13.7772C20.8832 13.3114 21.1182 13.0779 21.2674 12.6206C21.374 12.2938 21.3738 11.7068 21.2672 11.38C21.1178 10.9219 20.8827 10.6877 20.4133 10.2211C18.6338 8.45208 15.5305 6 11.9999 6C11.6624 6 11.3288 6.02241 10.9999 6.06448M13.3228 13.5C12.9702 13.8112 12.5071 14 11.9999 14C10.8953 14 9.99989 13.1046 9.99989 12C9.99989 11.4605 10.2135 10.9711 10.5608 10.6113" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                                : 
                                <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9944 15.5C13.9274 15.5 15.4944 13.933 15.4944 12C15.4944 10.067 13.9274 8.5 11.9944 8.5C10.0614 8.5 8.49439 10.067 8.49439 12C8.49439 13.933 10.0614 15.5 11.9944 15.5ZM11.9944 13.4944C11.1691 13.4944 10.5 12.8253 10.5 12C10.5 11.1747 11.1691 10.5056 11.9944 10.5056C12.8197 10.5056 13.4888 11.1747 13.4888 12C13.4888 12.8253 12.8197 13.4944 11.9944 13.4944Z" fill="#0F0F0F"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 5C7.18879 5 3.9167 7.60905 2.1893 9.47978C0.857392 10.9222 0.857393 13.0778 2.1893 14.5202C3.9167 16.391 7.18879 19 12 19C16.8112 19 20.0833 16.391 21.8107 14.5202C23.1426 13.0778 23.1426 10.9222 21.8107 9.47978C20.0833 7.60905 16.8112 5 12 5ZM3.65868 10.8366C5.18832 9.18002 7.9669 7 12 7C16.0331 7 18.8117 9.18002 20.3413 10.8366C20.9657 11.5128 20.9657 12.4872 20.3413 13.1634C18.8117 14.82 16.0331 17 12 17C7.9669 17 5.18832 14.82 3.65868 13.1634C3.03426 12.4872 3.03426 11.5128 3.65868 10.8366Z" fill="#0F0F0F"></path> </g></svg> }
                        </button>
                        <span className=' mr-1 '>
                                {isMatch && ( <svg width="28px" height="28px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#2ECC71" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.096"></g><g id="SVGRepo_iconCarrier"> <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="#2ECC71"></path> </g></svg>
                                )}
                        </span>
                      </div> 
                    </div>   
                </div>
                <div className='strongSuggestion  ' >
                  <p className="text-gray-700 text-[Roboto] ">Your password must contain:</p>
                   <ul className="list-disc pl-5 text-[Roboto] ">
            <li className={`flex items-center ${criteria.length ? 'text-[#989DA3] font-semibold' : 'text-[#989DA3] font-semibold'}`}>
              <input type="checkbox" checked={criteria.length} readOnly className="mr-2 accent-green-500  " />
              Between 8 and 20 characters
            </li>
            <li className={`flex items-center ${criteria.uppercase ? 'text-[#989DA3] font-semibold' : 'text-[#989DA3] font-semibold'}`}>
              <input type="checkbox" checked={criteria.uppercase} readOnly className="mr-2 accent-green-500 " />
              1 upper case letter
            </li>
            <li className={`flex items-center ${criteria.number ? 'text-[#989DA3] font-semibold' : 'text-[#989DA3] font-semibold'}`}>
              <input type="checkbox" checked={criteria.number} readOnly className="mr-2 accent-green-500 text-white  " />
              1 or more numbers
            </li>
            <li className={`flex items-center ${criteria.specialChar ? 'text-[#989DA3] font-semibold' : 'text-[#989DA3] font-semibold'}`}>
              <input type="checkbox"  checked={criteria.specialChar} readOnly className="mr-2 accent-green-500 " />
              1 or more special characters
            </li>
                    </ul>
                </div>
                <div className='w-full h-[46px] flex items-center justify-center mt-2 border-0 bg-[#056DDC] rounded-[100px] ' >
                <button className='font-[Outfit] font-bold text-[16px] text-[#FFFFFF] tracking-[1%] leading-[auto] '
                disabled={
                  !criteria.length ||
                  !criteria.uppercase ||
                  !criteria.number ||
                  !criteria.specialChar ||
                  password != confirmPassword 
                }  >
                    Submit
                </button>
            </div>
            </form>
         </div>
    </div>
  )
}

export default PasswordReset
