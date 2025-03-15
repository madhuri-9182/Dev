/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
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
    formState: { errors, isDirty },
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
          navigate("/client/candidates");
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
    },
  });

  // API mutation for scheduling interview
  const scheduleInterviewMutation = useMutation({
    mutationFn: scheduleInterview,
    onSuccess: () => {
      toast.success(
        "Interviewers notified successfully progress."
      );
      navigate("/client/candidates");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to schedule interview";

      // Always show error message and navigate to candidates
      toast.error(errorMessage, {
        duration: 5000, // Show for longer
      });

      // Navigate to candidates list regardless of whether this was a new or existing candidate
      navigate("/client/candidates");
    },
  });

  // Handle form submission
  const onSubmit = (data, scheduleNow = true) => {
    // Clear any previous error
    setSchedulingError(null);

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
      }
    }
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

            {/* Time Slot Selection */}
            <TimeSlotSelector
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              availableHourlySlots={availableHourlySlots}
              selectedTimeSlot={selectedTimeSlot}
              handleTimeSlotSelect={handleTimeSlotSelect}
              isLoading={isLoading}
              isError={isError}
            />

            {/* Time Window Selection */}
            <TimeWindowSelector
              selectedTimeSlot={selectedTimeSlot}
              availableWindows={availableWindows}
              selectedWindow={selectedWindow}
              handleWindowSelect={handleWindowSelect}
            />

            {/* Action Buttons */}
            <div className="mt-20 flex items-center justify-end gap-x-3">
              <button
                type="button"
                className="py-2 rounded-[100px] text-[#65558F] border border-[#79747E] text-xs font-medium cursor-pointer 
                  transition-all duration-300 ease-in-out 
                  hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6] w-36 flex items-center justify-center"
                onClick={handleDeleteCandidate}
              >
                Drop Candidate
              </button>

              {(item?.id
                ? item.status === "NSCH"
                : true) && (
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
              )}

              <button
                type="button"
                disabled={!selectedWindow}
                className={`px-6 py-2 border rounded-[100px] text-white font-medium cursor-pointer w-32 flex items-center justify-center uppercase text-xs ${
                  selectedWindow
                    ? "bg-[#007AFF] border-[#007AFF] hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB]"
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
          </form>
        </div>
      </div>

      {/* Show scheduling error if any */}
      {schedulingError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          <p className="text-sm">{schedulingError}</p>
        </div>
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
