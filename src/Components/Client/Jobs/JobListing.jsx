import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "@mui/material";
import PropTypes from "prop-types";

// Components
import AddButton from "../../shared/AddButton";
import ArchiveModal from "./ArchiveModal";
import {
  FilterTags,
  JobCard,
  FilterListbox,
} from "./JobListingComponents";
import { extractUniquePersonnel } from "./util";

// Hooks & Utils
import { useJobContext } from "../../../context/JobContext";
import useAllJobs from "../../../hooks/useFetchAllJobs";
import {
  formatDate,
  revertDateFormat,
  getJobLabel,
} from "../../../utils/util";
import useAuth from "../../../hooks/useAuth";
import { JOB_STATUS } from "../../Constants/constants";
import Empty from "../../shared/Empty";

// Sub-components

// Main component
const JobListing = ({ data }) => {
  const { auth } = useAuth();
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
      status: "active",
    });
  };

  const handleRemoveJobFilter = (jobId) => {
    setFilters({
      ...filters,
      job_ids: filters.job_ids?.filter(
        (id) => id !== jobId
      ),
    });
  };

  const handleRemoveRecruiterFilter = (recruiterId) => {
    setFilters({
      ...filters,
      recruiter_ids: filters.recruiter_ids?.filter(
        (id) => id !== recruiterId
      ),
    });
  };

  const handleRemoveManagerFilter = (managerId) => {
    setFilters({
      ...filters,
      hiring_manager_ids:
        filters.hiring_manager_ids?.filter(
          (id) => id !== managerId
        ),
    });
  };

  // Prepare job filter options
  const jobOptions = useMemo(() => {
    const options = [];

    Object.entries(groupedJobs).forEach(([name, ids]) => {
      options.push({ value: ids, label: name });
    });

    return options;
  }, [groupedJobs]);

  return (
    <>
      <div className="flex items-center justify-end gap-2 mb-4">
        {auth.role !== "client_user" ? (
          <AddButton
            onClick={handleAddJobClick}
            label="+ Add Job"
            className={"w-32"}
          />
        ) : null}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        {/* Job Filter */}
        <div className="min-w-36">
          <FilterListbox
            value={filters.job_ids}
            onChange={(selectedJobs) => {
              setFilters({
                ...filters,
                job_ids: selectedJobs,
              });
            }}
            options={jobOptions}
            placeholder="All Jobs"
            displayValue={
              filters.job_ids.length > 0
                ? `${filters.job_ids.length} Selected`
                : "All Jobs"
            }
            multiple={true}
          />
        </div>

        {/* Recruiter Filter */}
        <div className="min-w-32">
          <FilterListbox
            value={filters.recruiter_ids}
            onChange={(selectedIds) => {
              setFilters({
                ...filters,
                recruiter_ids: selectedIds,
              });
            }}
            options={[...recruiters]}
            placeholder="Recruiters"
            displayValue={
              filters.recruiter_ids.length > 0
                ? `${filters.recruiter_ids.length} Selected`
                : "Recruiters"
            }
            multiple={true}
          />
        </div>

        {/* Hiring Manager Filter */}
        <div className="min-w-32">
          <FilterListbox
            value={filters.hiring_manager_ids}
            onChange={(selectedIds) => {
              setFilters({
                ...filters,
                hiring_manager_ids: selectedIds,
              });
            }}
            options={[...hiringManagers]}
            placeholder="Hiring Manager"
            displayValue={
              filters.hiring_manager_ids.length > 0
                ? `${filters.hiring_manager_ids.length} Selected`
                : "Hiring Manager"
            }
            multiple={true}
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
            options={JOB_STATUS}
            displayValue={
              JOB_STATUS.find(
                (s) => s.value === filters.status
              )?.label || "Status"
            }
            placeholder="Status"
            multiple={false}
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

      <FilterTags
        jobFilters={filters.job_ids}
        recruiterFilters={filters.recruiter_ids}
        managerFilters={filters.hiring_manager_ids}
        groupedJobs={groupedJobs}
        recruiters={recruiters}
        hiringManagers={hiringManagers}
        onRemoveJobFilter={handleRemoveJobFilter}
        onRemoveRecruiterFilter={
          handleRemoveRecruiterFilter
        }
        onRemoveManagerFilter={handleRemoveManagerFilter}
      />

      {/* Job List */}
      {count ? (
         <>
         <div className="w-full flex flex-col gap-2">
           {results.map((job, index) => (
             <JobCard
               key={job.id || index}
               job={job}
               onView={handleShowJobDetails}
               onEdit={handleAddJobClick}
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
        <Empty description="No Jobs Found" />
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

export default JobListing;
