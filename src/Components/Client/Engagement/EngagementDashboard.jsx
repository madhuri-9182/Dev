import React, {
  useEffect,
  useState,
  useDeferredValue,
  useCallback,
} from "react";
import StatsCard from "./components/StatsCard";
import Filters from "./components/Filters";
import CandidateTimeline from "./components/CandidateTimeline";
import { Add, Height, Search } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Box, debounce, TextField } from "@mui/material";
import Button from "./components/Button";
import { useEngagements, useJobs, useUpdateEngagementStatus } from "./api";
import { useNavigate } from "react-router-dom";
import { LoaderIcon } from "react-hot-toast";

const StyledSearch = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    borderRadius: "100px",
    height: "40px",
    backgroundColor: "#F4F4F4",
    fontSize: "12px",
  },
  width: "350px",

  "& fieldset": {
    border: "none",
  },
}));

function EngagementDashboard({ setSelectedEngagement }) {
  const [filters, setFilters] = useState({
    role: "all",
    function: "all",
    notice: "all",
    search: "",
  });

  const [debouncedFilters, setDebouncedFilters] = useState({
    role: "all",
    function: "all",
    notice: "all",
    search: "",
  });

  const updateDebouncedFilters = useCallback(
    debounce((filters) => {
      setDebouncedFilters(filters);
    }, 500),
    []
  );
  const { data: jobsData, isLoading: jobsLoading } = useJobs();
  const { data, isLoading, isError, error } = useEngagements(debouncedFilters);
  const [updatingEngagementId, setUpdatingEngagementId] = React.useState(null);
  const { mutate } = useUpdateEngagementStatus(filters);
  const engagements = data?.results || [];
  const jobs = jobsData?.results || [];

  const navigate = useNavigate();

  useEffect(() => {
    updateDebouncedFilters(filters);
  }, [filters]);

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

  const stats = [
    { title: "Total Candidates", value: data?.total_candidates },
    { title: "Joined", value: data?.joined },
    { title: "Declined", value: data?.declined },
    { title: "Pending", value: data?.pending },
  ];

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <Box sx={{ display: "flex", gap: 3, mb: 4, justifyContent: "right" }}>
        <StyledSearch
          placeholder="Search candidate by Name, Email & Mobile Number"
          InputProps={{ endAdornment: <Search color="#49454F" /> }}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          value={filters.search}
        />
        <Button
          startIcon={<Add />}
          sx={{
            minWidth: "180px",
            paddingBlock: 1,
            backgroundColor: "#007AFF",
            color: "white",
          }}
          variant="contained"
          onClick={() => navigate("/client/engagement/form")}
        >
          Add Candidate
        </Button>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        {stats.map((stat) => (
          <StatsCard
            isLoading={isLoading}
            key={stat.title}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </Box>

      <Filters jobs={jobs} filters={filters} onChipClick={handleChipClick} />

      {!isLoading &&
        engagements.map((engagement) => (
          <CandidateTimeline
            key={engagement.id}
            onStatusChange={(status) =>
              onEngagementStatusChange(status, engagement)
            }
            engagement={engagement}
            isUpdating={updatingEngagementId == engagement.id}
            onEngagementClick={() => onEngagementClick(engagement)}
          />
        ))}
    </div>
  );
}

export default EngagementDashboard;
