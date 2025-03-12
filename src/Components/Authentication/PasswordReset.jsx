import { useState } from "react";
import "../../App.css";
import {
  Input,
  Label,
  MatchedPassword,
  PasswordCriteriaList,
  SubmitButton,
  ViewHideEyeButton,
} from "../shared/auth-form-components";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import toast from "react-hot-toast";
import { FaCircleCheck } from "react-icons/fa6";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";

// Create API client for password reset
const resetPassword = async ({ password, token }) => {
  const response = await axios.post(
    "/api/password_reset/confirm/",
    { password, token }
  );
  return response.data;
};

const PasswordReset = () => {
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
  const [success, setSuccess] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const token = location.pathname.split("/")[3];

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

  // Setup React Query mutation
  const passwordResetMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      setSuccess(true);
    },
    onError: (error) => {
      if (!error?.response) {
        toast.error("No Server Response");
      } else if (error.response?.status === 404) {
        toast.error(error.response.data.errors[0]);
      } else {
        toast.error("Password reset failed");
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
    passwordResetMutation.mutate({
      password: data.password,
      token,
    });
  };

  return (
    <div className="flex w-full h-full mt-5">
      <div className="parent flex justify-center items-center w-full">
        {/* Password Reset Form */}
        {!success ? (
          <form
            className="flex flex-col justify-center w-[75%] h-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col w-full h-full mt-1">
              <Label
                name={"password"}
                className="mb-1"
                label={"New Password"}
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
                    className={"ml-2"}
                  />
                </div>
                {errors.password && (
                  <p className="text-[#B10E0EE5] text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col w-full h-full mt-4">
              <Label
                className="mb-1"
                label="Confirm Password"
                name="confirmPassword"
              />
              <div className="flex flex-col w-full mb-4">
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
                    className={"ml-2"}
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
            <div className="mt-10 mb-12">
              <SubmitButton
                disabled={
                  !criteria.length ||
                  !criteria.uppercase ||
                  !criteria.number ||
                  !criteria.specialChar ||
                  !isMatch ||
                  passwordResetMutation.isPending
                }
                label={
                  passwordResetMutation.isPending
                    ? "Submitting..."
                    : "Submit"
                }
              />
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center mt-10 w-[75%] mx-2">
            <FaCircleCheck className="text-[#2ECC71] w-[70px] h-[70px] font-bold" />
            <p className="text-xs font-bold uppercase text-[#00000096] mt-6 text-center mb-[90px]">
              You have successfully reset your password
            </p>
            <button
              className="w-full p-[11px] font-outfit font-bold text-base text-[#FFFFFF] tracking-[1%] leading-[auto] bg-[#056DDC] rounded-[100px] mb-[176px]"
              onClick={() => {
                navigate("/auth/signin/loginmail");
              }}
            >
              Back to Log In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;
