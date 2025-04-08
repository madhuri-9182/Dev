/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  CloseCircle,
  Edit,
  InfoCircle,
  LogoutCurve,
} from "iconsax-react";
import {
  fileToBase64,
  formatExperience,
} from "../../../../utils/util";
import {
  EMAIL_REGEX,
  GENDERS,
  MOBILE_REGEX,
} from "../../../Constants/constants";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/material/styles";

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
    slotProps={{
      popper: {
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, -10],
            },
          },
        ],
      },
    }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "#F59E0B",
    boxShadow: theme.shadows[1],
    fontSize: 11,
    maxWidth: 200,
    textAlign: "center",
  },
}));

export const ResumeTable = ({
  data,
  setData,
  editingRowId,
  setEditingRowId,
  selectedSource,
  selectedRole,
  selectedSpecialization,
  isDiversityHiring = false, // Add isDiversityHiring prop with default value
}) => (
  <div className="w-full mt-20 relative">
    {/* Fixed header */}
    <div className="sticky top-0 bg-white z-10 pb-3">
      <div className="grid grid-cols-8 text-[#6B6F7B] font-bold text-2xs text-left">
        <div className="px-3 col-span-1">Name</div>
        <div
          className={`px-3 col-span-1 flex items-center ${
            !editingRowId ? "text-[#F59E0B]" : ""
          }`}
        >
          Experience
          <LightTooltip
            title={"Please review the experience values"}
            placement="top"
          >
            {!editingRowId && (
              <InfoCircle
                size={16}
                color="#F59E0B"
                className="ml-1 cursor-help"
              />
            )}
          </LightTooltip>
        </div>
        <div className="px-3 col-span-1">Mobile Number</div>
        <div className="px-3 col-span-1">Email ID</div>
        <div className="px-3 col-span-1">Company</div>
        <div className="px-3 col-span-1">Designation</div>
        {/* Only show Gender column if diversity hiring is enabled */}
        {isDiversityHiring && (
          <div className="px-3 col-span-1">Gender</div>
        )}
        {/* Adjust column width based on whether gender is shown */}
        <div
          className={`px-3 ${
            isDiversityHiring ? "col-span-1" : "col-span-2"
          }`}
        ></div>
      </div>
      <hr className="w-full bg-[#F4F4F4] h-[1px] my-3" />
    </div>

    {/* Scrollable body */}
    <div className="overflow-y-auto max-h-[38vh]">
      {data.map((item) => (
        <ResumeTableRow
          key={item.id}
          item={item}
          data={data}
          setData={setData}
          editingRowId={editingRowId}
          setEditingRowId={setEditingRowId}
          selectedSource={selectedSource}
          selectedRole={selectedRole}
          selectedSpecialization={selectedSpecialization}
          isDiversityHiring={isDiversityHiring} // Pass isDiversityHiring to row
        />
      ))}
    </div>
  </div>
);

ResumeTable.propTypes = {
  data: PropTypes.array,
  setData: PropTypes.func,
  editingRowId: PropTypes.string,
  setEditingRowId: PropTypes.func,
  selectedSource: PropTypes.string,
  selectedRole: PropTypes.number,
  selectedSpecialization: PropTypes.string,
  isDiversityHiring: PropTypes.bool, // Add prop type for isDiversityHiring
};

