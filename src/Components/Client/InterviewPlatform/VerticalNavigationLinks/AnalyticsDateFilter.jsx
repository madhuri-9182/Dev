import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import CustomDatePicker from '../../../../utils/CustomDatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

function AnalyticsDateFilter() {
    const location = useLocation();
    const { dateFrom, dateTo, jobFilter } = location.state || {};



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

    useEffect(() => {
        setSelectedDateFrom(dateFrom)
        setSelectedDateTo(dateTo)

    })




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











    return (
        <div className=''>
            <div className=''>
                <div className="">
                    {/* Header Section */}
                    <div className="flex justify-between mb-4">

                        <div className='w-[40%]'>
                            <div className="space-y-2 mt-1">
                                {/* Domain Filter */}
                                <div className="flex items-center space-x-1">
                                    <span className="text-sm font-bold mr-2 flex">Jobs</span>
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
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </span>
                                            )}
                                            {jobs}
                                        </button>
                                    ))}
                                </div>


                            </div>

                        </div>

                        <div className='w-[60%] flex items-start justify-around'>


                            <div className='flex items-center justify-center'>
                                <div className='flex items-center justify-center'>
                                    <div htmlFor="From"
                                        className='mr-4 text-[#6B6F7B] text-sm'
                                    >From</div>












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

                                                    <button
                                                        // onClick={toggleCalendarFrom}
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

                                                    <button
                                                        // onClick={toggleCalendarTo}
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
                            <div>


                                <button className="w-[176px] h-[32px] bg-[#056DDC] text-sm rounded-full text-white flex items-center justify-center gap-x-3">
                                    <div>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 12L5.25 8.25L6.3 7.1625L8.25 9.1125V3H9.75V9.1125L11.7 7.1625L12.75 8.25L9 12ZM4.5 15C4.0875 15 3.73438 14.8531 3.44063 14.5594C3.14688 14.2656 3 13.9125 3 13.5V11.25H4.5V13.5H13.5V11.25H15V13.5C15 13.9125 14.8531 14.2656 14.5594 14.5594C14.2656 14.8531 13.9125 15 13.5 15H4.5Z" fill="white" />
                                        </svg>
                                    </div>
                                    <div>Download Report</div>
                                </button>
                            </div>
                        </div>
                    </div>




                    <div className='pt-8 pr-3 w-full flex justify-between'>

                        <div>
                            <div className="">
                                <h3 className="text-sm font-semibold text-center">STATUS INFO</h3>
                                <div className="mt-4 space-y-4">
                                    {[
                                        ["Total Candidates", 650],
                                        ["Total Interviews", 600],
                                        ["Top Performers", 50],
                                        ["Good Candidates", 120],
                                        ["Rejected", 400],
                                        ["Declined by Candidate", 20],
                                        ["Declined by Panel", 10],
                                    ].map(([label, value], index) => (
                                        <div
                                            key={index}
                                            className="bg-[#EBEBEB] w-[203px] h-[48px] p-2 gap-x-5 text-sm rounded-lg text-black flex items-center justify-between"
                                        >
                                            <div className='text-sm'>{label}</div>
                                            <div className=" bg-[#979797] text-white w-[32px] h-[32px] rounded-full flex items-center justify-center">{value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>






                        <div>
                            <div className="">
                                {/* Selected Candidates */}
                                <div className='w-[280px]'>
                                    <h3 className="text-sm font-semibold mb-2">SELECTED CANDIDATES</h3>
                                    <hr className='bg-[#4F4F4F] h-[3px] rounded-full' />
                                    <div className="">

                                        {[
                                            ["Cred", "23%"],
                                            ["Amazon", "20%"],
                                            ["Google", "15%"],
                                            ["Navi", "8%"],
                                            ["Quince", "5%"],
                                        ].map(([company, percentage], index) => (
                                            <div>


                                                <div
                                                    key={index}
                                                    className={`w-full h-[91px] p-3 pr-[25%] flex items-center justify-between ${index % 2 === 0 ? 'bg-white' : 'bg-[#FFFBEB]'
                                                        }`}
                                                >

                                                    <span className='font-semibold text-black'>{company}</span>
                                                    <span className="text-[#4F4F4F]">{percentage}</span>
                                                </div>
                                                <hr className='bg-gray-100 h-[1px] w-full' />
                                            </div>
                                        ))}
                                    </div>
                                </div>



                            </div>

                        </div>
                        <div>
                            <div className='w-[280px]'>
                                <h3 className="text-sm font-semibold mb-2">REJECTED CANDIDATES</h3>
                                <hr className='bg-[#4F4F4F] w-full h-[3px] rounded-full' />
                                <div className="">
                                    {[
                                        ["Rupeek", "23%"],
                                        ["Salesforce", "20%"],
                                        ["Adobe", "15%"],
                                        ["Zee", "8%"],
                                        ["Thoughtspot", "5%"],
                                    ].map(([company, percentage], index) => (
                                        <div>


                                            <div
                                                key={index}
                                                className={`w-full h-[91px] p-3 pr-[25%] flex items-center justify-between ${index % 2 === 0 ? 'bg-white' : 'bg-[#FFFBEB]'
                                                    }`}
                                            >
                                                <span className='font-semibold text-black'>{company}</span>
                                                <span className="text-[#4F4F4F]">{percentage}</span>
                                            </div>
                                            <hr className='bg-gray-100 h-[1px] w-full' />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>





                        <div>
                            <div className="">
                                <h3 className="text-sm font-semibold mb-2">RATIO DETAILS</h3>
                                <div className="space-y-4">
                                    <div className="w-[200px] h-[96px] bg-[#E5ECF6] p-4 rounded-xl text-gray-600">
                                        <p className='text-[#1C1C1C] text-sm'>Selection Ratio</p>
                                        <p className="text-2xl text-[#1C1C1C] font-bold">1:28</p>
                                    </div>
                                    <div className="w-[200px] h-[96px] bg-[#E5ECF6] p-4 rounded-xl text-gray-600">
                                        <p className='text-[#1C1C1C] text-sm'>Selection Ratio for Diversity</p>
                                        <p className="text-2xl text-[#1C1C1C] font-bold">1:6</p>
                                    </div>
                                    <div className="w-[200px] h-[96px] bg-[#E5ECF6] p-4 rounded-xl text-gray-600">
                                        <p className='text-[#1C1C1C] text-sm'>Total Male VS Female Profiles</p>
                                        <p className="text-2xl text-[#1C1C1C] font-bold">7:5</p>
                                    </div>
                                </div>
                            </div>
                        </div>










                    </div>

























                </div>
            </div>
        </div>
    )
}

export default AnalyticsDateFilter
