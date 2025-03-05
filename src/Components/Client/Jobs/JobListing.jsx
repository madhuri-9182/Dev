import { Fragment, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "@mui/material";
import PropTypes from "prop-types";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";

// Components
import AddButton from "../../shared/AddButton";
import ArchiveModal from "./ArchiveModal";

// Hooks & Utils
import { useJobContext } from "../../../context/JobContext";
import useAllJobs from "../../../hooks/useFetchAllJobs";
import {
  formatDate,
  revertDateFormat,
  getJobLabel,
} from "../../../utils/util";

// Sub-components
const FilterListbox = ({
  value,
  onChange,
  options,
  placeholder,
  className,
}) => (
  <Listbox value={value} onChange={onChange}>
    <div className="relative">
      <ListboxButton
        className={`relative custom-select w-full rounded-lg border border-[#979DA3] py-1 px-3 text-left text-2xs text-[#49454F] shadow-sm focus:outline-none ${className}`}
      >
        <span className="block truncate">
          {value || placeholder}
        </span>
      </ListboxButton>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-2xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {options.map((option) => (
            <ListboxOption
              key={option.value || option.id || option}
              value={option.value || option.id || option}
              className={({ active }) =>
                `${
                  active
                    ? "bg-[#007AFF] text-white"
                    : "text-gray-900"
                }
                relative cursor-pointer select-none py-2 px-3`
              }
            >
              <span className={`block truncate`}>
                {option.label || option.name || option}
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Transition>
    </div>
  </Listbox>
);

const JobCard = ({
  job,
  onView,
  onArchive,
  onAddCandidate,
}) => (
  <div className="rounded-2xl bg-[#EBEBEB80] flex justify-between items-center px-7 py-2">
    <div className="flex items-center justify-between gap-3 w-2/3">
      <p
        className="text-2xs uppercase cursor-pointer w-[30%]"
        onClick={() => onView(job)}
      >
        {getJobLabel(job.name)}
      </p>
      <div className="flex gap-4 w-[70%]">
        <button
          className="text-2xs font-semibold text-[#4A4459] bg-[#E8DEF8] w-20 py-1 flex items-center justify-center rounded-[100px] hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6]"
          onClick={() => onView(job)}
        >
          View
        </button>
        <button
          className="text-2xs font-semibold text-[#4A4459] bg-[#E8DEF8] w-36 py-1 flex items-center justify-center rounded-[100px] hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6]"
          onClick={() => onAddCandidate(job)}
        >
          + Add Candidate
        </button>
        <button
          className={`text-2xs font-semibold border border-[#79747E] w-24 py-1 flex items-center justify-center rounded-[100px] bg-transparent text-[#65558F] hover:bg-gray-100 ${
            job.reason_for_archived ? "invisible" : ""
          }`}
          onClick={() => onArchive(job.id)}
        >
          Archive
        </button>
      </div>
    </div>
    <div className="flex justify-end items-center gap-2">
      <p className="text-2xs font-medium">
        Active Candidates
      </p>
      <div className="w-6 h-6 bg-[#979DA3] text-white text-[10px] font-medium rounded-full flex items-center justify-center">
        {job.total_positions}
      </div>
    </div>
  </div>
);

// Helper function to extract unique personnel
const extractUniquePersonnel = (jobs) => {
  if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
    return {
      hiringManagers: [],
      recruiters: [],
    };
  }

  const hiringManagerIds = new Set();
  const recruiterIds = new Set();
  const hiringManagers = [];
  const recruiters = [];

  jobs.forEach((job) => {
    // Extract hiring managers
    if (
      job.hiring_manager &&
      job.hiring_manager.id &&
      job.hiring_manager.name
    ) {
      const { id, name } = job.hiring_manager;
      if (!hiringManagerIds.has(id)) {
        hiringManagerIds.add(id);
        hiringManagers.push({ id, name });
      }
    }

    // Extract recruiters
    if (job.clients && Array.isArray(job.clients)) {
      job.clients.forEach((client) => {
        if (client && client.id && client.name) {
          if (!recruiterIds.has(client.id)) {
            recruiterIds.add(client.id);
            recruiters.push({
              id: client.id,
              name: client.name,
            });
          }
        }
      });
    }
  });

  return { hiringManagers, recruiters };
};

// Main component
const JobListing = ({ data }) => {
  const { count, results } = data;
  const navigate = useNavigate();
  const {
    handleAddJobClick,
    handleShowJobDetails,
    handleArchiveModalOpen,
    handleChangePage,
    setFilters,
    filters,
    isArchiveModalOpen,
    setIsArchiveModalOpen,
    archiveId,
  } = useJobContext();
  const { data: allJobs } = useAllJobs();

  // Memoize derived data to prevent unnecessary recalculations
  const { hiringManagers, recruiters } = useMemo(
    () => extractUniquePersonnel(allJobs),
    [allJobs]
  );

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

  const handleArchiveModalClose = () =>
    setIsArchiveModalOpen(false);

  const handleAddCandidateClick = (job) => {
    navigate("/client/candidates/add-candidate", {
      state: {
        selectedJob: {
          id: job.id,
          name: job.name,
          label: getJobLabel(job.name),
          ...(job.specialization && {
            function: job.specialization,
          }),
        },
      },
    });
  };

  const handleResetFilters = () => {
    setFilters({
      post_job_date: "",
      job_ids: [],
      hiring_manager_ids: [],
      recruiter_ids: [],
      status: "Active",
    });
  };

  // Get display value for the job filter
  const getSelectedJobDisplay = () => {
    if (filters.job_ids.length === 0) return "All Jobs";

    return (
      Object.keys(groupedJobs).find((name) =>
        groupedJobs[name].some((id) =>
          filters.job_ids.includes(id)
        )
      ) || "All Jobs"
    );
  };

  // Get display value for the recruiter filter
  const getSelectedRecruiterDisplay = () => {
    if (filters.recruiter_ids.length === 0)
      return "Recruiters";

    return (
      recruiters.find(
        (r) => r.id === filters.recruiter_ids[0]
      )?.name || "Recruiters"
    );
  };

  // Get display value for the hiring manager filter
  const getSelectedManagerDisplay = () => {
    if (filters.hiring_manager_ids.length === 0)
      return "Hiring Manager";

    return (
      hiringManagers.find(
        (m) => m.id === filters.hiring_manager_ids[0]
      )?.name || "Hiring Manager"
    );
  };

  // Prepare job filter options
  const jobOptions = useMemo(() => {
    const options = [{ value: [], label: "All Jobs" }];

    Object.entries(groupedJobs).forEach(([name, ids]) => {
      options.push({ value: ids, label: name });
    });

    return options;
  }, [groupedJobs]);

  return (
    <>
      <div className="flex items-center justify-end gap-2 mb-4">
        <AddButton
          onClick={handleAddJobClick}
          label="+ Add Job"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        {/* Job Filter */}
        <div className="min-w-24">
          <FilterListbox
            value={getSelectedJobDisplay()}
            onChange={(selectedJob) => {
              setFilters({
                ...filters,
                job_ids: selectedJob,
              });
            }}
            options={jobOptions}
            placeholder="All Jobs"
          />
        </div>

        {/* Recruiter Filter */}
        <div className="min-w-32">
          <FilterListbox
            value={getSelectedRecruiterDisplay()}
            onChange={(selectedId) => {
              setFilters({
                ...filters,
                recruiter_ids: selectedId
                  ? [selectedId]
                  : [],
              });
            }}
            options={[
              { id: "", name: "Recruiters" },
              ...recruiters,
            ]}
            placeholder="Recruiters"
          />
        </div>

        {/* Hiring Manager Filter */}
        <div className="min-w-32">
          <FilterListbox
            value={getSelectedManagerDisplay()}
            onChange={(selectedId) => {
              setFilters({
                ...filters,
                hiring_manager_ids: selectedId
                  ? [selectedId]
                  : [],
              });
            }}
            options={[
              { id: "", name: "Hiring Manager" },
              ...hiringManagers,
            ]}
            placeholder="Hiring Manager"
          />
        </div>

        {/* Active/Archived Filter */}
        <div className="min-w-24">
          <FilterListbox
            value={filters.status || "Active"}
            onChange={(status) => {
              setFilters({
                ...filters,
                status,
              });
            }}
            options={[
              { value: "Active", label: "Active" },
              { value: "Archived", label: "Archived" },
            ]}
            placeholder="Status"
          />
        </div>

        {/* Date Filter */}
        <input
          type="date"
          max={new Date().toISOString().split("T")[0]}
          className="border border-[#979DA3] text-2xs py-1 px-3 rounded-lg min-w-24"
          onChange={(e) => {
            setFilters({
              ...filters,
              post_job_date: formatDate(e.target.value),
            });
          }}
          value={revertDateFormat(filters.post_job_date)}
        />

        {/* Reset button */}
        <button
          className="text-xs font-semibold text-[#4A4459] hover:text-[#007AFF] bg-transparent w-24 py-1 flex items-center"
          onClick={handleResetFilters}
        >
          Reset
        </button>
      </div>

      {/* Job List */}
      {count ? (
        <>
          <div className="w-full flex flex-col gap-2">
            {results.map((job, index) => (
              <JobCard
                key={job.id || index}
                job={job}
                onView={handleShowJobDetails}
                onArchive={handleArchiveModalOpen}
                onAddCandidate={handleAddCandidateClick}
              />
            ))}
          </div>

          <Pagination
            count={Math.ceil(count / 10)}
            className="mt-4 flex justify-end"
            onChange={(e, page) => handleChangePage(page)}
            variant="outlined"
            size="small"
            shape="rounded"
          />
        </>
      ) : (
        <p className="text-default font-semibold uppercase text-center text-[#6B6F7B]">
          No Jobs Found
        </p>
      )}

      {/* Archive Modal */}
      {isArchiveModalOpen && (
        <ArchiveModal
          isOpen={isArchiveModalOpen}
          onClose={handleArchiveModalClose}
          archiveId={archiveId}
          fromJobDetails={false}
        />
      )}
    </>
  );
};

JobListing.propTypes = {
  data: PropTypes.object.isRequired,
};

FilterListbox.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

JobCard.propTypes = {
  job: PropTypes.object.isRequired,
  onView: PropTypes.func.isRequired,
  onArchive: PropTypes.func.isRequired,
  onAddCandidate: PropTypes.func.isRequired,
};

export default JobListing;
