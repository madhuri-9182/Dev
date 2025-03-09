import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import useAllJobs from "../../../hooks/useFetchAllJobs";
import { useLocation, useNavigate } from "react-router-dom";
import BasicDatePicker from "../../../utils/BasicDatePicker";
import {
  base64ToFile,
  formatExperience,
  getJobLabel,
} from "../../../utils/util";
import {
  CANDIDATE_SOURCE,
  SPECIALIZATIONS,
} from "../../Constants/constants";
import { useMutation } from "@tanstack/react-query";
import { addCandidate, updateCandidate } from "./api";
import toast from "react-hot-toast";
import DropCandidateModal from "./components/DropCandidateModal";

const timeSlots = [
  { time: "10 AM", available: "yes" },
  { time: "11 AM", available: "no" },
  { time: "12 PM", available: "yes" },
  { time: "1 PM", available: "yes" },
  { time: "2 PM", available: "yes" },
  { time: "3 PM", available: "yes" },
  { time: "4 PM", available: "no" },
  { time: "5 PM", available: "yes" },
  { time: "6 PM", available: "no" },
  { time: "7 PM", available: "yes" },
];

function ClientScheduleInterview() {
  const { data: jobs } = useAllJobs();
  const location = useLocation();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] =
    useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] =
    useState(null);

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

  // Available time slots for selection
  const availableSlots = [
    "9am - 10am",
    "10:15am - 11:15am",
    "9:45am - 10:45am",
    "10:30am - 11:30am",
    "11am - 12pm",
  ];

  // Sidebar content for candidate details
  const SIDEBAR_CONTENT = [
    {
      label: "Experience",
      value: formatExperience(item?.years_of_experience),
    },
    {
      label: "Email",
      value: item?.email,
    },
    {
      label: "Company",
      value: item?.current_company,
    },
    {
      label: "Designation",
      value: item?.current_designation
        ? item.current_designation
        : "N/A",
    },
    {
      label: "Source",
      value: CANDIDATE_SOURCE.find(
        (source) => source.id === item?.source
      )?.name,
    },
  ];

  // Get job role and function for display
  const role = jobs?.find(
    (job) => job.id === item?.role
  )?.name;
  const roleValue = getJobLabel(role);
  const functionValue = SPECIALIZATIONS.find(
    (spec) => spec.id === item?.specialization
  )?.name;

  // Form items for the main form
  const FORM_ITEMS = [
    {
      label: "Name",
      value: item?.name,
    },
    {
      label: "Role",
      value: roleValue,
    },
    {
      label: "Function",
      value: functionValue,
    },
  ];

  // Handle file download
  const handleDownload = () => {
    if (file) {
      const url = window.URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  // API mutations
  const mutation = useMutation({
    mutationFn: item?.id ? updateCandidate : addCandidate,
    onSuccess: () => {
      toast.success(
        item?.id
          ? "Candidate updated successfully"
          : "Candidate added successfully",
        {
          position: "top-right",
        }
      );
      navigate("/client/candidates");
    },
    onError: (error) => {
      toast.error(error.message, {
        position: "top-right",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data) => {
    // Skip API call if no changes for existing candidate
    if (item?.id && !hasChanges) {
      toast.success("No changes to save", {
        position: "top-right",
      });
      navigate("/client/candidates");
      return;
    }

    const formdata = new FormData();

    if (item?.id) {
      // Update: only include changed fields
      if (data.remark !== item.remark) {
        formdata.append("remark", data.remark);
      }

      // Only make API call if there are changes
      if (formdata.has("remark")) {
        mutation.mutate({ id: item.id, data: formdata });
      } else {
        toast.info("No changes to save", {
          position: "top-right",
        });
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

      mutation.mutate(formdata);
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

  // Handle time slot selection
  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(
      selectedTimeSlot === slot ? null : slot
    );
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
        <div className="p-10 flex flex-col gap-y-4 bg-[#E7E4E8CC] rounded-2xl w-[340px]">
          <div className="flex flex-col gap-y-6">
            {SIDEBAR_CONTENT.map((content, index) => (
              <div
                key={index}
                className="flex flex-col gap-y-1 text-[#6B6F7B]"
              >
                <label
                  className="text-2xs uppercase"
                  htmlFor={content.label}
                >
                  {content.label}
                </label>
                <span className="font-bold text-xs">
                  {content.value}
                </span>
              </div>
            ))}

            <div className="flex flex-col gap-y-1">
              <label
                htmlFor="cv"
                className="text-2xs uppercase text-[#6B6F7B]"
              >
                CV
              </label>
              <span
                className="text-xs font-bold text-[#6B6F7B] hover:text-[#007AFF] cursor-pointer"
                onClick={handleDownload}
              >
                Download
              </span>
            </div>

            <div className="flex flex-col">
              <textarea
                {...register("remark", { maxLength: 255 })}
                placeholder="Write your remarks here"
                className="rounded-2xl italic text-2xs text-[#6B6F7B] p-4 w-full h-[120px] bg-[#F6F6F6] focus:outline-none focus:ring-1 focus:ring-[#007AFF]"
              />
              {errors.remark && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.remark.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="w-3/4 p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-[40%] flex flex-col gap-y-3">
              {FORM_ITEMS.map((item, idx) => (
                <div
                  className="flex items-center gap-x-3"
                  key={idx}
                >
                  <label className="text-2xs font-bold text-[#6B6F7B] text-right w-1/3">
                    {item.label}
                  </label>
                  <input
                    value={item.value || ""}
                    readOnly
                    type="text"
                    className="rounded-lg w-2/3 text-2xs py-[6px] px-3 border border-[#CAC4D0] text-[#49454F] text-center bg-gray-50"
                  />
                </div>
              ))}
            </div>

            {/* Date Picker */}
            <div className="m-4 mt-24">
              <div className="px-4 py-2 w-[328px] h-[100px] bg-[#ECE6F0] rounded-xl">
                <div>
                  <span className="text-xs text-[#49454F]">
                    Select Date
                  </span>
                </div>
                <BasicDatePicker />
              </div>
            </div>

            {/* Time Slots */}
            <div className="mt-8">
              <h1 className="text-base mb-3 text-black">
                Time Slots
              </h1>
              <div className="grid grid-cols-10 gap-2">
                {timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className={`text-center py-1 px-3 rounded-lg text-xs max-w-max ${
                      slot.available === "yes"
                        ? "bg-[#59B568] text-white cursor-pointer hover:bg-[#4da75c]"
                        : "bg-[#C7C7C7] text-[#6B6F7B]"
                    }`}
                    onClick={() => {
                      if (slot.available === "yes") {
                        handleTimeSlotSelect(slot.time);
                      }
                    }}
                  >
                    {slot.time}
                    {selectedTimeSlot === slot.time && (
                      <span className="ml-1">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Available Slots */}
            <div className="mt-8">
              <div className="flex items-center space-x-1">
                <span className="text-xs font-bold mr-4 text-[#6B6F7B]">
                  Available Slots
                </span>
                <div className="flex items-center space-x-2 flex-wrap">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() =>
                        handleTimeSlotSelect(slot)
                      }
                      className={`flex items-center justify-center px-2 py-1 border rounded-md text-2xs w-auto ${
                        selectedTimeSlot === slot
                          ? "bg-purple-100 text-purple-700 border-purple-300"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                    >
                      {selectedTimeSlot === slot && (
                        <span className="w-4 h-4 flex justify-center items-center mr-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3 text-purple-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                      )}
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex items-center justify-end gap-x-3">
              <button
                type="button"
                className="py-[6px] rounded-[100px] text-[#65558F] border border-[#79747E] text-xs font-medium cursor-pointer 
                  transition-all duration-300 ease-in-out 
                  hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6] w-36 h-8 flex items-center justify-center"
                onClick={handleDeleteCandidate}
              >
                Drop Candidate
              </button>

              {(item?.id
                ? item.status === "NSCH"
                : true) && (
                <button
                  type="submit"
                  className="bg-[#E8DEF8] text-[#4A4459] text-xs py-2 px-3 rounded-[100px] font-medium transition-all duration-300 ease-in-out 
                    hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6] cursor-pointer flex justify-center items-center w-36 h-8"
                >
                  Schedule Later
                </button>
              )}

              <button
                type="button"
                className="px-6 py-[10px] rounded-[100px] text-white bg-[#007AFF] transition-all duration-300 ease-in-out
                  hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] font-medium cursor-pointer w-28 h-8 flex items-center justify-center uppercase text-xs"
                onClick={() => {
                  // If there are changes, confirm with the user
                  if (isDirty && hasChanges) {
                    if (
                      confirm(
                        "You have unsaved changes. Are you sure you want to leave?"
                      )
                    ) {
                      navigate("/client/candidates");
                    }
                  } else {
                    navigate("/client/candidates");
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>

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
