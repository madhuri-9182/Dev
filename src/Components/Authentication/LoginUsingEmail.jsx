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
  SecondaryButton,
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
      const email = getValues("email");

      setAuth({ email, accessToken, role, name });
      reset();

      toast.success("Logged in successfully", {
        position: "top-right",
      });

      const userMainRole = Object.entries(ROLES).find(
        // eslint-disable-next-line no-unused-vars
        ([_, roles]) => roles.includes(role)
      )?.[0];

      const isAccessiblePath =
        userMainRole &&
        location.state?.from?.pathname &&
        location.state.from.pathname.includes(
          userMainRole.toLowerCase()
        );

      const from = isAccessiblePath
        ? location.state.from.pathname
        : ROLES_REDIRECTS[userMainRole];

      navigate(from, { replace: true });
    },
    onError: (error) => {
      if (!error?.response) {
        toast.error("No Server Response", {
          position: "top-right",
        });
      } else if (error.response?.status === 400) {
        toast.error("Invalid credentials", {
          position: "top-right",
        });
      } else if (error.response?.status === 401) {
        toast.error("Unauthorized", {
          position: "top-right",
        });
      } else {
        toast.error("Login Failed", {
          position: "top-right",
        });
      }
    },
  });

  useEffect(() => {
    // Set remembered email if check is true
    if (check) {
      const rememberedEmail =
        localStorage.getItem("email") || "";
      setValue("email", rememberedEmail);
    } else {
      setValue("email", "");
    }
    setValue("password", "");
  }, [check, setValue]);

  const handleFPNavigation = () => {
    navigate("/auth/forgetpass");
  };

  const togglePassVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
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
                onChange={toggleCheck}
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

          <div className="mb-12 mt-10">
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
            <SecondaryButton
              disabled={true}
              label={"Login Using SSO"}
              onClick={() => {}}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginUsingEmail;