// Table row component
const ResumeTableRow = ({
  item,
  data,
  setData,
  editingRowId,
  setEditingRowId,
  selectedSource,
  selectedRole,
  selectedSpecialization,
  isDiversityHiring,
}) => {
  const navigate = useNavigate();

  // Initialize React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: item.name,
      years_of_experience: {
        year: item.years_of_experience.year,
        month: item.years_of_experience.month,
      },
      phone_number: item.phone_number.startsWith("+91")
        ? item.phone_number.slice(3)
        : item.phone_number,
      email: item.email,
      current_company: item.current_company,
      current_designation: item.current_designation,
      gender: item.gender || "",
    },
  });

  // Use state to store validation messages to prevent jitter
  const [validationMessages, setValidationMessages] =
    useState({});

  // Reset form when item changes or diversity hiring status changes
  useEffect(() => {
    reset({
      name: item.name,
      years_of_experience: {
        year: item.years_of_experience.year,
        month: item.years_of_experience.month,
      },
      phone_number: item.phone_number.startsWith("+91")
        ? item.phone_number.slice(3)
        : item.phone_number,
      email: item.email,
      current_company: item.current_company,
      current_designation: item.current_designation,
      gender: item.gender || "",
    });
    // Validate after reset
    setTimeout(() => validateFields(true), 0);
  }, [item.id, reset, isDiversityHiring]); // Add isDiversityHiring dependency

  // Custom validation function similar to the original code
  const validateFields = (forceUpdate = false) => {
    const values = getValues();
    const newValidationMessages = {};

    if (!values.name) {
      newValidationMessages.name =
        "Name is required. Please fill manually to submit";
    }

    if (!values.email) {
      newValidationMessages.email =
        "Email is required. Please fill manually to submit";
    } else if (!EMAIL_REGEX.test(values.email)) {
      newValidationMessages.email =
        "Invalid email address.";
    }

    if (!values.phone_number) {
      newValidationMessages.phone_number =
        "Mobile number is required. Please fill manually to submit";
    } else if (!MOBILE_REGEX.test(values.phone_number)) {
      newValidationMessages.phone_number =
        "Invalid mobile number.";
    }

    if (!values.current_company) {
      newValidationMessages.current_company =
        "Company is required. Please fill manually to submit";
    }

    if (!values.current_designation) {
      newValidationMessages.current_designation =
        "Designation is required. Please fill manually to submit";
    }

    // Only validate gender if diversity hiring is enabled
    if (isDiversityHiring && !values.gender) {
      newValidationMessages.gender =
        "Gender is required. Please fill manually to submit";
    }

    if (
      values.years_of_experience.year == 0 &&
      values.years_of_experience.month == 0
    ) {
      newValidationMessages.years_of_experience =
        "Experience is required. Please fill manually to submit";
    }

    // Only update validation messages if they've changed or force update is true
    // This prevents jitter by avoiding unnecessary re-renders
    if (
      forceUpdate ||
      JSON.stringify(newValidationMessages) !==
        JSON.stringify(validationMessages)
    ) {
      setValidationMessages(newValidationMessages);

      // Set errors for react-hook-form (for form validation)
      Object.keys(newValidationMessages).forEach((key) => {
        setError(key, {
          message: newValidationMessages[key],
        });
      });

      // Clear errors that are no longer present
      Object.keys(errors).forEach((key) => {
        if (!newValidationMessages[key]) {
          clearErrors(key);
        }
      });
    }

    // Return true if there are no errors
    return Object.keys(newValidationMessages).length === 0;
  };

  // Handler for field changes
  const handleChange = (e, field) => {
    // Clear the error for this field
    clearErrors(field);

    // Validate after change
    setTimeout(() => validateFields(), 0);
  };

  const saveEdit = handleSubmit((formData) => {
    if (!validateFields()) return;

    const updatedData = data.map((row) =>
      row.id === item.id
        ? {
            ...row,
            name: formData.name,
            years_of_experience:
              formData.years_of_experience,
            phone_number: `+91${formData.phone_number}`,
            email: formData.email,
            current_company: formData.current_company,
            current_designation:
              formData.current_designation,
            // Only update gender if diversity hiring is enabled
            gender: isDiversityHiring
              ? formData.gender
              : row.gender,
          }
        : row
    );
    setData(updatedData);
    setEditingRowId(null);
  });

  const handleFormSubmit = handleSubmit(
    async (formData) => {
      if (!validateFields()) return;

      const selectedIData = data.find(
        (row) => row.id === item.id
      );
      let fileBase64 = null;
      if (selectedIData.file) {
        fileBase64 = await fileToBase64(selectedIData.file);
      }

      const encodedData = {
        ...selectedIData,
        name: formData.name,
        years_of_experience: formData.years_of_experience,
        phone_number: `+91${formData.phone_number}`,
        email: formData.email,
        current_company: formData.current_company,
        current_designation: formData.current_designation,
        source: selectedSource,
        role: selectedRole,
        specialization: selectedSpecialization,
        fileBase64,
      };
      if (isDiversityHiring) {
        encodedData.gender = formData.gender;
      }
      delete encodedData.id;
      delete encodedData.file;

      const uniqueKey = `candidateData-${selectedIData.id}`;

      // Clear only candidateData entries before setting new one
      Object.keys(localStorage).forEach((key) => {
        if (key.includes("candidateData-")) {
          localStorage.removeItem(key);
        }
      });

      // Store the encoded data in localStorage
      localStorage.setItem(
        uniqueKey,
        JSON.stringify(encodedData)
      );
      const url = `/client/candidates/schedule-interview?key=${uniqueKey}`;

      // if data length is more than 1 then open in new tab, else open in same tab
      if (data.length > 1) {
        const newTab = window.open(url, "_blank");

        // Check if the new tab was successfully opened
        if (newTab) {
          // Remove the candidate from the data after a slight delay
          // to ensure the data is available in the new tab
          setTimeout(() => {
            window.removeCandidateFromData(uniqueKey);
          }, 500);
        }
      } else {
        navigate(url);
      }
    }
  );

  const tableDataValues = (key) => {
    return item[key] || "-";
  };

  window.removeCandidateFromData = (key) => {
    const updatedKey = key.split("candidateData-")[1];
    const updatedData = data.filter((row) => {
      return row.id !== updatedKey;
    });

    // Reset editing state if we're editing the removed candidate
    if (editingRowId === updatedKey) {
      setEditingRowId(null);
    }

    setData(updatedData);
  };

  // Check if there are any errors to disable buttons
  const hasErrors =
    Object.keys(validationMessages).length > 0;

  return (
    <div className="mb-3">
      {/* Main row with grid layout */}
      <div className="grid grid-cols-8 text-2xs text-left items-center text-[#313A4E]">
        {editingRowId === item.id ? (
          <>
            <div className="px-3 col-span-1">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Name"
                    className="w-full"
                    onChange={(e) => {
                      field.onChange(e);
                      handleChange(e, "name");
                    }}
                  />
                )}
              />
            </div>
            <div className="px-3 col-span-1">
              <div className="flex items-center space-x-1">
                <Controller
                  name="years_of_experience.year"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="Yrs"
                      className="w-1/2"
                      onChange={(e) => {
                        field.onChange(e);
                        handleChange(
                          e,
                          "years_of_experience"
                        );
                      }}
                    />
                  )}
                />
                <Controller
                  name="years_of_experience.month"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="Mos"
                      className="w-1/2"
                      max={11}
                      onChange={(e) => {
                        field.onChange(e);
                        handleChange(
                          e,
                          "years_of_experience"
                        );
                      }}
                    />
                  )}
                />
              </div>
            </div>
            <div className="px-3 col-span-1">
              <Controller
                name="phone_number"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="Mobile Number"
                    className="w-full"
                    maxLength={10}
                    onChange={(e) => {
                      field.onChange(e);
                      handleChange(e, "phone_number");
                    }}
                  />
                )}
              />
            </div>
            <div className="px-3 col-span-1">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="Email ID"
                    className="w-full"
                    onChange={(e) => {
                      field.onChange(e);
                      handleChange(e, "email");
                    }}
                  />
                )}
              />
            </div>
            <div className="px-3 col-span-1">
              <Controller
                name="current_company"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Company"
                    className="w-full"
                    onChange={(e) => {
                      field.onChange(e);
                      handleChange(e, "current_company");
                    }}
                  />
                )}
              />
            </div>
            <div className="px-3 col-span-1">
              <Controller
                name="current_designation"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Designation"
                    className="w-full"
                    onChange={(e) => {
                      field.onChange(e);
                      handleChange(
                        e,
                        "current_designation"
                      );
                    }}
                  />
                )}
              />
            </div>
            {/* Only show gender field if diversity hiring is enabled */}
            {isDiversityHiring && (
              <div className="px-3 col-span-1">
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="custom-select w-full px-2 py-1 border text-2xs font-medium bg-white text-[#6B6F7B] rounded"
                      onChange={(e) => {
                        field.onChange(e);
                        handleChange(e, "gender");
                      }}
                    >
                      <option value="">Select</option>
                      {GENDERS.map((gender, idx) => (
                        <option key={idx} value={gender.id}>
                          {gender.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
            )}
            {/* Adjust column width if gender is not shown */}
            <div
              className={`pl-3 flex items-center gap-2 ${
                isDiversityHiring
                  ? "col-span-1"
                  : "col-span-2"
              }`}
            >
              <CloseCircle
                size="18"
                color="#555555"
                variant="Outline"
                className="cursor-pointer"
                onClick={() => {
                  reset({
                    name: item.name,
                    years_of_experience: {
                      year: item.years_of_experience.year,
                      month: item.years_of_experience.month,
                    },
                    phone_number:
                      item.phone_number.startsWith("+91")
                        ? item.phone_number.slice(3)
                        : item.phone_number,
                    email: item.email,
                    current_company: item.current_company,
                    current_designation:
                      item.current_designation,
                    gender: item.gender || "",
                  });
                  setEditingRowId(null);
                  // Force update validation after canceling edit
                  setTimeout(() => validateFields(true), 0);
                }}
              />
              <button
                onClick={saveEdit}
                disabled={hasErrors}
                className={`px-3 py-1 rounded-full text-xs font-medium text-white  
                  ${
                    !hasErrors
                      ? "bg-[#007AFF] hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] cursor-pointer"
                      : "bg-[#CAC4D0] cursor-not-allowed"
                  }
                  transition-all duration-300 ease-in-out
                   flex items-center`}
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              className="px-3 col-span-1 truncate"
              title={tableDataValues("name")}
            >
              {tableDataValues("name")}
            </div>
            <div className="px-3 col-span-1">
              {formatExperience(item.years_of_experience)}
            </div>
            <div
              className="px-3 col-span-1 truncate"
              title={tableDataValues("phone_number")}
            >
              {tableDataValues("phone_number")}
            </div>
            <div
              className="px-3 col-span-1 truncate"
              title={tableDataValues("email")}
            >
              {tableDataValues("email")}
            </div>
            <div
              className="px-3 col-span-1 truncate"
              title={tableDataValues("current_company")}
            >
              {tableDataValues("current_company")}
            </div>
            <div
              className="px-3 col-span-1 truncate"
              title={tableDataValues("current_designation")}
            >
              {tableDataValues("current_designation")}
            </div>
            {/* Only show gender column if diversity hiring is enabled */}
            {isDiversityHiring && (
              <div className="px-3 col-span-1">
                {item.gender
                  ? GENDERS.find(
                      (gender) => gender.id === item.gender
                    )?.name
                  : "Not specified"}
              </div>
            )}
            {/* Adjust column width if gender is not shown */}
            <div
              className={`pl-3 flex items-center gap-2 ${
                isDiversityHiring
                  ? "col-span-1"
                  : "col-span-2"
              }`}
            >
              <Edit
                size={18}
                color="#595BD4"
                variant="Outline"
                className="cursor-pointer min-w-4 min-h-4"
                onClick={() => setEditingRowId(item.id)}
              />
              <button
                className={`px-3 py-1 rounded-full text-xs font-medium text-white  
                      ${
                        !hasErrors
                          ? "bg-[#007AFF] hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] cursor-pointer"
                          : "bg-[#CAC4D0] cursor-not-allowed"
                      }
                      transition-all duration-300 ease-in-out
                       flex items-center`}
                onClick={handleFormSubmit}
                disabled={hasErrors}
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>

      {/* Validation messages */}
      {Object.keys(validationMessages).length > 0 && (
        <div className="px-3 mt-1">
          {Object.keys(validationMessages).map(
            (key, idx) => (
              <p
                key={idx}
                className="text-[#F00000] text-[10px] mt-[2px]"
              >
                {validationMessages[key]}
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
};

ResumeTableRow.propTypes = {
  item: PropTypes.object,
  data: PropTypes.array,
  setData: PropTypes.func,
  editingRowId: PropTypes.string,
  setEditingRowId: PropTypes.func,
  selectedSource: PropTypes.string,
  selectedRole: PropTypes.number,
  selectedSpecialization: PropTypes.string,
  isDiversityHiring: PropTypes.bool, // Add prop type for isDiversityHiring
};

const Input = ({
  value,
  onChange,
  placeholder,
  type,
  className,
  max,
  maxLength,
  onBlur,
  name,
}) => {
  return (
    <input
      name={name}
      type={type}
      max={max}
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`border rounded px-1 py-1 ${className}`}
    />
  );
};

Input.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  max: PropTypes.number,
  maxLength: PropTypes.number,
  name: PropTypes.string,
};

// Upload button component
export const UploadButton = ({
  label,
  onClick,
  disabled,
}) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className="w-1/2 h-[184px] flex items-center justify-center border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-all disabled:cursor-not-allowed disabled:text-gray-400 disabled:bg-gray-50"
  >
    <p className="flex flex-col gap-3 items-center">
      <LogoutCurve
        className="rotate-90"
        color="#171717"
        size={24}
      />
      <span className="text-sm font-medium text-[#6B6F7B]">
        {label}
      </span>
    </p>
  </button>
);

UploadButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};
