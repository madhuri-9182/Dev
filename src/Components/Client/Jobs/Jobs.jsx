import JobListing from "./JobListing";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "./api";
import { useJobContext } from "../../../context/JobContext";
import {
  ErrorState,
  LoadingState,
} from "../../shared/loading-error-state";

const Jobs = () => {
  const { currentPage, filters } = useJobContext();

  const queryFilters = {
    page: currentPage,
    job_ids: filters.job_ids,
    hiring_manager_ids: filters.hiring_manager_ids,
    recruiter_ids: filters.recruiter_ids,
    post_job_date: filters.post_job_date,
    status: filters.status,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["jobs", queryFilters],
    queryFn: fetchJobs,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  return (
    <div className="m-0 px-3">
      <JobListing data={data} />
    </div>
  );
};

export default Jobs;
