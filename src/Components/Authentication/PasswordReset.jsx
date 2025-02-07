import { useEffect, useState } from "react";
import "../../App.css";
import {
  Input,
  Label,
  MatchedPassword,
  SubmitButton,
  ViewHideEyeButton,
} from "../shared/form-components";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import toast from "react-hot-toast";
import { FaCircleCheck } from "react-icons/fa6";

const PasswordReset = () => {
  const [isNewPasswordVisible, setIsNewPasswordVisible] =
    useState(false);
  const [
    isConfirmPasswordVisible,
    setIsConfirmPasswordVisible,
  ] = useState(false);
  const toggleNewPassVisibility = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };
  const toggleConfirmPassVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [isMatch, setIsMatch] = useState(false);
  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });
  const [success, setSuccess] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (errMessage) {
      toast.error(errMessage, {
        position: "top-right",
      });
    }
  }, [errMessage]);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(e.target.value);
    setIsMatch(
      e.target.value !== "" &&
        e.target.value === confirmPassword
    );
    setCriteria({
      length: value.length >= 8 && value.length <= 20,
      uppercase: /[A-Z]/.test(value),
      number: /\d/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setIsMatch(
      e.target.value !== "" && e.target.value === password
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMessage("");
    setLoading(true);
    const token = location.pathname.split("/")[3];
    try {
      const response = await axios.post(
        "/api/password_reset/confirm/",
        {
          password: password,
          token: token,
        }
      );
      if (response.status === 200) {
        setSuccess(true);
      }
    } catch (error) {
      console.log(error, "error");
      if (!error?.response) {
        setErrMessage("No Server Response");
      } else if (error.status === 404) {
        setErrMessage(error.response.data.errors[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  const PASSWORD_CRITERIA = [
    {
      name: "Between 8 and 20 characters",
      checked: criteria.length,
    },
    {
      name: "1 upper case letter",
      checked: criteria.uppercase,
    },
    {
      name: "1 or more numbers",
      checked: criteria.number,
    },
    {
      name: "1 or more special characters",
      checked: criteria.specialChar,
    },
  ];

  return (
    <div className="flex w-full h-full  mt-5">
      <div className="parent flex justify-center items-center w-full   ">
        {/* Password Reset Form */}
        {!success ? (
          <form
            className=" flex flex-col justify-center w-[75%] h-full "
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col w-full h-full mt-1">
              <Label
                name={"newPassword"}
                className="mb-1"
                label={"New Password"}
              />
              <div className="flex items-center justify-start mb-4">
                <Input
                  type={
                    isNewPasswordVisible
                      ? "text"
                      : "password"
                  }
                  required={true}
                  id="newPassword"
                  value={password}
                  onChange={handlePasswordChange}
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
            </div>
            <div className="flex flex-col w-full h-full mt-1">
              <Label
                className="mb-1"
                label="Confirm Password"
                name="confirmPassword"
              />
              <div className="flex items-center justify-start mb-11">
                <Input
                  type={
                    isConfirmPasswordVisible
                      ? "text"
                      : "password"
                  }
                  required={true}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
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
            </div>
            <div>
              <p className="text-[#979DA3] uppercase text-xs font-black mb-5">
                Your password must contain
              </p>
              <ul className="list-none flex flex-col gap-1">
                {/* Password criteria */}
                {PASSWORD_CRITERIA.map(
                  (criteria, index) => (
                    <li
                      key={index}
                      className="flex items-center font-semibold text-xs text-[#989DA3]"
                    >
                      <input
                        type="checkbox"
                        checked={criteria.checked}
                        readOnly
                        className="mr-2 appearance-none w-4 h-4 bg-[#EEEEEE] rounded-full border-[3px] border-[#EEEEEE] checked:bg-[#2ECC71]"
                      />
                      {criteria.name}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="mt-10 mb-12">
              <SubmitButton
                disabled={
                  !criteria.length ||
                  !criteria.uppercase ||
                  !criteria.number ||
                  !criteria.specialChar ||
                  password != confirmPassword ||
                  loading
                }
                label={"Submit"}
              />
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center mt-10 w-[75%] mx-2">
            <FaCircleCheck className="text-[#2ECC71] w-[70px] h-[70px] font-bold " />
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
