/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import Filters from "./components/Filters";
import CandidateTimeline from "./components/CandidateTimeline";
import { debounce } from "@mui/material";
import {
  useEngagements,
  useUpdateEngagementStatus,
  extractAllResults,
} from "./api";
import { useLocation, useNavigate } from "react-router-dom";
import AddButton from "../../shared/AddButton";
import SearchInput from "../../shared/SearchInput";
import CandidateStats from "../Candidates/view-candidate/CandidateStats";
import Empty from "../../shared/Empty";
import { LoadingState } from "../../shared/loading-error-state";
import { useInView } from "react-intersection-observer"; // Install this package if not already available

function EngagementDashboard({ setSelectedEngagement }) {
  const [filters, setFilters] = useState({
    role: [],
    function: [],
    notice: [],
    status: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedFilters, setDebouncedFilters] = useState({
    role: [],
    function: [],
    notice: [],
    status: [],
    search: "",
  });
  const [stats, setStats] = useState([
    { label: "Total Candidates", value: undefined },
    { label: "Joined", value: undefined },
    { label: "Declined", value: undefined },
    { label: "Pending", value: undefined },
  ]);
  const [updatingEngagementId, setUpdatingEngagementId] =
    useState(null);

  // Use a ref for the container
  const containerRef = useRef(null);

  // Use react-intersection-observer for infinite scrolling
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: "0px 0px 200px 0px", // Load more before reaching the end
  });

  const { state } = useLocation();
  const navigate = useNavigate();

  // Debounce filter changes
  const updateDebouncedFilters = useCallback(
    debounce((filters, searchQuery) => {
      setDebouncedFilters({
        ...filters,
        search: searchQuery,
      });
    }, 500),
    []
  );

  // Fetch engagements with infinite query
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useEngagements(debouncedFilters, state?.org_id);

  // Extract all engagements from pages
  const engagementsList = data
    ? extractAllResults(data)
    : [];

  // Update status mutation
  const { mutate } = useUpdateEngagementStatus({
    ...filters,
    search: searchQuery,
  });

  // Get roles from engagements for filters
  const roles =
    engagementsList.length > 0
      ? [
          ...new Set(
            engagementsList.map((candidate) =>
              JSON.stringify({
                id: candidate.job.id,
                name: candidate.job.name,
              })
            )
          ),
        ].map((str) => JSON.parse(str))
      : [];

  // Update debounced filters when filters change
  useEffect(() => {
    updateDebouncedFilters(filters, searchQuery);
  }, [filters, searchQuery, updateDebouncedFilters]);

  // Fetch next page when the load more element is in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    inView,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  // Update stats when data changes
  useEffect(() => {
    if (data && data.pages && data.pages.length > 0) {
      const latestData = data.pages[0];
      setStats([
        {
          label: "Total Candidates",
          value: latestData?.total_candidates,
        },
        { label: "Joined", value: latestData?.joined },
        { label: "Declined", value: latestData?.declined },
        { label: "Pending", value: latestData?.pending },
      ]);
    }
  }, [data]);

  // Handler for engagement status change
  const onEngagementStatusChange = (status, engagement) => {
    setUpdatingEngagementId(engagement.id);
    mutate(
      { engagementId: engagement.id, payload: { status } },
      { onSettled: () => setUpdatingEngagementId(null) }
    );
  };

  // Handler for filter chip click
  const handleChipClick = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  // Handler for engagement click
  const onEngagementClick = (engagement) => {
    setSelectedEngagement(engagement);
    navigate("/client/engagement/event-schedular");
  };

  // Clear selected engagement on mount
  useEffect(() => {
    setSelectedEngagement(null);
  }, []);

  // Render error state
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
        {!state?.org_id && (
          <AddButton
            label="+ Add Candidate"
            onClick={() =>
              navigate("/client/engagement/form")
            }
            className={"w-40"}
          />
        )}
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
      >
        {/* Show loading state when initially loading */}
        {isLoading && engagementsList.length === 0 ? (
          <LoadingState />
        ) : (
          <>
            {/* Render engagements list */}
            {engagementsList.map((engagement) => (
              <CandidateTimeline
                key={engagement.id}
                onStatusChange={(status) =>
                  onEngagementStatusChange(
                    status,
                    engagement
                  )
                }
                engagement={engagement}
                isUpdating={
                  updatingEngagementId === engagement.id
                }
                onEngagementClick={() =>
                  onEngagementClick(engagement)
                }
                org_id={state?.org_id}
              />
            ))}

            {/* Show empty state when no data */}
            {!isLoading && engagementsList.length === 0 && (
              <Empty description="No data found" />
            )}

            {/* Add a load more trigger that becomes visible when scrolling */}
            {hasNextPage && (
              <div
                ref={loadMoreRef}
                className="h-10 flex items-center justify-center"
              >
                {isFetchingNextPage ? (
                  <span className="text-sm text-[#007aff] font-semibold">
                    Loading ...
                  </span>
                ) : (
                  ""
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

EngagementDashboard.propTypes = {
  setSelectedEngagement: PropTypes.func,
};

export default EngagementDashboard;
