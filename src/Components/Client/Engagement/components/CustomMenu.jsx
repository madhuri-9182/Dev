import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { Button, Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)({
  textTransform: "none",
  color: "#374151",
  backgroundColor: "#fff",
  border: "1px solid #979DA3",
  fontSize: "12px",
  borderRadius: "8px",
  padding: "4px 8px",
  minWidth: "130px",
  "&:hover": {
    backgroundColor: "#F9FAFB",
    borderColor: "initial",
  },
});

const StyledMenu = styled(Menu)({
  "& .MuiPaper-root": {
    borderRadius: "8px",
    boxShadow: "none",
    marginTop: "4px",
    border: "1px solid #979DA3",
    minWidth: "130px",
    "& .MuiList-root": {
      padding: "0",
    },
    "& .MuiMenuItem-root": {
      padding: "6px 16px",
      fontSize: "12px",
      color: "#374151",
      textAlign: "center",
      display: "block",
      "&:hover": {
        backgroundColor: "#F9FAFB",
      },
    },
  },
});

function CustomMenu({
  options,
  selectedOption,
  setSelectedOption,
  isUpdating,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const buttonRef = React.useRef(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusSelect = (option) => {
    setSelectedOption(option);
    handleClose();
  };

  return (
    <Box>
      <StyledButton
        loading={isUpdating}
        ref={buttonRef}
        id="status-button"
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          color: selectedOption.color,
        }}
      >
        {selectedOption.label}
      </StyledButton>
      <StyledMenu
        id="status-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(event) => event.stopPropagation()}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            onClick={() => handleStatusSelect(option)}
            selected={option === selectedOption}
            style={{ textTransform: "capitalize", color: option.color }}
          >
            {option.label}
          </MenuItem>
        ))}
      </StyledMenu>
    </Box>
  );
}

export default CustomMenu;

CustomMenu.propTypes = {
  options: PropTypes.array,
  selectedOption: PropTypes.object,
  setSelectedOption: PropTypes.func,
  isUpdating: PropTypes.bool,
};
