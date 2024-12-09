import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const theme = createTheme({
  components: {
    MuiPickersDay: {
      styleOverrides: {
        root: {
          color: '#490B3D', // Default day text color
          '&.Mui-selected': {
            backgroundColor: 'red', // Selected day background color
            color: '#fff', // Selected day text color
          },
          '&:hover': {
            backgroundColor: '#65558F', // Hover effect background color
            color: '#fff', // Hover effect text color
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#EAE7F5', // Set the calendar background color
          borderRadius: '12px', // Rounded corners
          padding: '16px', // Optional: Add padding
          height: '310px',
          width: 'max-content',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#490B3D', // Customize header text color
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: 'black', // Navigation arrows color
          '&:hover': {
            backgroundColor: 'rgba(189, 30, 81, 0.1)', // Hover effect for arrows
          },
        },
      },
    },
  },
});

export default function BasicDatePicker() {
  const [open, setOpen] = React.useState(false); // Hook used at top level

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          open={open}
          onOpen={() => setOpen(true)} // Handles opening the calendar
          onClose={() => setOpen(false)} // Handles closing the calendar
          renderInput={() => <div />} // Replace with a div (doesn't break rendering)
        />
        <IconButton onClick={() => setOpen(true)}>
        </IconButton>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
