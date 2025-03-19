/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import { useEffect, useState, useCallback, useRef } from "react";
import Filters from "./components/Filters";
import CandidateTimeline from "./components/CandidateTimeline";
import { debounce } from "@mui/material";
import {
  useEngagements,
  useUpdateEngagementStatus,
} from "./api";
import { useLocation, useNavigate } from "react-router-dom";
import AddButton from "../../shared/AddButton";
import SearchInput from "../../shared/SearchInput";
import CandidateStats from "../Candidates/view-candidate/CandidateStats";
import Empty from "../../shared/Empty";
import { LoadingState } from "../../shared/loading-error-state";
import useAllEngagements from "../../../hooks/useFetchAllEngagements";

function EngagementDashboard({ setSelectedEngagement }) {
  const [filters, setFilters] = useState({
    role: [],
    function: [],
    notice: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [engagementsList, setEngagementsList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);
  const [stats, setStats] = useState([
    { label: "Total Candidates", value: undefined },
    { label: "Joined", value: undefined },
    { label: "Declined", value: undefined },
    { label: "Pending", value: undefined },
  ]);

  const [debouncedFilters, setDebouncedFilters] = useState({
    role: [],
    function: [],
    notice: [],
    search: "",
  });

  const { state } = useLocation();
  const navigate = useNavigate();

  const updateDebouncedFilters = useCallback(
    debounce((filters, searchQuery) => {
      setDebouncedFilters({
        ...filters,
        search: searchQuery,
      });
    }, 500),
    []
  );
  const {data: allEngagements} = useAllEngagements();
  const { data, isLoading, isError, error } = useEngagements({ ...debouncedFilters, offset }, state?.org_id);
  const [updatingEngagementId, setUpdatingEngagementId] = useState(null);
  const { mutate } = useUpdateEngagementStatus({
    ...filters,
    search: searchQuery,
  });
  const roles = allEngagements
    ? [
        ...new Set(
          allEngagements.map((candidate) =>
            JSON.stringify({
              id: candidate.job.id,
              name: candidate.job.name,
            })
          )
        ),
      ].map((str) => JSON.parse(str))
    : [];

  useEffect(() => {
    updateDebouncedFilters(filters, searchQuery);
  }, [filters, searchQuery, updateDebouncedFilters]);

  useEffect(() => {
    // Reset offset and engagements when filters or search query changes
    if (searchQuery || filters.role.length > 0 || filters.function.length > 0 || filters.notice.length > 0) {
      setOffset(0);
      setEngagementsList([]);
      setHasMore(true);
    }
  }, [debouncedFilters]);

  useEffect(() => {
    // Update data when it changes
    if (data) {
      if (offset === 0) {
        setEngagementsList(data?.results || []);
      } else {
        setEngagementsList(prev => [...prev, ...(data?.results || [])]);
      }
      setHasMore(data?.next !== null);

      // Update stats
      setStats([
        { label: "Total Candidates", value: data?.total_candidates },
        { label: "Joined", value: data?.joined },
        { label: "Declined", value: data?.declined },
        { label: "Pending", value: data?.pending },
      ]);
    }
  }, [data, offset]);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
      if (scrollHeight - scrollTop <= clientHeight + 20 && !isLoading && hasMore) {
        setOffset(prev => prev + 10);
      }
    }
  }, [isLoading, hasMore]);

  const onEngagementStatusChange = (status, engagement) => {
    setUpdatingEngagementId(engagement.id);
    mutate(
      { engagementId: engagement.id, payload: { status } },
      { onSettled: () => setUpdatingEngagementId(null) }
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

  if (isError) {
    return (
      <div className="p-4 text-red-600">
        Error: {error.message}
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
          onClick={() => navigate("/client/engagement/form")}
          className={"w-40"}
        />}
      </div>

      <CandidateStats stats={stats} title={"engagement"} />

      <Filters
        jobs={roles}
        filters={filters}
        onChipClick={handleChipClick}
      />

      <div
        ref={containerRef}
        className="overflow-y-auto max-h-[400px] flex flex-col"
        onScroll={handleScroll}
      >
        {isLoading && offset === 0 ? (
          <LoadingState />
        ) : (
          engagementsList.map((engagement) => (
            <CandidateTimeline
              key={engagement.id}
              onStatusChange={(status) =>
                onEngagementStatusChange(status, engagement)
              }
              engagement={engagement}
              isUpdating={updatingEngagementId === engagement.id}
              onEngagementClick={() => onEngagementClick(engagement)}
              org_id={state?.org_id}
            />
          ))
        )}

        {isLoading && offset > 0 && (
          <div className="flex justify-center p-4">
            Loading more engagements...
          </div>
        )}

        {!isLoading && engagementsList.length === 0 && (
          <Empty description="No data found" />
        )}
      </div>
    </div>
  );
}

EngagementDashboard.propTypes = {
  setSelectedEngagement: PropTypes.func,
};

export default EngagementDashboard;