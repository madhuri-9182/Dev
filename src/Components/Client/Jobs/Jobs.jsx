import JobListing from "./JobListing";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "./api";
import { useJobContext } from "../../../context/JobContext";
import {
  ErrorState,
  LoadingState,
} from "../../shared/loading-error-state";
import useAuth from "../../../hooks/useAuth";
import { useMemo, useState } from "react";
import useAllJobs from "../../../hooks/useFetchAllJobs";
import { extractUniquePersonnel } from "./util";
import { useLocation } from "react-router-dom";
import { getErrorMessage } from "../../../utils/util";

const Jobs = () => {
  const { auth } = useAuth();
  const { state } = useLocation();
  const { currentPage, setCurrentPage } = useJobContext();

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
  const jobStatus = groupedJobs?.[state?.job_role]
    ? [groupedJobs?.[state?.job_role]]
    : [];
  const [filters, setFilters] = useState({
    post_job_date: "",
    job_ids: jobStatus,
    hiring_manager_ids: [],
    recruiter_ids: [],
    status: "active",
  });

  const queryFilters = useMemo(() => {
    return {
      page: currentPage,
      job_ids: filters.job_ids,
      hiring_manager_ids: filters.hiring_manager_ids,
      recruiter_ids: filters.recruiter_ids,
      post_job_date: filters.post_job_date,
      status: filters.status,
    };
  }, [currentPage, filters]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["jobs", queryFilters, auth],
    queryFn: fetchJobs,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <LoadingState />;
  if (isError)
    return <ErrorState message={getErrorMessage(error)} />;

  return (
    <div className="m-0 px-3">
      <JobListing
        data={data}
        groupedJobs={groupedJobs}
        hiringManagers={hiringManagers}
        recruiters={recruiters}
        filters={filters}
        setFilters={(value) => {
          setFilters(value);
          setCurrentPage(1);
        }}
      />
    </div>
  );
};

export default Jobs;
