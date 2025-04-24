import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import axios from "../../api/axios";

import useAuth from "../../hooks/useAuth";
import useToggle from "../../hooks/useToggle";
import {
  EMAIL_REGEX,
  ROLES,
  ROLES_REDIRECTS,
} from "../Constants/constants";
import toast from "react-hot-toast";
import {
  // SecondaryButton,
  SubmitButton,
  Label,
  Input,
  ViewHideEyeButton,
} from "../shared/auth-form-components";
import { useState } from "react";

const LoginUsingEmail = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isPasswordVisible, setIsPasswordVisible] =
    useState(false);
  const [check, toggleCheck] = useToggle("persist", false);

  // Setup React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // React Query mutation for login
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await axios.post(
        "/api/login/",
        credentials,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      const accessToken = data.data.access;
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
      const role = data.data.role;
      const name = data.data.name;
      const is_password_change =
        data.data.is_password_change;
      const is_policy_and_tnc_accepted =
        data.data.is_policy_and_tnc_accepted;
      const email = getValues("email");

      setAuth({
        email,
        accessToken,
        role,
        name,
        is_password_change,
        is_policy_and_tnc_accepted,
      });
      reset();

      toast.success("Logged in successfully");

      const userMainRole = Object.entries(ROLES).find(
        // eslint-disable-next-line no-unused-vars
        ([_, roles]) => roles.includes(role)
      )?.[0];

      // Determine where to redirect the user
      let redirectPath;

      // Check if we have a stored location from RequireAuth that's not the root path
      if (
        location.state?.from &&
        location.state.from.pathname !== "/"
      ) {
        const requestedPath = location.state.from.pathname;

        // Check if the user has permission to access the requested path
        // This checks if the path includes the user's role (e.g., /client/ for CLIENT role)
        const isPathAuthorized =
          userMainRole &&
          (requestedPath
            .toLowerCase()
            .includes(userMainRole.toLowerCase()) ||
            checkPathPermissions(requestedPath, role));

        if (isPathAuthorized) {
          // If authorized, redirect to the original page
          redirectPath = requestedPath;
        } else {
          // If not authorized, redirect to role-appropriate dashboard
          redirectPath = ROLES_REDIRECTS[userMainRole];
        }
      } else {
        // If no specific page or it was the root path, redirect to role-appropriate dashboard
        redirectPath = ROLES_REDIRECTS[userMainRole];
      }

      navigate(redirectPath, { replace: true });
    },
    onError: (error) => {
      if (!error?.response) {
        toast.error("No Server Response");
      } else if (error.response?.status === 400) {
        toast.error("Invalid credentials");
      } else if (error.response?.status === 401) {
        toast.error("Unauthorized");
      } else {
        toast.error("Login Failed");
      }
    },
  });

  const checkPathPermissions = (path, userRole) => {
    const pathPermissions = {
      "/agency/": ["AGENCY"],
      "/client/": ["CLIENT"],
      "/interviewer/": ["INTERVIEWER"],
      "/internal/": ["INTERNAL"],
    };

    for (const [pathPrefix, allowedRoles] of Object.entries(
      pathPermissions
    )) {
      if (
        path.startsWith(pathPrefix) &&
        !allowedRoles.includes(userRole)
      ) {
        return false; // User doesn't have permission
      }
    }

    return true;
  };

  // Initialize email field once when component mounts
  useEffect(() => {
    // This runs only once when component mounts
    const rememberedEmail =
      localStorage.getItem("email") || "";
    const shouldRemember = JSON.parse(
      localStorage.getItem("persist") || "false"
    );

    // Set the initial values
    if (shouldRemember) {
      setValue("email", rememberedEmail);
    }

    // Always clear password field for security
    setValue("password", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means it only runs once on mount

  const handleFPNavigation = () => {
    navigate("/auth/forgetpass");
  };

  const togglePassVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Handle toggle for the remember me checkbox
  const handleToggleCheck = () => {
    // Toggle the checkbox (the hook should update localStorage)
    toggleCheck();

    // If we're unchecking, clear the email from localStorage
    if (check) {
      // check is still the previous value before toggling
      localStorage.removeItem("email");
    }
  };

  // Form submission handler
  const onSubmit = (data) => {
    // Save email to localStorage if remember me is checked
    if (check) {
      localStorage.setItem("email", data.email);
    } else {
      localStorage.removeItem("email");
    }

    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="w-full h-full mt-5">
      <div className="flex items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-2 w-[75%] h-full"
        >
          <div className="flex flex-col w-full h-full mt-1">
            <Label
              name="email"
              className="mb-1"
              label="Login using Email"
              required={true}
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
                <Input
                  type="email"
                  value={field.value}
                  onChange={field.onChange}
                  id="email"
                  autoComplete="off"
                />
              )}
            />
            <p
              className={`text-[#B10E0EE5] text-xs ${
                errors.email
                  ? "visible mt-2"
                  : "invisible h-[12px]"
              }`}
            >
              {errors.email?.message}
            </p>
          </div>

          <div className="flex flex-col w-full h-full mt-1">
            <Label
              name="password"
              className="mb-1 mt-3"
              label="Password"
              required={true}
            />
            <div className="flex items-center justify-start">
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                }}
                render={({ field }) => (
                  <Input
                    id="password"
                    value={field.value}
                    onChange={field.onChange}
                    type={
                      isPasswordVisible
                        ? "text"
                        : "password"
                    }
                  />
                )}
              />
              <ViewHideEyeButton
                onClick={togglePassVisibility}
                isPasswordVisible={isPasswordVisible}
                className={"ml-[-10%]"}
              />
            </div>
            <p
              className={`text-[#B10E0EE5] text-xs ${
                errors.password
                  ? "visible mt-2"
                  : "invisible h-[12px]"
              }`}
            >
              {errors.password?.message}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="w-[15px] h-[15px] font-[1px] text-[#D9CFFB] rounded-[2px] mr-1"
                id="persist"
                onChange={handleToggleCheck}
                checked={check}
              />
              <Label
                name="persist"
                className={""}
                label="Remember Me"
              />
            </div>
            <button
              type="button"
              onClick={handleFPNavigation}
              className="flex items-center font-outfit font-medium text-link text-default"
            >
              {" "}
              Forgot Password?{" "}
            </button>{" "}
          </div>

          <div className="mb-8 mt-10">
            <SubmitButton
              disabled={loginMutation.isPending}
              label={
                loginMutation.isPending
                  ? "Loading..."
                  : "Submit"
              }
            />
            {/* <SecondaryButton
              disabled={true}
              label={"Login Using Mobile Number"}
              onClick={handleLGNNavigation}
            /> */}
            {/* <SecondaryButton
              disabled={true}
              label={"Login Using SSO"}
              onClick={() => {}}
            /> */}
          </div>
          <div className="flex items-center justify-center gap-x-2 mb-4 text-gray-500">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="/client-tnc"
              className="text-xs font-medium hover:text-gray-700 transition-colors"
            >
              Terms & Conditions
            </a>
            <div className="h-4 w-px bg-gray-400"></div>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="/privacy-policy"
              className="text-xs font-medium hover:text-gray-700 transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginUsingEmail;
