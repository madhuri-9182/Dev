import PropTypes from "prop-types";
import { AnimatePresence } from "framer-motion";
import Modal from "../../shared/Modal";
import { useEffect, useState } from "react";
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

const AddUserModal = ({
  isOpen,
  onClose,
  title,
  selectedUser,
}) => {
  const isEdit = title === "Edit User";
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    jobs_assigned: [],
    accessibility: "",
    phone: "",
  });
  const [inputError, setInputError] = useState({});
  const [showEmailError, setShowEmailError] =
    useState(false);
  const [showPhoneError, setShowPhoneError] =
    useState(false);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name,
        email: selectedUser.user.email,
        role: selectedUser.user.role,
        jobs_assigned: selectedUser.assigned_jobs
          ? selectedUser.assigned_jobs.map((job) => job.id)
          : [],
        accessibility: selectedUser.accessibility
          ? selectedUser.accessibility
          : "AJ",
        phone: selectedUser.user.phone
          ? selectedUser.user.phone.split("+91")[1]
          : "",
      });
    }
  }, [selectedUser]);

  const { data: jobs } = useAllJobs();

  const mutation = useMutation({
    mutationFn: isEdit ? updateUser : createUser,
    onSuccess: () => {
      toast.success(
        isEdit
          ? "User updated successfully"
          : "User created successfully",
        {
          position: "top-right",
        }
      );
      handleModalClose();
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      console.log(error);
      toast.error(
        error.response.data.message
          ? error.response?.data?.message
          : "Failed to create user",
        {
          position: "top-right",
        }
      );
    },
  });

  const handleRemoveJob = (job) => {
    setFormData((prev) => ({
      ...prev,
      jobs_assigned: prev.jobs_assigned?.filter(
        (j) => j !== job
      ),
    }));
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    if (showEmailError) {
      if (
        !EMAIL_REGEX.test(emailValue) &&
        emailValue.length > 0
      ) {
        setInputError({
          ...inputError,
          email: "Invalid email address",
        });
      } else {
        setInputError({ ...inputError, email: "" });
      }
    } else {
      setInputError({ ...inputError, email: "" });
    }
    setFormData({
      ...formData,
      email: e.target.value,
    });
  };

  const handlePhoneChange = (e) => {
    const phoneValue = e.target.value;
    if (showPhoneError) {
      if (
        !MOBILE_REGEX.test(phoneValue) &&
        phoneValue.length > 0
      ) {
        setInputError({
          ...inputError,
          phone: "Invalid mobile number",
        });
      } else {
        setInputError({ ...inputError, phone: "" });
      }
    } else {
      setInputError({ ...inputError, phone: "" });
    }
    setFormData({ ...formData, phone: phoneValue });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let errors = {};
    if (!EMAIL_REGEX.test(formData.email)) {
      errors.email = "Invalid email address";
      setShowEmailError(true);
    }
    if (!MOBILE_REGEX.test(formData.phone)) {
      errors.phone = "Invalid mobile number";
      setShowPhoneError(true);
    }
    if (Object.keys(errors).length > 0) {
      setInputError(errors);
      return;
    }

    const updatedFormData = {
      ...formData,
      phone: formData.phone.startsWith("+91")
        ? formData.phone
        : `+91${formData.phone}`,
    };
    isEdit
      ? mutation.mutate({
          userData: updatedFormData,
          id: selectedUser.id,
        })
      : mutation.mutate(updatedFormData);
  };

  const handleModalClose = () => {
    onClose();
    setFormData({
      name: "",
      email: "",
      role: "",
      jobs_assigned: [],
      accessibility: "",
      phone: "",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={handleModalClose}
          title={title}
        >
          <form onSubmit={onSubmit}>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label
                  name={"name"}
                  label={
                    "Full Name (First Name + Last Name)"
                  }
                />
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter Full Name"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label name={"email"} label={"Email ID"} />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                  placeholder="Enter Email ID"
                  required
                />

                <p
                  className={`text-[#B10E0EE5] text-xs ${
                    inputError?.email
                      ? "visible mt-2"
                      : "invisible"
                  }`}
                >
                  {inputError?.email}
                </p>
              </div>
              <div className="space-y-1">
                <Label
                  name={"phone"}
                  label={"Mobile Number"}
                />
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter Mobile Number"
                  required
                />
                <p
                  className={`text-[#B10E0EE5] text-xs ${
                    inputError?.phone
                      ? "visible mt-2"
                      : "invisible"
                  }`}
                >
                  {inputError?.phone}
                </p>
              </div>

              <div className="space-y-1">
                <Label name={"role"} label={"User Type"} />
                <CustomSelect
                  placeholder={"Select User Type"}
                  value={formData.role}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      role: e.target.value,
                    });
                  }}
                  options={[
                    { id: "client_admin", name: "Admin" },
                    { id: "client_user", name: "User" },
                    { id: "agency", name: "Agency" },
                  ]}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label
                  name={"accessibility"}
                  label={"Accessibility"}
                />
                <CustomSelect
                  placeholder={"Select Accessibility"}
                  value={formData.accessibility}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      accessibility: e.target.value,
                    });
                  }}
                  options={[
                    { id: "AGJ", name: "Assigned Jobs" },
                    { id: "AJ", name: "All Jobs" },
                  ]}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label
                  name={"jobs_assigned"}
                  label={"Jobs Assigned"}
                />
                <CustomSelect
                  placeholder={"Select Jobs"}
                  value={""}
                  onChange={(e) => {
                    if (
                      formData.jobs_assigned.includes(
                        Number(e.target.value)
                      )
                    )
                      return;
                    setFormData({
                      ...formData,
                      jobs_assigned: [
                        ...formData.jobs_assigned,
                        Number(e.target.value),
                      ],
                    });
                  }}
                  options={jobs.map((job) => ({
                    id: job.id,
                    name: getJobLabel(job.name),
                  }))}
                  required={false}
                />
              </div>
            </div>
            {formData.jobs_assigned.length > 0 && (
              <div className="mt-8">
                <div className="flex flex-wrap gap-2">
                  {formData.jobs_assigned.map((jobId) => {
                    const job = jobs?.find(
                      (j) => j.id == jobId
                    );
                    return (
                      <span
                        key={jobId}
                        className="flex items-center pl-3 pr-2 py-[6px] bg-white rounded-lg text-sm border border-[#CAC4D0] text-[#49454F] font-medium "
                      >
                        {getJobLabel(job.name)}{" "}
                        {/* Show job name or fallback */}
                        <button
                          onClick={() =>
                            handleRemoveJob(jobId)
                          }
                          className="ml-2 text-[#49454F] font-medium"
                        >
                          &#10005;
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end items-center gap-3 mt-8">
              <button
                type="button"
                className="px-6 py-[10px] rounded-[100px] text-[#65558F] border border-[#79747E] text-sm font-semibold cursor-pointer 
                transition-all duration-300 ease-in-out 
                hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6]"
                onClick={handleModalClose}
              >
                Delete
              </button>
              <button
                className="px-6 py-[10px] rounded-[100px] text-white bg-[#007AFF] transition-all duration-300 ease-in-out
             hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] text-sm font-semibold cursor-pointer"
                type="submit"
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default AddUserModal;

AddUserModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  selectedUser: PropTypes.object,
};

const Label = ({ name, label }) => {
  return (
    <label
      htmlFor={name}
      className="block text-[#6B6F7B] text-xs font-bold"
    >
      {label}
    </label>
  );
};

Label.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
};

const Input = ({
  type,
  value,
  onChange,
  placeholder,
  required,
}) => {
  return (
    <input
      maxLength={type === "tel" ? 10 : null}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full px-3 py-2 border rounded-lg text-[13px] text-[#6B6F7B] font-medium"
    />
  );
};

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder,
  required,
}) => {
  return (
    <select
      value={value || ""}
      onChange={onChange}
      className="custom-select w-full px-3 py-2 border rounded-lg text-[13px] font-medium bg-white text-[#6B6F7B]"
      required={required}
    >
      <option value="" disabled hidden>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

CustomSelect.propTypes = {
  options: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};
