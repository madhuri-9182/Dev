import { Box, Typography } from "@mui/material";
import React from "react";
import StatusChip from "./StatusChip";
import { NOTICE_PERIOD, SPECIALIZATION_CHOICES } from "../constants";

const StatusChips = ({ filters, onChipClick, jobs }) => {
  const handleChipClick = (type, value) => {
    onChipClick(type, value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        mb: 3,
        alignItems: "center",
      }}
    >
      <Typography fontWeight={600} fontSize={12}>
        Role
      </Typography>
      <StatusChip
        label="All"
        onClick={() => handleChipClick("role", "all")}
        checked={filters.role === "all"}
      />
      {jobs.map((item, i) => (
        <StatusChip
          onClick={() => handleChipClick("role", item.job_id)}
          label={item.name.split("_").join(" ")}
          sx={{ mr: i == jobs.length - 1 ? 3 : 0 }}
          checked={filters.role === item.job_id}
        />
      ))}

      <Typography fontWeight={600} fontSize={12}>
        Function
      </Typography>
      <StatusChip
        label="All"
        onClick={() => handleChipClick("function", "all")}
        checked={filters.function === "all"}
      />
      {SPECIALIZATION_CHOICES.map((item, i) => (
        <StatusChip
          onClick={() => handleChipClick("function", item.value)}
          label={item.label}
          sx={{ mr: i == SPECIALIZATION_CHOICES.length - 1 ? 3 : 0 }}
          checked={filters.function === item.value}
        />
      ))}

      <Typography fontWeight={600} fontSize={12}>
        Notice Period
      </Typography>

      <StatusChip
        label="All"
        onClick={() => handleChipClick("notice", "all")}
        checked={filters.notice === "all"}
      />
      {NOTICE_PERIOD.map((item) => (
        <StatusChip
          label={item.label}
          onClick={() => handleChipClick("notice", item.value)}
          checked={filters.notice === item.value}
        />
      ))}
    </Box>
  );
};

export default StatusChips;
