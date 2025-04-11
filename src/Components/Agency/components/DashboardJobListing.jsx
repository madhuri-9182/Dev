import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getErrorMessage,
  getJobLabel,
} from "../../../utils/util";
import {
  ErrorState,
  LoadingState,
} from "../../shared/loading-error-state";
import { useJobContext } from "../../../context/JobContext";
import { fetchJobs } from "../../Client/Jobs/api";
import { JobCard } from "../../Client/Jobs/JobListingComponents";
import { Pagination } from "@mui/material";
import Empty from "../../shared/Empty";
import useAuth from "../../../hooks/useAuth";
import PropTypes from "prop-types";

function DashboardJobListing({ jobStatus }) {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { currentPage, handleChangePage } = useJobContext();

  const queryFilters = useMemo(() => {
    return {
      page: currentPage,
      job_ids: jobStatus,
    };
  }, [currentPage, jobStatus]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["agency-jobs", queryFilters, auth],
    queryFn: fetchJobs,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleAddCandidateClick = (job) => {
    navigate("/agency/candidates/add-candidate", {
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

  if (isLoading) return <LoadingState />;
  if (isError)
    return <ErrorState message={getErrorMessage(error)} />;

  return data?.count ? (
    <>
      <div className="w-full flex flex-col gap-2">
        {data?.results.map((job, index) => (
          <JobCard
            key={job.id || index}
            job={job}
            onAddCandidate={handleAddCandidateClick}
          />
        ))}
      </div>

      <Pagination
        count={Math.ceil(data?.count / 10)}
        className="mt-4 flex justify-end"
        onChange={(e, page) => handleChangePage(page)}
        variant="outlined"
        size="small"
        shape="rounded"
        page={currentPage}
      />
    </>
  ) : (
    <Empty description="No Jobs Found" />
  );
}

DashboardJobListing.propTypes = {
  jobStatus: PropTypes.array,
};

export default DashboardJobListing;
