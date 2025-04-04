import PropTypes from "prop-types";
import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Loader2, AlertTriangle, X } from "lucide-react";
import toast from "react-hot-toast";

// Import utility functions
import useAllJobs from "../../../../hooks/useFetchAllJobs";
import {
  base64ToFile,
  formatDateToDDMMYYYY,
} from "../../../../utils/util";

// Import API functions
import {
  addCandidate,
  getInterviewAvailability,
  updateCandidate,
  scheduleInterview,
} from "../api";

// Import custom hooks
import useInterviewScheduling from "./hooks/useInterviewScheduling";

// Import components
import CandidateSidebar from "./components/CandidateSidebar";
import CandidateForm from "./components/CandidateForm";
import TimeSlotSelector from "./components/TimeSlotSelector";
import TimeWindowSelector from "./components/TimeWindowSelector";
import DropCandidateModal from "../components/DropCandidateModal";
import TimeRemainingComponent from "./components/TimeRemainingComponent";
import { Alert } from "@mui/material";

/**
 * Error modal component for scheduling errors
 */
const SchedulingErrorModal = ({
  error,
  onTryAgain,
  onSaveWithoutScheduling,
  onClose,
}) => (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[99999]">
    <div className="absolute bg-white p-6 rounded-lg max-w-md w-full shadow-xl top-[20%] left-[55%] transform -translate-x-1/2 ">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <AlertTriangle className="text-red-500 h-5 w-5 mr-2" />
          <h3 className="text-base font-medium text-red-600">
            Scheduling Error
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <p className="text-xs text-gray-700 mb-6">{error}</p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onSaveWithoutScheduling}
          className="py-2 bg-[#E8DEF8] border border-[#E8DEF8] text-[#4A4459] text-xs rounded-[100px] font-medium transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6] cursor-pointer px-4"
        >
          Save Without Scheduling
        </button>
        <button
          onClick={onTryAgain}
          className="px-4 py-2 bg-[#007AFF] border border-[#007AFF] rounded-[100px] text-white font-medium text-xs hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] transition-all duration-300 ease-in-out"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
);

SchedulingErrorModal.propTypes = {
  error: PropTypes.string,
  onTryAgain: PropTypes.func,
  onSaveWithoutScheduling: PropTypes.func,
  onClose: PropTypes.func,
};

/**
 * Main component for scheduling interviews with candidates
 */
