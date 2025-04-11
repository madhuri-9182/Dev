import { useRef, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DynamicMultiSelect from "../../../utils/DynamicMultiSelect";
import { LogoutCurve } from "iconsax-react";
import MultiSelect from "../../../utils/MultiSelect";
import useAllUsers from "../../../hooks/useFetchAllUsers";
import CustomSelect from "../../../utils/CustomSelect";
import {
  JOB_NAMES,
  SPECIALIZATIONS,
} from "../../Constants/constants";
import {
  handlePdfFile,
  handleTxtAndDocxFile,
} from "../../../utils/util";
import toast from "react-hot-toast";
import { useJobContext } from "../../../context/JobContext";
import useAuth from "../../../hooks/useAuth";
import {
  CancelButton,
  SaveButton,
} from "../../shared/SaveAndCancelButtons";
import { Loader2 } from "lucide-react";
import useRoleBasedNavigate from "../../../hooks/useRoleBaseNavigate";

const AddJob = () => {
  const { auth } = useAuth();
  const navigateTo = useRoleBasedNavigate();
  const { formdata, setFormdata, isEdit } = useJobContext();
  const fileInputRef = useRef(null);
  const { data: users } = useAllUsers();

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
    register,
  } = useForm({
    defaultValues: {
      jobRole: "",
      jobId: "",
      recruiters: [],
      hiringManager: null,
      totalPositions: "",
      specialization: null,
      jobDescriptionFile: null,
      essentialSkills: [],
      isDiversityHiring: false,
    },
  });
  const shouldBeDisabled =
    auth?.role === "client_user" && isEdit;
  const isClientUser = auth?.role === "client_user";

  // Controlled values from form
  const selectedRecruiters = watch("recruiters") || [];
  const selectedHiringManager = watch("hiringManager");
  const selectedEssentialSkills =
    watch("essentialSkills") || [];
  // const isDiversityHiring = watch("isDiversityHiring");

  // State for dropdown open/close
  const [isJobRoleDropdownOpen, setIsJobRoleDropdownOpen] =
    useState(false);
  const [
    isRecruitersDropdownOpen,
    setIsRecruitersDropdownOpen,
  ] = useState(false);
  const [
    isHiringManagersDropdownOpen,
    setIsHiringManagersDropdownOpen,
  ] = useState(false);
  const [
    isSpecializationDropdownOpen,
    setIsSpecializationDropdownOpen,
  ] = useState(false);
  const [resumeUploadLoading, setResumeUploadLoading] =
    useState(false);

  // Filter users for recruiters and hiring managers
  const filteredRecruiters = users?.filter(
    (user) => user.id !== selectedHiringManager
  );

  const filteredHiringManagers = users?.filter(
    (user) =>
      !selectedRecruiters.some(
        (recruiter) => recruiter === user.id
      )
  );

  const [hiringManagerName, setHiringManagerName] =
    useState("");
  const [recruiterNames, setRecruiterNames] = useState([]);

  // Handle file upload button click
  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  // Handle file upload
  const handleFileUpload = (file) => {
    if (!file) return;

    const extension = file.name
      ?.split(".")
      .pop()
      .toLowerCase();

    setValue("jobDescriptionFile", file);

    if (extension === "txt" || extension === "docx") {
      handleTxtAndDocxFile(file, (content) =>
        setValue("jobDescription", content)
      );
    } else if (extension === "pdf") {
      handlePdfFile(
        file,
        (content) => setValue("jobDescription", content),
        setResumeUploadLoading
      );
    } else {
      toast.error("Unsupported file type");
    }
  };

  // Handle removing essential skills tag
  const handleRemoveTag = (tag) => {
    setValue(
      "essentialSkills",
      selectedEssentialSkills.filter(
        (item) => item !== tag
      ),
      { shouldValidate: true }
    );
  };

  // Form submission handler
  const onSubmit = (data) => {
    // Additional validation for essential skills
    if (
      !data.essentialSkills ||
      data.essentialSkills.length === 0
    ) {
      setValue("essentialSkills", [], {
        shouldValidate: true,
      });
      return;
    }

    setFormdata({
      ...formdata,
      name: data.jobRole,
      job_id: data.jobId,
      recruiter_ids: data.recruiters,
      hiring_manager_id: data.hiringManager,
      total_positions: data.totalPositions,
      specialization: data.specialization,
      mandatory_skills: data.essentialSkills,
      job_description_file: data.jobDescriptionFile,
      is_diversity_hiring: data.isDiversityHiring,
    });
    navigateTo("jobs/job-details");
  };

  const onBack = () => {
    window.history.back();
  };

  // First load check
  useEffect(() => {
    const isFirstLoad =
      localStorage.getItem("hasLoaded") !== "true";

    if (!isFirstLoad) {
      navigateTo("jobs");
    } else {
      localStorage.setItem("hasLoaded", "true");
    }

    return () => {
      localStorage.removeItem("hasLoaded");
    };
  }, [navigateTo]);

  // Initialize form with existing data
  useEffect(() => {
    if (Object.keys(formdata).length > 0) {
      const resetData = {
        jobRole: formdata.name || "",
        jobId: formdata.job_id || "",
        recruiters: formdata.recruiter_ids || [],
        hiringManager: formdata.hiring_manager_id || null,
        totalPositions: formdata.total_positions || "",
        specialization: formdata.specialization || null,
        essentialSkills: formdata.mandatory_skills || [],
        isDiversityHiring:
          formdata.is_diversity_hiring || false,
      };
      if (formdata.job_description_file instanceof File) {
        resetData.jobDescriptionFile =
          formdata.job_description_file;
        handleFileUpload(formdata.job_description_file);
      }
      reset(resetData);
      if (isClientUser) {
        setHiringManagerName(formdata?.hiring_manager_name);
        setRecruiterNames(formdata?.recruiter_names);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formdata, reset, setValue, isClientUser]);

  return (
    <div className="flex gap-x-14">
      <div className="w-full max-w-[500px] my-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={formRowClassName}>
            <label
              className={`${labelClassName} required-field-label`}
            >
              Job Role
            </label>
            {isClientUser && isEdit ? (
              <div className="w-2/3 rounded-lg text-2xs py-2 px-3 border border-[#CAC4D0] bg-gray-100 opacity-70 cursor-not-allowed text-[#49454F]">
                {JOB_NAMES.find(
                  (job) => job.id === watch("jobRole")
                )?.name || ""}
              </div>
            ) : (
              <Controller
                name="jobRole"
                control={control}
                rules={{ required: "Job Role is required" }}
                render={({ field }) => (
                  <CustomSelect
                    isDropdownOpen={isJobRoleDropdownOpen}
                    setIsDropdownOpen={
                      setIsJobRoleDropdownOpen
                    }
                    selectedValue={field.value}
                    setSelectedValue={(value) =>
                      field.onChange(value)
                    }
                    dropdownOptions={JOB_NAMES}
                    errors={errors}
                    type="jobRole"
                    disabled={shouldBeDisabled}
                  />
                )}
              />
            )}
          </div>

          <div className={formRowClassName}>
            <label className={labelClassName}>Job ID</label>
            <Controller
              name="jobId"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  placeholder="Optional"
                  className={inputClassName}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          </div>

          <div className={formRowClassName}>
            <label
              className={`${labelClassName} required-field-label`}
            >
              Assigned Recruiter
            </label>
            {isClientUser && isEdit ? (
              <div className="w-2/3 rounded-lg text-2xs py-1 px-3 border border-[#CAC4D0] bg-gray-100 opacity-70 cursor-not-allowed">
                <div className="flex flex-wrap gap-1">
                  {recruiterNames.length > 0 ? (
                    recruiterNames.map((name, idx) => (
                      <span
                        key={idx}
                        className="flex items-center bg-[#F8F8F8] text-2xs font-semibold px-2 py-1 rounded-lg border border-[#CAC4D0] text-[#49454F]"
                      >
                        {name}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">
                      No recruiters assigned
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <Controller
                name="recruiters"
                control={control}
                rules={{
                  required: "Recruiters are required",
                }}
                render={({ field }) => (
                  <MultiSelect
                    selectedRecruiters={field.value}
                    setSelectedRecruiters={(value) =>
                      field.onChange(value)
                    }
                    isRecruitersDropdownOpen={
                      isRecruitersDropdownOpen
                    }
                    setIsRecruitersDropdownOpen={
                      setIsRecruitersDropdownOpen
                    }
                    options={filteredRecruiters}
                    errors={errors}
                    disabled={shouldBeDisabled}
                  />
                )}
              />
            )}
          </div>

          <div className={formRowClassName}>
            <label
              className={`${labelClassName} required-field-label`}
            >
              Hiring Manager
            </label>
            {isClientUser && isEdit ? (
              <div className="w-2/3 rounded-lg text-2xs py-2 px-3 border border-[#CAC4D0] bg-gray-100 opacity-70 cursor-not-allowed text-[#49454F]">
                {hiringManagerName ||
                  "No hiring manager assigned"}
              </div>
            ) : (
              <Controller
                name="hiringManager"
                control={control}
                rules={{
                  required: "Hiring Manager is required",
                }}
                render={({ field }) => (
                  <CustomSelect
                    isDropdownOpen={
                      isHiringManagersDropdownOpen
                    }
                    setIsDropdownOpen={
                      setIsHiringManagersDropdownOpen
                    }
                    selectedValue={field.value}
                    setSelectedValue={(value) =>
                      field.onChange(value)
                    }
                    dropdownOptions={filteredHiringManagers}
                    errors={errors}
                    type="hiringManager"
                    disabled={shouldBeDisabled}
                  />
                )}
              />
            )}
          </div>

          <div className={formRowClassName}>
            <label className={labelClassName}>
              Total Positions
            </label>
            <Controller
              name="totalPositions"
              control={control}
              rules={{
                required: "Total Positions are required",
              }}
              render={({ field }) => (
                <input
                  type="number"
                  placeholder="-"
                  className={`${inputClassName} ${
                    errors.totalPositions
                      ? "border-[#B10E0EE5]"
                      : ""
                  }`}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          </div>

          <div className={formRowClassName}>
            <label
              className={`${labelClassName} required-field-label`}
            >
              Function
            </label>
            <Controller
              name="specialization"
              control={control}
              rules={{ required: "Function is required" }}
              render={({ field }) => (
                <CustomSelect
                  isDropdownOpen={
                    isSpecializationDropdownOpen
                  }
                  setIsDropdownOpen={
                    setIsSpecializationDropdownOpen
                  }
                  selectedValue={field.value}
                  setSelectedValue={(value) =>
                    field.onChange(value)
                  }
                  dropdownOptions={SPECIALIZATIONS}
                  errors={errors}
                  type="specialization"
                />
              )}
            />
          </div>

          {/* <div className={formRowClassName}>
          <label className={labelClassName}>
            IC/Manager
          </label>
          <select style={styles.select}>
            <option value="IC">IC</option>
            <option value="Manager">Manager</option>
          </select>
        </div> */}

          <div className={formRowClassName}>
            <label
              className={`${labelClassName} required-field-label`}
            >
              Job Description
            </label>
            <div className="w-2/3">
              <Controller
                name="jobDescriptionFile"
                control={control}
                rules={{
                  required: "Job Description is required",
                }}
                // eslint-disable-next-line no-unused-vars
                render={({ field }) => (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => {
                        if (
                          e.target.files &&
                          e.target.files[0]
                        ) {
                          handleFileUpload(
                            e.target.files[0]
                          );
                        }
                      }}
                      accept=".pdf,.docx,.txt"
                    />
                    {/* Styled Button */}
                    <button
                      type="button"
                      onClick={handleUploadButtonClick}
                      disabled={resumeUploadLoading}
                      className={`border border-dashed ${
                        errors.jobDescriptionFile
                          ? "border-[#B10E0EE5]"
                          : "border-[#6B6F7B]"
                      } rounded-xl w-full py-[5px] px-3 h-8 text-[#6B6F7B] text-2xs font-medium cursor-pointer flex items-center justify-center gap-3 bg-[#F8F8F8]`}
                    >
                      {resumeUploadLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <LogoutCurve
                            className="rotate-90"
                            color="#171717"
                            size={20}
                          />{" "}
                          Upload Here
                        </>
                      )}
                    </button>
                  </>
                )}
              />
            </div>
          </div>
          <div className="flex justify-end w-full gap-3 mb-3">
            <div className="w-1/3"></div>
            <Controller
              name="jobDescription"
              control={control}
              render={({ field }) => (
                <textarea
                  className={inputClassName}
                  rows={5}
                  placeholder="Paste Job Description Here"
                  readOnly
                  value={field.value}
                />
              )}
            />
          </div>
          <div className={formRowClassName}>
            <label
              className={`${labelClassName} required-field-label`}
            >
              Essentials
            </label>

            <div className="w-2/3">
              <input
                type="hidden"
                {...register("essentialSkills", {
                  validate: (value) =>
                    (value && value.length > 0) ||
                    "At least one essential skill is required",
                })}
              />
              <DynamicMultiSelect
                selectedValues={selectedEssentialSkills}
                placeholder="Essential Skills"
                setValue={(value) =>
                  setValue(
                    "essentialSkills",
                    [...selectedEssentialSkills, value],
                    { shouldValidate: true }
                  )
                }
              />
              {errors.essentialSkills && (
                <p className="text-2xs text-[#B10E0EE5] mt-1">
                  {errors.essentialSkills.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end w-full gap-3">
            <div className="w-1/3"></div>
            <div className="flex flex-wrap gap-3 w-2/3">
              {selectedEssentialSkills.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center justify-between bg-white text-xs font-semibold px-2 py-1 rounded-lg border border-[#CAC4D0] text-[#49454F]"
                >
                  {tag}
                  <button
                    className="ml-2 text-[#49454F] focus:outline-none"
                    onClick={() => handleRemoveTag(tag)}
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className={formRowClassName}>
            <div className="w-1/3"></div>
            <div className="w-2/3 flex items-center mt-3">
              <Controller
                name="isDiversityHiring"
                control={control}
                render={({
                  field: { onChange, value },
                }) => (
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={onChange}
                    disabled={shouldBeDisabled}
                    className="h-4 w-4 rounded border-gray-300 text-[#007AFF] focus:ring-[#007AFF] mr-2 cursor-pointer"
                  />
                )}
              />
              <span className="text-2xs text-[#49454F]">
                Enable diversity hiring for this job
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-1/3"></div>
            <p className="text-2xs text-[#B10E0EE5] w-2/3 mt-4">
              {Object.keys(errors).length > 0 &&
                "Please fill all the required fields"}
            </p>
          </div>
          <div className="flex justify-end items-center gap-2 mt-4">
            <CancelButton label={"Back"} onClick={onBack} />
            <SaveButton
              label={isEdit ? "Update" : "Continue"}
              type="submit"
              disabled={false}
              onClick={() => {}}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJob;

const labelClassName =
  "text-2xs font-bold text-[#6B6F7B] text-right w-1/3";

const formRowClassName =
  "flex items-center justify-between mb-3 gap-3";

const inputClassName =
  "rounded-lg text-2xs py-2 px-3 w-2/3 border border-[#CAC4D0] text-[#49454F]";
