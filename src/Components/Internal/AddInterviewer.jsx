import React, { useState } from 'react'

function AddInterviewer() {
    const [selectedStrength, setSelectedStrength] = useState("Backend")
  const [selectedOption, setSelectedOption] = useState('');
  const [items, setItems] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [itemsSkills,setItemsSkills] = useState([]);

  const handleSelection = (e) => {
    const newOption = e.target.value;
    setSelectedOption(newOption);
    if (newOption && !items.includes(newOption)) {
      setItems([...items, newOption]);
    }
  }
  

  const removeItem=(ItemToRemove)=>{
    console.log("hii remove clicked");
    
    setItems(items.filter(item => item !== ItemToRemove ))
  }

  const handleSkillSelection = (e) => {
    const newSkillOption = e.target.value;
    setSelectedSkill(newSkillOption);
    if (newSkillOption && !itemsSkills.includes(newSkillOption)) {
      setItemsSkills([...itemsSkills, newSkillOption]);
    }
  }
  const removeSkill=(ItemToRemove)=>{
    console.log("hii remove clicked SKILLS");
    
    setItemsSkills(itemsSkills.filter(item => item !== ItemToRemove ))
  }

  

  const handleStrengthSelection=(e) => {
    console.log("i am selected");
    
    setSelectedStrength(e.target.value);
  }

  return (
    <div className=' font-[Roboto] ' >
      <div className='  ' >

{/* MAIN 1 */}


      <div className='w-full p-2'>
        <ul className='grid grid-cols-2 grid-rows-2 gap-4 p-2'>
          <li className='flex items-center justify-center gap-x-4 '>
            <div className='w-1/4  flex items-end justify-end'>
              <label  class=" w-full  text-right ">Interviewer Name</label>
            </div>
            <div className='w-1/2'>
              <input
                type="text"
                
                className=" w-[360px] h-[32px] border border-gray-300  text-center rounded-lg py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500"
                
              />
            </div>
          </li>

          <li className='flex items-center justify-center gap-x-4 '>
            <div className='w-1/4  flex items-end justify-end'>
              <label for="" class=" w-full  text-right ">Phone Number</label>
            </div>
            <div className='w-1/2'>
              <input
                type="number"
                id=""
                className=" w-[360px] h-[32px] border border-gray-300  text-center rounded-lg py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500"
                
              />
            </div>
          </li>
          <li className='flex items-center justify-center gap-x-4 '>
            <div className='w-1/4  flex items-end justify-end'>
              <label for="" class=" w-full  text-right ">Email ID</label>
            </div>
            <div className='w-1/2'>
              <input
                type="email"
                id=""
                className=" w-[360px] h-[32px] border border-gray-300 text-center rounded-lg py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500"
                
              />
            </div>
          </li>
        </ul>
      </div>
      <hr className=" h-[2px] rounded-full bg-[#F4F4F4] my-4" />




       
{/* MAIN 2 */}
<div className=''>
        <ul className='grid grid-cols-2 grid-rows-2 gap-4 p-2'>
          <li className='flex items-center justify-center gap-x-4 '>
            <div className='w-1/4  flex items-end justify-end'>
              <label  class=" w-full  text-right ">Current Company</label>
            </div>
            <div className='w-1/2'>
              <input
                type="text"
                
                className=" w-[360px] h-[32px] border border-gray-300  text-center rounded-lg py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500"
                
              />
            </div>
          </li>

          <li className='flex items-center justify-center gap-x-4 '>
            <div className='w-1/4  flex items-end justify-end'>
              <label for="" class=" w-full  text-right ">Previous Company</label>
            </div>
            <div className='w-1/2'>
              <input
                type="text"
                id=""
                className=" w-[360px] h-[32px] border border-gray-300  text-center rounded-lg py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500"
                
              />
            </div>
          </li>
          <li className='flex items-center justify-center gap-x-4 '>
            <div className='w-1/4  flex items-end justify-end'>
              <label for="" class=" w-full  text-right ">Current Designation</label>
            </div>
            <div className='w-1/2'>
              <input
                type="text"
                id=""
                className=" w-[360px] h-[32px] border border-gray-300 text-center rounded-lg py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500"
                
              />
            </div>
          </li>
        </ul>
      </div>
      <hr className=" h-[2px] rounded-full bg-[#F4F4F4] my-4" />

        
{/* MAIN 3 */}
<div className=' flex flex-col '>
        <ul className='grid grid-cols-2 gap-4 p-2 '>
          <li className='flex items-center justify-center gap-x-4  '>
            <div className='w-1/4  flex items-center justify-center'>
              <label  class=" w-full  text-right ">Total Interview</label>
            </div>
            <div className=' flex w-1/2'>
            <div className='flex flex-wrap' >
              <input
                type="number"
                placeholder='00'
                className=" w-[96px] h-[32px] border mr-2 border-gray-300  text-center rounded-lg py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500"
                
              />
              Years
              </div>
              <div className='flex flex-wrap' >
              <input
                type="number"
                placeholder='00'
                min="0"
                max="12"
                className=" w-[96px] h-[32px] border ml-2 mr-2 border-gray-300  text-center rounded-lg py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500"
                
              />
              Months
              </div>
            </div>
          </li>

          <li className='flex items-center justify-center gap-x-4 '>
            <div className='w-1/4  flex items-center justify-center'>
              <label for="" class=" w-full  text-right ">Interview Experience</label>
            </div>
            <div className=' flex w-1/2'>
            <div className='flex flex-wrap' >
            <input
                type="number"
                placeholder='00'
                className=" w-[96px] h-[32px] border mr-2 border-gray-300  text-center rounded-lg py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500"
                
              />
              Years
              </div>
              <div className='flex flex-wrap' >
              <input
                type="number"
                placeholder='00'
                min="0"
                max="12"
                className=" w-[96px] h-[32px] border ml-2 mr-2 border-gray-300  text-center rounded-lg py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500"
                
              />
              Months
              </div>
            </div>
          </li>
        </ul>
      </div>
      <hr className=" h-[2px] rounded-full bg-[#F4F4F4] my-4" />
        



{/* main 4 single div use */}

<div className=''>
        <ul className='grid grid-cols-2 grid-rows-2 gap-4 p-2'>
          <li className='flex items-center gap-x-2 justify-center'>
            <div className='w-[27%]  flex items-center justify-center'>
              <label  class=" w-full  text-center  ">Interview Assigned For</label>
            </div>
            <div className='w-1/2'>
            <select
                            onChange={handleSelection}
                            value={selectedOption}
                            className="w-[50px] h-[32px] p-3 text-center text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-[#CAC4D0]">
                            <option value="" disabled></option>
                            <option value="EM">EM</option>
                            <option value="PM">PM</option>
                            <option value="SDE II">SDE II</option>
                            <option value="SDE III">SDE III</option>
                            <option value="SDE IV">SDE IV</option>
              </select>
            </div>
          </li>

          <li className='flex items-center justify-center gap-x-4 '>
            <div className='w-1/4  flex items-end justify-end'>
              <label for="" class=" w-full  text-right ">Skills</label>
            </div>
            <div className='w-1/2'>
            <select
                            onChange={handleSkillSelection}
                            value={selectedSkill}
                            className="w-[50px] h-[32px] p-3 text-center text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-[#CAC4D0]">
                            <option value="" disabled></option>
                            <option value="Python">Python</option>
                            <option value="Kafka">Kafka</option>
                            <option value="Java">Java</option>
                            <option value="DSA">DSA</option>
                            <option value="OOPS">OOPS</option>
                      </select>
            </div>
          </li>
          <li className='flex items-center justify-center gap-x-4 '>
            <div className='w-1/4  flex items-center justify-center'>
              <label for="" class=" w-full "></label>
            </div>
            <div className='w-1/2 flex items-center justify-start  '>
            <div className='w-[300px]  gap-x-4'>
                      <ul className='flex flex-wrap justify-start gap-4 items-center ' > {items.map((item, index) => (<li key={index} className=" flex justify-center items-center h-[32px] border border-[#49454F] pl-1 pr-1 rounded-lg  text-[#49454F]  "> {item} <button 
                      onClick={()=>removeItem(item)}
                      className='pl-2' ><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.8 11.25L0.75 10.2L4.95 6L0.75 1.8L1.8 0.75L6 4.95L10.2 0.75L11.25 1.8L7.05 6L11.25 10.2L10.2 11.25L6 7.05L1.8 11.25Z" fill="#49454F" />
                      </svg>
                      </button> </li>))} </ul>
                  </div>
            </div>
          </li>
          <li className='flex items-center justify-center gap-x-4 '>
            <div className='w-1/4  flex items-center justify-center'>
              <label for="" class=" w-full "></label>
            </div>
            <div className='w-1/2 flex items-center justify-start '>
            <div className='w-[300px]   gap-x-4   '>
                      <ul className='flex flex-wrap justify-start gap-4 items-center ' > {itemsSkills.map((item, index) => (<li key={index} className=" flex justify-center items-center h-[32px] border border-[#49454F] pl-1 pr-1 rounded-lg  text-[#49454F]  "> {item} <button 
                      onClick={()=>removeSkill(item)}
                      className='pl-2' ><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.8 11.25L0.75 10.2L4.95 6L0.75 1.8L1.8 0.75L6 4.95L10.2 0.75L11.25 1.8L7.05 6L11.25 10.2L10.2 11.25L6 7.05L1.8 11.25Z" fill="#49454F" />
                      </svg>
                      </button> </li>))} </ul>
                  </div>
            </div>
          </li>
        </ul>
      </div>
      




       

{/* main 5 */}

<div className='mt-4'>
        <ul className='grid grid-cols-2 grid-rows-2 gap-4 p-2'>
          <li className='flex items-center justify-center gap-x-4 '>
            <div className='w-1/4  flex items-end justify-end'>
              <label  class=" w-full  text-right ">Strength</label>
            </div>
            <div className='w-1/2'>
            <select
                            value={selectedStrength}
                            onChange={handleStrengthSelection}
                            className=" h-[32px] text-center text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-[#CAC4D0]  "
                          >
                            <option value="Backend">Backend</option>
                            <option value="Frontend">Frontend</option>
                            <option value="Testing">Testing</option>
                            <option value="DevOps">DevOps</option>
                            <option value="AI/ML">AI/ML</option>
                            <option value="Data Engineering">Data Engineering</option>
                          </select>
            </div>
          </li>

          
        </ul>
      </div>
      <hr className=" h-[2px] rounded-full bg-[#F4F4F4] my-4" />



            


             

{/* MAIN 6 */}


<div className='mt-4'>
        <ul className='grid grid-cols-2 gap-4 p-2 '>
          <li className='flex items-center justify-center gap-x-4 '>
            <div className='w-1/4  flex items-end justify-end'>
              <label  class=" w-full  text-right ">Upload CV</label>
            </div>
            <div className='w-1/2'>
            <button>
               <svg width="275" height="93" viewBox="0 0 275 93" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="273" height="91" rx="11" fill="#F8F8F8" />
            <rect x="1" y="1" width="273" height="91" rx="11" stroke="#6B6F7B" stroke-width="2" stroke-dasharray="6 6" />
            <path d="M108.071 60.2727H109.392V66.0128C109.392 66.6236 109.249 67.1648 108.962 67.6364C108.675 68.1051 108.271 68.4744 107.751 68.7443C107.232 69.0114 106.622 69.1449 105.923 69.1449C105.227 69.1449 104.619 69.0114 104.099 68.7443C103.58 68.4744 103.176 68.1051 102.889 67.6364C102.602 67.1648 102.459 66.6236 102.459 66.0128V60.2727H103.776V65.9062C103.776 66.3011 103.862 66.652 104.036 66.9588C104.212 67.2656 104.46 67.5071 104.781 67.6832C105.102 67.8565 105.483 67.9432 105.923 67.9432C106.366 67.9432 106.749 67.8565 107.07 67.6832C107.393 67.5071 107.641 67.2656 107.811 66.9588C107.984 66.652 108.071 66.3011 108.071 65.9062V60.2727ZM111.204 71.4545V62.4545H112.449V63.5156H112.555C112.629 63.3793 112.735 63.2216 112.875 63.0426C113.014 62.8636 113.207 62.7074 113.454 62.5739C113.701 62.4375 114.028 62.3693 114.434 62.3693C114.963 62.3693 115.434 62.5028 115.849 62.7699C116.264 63.0369 116.589 63.4219 116.825 63.9247C117.064 64.4276 117.183 65.0327 117.183 65.7401C117.183 66.4474 117.065 67.054 116.829 67.5597C116.593 68.0625 116.27 68.4503 115.858 68.723C115.446 68.9929 114.975 69.1278 114.447 69.1278C114.049 69.1278 113.724 69.0611 113.471 68.9276C113.221 68.794 113.025 68.6378 112.883 68.4588C112.741 68.2798 112.632 68.1207 112.555 67.9815H112.478V71.4545H111.204ZM112.453 65.7273C112.453 66.1875 112.52 66.5909 112.653 66.9375C112.787 67.2841 112.98 67.5554 113.233 67.7514C113.485 67.9446 113.795 68.0412 114.162 68.0412C114.542 68.0412 114.86 67.9403 115.116 67.7386C115.372 67.5341 115.565 67.2571 115.696 66.9077C115.829 66.5582 115.896 66.1648 115.896 65.7273C115.896 65.2955 115.831 64.9077 115.7 64.5639C115.572 64.2202 115.379 63.9489 115.12 63.75C114.865 63.5511 114.545 63.4517 114.162 63.4517C113.792 63.4517 113.48 63.5469 113.224 63.7372C112.971 63.9276 112.779 64.1932 112.649 64.5341C112.518 64.875 112.453 65.2727 112.453 65.7273ZM119.885 60.2727V69H118.61V60.2727H119.885ZM124.356 69.1321C123.742 69.1321 123.207 68.9915 122.749 68.7102C122.292 68.429 121.937 68.0355 121.684 67.5298C121.431 67.0241 121.305 66.4332 121.305 65.7571C121.305 65.0781 121.431 64.4844 121.684 63.9759C121.937 63.4673 122.292 63.0724 122.749 62.7912C123.207 62.5099 123.742 62.3693 124.356 62.3693C124.969 62.3693 125.505 62.5099 125.962 62.7912C126.42 63.0724 126.775 63.4673 127.028 63.9759C127.281 64.4844 127.407 65.0781 127.407 65.7571C127.407 66.4332 127.281 67.0241 127.028 67.5298C126.775 68.0355 126.42 68.429 125.962 68.7102C125.505 68.9915 124.969 69.1321 124.356 69.1321ZM124.36 68.0625C124.758 68.0625 125.087 67.9574 125.349 67.7472C125.61 67.5369 125.803 67.2571 125.928 66.9077C126.056 66.5582 126.12 66.1733 126.12 65.7528C126.12 65.3352 126.056 64.9517 125.928 64.6023C125.803 64.25 125.61 63.9673 125.349 63.7543C125.087 63.5412 124.758 63.4347 124.36 63.4347C123.96 63.4347 123.627 63.5412 123.363 63.7543C123.102 63.9673 122.907 64.25 122.779 64.6023C122.654 64.9517 122.592 65.3352 122.592 65.7528C122.592 66.1733 122.654 66.5582 122.779 66.9077C122.907 67.2571 123.102 67.5369 123.363 67.7472C123.627 67.9574 123.96 68.0625 124.36 68.0625ZM130.734 69.1449C130.319 69.1449 129.944 69.0682 129.609 68.9148C129.274 68.7585 129.008 68.5327 128.812 68.2372C128.619 67.9418 128.522 67.5795 128.522 67.1506C128.522 66.7812 128.593 66.4773 128.735 66.2386C128.877 66 129.069 65.8111 129.311 65.6719C129.552 65.5327 129.822 65.4276 130.12 65.3565C130.419 65.2855 130.723 65.2315 131.032 65.1946C131.424 65.1491 131.743 65.1122 131.987 65.0838C132.231 65.0526 132.409 65.0028 132.52 64.9347C132.63 64.8665 132.686 64.7557 132.686 64.6023V64.5724C132.686 64.2003 132.581 63.9119 132.37 63.7074C132.163 63.5028 131.853 63.4006 131.441 63.4006C131.012 63.4006 130.674 63.4957 130.427 63.6861C130.183 63.8736 130.014 64.0824 129.92 64.3125L128.723 64.0398C128.865 63.642 129.072 63.321 129.345 63.0767C129.62 62.8295 129.937 62.6506 130.295 62.5398C130.653 62.4261 131.029 62.3693 131.424 62.3693C131.686 62.3693 131.963 62.4006 132.255 62.4631C132.551 62.5227 132.826 62.6335 133.082 62.7955C133.341 62.9574 133.552 63.1889 133.717 63.4901C133.882 63.7884 133.964 64.1761 133.964 64.6534V69H132.72V68.1051H132.669C132.586 68.2699 132.463 68.4318 132.298 68.5909C132.133 68.75 131.922 68.8821 131.663 68.9872C131.404 69.0923 131.095 69.1449 130.734 69.1449ZM131.011 68.1222C131.363 68.1222 131.664 68.0526 131.914 67.9134C132.167 67.7741 132.359 67.5923 132.49 67.3679C132.623 67.1406 132.69 66.8977 132.69 66.6392V65.7955C132.645 65.8409 132.556 65.8835 132.426 65.9233C132.298 65.9602 132.152 65.9929 131.987 66.0213C131.822 66.0469 131.662 66.071 131.505 66.0938C131.349 66.1136 131.218 66.1307 131.113 66.1449C130.866 66.1761 130.64 66.2287 130.436 66.3026C130.234 66.3764 130.072 66.483 129.95 66.6222C129.831 66.7585 129.771 66.9403 129.771 67.1676C129.771 67.483 129.887 67.7216 130.12 67.8835C130.353 68.0426 130.65 68.1222 131.011 68.1222ZM138.112 69.1278C137.583 69.1278 137.112 68.9929 136.697 68.723C136.285 68.4503 135.961 68.0625 135.725 67.5597C135.492 67.054 135.376 66.4474 135.376 65.7401C135.376 65.0327 135.494 64.4276 135.729 63.9247C135.968 63.4219 136.295 63.0369 136.71 62.7699C137.124 62.5028 137.594 62.3693 138.12 62.3693C138.526 62.3693 138.853 62.4375 139.1 62.5739C139.35 62.7074 139.543 62.8636 139.68 63.0426C139.819 63.2216 139.927 63.3793 140.004 63.5156H140.08V60.2727H141.354V69H140.11V67.9815H140.004C139.927 68.1207 139.816 68.2798 139.671 68.4588C139.529 68.6378 139.333 68.794 139.083 68.9276C138.833 69.0611 138.509 69.1278 138.112 69.1278ZM138.393 68.0412C138.759 68.0412 139.069 67.9446 139.322 67.7514C139.577 67.5554 139.771 67.2841 139.901 66.9375C140.035 66.5909 140.102 66.1875 140.102 65.7273C140.102 65.2727 140.036 64.875 139.906 64.5341C139.775 64.1932 139.583 63.9276 139.33 63.7372C139.077 63.5469 138.765 63.4517 138.393 63.4517C138.009 63.4517 137.69 63.5511 137.434 63.75C137.178 63.9489 136.985 64.2202 136.854 64.5639C136.727 64.9077 136.663 65.2955 136.663 65.7273C136.663 66.1648 136.728 66.5582 136.859 66.9077C136.989 67.2571 137.183 67.5341 137.438 67.7386C137.697 67.9403 138.015 68.0412 138.393 68.0412ZM146.451 69V60.2727H147.768V64.0653H152.119V60.2727H153.44V69H152.119V65.1946H147.768V69H146.451ZM158.076 69.1321C157.431 69.1321 156.876 68.9943 156.41 68.7188C155.947 68.4403 155.589 68.0497 155.336 67.5469C155.086 67.0412 154.961 66.4489 154.961 65.7699C154.961 65.0994 155.086 64.5085 155.336 63.9972C155.589 63.4858 155.941 63.0866 156.393 62.7997C156.847 62.5128 157.379 62.3693 157.987 62.3693C158.356 62.3693 158.714 62.4304 159.06 62.5526C159.407 62.6747 159.718 62.8665 159.994 63.1278C160.269 63.3892 160.487 63.7287 160.646 64.1463C160.805 64.5611 160.884 65.0653 160.884 65.6591V66.1108H155.681V65.1562H159.636C159.636 64.821 159.567 64.5241 159.431 64.2656C159.295 64.0043 159.103 63.7983 158.856 63.6477C158.612 63.4972 158.325 63.4219 157.995 63.4219C157.637 63.4219 157.325 63.5099 157.058 63.6861C156.793 63.8594 156.589 64.0866 156.444 64.3679C156.302 64.6463 156.231 64.9489 156.231 65.2756V66.0213C156.231 66.4588 156.308 66.831 156.461 67.1378C156.617 67.4446 156.835 67.679 157.113 67.8409C157.391 68 157.717 68.0795 158.089 68.0795C158.33 68.0795 158.55 68.0455 158.749 67.9773C158.948 67.9062 159.12 67.8011 159.265 67.6619C159.41 67.5227 159.521 67.3509 159.597 67.1463L160.803 67.3636C160.707 67.7187 160.533 68.0298 160.283 68.2969C160.036 68.5611 159.725 68.767 159.35 68.9148C158.978 69.0597 158.553 69.1321 158.076 69.1321ZM162.298 69V62.4545H163.529V63.4943H163.598C163.717 63.142 163.927 62.8651 164.228 62.6634C164.532 62.4588 164.876 62.3565 165.26 62.3565C165.339 62.3565 165.433 62.3594 165.541 62.3651C165.652 62.3707 165.738 62.3778 165.801 62.3864V63.6051C165.75 63.5909 165.659 63.5753 165.528 63.5582C165.397 63.5384 165.267 63.5284 165.136 63.5284C164.835 63.5284 164.566 63.5923 164.331 63.7202C164.098 63.8452 163.913 64.0199 163.777 64.2443C163.64 64.4659 163.572 64.7187 163.572 65.0028V69H162.298ZM169.49 69.1321C168.845 69.1321 168.29 68.9943 167.824 68.7188C167.361 68.4403 167.003 68.0497 166.75 67.5469C166.5 67.0412 166.375 66.4489 166.375 65.7699C166.375 65.0994 166.5 64.5085 166.75 63.9972C167.003 63.4858 167.355 63.0866 167.807 62.7997C168.261 62.5128 168.793 62.3693 169.401 62.3693C169.77 62.3693 170.128 62.4304 170.474 62.5526C170.821 62.6747 171.132 62.8665 171.408 63.1278C171.683 63.3892 171.901 63.7287 172.06 64.1463C172.219 64.5611 172.298 65.0653 172.298 65.6591V66.1108H167.095V65.1562H171.05C171.05 64.821 170.982 64.5241 170.845 64.2656C170.709 64.0043 170.517 63.7983 170.27 63.6477C170.026 63.4972 169.739 63.4219 169.409 63.4219C169.051 63.4219 168.739 63.5099 168.472 63.6861C168.207 63.8594 168.003 64.0866 167.858 64.3679C167.716 64.6463 167.645 64.9489 167.645 65.2756V66.0213C167.645 66.4588 167.722 66.831 167.875 67.1378C168.031 67.4446 168.249 67.679 168.527 67.8409C168.805 68 169.131 68.0795 169.503 68.0795C169.744 68.0795 169.964 68.0455 170.163 67.9773C170.362 67.9062 170.534 67.8011 170.679 67.6619C170.824 67.5227 170.935 67.3509 171.011 67.1463L172.217 67.3636C172.121 67.7187 171.947 68.0298 171.697 68.2969C171.45 68.5611 171.139 68.767 170.764 68.9148C170.392 69.0597 169.967 69.1321 169.49 69.1321Z" fill="#6B6F7B" />
            <path d="M140.94 29.8999C144.54 30.2099 146.01 32.0599 146.01 36.1099L146.01 36.2399C146.01 40.7099 144.22 42.4999 139.75 42.4999L133.23 42.4999C128.76 42.4999 126.97 40.7099 126.97 36.2399L126.97 36.1099C126.97 32.0899 128.42 30.2399 131.96 29.9099" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M136.5 36.0001L136.5 24.6201" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M139.85 26.85L136.5 23.5L133.15 26.85" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            </div>
          </li>
        </ul>
      </div>
      
<div className='mt-4 flex justify-end mr-10 '>
        
            <div className=' w-[79px] h-[32px] p-2 flex justify-center items-center bg-[#007AFF] border-0 rounded-[100px] text-[#FFFFFF] font-normal ' >
          <button>Save</button>
        </div>
      </div>
          
      </div>
    </div>
  )
}

export { AddInterviewer as InternalAddInterviewer }
