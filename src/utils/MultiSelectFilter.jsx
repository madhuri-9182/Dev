import PropTypes from 'prop-types';
import { Autocomplete, styled, TextField } from "@mui/material";

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    height: "40px",
    borderRadius: "8px",
    fontSize: "12px",
    paddingBlock: "4px",
    minWidth: 200,

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

function MultiSelectFilter({ label, options, filter_state_name, current_value, handleChipClick }) {
  return (<div className="flex items-center font-medium space-x-1">
    <span className="font-bold mr-2">{label}</span>
    <Autocomplete
      isOptionEqualToValue={(option, value) => option.value === value.value}
      disableCloseOnSelect
      slotProps={{
        paper: {
          sx: {
            fontSize: 12,
          },
        },
      }}
      multiple
      options={options}
      getOptionLabel={(option) => {
        return option.label;
      }}
      filterSelectedOptions
      renderInput={(params) => (
        <StyledTextField
          {...params}
          placeholder={current_value?.length === 0 ? "All" : ""}
        />
      )}
      value={current_value}
      onChange={(event, newValue) => {
        handleChipClick(filter_state_name, newValue);
      }}
    />
  </div>);
}

MultiSelectFilter.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })).isRequired,
  filter_state_name: PropTypes.string.isRequired,
  current_value: PropTypes.array.isRequired,
  handleChipClick: PropTypes.func.isRequired
};

export default MultiSelectFilter;