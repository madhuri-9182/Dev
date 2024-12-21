import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Candidates() {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedFilters, setSelectedFilters] = useState({
    role: "All",
    status: "All",
  });

  const role = ["SDE II", "SDE III", "SDET I", "EM", "SDE I - Frontend", "SDE II - Frontend"];
  const status = ["All", "Recommended", "Not Recommended", "Scheduled", "Not Scheduled"];
// All
  const handleSelect = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const [people, setPeople] = useState([
    {
      name: "Ananya Sharma",
      status: "Recommended",
      role: "SDE II",
      type: "Agency",
      date: "MON, 4 DEC",
      score: 450,
    },
    {
      name: "Rohan Verma",
      status: "Not Recommended",
      role: "SDET I",
      type: "Internal",
      date: "TUE, 5 DEC",
      score: 320,
    },
    {
      name: "Vikram Singh",
      status: "Not Scheduled",
      role: "EM",
      type: "Agency",
      date: "WED, 6 DEC",
      score: 400,
    },
    {
      name: "Priya Desai",
      status: "Scheduled",
      role: "SDE II - Frontend",
      type: "Agency",
      date: "THU, 7 DEC",
      score: 360,
    },
    {
      name: "Karthik Iyer",
      status: "Recommended",
      role: "SDE III",
      type: "Internal",
      date: "FRI, 8 DEC",
      score: 490,
    },
    {
      name: "Aarav Kapoor",
      status: "Not Recommended",
      role: "SDE I",
      type: "Internal",
      date: "TUE, 16 AUG 24",
      score: 320,
    },
    {
      name: "Meera Nair",
      status: "Recommended",
      role: "SDE II",
      type: "Client",
      date: "WED, 17 AUG 24",
      score: 470,
    },
    {
      name: "Shreya Banerjee",
      status: "Not Scheduled",
      role: "EM",
      type: "Internal",
      date: "THU, 18 AUG 24",
      score: 390,
    },
    {
      name: "Rahul Gupta",
      status: "Scheduled",
      role: "SDET III",
      type: "Internal",
      date: "FRI, 19 AUG 24",
      score: 480,
    },
    {
      name: "Tanvi Reddy",
      status: "Recommended",
      role: "Data Scientist",
      type: "Client",
      date: "MON, 20 AUG 24",
      score: 450,
    },
    {
      name: "Arjun Khanna",
      status: "Not Recommended",
      role: "SDE II - Backend",
      type: "Agency",
      date: "TUE, 21 AUG 24",
      score: 310,
    },
    {
      name: "Ishita Malhotra",
      status: "Scheduled",
      role: "UI/UX Designer",
      type: "Client",
      date: "WED, 22 AUG 24",
      score: 370,
    },
    {
      name: "Aditya Roy",
      status: "Not Scheduled",
      role: "Product Manager",
      type: "Internal",
      date: "THU, 23 AUG 24",
      score: 420,
    },
    {
      name: "Sanya Bhatia",
      status: "Recommended",
      role: "QA Lead",
      type: "Agency",
      date: "FRI, 24 AUG 24",
      score: 490,
    },
  ]);

  return (
    <div className='flex flex-col gap-y-4'>
      <div>
        <div className="flex flex-col w-full justify-end sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0 ml-auto">
          {/* Search Input */}
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-[446px]">
            <input
              type="text"
              placeholder="Search job by Name, Email & Mobile Number"
              className="flex-1 bg-transparent text-gray-600 outline-none text-sm"
            />
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
          </div>

          {/* Add Client Button */}
          <button
            className="flex items-center justify-center space-x-2 bg-[#007AFF] text-white px-4 py-2 rounded-full text-sm font-medium w-full sm:w-auto"
            onClick={() => navigate(`${location.pathname}/addcandidate`)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span> Add Candidate</span>
          </button>
        </div>
      </div>












      <div className='w-full flex items-center justify-evenly'>
        <div className='w-[98%] grid grid-cols-5 gap-x-5 justify-evenly'>
          <div className='p-4 w-[200px] h-[96px] flex flex-col items-start justify-center bg-[#E5ECF6] rounded-lg'>
            <span className='text-sm text-black font-extralight'>Total Candidates</span>
            <span className='text-[24px] font-semibold' >750</span>

          </div>
          <div className='p-4 w-[200px] h-[96px] flex flex-col items-start justify-center bg-[#E5ECF6] rounded-lg'>
            <span className='text-sm text-black font-extralight'>To be Scheduled</span>
            <span className='text-[24px] font-semibold' >26</span>

          </div>
          <div className='p-4 w-[200px] h-[96px] flex flex-col items-start justify-center bg-[#E5ECF6] rounded-lg'>
            <span className='text-sm text-black font-extralight'>In Progress</span>
            <span className='text-[24px] font-semibold'>56</span>

          </div> <div className='p-4 w-[200px] h-[96px] flex flex-col items-start justify-center bg-[#E5ECF6] rounded-lg'>
            <span className='text-sm text-black font-extralight'>Recommended</span>
            <span className='text-[24px] font-semibold' >26</span>

          </div>
          <div className='p-4 w-[200px] h-[96px] flex flex-col items-start justify-center bg-[#E5ECF6] rounded-lg'>
            <span className='text-sm text-black font-extralight'>Rejected</span>
            <span className='text-[24px] font-semibold' >200</span>

          </div>
        </div>
      </div>















      <div className="py-4 sticky top-[60px] bg-white">
        <div className="pl-3 space-y-2">
          {/* Domain Filter */}
          <div className="flex items-center space-x-1">
            <span className="text-sm font-bold mr-7 flex">Role</span>
            {role.map((role) => (
              <button
                key={role}
                onClick={() => handleSelect("role", role)}
                className={`flex items-center justify-center px-2 py-1 border rounded-md text-xs w-auto ${selectedFilters.role === role
                  ? "bg-purple-100 text-purple-700 border-purple-300"
                  : "bg-white text-gray-700 border-gray-300"
                  }`}
              >
                {/* Tick container */}
                {selectedFilters.role === role && (
                  <span className="w-4 h-4 flex justify-center items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 text-purple-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                )}
                {role}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1">
            <span className="text-sm font-bold mr-4">Status</span>
            {status.map((status) => (
              <button
                key={status}
                onClick={() => handleSelect("status", status)}
                className={`flex items-center justify-center px-2 py-1 border rounded-md text-xs w-auto ${selectedFilters.status === status
                  ? "bg-purple-100 text-purple-700 border-purple-300"
                  : "bg-white text-gray-700 border-gray-300"
                  }`}
              >
                {/* Tick container */}
                {selectedFilters.status === status && (
                  <span className="w-4 h-4 flex justify-center items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 text-purple-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                )}
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>















      <div>
        {people.map((person, index) => (
          <div key={index}>
            <hr className="bg-[F4F4F4] w-[98%] h-[1px] rounded-full" />
            <div className="w-full flex items-center justify-evenly">
              <div className="w-[98%] h-[80px] grid grid-cols-5 gap-x-5 justify-evenly">
                {/* Name and Status */}
                <div className="flex flex-col items-start justify-evenly">
                  <div className="text-sm font-semibold text-[#056DDC]">
                    {person.name}
                  </div>
                  <div
                    className={`text-sm text-black px-2 py-[2px] rounded-lg text-center ${person.status === "Recommended"
                      ? "bg-[#2ECC71]"
                      : person.status === "Not Recommended"
                        ? "bg-[#B10E0E] text-white"
                        : person.status === "Scheduled"
                          ? "bg-[#DF8C0F] text-white"
                          : "bg-[#C4C4C4]"
                      }`}
                  >
                    {person.status}
                  </div>
                </div>
                {/* Role */}
                <div className="flex items-center justify-center">
                  <div className="text-sm text-black text-center">
                    {person.role}
                  </div>
                </div>
                {/* Type */}
                <div className="flex items-center justify-center">
                  <div className="text-sm text-black text-center">
                    {person.type}
                  </div>
                </div>
                {/* Date */}
                <div className="flex items-center justify-center">
                  <div className="text-sm text-black text-center">
                    {person.date}
                  </div>
                </div>
                {/* Score */}
                <div className="flex items-center justify-center">
                  {!(person.status === "Scheduled" || person.status === "Not Scheduled") && (
                    <div className="text-sm text-black text-center">
                      Score: {person.score}/500
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


    </div>
  )
}



export default Candidates
