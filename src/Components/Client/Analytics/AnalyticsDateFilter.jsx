import { useEffect, useState } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useQuery } from "@tanstack/react-query";
import {
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { Calendar } from "iconsax-react";
import axios from "../../../api/axios";
import {
  ErrorState,
  LoadingState,
} from "../../shared/loading-error-state";
import { getErrorMessage } from "../../../utils/util";
import { useAnalyticsPdfGenerator } from "./useAnalyticsPdfGenerator";
import { CompanyLogo } from "../../../assets";
import Empty from "../../shared/Empty";

// Status info card
const StatusCard = ({ label, value }) => (
  <div className="bg-[#EBEBEB80] rounded-2xl px-3 py-2 flex items-center justify-between gap-x-2 shadow-sm hover:shadow-md transition-shadow">
    <span className="text-xs font-medium">{label}</span>
    <span className="bg-[#979DA3] text-white w-8 h-8 rounded-full flex items-center justify-center text-default font-semibold">
      {value}
    </span>
  </div>
);

StatusCard.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

// Company percentage card component
const CompanyCard = ({ company, percentage, index }) => (
  <div>
    <div
      className={`w-full p-4 flex items-center justify-between ${
        index % 2 === 0 ? "bg-white" : "bg-[#FFC7001F]"
      }`}
    >
      <span className="font-semibold text-gray-800 text-default">
        {company}
      </span>
      <span className="text-gray-600 text-default">
        {percentage}%
      </span>
    </div>
    <hr className="border-gray-100" />
  </div>
);

CompanyCard.propTypes = {
  company: PropTypes.string,
  percentage: PropTypes.number,
  index: PropTypes.number,
};

// Ratio card component
const RatioCard = ({ title, value }) => (
  <div className="flex flex-col gap-2 p-4 bg-[#E5ECF6] rounded-2xl">
    <span className="text-2xs text-[#1C1C1C]">{title}</span>
    <span className="text-xl leading-5 text-[#171717]">
      {value}
    </span>
  </div>
);

RatioCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
};

