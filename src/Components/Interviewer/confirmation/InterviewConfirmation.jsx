/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from "@tanstack/react-query";
import {
  FaCircleCheck,
  FaCircleXmark,
} from "react-icons/fa6";
// import toast from "react-hot-toast";
import { LoadingState } from "../../shared/loading-error-state";
import { interviewAcceptOrReject } from "../api";
import { useEffect } from "react";
import toast from "react-hot-toast";

const InterviewerConfirmation = () => {
  const interviewId =
    window.location.pathname.split("/")[2];

  const {
    isSuccess,
    isPending,
    data,
    mutate,
    isError,
    error,
  } = useMutation({
    mutationFn: interviewAcceptOrReject,
    onError: (error) => {
      if (error.status === 400) {
        toast.error(error.response.data.message);
      }
    },
  });

  useEffect(() => {
    mutate(interviewId);
  }, [interviewId]);

  if (isPending) {
    return <LoadingState />;
  }

  const isRejected = data?.message === "Interview Rejected";

  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center mt-16 w-[360px] mx-10">
        {isSuccess ? (
          <>
            {isRejected ? (
              <FaCircleXmark className="text-[#FF5252] w-[60px] h-[60px] font-bold" />
            ) : (
              <FaCircleCheck className="text-[#2ECC71] w-[60px] h-[60px] font-bold " />
            )}
            <h1 className="text-[#00000096] font-bold text-2xl my-4 text-center">
              {isRejected
                ? " INTERVIEW DECLINED"
                : "INTERVIEW ACCEPTED"}
            </h1>
            <p className="text-xs font-bold uppercase text-[#00000096] text-center mb-[90px]">
              You have successfully{" "}
              {isRejected ? "declined" : "accepted"} the
              interview request
            </p>
            <button
              className="w-full p-[11px] font-outfit font-bold text-base text-[#FFFFFF] tracking-[1%] leading-[auto] bg-[#056DDC] rounded-[100px] mb-[176px]"
              onClick={() => {
                window.close();
              }}
            >
              Close
            </button>
          </>
        ) : (
          isError && (
            <>
              <FaCircleXmark className="text-red-500 w-[60px] h-[60px] font-bold" />
              <h1 className="text-[#00000096] font-bold text-2xl my-4 text-center">
                ERROR
              </h1>
              <p className="text-xs font-bold uppercase text-[#00000096] text-center mb-[90px]">
                {error.response?.data?.message
                  ? error.response?.data?.message
                  : "An error occurred while processing the request"}
              </p>
              <button
                className="w-full p-[11px] font-outfit font-bold text-base text-[#FFFFFF] tracking-[1%] leading-[auto] bg-[#056DDC] rounded-[100px] mb-[176px]"
                onClick={() => {
                  window.close();
                }}
              >
                Close
              </button>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default InterviewerConfirmation;
