import { useEffect, useState } from "react";
import {
  FaCircleCheck,
  FaCircleXmark,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import toast from "react-hot-toast";

const UserActivation = () => {
  const [success, setSuccess] = useState(false);
  const accountId = window.location.pathname.split("/")[3];
  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await axios.patch(
          `/api/client/client-user-activation/${accountId}/`
        );
        if (response.status === 200) {
          setSuccess(true);
        }
      } catch (error) {
        if (error.status === 404) {
          setSuccess(false);
        } else {
          setSuccess(true);
          toast.success(
            "Your account has already been activated"
          );
        }
      }
    };

    activateAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();
  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center mt-16 w-[75%] mx-2">
        {success ? (
          <>
            <FaCircleCheck className="text-[#2ECC71] w-[70px] h-[70px] font-bold " />
            <h1 className="text-[#00000096] font-bold text-[32px] my-4 text-center">
              SUCCESS
            </h1>
            <p className="text-xs font-bold uppercase text-[#00000096] text-center mb-[90px]">
              Your account has been successfully activated
            </p>
            <button
              className="w-full p-[11px] font-outfit font-bold text-base text-[#FFFFFF] tracking-[1%] leading-[auto] bg-[#056DDC] rounded-[100px] mb-[176px]"
              onClick={() => {
                navigate("/auth/signin/loginmail");
              }}
            >
              Continue
            </button>
          </>
        ) : (
          <>
            <FaCircleXmark className=" text-red-500 w-[70px] h-[70px] font-bold " />
            <h1 className="text-[#00000096] font-bold text-[32px] my-4 text-center">
              ERROR
            </h1>
            <p className="text-xs font-bold uppercase text-[#00000096] text-center mb-[90px]">
              Failed to activate your account
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default UserActivation;
