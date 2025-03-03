import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DynamicMultiSelect from "../../../utils/DynamicMultiSelect";
import { LogoutCurve } from "iconsax-react";
import MultiSelect from "../../../utils/MultiSelect";
import useAllUsers from "../../../hooks/useFetchAllUsers";
import CustomSelect from "../../../utils/CustomSelect";
import { JOB_NAMES } from "../../Constants/constants";
import {
  handlePdfFile,
  handleTxtAndDocxFile,
} from "../../../utils/util";
import toast from "react-hot-toast";
import { useJobContext } from "../../../context/JobContext";

const AddJob = () => {
  const navigate = useNavigate();
  const { formdata, setFormdata, isEdit } = useJobContext();

  const fileInputRef = useRef(null);
  const { data: users } = useAllUsers();

  const [selectedJobRole, setSelectedJobRole] =
    useState(null);
  const [isJobRoleDropdownOpen, setIsJobRoleDropdownOpen] =
    useState(false);
  const [jobId, setJobId] = useState("");
  const [selectedRecruiters, setSelectedRecruiters] =
    useState([]);
  const [
    isRecruitersDropdownOpen,
    setIsRecruitersDropdownOpen,
  ] = useState(false);
  const [
    selectedHiringManagers,
    setSelectedHiringManagers,
  ] = useState(null);
  const [
    isHiringManagersDropdownOpen,
    setIsHiringManagersDropdownOpen,
  ] = useState(false);
  const [totalPositions, setTotalPositions] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [
    selectedEssentialSkills,
    setSelectedEssentialSkills,
  ] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [
    isEssentialSkillsDropdownOpen,
    setIsEssentialSkillsDropdownOpen,
  ] = useState(false);
  const [errors, setErrors] = useState({});

  const handleAddTag = (value) => {
    if (
      value.trim() &&
      !selectedEssentialSkills.includes(value)
    ) {
      setSelectedEssentialSkills([
        ...selectedEssentialSkills,
        value,
      ]);
    }
    setInputValue("");
    setIsEssentialSkillsDropdownOpen(false);
  };

  const handleRemoveTag = (tag) => {
    setSelectedEssentialSkills(
      selectedEssentialSkills.filter((item) => item !== tag)
    );
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (file) => {
    if (!file) return;

    const extension = file.name
      ?.split(".")
      .pop()
      .toLowerCase();
    setUploadedFile(file);
    if (extension === "txt" || extension === "docx") {
      handleTxtAndDocxFile(file, setJobDescription);
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        if (file && newErrors.jobDescriptionFile) {
          delete newErrors.jobDescriptionFile;
        }
        return newErrors;
      });
    } else if (extension === "pdf") {
      handlePdfFile(file, setJobDescription);
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        if (file && newErrors.jobDescriptionFile) {
          delete newErrors.jobDescriptionFile;
        }
        return newErrors;
      });
    } else {
      toast.error("Unsupported file type", {
        position: "top-right",
      });
    }
  };

  const filteredRecruiters = users?.filter(
    (user) => user.id !== selectedHiringManagers
  );

  const filteredHiringManagers = users?.filter(
    (user) =>
      !selectedRecruiters.some(
        (recruiter) => recruiter === user.id
      )
  );

  const validateForm = () => {
    let newErrors = {};

    if (!selectedJobRole)
      newErrors.jobRole = "Job Role is required";
    if (!selectedHiringManagers)
      newErrors.hiringManager =
        "Hiring Manager is required";
    if (!selectedRecruiters.length)
      newErrors.recruiters = "Recruiters are required";
    if (!totalPositions.trim())
      newErrors.totalPositions =
        "Total Positions are required";
    if (!uploadedFile)
      newErrors.jobDescriptionFile =
        "Job Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setFormdata({
        ...formdata,
        name: selectedJobRole,
        job_id: jobId,
        recruiter_ids: selectedRecruiters,
        hiring_manager_id: selectedHiringManagers,
        total_positions: totalPositions,
        mandatory_skills: selectedEssentialSkills,
        job_description_file: uploadedFile,
      });
      navigate("/client/jobs/job-details");
    }
  };

  const onBack = () => {
    window.history.back();
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

  useEffect(() => {
    if (formdata.name) {
      setSelectedJobRole(formdata.name);
    }
    if (formdata.job_id) {
      setJobId(formdata.job_id);
    }
    if (formdata.recruiter_ids) {
      setSelectedRecruiters(formdata.recruiter_ids);
    }
    if (formdata.hiring_manager_id) {
      setSelectedHiringManagers(formdata.hiring_manager_id);
    }
    if (formdata.total_positions) {
      setTotalPositions(formdata.total_positions);
    }
    if (formdata.mandatory_skills) {
      setSelectedEssentialSkills(formdata.mandatory_skills);
    }
    if (
      formdata.job_description_file &&
      Object.keys(formdata.job_description_file).length > 0
    ) {
      setUploadedFile(formdata.job_description_file);
      handleFileUpload(formdata.job_description_file);
    }
  }, [formdata]);

  return (
    <div className="flex gap-x-14">
      <div className="w-full max-w-[500px] my-5">
        <form onSubmit={handleSubmit}>
          <div className={formRowClassName}>
            <label className={labelClassName}>
              Job Role
            </label>
            <CustomSelect
              isDropdownOpen={isJobRoleDropdownOpen}
              setIsDropdownOpen={setIsJobRoleDropdownOpen}
              selectedValue={selectedJobRole}
              setSelectedValue={setSelectedJobRole}
              dropdownOptions={JOB_NAMES}
              errors={errors}
              type="jobRole"
              setErrors={setErrors}
            />
          </div>

          <div className={formRowClassName}>
            <label className={labelClassName}>Job ID</label>
            <input
              type="text"
              placeholder="Optional"
              className={inputClassName}
              onChange={(e) => setJobId(e.target.value)}
              value={jobId}
            />
          </div>

          <div className={formRowClassName}>
            <label className={labelClassName}>
              Assigned Recruiter
            </label>
            <MultiSelect
              selectedRecruiters={selectedRecruiters}
              setSelectedRecruiters={setSelectedRecruiters}
              isRecruitersDropdownOpen={
                isRecruitersDropdownOpen
              }
              setIsRecruitersDropdownOpen={
                setIsRecruitersDropdownOpen
              }
              options={filteredRecruiters}
              errors={errors}
              setErrors={setErrors}
            />
          </div>

          <div className={formRowClassName}>
            <label className={labelClassName}>
              Hiring Manager
            </label>
            <CustomSelect
              isDropdownOpen={isHiringManagersDropdownOpen}
              setIsDropdownOpen={
                setIsHiringManagersDropdownOpen
              }
              selectedValue={selectedHiringManagers}
              setSelectedValue={setSelectedHiringManagers}
              dropdownOptions={filteredHiringManagers}
              errors={errors}
              type="hiringManager"
              setErrors={setErrors}
            />
          </div>

          <div className={formRowClassName}>
            <label className={labelClassName}>
              Total Positions
            </label>
            <input
              type="number"
              placeholder="-"
              className={`${inputClassName} ${
                errors.totalPositions
                  ? "border-[#B10E0EE5]"
                  : ""
              }`}
              onChange={(e) => {
                setTotalPositions(e.target.value);
                setErrors((prevErrors) => {
                  const newErrors = { ...prevErrors };
                  if (
                    e.target.value &&
                    newErrors.totalPositions
                  ) {
                    delete newErrors.totalPositions;
                  }
                  return newErrors;
                });
              }}
              value={totalPositions}
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
            <label className={labelClassName}>
              Job Description
            </label>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                e.preventDefault();
                handleFileUpload(e.target.files[0]);
              }}
              accept=".pdf,.docx,.txt"
            />
            {/* Styled Button */}
            <button
              type="button"
              onClick={handleUploadButtonClick}
              className={`border border-dashed ${
                errors.jobDescriptionFile
                  ? "border-[#B10E0EE5]"
                  : "border-[#6B6F7B]"
              } rounded-xl w-2/3 py-[5px] px-3 text-[#6B6F7B] text-2xs font-medium cursor-pointer flex items-center justify-center gap-3 bg-[#F8F8F8]`}
            >
              <LogoutCurve
                className="rotate-90"
                color="#171717"
                size={20}
              />{" "}
              Upload Here
            </button>
          </div>
          <div className="flex justify-end w-full gap-3 mb-3">
            <div className="w-1/3"></div>
            <textarea
              className={inputClassName}
              rows={5}
              placeholder="Paste Job Description Here"
              readOnly
              value={jobDescription}
            />
          </div>
          <div className={formRowClassName}>
            <label className={labelClassName}>
              Essentials
            </label>

            <DynamicMultiSelect
              inputValue={inputValue}
              setInputValue={setInputValue}
              isEssentialSkillsDropdownOpen={
                isEssentialSkillsDropdownOpen
              }
              setIsEssentialSkillsDropdownOpen={
                setIsEssentialSkillsDropdownOpen
              }
              handleAddTag={handleAddTag}
            />
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
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-1/3"></div>
            <p className="text-xs text-[#B10E0EE5] w-2/3 mt-4">
              {Object.keys(errors).length > 0 &&
                "Please fill all the required fields"}
            </p>
          </div>
          <div className="flex justify-end items-center gap-2 mt-4">
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
              type="submit"
            >
              {isEdit ? "Update" : "Continue"}
            </button>
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
