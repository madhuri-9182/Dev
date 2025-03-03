import PropTypes from "prop-types";
import { AnimatePresence } from "framer-motion";
import Modal from "../../shared/Modal";
import { useEffect, useState, useMemo } from "react";
import {
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import {
  EMAIL_REGEX,
  MOBILE_REGEX,
} from "../../Constants/constants";
import toast from "react-hot-toast";
import { updateUser, createUser } from "./api";
import useAllJobs from "../../../hooks/useFetchAllJobs";
import { getJobLabel } from "../../../utils/util";
import {
  Input,
  FormField,
  CustomSelect,
} from "./AddUserFormComponents";

// Main component
const AddUserModal = ({
  isOpen,
  onClose,
  title,
  selectedUser,
}) => {
  const isEdit = title === "Edit User";
  const queryClient = useQueryClient();
  const { data: jobs = [] } = useAllJobs();

  // Initialize form state
  const initialFormState = {
    name: "",
    email: "",
    role: "",
    jobs_assigned: [],
    accessibility: "AJ",
    phone: "",
  };

  const [formData, setFormData] = useState(
    initialFormState
  );
  const [originalData, setOriginalData] = useState(null); // For tracking changes
  const [inputErrors, setInputErrors] = useState({});
  const [fieldsValidated, setFieldsValidated] = useState({
    email: false,
    phone: false,
  });

  // Dropdown states
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] =
    useState(false);
  const [
    isAccessibilityDropdownOpen,
    setIsAccessibilityDropdownOpen,
  ] = useState(false);
  const [isJobDropdownOpen, setIsJobDropdownOpen] =
    useState(false);

  // Reset form when modal closes or opens with different user
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (selectedUser) {
      const userData = {
        name: selectedUser.name || "",
        email: selectedUser.user?.email || "",
        role: selectedUser.user?.role || "",
        jobs_assigned:
          selectedUser.assigned_jobs?.map(
            (job) => job.id
          ) || [],
        accessibility: selectedUser.accessibility || "AJ",
        phone: selectedUser.user?.phone
          ? selectedUser.user.phone.replace("+91", "")
          : "",
      };

      setFormData(userData);
      setOriginalData(userData); // Save original data for comparison
    } else {
      setFormData(initialFormState);
      setOriginalData(null);
    }

    setInputErrors({});
    setFieldsValidated({ email: false, phone: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedUser]);

  // Mutation for creating/updating user
  const mutation = useMutation({
    mutationFn: isEdit ? updateUser : createUser,
    onSuccess: () => {
      toast.success(
        isEdit
          ? "User updated successfully"
          : "User created successfully",
        { position: "top-right" }
      );
      onClose();
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      console.error("API Error:", error);

      if (error.response?.data?.errors) {
        const allErrorMessages = Object.values(
          error.response.data.errors
        ).flat();

        allErrorMessages.forEach((errorMessage, index) => {
          setTimeout(() => {
            toast.error(errorMessage, {
              position: "top-right",
            });
          }, index * 100);
        });
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to process user data",
          { position: "top-right" }
        );
      }
    },
  });

  // Helper functions for form handling
  const validateField = (field, value, regex) => {
    if (
      fieldsValidated[field] &&
      value.length > 0 &&
      !regex.test(value)
    ) {
      setInputErrors((prev) => ({
        ...prev,
        [field]: `Invalid ${field}`,
      }));
      return false;
    } else {
      setInputErrors((prev) => ({ ...prev, [field]: "" }));
      return true;
    }
  };

  const handleChange = (field, value, regex = null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (regex) {
      validateField(field, value, regex);
    }
  };

  const handleRemoveJob = (jobId) => {
    setFormData((prev) => ({
      ...prev,
      jobs_assigned: prev.jobs_assigned.filter(
        (id) => id !== jobId
      ),
    }));
  };

  // Function to get only changed fields
  const getChangedFields = () => {
    if (!isEdit || !originalData) return formData;

    const changedFields = {};

    // Compare each field and only include changed ones
    Object.keys(formData).forEach((key) => {
      if (key === "jobs_assigned") {
        // Handle arrays separately - check if they're different
        if (
          JSON.stringify(formData[key]) !==
          JSON.stringify(originalData[key])
        ) {
          changedFields[key] = formData[key];
        }
      } else if (formData[key] !== originalData[key]) {
        changedFields[key] = formData[key];
      }
    });

    return changedFields;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    let errors = {};
    let isValid = true;

    if (!EMAIL_REGEX.test(formData.email)) {
      errors.email = "Invalid email address";
      isValid = false;
    }

    if (!MOBILE_REGEX.test(formData.phone)) {
      errors.phone = "Invalid mobile number";
      isValid = false;
    }

    setInputErrors(errors);
    setFieldsValidated({ email: true, phone: true });

    if (!isValid) return;

    // Get only changed fields if editing
    const changedFields = isEdit
      ? getChangedFields()
      : formData;

    // If nothing has changed in edit mode, just close the modal and return
    if (isEdit && Object.keys(changedFields).length === 0) {
      toast.success("No changes to save", {
        position: "top-right",
      });
      onClose();
      return;
    }

    // Process and submit data
    const processedData = {
      ...changedFields,
      // Only include phone if it was changed or we're creating a new user
      ...(changedFields.phone && {
        phone: changedFields.phone.startsWith("+91")
          ? changedFields.phone
          : `+91${changedFields.phone}`,
      }),
    };

    if (isEdit) {
      mutation.mutate({
        userData: processedData,
        id: selectedUser.id,
      });
    } else {
      mutation.mutate(processedData);
    }
  };

  // Memoize options to prevent unnecessary rerenders
  const roleOptions = useMemo(
    () => [
      { id: "client_admin", name: "Admin" },
      { id: "client_user", name: "User" },
      { id: "agency", name: "Agency" },
    ],
    []
  );

  const accessibilityOptions = useMemo(
    () => [
      { id: "AGJ", name: "Assigned Jobs" },
      { id: "AJ", name: "All Jobs" },
    ],
    []
  );

  const jobOptions = useMemo(
    () =>
      jobs.map((job) => ({
        id: job.id,
        name: getJobLabel(job.name),
      })),
    [jobs]
  );

  // Find selected jobs for display
  const selectedJobs = useMemo(
    () =>
      formData.jobs_assigned
        .map((jobId) => {
          const job = jobs.find((j) => j.id === jobId);
          return job
            ? { id: jobId, name: getJobLabel(job.name) }
            : null;
        })
        .filter(Boolean),
    [formData.jobs_assigned, jobs]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          title={title}
        >
          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              <FormField label="Full Name (First Name + Last Name)">
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    handleChange("name", e.target.value)
                  }
                  placeholder="Enter Full Name"
                  required
                />
              </FormField>

              <FormField
                label="Email ID"
                error={inputErrors.email}
              >
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    handleChange(
                      "email",
                      e.target.value,
                      EMAIL_REGEX
                    )
                  }
                  placeholder="Enter Email ID"
                  required
                />
              </FormField>

              <FormField
                label="Mobile Number"
                error={inputErrors.phone}
              >
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    handleChange(
                      "phone",
                      e.target.value,
                      MOBILE_REGEX
                    )
                  }
                  placeholder="Enter Mobile Number"
                  maxLength={10}
                  required
                />
              </FormField>

              <FormField label="User Type">
                <CustomSelect
                  type="role"
                  placeholder="Select User Type"
                  value={formData.role}
                  onChange={(e) =>
                    handleChange("role", e.target.value)
                  }
                  options={roleOptions}
                  errors={inputErrors}
                  isDropdownOpen={isRoleDropdownOpen}
                  setIsDropdownOpen={setIsRoleDropdownOpen}
                  required
                />
              </FormField>

              <FormField label="Accessibility">
                <CustomSelect
                  type="accessibility"
                  placeholder="Select Accessibility"
                  value={formData.accessibility}
                  onChange={(e) =>
                    handleChange(
                      "accessibility",
                      e.target.value
                    )
                  }
                  options={accessibilityOptions}
                  errors={inputErrors}
                  isDropdownOpen={
                    isAccessibilityDropdownOpen
                  }
                  setIsDropdownOpen={
                    setIsAccessibilityDropdownOpen
                  }
                  required
                />
              </FormField>

              <FormField label="Jobs Assigned">
                <CustomSelect
                  type="jobs_assigned"
                  placeholder="Select Jobs"
                  value=""
                  onChange={(e) => {
                    const jobId = Number(e.target.value);
                    if (
                      !formData.jobs_assigned.includes(
                        jobId
                      )
                    ) {
                      handleChange("jobs_assigned", [
                        ...formData.jobs_assigned,
                        jobId,
                      ]);
                    }
                  }}
                  options={jobOptions}
                  errors={inputErrors}
                  isDropdownOpen={isJobDropdownOpen}
                  setIsDropdownOpen={setIsJobDropdownOpen}
                  required={false}
                />
              </FormField>
            </div>

            {selectedJobs.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {selectedJobs.map(({ id, name }) => (
                    <span
                      key={id}
                      className="flex items-center pl-3 pr-2 py-[6px] bg-white rounded-lg text-2xs border border-[#CAC4D0] text-[#49454F] font-medium"
                    >
                      {name}
                      <button
                        type="button"
                        onClick={() => handleRemoveJob(id)}
                        className="ml-2 text-[#49454F] font-medium"
                      >
                        &#10005;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end items-center gap-2 mt-4">
              <button
                type="button"
                className="px-6 py-[5px] rounded-[100px] text-[#65558F] border border-[#79747E] text-xs font-semibold cursor-pointer 
                transition-all duration-300 ease-in-out 
                hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6]"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-6 py-[5px] rounded-[100px] text-white border border-[#007AFF] bg-[#007AFF] transition-all duration-300 ease-in-out
                hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] text-xs font-semibold cursor-pointer"
                type="submit"
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AnimatePresence>
  );
};

AddUserModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  selectedUser: PropTypes.object,
};

export default AddUserModal;
