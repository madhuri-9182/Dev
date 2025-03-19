import {
  useState,
  useContext,
  createContext,
  useEffect,
} from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { createFileFromUrl } from "../utils/util";
import _ from "lodash";

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

const initialState = {
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
  hiring_manager_name: "",
  recruiter_names: [],
};

export const JobProvider = () => {
  const navigate = useNavigate();
  const [formdata, setFormdata] = useState(initialState);
  const [selectedData, setSelectedData] = useState({});
  const [originalFormData, setOriginalFormData] =
    useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [archiveId, setArchiveId] = useState(null);
  const [isArchiveModalOpen, setIsArchiveModalOpen] =
    useState(false);

  const handleShowJobDetails = (data) => {
    if (data) {
      setSelectedData(data);
    }
    navigate("/client/jobs/job-details");
  };

  const reset = () => {
    setFormdata(initialState);
    setSelectedData({});
    setOriginalFormData(null);
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

        const normalizedData = {
          ...selectedData,
          hiring_manager_id:
            selectedData.hiring_manager?.id,
          recruiter_ids: selectedData.clients.map(
            (client) => client.id
          ),
          recruiter_names: selectedData.clients.map(
            (client) => client.name
          ),
          hiring_manager_name:
            selectedData.hiring_manager?.name,
          total_positions: String(
            selectedData.total_positions
          ),
          job_description_file: file, // Now it's a resolved File object
        };

        setFormdata(normalizedData);
        // Store original data for comparison
        setOriginalFormData(_.cloneDeep(normalizedData));
      };
      fetchFile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedData]);

  // Create a function to get changes between original and current formdata
  const getChangedFields = () => {
    if (!isEdit || !originalFormData) return formdata;

    const changes = {};

    // Compare each field and only include changed ones
    Object.keys(formdata).forEach((key) => {
      // Skip other_details as it's handled separately in the component
      if (
        key !== "other_details" &&
        !_.isEqual(formdata[key], originalFormData[key])
      ) {
        changes[key] = formdata[key];
      }
    });

    return changes;
  };

  return (
    <JobContext.Provider
      value={{
        formdata,
        setFormdata,
        selectedData,
        setSelectedData,
        originalFormData,
        setOriginalFormData,
        getChangedFields,
        currentPage,
        setCurrentPage,
        archiveId,
        setArchiveId,
        isArchiveModalOpen,
        setIsArchiveModalOpen,
        handleShowJobDetails,
        handleArchiveModalOpen,
        handleChangePage,
        handleAddJobClick,
        isEdit,
        reset,
      }}
    >
      <Outlet />
    </JobContext.Provider>
  );
};
