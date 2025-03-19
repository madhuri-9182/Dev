import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { NOTICE_PERIOD, SPECIALIZATION_CHOICES } from "../constants";
import { styled } from "@mui/material/styles";

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    height: "34px",
    borderRadius: "8px",
    fontSize: "12px",
    paddingBlock: "4px",
    minWidth: 200,

    "& input": {
      padding: "0 !important",
    },
  },
  "& .MuiChip-root": {
    height: "20px",

    fontSize: "11px",
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

        alignItems: "center",
        "& > div": {
          marginRight: "20px",
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 1,
        },
        "& .MuiTypography-root": {
          margin: 0,
        },
      }}
    >
      <Box>
        <Typography fontWeight={600} fontSize={12}>
          Role
        </Typography>
        <Autocomplete
          disableCloseOnSelect
          slotProps={{
            paper: {
              sx: {
                fontSize: 11,
              },
            },
          }}
          multiple
          filterSelectedOptions
          options={jobs.map((job) => ({
            value: job.id,
            label: job.name,
          }))}
          getOptionLabel={(option) => {
            return option.label.split("_").join(" ");
          }}
          isOptionEqualToValue={(option, value) => option.value === value.value}
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
      </Box>

      <Box>
        <Typography sx={{ marginLeft: 2 }} fontWeight={600} fontSize={12}>
          Function
        </Typography>
        <Autocomplete
          isOptionEqualToValue={(option, value) => option.value === value.value}
          disableCloseOnSelect
          slotProps={{
            paper: {
              sx: {
                fontSize: 11,
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
      </Box>

      <Box>
        <Typography sx={{ marginLeft: 2 }} fontWeight={600} fontSize={12}>
          Notice Period
        </Typography>

        <Autocomplete
          isOptionEqualToValue={(option, value) => option.value === value.value}
          disableCloseOnSelect
          slotProps={{
            paper: {
              sx: {
                fontSize: 11,
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
    </Box>
  );
};

export default Filters;

Filters.propTypes = {
  filters: PropTypes.object,
  onChipClick: PropTypes.func,
  jobs: PropTypes.array,
};
