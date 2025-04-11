import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineEdit } from "react-icons/md";
import toast from "react-hot-toast";
import ArchiveModal from "./ArchiveModal";
import DetailsModal from "./DetailsModal";
import {
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { createJob, updateJob } from "./api";
import { useJobContext } from "../../../context/JobContext";
import { JOB_TYPES } from "../../Constants/constants";
import {
  CancelButton,
  SaveButton,
} from "../../shared/SaveAndCancelButtons";
import { getJobLabel } from "../../../utils/util";
import useAuth from "../../../hooks/useAuth";

const JobDetails = () => {
  const { auth } = useAuth();
  const isAgency = auth?.role === "agency";
  const navigate = useNavigate();
  const {
    formdata,
    setFormdata,
    isEdit,
    selectedData,
    originalFormData,
    getChangedFields,
    // Use the job details state and functions from context instead of local state
    jobDetails,
    setJobDetails,
    haveDetailsChanged,
    processJobDetailsForSubmission,
  } = useJobContext();

  const queryClient = useQueryClient();
  const [archiveModalOpen, setArchiveModalOpen] =
    useState(false);
  const [detailsModalOpen, setDetailsModalOpen] =
    useState(false);
  const [editDetail, setEditDetail] = useState(null);

  const handleAddDetail = () => {
    setEditDetail(null); // Reset edit state
    setDetailsModalOpen(true);
  };

  useEffect(() => {
    const isFirstLoad =
      localStorage.getItem("hasLoaded") !== "true";

    if (!isFirstLoad) {
      navigate("/client/jobs");
    } else {
      localStorage.setItem("hasLoaded", "true");
    }

    return () => {
      localStorage.removeItem("hasLoaded");
    };
  }, [navigate]);

  const handleEditDetail = (id) => {
    const selectedDetail = jobDetails.find(
      (item) => item.id === id
    );
    setEditDetail(selectedDetail);
    setDetailsModalOpen(true);
  };

  const onBack = () => {
    window.history.back();
  };

  const onSubmit = () => {
    if (isAgency) {
      navigate("/agency/dashboard");
    } else {
      navigate("/client/jobs");
    }
  };

  const mutation = useMutation({
    mutationFn: isEdit ? updateJob : createJob,
    onSuccess: () => {
      isAgency
        ? queryClient.invalidateQueries("agency-jobs")
        : queryClient.invalidateQueries("jobs");
      onSubmit();
      toast.success(
        isEdit
          ? "Job Updated Successfully"
          : "Job Created Successfully"
      );
    },
    onError: () => {
      toast.error(
        isEdit
          ? "Failed to update job"
          : "Failed to create job"
      );
    },
  });

  const hasDataChanged = () => {
    if (!isEdit) return true;
    if (!originalFormData) return true;
    if (haveDetailsChanged()) return true;
    const changedFields = getChangedFields();
    return Object.keys(changedFields).length > 0;
  };

  const handleSubmit = () => {
    // Check if there are any changes
    if (!hasDataChanged()) {
      toast.success("No changes to save");
      onSubmit();
      return;
    }

    const formdataToSubmit = new FormData();
    const processedDetails =
      processJobDetailsForSubmission();

    if (!isEdit) {
      formdataToSubmit.append("name", formdata.name);
      formdataToSubmit.append("job_id", formdata.job_id);
      formdataToSubmit.append(
        "recruiter_ids",
        JSON.stringify(formdata.recruiter_ids)
      );
      formdataToSubmit.append(
        "hiring_manager_id",
        formdata.hiring_manager_id
      );
      formdataToSubmit.append(
        "total_positions",
        formdata.total_positions
      );
      formdataToSubmit.append(
        "mandatory_skills",
        JSON.stringify(formdata.mandatory_skills)
      );
      formdataToSubmit.append(
        "interview_time",
        formdata.interview_time
      );
      formdataToSubmit.append(
        "specialization",
        formdata.specialization
      );
      formdataToSubmit.append(
        "job_description_file",
        formdata.job_description_file
      );
      formdataToSubmit.append(
        "other_details",
        JSON.stringify(processedDetails)
      );
      formdataToSubmit.append(
        "is_diversity_hiring",
        formdata.is_diversity_hiring
      );
    } else {
      const changedFields = getChangedFields();

      Object.entries(changedFields).forEach(
        ([key, value]) => {
          // Skip other_details as we handle it separately
          if (key !== "other_details") {
            if (
              typeof value === "object" &&
              !Array.isArray(value) &&
              !(value instanceof File)
            ) {
              formdataToSubmit.append(
                key,
                JSON.stringify(value)
              );
            } else if (Array.isArray(value)) {
              formdataToSubmit.append(
                key,
                JSON.stringify(value)
              );
            } else {
              formdataToSubmit.append(key, value || "");
            }
          }
        }
      );

      // Always add other_details if they've changed
      if (haveDetailsChanged()) {
        formdataToSubmit.append(
          "other_details",
          JSON.stringify(processedDetails)
        );
      }
    }

    if (isEdit && formdataToSubmit.entries().next().done) {
      toast.success("No changes to save");
      onSubmit();
      return;
    }

    isEdit
      ? mutation.mutate({
          jobData: formdataToSubmit,
          id: selectedData.id,
        })
      : mutation.mutate(formdataToSubmit);
  };

  return (
    <>
      <div className="py-7 px-0 w-full">
        <div className="w-full max-w-[640px]">
          <div className={formRowClassName}>
            <label className={labelClassName}>
              Job Role
            </label>
            <input
              type="text"
              value={getJobLabel(formdata.name)}
              readOnly
              className={inputClassName}
            />
          </div>

          <div className={formRowClassName}>
            <label className={labelClassName}>
              Interview Time
            </label>
            <input
              type="text"
              value="60 Minutes"
              readOnly
              className={inputClassName}
            />
          </div>

          <div className={formRowClassName}>
            <label className={labelClassName}>
              Job Description
            </label>
            <div
              className={`${btnClassName} w-1/2`}
              onClick={() => {
                if (formdata.job_description_file) {
                  const file =
                    formdata.job_description_file;
                  const blobUrl = URL.createObjectURL(file);
                  window.open(blobUrl, "_blank");

                  setTimeout(
                    () => URL.revokeObjectURL(blobUrl),
                    5000
                  );
                } else {
                  toast.error("No file uploaded");
                }
              }}
            >
              Click to View
            </div>
          </div>

          <div className={formRowClassName}>
            <label className={labelClassName}>
              Active/Archived
            </label>
            <select
              className={`${inputClassName} custom-select`}
              value={
                JOB_TYPES?.ACTIVE.includes(
                  formdata.reason_for_archived
                )
                  ? "Active"
                  : "Archived"
              }
              disabled
            >
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
            </select>
            <button
              type="button"
              className={`${btnClassName} w-[24%]`}
              onClick={() => {
                if (
                  JOB_TYPES?.ACTIVE.includes(
                    formdata.reason_for_archived
                  )
                ) {
                  setArchiveModalOpen(true);
                } else {
                  setFormdata({
                    ...formdata,
                    reason_for_archived: "",
                  });
                }
              }}
            >
              {JOB_TYPES.ACTIVE.includes(
                formdata.reason_for_archived
              )
                ? "Archive"
                : "Make Active"}
            </button>
          </div>
        </div>

        <div className="grid gap-2 mt-8">
          <div className="grid grid-cols-[20%_15%_55%_10%] text-2xs font-bold text-black ml-5 items-center">
            <div>DETAILS</div>
            <div>TIME</div>
            <div>GUIDELINES</div>
            <div className="flex justify-end">
              <button
                type="button"
                className="flex items-center justify-center pr-6 text-[#007AFF] hover:text-[#005BBB] gap-1"
                onClick={handleAddDetail}
              >
                + <span className="underline">Add</span>
              </button>
            </div>
          </div>
          {jobDetails.length > 0 &&
            jobDetails.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-[20%_15%_55%_10%] text-2xs font-medium items-center text-black bg-[#EBEBEB80] py-2 px-4 rounded-2xl"
              >
                <div>{row.details}</div>
                <div>
                  {row.time.replace("min", " Minutes")}
                </div>
                <div>
                  <ul className="list-disc pl-5 m-0">
                    {row.guidelines
                      .split("\n")
                      .map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                  </ul>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-[#ECE6F0] w-7 h-7 rounded-lg flex items-center justify-center custom-shadow cursor-pointer"
                    onClick={() => handleEditDetail(row.id)}
                  >
                    <MdOutlineEdit
                      size={18}
                      className="text-[#65558F]"
                    />
                  </button>
                </div>
              </div>
            ))}
        </div>

        <div className="flex justify-end items-center gap-2 mt-6">
          <CancelButton label={"Back"} onClick={onBack} />
          <SaveButton
            label={
              mutation.isPending ? "Saving..." : "Save"
            }
            disabled={mutation.isPending}
            onClick={handleSubmit}
            type={"button"}
          />
        </div>
      </div>
      {archiveModalOpen && (
        <ArchiveModal
          isOpen={archiveModalOpen}
          onClose={() => setArchiveModalOpen(false)}
          fromJobDetails={true}
          formdata={formdata}
          setFormdata={setFormdata}
        />
      )}
      {/* Modal for Adding/Editing Details */}
      {detailsModalOpen && (
        <DetailsModal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          onSave={setJobDetails}
          details={jobDetails}
          editDetail={editDetail}
        />
      )}
    </>
  );
};

export default JobDetails;

const labelClassName =
  "text-2xs font-bold text-[#6B6F7B] text-right w-1/5";

const inputClassName =
  "rounded-lg text-2xs py-2 px-3 w-1/2 border border-[#CAC4D0] text-[#49454F] text-center";

const btnClassName =
  "text-2xs py-2 px-3 tertiary-button font-semibold";

const formRowClassName = "flex items-center mb-3 gap-4";
