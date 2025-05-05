import {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import axios from "../../api/axios";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  DOMAINS,
  EMAIL_REGEX,
  MOBILE_REGEX,
} from "../Constants/constants";
import { useForm } from "react-hook-form";
import RolesSelect from "./Components/RolesSelect";
import DynamicMultiSelect from "../../utils/DynamicMultiSelect";
import { LogoutCurve } from "iconsax-react";

function AddInterviewer() {
  const [selectedStrength, setSelectedStrength] =
    useState("");
  const [
    selectedInterviewerLevel,
    setSelectedInterviewerLevel,
  ] = useState("");
  const [items, setItems] = useState([]);
  const [itemsSkills, setItemsSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setError,
    setValue,
    clearErrors,
    watch,
  } = useForm();
  const hasInteracted = useRef(false); // Ref to track if the user has interacted with the form

  // Watch for account number to compare with confirm account number and for conditional IFSC validation
  const accountNumber = watch("accountNumber");

  // URL validation regex
  const URL_REGEX =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  const validateRoles = useCallback(() => {
    if (items.length === 0) {
      setError("role", {
        type: "manual",
        message: "Please select at least one role.",
      });
    } else {
      clearErrors("role");
    }
  }, [items, setError, clearErrors]);

  const validateFile = useCallback(() => {
    if (!uploadedFile) {
      setError("cv", {
        type: "manual",
        message: "Please a upload file",
      });
    } else {
      clearErrors("cv");
    }
  }, [uploadedFile, setError, clearErrors]);

  useEffect(() => {
    // Revalidate role when items change, only if the user has interacted
    if (hasInteracted.current) {
      validateRoles();
    }
  }, [items, validateRoles]);

  useEffect(() => {
    // Revalidate skills when items change, only if the user has interacted
    if (hasInteracted.current) {
      trigger("skills"); // Trigger validation
    }
  }, [itemsSkills, trigger]);

  useEffect(() => {
    // Revalidate strength when items change, only if the user has interacted
    if (hasInteracted.current) {
      trigger("strength"); // Trigger validation
    }
  }, [selectedStrength, trigger]);

  useEffect(() => {
    // Revalidate interviewer level when changed, only if the user has interacted
    if (hasInteracted.current) {
      trigger("interviewer_level"); // Trigger validation
    }
  }, [selectedInterviewerLevel, trigger]);

  useEffect(() => {
    if (hasInteracted.current) {
      validateFile();
    }
  }, [uploadedFile, validateFile]);

  // Add effect to trigger IFSC validation when account number changes
  useEffect(() => {
    if (hasInteracted.current && accountNumber) {
      trigger("ifscCode");
    }
  }, [accountNumber, trigger]);

  const handleSelection = (value) => {
    const selectedRole = value;
    hasInteracted.current = true; // Mark as interacted

    if (selectedRole && !items.includes(selectedRole.id)) {
      setItems([...items, selectedRole.id]);
    }
  };

  const removeItem = (ItemToRemove) => {
    const updatedItems = items.filter(
      (item) => item !== ItemToRemove
    );
    setItems(updatedItems);
  };

  const handleSkillSelection = (value) => {
    hasInteracted.current = true; // Mark as interacted
    const skillsArray = value
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== ""); // Remove empty strings

    // Filter out skills that already exist in selectedEssentialSkills
    const newSkills = skillsArray.filter(
      (skill) => !itemsSkills.includes(skill)
    );

    if (newSkills.length > 0) {
      setItemsSkills((prev) => [...prev, ...newSkills]);
    }
  };

  const removeSkill = (ItemToRemove) => {
    const updatedSkills = itemsSkills.filter(
      (item) => item !== ItemToRemove
    );
    setItemsSkills(updatedSkills);

    if (updatedSkills.length === 0) {
      setError("skills", {
        type: "manual",
        message: "Please select at least one skill.",
      });
    }
  };

  // Function to add a social link
  const addSocialLink = (e) => {
    e.preventDefault();
    const linkValue = document
      .getElementById("socialLink")
      .value.trim();

    if (!linkValue) return;

    if (!URL_REGEX.test(linkValue)) {
      setError("socialLink", {
        type: "manual",
        message: "Please enter a valid URL",
      });
      return;
    }

    if (socialLinks.length >= 3) {
      setError("socialLink", {
        type: "manual",
        message: "Maximum 3 links can be added",
      });
      return;
    }

    // Determine link type
    let linkType = "website";

    if (linkValue.includes("github.com")) {
      linkType = "github";
    } else if (linkValue.includes("linkedin.com")) {
      linkType = "linkedin";
    } else if (
      linkValue.includes("twitter.com") ||
      linkValue.includes("x.com")
    ) {
      linkType = "twitter";
    } else if (linkValue.includes("medium.com")) {
      linkType = "medium";
    } else if (linkValue.includes("facebook.com")) {
      linkType = "facebook";
    } else if (linkValue.includes("instagram.com")) {
      linkType = "instagram";
    } else {
      try {
        const url = new URL(linkValue);
        const hostname = url.hostname;
        // Get the domain without www. and subdomain
        const domainParts = hostname.split(".");
        if (domainParts.length >= 2) {
          // Get just the main domain name (e.g., "example" from "example.com")
          linkType = domainParts[domainParts.length - 2];
        } else {
          linkType = hostname;
        }
        // eslint-disable-next-line no-unused-vars
      } catch (e) {
        // If URL parsing fails, fall back to a simple extraction
        const match = linkValue.match(
          new RegExp("//(?:www\\.)?([^/]+)")
        );
        if (match && match[1]) {
          const domain = match[1].split(".")[0];
          linkType =
            domain !== "www"
              ? domain
              : match[1].split(".")[1];
        } else {
          linkType = "other";
        }
      }
    }

    setSocialLinks([
      ...socialLinks,
      { type: linkType, url: linkValue },
    ]);
    document.getElementById("socialLink").value = "";
    clearErrors("socialLink");
  };
  // Function to remove a social link
  const removeSocialLink = (index) => {
    const updatedLinks = [...socialLinks];
    updatedLinks.splice(index, 1);
    setSocialLinks(updatedLinks);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      hasInteracted.current = true;
      setUploadedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append("name", data.interviewerName);
      formdata.append("phone_number", "+91" + data.phone);
      formdata.append("email", data.email);
      formdata.append(
        "current_company",
        data.currentCompany
      );
      formdata.append(
        "previous_company",
        data.previousCompany
      );
      formdata.append(
        "current_designation",
        data.currentDesignation
      );
      formdata.append(
        "interviewer_level",
        data.interviewer_level
      );
      formdata.append(
        "total_experience_years",
        data.totalExperienceYears
      );
      formdata.append(
        "total_experience_months",
        data.totalExperienceMonths
      );
      formdata.append(
        "interview_experience_years",
        data.interviewExperienceYears
      );
      formdata.append(
        "interview_experience_months",
        data.interviewExperienceMonths
      );
      formdata.append("assigned_domain_ids", items);
      formdata.append(
        "skills",
        JSON.stringify(itemsSkills)
      );
      formdata.append("strength", data.strength);
      formdata.append("cv", uploadedFile);

      // Add new fields only if they are entered
      if (data.accountNumber) {
        formdata.append(
          "account_number",
          data.accountNumber
        );
      }

      if (data.ifscCode) {
        formdata.append("ifsc_code", data.ifscCode);
      }

      // Add social links if any
      if (socialLinks.length > 0) {
        const socialLinksObj = {};
        socialLinks.forEach((link) => {
          socialLinksObj[link.type] = link.url;
        });
        formdata.append(
          "social_links",
          JSON.stringify(socialLinksObj)
        );
      }

      await axios.post(
        "/api/internal/interviewers/",
        formdata
      );
      toast.success("Interviewer added successfully", {
        position: "top-right",
      });
      navigate("/internal/interviewer");
    } catch (error) {
      let errorMessages;
      if (error?.response?.data?.errors) {
        errorMessages = Object.entries(
          error.response.data.errors
        ).flatMap(([key, values]) =>
          values.map((value) => `${key}: ${value}`)
        );
      }
      toast.error(
        errorMessages?.join(", ") ||
          "Failed to add interviewer",
        { position: "top-right" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(onSubmit)(e);
        validateRoles();
        validateFile();
      }}
    >
      <div className=" text-[14px]">
        <div className="  ">
          {/* MAIN 1 */}

          <div className=" ">
            <ul className="grid grid-cols-2 grid-rows-2 gap-2  pl-0 ">
              <li className="flex items-center justify-start gap-x-4 ">
                <div className="w-[30%]  flex items-end justify-end">
                  <label
                    htmlFor="interviewerName"
                    className="w-full text-right text-[12px] text-[#6B6F7B] font-bold required-field-label"
                  >
                    Interviewer Name
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    type="text"
                    name="interviewerName"
                    placeholder="Interviewer Name"
                    className=" 2xl:w-[360px] xl:w-[300px]  h-[32px] md: border border-gray-300  text-center rounded-lg py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                    {...register("interviewerName", {
                      required:
                        "Interviewer Name is required",
                      maxLength: {
                        value: 255,
                        message:
                          "Name must be less than 255 characters",
                      },
                    })}
                  />
                  {errors.interviewerName && (
                    <span className="error-message">
                      {errors.interviewerName.message}
                    </span>
                  )}
                </div>
              </li>

              <li className="flex items-center justify-start gap-x-4 ">
                <div className="w-[30%]  flex items-end justify-end">
                  <label
                    htmlFor="phone"
                    className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold required-field-label"
                  >
                    Phone Number
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    className=" 2xl:w-[360px] xl:w-[300px] h-[32px] border border-gray-300  text-center rounded-lg py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                    {...register("phone", {
                      required: "Phone Number is required",
                      pattern: {
                        value: MOBILE_REGEX,
                        message:
                          "Phone number must be exactly 10 digits",
                      },
                    })}
                  />
                  {errors.phone && (
                    <span className="error-message">
                      {errors.phone.message}
                    </span>
                  )}
                </div>
              </li>
              <li className="flex items-center justify-start gap-x-4 ">
                <div className="w-[30%]  flex items-end justify-end">
                  <label
                    htmlFor="email"
                    className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold required-field-label"
                  >
                    Email ID
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email ID"
                    className=" 2xl:w-[360px] xl:w-[300px] h-[32px] border border-gray-300 text-center rounded-lg py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: EMAIL_REGEX,
                        message:
                          "Email must be in the correct format",
                      },
                    })}
                  />
                  {errors.email && (
                    <span className="error-message">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </li>
            </ul>
          </div>
          <hr className=" h-[2px] rounded-full bg-[#F4F4F4] my-4" />

          {/* MAIN 2 */}
          <div className="">
            <ul className="grid grid-cols-2 grid-rows-2 gap-2 ">
              <li className="flex items-center justify-start gap-x-4 ">
                <div className="w-[30%]  flex items-end justify-end">
                  <label
                    htmlFor="currentCompany"
                    className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold required-field-label"
                  >
                    Current Company
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    type="text"
                    name="currentCompany"
                    placeholder="Current Company"
                    className=" 2xl:w-[360px] xl:w-[300px] h-[32px] border border-gray-300  text-center rounded-lg py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                    {...register("currentCompany", {
                      required:
                        "Current Company is required",
                      maxLength: {
                        value: 255,
                        message:
                          "Current company must be less than 255 characters",
                      },
                    })}
                  />
                  {errors.currentCompany && (
                    <span className="error-message">
                      {errors.currentCompany.message}
                    </span>
                  )}
                </div>
              </li>

              <li className="flex items-center justify-start gap-x-4 ">
                <div className="w-[30%]  flex items-end justify-end">
                  <label
                    htmlFor="previousCompany"
                    className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold required-field-label"
                  >
                    Previous Company
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    type="text"
                    name="previousCompany"
                    placeholder="Previous Company"
                    className=" 2xl:w-[360px] xl:w-[300px] h-[32px] border border-gray-300  text-center rounded-lg py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                    {...register("previousCompany", {
                      required:
                        "Previous Company is required",
                      maxLength: {
                        value: 255,
                        message:
                          "Previous company must be less than 255 characters",
                      },
                    })}
                  />
                  {errors.previousCompany && (
                    <span className="error-message">
                      {errors.previousCompany.message}
                    </span>
                  )}
                </div>
              </li>
              <li className="flex items-center justify-start gap-x-4 ">
                <div className="w-[30%]  flex items-end justify-end">
                  <label
                    htmlFor="currentDesignation"
                    className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold required-field-label"
                  >
                    Current Designation
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    type="text"
                    name="currentDesignation"
                    placeholder="Current Designation"
                    className=" 2xl:w-[360px] xl:w-[300px] h-[32px] border border-gray-300 text-center rounded-lg py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                    {...register("currentDesignation", {
                      required:
                        "Current Designation is required",
                      maxLength: {
                        value: 255,
                        message:
                          "Current designation must be less than 255 characters",
                      },
                    })}
                  />
                  {errors.currentDesignation && (
                    <span className="error-message">
                      {errors.currentDesignation.message}
                    </span>
                  )}
                </div>
              </li>
              <li className="flex items-center justify-start gap-x-4 ">
                <div className="w-[30%]  flex items-end justify-end">
                  <label className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold required-field-label">
                    Interviewer Level
                  </label>
                </div>
                <div className="w-1/2">
                  <select
                    name="interviewer_level"
                    {...register("interviewer_level", {
                      required:
                        "Please select an interviewer level.",
                    })}
                    onChange={(e) => {
                      hasInteracted.current = true; // Mark as interacted
                      setSelectedInterviewerLevel(
                        e.target.value
                      );
                      setValue(
                        "interviewer_level",
                        e.target.value
                      );
                    }}
                    className=" 2xl:w-[360px] xl:w-[300px] h-[32px] border border-gray-300 text-center rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                    defaultValue={""}
                  >
                    <option value="" disabled>
                      Select Level
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                  {errors.interviewer_level && (
                    <span className="error-message">
                      {errors.interviewer_level.message}
                    </span>
                  )}
                </div>
              </li>
            </ul>
          </div>
          <hr className=" h-[2px] rounded-full bg-[#F4F4F4] my-4" />

          {/* MAIN 3 */}

          <div className="">
            <ul className="grid grid-cols-2 gap-2   ">
              <li className="flex items-center justify-start gap-x-4 ">
                <div className="w-[30%]  flex items-end justify-end">
                  <label className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold required-field-label">
                    Total Experience
                  </label>
                </div>
                <div className="flex-col justify-start items-center w-1/2  ">
                  <div className="flex items-center 2xl:gap-2 gap-[6px]">
                    <div>
                      <div className="flex items-center 2xl:gap-2 gap-[6px]">
                        <input
                          type="number"
                          name="totalExperienceYears"
                          placeholder="Years"
                          className=" w-[80px] h-[32px] border border-gray-300  text-center rounded-lg pl-2  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                          {...register(
                            "totalExperienceYears",
                            {
                              required:
                                "Total experience in years is required",
                              validate: (value) =>
                                (value >= 0 &&
                                  value <= 100) ||
                                "Total experience in years must be between 0 and 100",
                            }
                          )}
                        />
                        <span className="text-[12px] text-[#6B6F7B] font-bold">
                          Years
                        </span>
                      </div>
                      {errors.totalExperienceYears && (
                        <span className="error-message">
                          {
                            errors.totalExperienceYears
                              .message
                          }
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center 2xl:gap-2 gap-[6px]">
                        <input
                          type="number"
                          name="totalExperienceMonths"
                          placeholder="Months"
                          className=" w-[80px] h-[32px] border border-gray-300  text-center rounded-lg pl-2  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                          {...register(
                            "totalExperienceMonths",
                            {
                              required:
                                "Total experience in months is required",
                              validate: (value) =>
                                (value >= 0 &&
                                  value <= 11) ||
                                "Total experience in months must be between 0 and 11",
                            }
                          )}
                        />
                        <span className="text-[12px] text-[#6B6F7B] font-bold">
                          Months
                        </span>
                      </div>
                      {errors.totalExperienceMonths && (
                        <span className="error-message">
                          {
                            errors.totalExperienceMonths
                              .message
                          }
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>

              <li className="flex items-center justify-start gap-x-4  ">
                <div className="w-[30%]  flex items-end justify-end">
                  <label className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold required-field-label">
                    Interview Experience
                  </label>
                </div>
                <div className="flex-col justify-center items-center w-1/2  ">
                  <div className="flex items-center 2xl:gap-2 gap-[6px]">
                    <div>
                      <div className="flex items-center 2xl:gap-2 gap-[6px]">
                        <input
                          type="number"
                          name="interviewExperienceYears"
                          placeholder="Years"
                          className=" w-[80px] h-[32px] border border-gray-300  text-center rounded-lg pl-2  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                          {...register(
                            "interviewExperienceYears",
                            {
                              required:
                                "Interview experience in years is required",
                              validate: (value) =>
                                (value >= 0 &&
                                  value <= 100) ||
                                "Interview experience in years must be between 0 and 100",
                            }
                          )}
                        />
                        <span className="text-[12px] text-[#6B6F7B] font-bold">
                          Years
                        </span>
                      </div>
                      {errors.interviewExperienceYears && (
                        <span className="error-message">
                          {
                            errors.interviewExperienceYears
                              .message
                          }
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center 2xl:gap-2 gap-[6px]">
                        <input
                          type="number"
                          name="interviewExperienceMonths"
                          placeholder="Months"
                          className=" w-[80px] h-[32px] border border-gray-300  text-center rounded-lg pl-2  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                          {...register(
                            "interviewExperienceMonths",
                            {
                              required:
                                "Interview experience in months is required",
                              validate: (value) =>
                                (value >= 0 &&
                                  value <= 11) ||
                                "Interview experience in months must be between 0 and 11",
                            }
                          )}
                        />
                        <span className="text-[12px] text-[#6B6F7B] font-bold">
                          Months
                        </span>
                      </div>
                      {errors.interviewExperienceMonths && (
                        <span className="error-message">
                          {
                            errors.interviewExperienceMonths
                              .message
                          }
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <hr className=" h-[2px] rounded-full bg-[#F4F4F4] my-4" />

          {/* main 4 single div use */}

          <div className={"mb-2"}>
            <ul className="grid grid-cols-2 gap-2  pb-0 ">
              <li className="flex items-center gap-x-4 justify-start  ">
                <div className="w-[30%]  flex items-center justify-center  ">
                  <label className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold required-field-label">
                    Interview Assigned For
                  </label>
                </div>
                <div className="w-1/2">
                  <RolesSelect
                    errors={errors}
                    items={items}
                    handleSelection={handleSelection}
                    removeItem={removeItem}
                    className=" h-[32px] text-[12px]"
                    dropdownClassName="text-xs"
                  />
                </div>
              </li>

              <li className="flex items-center justify-start gap-x-4 ">
                <div className="w-[30%]  flex items-center justify-center">
                  <label className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold required-field-label">
                    Skills
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    type="hidden"
                    {...register("skills", {
                      validate: () =>
                        itemsSkills.length > 0 ||
                        "Please select at least one skill.",
                    })}
                  />
                  <DynamicMultiSelect
                    selectedValues={itemsSkills}
                    setValue={handleSkillSelection}
                    placeholder="Skills"
                  />
                  {errors.skills && (
                    <span className="error-message">
                      {errors.skills.message}
                    </span>
                  )}
                  {itemsSkills?.length > 0 && (
                    <div className="mt-[8px] w-[300px] gap-x-4">
                      <ul className="flex flex-wrap justify-start gap-2 items-center ">
                        {" "}
                        {itemsSkills.map((item, index) => (
                          <li
                            key={index}
                            className=" flex justify-center items-center h-[32px] border border-[#49454F] pl-1 pr-1 rounded-lg  text-[#49454F]  "
                          >
                            {" "}
                            {item}{" "}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                removeSkill(item);
                              }}
                              className="pl-2"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1.8 11.25L0.75 10.2L4.95 6L0.75 1.8L1.8 0.75L6 4.95L10.2 0.75L11.25 1.8L7.05 6L11.25 10.2L10.2 11.25L6 7.05L1.8 11.25Z"
                                  fill="#49454F"
                                />
                              </svg>
                            </button>{" "}
                          </li>
                        ))}{" "}
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </div>

          {/* main 5 */}

          <ul className="grid grid-cols-2 grid-rows gap-2 ">
            <li className="flex items-center justify-start gap-x-4 ">
              <div className="w-[30%]  flex items-end justify-end">
                <label className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold required-field-label">
                  Strength
                </label>
              </div>
              <div className="w-1/2">
                <select
                  name="strength"
                  {...register("strength", {
                    required: "Please select a strength.",
                  })}
                  onChange={(e) => {
                    hasInteracted.current = true; // Mark as interacted
                    setSelectedStrength(e.target.value);
                    setValue("strength", e.target.value);
                  }}
                  className={`w-full h-[32px] text-left p-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px] border-[#CAC4D0] ${
                    selectedStrength === ""
                      ? "text-gray-500"
                      : "text-black"
                  }`}
                  defaultValue={""}
                >
                  <option value="" disabled>
                    Select Strength
                  </option>
                  {Object.entries(DOMAINS).map(
                    ([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    )
                  )}
                </select>
                {errors.strength && (
                  <span className="error-message">
                    {errors.strength.message}
                  </span>
                )}
              </div>
            </li>
          </ul>
          <hr className=" h-[2px] rounded-full bg-[#F4F4F4] my-4" />

          {/* NEW FIELDS SECTION */}
          <div className="mb-4">
            <ul className="grid grid-cols-2 gap-4">
              {/* Account Number */}
              <li className="flex items-center justify-start gap-x-4">
                <div className="w-[30%] flex items-end justify-end">
                  <label
                    htmlFor="accountNumber"
                    className="w-full text-right text-[12px] text-[#6B6F7B] font-bold"
                  >
                    Account Number
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    type="text"
                    name="accountNumber"
                    placeholder="Account Number"
                    className="2xl:w-[360px] xl:w-[300px] h-[32px] border border-gray-300 text-center rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                    {...register("accountNumber", {
                      pattern: {
                        value: /^[0-9]{9,18}$/,
                        message:
                          "Account number must be 9-18 digits only",
                      },
                    })}
                  />
                  {errors.accountNumber && (
                    <span className="error-message">
                      {errors.accountNumber.message}
                    </span>
                  )}
                </div>
              </li>

              {/* Confirm Account Number */}
              <li className="flex items-center justify-start gap-x-4">
                <div className="w-[30%] flex items-end justify-end">
                  <label
                    htmlFor="confirmAccountNumber"
                    className="w-full text-right text-[12px] text-[#6B6F7B] font-bold"
                  >
                    Confirm Account Number
                  </label>
                </div>
                <div className="w-1/2">
                  <input
                    type="text"
                    name="confirmAccountNumber"
                    placeholder="Confirm Account Number"
                    className="2xl:w-[360px] xl:w-[300px] h-[32px] border border-gray-300 text-center rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                    {...register("confirmAccountNumber", {
                      validate: (value) =>
                        !accountNumber ||
                        value === accountNumber ||
                        "Account numbers do not match",
                      pattern: {
                        value: /^[0-9]{9,18}$/,
                        message:
                          "Account number must be 9-18 digits only",
                      },
                    })}
                  />
                  {errors.confirmAccountNumber && (
                    <span className="error-message">
                      {errors.confirmAccountNumber.message}
                    </span>
                  )}
                </div>
              </li>

              {/* IFSC Code */}
              <li className="">
                <div className="flex items-center justify-start gap-x-4">
                  <div className="w-[30%] flex items-end justify-end">
                    <label
                      htmlFor="ifscCode"
                      className={`w-full text-right text-[12px] text-[#6B6F7B] font-bold ${
                        accountNumber
                          ? "required-field-label"
                          : ""
                      }`}
                    >
                      IFSC Code
                    </label>
                  </div>
                  <div className="w-1/2">
                    <input
                      type="text"
                      name="ifscCode"
                      placeholder="IFSC Code"
                      className="2xl:w-[360px] xl:w-[300px] h-[32px] border border-gray-300 text-center rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                      {...register("ifscCode", {
                        required: {
                          value: !!accountNumber,
                          message: "IFSC Code is required",
                        },
                        pattern: {
                          value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                          message:
                            "Invalid IFSC code format",
                        },
                      })}
                    />
                    {errors.ifscCode && (
                      <span className="error-message">
                        {errors.ifscCode.message}
                      </span>
                    )}
                  </div>
                </div>
              </li>

              {/* Social Links */}
              <li className="flex items-start justify-start gap-x-4">
                <div className="w-[30%] flex items-end justify-end pt-2">
                  <label
                    htmlFor="socialLink"
                    className="w-full text-right text-[12px] text-[#6B6F7B] font-bold"
                  >
                    Social Links (Max 3)
                  </label>
                </div>
                <div className="w-[70%]">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      id="socialLink"
                      name="socialLink"
                      placeholder="Enter Link"
                      className="2xl:w-[360px] xl:w-[300px] h-[32px] border border-gray-300 text-center rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                    />
                    {socialLinks.length < 3 && (
                      <button
                        onClick={addSocialLink}
                        className="bg-blue-500 text-white rounded-lg px-3 h-[32px] text-[12px]"
                      >
                        Add
                      </button>
                    )}
                  </div>
                  {errors.socialLink && (
                    <span className="error-message">
                      {errors.socialLink.message}
                    </span>
                  )}

                  {socialLinks.length > 0 && (
                    <div className="mt-2 2xl:w-[360px] xl:w-[300px]">
                      <ul className="flex flex-col gap-2">
                        {socialLinks.map((link, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center p-2 border rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-[#49454f] capitalize ">
                                {link.type}:
                              </span>
                              <span
                                className="text-xs truncate text-wrap max-w-[200px] text-[#49454f] cursor-pointer hover:underline hover:text-[#007AFF]"
                                onClick={() => {
                                  // open the link in new tab
                                  window.open(
                                    link.url,
                                    "_blank"
                                  );
                                }}
                              >
                                {link.url}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                removeSocialLink(index)
                              }
                              className="text-red-500"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1.8 11.25L0.75 10.2L4.95 6L0.75 1.8L1.8 0.75L6 4.95L10.2 0.75L11.25 1.8L7.05 6L11.25 10.2L10.2 11.25L6 7.05L1.8 11.25Z"
                                  fill="#EF4444"
                                />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </div>
          <hr className=" h-[2px] rounded-full bg-[#F4F4F4] my-4" />

          {/* MAIN 6 - Upload CV */}

          <div className="mt-4">
            <ul className="grid grid-cols-2 gap-2 ">
              <li className="flex items-center justify-start gap-x-4 ">
                <div className="w-[30%]  flex items-end justify-end">
                  <label className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold required-field-label">
                    Upload CV
                  </label>
                </div>
                <div className="w-1/2">
                  <div
                    className="rounded-lg flex justify-center items-center relative cursor-pointer"
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={handleDrop}
                    onClick={() => {
                      hasInteracted.current = true;
                      document
                        .getElementById("fileInput")
                        .click();
                    }}
                  >
                    <input
                      type="file"
                      name="cv"
                      id="fileInput"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          hasInteracted.current = true;
                          setUploadedFile(
                            e.target.files[0]
                          );
                        }
                      }}
                      className="sr-only"
                    />
                    <button className="h-20 w-full flex items-center justify-center border-2 border-dashed border-gray-500 rounded-2xl cursor-pointer bg-white hover:bg-gray-100  text-[#49454F] transition-all">
                      <p className="flex flex-col gap-3 items-center">
                        <LogoutCurve
                          className="rotate-90"
                          color="#49454F"
                          size={20}
                        />
                        <span className="text-2xs font-medium text-[#6B6F7B]">
                          Upload Here
                        </span>
                      </p>
                    </button>
                  </div>
                  {uploadedFile && (
                    <div className="mt-1 flex items-start">
                      <span className="text-gray-700 text-xs">
                        {uploadedFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="ml-2 text-red-500 hover:underline text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {errors.cv && (
                    <span className="error-message">
                      {errors.cv.message}
                    </span>
                  )}
                </div>
              </li>
            </ul>
          </div>

          {/* Submit Button */}

          <div className="mt-4 flex justify-end mr-10 ">
            <button
              disabled={loading}
              type="submit"
              className="primary-button"
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: "white", // Change this to any color you want
                  }}
                />
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export { AddInterviewer as InternalAddInterviewer };
