import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "../../api/axios";
import { getGoogleEvents } from "./api";
import {
  ArrowSquareRight,
  Eye,
  MessageText1,
  ReceiveSquare,
  TickSquare,
} from "iconsax-react";

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
    <div className="flex h-full px-8 gap-x-5">
      <div className="w-full h-screen pt-8 flex flex-col gap-y-5">
        <div className="flex flex-col gap-y-3">
          <Heading
            title={"Accepted Interviews"}
            count={38}
          />
          <Table data={data} />
        </div>
        <div className="flex flex-col gap-y-3">
          <Heading title={"Pending Feedback"} count={25} />
          <Table data={data} />
        </div>
        <div className="flex flex-col gap-y-3">
          <Heading title={"Interview History"} count={12} />
          <Table data={data} />
        </div>
      </div>
      {/* Button Sidebar */}
      <div className="flex items-start justify-center w-52 py-5 h-screen">
        <div className="mt-20 py-5 px-3 flex flex-col items-center justify-start rounded-2xl bg-[#E7E4E8CC] h-5/6 gap-y-4">
          <Link
            to="/interviewer/payments"
            className="py-2 px-3 w-full text-sm font-medium border border-[#79747E] rounded-full text-[#65558F] transition-all duration-300 ease-in-out 
              hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6]"
          >
            Check Receivables
          </Link>
          <button
            onClick={handleCalendarClick}
            className=" py-2 px-4 rounded-full text-sm font-medium text-white
             bg-[#007AFF] transition-all duration-300 ease-in-out
             hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] cursor-pointer w-full"
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

const Heading = ({ title, count }) => (
  <div className="flex items-center gap-x-2">
    <h1 className="text-[#1C1C1C] font-semibold text-sm">
      {title}
    </h1>
    <span className="text-white w-7 h-7 text-2xs bg-[#056DDC] rounded-full flex items-center justify-center">
      {count}
    </span>
  </div>
);

Heading.propTypes = {
  title: PropTypes.string,
  count: PropTypes.number,
};

const Table = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div className="px-3">
      <table className="w-full border-separate border-spacing-y-2">
        <thead>
          <tr className="text-black text-xs font-semibold uppercase  grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_2fr] items-center ">
            <th className={tableHeadingAndBodyClassName}>
              Name
            </th>
            <th className={tableHeadingAndBodyClassName}>
              Role
            </th>
            <th className={tableHeadingAndBodyClassName}>
              Function
            </th>
            <th className={tableHeadingAndBodyClassName}>
              Date
            </th>
            <th className={tableHeadingAndBodyClassName}>
              Time
            </th>
            <th className={tableHeadingAndBodyClassName}>
              Experience
            </th>
            <th className={tableHeadingAndBodyClassName}>
              Company
            </th>
            <th className="px-4 text-center"></th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, idx) => (
            <tr key={idx} className="">
              <td colSpan={8} className="p-0">
                <div className="bg-[#EBEBEB80] text-2xs rounded-2xl font-normal grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_2fr] items-center py-3">
                  <span
                    className={tableHeadingAndBodyClassName}
                  >
                    {item.name}
                  </span>
                  <span
                    className={tableHeadingAndBodyClassName}
                  >
                    {item.role}
                  </span>
                  <span
                    className={tableHeadingAndBodyClassName}
                  >
                    {item.function}
                  </span>
                  <span
                    className={tableHeadingAndBodyClassName}
                  >
                    {item.date}
                  </span>
                  <span
                    className={tableHeadingAndBodyClassName}
                  >
                    {item.time}
                  </span>
                  <span
                    className={tableHeadingAndBodyClassName}
                  >
                    {item.experience}
                  </span>
                  <span
                    className={tableHeadingAndBodyClassName}
                  >
                    {item.company}
                  </span>
                  <span className="px-4 flex gap-x-3 items-center justify-center">
                    <ReceiveSquare
                      size={16}
                      color="#171717"
                      className="cursor-pointer"
                    />
                    <Eye
                      size={16}
                      color="#171717"
                      className="cursor-pointer"
                    />
                    <TickSquare
                      size={16}
                      color="#171717"
                      className="cursor-pointer"
                    />
                    <MessageText1
                      size={16}
                      color="#171717"
                      className="cursor-pointer"
                      onClick={() =>
                        navigate("/interviewer/feedback")
                      }
                    />
                    <ArrowSquareRight
                      className="cursor-pointer"
                      size={16}
                      color="#171717"
                    />
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  data: PropTypes.array,
};

const tableHeadingAndBodyClassName = "px-4 text-left";