// Enhanced Date Input component (Similar to screenshot)
const EnhancedDateInput = ({ value, onChange, isFrom }) => {
  const [openPicker, setOpenPicker] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleDateChange = (date) => {
    if (!date) return;
    onChange(date.format("YYYY-MM-DD"));
    setOpenPicker(false);
    setIsActive(false); // Reset active state when date is selected
  };

  // Create a custom theme that matches the analytics UI colors
  const datePickerTheme = createTheme({
    palette: {
      primary: {
        main: "#3B82F6", // Blue color to match the analytics UI
      },
      background: {
        paper: "#F9FAFB",
      },
      text: {
        primary: "#1F2937",
        secondary: "#6B7280",
      },
    },
  });

  // Format the date for display
  const formattedDate = value
    ? dayjs(value).format("DD MMM YYYY")
    : "";

  // Handle click on the date input
  const handleClick = () => {
    setOpenPicker(true);
    setIsActive(true);
  };

  // Handle closing the date picker
  const handleClose = () => {
    setOpenPicker(false);
    setIsActive(false);
  };

  return (
    <ThemeProvider theme={datePickerTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex items-center">
          <div
            className={`flex items-center px-6 py-2 bg-white cursor-pointer border-2  ${
              isActive
                ? "border-blue-500 rounded-md"
                : "border-white"
            } transition-all`}
            onClick={handleClick}
          >
            <div className="mr-3 text-blue-500">
              <Calendar size={30} />
            </div>
            <div className="flex-1">
              <div className="text-gray-500 text-xs font-medium mb-0.5">
                {isFrom ? "From date" : "To date"}
              </div>
              <div className="text-[#007aff] font-semibold text-sm">
                {formattedDate}
              </div>
            </div>
            <DatePicker
              open={openPicker}
              onOpen={() => setOpenPicker(true)}
              onClose={handleClose}
              value={value ? dayjs(value) : null}
              onChange={(date) => handleDateChange(date)}
              closeOnSelect
              disableFuture
              format="DD MMM YYYY"
              slotProps={{
                textField: {
                  sx: {
                    width: "1px",
                    height: "1px",
                    opacity: 0,
                    position: "absolute",
                    pointerEvents: "none",
                  },
                },
                popper: {
                  placement: "bottom-end",
                  sx: {
                    "& .MuiPaper-root": {
                      backgroundColor: "#F9FAFB",
                      boxShadow:
                        "10 10px 20px rgba(0,0,0,0.08)",
                      borderRadius: "8px",
                      position: "absolute",
                      top: "-20px",
                      right: "-130px",
                    },
                    "& .MuiPickersDay-root": {
                      color: "#4B5563",
                    },
                    "& .MuiPickersDay-root.Mui-selected": {
                      backgroundColor: "#3B82F6",
                      color: "#FFFFFF",
                    },
                    "& .MuiPickersDay-root:hover": {
                      backgroundColor: "#EFF6FF",
                    },
                    "& .MuiPickersDay-root.Mui-selected:hover":
                      {
                        backgroundColor: "#2563EB",
                      },
                    "& .MuiDayCalendar-header": {
                      color: "#4B5563",
                    },
                    "& .MuiPickersCalendarHeader-label": {
                      color: "#111827",
                    },
                    "& .MuiPickersArrowSwitcher-button": {
                      color: "#3B82F6",
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

EnhancedDateInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  isFrom: PropTypes.bool,
};

const AnalyticsDetail = () => {
  const { state } = useLocation();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [datesInitialized, setDatesInitialized] =
    useState(false);
  const { isGeneratingPdf, generateAnalyticsReport } =
    useAnalyticsPdfGenerator();

  // Function to calculate dates based on range
  const calculateDates = (range) => {
    const today = new Date();
    const endDate = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD

    let startDate;
    switch (range) {
      case "7days":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case "30days":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        break;
      case "6months":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 6);
        break;
      case "1year":
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        // Default to 7 days if no range or invalid range
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
    }

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate,
    };
  };

  // Effect to initialize dates only once
  useEffect(() => {
    // If dates are already initialized, exit early
    if (datesInitialized) return;

    // Initialize dates based on range
    let dates;
    if (state?.range) {
      dates = calculateDates(state.range);
    } else {
      // Fallback to default dates if no range is provided
      dates = calculateDates("7days");
    }
    setStartDate(dates.startDate);
    setEndDate(dates.endDate);
    setDatesInitialized(true);
  }, [state?.range, datesInitialized]);

  function formatDate(dateString) {
    if (!dateString) return "";

    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["analytics", startDate, endDate, state?.id],
    queryFn: async () => {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      const response = await axios.get(
        `/api/client/candidate-analysis/${state?.id}`,
        {
          params: {
            from_date: formattedStartDate,
            to_date: formattedEndDate,
          },
        }
      );
      return response.data;
    },
    enabled: !!startDate && !!endDate && !!state?.id,
  });

  // Custom date update functions
  const handleStartDateChange = (date) => {
    setStartDate(date);
    // No need to set datesInitialized here as it's already true
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    // No need to set datesInitialized here as it's already true
  };

  // Handle PDF generation when download button is clicked
  const handleDownloadReport = async () => {
    if (!data?.data) {
      console.error("No data available for PDF generation");
      return;
    }

    const analyticsData = data?.data;
    const logoPath = CompanyLogo; // Replace with your actual logo path

    // Format the data for PDF generation
    const selectedCandidates = Object.entries(
      analyticsData?.selected_candidates || {}
    ).map(([company, value]) => ({
      company,
      percentage: value,
    }));

    const rejectedCandidates = Object.entries(
      analyticsData?.rejected_candidates || {}
    ).map(([company, value]) => ({
      company,
      percentage: value,
    }));

    // Format the status info entries
    const statusInfoEntries = [
      {
        label: "Total Candidates",
        value: analyticsData?.status_info.total_candidates,
      },
      {
        label: "Total Interviews",
        value: analyticsData?.status_info.total_interviews,
      },
      {
        label: "Top Performers",
        value: analyticsData?.status_info.top_performers,
      },
      {
        label: "Good Candidates",
        value: analyticsData?.status_info.good_candidates,
      },
      {
        label: "Rejected",
        value: analyticsData?.status_info.rejected,
      },
      {
        label: "Declined by Candidate",
        value:
          analyticsData.status_info.declined_by_candidate,
      },
    ];

    await generateAnalyticsReport(
      analyticsData,
      statusInfoEntries,
      selectedCandidates,
      rejectedCandidates,
      startDate,
      endDate,
      logoPath
    );
  };

  if (isLoading) return <LoadingState />;
  if (isError)
    return <ErrorState message={getErrorMessage(error)} />;

  const analyticsData = data?.data;

  const selectedCandidates = Object.entries(
    analyticsData?.selected_candidates || {}
  ).map(([company, value]) => ({
    company,
    percentage: value,
  }));

  const rejectedCandidates = Object.entries(
    analyticsData?.rejected_candidates || {}
  ).map(([company, value]) => ({
    company,
    percentage: value,
  }));

  // Format the status info entries
  const statusInfoEntries = [
    {
      label: "Total Candidates",
      value: analyticsData?.status_info.total_candidates,
    },
    {
      label: "Total Interviews",
      value: analyticsData?.status_info.total_interviews,
    },
    {
      label: "Top Performers",
      value: analyticsData?.status_info.top_performers,
    },
    {
      label: "Good Candidates",
      value: analyticsData?.status_info.good_candidates,
    },
    {
      label: "Rejected",
      value: analyticsData?.status_info.rejected,
    },
    {
      label: "Declined by Candidate",
      value:
        analyticsData?.status_info.declined_by_candidate,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8 pt-2 overflow-y-auto">
      {/* Header with enhanced date filters and download button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16">
        <h2 className="text-base font-semibold text-[#49454F]">
          {state?.jobName} ({state?.specialization})
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center ">
            <EnhancedDateInput
              value={startDate}
              onChange={handleStartDateChange}
              isFrom={true}
            />
            {/* Vertical separator */}
            <div className="h-12 w-px bg-gray-300"></div>
            <EnhancedDateInput
              value={endDate}
              onChange={handleEndDateChange}
              isFrom={false}
            />
          </div>

          <button
            className="primary-button gap-x-2 ml-4"
            onClick={handleDownloadReport}
            disabled={isGeneratingPdf}
          >
            <MdOutlineFileDownload className="text-base" />
            {isGeneratingPdf
              ? "Generating..."
              : "Download Report"}
          </button>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr_1.25fr_1fr] gap-x-12">
        {/* Status info section */}
        <div className="lg:col-span-1">
          <h3 className="text-sm font-semibold mb-4 text-center uppercase">
            Status Info
          </h3>
          <div className="space-y-3">
            {statusInfoEntries.map((item, index) => (
              <StatusCard
                key={index}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>
        </div>

        {/* Selected candidates section */}
        <div className="lg:col-span-1">
          <h3 className="text-sm font-semibold mb-2 uppercase">
            Selected Candidates
          </h3>
          <hr className="h-1 bg-gray-800 rounded-full mb-2" />
          <div>
            {selectedCandidates.map((item, index) => (
              <CompanyCard
                key={index}
                company={item.company}
                percentage={item.percentage}
                index={index}
              />
            ))}
            {selectedCandidates.length === 0 && <Empty />}
          </div>
        </div>

        {/* Rejected candidates section */}
        <div className="lg:col-span-1">
          <h3 className="text-sm font-semibold mb-2 uppercase">
            Rejected Candidates
          </h3>
          <hr className="h-1 bg-gray-800 rounded-full mb-2" />
          <div>
            {rejectedCandidates.map((item, index) => (
              <CompanyCard
                key={index}
                company={item.company}
                percentage={item.percentage}
                index={index}
              />
            ))}
            {rejectedCandidates.length === 0 && <Empty />}
          </div>
        </div>

        {/* Ratio details section */}
        <div className="lg:col-span-1">
          <h3 className="text-sm font-semibold mb-2 uppercase">
            Ratio Details
          </h3>
          <div className="space-y-4">
            <RatioCard
              title="Selection Ratio"
              value={
                analyticsData?.ratio_details
                  .selection_ratio || "N/A"
              }
            />
            <RatioCard
              title="Selection Ratio for Diversity"
              value={
                analyticsData?.ratio_details
                  .selection_ratio_for_diversity || "N/A"
              }
            />
            <RatioCard
              title="Total Male vs Female Profiles"
              value={
                analyticsData?.ratio_details
                  .total_male_vs_female || "N/A"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDetail;
