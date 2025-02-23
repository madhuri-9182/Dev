import { useEffect, useState } from "react";
import useAllJobs from "../../../hooks/useFetchAllJobs";
import { useLocation } from "react-router-dom";
import BasicDatePicker from "../../../utils/BasicDatePicker";
import { useNavigate } from "react-router-dom";
import { formatExperience } from "../../../utils/util";
import {
  CANDIDATE_SOURCE,
  JOB_NAMES,
  SPECIALIZATIONS,
} from "../../Constants/constants";
import { useMutation } from "@tanstack/react-query";
import { addCandidate } from "./api";
import toast from "react-hot-toast";
import DropCandidateModal from "./components/DropCandidateModal";

const timeSlots = [
  { time: "10 AM", available: "yes" },
  { time: "11 AM", available: "no" },
  { time: "12 PM", available: "yes" },
  { time: "1 PM", available: "no" },
  { time: "2 PM", available: "yes" },
  { time: "3 PM", available: "yes" },
  { time: "4 PM", available: "no" },
  { time: "5 PM", available: "yes" },
  { time: "6 PM", available: "no" },
  { time: "7 PM", available: "yes" },
];

function ClientScheduleInterview() {
  const { data: jobs } = useAllJobs();
  const location = useLocation();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const [openDeleteModal, setOpenDeleteModal] =
    useState(false);

  const queryParams = new URLSearchParams(location.search);
  const key = queryParams.get("key");
  const encodedData = key
    ? localStorage.getItem(key)
    : null;

  const item = encodedData ? JSON.parse(encodedData) : null;
  const [remark, setRemark] = useState(item.remark ?? "");

  const base64ToFile = (base64, filename) => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  useEffect(() => {
    if (item?.fileBase64) {
      const file = base64ToFile(
        item.fileBase64,
        item.file_name
      );
      setFile(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.fileBase64]);

  useEffect(() => {
    let isPageReload = false;

    const handleBeforeUnload = () => {
      isPageReload = true;
    };

    const handleUnload = () => {
      if (!isPageReload && key) {
        localStorage.removeItem(key);
      }
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
      window.removeEventListener("unload", handleUnload);
    };
  }, [key]);

  const [selectedFilters, setSelectedFilters] = useState({
    availabeSlots: "All",
  });
  const handleSelect = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const availabeSlots = [
    "9am - 10am",
    "10:15am - 11:15am",
    "9:45am - 10:45am",
    "10:30am - 11:30am",
    "11am - 12pm",
  ];

  const SIDEBAR_CONTENT = [
    {
      label: "Experience",
      value: formatExperience(item?.years_of_experience),
    },
    {
      label: "Email",
      value: item?.email,
    },
    {
      label: "Company",
      value: item?.current_company,
    },
    {
      label: "Designation",
      value: item?.current_designation
        ? item.current_designation
        : "N/A",
    },
    {
      label: "Source",
      value: CANDIDATE_SOURCE.find(
        (source) => source.id === item.source
      )?.name,
    },
  ];

  const role = jobs?.find(
    (job) => job.id === item.role
  )?.name;
  const roleValue =
    JOB_NAMES.find((job) => job.id === role)?.name || role;

  const functionValue = SPECIALIZATIONS.find(
    (spec) => spec.id === item.specialization
  )?.name;

  const FORM_ITEMS = [
    {
      label: "Name",
      value: item.name,
    },
    {
      label: "Role",
      value: roleValue,
    },
    {
      label: "Function",
      value: functionValue,
    },
  ];

  const handleDownload = () => {
    if (file) {
      const url = window.URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const mutation = useMutation({
    mutationFn: addCandidate,
    onSuccess: () => {
      toast.success("Candidate added successfully", {
        position: "top-right",
      });
      // we will create a key and based on that we will navigate it to candidate or call schedule interview api
      navigate("/client/candidates");
    },
    onError: (error) => {
      toast.error(error.message, {
        position: "top-right",
      });
    },
  });

  const handleAddCandidate = () => {
    const formdata = new FormData();
    formdata.append("name", item.name);
    formdata.append("email", item.email);
    formdata.append("phone", item.phone_number);
    formdata.append("job_id", item.role);
    formdata.append("year", item.years_of_experience.year);
    formdata.append(
      "month",
      item.years_of_experience.month
    );
    formdata.append("specialization", item.specialization);
    formdata.append("company", item.current_company);
    formdata.append("source", item.source);
    formdata.append("cv", file);
    formdata.append("gender", "M");
    if (remark) {
      formdata.append("remark", remark);
    }

    mutation.mutate(formdata);
  };

  const handleDeleteCandidate = () => {
    if (item?.id) {
      setOpenDeleteModal(true);
    } else {
      window.close();
    }
  };

  return (
    <>
      <div className="w-full flex gap-x-24">
        <div className=" p-10 flex flex-col gap-y-4 bg-[#E7E4E8CC] rounded-2xl w-[340px]">
          {/* SIDEBAR */}
          <div className="flex flex-col gap-y-8">
            {SIDEBAR_CONTENT.map((content, index) => (
              <div
                key={index}
                className="flex flex-col gap-y-2 text-[#6B6F7B]"
              >
                <label
                  className="text-xs uppercase"
                  htmlFor={content.label}
                >
                  {content.label}
                </label>
                <span className="font-bold text-sm">
                  {content.value}
                </span>
              </div>
            ))}
            <div className="flex flex-col gap-y-2 ">
              <label
                htmlFor="cv"
                className="text-xs uppercase text-[#6B6F7B] "
              >
                CV
              </label>
              <span
                className="text-sm font-bold text-[#6B6F7B] hover:text-[#007AFF] cursor-pointer"
                onClick={handleDownload}
              >
                Download
              </span>
            </div>
            <div className="flex flex-col">
              <textarea
                name="remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                maxLength={255}
                placeholder="Write your remarks here"
                className="rounded-2xl italic text-xs text-[#6B6F7B] p-4 w-full h-[120px] bg-[#F6F6F6]"
              />
            </div>
          </div>
        </div>
        {/* FORM */}
        <div className="w-3/4 p-6">
          <div className="w-[40%] flex flex-col gap-y-4 ">
            {FORM_ITEMS.map((item, idx) => (
              <div
                className="flex items-center gap-x-3"
                key={idx}
              >
                <label className="text-xs font-bold text-[#6B6F7B] text-right w-1/3">
                  {item.label}
                </label>
                <input
                  value={item.value || ""}
                  readOnly
                  type="text"
                  className="rounded-lg w-2/3 text-xs py-[7px] px-3 border border-[#CAC4D0] text-[#49454F] text-center"
                />
              </div>
            ))}
          </div>
          <div className="m-4 mt-32">
            <div className="px-6 p-2 w-[328px] h-[100px] bg-[#ECE6F0] rounded-xl">
              <div>
                <span className="text-sm text-[#49454F]">
                  Select Date
                </span>
              </div>

              <BasicDatePicker />
            </div>
          </div>

          <div className="mt-10">
            <h1 className="text-xl mb-4 text-black ">
              Time Slots
            </h1>
            <div className="grid grid-cols-10 gap-4">
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className={` text-center p-1 px-2 rounded-lg text-sm max-w-max ${
                    slot.available === "yes"
                      ? "bg-[#59B568] text-white "
                      : "bg-[#C7C7C7] text-[#6B6F7B]"
                  }`}
                >
                  {slot.time}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-center space-x-1">
              <span className="text-sm font-bold mr-4 text-[#6B6F7B] ">
                Available Slots
              </span>
              <div className="flex items-center space-x-2">
                {availabeSlots.map((availabeSlots) => (
                  <button
                    key={availabeSlots}
                    onClick={() =>
                      handleSelect(
                        "availabeSlots",
                        availabeSlots
                      )
                    }
                    className={` flex items-center justify-center px-2 py-1 border rounded-md text-xs w-auto ${
                      selectedFilters.availabeSlots ===
                      availabeSlots
                        ? "bg-purple-100 text-purple-700 border-purple-300"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    {/* Tick container */}
                    {selectedFilters.availabeSlots ===
                      availabeSlots && (
                      <span className="w-4 h-4 flex justify-center items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3 text-purple-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                    )}
                    {availabeSlots}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-x-4">
            <button
              className=" py-[10px] rounded-[100px] text-[#65558F] border border-[#79747E] text-xs font-medium cursor-pointer 
                transition-all duration-300 ease-in-out 
                hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6] w-36 h-10 flex items-center justify-center"
              onClick={handleDeleteCandidate}
            >
              Drop Candidate
            </button>
            {item?.id ? (
              item.status === "NSCH" ? (
                <button
                  className="bg-[#E8DEF8] text-[#4A4459] text-xs py-2 px-3 rounded-[100px] font-medium transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6] cursor-pointer flex justify-center items-center w-36 h-10"
                  onClick={handleAddCandidate}
                >
                  Schedule Later
                </button>
              ) : null
            ) : (
              <button
                className="bg-[#E8DEF8] text-[#4A4459] text-xs py-2 px-3 rounded-[100px] font-medium transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6] cursor-pointer flex justify-center items-center w-36 h-10"
                onClick={handleAddCandidate}
              >
                Schedule Later
              </button>
            )}
            <button
              className="px-6 py-[10px] rounded-[100px] text-white bg-[#007AFF] transition-all duration-300 ease-in-out
             hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] font-medium cursor-pointer w-28 h-10 flex items-center justify-center uppercase text-xs"
              onClick={() => navigate("/agency/candidates")}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
      {openDeleteModal && (
        <DropCandidateModal
          id={item?.id}
          onClose={() => setOpenDeleteModal(false)}
        />
      )}
    </>
  );
}

export default ClientScheduleInterview;
