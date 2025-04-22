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

// Reusable role card component
const RoleCard = ({
  role,
  onViewClick,
  onDownloadClick,
}) => (
  <div className="rounded-2xl flex justify-between items-center px-7 py-2 shadow bg-[#EBEBEB80]">
    <span className="text-2xs uppercase">
      {getJobLabel(role.name)} (
      {getSpecialization(role.specialization)})
    </span>
    <div className="flex gap-x-2 items-center">
      <button
        type="button"
        onClick={() => onViewClick(role?.id)}
        className="text-2xs font-semibold w-24 py-1 tertiary-button"
      >
        <MdOutlineWbSunny className="text-sm mr-2" /> View
      </button>
      <button
        type="button"
        onClick={() => onDownloadClick(role?.id)}
        className="text-2xs font-semibold border border-[#79747E] w-28 py-1 flex items-center justify-center rounded-[100px] bg-transparent text-[#65558F] hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 transition-all"
      >
        <MdOutlineFileDownload className="mr-2 text-sm" />{" "}
        Download
      </button>
    </div>
  </div>
);

RoleCard.propTypes = {
  role: PropTypes.object,
  onViewClick: PropTypes.func,
  onDownloadClick: PropTypes.func,
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

  const handleViewClick = (id) => {
    navigate(`/client/analytics/${id}`, {
      state: {
        id: id,
        range: selectedDateRange,
      },
    });
  };

  const handleDownloadClick = (id) => {
    console.log(`Download report for ${id}`);
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
          />
        ))}
      </div>
    </div>
  );
};

export default Analytics;
