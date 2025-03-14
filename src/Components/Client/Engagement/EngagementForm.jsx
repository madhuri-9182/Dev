/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { LogoutCurve, Trash } from "iconsax-react";
import { NOTICE_PERIOD } from "./constants";
import { useNavigate } from "react-router-dom";
import {
  useAddEngagement,
  useJobs,
  useResumeParser,
} from "./api";
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

const EngagementForm = ({
  setSelectedEngagement,
  engagement,
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { data: jobsData } = useJobs();
  const jobs = jobsData?.results || [];

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
      candidate_name: "",
      candidate_phone: "",
      candidate_email: "",
      candidate_company: "",
      notice_period: "",
      offer_accepted: false,
      offered: false,
      offer_date: null,
      client_user_email: "",
      other_offer: false,
      job_id: "",
      client_user_name: "",
    },
    mode: "onChange",
  });

  // Watch the offered value to conditionally validate offer_date
  const isOffered = watch("offered");

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
        "job_id",
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
    if (!resumeFile) {
      return;
    }

    // Determine which fields to validate based on offered status
    const fieldsToValidate = [
      "candidate_name",
      "candidate_email",
      "candidate_phone",
      "candidate_company",
      "notice_period",
      "job_id",
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
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                        disabled={isPending}
                        className="p-0"
                      >
                        <Trash size={20} color="red" />
                      </button>
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
            disabled={isPending || !resumeFile}
          />

          {/* Phone Number */}
          <InputField
            name="candidate_phone"
            control={control}
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
            disabled={isPending || !resumeFile}
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
            disabled={isPending || !resumeFile}
          />

          {/* Company */}
          <InputField
            name="candidate_company"
            control={control}
            rules={{ required: "Company is required" }}
            label="Company"
            placeholder="Company"
            disabled={isPending || !resumeFile}
          />

          {/* Offered */}
          <BooleanSelectField
            name="offered"
            control={control}
            label="Offered"
            disabled={isPending || !resumeFile}
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
            disabled={isPending || !resumeFile}
          />

          {/* Offer Accepted */}
          <BooleanSelectField
            name="offer_accepted"
            control={control}
            label="Offer Accepted"
            disabled={isPending || !resumeFile}
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
            disabled={isPending || !resumeFile}
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
            disabled={isPending || !resumeFile}
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
            disabled={isPending || !resumeFile}
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
            disabled={isPending || !resumeFile}
          />

          {/* Role Offer */}
          <SelectField
            name="job_id"
            control={control}
            rules={{ required: "Role is required" }}
            label="Role Offer"
            options={jobs.map((job) => ({
              value: job.id,
              label: job.name.split("_").join(" "),
            }))}
            placeholder="Select Role"
            disabled={isPending || !resumeFile}
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
            disabled={!resumeFile || isAddingEngagement}
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
