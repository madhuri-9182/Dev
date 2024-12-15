import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Popper from '@mui/material/Popper';
import { styled } from '@mui/material/styles';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// Styling the Popper component to adjust dropdown size and item height
const StyledPopper = styled(Popper)(({ theme }) => ({
    '& .MuiAutocomplete-listbox': {
        position: 'absolute',
        top: '100% !important',
        left: 0,
        right: 0,
        zIndex: 1300,
        backgroundColor: 'white',
        maxHeight: '200px', // Limit the height of the dropdown
        overflowY: 'auto',  // Make it scrollable if content exceeds maxHeight
        fontSize: '12px',   // Reduce the font size of the options
        padding: '2px 0',   // Adjust padding to reduce space between items
    },
    '& .MuiAutocomplete-option': {
        padding: '16px 12px', // Increase padding to adjust item height
        height: '30px',       // Set a fixed height for each option
        display: 'flex',      // Ensure proper alignment
        alignItems: 'center', // Center-align content
    },
}));

export default function CheckboxesTags({ label, placeholder, onChange, values = [] }) {
    return (
        <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={values} // Ensure the `options` prop is passed correctly
            disableCloseOnSelect
            getOptionLabel={(option) => option.title} // Ensure `title` is being used as the label
            PopperComponent={StyledPopper}
            renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                    <li key={key} {...optionProps}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.title}
                    </li>
                );
            }}
            style={{ width: 360 }}
            renderInput={(params) => (
                <TextField {...params} label={label} placeholder={placeholder} />
            )}
        />
    );
}
