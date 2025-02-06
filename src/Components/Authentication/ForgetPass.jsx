import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "../../api/axios";
import { EMAIL_REGEX } from "../Constants/constants";
import {
  SubmitButton,
  Label,
  Input,
} from "../../utils/form-components";

function ForgetPass() {
  const [email, setEmail] = useState("");
  const [inputError, setInputError] = useState({});
  const [showEmailError, setShowEmailError] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!EMAIL_REGEX.test(email)) {
      setInputError({
        email: "Invalid email address",
      });
      setShowEmailError(true);
      setLoading(false);
      return;
    }

    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(
        "/api/password_reset/",
        { email }
      );
      navigate("/auth/signin/loginmail");
      toast.success(
        "Password reset link sent to your email",
        {
          position: "top-right",
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mt-[10%] ">
      <div className=" flex items-center justify-center ">
        <form
          className=" p-2 w-[75%] h-[441px] "
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
            label={"Submit"}
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
}

export default ForgetPass;
