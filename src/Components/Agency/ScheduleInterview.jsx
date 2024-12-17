import React, { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom";
import BasicDatePicker from '../../utils/BasicDatePicker';
import { useNavigate } from 'react-router-dom';

function ScheduleInterview() {
  const location = useLocation();
  const navigate = useNavigate();

  const { item } = location.state || {};

  const [timeSlots, setTimeSlots] = useState([
    { time: "10 AM", available: "yes" },
    { time: "11 AM", available: "no" },
    { time: "12 PM", available: "yes" },
    { time: "1 PM", available: "no" },
    { time: "2 PM", available: "yes" },
    { time: "3 PM", available: "yes" },
    { time: "4 PM", available: "no" },
    { time: "5 PM", available: "yes" },
    { time: "6 PM", available: "no" },
    { time: "7 PM", available: "yes" },
  ]);
  const [selectedFilters, setSelectedFilters] = useState({
    availabeSlots: "All",
  });
  const handleSelect = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: value,
    }));
  };
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [open, setOpen] = useState(false); // To toggle the calendar visibility


  const availabeSlots = ["9am - 10am", "10:15am - 11:15am", "9:45am - 10:45am", "10:30am - 11:30am", "11am - 12pm"];
  return (
    <div className='w-full flex gap-x-3'>
      <div className='w-[40%] bg-[#E7E4E8] rounded-lg'>
        <div className='pl-10 p-2 flex flex-col gap-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex flex-col'>
              <label htmlFor="Experience" className='text-sm text-[#6B6F7B]'>EXPERIENCE</label>
              <span className='text-[16px] text-[#6B6F7B]'>{item.experience}</span>
            </div>
            <div className='border rounded-lg shadow-xl shadow-gray-700'>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 21H8.425L18.2 11.225L16.775 9.8L7 19.575V21ZM5 23V18.75L18.2 5.575C18.4 5.39167 18.6208 5.25 18.8625 5.15C19.1042 5.05 19.3583 5 19.625 5C19.8917 5 20.15 5.05 20.4 5.15C20.65 5.25 20.8667 5.4 21.05 5.6L22.425 7C22.625 7.18333 22.7708 7.4 22.8625 7.65C22.9542 7.9 23 8.15 23 8.4C23 8.66667 22.9542 8.92083 22.8625 9.1625C22.7708 9.40417 22.625 9.625 22.425 9.825L9.25 23H5ZM17.475 10.525L16.775 9.8L18.2 11.225L17.475 10.525Z" fill="#65558F" />
              </svg>
            </div>

          </div>
          <div className='flex flex-col'>
            <label htmlFor="Experience" className='text-sm text-[#6B6F7B]'>EMAIL</label>
            <span className='text-[16px] text-[#6B6F7B]'>{item?.email}</span>
          </div>
          <div className='flex flex-col'>
            <label htmlFor="Experience" className='text-sm text-[#6B6F7B]'>COMPANY</label>
            <span className='text-[16px] text-[#6B6F7B]'>{item?.company}</span>
          </div>
          <div className='flex flex-col'>
            <label htmlFor="Experience" className='text-sm text-[#6B6F7B]'>DESIGNATION</label>
            <span className='text-[16px] text-[#6B6F7B]'>SDE III</span>
          </div>
          <div className='flex flex-col'>
            <label htmlFor="Experience" className='text-sm text-[#6B6F7B]'>SOURCE</label>
            <span className='text-[16px] text-[#6B6F7B]'>Agency</span>
          </div>
          <div className='flex flex-col items-start'>
            <label htmlFor="Experience" className='text-sm text-[#6B6F7B]'>CV</label>
            <button className='text-[16px]  text-[#056DDC] hover:underline'>Download</button>
          </div>
          <div className='flex flex-col'>
            <label htmlFor="Experience" className='text-sm text-[#6B6F7B]'>CV</label>
            <textarea name="" id=""
              placeholder='Write your remark here'
              className='rounded-lg p-2 bg-white'>

            </textarea>
          </div>

        </div>

      </div>







      <div className='w-full p-6'>
        <div className='w-[40%] grid grid-cols-[_1fr,_4fr] gap-y-4 '>
          <div className=''>
            <label htmlFor="Name"
              className='text-sm text-[#6B6F7B]'
            >Name</label>
          </div>
          <div className=''>
            <input type="text"
              disabled
              value={item.name}
              className='ml-4 border-[1px] border-[#CAC4D0] bg-white px-4 py-[3px] text-center rounded-lg text-sm text-black'
            />
          </div>
          <div> <label htmlFor="Name"
            className='text-sm text-[#6B6F7B]'
          >Role</label></div>
          <div><input type="text"
            disabled
            value={'SDE-III'}
            className='ml-4 border-[1px] border-[#CAC4D0] bg-white px-4 py-[3px] text-center rounded-lg text-sm text-black'
          /></div>
          <div> <label htmlFor="Name"
            className='text-sm text-[#6B6F7B]'
          >Function</label></div>
          <div><input type="text"
            disabled
            value={'Frontend'}
            className='ml-4 border-[1px] border-[#CAC4D0] bg-white px-4 py-[3px] text-center rounded-lg text-sm text-black'
          /></div>
        </div>
        <div className='m-4'>
          <div class="p-4 w-[328px] h-[127px] bg-[#ECE6F0] rounded-xl">
            <div>
              <span className='text-sm text-[#49454F]'>Select Date</span>
            </div>















            <BasicDatePicker />

























          </div>
        </div>

        <div className="">
          <h1 className="text-xl mb-4 text-black ">Time Slots</h1>
          <div className='grid grid-cols-10 gap-4'>
            {timeSlots.map((slot, index) => (
              <div
                key={index}
                className={` text-center p-1 px-2 rounded-lg text-sm max-w-max ${slot.available === "yes" ? "bg-[#59B568] text-white " : "bg-[#C7C7C7] text-[#6B6F7B]"
                  }`}
              >
                {slot.time}
              </div>
            ))}
          </div>
        </div>

        <div className='mt-10'>
          <div className="flex items-center space-x-1">
            <span className="text-sm font-bold mr-4 text-[#6B6F7B] ">Available Slots</span>
            <div className='flex items-center space-x-2'>
              {availabeSlots.map((availabeSlots) => (
                <button
                  key={availabeSlots}
                  onClick={() => handleSelect("availabeSlots", availabeSlots)}
                  className={` flex items-center justify-center px-2 py-1 border rounded-md text-xs w-auto ${selectedFilters.availabeSlots === availabeSlots
                    ? "bg-purple-100 text-purple-700 border-purple-300"
                    : "bg-white text-gray-700 border-gray-300"
                    }`}
                >
                  {/* Tick container */}
                  {selectedFilters.availabeSlots === availabeSlots && (
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
                  {availabeSlots}
                </button>
              ))}
            </div>

          </div>
        </div>


        <div className='mt-8 flex items-center justify-end gap-x-4'>
          <button className='text-sm border border-[#79747E] text-[#65558F] w-[143px] h-[40px] rounded-full'
           onClick={() => navigate('/agency/candidates')}
          >Drop Candidate</button>
          <button className='text-sm bg-[#E8DEF8] text-[#4A4459] w-[143px] h-[40px] rounded-full'
           onClick={() => navigate('/agency/candidates')}
          >Schedule Later</button>
          <button className='text-sm bg-[#007AFF]  text-white w-[143px] h-[40px] rounded-full'
           onClick={() => navigate('/agency/candidates')}
          >Confirm</button>
        </div>

      </div>
    </div>
  )
}

export { ScheduleInterview as AgencyScheduleInterview }
