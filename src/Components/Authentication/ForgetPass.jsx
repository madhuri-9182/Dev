import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import axios from "../../api/axios";
import { EMAIL_REGEX } from "../Constants/constants";
import {
  SubmitButton,
  Label,
  Input,
} from "../shared/auth-form-components";

function ForgetPass() {
  const [email, setEmail] = useState("");
  const [inputError, setInputError] = useState({});
  const [showEmailError, setShowEmailError] =
    useState(false);

  const navigate = useNavigate();

  // React Query mutation for password reset
  const resetPasswordMutation = useMutation({
    mutationFn: async (email) => {
      const response = await axios.post(
        "/api/password_reset/",
        { email }
      );
      return response.data;
    },
    onSuccess: () => {
      navigate("/auth/signin/loginmail");
      toast.success(
        "Password reset link sent to your email",
        {
          position: "top-right",
        }
      );
    },
    onError: (error) => {
      console.error("Password reset error:", error);

      if (!error?.response) {
        toast.error("No Server Response", {
          position: "top-right",
        });
      } else if (error.response?.status === 404) {
        toast.error("Email not found", {
          position: "top-right",
        });
      } else {
        toast.error("Failed to send reset link", {
          position: "top-right",
        });
      }
    },
  });

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    if (showEmailError) {
      if (
        !EMAIL_REGEX.test(emailValue) &&
        emailValue.length > 0
      ) {
        setInputError({
          email: "Invalid email address",
        });
      } else {
        setInputError({});
      }
    }
    setEmail(emailValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!EMAIL_REGEX.test(email)) {
      setInputError({
        email: "Invalid email address",
      });
      setShowEmailError(true);
      return;
    }

    resetPasswordMutation.mutate(email);
  };

  return (
    <div className="w-full mt-[10%]">
      <div className="flex items-center justify-center">
        <form
          className="p-2 w-[75%] h-[441px]"
          onSubmit={handleSubmit}
        >
          <p className="ml-[3%] mb-7 w-full mt-1 text-default font-medium font-outfit text-label">
            Please enter your registered E-mail Id
          </p>
          <div className="flex flex-col w-full mt-1 mb-10">
            <Label
              className="mb-5"
              label={"E-Mail Id :"}
              name={"email"}
            />
            <Input
              type={"email"}
              name={"email"}
              required={true}
              value={email}
              onChange={handleEmailChange}
              autoComplete={"off"}
            />
            <p
              className={`text-[#B10E0EE5] text-xs ${
                inputError?.email
                  ? "visible mt-2"
                  : "invisible h-[12px]"
              }`}
            >
              {inputError?.email}
            </p>
          </div>
          <SubmitButton
            label={
              resetPasswordMutation.isPending
                ? "Submitting..."
                : "Submit"
            }
            disabled={resetPasswordMutation.isPending}
          />
        </form>
      </div>
    </div>
  );
}

export default ForgetPass;
