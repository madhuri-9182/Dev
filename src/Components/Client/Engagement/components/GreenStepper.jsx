import { Stepper, Step, StepLabel } from "@mui/material";
import { styled } from "@mui/material/styles";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import React from "react";

const StyledStepper = styled(Stepper)({
  flex: 1,
  "& .MuiStepIcon-root": {
    color: "#8F9FB8",
  },
  "& .MuiStepIcon-root.Mui-active": {
    color: "#8F9FB8",
  },
  "& .MuiStepIcon-root.Mui-completed": {
    color: "#4CAF50",
  },
  "& .MuiStepConnector-line": {
    borderColor: "#8F9FB8",
    borderWidth: 1,
  },
  "& .Mui-completed .MuiStepConnector-line": {
    borderColor: "#4CAF50",
  },
});

const GreenStepper = ({ steps }) => {
  return (
    <StyledStepper alternativeLabel>
      {steps.map((step, i) => {
        return (
          <Step completed={step.operation_complete_status === "SUC"} index={i}>
            <StepLabel></StepLabel>
          </Step>
        );
      })}
    </StyledStepper>
  );
};

export default GreenStepper;
