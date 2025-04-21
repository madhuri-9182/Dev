import { useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider } from "@mui/material/styles";
import PropTypes from "prop-types";
import { Calendar } from "iconsax-react";

/**
 * Component for past payments section with enhanced date pickers
 */
const PastPayments = ({
  theme,
  onDownloadClick,
  isLoading,
}) => {
  // State for date range
  const [dateRange, setDateRange] = useState({
    from: dayjs().subtract(1, "month"),
    to: dayjs(),
  });

  // State to track which date picker is open
  const [openPicker, setOpenPicker] = useState(null);

  // Handle date changes
  const handleDateChange = (field, date) => {
    if (!date) return;

    setDateRange((prev) => ({
      ...prev,
      [field]: date,
    }));

    // Auto-close the picker after selection
    setOpenPicker(null);
  };

  // Handle opening the date picker
  const handleOpenPicker = (field) => {
    setOpenPicker(field);
  };

  // Handle closing the date picker
  const handleClosePicker = () => {
    setOpenPicker(null);
  };

  return (
    <div className="md:w-[30%] mt-16">
      <div className="bg-[#E7E4E8CC] min-h-[50vh] rounded-2xl py-6 px-4 overflow-hidden shadow-lg">
        <div className="border-b border-[#D1CDD2] pb-3 px-6 mb-8">
          <h2 className="text-base font-bold text-center text-[#1C1C1C]">
            Past Payments
          </h2>
        </div>

        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/* Date range selector with improved design for clarity */}
            <div className="flex flex-col space-y-4 mb-8 px-4">
              {/* From date section - with updated colors and hover effect */}
              <div
                className="flex items-center px-3 py-2 bg-[#F2F0F3] rounded-lg shadow-sm cursor-pointer hover:bg-[#E7E4E8] hover:shadow transition-all"
                onClick={() => handleOpenPicker("from")}
              >
                <div className="mr-3">
                  <Calendar size={22} color="#6B5E75" />
                </div>
                <div className="flex-1">
                  <div className="text-gray-500 text-2xs font-medium mb-0.5">
                    From date
                  </div>
                  <div className="text-[#4A4453] font-[550] text-default">
                    {dateRange.from.format("DD MMM YYYY")}
                  </div>
                </div>
                <DatePicker
                  open={openPicker === "from"}
                  onOpen={() => handleOpenPicker("from")}
                  onClose={handleClosePicker}
                  value={dateRange.from}
                  onChange={(date) =>
                    handleDateChange("from", date)
                  }
                  closeOnSelect
                  disableFuture
                  format="DD MMM YYYY"
                  slotProps={{
                    textField: {
                      // Use a minimal size input that's still visible
                      sx: {
                        width: "1px",
                        height: "1px",
                        opacity: 0,
                        position: "absolute",
                        pointerEvents: "none",
                      },
                    },
                    popper: {
                      placement: "bottom-end", // Position at bottom-right of the container
                      sx: {
                        "& .MuiPaper-root": {
                          backgroundColor: "#F2F0F3",
                          boxShadow:
                            "0 4px 20px rgba(0,0,0,0.15)",
                          borderRadius: "8px",
                        },
                        "& .MuiPickersDay-root": {
                          color: "#4A4453",
                        },
                        "& .MuiPickersDay-root.Mui-selected":
                          {
                            backgroundColor: "#6B5E75",
                            color: "#F2F0F3",
                          },
                        "& .MuiPickersDay-root:hover": {
                          backgroundColor: "#E7E4E8",
                        },
                        "& .MuiPickersDay-root.Mui-selected:hover":
                          {
                            backgroundColor: "#5D5166",
                          },
                        "& .MuiDayCalendar-header": {
                          color: "#6B5E75",
                        },
                        "& .MuiPickersCalendarHeader-label":
                          {
                            color: "#4A4453",
                          },
                        "& .MuiPickersArrowSwitcher-button":
                          {
                            color: "#6B5E75",
                          },
                      },
                    },
                  }}
                />
              </div>

              {/* To date section - with updated colors and consistent hover effect */}
              <div
                className="flex items-center px-3 py-2 bg-[#F2F0F3] rounded-lg shadow-sm cursor-pointer hover:bg-[#E7E4E8] hover:shadow transition-all"
                onClick={() => handleOpenPicker("to")}
              >
                <div className="mr-3">
                  <Calendar size={22} color="#6B5E75" />
                </div>
                <div className="flex-1">
                  <div className="text-gray-500 text-2xs font-medium mb-0.5">
                    To date
                  </div>
                  <div className="text-[#4A4453] font-[550] text-default">
                    {dateRange.to.format("DD MMM YYYY")}
                  </div>
                </div>
                <DatePicker
                  open={openPicker === "to"}
                  onOpen={() => handleOpenPicker("to")}
                  onClose={handleClosePicker}
                  value={dateRange.to}
                  onChange={(date) =>
                    handleDateChange("to", date)
                  }
                  closeOnSelect
                  disableFuture
                  format="DD MMM YYYY"
                  slotProps={{
                    textField: {
                      // Use a minimal size input that's still visible
                      sx: {
                        width: "1px",
                        height: "1px",
                        opacity: 0,
                        position: "absolute",
                        pointerEvents: "none",
                      },
                    },
                    popper: {
                      placement: "bottom-end", // Position at bottom-right of the container
                      sx: {
                        "& .MuiPaper-root": {
                          backgroundColor: "#F2F0F3",
                          boxShadow:
                            "0 4px 20px rgba(0,0,0,0.15)",
                          borderRadius: "8px",
                        },
                        "& .MuiPickersDay-root": {
                          color: "#4A4453",
                        },
                        "& .MuiPickersDay-root.Mui-selected":
                          {
                            backgroundColor: "#6B5E75",
                            color: "#F2F0F3",
                          },
                        "& .MuiPickersDay-root:hover": {
                          backgroundColor: "#E7E4E8",
                        },
                        "& .MuiPickersDay-root.Mui-selected:hover":
                          {
                            backgroundColor: "#5D5166",
                          },
                        "& .MuiDayCalendar-header": {
                          color: "#6B5E75",
                        },
                        "& .MuiPickersCalendarHeader-label":
                          {
                            color: "#4A4453",
                          },
                        "& .MuiPickersArrowSwitcher-button":
                          {
                            color: "#6B5E75",
                          },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </LocalizationProvider>
        </ThemeProvider>

        {/* Download past payments button - Now with loading state */}
        <div className="flex justify-center mt-10 w-[90%] mx-auto">
          <button
            onClick={() =>
              onDownloadClick({
                from: dateRange.from.format("DD/MM/YYYY"),
                to: dateRange.to.format("DD/MM/YYYY"),
              })
            }
            disabled={isLoading}
            className="primary-button h-10 w-full flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Downloading...
              </>
            ) : (
              "Click to Download"
            )}
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
  isLoading: PropTypes.bool,
};
