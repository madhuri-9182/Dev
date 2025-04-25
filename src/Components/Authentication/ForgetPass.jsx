import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import axios from "../../api/axios";
import { EMAIL_REGEX } from "../Constants/constants";
import { useForm, Controller } from "react-hook-form";
import {
  SubmitButton,
  Label,
  Input,
} from "../shared/auth-form-components";

function ForgetPass() {
  const navigate = useNavigate();

  // Setup React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      email: "",
    },
  });

  // React Query mutation for password reset
  const resetPasswordMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        "/api/password_reset/",
        { email: data.email }
      );
      return response.data;
    },
    onSuccess: () => {
      navigate("/auth/signin/loginmail");
      toast.success(
        "Password reset link sent to your email"
      );
    },
    onError: (error) => {
      console.error("Password reset error:", error);

      if (!error?.response) {
        toast.error("No Server Response");
      } else if (error.response?.status === 404) {
        toast.error("Email not found");
      } else {
        toast.error("Failed to send reset link");
      }
    },
  });

  // Submit handler that gets called when form is valid
  const onSubmit = (data) => {
    resetPasswordMutation.mutate(data);
  };

  return (
    <div className="w-full mt-[10%]">
      <div className="flex items-center justify-center">
        <form
          className="p-2 w-[75%] h-80 sm:h-[350px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <p className="ml-[3%] mb-7 w-full mt-1 text-default font-medium font-outfit text-label">
            Please enter your registered E-mail Id
          </p>

          <div className="flex flex-col w-full mt-1 mb-10">
            <Label
              className="mb-5"
              label={"E-Mail Id :"}
              name={"email"}
              required={true}
            />

            {/* Using Controller to wrap the custom Input component */}
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
                  name="email"
                  required={true}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
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

          <SubmitButton
            label={
              resetPasswordMutation.isPending
                ? "Submitting..."
                : "Submit"
            }
            disabled={
              !isDirty ||
              !isValid ||
              resetPasswordMutation.isPending
            }
          />
        </form>
      </div>
    </div>
  );
}

export default ForgetPass;
