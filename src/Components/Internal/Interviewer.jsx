import React, { useState } from 'react'
import { useNavigation, Link } from 'react-router-dom';

function Interviewer() {

  const [user, setUsers] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [strength, setStrength] = useState("");
  const [language, setLanguage] = useState("");
  const [Experience, setExperience] = useState("");
  const [addUser, setAddUser] = useState(false);



  const [selectedOption, setSelectedOption] = useState('');
  const [items, setItems] = useState([]);

  const handleSelection = (e) => {
    const newOption = e.target.value;
    setSelectedOption(newOption);
    if (newOption && !items.includes(newOption)) {
      setItems([...items, newOption]);
    }
  }

  const removeItem = (ItemToRemove) => {
    console.log("hii remove clicked");

    setItems(items.filter(item => item !== ItemToRemove))
  }

  const toggleAddUser = () => {
    setAddUser(!addUser)
  }


  // Search FILTER 

  const [searchTerm, setSearchTerm] = useState('');



  const [clickedIndex, setClickedIndex] = useState(null)

  const data = [
    { name: 'Ashok Samal', email: '123@gmail.com', phone: 1234567890, strength: "SQL", language: "Java", experience: 23 },
    { name: 'Sudeep', email: '234@gmail.com', phone: 1234567890, strength: "SQL", language: "Java", experience: 23 },
    { name: 'Roshan', email: '345@gmail.com', phone: 1234567890, strength: "SQL", language: "Java", experience: 23 },
    { name: 'Richa', email: '123@gmail.com', phone: 1234567890, strength: "SQL", language: "Java", experience: 23 },
    { name: 'Ruchi', email: '234@gmail.com', phone: 1234567890, strength: "SQL", language: "Java", experience: 23 },
    { name: 'Sam Johnson', email: '345@gmail.com', phone: 1234567890, strength: "SQL", language: "Java", experience: 23 },
  ];

  const [selectedFilters, setSelectedFilters] = useState({
    domain: "All",
    status: "All",
  });

  const domains = ["All", "Backend", "Frontend", "DevOps", "AI/ML", "Testing"];
  const statuses = ["All", "0-4 Years", "4-8 Years", "8-10 Years", "10+ Years" ];
  const handleSelect = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  

  return (
    <div className='p-6 pt-2 pl-0' >
      <div>
        <div className=' w-full h-full flex flex-col items-center font-[Roboto] ' >
          <div className='w-full flex pt-[12px] pb-[12px] pr-3 justify-end gap-[70px] ' >
            <div className='w-[466px] h-[40px] flex justify-around items-center border-2 border-[#F4F4F4] bg-[#F4F4F4] rounded-[28px] pr-1 pl-1 ' >
              <input
                className='  w-[358px] h-[37px] ml-1  text-[#979DA3] bg-[#F4F4F4] border-none focus:outline-none' type="text"
                placeholder='Search job by Name, Email & Mobile Number'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button>
                <svg width="48" height="40" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2100/svg">
                  <g clip-path="url(#clip0_775_6734)">
                    <path d="M31.6 29L25.3 22.7C24.8 23.1 24.225 23.4167 23.575 23.65C22.925 23.8833 22.2333 24 21.5 24C19.6833 24 18.1458 23.3708 16.8875 22.1125C15.6292 20.8542 15 19.3167 15 17.5C15 15.6833 15.6292 14.1458 16.8875 12.8875C18.1458 11.6292 19.6833 11 21.5 11C23.3167 11 24.8542 11.6292 26.1125 12.8875C27.3708 14.1458 28 15.6833 28 17.5C28 18.2333 27.8833 18.925 27.65 19.575C27.4167 20.225 27.1 20.8 26.7 21.3L33 27.6L31.6 29ZM21.5 22C22.75 22 23.8125 21.5625 24.6875 20.6875C25.5625 19.8125 26 18.75 26 17.5C26 16.25 25.5625 15.1875 24.6875 14.3125C23.8125 13.4375 22.75 13 21.5 13C20.25 13 19.1875 13.4375 18.3125 14.3125C17.4375 15.1875 17 16.25 17 17.5C17 18.75 17.4375 19.8125 18.3125 20.6875C19.1875 21.5625 20.25 22 21.5 22Z" fill="#49454F" />
                  </g>
                  <defs>
                    <clipPath id="clip0_775_6734">
                      <rect x="4" width="40" height="40" rx="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
            <div className=' w-[171px] h-[40px]  flex justify-center items-center bg-[#007AFF] border-0 rounded-[100px] text-[#FFFFFF] font-medium ' >
              <Link to="/internal/addinterviewer" >
                + Add Interviewers</Link>
            </div>
          </div>
          <div className='w-[97%] h-[104px] flex justify-between items-center p-2 ' >
            <div className='w-[210px] h-[96px] flex flex-col justify-center items-start p-4 bg-[#E5ECF6] rounded-[16px] ' >
              <span className='font-normal text-[16px] ' >Total Interviewers</span>
              <span className='font-semibold text-[24px] ' >758</span>
            </div>
            <div className='w-[210px] h-[96px] flex flex-col justify-center items-start p-4 bg-[#E5ECF6] rounded-[16px] ' >
              <span className='font-normal text-[16px] ' >0-4 Years</span>
              <span className='font-semibold text-[24px] ' >26</span>
            </div>
            <div className='w-[210px] h-[96px] flex flex-col justify-center items-start p-4 bg-[#E5ECF6] rounded-[16px] ' >
              <span className='font-normal text-[16px] ' >4-8 Years</span>
              <span className='font-semibold text-[24px] ' >56</span>
            </div>
            <div className='w-[210px] h-[96px] flex flex-col justify-center items-start p-4 bg-[#E5ECF6] rounded-[16px] ' >
              <span className='font-normal text-[16px] ' >8-10 Years</span>
              <span className='font-semibold text-[24px] ' >26</span>
            </div>
            <div className='w-[210px] h-[96px] flex flex-col justify-center items-start p-4 bg-[#E5ECF6] rounded-[16px] ' >
              <span className='font-normal text-[16px] ' >10+ Years</span>
              <span className='font-semibold text-[24px] ' >210</span>
            </div>
          </div>
          <div className=' w-[97%] flex flex-col p-2 mt-1 mb-1 ' >
            <div className='flex justify-between' >
              <div className=" flex  items-center space-x-4 p-1 ">
                
                <div className="space-y-2">
              {/* Domain Filter */}
              <div className="flex justify-center font-medium items-center space-x-1">
                <span className=" font-bold mr-2">Domain</span>
                {domains.map((domain) => (
                  <button
                    key={domain}
                    onClick={() => handleSelect("domain", domain)}
                    className={`flex items-center justify-center px-2 py-1 border rounded-md text-xs w-auto ${selectedFilters.domain === domain
                        ? "bg-[#E8DEF8] text-[#4A4459] border-purple-300"
                        : "bg-white text-gray-700 border-gray-300"
                      }`}
                  >
                    {/* Tick placeholder */}
                    <span className="w-4 flex justify-center items-center">
                      {selectedFilters.domain === domain && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3 text-[#4A4459]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    {domain}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex items-center font-medium space-x-1">
                <span className=" font-bold mr-4">Status</span>
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleSelect("status", status)}
                    className={`flex items-center justify-center px-2 py-1 border rounded-md text-xs w-auto ${selectedFilters.status === status
                        ? "bg-[#E8DEF8] text-[#4A4459] border-purple-300"
                        : "bg-white text-gray-700 border-gray-300"
                      }`}
                  >
                    {/* Tick placeholder */}
                    <span className="w-4 flex justify-center">
                      {selectedFilters.status === status && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3 text-purple-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    {status}
                  </button>
                ))}
              </div>
            </div>
              </div>
              <div className='flex gap-2 justify-center items-center ' >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.49996 18.3332H12.5C16.6666 18.3332 18.3333 16.6665 18.3333 12.4998V7.49984C18.3333 3.33317 16.6666 1.6665 12.5 1.6665H7.49996C3.33329 1.6665 1.66663 3.33317 1.66663 7.49984V12.4998C1.66663 16.6665 3.33329 18.3332 7.49996 18.3332Z" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M7.5 9.59131L10 12.0913L12.5 9.59131" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M10 12.0915V5.4248" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M5 13.7583C8.24167 14.8416 11.7583 14.8416 15 13.7583" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                Download Report
              </div>
            </div>
            
          </div>



          <div className='w-[90%]' >
            <table className="w-full text-left border-collapse" >
              <thead className='text-black' >
                <tr className='' >
                  <th className='py-2 px-4 max-w-max border-b-4 ' >USERS</th>
                  <th className='py-2 px-4 max-w-max border-b-4 ' >EMAIL ID</th>
                  <th className='py-2 px-4 max-w-max border-b-4 ' >Phone No</th>
                  <th className='py-2 px-4 max-w-max border-b-4 ' >Strength</th>
                  <th className='py-2 px-4 max-w-max border-b-4 ' >Languages</th>
                  <th className='py-2 px-4 max-w-max border-b-4 ' >Experience</th>
                  <th className='py-2 px-4 max-w-max border-b-4 ' ></th>
                </tr>

              </thead>

              <tbody>


                {data.map((data, index) => (
                  <tr key={index} className={`${index % 2 === 0 ? "bg-" : "bg-[#FFC7001F]"} h-[91px] `} >
                    <td className='py-3 px-4 max-w-max' >{data.name} </td>
                    <td className='py-3 px-4 max-w-max' >{data.email} </td>
                    <td className='py-3 px-4 max-w-max' >{data.phone}</td>
                    <td className='py-3 px-4 max-w-max' >{data.strength}</td>
                    <td className='py-3 px-4 max-w-max' >{data.language}</td>
                    <td className='py-3 px-4 max-w-max' >{data.language}</td>
                    <td className='py-3 px-4 flex space-x-2 space-y-2 ' >
                      <div className='space-x-2 pt-5 ' >
                        <button className="" onClick={function (e) { toggleAddUser(); setClickedIndex(index) }}  >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.16663 1.6665H7.49996C3.33329 1.6665 1.66663 3.33317 1.66663 7.49984V12.4998C1.66663 16.6665 3.33329 18.3332 7.49996 18.3332H12.5C16.6666 18.3332 18.3333 16.6665 18.3333 12.4998V10.8332" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M13.3667 2.51688L6.80002 9.08354C6.55002 9.33354 6.30002 9.82521 6.25002 10.1835L5.89169 12.6919C5.75835 13.6002 6.40002 14.2335 7.30835 14.1085L9.81669 13.7502C10.1667 13.7002 10.6584 13.4502 10.9167 13.2002L17.4834 6.63354C18.6167 5.50021 19.15 4.18354 17.4834 2.51688C15.8167 0.850211 14.5 1.38354 13.3667 2.51688Z" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M12.425 3.4585C12.9834 5.45016 14.5417 7.0085 16.5417 7.57516" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>

                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            deleteUser(user.id)
                          }}

                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.5 4.98356C14.725 4.70856 11.9333 4.56689 9.15 4.56689C7.5 4.56689 5.85 4.65023 4.2 4.81689L2.5 4.98356" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M7.08337 4.1415L7.26671 3.04984C7.40004 2.25817 7.50004 1.6665 8.90837 1.6665H11.0917C12.5 1.6665 12.6084 2.2915 12.7334 3.05817L12.9167 4.1415" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M15.7083 7.6167L15.1666 16.0084C15.075 17.3167 15 18.3334 12.675 18.3334H7.32496C4.99996 18.3334 4.92496 17.3167 4.83329 16.0084L4.29163 7.6167" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M8.60828 13.75H11.3833" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M7.91663 10.4165H12.0833" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>

                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {
            addUser && (
              <div className='h-full w-full fixed inset-0 flex items-center justify-center font-[Roboto] bg-black bg-opacity-50 z-50 ' >
                <div className=' w-[705px] h-[562px] flex flex-col justify-center text-[#6B6F7B] items-center bg-[#FFFFFF] ' >
                  <ul className='flex flex-col justify-end  gap-2 ' >
                    <li>
                      {data.map((data, index) => (
                        <div>
                          {clickedIndex === index ? (
                            <div className=' flex gap-4 items-center justify-end ' >
                              <label className='font-bold' >Name </label>
                              <input
                                type="text"
                                value={data.name}
                                className='w-[360px] h-[32px] p-3 text-center border rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 border-[#CAC4D0]' />
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </li>
                    <li>{data.map((data, index) => (
                      <div>
                        {clickedIndex === index ? (
                          <div className=' flex gap-4 items-center justify-end ' >
                            <label className='font-bold' >Email ID</label>
                            <input
                              type="email"
                              value={data.email}
                              className='w-[360px] h-[32px] p-3 text-center border rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 border-[#CAC4D0]' />
                          </div>
                        ) : null}
                      </div>
                    ))}</li>
                    <li>
                      {data.map((data, index) => (
                        <div>
                          {clickedIndex === index ? (
                            <div className=' flex gap-4 items-center justify-end  ' >
                              <label className='font-bold' >Phone Number</label>
                              <input
                                type="number"
                                value={data.phone}
                                className='w-[360px] h-[32px] p-3 text-center border rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 border-[#CAC4D0]' />
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </li>

                    <li>
                      {data.map((data, index) => (
                        <div>
                          {clickedIndex === index ? (
                            <div className=' flex gap-4 items-center justify-end ' >
                              <label className='font-bold' >Experience</label>
                              <input
                                type="text"
                                value={data.experience}
                                className='w-[360px] h-[32px] p-3 text-center border rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 border-[#CAC4D0]' />
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </li>
                    <li>
                      {data.map((data, index) => (
                        <div>
                          {clickedIndex === index ? (
                            <div className=' flex gap-4 items-center justify-end ' >
                              <label className='font-bold' >Current Company</label>
                              <input
                                type="text"
                                value=""
                                className='w-[360px] h-[32px] p-3 text-center border rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 border-[#CAC4D0]' />
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </li>
                    <li>
                      {data.map((data, index) => (
                        <div>
                          {clickedIndex === index ? (
                            <div className=' flex gap-4 items-center justify-end ' >
                              <label className='font-bold' >Job Assigned</label>
                              <select
                                onChange={handleSelection}
                                value={selectedOption}
                                className="w-[360px] h-[32px] p-3 text-center text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-[#CAC4D0]"
                              >
                                <option value="" disabled></option>
                                <option value="SDET I">SDET I</option>
                                <option value="SDET II">SDET II</option>
                                <option value="EM">EM</option>
                                <option value="DevOps I">DevOps I</option>
                                <option value="SDE II">SDE II</option>
                                <option value="PE">PE</option>
                                <option value="SDE III">SDE III</option>
                              </select>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </li>
                    <li className='flex justify-end ' >
                      <div className='w-[70%] flex flex-wrap flex-col justify-end items-end pr-2 pl-2 ' >
                        <div className='w-[380px] p-1 ' >
                          <ul className='flex flex-wrap justify-start gap-4 items-center ' > {items.map((item, index) => (<li key={index} className=" flex justify-center items-center h-[32px] border border-[#49454F] pl-1 pr-1 rounded-lg  text-[#49454F]  "> {item} <button
                            onClick={() => removeItem(item)}
                            className='pl-2' ><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1.8 11.25L0.75 10.2L4.95 6L0.75 1.8L1.8 0.75L6 4.95L10.2 0.75L11.25 1.8L7.05 6L11.25 10.2L10.2 11.25L6 7.05L1.8 11.25Z" fill="#49454F" />
                            </svg>
                          </button> </li>))} </ul>
                        </div>
                      </div>
                    </li>
                    <li className='mt-10' >
                      <div className=' w-full gap-[15px] flex justify-end items-center p-1 ' >
                        <div className=' w-[79px] h-[32px] p-2  flex justify-center items-center bg-[#E8DEF8] border-0 rounded-[100px] text-black font-normal ' >
                          <button
                            onClick={toggleAddUser}
                          >Delete</button>
                        </div>
                        <div className=' w-[79px] h-[32px] p-2 flex justify-center items-center bg-[#007AFF] border-0 rounded-[100px] text-[#FFFFFF] font-normal ' >
                          <button
                          >Save</button>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export { Interviewer as InternalInterviewer }
