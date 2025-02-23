import { useEffect, useState } from "react";
import ArchiveModal from "./ArchiveModal";
import { AnimatePresence } from "framer-motion";
import JobListing from "./JobListing";
import AddJob from "./AddJob";
import JobDetails from "./JobDetails";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "./api";
import { createFileFromUrl } from "../../../utils/util";

const Jobs = () => {
  const [isArchiveModalOpen, setIsArchiveModalOpen] =
    useState(false);
  const [activePage, setActivePage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedData, setSelectedData] = useState(null);
  const [archiveId, setArchiveId] = useState(null);
  const [allJobs, setAllJobs] = useState([]);
  const [filters, setFilters] = useState({
    post_job_date: "",
    job_ids: [],
    hiring_manager_ids: [],
    recruiter_ids: [],
  });
  const [formdata, setFormdata] = useState({
    name: "",
    job_id: "",
    recruiter_ids: [],
    hiring_manager_id: "",
    total_positions: "",
    mandatory_skills: [],
    interview_time: "01:00:00",
    job_description_file: undefined,
    other_details: [],
    reason_for_archived: "",
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
      setSelectedData(data);
    }
    setActivePage(2);
  };

  const handleAddJobClick = (data) => {
    if (data) {
      setSelectedData(data);
    }
    setActivePage(1);
  };

  const isEdit =
    selectedData &&
    typeof selectedData === "object" &&
    !selectedData.nativeEvent;

  useEffect(() => {
    if (isEdit) {
      async function handleFileConversion(selectedData) {
        if (
          !selectedData ||
          !selectedData.job_description_file
        ) {
          console.error(
            "Job description file path is missing"
          );
          return;
        }
        const file = await createFileFromUrl(
          selectedData.job_description_file
        );

        if (file) {
          return file;
        }
      }
      const fetchFile = async () => {
        const file = await handleFileConversion(
          selectedData
        );

        setFormdata({
          ...selectedData,
          hiring_manager_id:
            selectedData.hiring_manager?.id,
          recruiter_ids: selectedData.clients.map(
            (client) => client.id
          ),
          total_positions: String(
            selectedData.total_positions
          ),
          job_description_file: file, // Now it's a resolved File object
        });
      };
      fetchFile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedData]);

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
          isEdit={isEdit}
          onBack={() => {
            setFormdata({});
            setSelectedData(null);
            setActivePage(0);
          }}
          onSubmit={() => {
            setActivePage(2);
          }}
          formdata={formdata}
          setFormdata={setFormdata}
        />
      ) : (
        activePage === 2 && (
          <JobDetails
            onBack={() => {
              setActivePage(1);
            }}
            onSubmit={() => {
              setSelectedData(null);
              setActivePage(0);
              setFormdata({});
            }}
            isEdit={isEdit}
            formdata={formdata}
            setFormdata={setFormdata}
          />
        )
      )}

      {/* Archive Modal */}
      {isArchiveModalOpen && (
        <AnimatePresence>
          <ArchiveModal
            isOpen={isArchiveModalOpen}
            onClose={handleArchiveModalClose}
            archiveId={archiveId}
            fromJobDetails={false}
          />
        </AnimatePresence>
      )}
    </div>
  );
};

export default Jobs;
