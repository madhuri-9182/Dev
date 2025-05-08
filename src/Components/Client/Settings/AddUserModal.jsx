import PropTypes from "prop-types";
import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo } from "react";
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
import {
  getJobLabel,
  getSpecialization,
} from "../../../utils/util";
import {
  Input,
  FormField,
  CustomSelect,
} from "./AddUserFormComponents";
import Modal from "../../shared/Modal";
import { useForm, Controller } from "react-hook-form";
import {
  CancelButton,
  SaveButton,
} from "../../shared/SaveAndCancelButtons";

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

  // Setup React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      role: "",
      jobs_assigned: [],
      accessibility: "",
      phone: "",
    },
  });

  // Watch accessibility to conditionally validate job selection
  const accessibility = watch("accessibility");
  const jobs_assigned = watch("jobs_assigned");

  // Mutation for creating/updating user
  const mutation = useMutation({
    mutationFn: isEdit ? updateUser : createUser,
    onSuccess: () => {
      toast.success(
        isEdit
          ? "User updated successfully"
          : "User created successfully"
      );
      onClose();
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      if (error.response?.data?.errors) {
        // Check if errors is a string or an object
        if (
          typeof error.response.data.errors === "string"
        ) {
          // If it's a string, show that directly
          toast.error(error.response.data.errors);
        } else {
          // If it's an object, use the existing logic
          const allErrorMessages = Object.values(
            error.response.data.errors
          ).flat();

          allErrorMessages.forEach(
            (errorMessage, index) => {
              setTimeout(() => {
                toast.error(errorMessage);
              }, index * 100);
            }
          );
        }
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to process user data"
        );
      }
    },
  });

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
        accessibility: selectedUser.accessibility || "",
        phone: selectedUser.user?.phone
          ? selectedUser.user.phone.replace("+91", "")
          : "",
      };

      // Reset form with user data
      reset(userData);
    } else {
      // Reset to initial state for new user
      reset({
        name: "",
        email: "",
        role: "",
        jobs_assigned: [],
        accessibility: "",
        phone: "",
      });
    }
  }, [isOpen, selectedUser, reset]);

  useEffect(() => {
    if (accessibility === "AJ") {
      setValue("jobs_assigned", [], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [accessibility, setValue]);

  // Function to get only changed fields for edit mode
  const getChangedFields = (formData) => {
    if (!isEdit || !selectedUser) return formData;

    const originalData = {
      name: selectedUser.name || "",
      email: selectedUser.user?.email || "",
      role: selectedUser.user?.role || "",
      jobs_assigned:
        selectedUser.assigned_jobs?.map((job) => job.id) ||
        [],
      accessibility: selectedUser.accessibility || "",
      phone: selectedUser.user?.phone
        ? selectedUser.user.phone.replace("+91", "")
        : "",
    };

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

  // Form submission handler
  const onSubmit = (formData) => {
    // Get only changed fields if editing
    const changedFields = isEdit
      ? getChangedFields(formData)
      : formData;

    // If nothing has changed in edit mode, just close the modal and return
    if (isEdit && Object.keys(changedFields).length === 0) {
      toast.success("No changes to save");
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

  const handleRemoveJob = (jobId) => {
    const updatedJobs = jobs_assigned.filter(
      (id) => id !== jobId
    );
    setValue("jobs_assigned", updatedJobs, {
      shouldValidate: true,
      shouldDirty: true,
    });
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
        specialization: getSpecialization(
          job.specialization
        ),
      })),
    [jobs]
  );

  // Find selected jobs for display
  const selectedJobs = useMemo(
    () =>
      jobs_assigned
        .map((jobId) => {
          const job = jobs.find((j) => j.id === jobId);
          return job
            ? {
                id: jobId,
                name: getJobLabel(job.name),
                specialiation: getSpecialization(
                  job.specialization
                ),
              }
            : null;
        })
        .filter(Boolean),
    [jobs_assigned, jobs]
  );

  // Check if jobs are available
  const hasAvailableJobs = jobs.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          title={title}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-3">
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "Full name is required",
                }}
                render={({ field }) => (
                  <FormField
                    label="Full Name (First Name + Last Name)"
                    error={errors.name?.message}
                    required={true}
                  >
                    <Input
                      type="text"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value)
                      }
                      placeholder="Enter Full Name"
                      error={errors.name?.message}
                    />
                  </FormField>
                )}
              />

              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: EMAIL_REGEX,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <FormField
                    label="Email ID"
                    error={errors.email?.message}
                    required={true}
                  >
                    <Input
                      type="text"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value)
                      }
                      placeholder="Enter Email ID"
                      error={errors.email?.message}
                    />
                  </FormField>
                )}
              />

              <Controller
                name="phone"
                control={control}
                rules={{
                  required: "Mobile number is required",
                  pattern: {
                    value: MOBILE_REGEX,
                    message: "Invalid mobile number",
                  },
                }}
                render={({ field }) => (
                  <FormField
                    label="Mobile Number"
                    error={errors.phone?.message}
                    required={true}
                  >
                    <Input
                      type="tel"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value)
                      }
                      placeholder="Enter Mobile Number"
                      maxLength={10}
                      error={errors.phone?.message}
                    />
                  </FormField>
                )}
              />

              {selectedUser?.user?.role ===
              "client_owner" ? (
                <FormField
                  label="User Type"
                  required={true}
                >
                  <div className="w-full rounded-lg text-2xs py-2 px-3 border text-left custom-select border-[#cac4d0] opacity-50 cursor-not-allowed">
                    Owner
                  </div>
                </FormField>
              ) : (
                <Controller
                  name="role"
                  control={control}
                  rules={{
                    required: "User type is required",
                  }}
                  render={({ field }) => (
                    <FormField
                      label="User Type"
                      error={errors.role?.message}
                      required={true}
                    >
                      <CustomSelect
                        type="role"
                        placeholder="Select User Type"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(e.target.value)
                        }
                        options={roleOptions}
                        errors={errors}
                      />
                    </FormField>
                  )}
                />
              )}

              <Controller
                name="accessibility"
                control={control}
                rules={{
                  required: "Accessibility is required",
                }}
                render={({ field }) => (
                  <FormField
                    label="Accessibility"
                    error={errors.accessibility?.message}
                    required={true}
                  >
                    <CustomSelect
                      type="accessibility"
                      placeholder="Select Accessibility"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value)
                      }
                      options={accessibilityOptions}
                      errors={errors}
                    />
                  </FormField>
                )}
              />

              {accessibility === "AGJ" &&
                hasAvailableJobs && (
                  <Controller
                    name="jobs_assigned"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        label="Jobs Assigned"
                        error={
                          errors.jobs_assigned?.message
                        }
                        required={false} // Required when jobs are available
                      >
                        <CustomSelect
                          type="jobs_assigned"
                          placeholder="Select Jobs"
                          value=""
                          onChange={(e) => {
                            const jobId = Number(
                              e.target.value
                            );
                            if (
                              !field.value.includes(jobId)
                            ) {
                              const updatedJobs = [
                                ...field.value,
                                jobId,
                              ];
                              field.onChange(updatedJobs);
                            }
                          }}
                          options={jobOptions}
                          errors={errors}
                        />
                      </FormField>
                    )}
                  />
                )}
            </div>

            {selectedJobs.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {selectedJobs.map(
                    ({ id, name, specialiation }) => (
                      <span
                        key={id}
                        className="flex items-center pl-3 pr-2 py-[6px] bg-white rounded-lg text-2xs border border-[#CAC4D0] text-[#49454F] font-medium"
                      >
                        {name} ({specialiation})
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveJob(id)
                          }
                          className="ml-2 text-[#49454F] font-medium"
                        >
                          &#10005;
                        </button>
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end items-center gap-2 mt-5">
              <CancelButton
                onClick={onClose}
                label="Cancel"
              />
              <SaveButton
                disabled={mutation.isPending}
                label={
                  mutation.isPending ? "Saving..." : "Save"
                }
                type="submit"
                onClick={() => {}}
              />
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
