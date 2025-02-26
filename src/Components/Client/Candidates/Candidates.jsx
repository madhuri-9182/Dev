import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FilterGroup } from "./components/FilterGroup";
import useAllJobs from "../../../hooks/useFetchAllJobs";
import {
  CANDIDATE_SOURCE,
  CANDIDATE_STATUS,
  JOB_NAMES,
} from "../../Constants/constants";
import { useQuery } from "@tanstack/react-query";
import { getCandidates } from "./api";
import { Pagination } from "@mui/material";
import {
  fileToBase64,
  createFileFromUrl,
} from "../../../utils/util";
import SearchInput from "../../shared/SearchInput";

function Candidates() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: roles } = useAllJobs();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] =
    useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // Adjust delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "candidates",
      {
        page: currentPage,
        job_id: selectedRole,
        status: selectedStatus,
        q: debouncedSearchQuery,
      },
    ],
    queryFn: getCandidates,
    keepPreviousData: true,
  });

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const CANDIDATE_STATS = [
    {
      label: "Total Candidates",
      value: data?.total_candidates,
    },
    {
      label: "To be Scheduled",
      value: data?.scheduled,
    },
    {
      label: "In Process",
      value: data?.inprocess,
    },
    {
      label: "Recommended",
      value: data?.recommended,
    },
    {
      label: "Rejected",
      value: data?.rejected,
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;

  const getRoleName = (id) => {
    return JOB_NAMES.find((job) => job.id === id)?.name
      ? JOB_NAMES.find((job) => job.id === id)?.name
      : id;
  };

  const getSourceName = (id) => {
    return CANDIDATE_SOURCE.find(
      (source) => source.id === id
    )?.name
      ? CANDIDATE_SOURCE.find((source) => source.id === id)
          ?.name
      : id;
  };

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    const dateObj = new Date(`${year}-${month}-${day}`);

    const formattedDate = dateObj.toLocaleDateString(
      "en-GB",
      {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }
    );

    return formattedDate
      .replace("/", "-")
      .replace("/", "-");
  };

  const handleViewCandidate = async (person) => {
    let candidateData = {};
    candidateData.current_company = person.company;
    candidateData.specialization = person.specialization;
    candidateData.role = person.designation.id;
    candidateData.years_of_experience = {
      year: person.year,
      month: person.month,
    };
    candidateData.name = person.name;
    candidateData.source = person.source;
    candidateData.phone_number = person.phone;
    candidateData.email = person.email;
    candidateData.id = person.id;
    candidateData.status = person.status;
    candidateData.remark = person.remark;
    // from person.cv, first create the file using the given url and then change it to base64 and then psss it into candidateData;
    const file = await createFileFromUrl(person.cv);
    let fileBase64 = null;
    if (file) {
      fileBase64 = await fileToBase64(file);
    }
    candidateData.fileBase64 = fileBase64;
    candidateData.file_name = file.name;

    const uniqueKey = `candidateData-${Date.now()}`;
    localStorage.setItem(
      uniqueKey,
      JSON.stringify(candidateData)
    );

    const url = `/client/candidates/schedule-interview?key=${uniqueKey}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col gap-y-5">
      {/* Search and Add Button */}
      <div className="flex w-full justify-end items-center gap-10 ml-auto">
        {/* Search Input */}
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Add Client Button */}
        <button
          className="p-1 px-4 rounded-full text-sm font-semibold text-white w-[157px] h-[40px] 
             bg-[#007AFF] transition-all duration-300 ease-in-out
             hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] cursor-pointer"
          onClick={() =>
            navigate(`${location.pathname}/add-candidate`)
          }
        >
          + Add Candidate
        </button>
      </div>

      {/* Candidate Stats */}
      <div className="w-full grid grid-cols-5 gap-x-6 justify-evenly">
        {CANDIDATE_STATS.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 p-6 bg-[#E5ECF6] rounded-2xl"
          >
            <span className="text-xs text-[#1C1C1C] ">
              {stat.label}
            </span>
            <span className="text-2xl leading-5 text-[#171717]">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2">
        <FilterGroup
          label={"Role"}
          options={roles}
          selectedOption={selectedRole}
          onSelect={setSelectedRole}
        />
        <FilterGroup
          label={"Status"}
          options={CANDIDATE_STATUS}
          selectedOption={selectedStatus}
          onSelect={setSelectedStatus}
        />
      </div>

      <div>
        {data?.results?.length > 0 ? (
          data?.results?.map((person, index) => (
            <div key={index}>
              <hr className="bg-[F4F4F4] w-[98%] h-[1px] rounded-full" />
              <div className="w-full flex items-center justify-evenly">
                <div
                  className="w-full h-[80px] grid gap-x-5 py-3"
                  style={{
                    gridTemplateColumns:
                      "1.2fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 1.2fr",
                  }}
                >
                  {/* Name and Status */}
                  <div className="flex flex-col justify-start items-start gap-2">
                    <div
                      className="text-sm font-bold text-[#056DDC] uppercase cursor-pointer"
                      onClick={() => {
                        handleViewCandidate(person);
                      }}
                    >
                      {person.name}
                    </div>
                    <div
                      className={`text-xs text-black px-[10px] py-[3px] rounded-md text-center ${
                        person.status === "REC"
                          ? "bg-[#2ECC71]"
                          : person.status === "NREC"
                          ? "bg-[#B10E0E] text-white"
                          : person.status === "SCH"
                          ? "bg-[#DF8C0F] text-white"
                          : "bg-[#C4C4C4]"
                      }`}
                    >
                      {
                        CANDIDATE_STATUS.find(
                          (status) =>
                            status.id === person.status
                        )?.name
                      }
                    </div>
                  </div>
                  {/* Role */}
                  <div className="flex items-start justify-start py-1 text-xs text-black">
                    {getRoleName(person.designation?.name)}
                  </div>
                  {/* Type */}
                  <div className="flex items-start justify-center py-1 text-xs text-black uppercase">
                    {getSourceName(person.source)}
                  </div>
                  {/* Date */}
                  <div className="flex items-start justify-center py-1 text-sm text-black">
                    {formatDate(person.created_at)}
                  </div>
                  {/* Score */}
                  <div className="flex items-start justify-center py-1 text-sm text-black">
                    {!(
                      person.status === "SCH" ||
                      person.status === "NSCH"
                    ) && <>Score: {person.score}/500</>}
                    {person.status === "SCH" && (
                      <button className="bg-[#E8DEF8] text-[#4A4459] text-xs py-2 px-3 rounded-[100px] font-medium transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6] cursor-pointer flex justify-center items-center">
                        Reschedule
                      </button>
                    )}
                    {person.status === "NSCH" && "-"}
                  </div>
                  {/* New Column 1 */}
                  <div className="flex items-center justify-center">
                    <div className="text-sm text-black text-center">
                      {person.status === "Recommended" && (
                        <button className="ml-3 px-3 py-1 text-sm border border-gray-400 rounded-lg flex">
                          Archived
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.99992 12.4997L5.83325 8.33301H14.1666L9.99992 12.4997Z"
                              fill="#1D1B20"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  {/* New Column 2 */}
                  <div className="flex items-start justify-center py-1 text-sm text-black">
                    {person.status === "REC" ? (
                      <button className="bg-[#E8DEF8] text-[#4A4459] text-xs py-2 px-3 rounded-[100px] font-medium transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6] cursor-pointer flex justify-center items-center">
                        Push to Engagement
                      </button>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">No data found</div>
        )}
        {data?.results?.length > 0 && (
          <hr className="bg-[F4F4F4] w-[98%] h-[1px] rounded-full" />
        )}
        <Pagination
          count={Math.ceil(data?.count / 10)}
          className="mt-6 flex justify-end"
          onChange={(e, page) => handleChangePage(page)}
          variant="outlined"
          size="small"
          shape="rounded"
        />
      </div>
    </div>
  );
}

export default Candidates;
