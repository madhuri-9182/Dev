/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import { useEffect, useState, useCallback } from "react";
import Filters from "./components/Filters";
import CandidateTimeline from "./components/CandidateTimeline";
import { debounce } from "@mui/material";
import {
  useEngagements,
  useJobs,
  useUpdateEngagementStatus,
} from "./api";
import { useLocation, useNavigate } from "react-router-dom";
import AddButton from "../../shared/AddButton";
import SearchInput from "../../shared/SearchInput";
import CandidateStats from "../Candidates/view-candidate/CandidateStats";
import Empty from "../../shared/Empty";

function EngagementDashboard({ setSelectedEngagement }) {
  const [filters, setFilters] = useState({
    role: [],
    function: [],
    notice: [],
  });
  const [searchQuery, setSearchQuery] = useState("");

  const [debouncedFilters, setDebouncedFilters] = useState({
    role: [],
    function: [],
    notice: [],
    search: "",
  });

  const { state } = useLocation();

  const updateDebouncedFilters = useCallback(
    debounce((filters, searchQuery) => {
      setDebouncedFilters({
        ...filters,
        search: searchQuery,
      });
    }, 500),
    []
  );
  const { data: jobsData } = useJobs(state?.org_id);
  const { data, isLoading, isError, error } =
    useEngagements(debouncedFilters, state?.org_id);
  const [updatingEngagementId, setUpdatingEngagementId] =
    useState(null);
  const { mutate } = useUpdateEngagementStatus({
    ...filters,
    search: searchQuery,
  });
  const engagements = data?.results || [];
  const jobs = jobsData?.results || [];

  const navigate = useNavigate();

  useEffect(() => {
    updateDebouncedFilters(filters, searchQuery);
  }, [filters, searchQuery, updateDebouncedFilters]);

  const onEngagementStatusChange = (status, engagement) => {
    setUpdatingEngagementId(engagement.id);
    mutate(
      {
        engagementId: engagement.id,
        payload: { status },
      },
      {
        onSettled: () => setUpdatingEngagementId(null),
      }
    );
  };
  const handleChipClick = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };
  const onEngagementClick = (engagement) => {
    setSelectedEngagement(engagement);
    navigate("/client/engagement/event-schedular");
  };

  useEffect(() => {
    setSelectedEngagement(null);
  }, []);

  const [stats, setStats] = useState([
    { label: "Total Candidates", value: undefined },
    { label: "Joined", value: undefined },
    { label: "Declined", value: undefined },
    { label: "Pending", value: undefined },
  ]);

  useEffect(() => {
    if (data) {
      setStats([
        {
          label: "Total Candidates",
          value: data?.total_candidates,
        },
        { label: "Joined", value: data?.joined },
        { label: "Declined", value: data?.declined },
        { label: "Pending", value: data?.pending },
      ]);
    }
  }, [data]);

  if (isError) {
    return (
      <div className="p-4 text-red-600">
        Error: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        Loading engagements...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-5 px-3">
      <div className="flex w-full justify-end items-center gap-4 ml-auto">
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        {!state?.org_id && <AddButton
          label="+ Add Candidate"
          onClick={() =>
            navigate("/client/engagement/form")
          }
          className={"w-40"}
        />}
      </div>

      <CandidateStats stats={stats} title={"engagement"} />

      <Filters
        jobs={jobs}
        filters={filters}
        onChipClick={handleChipClick}
      />

      {engagements.length > 0 ? (
        engagements.map((engagement) => (
          <CandidateTimeline
            key={engagement.id}
            onStatusChange={(status) =>
              onEngagementStatusChange(status, engagement)
            }
            engagement={engagement}
            isUpdating={updatingEngagementId == engagement.id}
            onEngagementClick={() =>
              onEngagementClick(engagement)
            }
            org_id={state?.org_id}
          />
        ))
      ): (
        <Empty description="No data found" />
      )}
    </div>
  );
}

EngagementDashboard.propTypes = {
  setSelectedEngagement: PropTypes.func,
};

export default EngagementDashboard;
