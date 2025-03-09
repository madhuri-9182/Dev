import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "../../api/axios";
import { getGoogleEvents } from "./api";

function InterviewRecord() {
  const navigate = useNavigate();
  const data = [
    {
      name: "Ashok Samal",
      role: "SDE II",
      function: "Backend",
      date: "15/10/2024, FRI",
      time: "4:00 PM",
      experience: "7 Years 5 Months",
      company: "Amazon",
    },
    {
      name: "Sudipta Pradhan",
      role: "SDE II",
      function: "Backend",
      date: "18/10/2024, MON",
      time: "2:00 PM",
      experience: "4 Years 10 Months",
      company: "Cred",
    },
    {
      name: "Sandy Pradhan",
      role: "SDE II",
      function: "Backend",
      date: "20/10/2024, WED",
      time: "3:30 PM",
      experience: "8 Years",
      company: "Zomato",
    },
    {
      name: "Pooja S",
      role: "SDE II",
      function: "Backend",
      date: "21/10/2024, THU",
      time: "11:00 AM",
      experience: "7 Years 2 Months",
      company: "Microsoft",
    },
  ];

  // Mutation for checking events API
  const checkEventsMutation = useMutation({
    mutationFn: getGoogleEvents,
    onSuccess: (data) => {
      console.log(data, "data");
      if (data && data.status === "success") {
        navigate("/interviewer/calendar");
      } else {
        handleBlockCalendar();
      }
    },
    onError: (error) => {
      console.error("Error checking events API:", error);
      handleBlockCalendar();
    },
  });

  const handleBlockCalendar = async () => {
    try {
      const response = await axios.get(
        "/api/google-auth/init/"
      );
      if (
        response.data &&
        response.data.data &&
        response.data.data.url
      ) {
        window.location.href = response.data.data.url;
      }
    } catch (error) {
      console.error(
        "Error initializing Google Auth:",
        error
      );
    }
  };

  const handleCalendarClick = () => {
    // First check if events API is accessible
    checkEventsMutation.mutate();
  };

  return (
    <div className="flex h-full">
      <div className="w-5/6 h-screen p-2">
        <div className="p-4">
          <div>
            {" "}
            <h1 className="text-[18px] font-bold">
              Accepted Interviews{" "}
              <span className="text-white bg-[#056DDC] px-2 py-1 rounded-full">
                38
              </span>
            </h1>
          </div>
          <div className="p-4">
            <table className="w-full rounded-lg border-separate border-spacing-y-[2px]">
              <thead>
                <tr className=" text-black text-sm font-semibold">
                  <th className="px-4 py-2 text-left">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left">
                    Role
                  </th>
                  <th className="px-4 py-2 text-left">
                    Function
                  </th>
                  <th className="px-4 py-2 text-left">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left">
                    Time
                  </th>
                  <th className="px-4 py-2 text-left">
                    Experience
                  </th>
                  <th className="px-4 py-2 text-left">
                    Company
                  </th>
                  <th className="px-4 py-2 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {data.map((item, index) => (
                  <tr key={index} className="my-[2px]">
                    <td colSpan="8" className="p-0">
                      {/* Wrapper div with rounded-full */}
                      <div className="bg-[#EBEBEB] rounded-full flex items-center justify-between px-4 py-3 text-sm">
                        <span className="flex-1 px-4">
                          {item.name}
                        </span>
                        <span className="flex-1 px-4">
                          {item.role}
                        </span>
                        <span className="flex-1 px-4">
                          {item.function}
                        </span>
                        <span className="flex-1 px-4">
                          {item.date}
                        </span>
                        <span className="flex-1 px-4">
                          {item.time}
                        </span>
                        <span className="flex-1 px-4">
                          {item.experience}
                        </span>
                        <span className="flex-1 px-4">
                          {item.company}
                        </span>
                        <span className="flex items-center gap-4 px-4">
                          <button className="text-gray-500 hover:text-blue-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 -960 960 960"
                              width="24px"
                              fill="#434343"
                            >
                              <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                            </svg>
                          </button>
                          <button className="text-gray-500 hover:text-green-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 -960 960 960"
                              width="24px"
                              fill="#434343"
                            >
                              <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                            </svg>
                          </button>
                          <button className="text-gray-500 hover:text-blue-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 -960 960 960"
                              width="24px"
                              fill="#434343"
                            >
                              <path d="m424-312 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
                            </svg>
                          </button>
                          <button className="text-gray-500 hover:text-red-500">
                            <Link
                              to={"/interviewer/feedback"}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#434343"
                              >
                                <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" />
                              </svg>
                            </Link>
                          </button>
                          <button className="text-gray-500 hover:text-red-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 -960 960 960"
                              width="24px"
                              fill="#434343"
                            >
                              <path d="M507-480 384-357l56 57 180-180-180-180-56 57 123 123ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                            </svg>
                          </button>
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="p-4">
          <div>
            {" "}
            <h1 className="text-[18px] font-bold">
              Pending Feedback{" "}
              <span className="text-white bg-[#056DDC] px-2 py-1 rounded-full">
                25
              </span>
            </h1>
          </div>
          <div className="p-4">
            <table className="w-full rounded-lg border-separate border-spacing-y-[2px]">
              <thead>
                <tr className=" text-black text-sm font-semibold">
                  <th className="px-4 py-2 text-left">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left">
                    Role
                  </th>
                  <th className="px-4 py-2 text-left">
                    Function
                  </th>
                  <th className="px-4 py-2 text-left">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left">
                    Time
                  </th>
                  <th className="px-4 py-2 text-left">
                    Experience
                  </th>
                  <th className="px-4 py-2 text-left">
                    Company
                  </th>
                  <th className="px-4 py-2 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {data.map((item, index) => (
                  <tr key={index} className="my-[2px]">
                    <td colSpan="8" className="p-0">
                      {/* Wrapper div with rounded-full */}
                      <div className="bg-[#EBEBEB] rounded-full flex items-center justify-between px-4 py-3 text-sm">
                        <span className="flex-1 px-4">
                          {item.name}
                        </span>
                        <span className="flex-1 px-4">
                          {item.role}
                        </span>
                        <span className="flex-1 px-4">
                          {item.function}
                        </span>
                        <span className="flex-1 px-4">
                          {item.date}
                        </span>
                        <span className="flex-1 px-4">
                          {item.time}
                        </span>
                        <span className="flex-1 px-4">
                          {item.experience}
                        </span>
                        <span className="flex-1 px-4">
                          {item.company}
                        </span>
                        <span className="flex items-center gap-4 px-4">
                          <button className="text-gray-500 hover:text-blue-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 -960 960 960"
                              width="24px"
                              fill="#434343"
                            >
                              <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                            </svg>
                          </button>
                          <button className="text-gray-500 hover:text-green-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 -960 960 960"
                              width="24px"
                              fill="#434343"
                            >
                              <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                            </svg>
                          </button>
                          <button className="text-gray-500 hover:text-blue-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 -960 960 960"
                              width="24px"
                              fill="#434343"
                            >
                              <path d="m424-312 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
                            </svg>
                          </button>
                          <button className="text-gray-500 hover:text-red-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 -960 960 960"
                              width="24px"
                              fill="#434343"
                            >
                              <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" />
                            </svg>
                          </button>
                          <button className="text-gray-500 hover:text-red-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 -960 960 960"
                              width="24px"
                              fill="#434343"
                            >
                              <path d="M507-480 384-357l56 57 180-180-180-180-56 57 123 123ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                            </svg>
                          </button>
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="p-4">
          <div>
            {" "}
            <h1 className="text-[18px] font-bold">
              Interview History
              <span className="text-white bg-[#056DDC] px-2 py-1 rounded-full">
                12
              </span>
            </h1>
          </div>
          <div className="p-4">
            <table className="w-full rounded-lg border-separate border-spacing-y-[2px]">
              <thead>
                <tr className=" text-black text-sm font-semibold">
                  <th className="px-4 py-2 text-left">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left">
                    Role
                  </th>
                  <th className="px-4 py-2 text-left">
                    Function
                  </th>
                  <th className="px-4 py-2 text-left">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left">
                    Time
                  </th>
                  <th className="px-4 py-2 text-left">
                    Experience
                  </th>
                  <th className="px-4 py-2 text-left">
                    Company
                  </th>
                  <th className="px-4 py-2 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {data.map((item, index) => (
                  <tr key={index} className="my-[2px]">
                    <td colSpan="8" className="p-0">
                      {/* Wrapper div with rounded-full */}
                      <div className="bg-[#EBEBEB] rounded-full flex items-center justify-between px-4 py-3 text-sm">
                        <span className="flex-1 px-4">
                          {item.name}
                        </span>
                        <span className="flex-1 px-4">
                          {item.role}
                        </span>
                        <span className="flex-1 px-4">
                          {item.function}
                        </span>
                        <span className="flex-1 px-4">
                          {item.date}
                        </span>
                        <span className="flex-1 px-4">
                          {item.time}
                        </span>
                        <span className="flex-1 px-4">
                          {item.experience}
                        </span>
                        <span className="flex-1 px-4">
                          {item.company}
                        </span>
                        <span className="flex items-center gap-4 px-4">
                          <button className="text-gray-500 hover:text-blue-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 -960 960 960"
                              width="24px"
                              fill="#434343"
                            >
                              <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                            </svg>
                          </button>
                          <button className="text-gray-500 hover:text-green-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 -960 960 960"
                              width="24px"
                              fill="#434343"
                            >
                              <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                            </svg>
                          </button>
                          <button className="text-gray-500 hover:text-blue-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 -960 960 960"
                              width="24px"
                              fill="#434343"
                            >
                              <path d="m424-312 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
                            </svg>
                          </button>
                          <button className="text-gray-500 hover:text-red-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 -960 960 960"
                              width="24px"
                              fill="#434343"
                            >
                              <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" />
                            </svg>
                          </button>
                          <button className="text-gray-500 hover:text-red-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 -960 960 960"
                              width="24px"
                              fill="#434343"
                            >
                              <path d="M507-480 384-357l56 57 180-180-180-180-56 57 123 123ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                            </svg>
                          </button>
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex items-start justify-center w-1/6 py-5 px-4 h-screen">
        <div className="p-5 mt-20 flex flex-col items-center justify-start rounded-lg w-full bg-[#E7E4E8] h-2/4">
          <Link
            to="/hiring-dog/interviewer/payments"
            className="border border-purple-950 px-5 py-2 w-11/12 rounded-full text-xl text-center"
          >
            Check Receivables
          </Link>
          <button
            onClick={handleCalendarClick}
            className="mt-5 bg-blue-500 px-5 py-2 w-11/12 rounded-full text-xl text-white text-center"
            disabled={checkEventsMutation.isLoading}
          >
            {checkEventsMutation.isLoading
              ? "Loading..."
              : "Block Calendar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InterviewRecord;
