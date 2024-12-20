import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function CustomDatePicker() {
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [showCalendar, setShowCalendar] = React.useState(false);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setShowCalendar(false);
        // Save the selected date to local storage
        localStorage.setItem("selectedDate", date.toISOString());
    };

    const toggleCalendar = () => {
        setShowCalendar((prev) => !prev);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <div className="flex">
                    <DateField
                        value={selectedDate}
                        onChange={handleDateChange}
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

                    <button onClick={toggleCalendar}
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

                    {showCalendar && (
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
                                value={selectedDate}
                                onChange={handleDateChange}
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
    );
}
