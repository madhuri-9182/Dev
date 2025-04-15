/* eslint-disable no-unused-vars */

import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { LogoutCurve, Trash } from "iconsax-react";
import { NOTICE_PERIOD } from "./constants";
import { useLocation, useNavigate } from "react-router-dom";
import { useAddEngagement, useResumeParser } from "./api";
import {
  InputField,
  SelectField,
  BooleanSelectField,
  DatePickerField,
} from "./components/EngagementFormComponents"; // Import the reusable components
import { Loader2 } from "lucide-react";
import {
  CancelButton,
  SaveButton,
} from "../../shared/SaveAndCancelButtons";
import {
  EMAIL_REGEX,
  MOBILE_REGEX,
} from "../../Constants/constants";
import {
  createFileFromUrl,
} from "../../../utils/util";

const EngagementForm = ({
  setSelectedEngagement,
}) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const {
    data,
    isPending,
    mutateAsync: getResumeData,
  } = useResumeParser();

  const {
    mutateAsync: addEngagement,
    isPending: isAddingEngagement,
  } = useAddEngagement();

  const [resumeFile, setResumeFile] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    trigger,
    watch,
  } = useForm({
    defaultValues: {
      candidate_name: state ? state.candidate.name : "",
      candidate_phone: state
        ? state.candidate.phone.split("+91")[1]
        : "",
      candidate_email: state ? state.candidate.email : "",
      candidate_company: state
        ? state.candidate.company
        : "",
      notice_period: "",
      offer_accepted: false,
      offered: false,
      offer_date: null,
      client_user_email: "",
      other_offer: false,
      job: '',
      client_user_name: "",
    },
    mode: "onChange",
  });

  // Watch the offered value to conditionally validate offer_date
  const isOffered = watch("offered");

  // Effect to validate fields on mount if state exists
  useEffect(() => {
    if (state) {
      // Set resume file if state exists
      if (state.candidate.cv) {
        const fetchResume = async (cv) => {
          const file = await createFileFromUrl(cv);
          return file;
        };
        fetchResume(state.candidate.cv)
          .then((file) => {
            setResumeFile(file);
          })
          .catch((error) => {
            console.error("Error fetching resume:", error);
          });
      }

      // Determine which fields to validate based on offered status
      const fieldsToValidate = [
        "candidate_name",
        "candidate_email",
        "candidate_phone",
        "candidate_company",
        "notice_period",
        "job",
        "client_user_name",
        "client_user_email",
      ];

      // Only validate offer_date if offered is true
      if (isOffered) {
        fieldsToValidate.push("offer_date");
      }

      // Trigger validation for all fields from state
      trigger(fieldsToValidate);
    }
  }, [state, trigger, isOffered]);

  // Handle file upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    fileInputRef.current.value = "";
    setResumeFile(file);

    try {
      const [data] = await getResumeData(file);

      let processedPhoneNumber = data.phone_number;
      if (processedPhoneNumber?.startsWith("+91")) {
        processedPhoneNumber =
          processedPhoneNumber.substring(3);
      } else if (processedPhoneNumber?.startsWith("+")) {
        processedPhoneNumber =
          processedPhoneNumber.substring(1);
      }

      // Update form values from resume
      setValue("candidate_name", data.name || "");
      setValue("candidate_email", data.email || "");
      setValue(
        "candidate_phone",
        processedPhoneNumber || ""
      );
      setValue(
        "candidate_company",
        data.current_company || ""
      );

      // Fields to validate
      const fieldsToValidate = [
        "candidate_name",
        "candidate_email",
        "candidate_phone",
        "candidate_company",
        "notice_period",
        "job",
        "client_user_name",
        "client_user_email",
      ];

      // Only validate offer_date if offered is true
      if (isOffered) {
        fieldsToValidate.push("offer_date");
      }

      // Trigger validation for all applicable fields
      await trigger(fieldsToValidate);
    } catch (error) {
      console.error("Error parsing resume:", error);
    }
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    reset();
  };

  const onSubmit = async (formData) => {
    if (!resumeFile && !state) {
      return;
    }

    // Determine which fields to validate based on offered status
    const fieldsToValidate = [
      "candidate_name",
      "candidate_email",
      "candidate_phone",
      "candidate_company",
      "notice_period",
      "job",
      "client_user_name",
      "client_user_email",
    ];

    // Only validate offer_date if offered is true
    if (formData.offered) {
      fieldsToValidate.push("offer_date");
    }

    const isValid = await trigger(fieldsToValidate);
    if (!isValid) return;

    const payload = {
      ...formData,
      candidate_cv: resumeFile,
      candidate_phone: "+91" + formData.candidate_phone,
      gtp_email: formData.client_user_email,
      gtp_name: formData.client_user_name,
    };

    delete payload.client_user_email;
    delete payload.client_user_name;
    delete payload.candidate_company;
    delete payload.client_user_id;

    if (!formData.offered) {
      delete payload.offer_date;
    }

    if (state && Object.keys(state?.candidate).length > 0) {
      payload.candidate_id = state.candidate.id;
      delete payload.candidate_name;
      delete payload.candidate_email;
      delete payload.candidate_phone;
      delete payload.candidate_cv;
    }

    try {
      const res = await addEngagement(payload);
      setSelectedEngagement({ ...res.data });
      setTimeout(() => {
        navigate("/client/engagement/event-schedular");
      }, 500);
    } catch (error) {
      console.error("Error adding engagement:", error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const shouldFieldsBeDisabled = state
    ? false
    : isPending || !resumeFile;

  return (
    <div className="w-full px-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Resume Upload */}
        <div className="flex items-center w-full mb-6">
          <label className="w-32 flex-shrink-0 text-2xs font-semibold text-[#6B6F7B]">
            Upload CV
          </label>
          <div className="flex-1">
            <div className="w-full">
              {state ? (
                <button
                  className="flex items-center justify-center px-10 py-1.5 text-2xs border border-dashed rounded-xl bg-[#F8F8F8] min-w-[300px] gap-x-2 h-[32px] border-[#6B6F7B] cursor-not-allowed"
                  disabled={true}
                >
                  <span className="text-gray-600">
                    {
                      state?.candidate.cv
                        .split("/")
                        .pop()
                        .split("?")[0]
                    }
                  </span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className={`flex items-center justify-center px-10 py-1.5 text-2xs border border-dashed rounded-xl bg-[#F8F8F8] min-w-[300px] gap-x-2 h-[32px] ${
                      !resumeFile && errors.candidate_cv
                        ? "border-red-500"
                        : "border-[#6B6F7B]"
                    }`}
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="animate-spin text-[#979DA3]" />
                    ) : (
                      <>
                        <LogoutCurve
                          className="rotate-90"
                          color="#171717"
                          size={20}
                        />
                        <span className="text-gray-600">
                          {resumeFile
                            ? resumeFile.name
                            : "Upload here"}
                        </span>
                        {resumeFile && (
                          <Trash
                            size={20}
                            color="red"
                            onClick={handleRemoveFile}
                          />
                        )}
                      </>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Candidate Information Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-6 mt-20 w-full">
          {/* Candidate Name */}
          <InputField
            name="candidate_name"
            control={control}
            rules={{ required: "Name is required" }}
            label="Name"
            placeholder="Name"
            disabled={shouldFieldsBeDisabled}
            required={true}
          />

          {/* Phone Number */}
          <InputField
            name="candidate_phone"
            control={control}
            required={true}
            rules={{
              required: "Phone number is required",
              pattern: {
                value: MOBILE_REGEX,
                message:
                  "Please enter a valid phone number",
              },
            }}
            label="Phone Number"
            type="tel"
            placeholder="XXXXXXXXXX"
            disabled={shouldFieldsBeDisabled}
            prefix="+91"
          />

          {/* Email */}
          <InputField
            name="candidate_email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: EMAIL_REGEX,
                message:
                  "Please enter a valid email address",
              },
            }}
            label="Email ID"
            type="email"
            placeholder="abc@xyz.com"
            disabled={shouldFieldsBeDisabled}
            required={true}
          />

          {/* Company */}
          <InputField
            name="candidate_company"
            control={control}
            rules={{ required: "Company is required" }}
            label="Company"
            placeholder="Company"
            disabled={shouldFieldsBeDisabled}
            required={true}
          />

          {/* Offered */}
          <BooleanSelectField
            name="offered"
            control={control}
            label="Offered"
            disabled={shouldFieldsBeDisabled}
          />

          {/* Offer Date */}
          <DatePickerField
            name="offer_date"
            control={control}
            rules={{
              validate: (value) =>
                !isOffered || value
                  ? true
                  : "Offer date is required",
            }}
            label="Offer Date"
            disabled={shouldFieldsBeDisabled || !isOffered}
            required={isOffered}
          />

          {/* Offer Accepted */}
          <BooleanSelectField
            name="offer_accepted"
            control={control}
            label="Offer Accepted"
            disabled={shouldFieldsBeDisabled}
          />

          {/* Notice Period */}
          <SelectField
            name="notice_period"
            control={control}
            rules={{
              required: "Notice period is required",
            }}
            label="Notice Period"
            options={NOTICE_PERIOD}
            placeholder="Select Days"
            disabled={shouldFieldsBeDisabled}
            required={true}
          />
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200 my-8"></div>

        {/* GTP Information Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 w-full">
          {/* GTP Name */}
          <InputField
            name="client_user_name"
            control={control}
            rules={{ required: "GTP Name is required" }}
            label="GTP Name"
            placeholder="GTP Name"
            disabled={shouldFieldsBeDisabled}
            required={true}
          />

          {/* GTP Email */}
          <InputField
            name="client_user_email"
            control={control}
            rules={{
              required: "GTP Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message:
                  "Please enter a valid email address",
              },
            }}
            label="GTP Email ID"
            type="email"
            placeholder="abc@xyz.com"
            disabled={shouldFieldsBeDisabled}
            required={true}
          />
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200 my-8"></div>

        {/* Additional Information Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 w-full">
          {/* Other Offer */}
          <BooleanSelectField
            name="other_offer"
            control={control}
            label="Other Offer"
            disabled={shouldFieldsBeDisabled}
          />

          {/* Role Offer */}
               <InputField
            name="job"
            control={control}
            rules={{
              required: "Role Offer is required",
            }}
            label="Role Offer"
            type="text"
            placeholder="Role Offer"
            disabled={shouldFieldsBeDisabled}
            required={true}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-2">
          <CancelButton
            label={"Cancel"}
            onClick={handleCancel}
          />
          <SaveButton
            label={
              isAddingEngagement ? "Saving..." : "Save"
            }
            type="submit"
            disabled={
              (!resumeFile && !state) ||
              isAddingEngagement ||
              isPending
            }
            onClick={() => {}}
          />
        </div>
      </form>
    </div>
  );
};

EngagementForm.propTypes = {
  setSelectedEngagement: PropTypes.func.isRequired,
  engagement: PropTypes.object,
};

export default EngagementForm;
