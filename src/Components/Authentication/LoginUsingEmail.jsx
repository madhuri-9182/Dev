import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../api/axios";

import useAuth from "../../hooks/useAuth";
import useInput from "../../hooks/useInput";
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
} from "../shared/form-components";

const LoginUsingEmail = () => {
  // eslint-disable-next-line no-unused-vars
  const { setAuth, auth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [isPasswordVisible, setIsPasswordVisible] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [inputError, setInputError] = useState({});
  const [email, resetEmail, setEmail] = useInput(
    "email",
    ""
  );
  const [check, toggleCheck] = useToggle("persist", false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmailError, setShowEmailError] =
    useState(false);

  useEffect(() => {
    if (check) {
      setEmail(email);
    } else {
      setEmail("");
    }
    setPassword("");
    setErrorMessage("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage, {
        position: "top-right",
      });
    }
  }, [errorMessage]);

  const handleLGNNavigation = () => {
    navigate("/auth/signin/loginnumber");
  };
  const handleFPNavigation = () => {
    navigate("/auth/forgetpass");
  };

  const togglePassVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

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
        setInputError({ email: "" });
      }
    } else {
      setInputError({ email: "" });
    }
    setEmail(e.target.value);
  };

  const handleLoginViaEmail = async (e) => {
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
      setErrorMessage("");
      const response = await axios.post(
        "/api/login/",
        { email, password },
        {
          withCredentials: true,
        }
      );
      const accessToken = response.data.data.access;
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
      const role = response.data.data.role;
      const name = response.data.data.name;
      setAuth({ email, accessToken, role, name });
      resetEmail();
      setPassword("");
      toast.success("Logged in successfully", {
        position: "top-right",
      });
      const userMainRole = Object.entries(ROLES).find(
        // eslint-disable-next-line no-unused-vars
        ([_, roles]) => roles.includes(role)
      )?.[0];
      console.log(userMainRole, "user main role");

      const isAccessiblePath =
        userMainRole &&
        location.state?.from?.pathname &&
        location.state.from.pathname.includes(
          userMainRole.toLowerCase()
        );
      console.log(isAccessiblePath, "isAccessiblePath");

      const from = isAccessiblePath
        ? location.state.from.pathname
        : ROLES_REDIRECTS[userMainRole];

      console.log(from);
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response");
      } else if (err.response?.status === 400) {
        setErrorMessage("Invalid credentials");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized");
      } else {
        setErrorMessage("Login Failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full mt-5">
      <div className=" flex items-center justify-center ">
        <form
          onSubmit={handleLoginViaEmail}
          className=" p-2 w-[75%] h-full "
        >
          <div className="flex flex-col w-full h-full mt-1">
            <Label
              name="email"
              className="mb-1"
              label="Login using Email"
            />
            <Input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              id="email"
              autoComplete="off"
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
          <div className="flex flex-col w-full h-full mt-1">
            <Label
              name="number"
              className="mb-1 mt-3"
              label="Password"
            />
            <div className="flex items-center justify-start">
              <Input
                id="number"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                type={
                  isPasswordVisible ? "text" : "password"
                }
              />
              <ViewHideEyeButton
                onClick={togglePassVisibility}
                isPasswordVisible={isPasswordVisible}
                className={"ml-[-10%]"}
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="w-[15px] h-[15px] font-[1px] text-[#D9CFFB] rounded-[2px] mr-1 "
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
              disabled={loading}
              label={"Submit"}
            />
            <SecondaryButton
              disabled={true}
              label={"Login Using Mobile Number"}
              onClick={handleLGNNavigation}
            />
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
