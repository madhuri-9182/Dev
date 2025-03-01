import { useEffect } from "react";
import JobListing from "./JobListing";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "./api";
import { useJobContext } from "../../../context/JobContext";

const Jobs = () => {
  const { currentPage, filters, setAllJobs } =
    useJobContext();

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "jobs",
      {
        page: currentPage,
        job_ids: filters.job_ids,
        hiring_manager_ids: filters.hiring_manager_ids,
        recruiter_ids: filters.recruiter_ids,
        post_job_date: filters.post_job_date,
      },
    ],
    queryFn: fetchJobs,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data?.results && data.results.length > 0) {
      setAllJobs(data.results);
    }
  }, [data, setAllJobs]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;

  return (
    <div className="m-0 px-3">
      <JobListing data={data} />
    </div>
  );
};

export default Jobs;
