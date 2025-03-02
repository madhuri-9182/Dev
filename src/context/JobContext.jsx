import {
  useState,
  useContext,
  createContext,
  useEffect,
} from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { createFileFromUrl } from "../utils/util";

const JobContext = createContext({});

// eslint-disable-next-line react-refresh/only-export-components
export const useJobContext = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error(
      "useJobContext must be used within a JobProvider"
    );
  }
  return context;
};

export const JobProvider = () => {
  const navigate = useNavigate();
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
  const [selectedData, setSelectedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [archiveId, setArchiveId] = useState(null);
  const [allJobs, setAllJobs] = useState([]);
  const [filters, setFilters] = useState({
    post_job_date: "",
    job_ids: [],
    hiring_manager_ids: [],
    recruiter_ids: [],
  });
  const [isArchiveModalOpen, setIsArchiveModalOpen] =
    useState(false);

  const handleShowJobDetails = (data) => {
    if (data) {
      setSelectedData(data);
    }
    navigate("/client/jobs/job-details");
  };

  const handleAddJobClick = (data) => {
    if (data) {
      setSelectedData(data);
    }
    navigate("/client/jobs/add-job");
  };

  const handleArchiveModalOpen = (id) => {
    setArchiveId(id);
    setIsArchiveModalOpen(true);
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const isEdit =
    selectedData &&
    typeof selectedData === "object" &&
    !selectedData.nativeEvent &&
    Object.keys(selectedData).length !== 0;

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

  return (
    <JobContext.Provider
      value={{
        formdata,
        setFormdata,
        selectedData,
        setSelectedData,
        currentPage,
        setCurrentPage,
        archiveId,
        setArchiveId,
        allJobs,
        setAllJobs,
        filters,
        setFilters,
        isArchiveModalOpen,
        setIsArchiveModalOpen,
        handleShowJobDetails,
        handleArchiveModalOpen,
        handleChangePage,
        handleAddJobClick,
        isEdit,
      }}
    >
      <Outlet />
    </JobContext.Provider>
  );
};
