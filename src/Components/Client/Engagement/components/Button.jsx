import { Button as MuiButton, styled } from "@mui/material";
import React from "react";

const Button = styled(MuiButton)(({ theme }) => ({
  borderRadius: "100px",
  textTransform: "none",
  padding: "6px 12px",
}));

export default Button;
