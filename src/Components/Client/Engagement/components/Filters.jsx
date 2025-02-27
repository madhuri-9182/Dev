import { Box, Typography } from "@mui/material";
import React from "react";
import { NOTICE_PERIOD, SPECIALIZATION_CHOICES } from "../constants";
import { StyledMenuItem, StyledSelect } from "./StyledSelect";

const Filters = ({ filters, onChipClick, jobs }) => {
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
      <StyledSelect
        value={filters.role}
        onChange={(e) => handleChipClick("role", e.target.value)}
      >
        <StyledMenuItem value="all">All</StyledMenuItem>
        {jobs.map((item) => (
          <StyledMenuItem key={item.id} value={item.id}>
            {item.name.split("_").join(" ")}
          </StyledMenuItem>
        ))}
      </StyledSelect>

      <Typography sx={{ marginLeft: 2 }} fontWeight={600} fontSize={12}>
        Function
      </Typography>
      <StyledSelect
        value={filters.function}
        onChange={(e) => handleChipClick("function", e.target.value)}
      >
        <StyledMenuItem value="all">All</StyledMenuItem>
        {SPECIALIZATION_CHOICES.map((item, i) => (
          <StyledMenuItem key={i} value={item.value}>
            {item.label}
          </StyledMenuItem>
        ))}
      </StyledSelect>

      <Typography sx={{ marginLeft: 2 }} fontWeight={600} fontSize={12}>
        Notice Period
      </Typography>
      <StyledSelect
        value={filters.notice}
        onChange={(e) => handleChipClick("notice", e.target.value)}
      >
        <StyledMenuItem value="all">All</StyledMenuItem>
        {NOTICE_PERIOD.map((item, i) => (
          <StyledMenuItem key={i} value={item.value}>
            {item.label}
          </StyledMenuItem>
        ))}
      </StyledSelect>
    </Box>
  );
};

export default Filters;
