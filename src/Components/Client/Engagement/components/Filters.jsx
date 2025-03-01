import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import React from "react";
import { NOTICE_PERIOD, SPECIALIZATION_CHOICES } from "../constants";
import { StyledMenuItem, StyledSelect } from "./StyledSelect";
import { styled } from "@mui/material/styles";

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    height: "40px",
    borderRadius: "8px",
    fontSize: "12px",
    paddingBlock: "4px",
    minWidth: 120,

    "& input": {
      padding: "0 !important",
    },
  },
  "& .MuiChip-root": {
    height: "24px",

    fontSize: "12px",
    "& .MuiChip-deleteIcon": {
      fontSize: "14px",
    },
  },
});

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

      <Autocomplete
        slotProps={{
          paper: {
            sx: {
              fontSize: 12,
            },
          },
        }}
        multiple
        options={jobs.map((job) => ({
          value: job.id,
          name: job.name,
        }))}
        getOptionLabel={(option) => {
          return option.name.split("_").join(" ");
        }}
        filterSelectedOptions
        renderInput={(params) => (
          <StyledTextField
            {...params}
            placeholder={filters.role.length === 0 ? "All" : ""}
          />
        )}
        loading={jobs.length === 0}
        value={filters.role}
        onChange={(event, newValue) => {
          handleChipClick("role", newValue);
        }}
      />

      <Typography sx={{ marginLeft: 2 }} fontWeight={600} fontSize={12}>
        Function
      </Typography>
      <Autocomplete
        slotProps={{
          paper: {
            sx: {
              fontSize: 12,
            },
          },
        }}
        multiple
        options={SPECIALIZATION_CHOICES}
        getOptionLabel={(option) => {
          return option.label;
        }}
        filterSelectedOptions
        renderInput={(params) => (
          <StyledTextField
            {...params}
            placeholder={filters.function.length === 0 ? "All" : ""}
          />
        )}
        value={filters.function}
        onChange={(event, newValue) => {
          handleChipClick("function", newValue);
        }}
      />

      <Typography sx={{ marginLeft: 2 }} fontWeight={600} fontSize={12}>
        Notice Period
      </Typography>

      <Autocomplete
        slotProps={{
          paper: {
            sx: {
              fontSize: 12,
            },
          },
        }}
        multiple
        options={NOTICE_PERIOD}
        getOptionLabel={(option) => {
          return option.label;
        }}
        filterSelectedOptions
        renderInput={(params) => (
          <StyledTextField
            {...params}
            placeholder={filters.notice.length === 0 ? "All" : ""}
          />
        )}
        value={filters.notice}
        onChange={(event, newValue) => {
          handleChipClick("notice", newValue);
        }}
      />
    </Box>
  );
};

export default Filters;
