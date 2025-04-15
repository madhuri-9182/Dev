/* eslint-disable react-refresh/only-export-components */
import { Button as MuiButton, styled } from "@mui/material";

const Button = styled(MuiButton)(() => ({
  borderRadius: "100px",
  textTransform: "none",
  padding: "6px 12px",
}));

export default Button;

export const primaryButtonStyles = {
  backgroundColor: "#007AFF",
  padding: '4px 32px',
  color: "white",
  boxShadow: "none",
  "& .MuiCircularProgress-root": {
    color: "white",
  },
  "&.Mui-disabled": {
    backgroundColor: "#cac4d0",
    cursor: 'not-allowed',
    color: "white",
  },
  "&.MuiButton-loading": {
    color: "transparent",
  },
};

export const secondaryButtonStyles = {
  border: "1px solid red",
  padding: '4px 32px',
  color: "red",
  boxShadow: "none",
  backgroundColor: "white",
  "&.MuiButton-loading": {
    color: "transparent !important",
  },
  "& .MuiCircularProgress-root": {
    color: "red",
  },
  "&.Mui-disabled": {
    opacity: 0.5,
    backgroundColor: "white",
    color: "red",
  },
};

export const tertiaryButtonStyles = {
  border: "1px solid #79747E",
  color: "#79747E",
  padding: '4px 32px',
  boxShadow: "none",
  backgroundColor: "white",
  "&.MuiButton-loading": {
    color: "transparent !important",
  },
  "& .MuiCircularProgress-root": {
    color: "#79747E",
  },
  "&.Mui-disabled": {
    opacity: 0.5,
    backgroundColor: "white",
    color: "#79747E",
  },
};
