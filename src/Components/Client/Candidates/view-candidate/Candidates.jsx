import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@mui/material";

// Components
import SearchInput from "../../../shared/SearchInput";
import CandidateList from "./CandidateList";
import CandidateStats from "./CandidateStats";
import {
  LoadingState,
  ErrorState,
} from "../../../shared/loading-error-state";

// Hooks and utilities
import {
  fileToBase64,
  createFileFromUrl,
  getJobLabel,
  getErrorMessage,
} from "../../../../utils/util";
import { useDebounce } from "../../../../hooks/useDebounce";

// API and constants
import { getCandidates } from "../api";
import {
  CANDIDATE_SOURCE,
  CANDIDATE_STATUS,
  JOB_NAMES,
} from "../../../Constants/constants";
import useAllCandidates from "../../../../hooks/useFetchAllCandidates";
import { CandidateFilters } from "./CandidateFilters";
import AddButton from "../../../shared/AddButton";

function Candidates() {
  const { state } = useLocation();

  const navigate = useNavigate();
  const { data: candidates } = useAllCandidates();
  const roles = candidates
    ? [
        ...new Set(
          candidates.map((candidate) =>
            JSON.stringify({
              id: candidate.designation.id,
              name: candidate.designation.name,
            })
          )
        ),
      ].map((str) => JSON.parse(str))
    : [];

  const status = state?.status || "All";

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState(status);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRole, selectedStatus, searchQuery]);

  // Debounce search query to prevent excessive API calls
  const debouncedSearchQuery = useDebounce(
    searchQuery,
    500
  );

  // Fetch candidates data
  const { data, isLoading, isError, error } = useQuery({
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

  // Handle candidate selection for detailed view
  const handleViewCandidate = async (person) => {
    try {
      // Build candidate data structure
      const candidateData = {
        current_company: person.company,
        current_designation: person.current_designation,
        specialization: person.specialization,
        role: person.designation.id,
        years_of_experience: {
          year: person.year,
          month: person.month,
        },
        name: person.name,
        source: person.source,
        phone_number: person.phone,
        email: person.email,
        id: person.id,
        status: person.status,
        remark: person.remark,
        last_scheduled_initiate_time:
          person.last_scheduled_initiate_time,
      };

      // Process CV file
      const file = await createFileFromUrl(person.cv);
      if (file) {
        const fileBase64 = await fileToBase64(file);
        candidateData.fileBase64 = fileBase64;
        candidateData.file_name = file.name;
      }

      localStorage.clear();

      // Store data in localStorage with unique key
      const uniqueKey = `candidateData-${Date.now()}`;
      localStorage.setItem(
        uniqueKey,
        JSON.stringify(candidateData)
      );

      const url = `/client/candidates/schedule-interview?key=${uniqueKey}`;
      navigate(url);
    } catch (error) {
      console.error(
        "Error processing candidate data:",
        error
      );
    }
  };

  // Prepare stats for display
  const candidateStats = [
    {
      label: "Total Candidates",
      value: data?.total_candidates,
    },
    { label: "Scheduled", value: data?.scheduled },
    { label: "In Process", value: data?.inprocess },
    { label: "Recommended", value: data?.recommended },
    { label: "Rejected", value: data?.rejected },
  ];

  // Utility functions for display
  const utilities = {
    getRoleName: (id) => {
      const job = JOB_NAMES.find((job) => job.id === id);
      return job?.name || id;
    },
    getSourceName: (id) => {
      const source = CANDIDATE_SOURCE.find(
        (source) => source.id === id
      );
      return source?.name || id;
    },
    formatDate: (dateStr) => {
      const [day, month, year] = dateStr.split("/");
      const dateObj = new Date(`${year}-${month}-${day}`);
      return dateObj
        .toLocaleDateString("en-GB", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })
        .replace("/", "-")
        .replace("/", "-");
    },
  };

  const handleResetFilters = () => {
    setSelectedRole("");
    setSelectedStatus("All");
    setSearchQuery("");
  };

  if (isLoading) return <LoadingState />;
  if (isError)
    return <ErrorState message={getErrorMessage(error)} />;

  return (
    <div className="flex flex-col gap-y-5 px-3">
      {/* Header: Search and Add Button */}
      <div className="flex w-full justify-end items-center gap-4 ml-auto">
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <AddButton
          onClick={() =>
            navigate(`${location.pathname}/add-candidate`)
          }
          label="+ Add Candidate"
          className={"w-40"}
        />
      </div>

      {/* Candidate Statistics */}
      <CandidateStats stats={candidateStats} />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-36">
          <CandidateFilters
            value={selectedRole}
            onChange={setSelectedRole}
            options={[
              { id: "", name: "All Roles" },
              ...roles,
            ]}
            placeholder="All Roles"
            displayValue={
              selectedRole
                ? getJobLabel(
                    roles.find((r) => r.id === selectedRole)
                      ?.name
                  )
                : "All Roles"
            }
          />
        </div>

        {/* Status Filter */}
        <div className="min-w-36">
          <CandidateFilters
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={[...CANDIDATE_STATUS]}
            placeholder="All Status"
            displayValue={
              CANDIDATE_STATUS.find(
                (status) => status.id === selectedStatus
              )?.name || "All Status"
            }
          />
        </div>
        <button
          className="text-xs font-semibold text-[#4A4459] hover:text-[#007AFF] bg-transparent py-1 flex items-center"
          onClick={handleResetFilters}
        >
          Reset Filters
        </button>
      </div>

      {/* Candidate List */}
      <CandidateList
        candidates={data?.results || []}
        utilities={utilities}
        candidateStatus={CANDIDATE_STATUS}
        onViewCandidate={handleViewCandidate}
      />

      {/* Pagination */}
      {data?.results?.length > 0 && (
        <>
          <Pagination
            count={Math.ceil(data?.count / 10)}
            className="mt-3 flex justify-end"
            onChange={(e, page) => setCurrentPage(page)}
            variant="outlined"
            size="small"
            shape="rounded"
            page={currentPage}
          />
        </>
      )}
    </div>
  );
}

export default Candidates;
