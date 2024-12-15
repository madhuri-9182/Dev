import * as React from 'react';
import dayjs from 'dayjs';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

export default function ResponsiveDatePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoItem>
        <DesktopDatePicker
          defaultValue={dayjs('2022-04-17')}
          format='ddd, DD/MM/YYYY'
          sx={{
            '& .MuiOutlinedInput-root': {
              border: 'none', // Remove the border
              '& fieldset': {
                border: 'none', // Remove the fieldset border
              },
              '& input': {
                fontSize: '28px', // Adjust input text size if needed
              },
            },
          }}
          slotProps={{
            popper: {
              sx: {
                '& .MuiPaper-root': {
                  backgroundColor: '#ECE6F0', // Calendar background color
                  height:'300px'
                },
              },
            },
            day: {
              sx: {
                width: '36px', // Reduce the width of each day cell
                height: '36px', // Reduce the height of each day cell
                '&:hover': {
                  backgroundColor: '#8e80b3', // Hover effect background color
                },
                '&.Mui-selected': {
                  backgroundColor: '#65558F', // Selected date background color
                  color: 'white', // Text color for selected date
                },
              },
            },
            // Change font color of month and year in the calendar header
            toolbar: {
              sx: {
                '& .MuiTypography-root': {
                  color: 'green', // Set the font color to green for the month and year
                  fontSize: '18px', // Optionally adjust the font size
                },
              },
            },
          }}
        />
      </DemoItem>
    </LocalizationProvider>
  );
}
