/* eslint-disable no-unused-vars */
import {
  useState,
  useContext,
  createContext,
  useEffect,
} from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { createFileFromUrl } from "../utils/util";
import _ from "lodash";
import useRoleBasedNavigate from "../hooks/useRoleBaseNavigate";

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
  is_diversity_hiring: false,
};

// Initial job details state with a default intro item
const initialDetailsState = [
  {
    id: Date.now(),
    details: "Intro",
    time: "5min",
    guidelines:
      "Introduce Yourself\nAsk Introduction\nEtc.",
  },
];

export const JobProvider = () => {
  const navigateTo = useRoleBasedNavigate();
  const [formdata, setFormdata] = useState(initialState);
  const [selectedData, setSelectedData] = useState({});
  const [originalFormData, setOriginalFormData] =
    useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [archiveId, setArchiveId] = useState(null);
  const [isArchiveModalOpen, setIsArchiveModalOpen] =
    useState(false);

  // Add state for job details to persist across navigation
  const [jobDetails, setJobDetails] = useState(
    initialDetailsState
  );
  const [initialJobDetails, setInitialJobDetails] =
    useState([]);

  const handleShowJobDetails = (data) => {
    if (data) {
      setSelectedData(data);
    }
    navigateTo("jobs/job-details");
  };

  const reset = () => {
    setFormdata(initialState);
    setSelectedData({});
    setOriginalFormData(null);
    setJobDetails(initialDetailsState);
    setInitialJobDetails([]);
  };

  const handleAddJobClick = (data) => {
    const isEdit =
      data &&
      typeof data === "object" &&
      !data.nativeEvent &&
      Object.keys(data).length !== 0;
    if (isEdit) {
      setSelectedData(data);
    } else {
      reset();
    }
    navigateTo("jobs/add-job");
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

  // Function to handle detail changes to persist across navigation
  const handleAddDetail = (newDetails) => {
    setJobDetails(newDetails);
  };

  // Function to check if job details have changed
  const haveDetailsChanged = () => {
    if (initialJobDetails.length !== jobDetails.length)
      return true;

    const normalizedOriginalDetails = initialJobDetails.map(
      (detail) => {
        const { id, ...rest } = detail;
        return {
          ...rest,
          time: (rest.time || "")
            .replace(" Minutes", "min")
            .replace("min", "min"),
        };
      }
    );

    const normalizedCurrentDetails = jobDetails.map(
      (detail) => {
        const { id, ...rest } = detail;
        return {
          ...rest,
          time: rest.time
            .replace(" Minutes", "min")
            .replace("min", "min"),
        };
      }
    );

    for (
      let i = 0;
      i < normalizedOriginalDetails.length;
      i++
    ) {
      if (
        !_.isEqual(
          normalizedOriginalDetails[i],
          normalizedCurrentDetails[i]
        )
      ) {
        return true;
      }
    }

    return false;
  };

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
          // Explicitly include is_diversity_hiring with proper type conversion
          is_diversity_hiring: Boolean(
            selectedData.is_diversity_hiring
          ),
        };

        setFormdata(normalizedData);
        // Store original data for comparison
        setOriginalFormData(_.cloneDeep(normalizedData));

        // Process job details from other_details
        if (selectedData.other_details) {
          try {
            const parsedDetails =
              typeof selectedData.other_details === "string"
                ? JSON.parse(selectedData.other_details)
                : selectedData.other_details;

            if (
              Array.isArray(parsedDetails) &&
              parsedDetails.length > 0
            ) {
              const detailsWithIds = parsedDetails.map(
                (detail) => ({
                  ...detail,
                  id:
                    detail.id || Date.now() + Math.random(),
                  time: detail.time.endsWith("min")
                    ? detail.time
                    : `${detail.time}min`,
                })
              );

              setJobDetails(detailsWithIds);
              setInitialJobDetails(
                _.cloneDeep(detailsWithIds)
              );
            }
          } catch (error) {
            console.error(
              "Error parsing other_details:",
              error
            );
          }
        }
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
        // For is_diversity_hiring, ensure we're comparing boolean values
        if (key === "is_diversity_hiring") {
          const originalValue = Boolean(
            originalFormData[key]
          );
          const currentValue = Boolean(formdata[key]);

          if (originalValue !== currentValue) {
            changes[key] = currentValue;
          }
        } else {
          changes[key] = formdata[key];
        }
      }
    });

    return changes;
  };

  // Process details for submission
  const processJobDetailsForSubmission = () => {
    return jobDetails.map((detail) => {
      const detailCopy = { ...detail };
      detailCopy.time = detailCopy.time.replace(
        " Minutes",
        "min"
      );
      delete detailCopy.id;
      return detailCopy;
    });
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
        // Job details state and functions
        jobDetails,
        setJobDetails,
        initialJobDetails,
        setInitialJobDetails,
        handleAddDetail,
        haveDetailsChanged,
        processJobDetailsForSubmission,
      }}
    >
      <Outlet />
    </JobContext.Provider>
  );
};
