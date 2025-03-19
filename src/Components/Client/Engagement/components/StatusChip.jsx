import { Chip } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import PropTypes from "prop-types";

const StatusChip = ({ label, checked, sx = {}, onClick = () => {} }) => {
  const chipStyles = {
    background: !checked ? "white" : "#E8DEF8",
    color: "#49454F",
    borderColor: checked ? "#E8DEF8" : "#CAC4D0",
    borderRadius: 2,
    "& .MuiChip-icon": {
      color: "#49454F",
    },
    paddingInline: "4px",
  };

  return (
    <Chip
      variant="outlined"
      label={label}
      color="secondary"
      icon={checked ? <DoneIcon style={{ fontSize: 14 }} /> : null}
      sx={{
        ...chipStyles,
        ...sx,
      }}
      onClick={onClick}
    />
  );
};

export default StatusChip;

StatusChip.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool,
  sx: PropTypes.object,
  onClick: PropTypes.func,
};
