import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { FilterGroup } from "../Candidates/components/FilterGroup";
import useAllJobs from "../../../hooks/useFetchAllJobs";
import {
  getErrorMessage,
  getJobLabel,
  getSpecialization,
} from "../../../utils/util";
import {
  ErrorState,
  LoadingState,
} from "../../shared/loading-error-state";
import {
  MdOutlineWbSunny,
  MdOutlineFileDownload,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAnalyticsPdfGenerator } from "./useAnalyticsPdfGenerator";
import axios from "../../../api/axios";
import { CompanyLogo } from "../../../assets";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const formatDate = (dateString) => {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

// Reusable role card component
const RoleCard = ({
  role,
  onViewClick,
  onDownloadClick,
  isDownloading,
}) => (
  <div className="rounded-2xl flex justify-between items-center px-7 py-2 shadow bg-[#EBEBEB80]">
    <span className="text-2xs uppercase">
      {getJobLabel(role.name)} (
      {getSpecialization(role.specialization)})
    </span>
    <div className="flex gap-x-2 items-center">
      <button
        type="button"
        onClick={() => onViewClick(role)}
        className="text-2xs font-semibold w-24 py-1 tertiary-button"
      >
        <MdOutlineWbSunny className="text-sm mr-2" /> View
      </button>
      <button
        type="button"
        onClick={() => onDownloadClick(role?.id)}
        disabled={isDownloading}
        className="text-2xs font-semibold border border-[#79747E] w-28 py-1 flex items-center justify-center rounded-[100px] bg-transparent text-[#65558F] hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 transition-all disabled:opacity-70 disabled:hover:bg-transparent"
      >
        {isDownloading ? (
          <Loader2 className="animate-spin text-sm mr-2 w-3 h-3" />
        ) : (
          <MdOutlineFileDownload className="text-sm mr-2" />
        )}{" "}
        {isDownloading ? "Downloading..." : "Download"}
      </button>
    </div>
  </div>
);

RoleCard.propTypes = {
  role: PropTypes.object,
  onViewClick: PropTypes.func,
  onDownloadClick: PropTypes.func,
  isDownloading: PropTypes.bool,
};

const Analytics = () => {
  const navigate = useNavigate();
  const {
    data: allJobs,
    isLoading,
    isError,
    error,
  } = useAllJobs();

  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDateRange, setSelectedDateRange] =
    useState("7days");
  const [downloadingJobs, setDownloadingJobs] = useState(
    {}
  );
  const { generateAnalyticsReport } =
    useAnalyticsPdfGenerator();

  // Calculate date range based on selection
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

  const groupedJobs = useMemo(() => {
    if (!allJobs) return {};

    return allJobs.reduce((acc, job) => {
      if (job && job.name) {
        if (!acc[job.name]) {
          acc[job.name] = [];
        }
        acc[job.name].push(job.id);
      }
      return acc;
    }, {});
  }, [allJobs]);

  const jobOptions = useMemo(() => {
    const options = [];

    Object.entries(groupedJobs).forEach(([name, ids]) => {
      options.push({ value: ids, label: name });
    });

    return options;
  }, [groupedJobs]);

  // Filter jobs based on selected role
  const filteredJobs = useMemo(() => {
    if (!allJobs) return [];

    // If no role is selected or "All Jobs" is selected, show all jobs
    if (!selectedRole) {
      return allJobs;
    }

    // Find which jobs match the selected role IDs
    return allJobs.filter((job) => {
      // Check if the job's ID is in the selected role IDs array
      if (Array.isArray(selectedRole)) {
        return selectedRole.includes(job.id);
      }
      // If selectedRole is a single ID string
      return job.id === selectedRole;
    });
  }, [allJobs, selectedRole]);

  const handleViewClick = (role) => {
    navigate(`/client/analytics/${role?.id}`, {
      state: {
        id: role?.id,
        range: selectedDateRange,
        jobName: getJobLabel(role?.name),
        specialization: getSpecialization(
          role?.specialization
        ),
      },
    });
  };

  const handleDownloadClick = async (id) => {
    try {
      // Set this job as downloading
      setDownloadingJobs((prev) => ({
        ...prev,
        [id]: true,
      }));

      // Calculate date range based on selection
      const { startDate, endDate } = calculateDates(
        selectedDateRange
      );

      // Format dates for API
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);

      // Fetch analytics data for this job
      const response = await axios.get(
        `/api/client/candidate-analysis/${id}`,
        {
          params: {
            from_date: formattedStartDate,
            to_date: formattedEndDate,
          },
        }
      );

      const analyticsData = response.data.data;
      if (!analyticsData) {
        throw new Error("No data available");
      }

      // Format data for PDF generation
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
          value:
            analyticsData?.status_info.total_candidates,
        },
        {
          label: "Total Interviews",
          value:
            analyticsData?.status_info.total_interviews,
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

      // Generate the PDF
      await generateAnalyticsReport(
        analyticsData,
        statusInfoEntries,
        selectedCandidates,
        rejectedCandidates,
        startDate,
        endDate,
        CompanyLogo
      );
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error(
        error.message || "Failed to download report"
      );
    } finally {
      // Clear downloading state for this job
      setDownloadingJobs((prev) => ({
        ...prev,
        [id]: false,
      }));
    }
  };

  const jobRoles = jobOptions.map((option) => ({
    id: option.value,
    name: option.label,
  }));

  if (isLoading) return <LoadingState />;
  if (isError)
    return <ErrorState message={getErrorMessage(error)} />;

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8 pt-2">
      <div className="mb-8">
        <div className="flex flex-col space-y-2">
          <FilterGroup
            label={"Roles"}
            options={[
              {
                id: "",
                name: "All Jobs",
              },
              ...jobRoles,
            ]}
            selectedOption={selectedRole}
            onSelect={(value) => setSelectedRole(value)}
            disabled={false}
          />
          <FilterGroup
            label={"Date Range"}
            options={[
              { id: "7days", name: "7 Days" },
              { id: "30days", name: "30 Days" },
              { id: "6months", name: "6 Months" },
              { id: "1year", name: "1 Year" },
            ]}
            selectedOption={selectedDateRange}
            onSelect={(value) =>
              setSelectedDateRange(value)
            }
            disabled={false}
          />
        </div>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
        {filteredJobs.map((role, index) => (
          <RoleCard
            key={index}
            role={role}
            onViewClick={handleViewClick}
            onDownloadClick={handleDownloadClick}
            isDownloading={
              downloadingJobs[role.id] || false
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Analytics;
