import PropTypes from 'prop-types';
import { Autocomplete, styled, TextField } from "@mui/material";
import { useEffect, useState, useRef } from 'react';
import axios from '../../src/api/axios';

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    height: "auto",
    minHeight: "38px",
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

function MultiSelectFilter({ label, options, filter_state_name, current_value, handleChipClick, apiEndpoint }) {
  const [fetchedOptions, setFetchedOptions] = useState(options || []);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fullyMounted = useRef(false);
  const listboxRef = useRef(null);

  useEffect(() => {
    const fetchOptions = async () => {
      if (apiEndpoint) {
        setLoading(true);
        try {
          const response = await axios.get(`${apiEndpoint}?offset=${(page-1)*10}`);
          setFetchedOptions(prev => [...prev, ...response.data.results]);
          setHasMore(response?.data?.next !== null);
        } catch (error) {
          console.error('Error fetching options:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setFetchedOptions(options);
      }
    };

    if (fullyMounted.current) {
      fetchOptions();
    }else{
      fullyMounted.current = true;
    }
  }, [apiEndpoint, options, page]);

  const handleScroll = () => {
    const listbox = listboxRef.current;
    if (listbox) {
      const { scrollTop, scrollHeight, clientHeight } = listbox;
      if (scrollTop + clientHeight >= scrollHeight - 5 && !loading && hasMore) {
        setPage((prev) => prev + 1);
      }
    }
  };

  return (<div className="flex items-center font-medium space-x-1">
    <span className="font-bold mr-2 text-xs">{label}</span>
    <Autocomplete
      isOptionEqualToValue={(option, value) =>  (apiEndpoint ? option.id : option.value) === value.value}
      disableCloseOnSelect
      multiple
      options={fetchedOptions}
      getOptionLabel={(option) => {
        return apiEndpoint ? option.domain: option.label;
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
      slotProps={{
        paper: {
          sx: {
            fontSize: 12,
          },
        },
        listbox: {
          sx: {
            maxHeight: '200px',
            overflowY: 'auto',
          },
          onScroll: handleScroll,
          ref: listboxRef,
        },
      }}
    />
  </div>);
}

MultiSelectFilter.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.array,
  filter_state_name: PropTypes.string.isRequired,
  current_value: PropTypes.array.isRequired,
  handleChipClick: PropTypes.func.isRequired,
  apiEndpoint: PropTypes.string,
};

export default MultiSelectFilter;