function ClientScheduleInterview() {
  const { data: jobs } = useAllJobs();
  const location = useLocation();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] =
    useState(false);
  const [isTimerCompleted, setIsTimerCompleted] =
    useState(false);
  const [
    showSchedulingErrorModal,
    setShowSchedulingErrorModal,
  ] = useState(false);
  const [candidateId, setCandidateId] = useState(null); // Track candidate ID for retry scenarios
  const [showAlert, setShowAlert] = useState(true);

  // Parse query parameters to get candidate data
  const queryParams = new URLSearchParams(location.search);
  const key = queryParams.get("key");
  const encodedData = key
    ? localStorage.getItem(key)
    : null;
  const item = encodedData ? JSON.parse(encodedData) : null;

  // Initialize form with React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      remark: item?.remark || "",
    },
  });

  // Watch the remark field to track changes
  const remark = watch("remark");

  // Track original data for comparison
  const originalData = useMemo(
    () => ({
      remark: item?.remark || "",
    }),
    [item?.remark]
  );

  // Compute if there are any changes
  const hasChanges = useMemo(() => {
    if (item?.id) {
      return remark !== originalData.remark;
    }
    return true; // For new candidates, always consider as changed
  }, [item?.id, remark, originalData.remark]);

  // Initialize candidateId from item if exists
  useEffect(() => {
    if (item?.id) {
      setCandidateId(item.id);
    }
  }, [item?.id]);

  // Load file from base64 data when component mounts
  useEffect(() => {
    if (item?.fileBase64) {
      const file = base64ToFile(
        item.fileBase64,
        item.file_name
      );
      setFile(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.fileBase64]);

  // Handle cleanup of localStorage on page navigation/unload
  useEffect(() => {
    let isPageReload = false;

    const handleBeforeUnload = () => {
      isPageReload = true;
    };

    const handleUnload = () => {
      if (!isPageReload && key) {
        localStorage.removeItem(key);
      }
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
      window.removeEventListener("unload", handleUnload);
    };
  }, [key]);

  // Custom hook for interview scheduling
  const {
    selectedDate,
    setSelectedDate,
    selectedTimeSlot,
    availableHourlySlots,
    availableWindows,
    selectedWindow,
    selectedSlotIds,
    schedulingError,
    setSchedulingError,
    handleTimeSlotSelect,
    handleWindowSelect,
    isLoading,
    isError,
    getTimeFromWindow,
  } = useInterviewScheduling(
    item,
    getInterviewAvailability
  );

  // API mutation for scheduling interview (improved error handling)
  const scheduleInterviewMutation = useMutation({
    mutationFn: scheduleInterview,
    onSuccess: () => {
      toast.success("Interviewers notified successfully");
      navigate("/client/candidates");
    },
    onError: (error) => {
      let errorToShow = "Failed to schedule interview";
      if (error.response?.data?.errors) {
        // Check if errors is a string or an object
        if (
          typeof error.response.data.errors === "string"
        ) {
          errorToShow = error.response.data.errors;
          // If it's a string, show that directly
          toast.error(error.response.data.errors);
        } else {
          // If it's an object, use the existing logic
          const errorMessage = Object.values(
            error.response.data.errors
          ).flat();
          if (errorMessage.length > 0) {
            errorToShow = errorMessage[0];
            toast.error(errorMessage[0]);
          }
        }
      } else {
        errorToShow =
          error.response?.data?.message ||
          "Failed to schedule interview";
        toast.error(
          error.response?.data?.message ||
            "Failed to process user data"
        );
      }

      // Set error and show modal instead of navigating away
      setSchedulingError(errorToShow);
      setShowSchedulingErrorModal(true);
    },
  });

  // API mutations for candidate creation/update
  const candidateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      id
        ? updateCandidate({ id, data })
        : addCandidate(data),
    onSuccess: (response, variables) => {
      toast.success(
        variables.id
          ? "Candidate updated successfully"
          : "Candidate added successfully"
      );

      // Store candidate ID for potential retry scenarios
      const newCandidateId =
        variables.id || response?.data?.id;
      if (newCandidateId) {
        setCandidateId(newCandidateId);
      }

      // Only proceed with scheduling if scheduleAfterUpdate is true
      if (
        variables.scheduleAfterUpdate &&
        selectedWindow &&
        selectedSlotIds.length > 0
      ) {
        // For new candidates, we need to get the ID from the response
        const candidateId =
          variables.id || response?.data?.id;

        if (candidateId) {
          // Call the schedule interview API
          scheduleInterviewMutation.mutate({
            candidate_id: candidateId,
            date: formatDateToDDMMYYYY(selectedDate),
            time: getTimeFromWindow(selectedWindow),
            interviewer_ids: selectedSlotIds,
          });
        } else {
          toast.error(
            "Could not get candidate ID for scheduling"
          );
          setSchedulingError(
            "Could not get candidate ID for scheduling"
          );
          setShowSchedulingErrorModal(true);
        }
      } else {
        navigate("/client/candidates");
      }
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to save candidate data";
      toast.error(errorMessage);
      setSchedulingError(errorMessage);
      setShowSchedulingErrorModal(true);
    },
  });

  // Handle retry scheduling action
  const handleRetryScheduling = () => {
    setShowSchedulingErrorModal(false);
    setSchedulingError(null);

    // Use the candidate ID we've stored
    const idToUse = candidateId || item?.id;

    if (!idToUse) {
      toast.error(
        "Cannot retry - no valid candidate ID found"
      );
      return;
    }

    scheduleInterviewMutation.mutate({
      candidate_id: idToUse,
      date: formatDateToDDMMYYYY(selectedDate),
      time: getTimeFromWindow(selectedWindow),
      interviewer_ids: selectedSlotIds,
    });
  };

  // Handle save without scheduling action
  const handleSaveWithoutScheduling = () => {
    setShowSchedulingErrorModal(false);
    setSchedulingError(null);
    toast.success("Candidate saved successfully");
    navigate("/client/candidates");
  };

  // Handle form submission
  const onSubmit = (data, scheduleNow = true) => {
    // Clear any previous error
    setSchedulingError(null);
    setShowSchedulingErrorModal(false);

    // Skip API call if no changes for existing candidate
    if (item?.id && !hasChanges && !scheduleNow) {
      toast.success("No changes to save");
      navigate("/client/candidates");
      return;
    }

    const formdata = new FormData();

    if (item?.id) {
      // Update: only include changed fields
      let hasRemarkChanged = false;
      if (data.remark !== item.remark) {
        formdata.append("remark", data.remark);
        hasRemarkChanged = true;
      }

      // If scheduling now and there are no remark changes, directly call scheduling API
      if (scheduleNow && !hasRemarkChanged) {
        scheduleInterviewMutation.mutate({
          candidate_id: item.id,
          date: formatDateToDDMMYYYY(selectedDate),
          time: getTimeFromWindow(selectedWindow),
          interviewer_ids: selectedSlotIds,
        });
      }
      // If there are remark changes, call update API
      else if (hasRemarkChanged) {
        candidateMutation.mutate({
          id: item.id,
          data: formdata,
          scheduleAfterUpdate: scheduleNow,
        });
      }
      // No changes and not scheduling, just navigate away
      else {
        toast.info("No changes to save");
        navigate("/client/candidates");
      }
    } else {
      // New candidate: include all fields
      formdata.append("name", item.name);
      formdata.append("email", item.email);
      formdata.append("phone", item.phone_number);
      formdata.append("job_id", item.role);
      formdata.append(
        "year",
        item.years_of_experience.year
      );
      formdata.append(
        "month",
        item.years_of_experience.month
      );
      formdata.append(
        "specialization",
        item.specialization
      );
      formdata.append("company", item.current_company);
      formdata.append(
        "current_designation",
        item.current_designation
      );
      formdata.append("source", item.source);
      formdata.append("cv", file);
      formdata.append("gender", item.gender || "M");

      if (data.remark) {
        formdata.append("remark", data.remark);
      }

      // Submit candidate data, scheduling will be handled in onSuccess callback if scheduleNow is true
      candidateMutation.mutate({
        data: formdata,
        scheduleAfterUpdate: scheduleNow,
      });
    }
  };

  // Handle candidate deletion
  const handleDeleteCandidate = () => {
    if (item?.id) {
      setOpenDeleteModal(true);
    } else {
      if (window.opener) {
        window.opener.removeCandidateFromData(key);
        window.close();
      } else {
        navigate("/client/candidates");
      }
    }
  };

  const isConfirmButtonDisabled = () => {
    if (isTimerCompleted) {
      return false;
    }

    // If there's no last_scheduled_initiate_time, button should not be disabled
    if (!item?.last_scheduled_initiate_time) {
      return false;
    }

    // Parse the timestamp (handling ISO format with timezone)
    const lastScheduledTime = new Date(
      item.last_scheduled_initiate_time
    );
    const currentTime = new Date();

    // Calculate difference in minutes
    const diffInMs = currentTime - lastScheduledTime;
    const diffInMinutes = diffInMs / (1000 * 60);

    // Return true if less than 70 minutes have passed (button should be disabled)
    return diffInMinutes < 70;
  };

  const handleTimerComplete = () => {
    setIsTimerCompleted(true);
  };

  // If no item data is available, show an error message
  if (!item) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">
          No candidate data found. Please try again.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex gap-x-12">
        {/* Sidebar */}
        <CandidateSidebar
          candidate={item}
          file={file}
          register={register}
          errors={errors}
        />

        {/* Main Form */}
        <div className="w-3/4 p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CandidateForm candidate={item} jobs={jobs} />

            {showAlert && (
              <Alert
                severity="info"
                sx={{
                  marginTop: 7,
                  fontSize: "12px",
                }}
                onClose={() => {
                  setShowAlert(false);
                }}
              >
                {`To ensure the interviewer's session proceeds seamlessly, please schedule it for at least 8 hours from now.`}
              </Alert>
            )}

            {/* Time Slot Selection */}
            <div className={showAlert ? "mt-6" : "mt-36"}>
              <TimeSlotSelector
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                availableHourlySlots={availableHourlySlots}
                selectedTimeSlot={selectedTimeSlot}
                handleTimeSlotSelect={handleTimeSlotSelect}
                isLoading={isLoading}
                isError={isError}
              />
            </div>

            {/* Time Window Selection */}
            <TimeWindowSelector
              selectedTimeSlot={selectedTimeSlot}
              availableWindows={availableWindows}
              selectedWindow={selectedWindow}
              handleWindowSelect={handleWindowSelect}
            />

            {/* Show calendar (interview availability) error if any */}
            {schedulingError &&
              !showSchedulingErrorModal && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md flex items-start">
                  <AlertTriangle className="text-red-500 h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    {schedulingError}
                  </p>
                </div>
              )}

            {/* Action Buttons */}
            <div className="mt-20 flex items-center justify-end gap-x-3">
              {(item?.id
                ? item.status === "NSCH"
                : true) && (
                <>
                  <button
                    type="button"
                    className="py-2 rounded-[100px] text-[#65558F] border border-[#79747E] text-xs font-medium cursor-pointer 
                    transition-all duration-300 ease-in-out 
                    hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6] w-36 flex items-center justify-center"
                    onClick={handleDeleteCandidate}
                  >
                    Drop Candidate
                  </button>
                  <button
                    type="button"
                    className="bg-[#E8DEF8] border border-[#E8DEF8] text-[#4A4459] text-xs py-2 px-3 rounded-[100px] font-medium transition-all duration-300 ease-in-out 
                    hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6] cursor-pointer flex justify-center items-center w-36"
                    onClick={() => {
                      // Call onSubmit with scheduleNow=false
                      handleSubmit((data) =>
                        onSubmit(data, false)
                      )();
                    }}
                  >
                    {candidateMutation.isPending ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      "Schedule Later"
                    )}
                  </button>
                </>
              )}

              <button
                type="button"
                disabled={
                  !selectedWindow ||
                  isConfirmButtonDisabled()
                }
                className={`px-6 py-2 border rounded-[100px] text-white font-medium w-32 flex items-center justify-center uppercase text-xs ${
                  selectedWindow &&
                  !isConfirmButtonDisabled()
                    ? "bg-[#007AFF] border-[#007AFF] hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] cursor-pointer"
                    : "bg-[#A0CFFF] border-[#A0CFFF] cursor-not-allowed"
                }`}
                onClick={() => {
                  if (!selectedWindow) {
                    toast.error(
                      "Please select a time slot and window"
                    );
                    return;
                  }

                  if (!selectedDate) {
                    toast.error("Please select a date");
                    return;
                  }

                  // If we have a scheduling error, clear it before trying again
                  if (schedulingError) {
                    setSchedulingError(null);
                  }

                  // Submit form with selected time slot and schedule now
                  handleSubmit((data) =>
                    onSubmit(data, true)
                  )();
                }}
              >
                {candidateMutation.isPending ||
                scheduleInterviewMutation.isPending ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
            <TimeRemainingComponent
              time={item?.last_scheduled_initiate_time}
              onTimerComplete={handleTimerComplete}
            />
          </form>
        </div>
      </div>

      {/* Scheduling Error Modal with retry options */}
      {showSchedulingErrorModal && (
        <SchedulingErrorModal
          error={schedulingError}
          onTryAgain={handleRetryScheduling}
          onSaveWithoutScheduling={
            handleSaveWithoutScheduling
          }
          onClose={() => setShowSchedulingErrorModal(false)}
        />
      )}

      {/* Delete Modal */}
      {openDeleteModal && (
        <DropCandidateModal
          id={item?.id}
          onClose={() => setOpenDeleteModal(false)}
        />
      )}
    </>
  );
}

export default ClientScheduleInterview;
