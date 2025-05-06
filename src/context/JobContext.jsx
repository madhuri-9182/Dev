/* eslint-disable no-unused-vars */
import {
  useState,
  useContext,
  createContext,
  useEffect,
  useCallback,
} from "react";
import { useNavigate, Outlet } from "react-router-dom";
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
    details: "Quick Intro",
    time: "5min",
    guidelines:
      "Let them relax. Ask about their recent work.",
  },
];

export const JobProvider = () => {
  const navigate = useNavigate();
  const navigateTo = useRoleBasedNavigate();
  const [formdata, setFormdata] = useState(initialState);
  const [selectedData, setSelectedData] = useState({});
  const [originalFormData, setOriginalFormData] =
    useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [archiveId, setArchiveId] = useState(null);
  const [isArchiveModalOpen, setIsArchiveModalOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Add state for job details to persist across navigation
  const [jobDetails, setJobDetails] = useState(
    initialDetailsState
  );
  const [initialJobDetails, setInitialJobDetails] =
    useState([]);

  // Complete reset function to clear all job-related state
  const reset = useCallback(() => {
    setFormdata(initialState);
    setSelectedData({});
    setOriginalFormData(null);
    setJobDetails(initialDetailsState);
    setInitialJobDetails([]);
  }, []);

  // Clear only form data but keep selected data
  const clearFormData = useCallback(() => {
    setFormdata(initialState);
    setOriginalFormData(null);
    setJobDetails(initialDetailsState);
    setInitialJobDetails([]);
  }, []);

  const handleShowJobDetails = useCallback(
    (data) => {
      if (!data) return;

      // Set loading state
      setIsLoading(true);

      // Clear form data but keep the selected data
      clearFormData();

      // Set the new job data
      setSelectedData(data);

      // Navigate to job details
      navigateTo("jobs/job-details");
    },
    [clearFormData, navigateTo]
  );

  const handleAddJobClick = useCallback(
    (data) => {
      // Set loading state if there's job data
      const isEdit =
        data &&
        typeof data === "object" &&
        !data.nativeEvent &&
        Object.keys(data).length !== 0;

      if (isEdit) {
        setIsLoading(true);
        clearFormData();
        setSelectedData(data);
      } else {
        // For new job, just reset everything
        reset();
      }

      navigateTo("jobs/add-job");
    },
    [clearFormData, navigateTo, reset]
  );

  const handleArchiveModalOpen = useCallback((id) => {
    setArchiveId(id);
    setIsArchiveModalOpen(true);
  }, []);

  const handleChangePage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const isEdit =
    selectedData &&
    typeof selectedData === "object" &&
    !selectedData.nativeEvent &&
    Object.keys(selectedData).length !== 0;

  // Function to handle detail changes to persist across navigation
  const handleAddDetail = useCallback((newDetails) => {
    setJobDetails(newDetails);
  }, []);

  // Function to check if job details have changed
  const haveDetailsChanged = useCallback(() => {
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
  }, [initialJobDetails, jobDetails]);

  // Process job details on edit mode
  useEffect(() => {
    // Avoid running this effect during initial render or when not in edit mode
    if (!isEdit || Object.keys(selectedData).length === 0) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    let loadingTimeout;

    // Set a safety timeout to ensure loading state is eventually cleared
    loadingTimeout = setTimeout(() => {
      if (isMounted && isLoading) {
        console.warn(
          "Loading timeout reached - forcing completion"
        );
        setIsLoading(false);
      }
    }, 10000);

    // Process the job data
    const processJobData = async () => {
      try {
        let file = null;

        // Only attempt to load the file if we have a URL and component is still mounted
        if (
          selectedData.job_description_file &&
          isMounted
        ) {
          try {
            file = await createFileFromUrl(
              selectedData.job_description_file
            );
          } catch (error) {
            console.error("Error loading file:", error);
            // Continue without the file
          }
        }

        if (!isMounted) return;

        // Prepare normalized data
        const normalizedData = {
          ...selectedData,
          hiring_manager_id:
            selectedData.hiring_manager?.id || "",
          recruiter_ids:
            selectedData.clients?.map(
              (client) => client.id
            ) || [],
          recruiter_names:
            selectedData.clients?.map(
              (client) => client.name
            ) || [],
          hiring_manager_name:
            selectedData.hiring_manager?.name || "",
          total_positions: String(
            selectedData.total_positions || ""
          ),
          job_description_file: file,
          is_diversity_hiring: Boolean(
            selectedData.is_diversity_hiring
          ),
        };

        // Set form data and original data in one batch to reduce renders
        setFormdata(normalizedData);
        setOriginalFormData(_.cloneDeep(normalizedData));

        // Process job details
        if (selectedData.other_details) {
          try {
            let parsedDetails = [];

            if (
              typeof selectedData.other_details === "string"
            ) {
              try {
                parsedDetails = JSON.parse(
                  selectedData.other_details
                );
              } catch (error) {
                console.error(
                  "Invalid JSON in other_details:",
                  error
                );
                parsedDetails = [];
              }
            } else if (
              Array.isArray(selectedData.other_details)
            ) {
              parsedDetails = selectedData.other_details;
            }

            if (
              Array.isArray(parsedDetails) &&
              parsedDetails.length > 0
            ) {
              const detailsWithIds = parsedDetails.map(
                (detail) => ({
                  ...detail,
                  id:
                    detail.id || Date.now() + Math.random(),
                  time: detail.time?.endsWith("min")
                    ? detail.time
                    : `${detail.time || "5"}min`,
                })
              );

              setJobDetails(detailsWithIds);
              setInitialJobDetails(
                _.cloneDeep(detailsWithIds)
              );
            } else {
              setJobDetails(initialDetailsState);
              setInitialJobDetails(
                _.cloneDeep(initialDetailsState)
              );
            }
          } catch (error) {
            console.error(
              "Error processing other_details:",
              error
            );
            setJobDetails(initialDetailsState);
            setInitialJobDetails(
              _.cloneDeep(initialDetailsState)
            );
          }
        } else {
          setJobDetails(initialDetailsState);
          setInitialJobDetails(
            _.cloneDeep(initialDetailsState)
          );
        }
      } catch (error) {
        console.error(
          "Error in job data processing:",
          error
        );
      } finally {
        // Only update loading state if component is still mounted
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Start processing
    processJobData();

    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(loadingTimeout);
    };
  }, [selectedData, isEdit, isLoading]);

  // Create a function to get changes between original and current formdata
  const getChangedFields = useCallback(() => {
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
  }, [formdata, isEdit, originalFormData]);

  // Process details for submission
  const processJobDetailsForSubmission = useCallback(() => {
    return jobDetails.map((detail) => {
      const detailCopy = { ...detail };
      detailCopy.time = detailCopy.time.replace(
        " Minutes",
        "min"
      );
      delete detailCopy.id;
      return detailCopy;
    });
  }, [jobDetails]);

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
        isLoading,
        setIsLoading,
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
