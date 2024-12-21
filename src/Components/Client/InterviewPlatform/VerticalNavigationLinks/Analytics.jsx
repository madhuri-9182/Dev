import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import CustomDatePicker from '../../../../utils/CustomDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

function Analytics() {
  const navigate = useNavigate();

  const [roles, setRoles] = useState(['SDET-I', 'SDET-II', 'QA-I', 'QA-II', 'FE-I', 'FE-II', 'BE-I', 'BE-II', 'FS-I', 'FS-II', 'ML-I', 'ML-II', 'DevOps-I', 'DevOps-II']);



  const [selectedFilters, setSelectedFilters] = useState({
    jobs: "All Jobs",
  });
  const jobs = ["All Jobs", "SDE III", "SDET I", "EM"];

  const handleSelect = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const [selectedDateFrom, setSelectedDateFrom] = React.useState(null);
  const [showCalendarFrom, setShowCalendarFrom] = React.useState(false);

  const handleDateChangeFrom = (date) => {
    setSelectedDateFrom(date);
    setShowCalendarFrom(false);
 
  };

  const toggleCalendarFrom = () => {
    setShowCalendarFrom((prev) => !prev);
  };



  const [selectedDateTo, setSelectedDateTo] = React.useState(null);
  const [showCalendarTo, setShowCalendarTo] = React.useState(false);

  const handleDateChangeTo = (date) => {
    setSelectedDateTo(date);
    setShowCalendarTo(false);
  };

  const toggleCalendarTo = () => {
    setShowCalendarTo((prev) => !prev);
  };

  function handelDateFilter(){
    if(!selectedDateFrom && !selectedDateTo){
      alert("Date range is required for filtering.")
      return
    }

    navigate('/client/analytics/filter', {
      state: {
        dateFrom: selectedDateFrom,
        dateTo: selectedDateTo,
        jobFilter:selectedFilters,
      },
    });
  }






  return (
    <div>


      {/* 1st div  dd*/}
      <div className=''>
        <div className=' flex justify-around'>


          <div className="py-4  sticky top-[60px] h-[100%] w-[50%]">
            <div className="pl-3 space-y-2">
              {/* Domain Filter */}
              <div className="flex items-center space-x-1">
                <span className="text-sm font-bold mr-7 flex">Role</span>
                {jobs.map((jobs) => (
                  <button
                    key={jobs}
                    onClick={() => handleSelect("jobs", jobs)}
                    className={`flex items-center justify-center px-2 py-1 border rounded-md text-xs w-auto ${selectedFilters.jobs === jobs
                      ? "bg-purple-100 text-purple-700 border-purple-300"
                      : "bg-white text-gray-700 border-gray-300"
                      }`}
                  >
                    {/* Tick container */}
                    {selectedFilters.jobs === jobs && (
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
                    {jobs}
                  </button>
                ))}
              </div>
            </div>
          </div>




          <div className='flex  ml-[10%] w-[50%]'>

            <div className='p-2'>


              <div className='flex items-center justify-center'>
                <div className='flex items-center justify-center'>
                  <div className=' flex items-center justify-center'>
                    <div htmlFor="From"
                      className='mr-4 text-[#6B6F7B] text-sm'
                    >From</div>
                    {/* From */}



                    <div>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <div className="flex">
                            <DateField
                              value={selectedDateFrom}
                              onChange={handleDateChangeFrom}
                              format="DD/MM/YYYY"
                              sx={{
                                '& .MuiInputBase-input': {
                                  width: '105px', // Set width
                                  height: '2px', // Set height
                                  borderRadius: '20px', // Add border-radius

                                },
                                '& .MuiInputBase-root': {
                                  display: 'flex', // Set display to flex
                                  justifyContent: 'center', // Align items horizontally to center
                                  alignItems: 'center', // Align items vertically to center
                                },

                              }}
                            />

                            <button onClick={toggleCalendarFrom}
                              className='ml-1'
                            >
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.66675 1.66699V4.16699" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M13.3333 1.66699V4.16699" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M2.91675 7.5752H17.0834" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M17.5 7.08366V14.167C17.5 16.667 16.25 18.3337 13.3333 18.3337H6.66667C3.75 18.3337 2.5 16.667 2.5 14.167V7.08366C2.5 4.58366 3.75 2.91699 6.66667 2.91699H13.3333C16.25 2.91699 17.5 4.58366 17.5 7.08366Z" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M13.0788 11.4167H13.0863" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M13.0788 13.9167H13.0863" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M9.99632 11.4167H10.0038" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M9.99632 13.9167H10.0038" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M6.91185 11.4167H6.91933" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M6.91185 13.9167H6.91933" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>

                            </button>

                            {showCalendarFrom && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '100%',
                                  left: 0,
                                  zIndex: 1000,
                                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                  backgroundColor: '#ECE6F0',
                                  borderRadius: '8px',
                                }}
                              >
                                <DateCalendar
                                  value={selectedDateFrom}
                                  onChange={handleDateChangeFrom}
                                  sx={{
                                    '& .MuiDayPicker-day': {
                                      color: 'black', // Day font color
                                      '&:hover': {
                                        backgroundColor: 'green', // Hover date background
                                      },
                                    },
                                    '& .MuiDayPicker-day.Mui-selected': {
                                      backgroundColor: 'red', // Selected date background
                                      color: 'white', // Text color for selected date
                                    },
                                    '& .MuiDayPicker-day.MuiDayPicker-dayToday': {
                                      border: '2px solid black', // Today's date border
                                    },
                                    '& .MuiPickersCalendarHeader-label': {
                                      color: ' #2d2640', // Header text color
                                    },
                                    '& .MuiPickersArrowSwitcher-button svg path': {
                                      fill: '#2d2640', // Set the SVG color to red
                                    },
                                    // Change color of SVG inside the button with a specific class
                                    '& .MuiIconButton-root.MuiPickersCalendarHeader-switchViewButton svg path': {
                                      fill: '#2d2640', // Change SVG inside button to blue
                                    },
                                    '& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected': {
                                      backgroundColor: '#65558f', // Button background red
                                    },
                                    '& .MuiDayCalendar-weekDayLabel': {
                                      color: ' #2d2640', // Change font color of weekday labels to blue
                                      fontWeight: '200'
                                    },
                                    '& .MuiPickersYear-yearButton.Mui-selected': {
                                      backgroundColor: '#65558f', // Change the background color to red
                                    },
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </LocalizationProvider>






                    </div>
                  </div>
                  <div className='ml-4 text-sm flex items-center justify-center'>
                    <div htmlFor="From"
                      className='mr-4 text-[#6B6F7B]'
                    >To</div>
                   <div>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <div className="flex">
                            <DateField
                              value={selectedDateTo}
                              onChange={handleDateChangeTo}
                              format="DD/MM/YYYY"
                              sx={{
                                '& .MuiInputBase-input': {
                                  width: '105px', // Set width
                                  height: '2px', // Set height
                                  borderRadius: '20px', // Add border-radius

                                },
                                '& .MuiInputBase-root': {
                                  display: 'flex', // Set display to flex
                                  justifyContent: 'center', // Align items horizontally to center
                                  alignItems: 'center', // Align items vertically to center
                                },

                              }}
                            />

                            <button onClick={toggleCalendarTo}
                              className='ml-1'
                            >
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.66675 1.66699V4.16699" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M13.3333 1.66699V4.16699" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M2.91675 7.5752H17.0834" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M17.5 7.08366V14.167C17.5 16.667 16.25 18.3337 13.3333 18.3337H6.66667C3.75 18.3337 2.5 16.667 2.5 14.167V7.08366C2.5 4.58366 3.75 2.91699 6.66667 2.91699H13.3333C16.25 2.91699 17.5 4.58366 17.5 7.08366Z" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M13.0788 11.4167H13.0863" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M13.0788 13.9167H13.0863" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M9.99632 11.4167H10.0038" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M9.99632 13.9167H10.0038" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M6.91185 11.4167H6.91933" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M6.91185 13.9167H6.91933" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>

                            </button>

                            {showCalendarTo && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '100%',
                                  left: 0,
                                  zIndex: 1000,
                                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                  backgroundColor: '#ECE6F0',
                                  borderRadius: '8px',
                                }}
                              >
                                <DateCalendar
                                  value={selectedDateTo}
                                  onChange={handleDateChangeTo}
                                  sx={{
                                    '& .MuiDayPicker-day': {
                                      color: 'black', // Day font color
                                      '&:hover': {
                                        backgroundColor: 'green', // Hover date background
                                      },
                                    },
                                    '& .MuiDayPicker-day.Mui-selected': {
                                      backgroundColor: 'red', // Selected date background
                                      color: 'white', // Text color for selected date
                                    },
                                    '& .MuiDayPicker-day.MuiDayPicker-dayToday': {
                                      border: '2px solid black', // Today's date border
                                    },
                                    '& .MuiPickersCalendarHeader-label': {
                                      color: ' #2d2640', // Header text color
                                    },
                                    '& .MuiPickersArrowSwitcher-button svg path': {
                                      fill: '#2d2640', // Set the SVG color to red
                                    },
                                    // Change color of SVG inside the button with a specific class
                                    '& .MuiIconButton-root.MuiPickersCalendarHeader-switchViewButton svg path': {
                                      fill: '#2d2640', // Change SVG inside button to blue
                                    },
                                    '& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected': {
                                      backgroundColor: '#65558f', // Button background red
                                    },
                                    '& .MuiDayCalendar-weekDayLabel': {
                                      color: ' #2d2640', // Change font color of weekday labels to blue
                                      fontWeight: '200'
                                    },
                                    '& .MuiPickersYear-yearButton.Mui-selected': {
                                      backgroundColor: '#65558f', // Change the background color to red
                                    },
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </LocalizationProvider>






                    </div>
                  </div>

                </div>
                <div className='ml-5'>
                  <button
                    className='w-[63px] h-[32px] text-sm text-white rounded-full bg-[#007AFF]'
                    onClick={() => handelDateFilter()}
                  >
                    Go
                  </button>
                </div>





              </div>

              <div className='mt-4 flex items-center justify-center gap-x-2'>
                <button className='w-[76px] h-[32px] text-[#49454F] text-sm rounded-xl border border-[#CAC4D0]'>
                  7 Days
                </button>
                <button className='w-[76px] h-[32px] text-[#49454F] text-sm rounded-xl border border-[#CAC4D0]'>
                  30 Days
                </button>
                <button className='w-[76px] h-[32px] text-[#49454F] text-sm rounded-xl border border-[#CAC4D0]'>
                  6 Months
                </button>
                <button className='w-[76px] h-[32px] text-[#49454F] text-sm rounded-xl border border-[#CAC4D0]'>
                  1 Year
                </button>

              </div>
            </div>
            <div>
            </div>
          </div>




        </div>
















        <div className='mt-8'>
          <div className="pr-4 grid grid-cols-2 justify-around gap-x-20 gap-y-3">
            {roles.map((role, index) => (
              <div
                key={index}
                className="px-8 flex w-[532px] h-[40px] justify-between items-center bg-[#EBEBEB] rounded-full"
              >
                <div>
                  <span className='text-sm' >{role}</span>
                </div>
                <div className="flex space-x-2">
                  <div className='w-[101px] h-[24px] bg-[#E8DEF8] rounded-full text-[12px] flex items-center justify-evenly hover:scale-105 hover:duration-150'>
                    <div>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 11.25C9.625 11.25 10.1562 11.0313 10.5938 10.5938C11.0313 10.1562 11.25 9.625 11.25 9C11.25 8.375 11.0313 7.84375 10.5938 7.40625C10.1562 6.96875 9.625 6.75 9 6.75C8.375 6.75 7.84375 6.96875 7.40625 7.40625C6.96875 7.84375 6.75 8.375 6.75 9C6.75 9.625 6.96875 10.1562 7.40625 10.5938C7.84375 11.0313 8.375 11.25 9 11.25ZM9 12.75C7.9625 12.75 7.07813 12.3844 6.34688 11.6531C5.61563 10.9219 5.25 10.0375 5.25 9C5.25 7.9625 5.61563 7.07813 6.34688 6.34688C7.07813 5.61563 7.9625 5.25 9 5.25C10.0375 5.25 10.9219 5.61563 11.6531 6.34688C12.3844 7.07813 12.75 7.9625 12.75 9C12.75 10.0375 12.3844 10.9219 11.6531 11.6531C10.9219 12.3844 10.0375 12.75 9 12.75ZM3.75 9.75H0.75V8.25H3.75V9.75ZM17.25 9.75H14.25V8.25H17.25V9.75ZM8.25 3.75V0.75H9.75V3.75H8.25ZM8.25 17.25V14.25H9.75V17.25H8.25ZM4.8 5.8125L2.90625 3.99375L3.975 2.8875L5.775 4.7625L4.8 5.8125ZM14.025 15.1125L12.2063 13.2188L13.2 12.1875L15.0938 14.0063L14.025 15.1125ZM12.1875 4.8L14.0063 2.90625L15.1125 3.975L13.2375 5.775L12.1875 4.8ZM2.8875 14.025L4.78125 12.2063L5.8125 13.2L3.99375 15.0938L2.8875 14.025Z" fill="#4A4459" />
                      </svg>
                    </div>
                    <div className="text-[#4A4459] font-semibold hover:cursor-pointer">View</div>
                  </div>
                  <div className='w-[101px] h-[24px] border border-[#79747E] rounded-full text-[12px] flex items-center justify-evenly  hover:scale-105 hover:duration-150'>
                    <div>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L2.25 5.25L3.3 4.1625L5.25 6.1125V0H6.75V6.1125L8.7 4.1625L9.75 5.25L6 9ZM1.5 12C1.0875 12 0.734375 11.8531 0.440625 11.5594C0.146875 11.2656 0 10.9125 0 10.5V8.25H1.5V10.5H10.5V8.25H12V10.5C12 10.9125 11.8531 11.2656 11.5594 11.5594C11.2656 11.8531 10.9125 12 10.5 12H1.5Z" fill="#65558F" />
                      </svg>
                    </div>
                    <div className="text-[#65558F] font-bold hover:cursor-pointer">Download</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>








      {/* 2nd div */}































    </div>
  )
}

export default Analytics
