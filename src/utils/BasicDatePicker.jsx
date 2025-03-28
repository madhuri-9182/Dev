import { useEffect } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

const BasicDatePicker = ({
  selectedDate,
  setSelectedDate,
}) => {
  // Set default date to tomorrow
  const tomorrow = dayjs().add(1, "day");

  // Initialize with tomorrow's date if no selectedDate is provided
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(tomorrow);
    }
  }, [selectedDate, setSelectedDate, tomorrow]);

  // Handle date change
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoItem>
        <DesktopDatePicker
          value={selectedDate || tomorrow}
          onChange={handleDateChange}
          format="ddd, DD/MM/YYYY"
          disablePast={true} // Disable past dates
          sx={{
            "& .MuiOutlinedInput-root": {
              border: "none",
              "& fieldset": {
                border: "none",
              },
              "& input": {
                fontSize: "18px",
              },
            },
          }}
          slotProps={{
            popper: {
              sx: {
                "& .MuiPaper-root": {
                  backgroundColor: "#ECE6F0",
                  maxHeight: "330px",
                },
              },
            },
            day: {
              sx: {
                width: "36px",
                height: "36px",
                "&:hover": {
                  backgroundColor: "#8e80b3",
                },
                "&.Mui-selected": {
                  backgroundColor: "#65558F",
                  color: "white",
                },
              },
            },
            toolbar: {
              sx: {
                "& .MuiTypography-root": {
                  color: "#65558F",
                  fontSize: "16px",
                },
              },
            },
          }}
        />
      </DemoItem>
    </LocalizationProvider>
  );
};

export default BasicDatePicker;

BasicDatePicker.propTypes = {
  selectedDate: PropTypes.object,
  setSelectedDate: PropTypes.func,
};
