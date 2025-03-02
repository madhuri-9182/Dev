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
import {
  JOB_NAMES,
  JOB_TYPES,
} from "../../Constants/constants";

const JobDetails = () => {
  const navigate = useNavigate();
  const { formdata, setFormdata, isEdit, selectedData } =
    useJobContext();

  const queryClient = useQueryClient();
  const [archiveModalOpen, setArchiveModalOpen] =
    useState(false);
  const [detailsModalOpen, setDetailsModalOpen] =
    useState(false);
  const [editDetail, setEditDetail] = useState(null);
  const [details, setDetails] = useState([
    {
      id: Date.now(),
      details: "Intro",
      time: "5min",
      guidelines:
        "Introduce Yourself\nAsk Introduction\nEtc.",
    },
  ]);

  const handleAddDetail = () => {
    setEditDetail(null); // Reset edit state
    setDetailsModalOpen(true);
  };

  const handleEditDetail = (id) => {
    const selectedDetail = details.find(
      (item) => item.id === id
    );
    setEditDetail(selectedDetail);
    setDetailsModalOpen(true);
  };

  const onBack = () => {
    navigate("/client/jobs/add-job");
  };

  const onSubmit = () => {
    navigate("/client/jobs");
  };

  const mutation = useMutation({
    mutationFn: isEdit ? updateJob : createJob,
    onSuccess: () => {
      queryClient.invalidateQueries("jobs");
      onSubmit();
      toast.success(
        isEdit
          ? "Job Updated Successfully"
          : "Job Created Successfully",
        {
          position: "top-right",
        }
      );
    },
    onError: () => {
      toast.error(
        isEdit
          ? "Failed to update job"
          : "Failed to create job",
        {
          position: "top-right",
        }
      );
    },
  });

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

  const handleSubmit = () => {
    const formdataToSubmit = new FormData();
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
      "job_description_file",
      formdata.job_description_file
    );
    formdataToSubmit.append("other_details", details);
    formdataToSubmit.append(
      "reason_for_archived",
      formdata.reason_for_archived
        ? formdata.reason_for_archived
        : ""
    );
    details.map((detail) => {
      detail.time = detail.time.replace(" Minutes", "min");
    });
    formdataToSubmit.append(
      "other_details",
      JSON.stringify(details)
    );
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
              value={
                JOB_NAMES?.find(
                  (job) => job.id === formdata.name
                )?.name
                  ? JOB_NAMES.find(
                      (job) => job.id === formdata.name
                    )?.name
                  : formdata.name
              }
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
                  toast.error("No file uploaded", {
                    position: "top-right",
                  });
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
          {details.length > 0 &&
            details.map((row, index) => (
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
          <button
            type="button"
            className="px-6 py-[5px] rounded-[100px] text-[#65558F] border border-[#79747E] text-xs font-semibold cursor-pointer 
                transition-all duration-300 ease-in-out 
                hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6]"
            onClick={onBack}
          >
            Back
          </button>
          <button
            className="px-6 py-[5px] border border-[#007AFF] rounded-[100px] text-white bg-[#007AFF] transition-all duration-300 ease-in-out
             hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] text-xs font-semibold cursor-pointer"
            type="button"
            onClick={handleSubmit}
          >
            Save
          </button>
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
          onSave={setDetails}
          details={details}
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
  " bg-[#E8DEF8] text-[#4A4459] text-2xs py-2 px-3 rounded-[100px] font-semibold transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6] cursor-pointer flex justify-center items-center";

const formRowClassName = "flex items-center mb-3 gap-4";
