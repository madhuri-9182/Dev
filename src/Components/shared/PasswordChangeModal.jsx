import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Input,
  Label,
  MatchedPassword,
  PasswordCriteriaList,
  SubmitButton,
  ViewHideEyeButton,
} from "../shared/auth-form-components";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import PropTypes from "prop-types";

const ChangePasswordModal = ({ onSuccess }) => {
  const { auth, setAuth } = useAuth();
  const [isNewPasswordVisible, setIsNewPasswordVisible] =
    useState(false);
  const [
    isConfirmPasswordVisible,
    setIsConfirmPasswordVisible,
  ] = useState(false);
  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  // Setup React Hook Form
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Watch password field for validation and password matching
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const isMatch =
    password &&
    confirmPassword &&
    password === confirmPassword;

  // Setup React Query mutation for changing password
  const changePasswordMutation = useMutation({
    mutationFn: async (passwordData) => {
      const response = await axios.post(
        "/api/change-password/",
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      // Update auth context with is_password_change = true
      setAuth({
        ...auth,
        is_password_change: true,
      });
      toast.success("Password changed successfully");
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      if (!error?.response) {
        toast.error("No Server Response");
      } else if (error.response?.status === 400) {
        toast.error(
          error.response.data.errors[0] ||
            "Invalid password"
        );
      } else {
        toast.error("Password change failed");
      }
    },
  });

  // Update password criteria whenever password changes
  const updatePasswordCriteria = (value) => {
    setCriteria({
      length: value.length >= 8 && value.length <= 20,
      uppercase: /[A-Z]/.test(value),
      number: /\d/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
  };

  // Toggle password visibility functions
  const toggleNewPassVisibility = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };

  const toggleConfirmPassVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  // Submit handler
  const onSubmit = (data) => {
    changePasswordMutation.mutate({
      password: data.password,
      confirm_password: data.confirmPassword,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-base font-bold mb-2">
          Change Password
        </h2>
        <p className="text-[#49454f] mb-6 text-sm">
          For security reasons, you need to change your
          password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col w-full mb-4">
            <Label
              name="password"
              className="mb-1"
              label="New Password"
              required={true}
            />
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-start">
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Password is required",
                    validate: (value) => {
                      if (
                        !(
                          value.length >= 8 &&
                          value.length <= 20
                        )
                      ) {
                        return "Password must be 8-20 characters";
                      }
                      if (!/[A-Z]/.test(value)) {
                        return "Password must include uppercase letter";
                      }
                      if (!/\d/.test(value)) {
                        return "Password must include a number";
                      }
                      if (
                        !/[!@#$%^&*(),.?":{}|<>]/.test(
                          value
                        )
                      ) {
                        return "Password must include a special character";
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type={
                        isNewPasswordVisible
                          ? "text"
                          : "password"
                      }
                      required={true}
                      id="password"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        updatePasswordCriteria(
                          e.target.value
                        );
                      }}
                    />
                  )}
                />
                <ViewHideEyeButton
                  isPasswordVisible={isNewPasswordVisible}
                  onClick={toggleNewPassVisibility}
                  className={
                    isMatch ? "ml-[-65px]" : "ml-[-40px]"
                  }
                />
                <MatchedPassword
                  isMatched={isMatch}
                  className="ml-2"
                />
              </div>
              {errors.password && (
                <p className="text-[#B10E0EE5] text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col w-full mb-4">
            <Label
              className="mb-1"
              label="Confirm Password"
              name="confirmPassword"
              required={true}
            />
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-start">
                <Controller
                  name="confirmPassword"
                  control={control}
                  rules={{
                    required:
                      "Please confirm your password",
                    validate: (value) =>
                      value === password ||
                      "Passwords do not match",
                  }}
                  render={({ field }) => (
                    <Input
                      type={
                        isConfirmPasswordVisible
                          ? "text"
                          : "password"
                      }
                      required={true}
                      id="confirmPassword"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <ViewHideEyeButton
                  isPasswordVisible={
                    isConfirmPasswordVisible
                  }
                  onClick={toggleConfirmPassVisibility}
                  className={
                    isMatch ? "ml-[-65px]" : "ml-[-40px]"
                  }
                />
                <MatchedPassword
                  isMatched={isMatch}
                  className="ml-2"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[#B10E0EE5] text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <PasswordCriteriaList criteria={criteria} />

          <div className="mt-6">
            <SubmitButton
              disabled={
                !criteria.length ||
                !criteria.uppercase ||
                !criteria.number ||
                !criteria.specialChar ||
                !isMatch ||
                changePasswordMutation.isPending
              }
              label={
                changePasswordMutation.isPending
                  ? "Submitting..."
                  : "Change Password"
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;

ChangePasswordModal.propTypes = {
  onSuccess: PropTypes.func,
};
