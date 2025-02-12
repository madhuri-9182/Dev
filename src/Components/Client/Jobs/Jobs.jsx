import { useEffect, useState } from "react";
import ArchiveModal from "./ArchiveModal";
import { AnimatePresence } from "framer-motion";
import JobListing from "./JobListing";
import AddJob from "./AddJob";
import JobDetails from "./JobDetails";
import axios from "../../../api/axios";
import { useQuery } from "@tanstack/react-query";

const fetchJobs = async ({ queryKey }) => {
  const [
    // eslint-disable-next-line no-unused-vars
    _key,
    {
      page,
      job_ids,
      hiring_manager_ids,
      recruiter_ids,
      post_job_date,
    },
  ] = queryKey;

  const params = {
    limit: 10,
    offset: (page - 1) * 10,
    ...(job_ids.length
      ? { job_ids: job_ids.join(",") }
      : {}),
    ...(hiring_manager_ids.length
      ? { hiring_manager_ids: hiring_manager_ids.join(",") }
      : {}),
    ...(recruiter_ids.length
      ? { recruiter_ids: recruiter_ids.join(",") }
      : {}),
    ...(post_job_date
      ? { post_job_date: post_job_date }
      : {}),
  };

  const response = await axios.get("/api/client/jobs/", {
    params,
  });
  return response.data;
};

const Jobs = () => {
  const [isArchiveModalOpen, setIsArchiveModalOpen] =
    useState(false);
  const [activePage, setActivePage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [archiveId, setArchiveId] = useState(null);
  const [allJobs, setAllJobs] = useState([]);
  const [filters, setFilters] = useState({
    post_job_date: "",
    job_ids: [],
    hiring_manager_ids: [],
    recruiter_ids: [],
  });
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
    if (allJobs.length === 0 && data) {
      setAllJobs(data.results);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleArchiveModalOpen = (id) => {
    setArchiveId(id);
    setIsArchiveModalOpen(true);
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleArchiveModalClose = () => {
    setIsArchiveModalOpen(false);
  };

  const handleShowJobDetails = (data) => {
    if (data) {
      setSelectedUser(data);
    }
    setActivePage(2);
  };

  const handleAddJobClick = (data) => {
    if (data) {
      setSelectedUser(data);
    }
    setActivePage(1);
  };

  if (activePage === 0 && isLoading)
    return <div>Loading...</div>;
  if (activePage === 0 && isError)
    return <div>Error...</div>;

  return (
    <div className="m-0 p-5">
      {/* Top Section */}
      {activePage === 0 ? (
        <JobListing
          handleAddJobClick={handleAddJobClick}
          handleShowJobDetails={handleShowJobDetails}
          handleArchiveModalOpen={handleArchiveModalOpen}
          handleChangePage={handleChangePage}
          data={data}
          setFilters={setFilters}
          filters={filters}
          allJobs={allJobs}
        />
      ) : activePage === 1 ? (
        <AddJob
          selectedUser={selectedUser}
          onBack={() => {
            setSelectedUser(null);
            setActivePage(0);
          }}
        />
      ) : (
        activePage === 2 && (
          <JobDetails selectedUser={selectedUser} />
        )
      )}

      {/* Archive Modal */}
      {isArchiveModalOpen && (
        <AnimatePresence>
          <ArchiveModal
            isOpen={isArchiveModalOpen}
            onClose={handleArchiveModalClose}
            archiveId={archiveId}
          />
        </AnimatePresence>
      )}
    </div>
  );
};

export default Jobs;
