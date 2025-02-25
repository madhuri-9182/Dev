import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useMemo, useState } from "react";

import GreenStepper from "./GreenStepper";
import CustomMenu from "./CustomMenu";
import { ENAGAGEMENT_STATUS, NOTICE_PERIOD } from "../constants";

import { findAllSteps, findEngagementActiveStep } from "../utils";

const TimelineContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "24px 5px",
  backgroundColor: "white",

  borderTop: "1px solid #E5E7EB",
  "&:last-child": {
    borderBottom: "1px solid #E5E7EB",
  },
});

const CandidateInfo = styled(Box)({
  display: "flex",
  flexDirection: "column",
  minWidth: "200px",
  gap: "10px",
  textTransform: "uppercase",
  "& .candidate-initials": {
    fontSize: "14px",
    fontWeight: 600,
    color: "#056DDC",
    lineHeight: 1,
  },
  "& .candidate-details": {
    display: "flex",
    gap: "14px",
    alignItems: "center",

    "& .role": {
      fontSize: "12px",
      color: "#000000",
      marginRight: "8px",
    },
    "& .type": {
      fontSize: "12px",
      color: "#000000",
    },
  },
});

const CandidateTimeline = ({
  engagement,
  onStatusChange,
  isUpdating,
  onEngagementClick = () => {},
}) => {
  const steps = useMemo(
    () => findAllSteps(engagement?.notice_period),
    [engagement?.notice_period]
  );

  const activeStep = useMemo(
    () => findEngagementActiveStep(engagement?.engagementoperations),
    [engagement?.engagementoperations]
  );
  const engagementStatus = useMemo(
    () =>
      ENAGAGEMENT_STATUS.find((s) => s.value === engagement?.status) ||
      ENAGAGEMENT_STATUS[0],
    [engagement?.status]
  );

  return (
    <TimelineContainer
      onClick={() => onEngagementClick && onEngagementClick(engagement)}
      className={onEngagementClick ? "cursor-pointer" : ""}
    >
      <CandidateInfo>
        <Typography className="candidate-initials">
          {engagement?.candidate_name}
        </Typography>
        <Box className="candidate-details">
          <Typography className="role">
            {engagement?.job?.name?.replace("_", " ")}
          </Typography>
          <Typography className="type">internal</Typography>
        </Box>
      </CandidateInfo>

      <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
        <GreenStepper activeStep={activeStep} steps={steps} />
      </Box>

      <CustomMenu
        options={ENAGAGEMENT_STATUS}
        selectedOption={engagementStatus}
        setSelectedOption={(opt) => {
          onStatusChange(opt.value);
        }}
        isUpdating={isUpdating}
      />
    </TimelineContainer>
  );
};

export default CandidateTimeline;
