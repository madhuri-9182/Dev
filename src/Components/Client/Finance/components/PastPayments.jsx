import { useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider } from "@mui/material/styles";
import PropTypes from "prop-types";

/**
 * Component for past payments section with date pickers
 */
const PastPayments = ({ theme, onDownloadClick }) => {
  const [dateRange, setDateRange] = useState({
    from: dayjs().subtract(1, "month").format("DD/MM/YYYY"),
    to: dayjs().format("DD/MM/YYYY"),
  });

  // Parse date string in DD/MM/YYYY format to dayjs object
  const parseDate = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split("/");
    return dayjs(`${year}-${month}-${day}`);
  };

  // Handle date changes
  const handleDateChange = (field, date) => {
    if (!date) return;

    const formattedDate = date.format("DD/MM/YYYY");
    setDateRange((prev) => ({
      ...prev,
      [field]: formattedDate,
    }));
  };

  return (
    <div className="md:w-1/4 mt-16">
      <div className="bg-[#E7E4E8CC] min-h-[60vh] rounded-2xl py-6 px-4">
        <h2 className="text-base font-bold text-center text-[#1C1C1C] mb-8">
          Past Payments
        </h2>

        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="space-y-4">
              {/* From date input using Material UI DatePicker */}
              <div className="flex justify-between items-center px-3">
                <label className="text-[#6B6F7B] text-default">
                  From
                </label>
                <DatePicker
                  value={parseDate(dateRange.from)}
                  onChange={(date) =>
                    handleDateChange("from", date)
                  }
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        "& .MuiSvgIcon-root": {
                          fontSize: "15px",
                        },
                        "& .MuiInputAdornment-root": {
                          marginLeft: "0",
                          maxWidth: "24px",
                        },
                      },
                    },
                    // Make sure popper has white background
                    popper: {
                      sx: {
                        "& .MuiPaper-root": {
                          backgroundColor: "white",
                        },
                      },
                    },
                  }}
                  format="DD/MM/YYYY"
                />
              </div>

              {/* To date input using Material UI DatePicker */}
              <div className="flex justify-between items-center px-3">
                <label className="text-[#6B6F7B] text-default">
                  To
                </label>
                <DatePicker
                  value={parseDate(dateRange.to)}
                  onChange={(date) =>
                    handleDateChange("to", date)
                  }
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        "& .MuiSvgIcon-root": {
                          fontSize: "15px",
                        },
                        "& .MuiInputAdornment-root": {
                          marginLeft: "0",
                          maxWidth: "24px",
                        },
                      },
                    },
                    // Make sure popper has white background
                    popper: {
                      sx: {
                        "& .MuiPaper-root": {
                          backgroundColor: "white",
                        },
                      },
                    },
                  }}
                  format="DD/MM/YYYY"
                />
              </div>
            </div>
          </LocalizationProvider>
        </ThemeProvider>

        {/* Download past payments button */}
        <div className="flex justify-center mt-16 w-[90%] mx-auto">
          <button
            onClick={() => onDownloadClick(dateRange)}
            className={`
              py-2 px-6 rounded-full text-xs font-semibold text-white h-[32px] 
              bg-[#007AFF] transition-all duration-300 ease-in-out
              hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB]
              cursor-pointer
            `}
          >
            Click to Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default PastPayments;

PastPayments.propTypes = {
  theme: PropTypes.object,
  onDownloadClick: PropTypes.func,
};
