import { Stepper, Step, StepLabel } from "@mui/material";
import { styled } from "@mui/material/styles";
import { heIL } from "@mui/x-date-pickers/locales";
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
  "& .MuiStep-root": {
    width: "25%",
    flex: "none",
  },
});

const GreenStepper = ({ activeStep, steps }) => {
  const maxStepsToRender = 4;
  const skipSteps =
    activeStep > 0
      ? steps.length - activeStep >= maxStepsToRender
      : steps.length > maxStepsToRender;
  const remainingSteps = steps.length - activeStep;
  const skipFirstStep = activeStep > 0 && steps.length > maxStepsToRender;

  return (
    <StyledStepper
      activeStep={activeStep}
      alternativeLabel
      sx={{
        width: "100%",
        ...(skipSteps
          ? {
              "&>:last-child .MuiStepConnector-line": {
                border: "none",
                height: 3,
                background: `linear-gradient(to right, #8F9FB8 33%, rgba(255,255,255,0) 0%) bottom center / 10px 10px repeat-x`,
              },
            }
          : {}),
        ...(skipFirstStep
          ? {
              "&>:first-child .MuiStepConnector-line": {
                border: "none",
              },
            }
          : {}),
      }}
    >
      {steps.map((label, i) => {
        // Show step if:
        // 1. Remaining steps < maxStepsToRender and it's in the last maxStepsToRender steps
        // 2. It's the last step
        // 3. It's within the current window (active-1 to active+2)
        const isInLastSteps =
          remainingSteps < maxStepsToRender &&
          i >= steps.length - maxStepsToRender;
        const isLastStep = i === steps.length - 1;
        const isInCurrentWindow =
          activeStep - 1 <= i && activeStep + maxStepsToRender - 1 > i;

        return isInLastSteps || isLastStep || isInCurrentWindow ? (
          <Step key={label} index={i}>
            <StepLabel></StepLabel>
          </Step>
        ) : null;
      })}
    </StyledStepper>
  );
};

export default GreenStepper;
