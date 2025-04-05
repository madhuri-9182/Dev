import PropTypes from "prop-types";
import { useState } from "react";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ArrowSquareRight,
  Eye,
  MessageText1,
  TickSquare,
} from "iconsax-react";

// Utilities
import ViewModal from "./ViewModal";

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
    slotProps={{
      popper: {
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, -10],
            },
          },
        ],
      },
    }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "#056DDC",
    boxShadow: theme.shadows[1],
    fontSize: 11,
    maxWidth: 200,
    textAlign: "center",
  },
}));

/**
 * Helper function to check if the meeting link should be enabled
 * Only enable the link 1 hour before the scheduled time
 */
const isMeetingLinkEnabled = (scheduledTimeStr) => {
  if (!scheduledTimeStr) return false;

  // Parse the scheduled time string (format: "DD/MM/YYYY HH:MM:SS")
  const [datePart, timePart] = scheduledTimeStr.split(" ");
  const [day, month, year] = datePart.split("/");
  const [hours, minutes, seconds] = timePart.split(":");

  // Create Date objects for scheduled time and current time
  const scheduledTime = new Date(
    year,
    month - 1,
    day,
    hours,
    minutes,
    seconds
  );
  const currentTime = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = scheduledTime - currentTime;

  // Convert 1 hour to milliseconds
  const oneHourInMs = 60 * 60 * 1000;

  // Enable the link if current time is within 1 hour before the scheduled time
  // or any time after the scheduled time (for late meetings)
  return (
    timeDifference <= oneHourInMs &&
    timeDifference > -24 * oneHourInMs
  ); // Allow access up to 24 hours after scheduled time
};

/**
 * buttons component for Action Buttons
 */
const Button = ({ Icon, onClick, disabled, title }) => (
  <LightTooltip title={title} placement="top">
    <button
      onClick={onClick}
      className="cursor-pointer w-6 h-6 flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-transparent disabled:text-[#171717] text-[#171717] hover:bg-[#056DDC] hover:text-white rounded-full"
      disabled={disabled}
    >
      <Icon size={16} />
    </button>
  </LightTooltip>
);

Button.propTypes = {
  Icon: PropTypes.object,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  title: PropTypes.string,
};

/**
 * Action buttons component for table rows
 */
export const ActionButtons = ({
  navigate,
  candidate,
  id,
  title,
  meet_link,
  scheduled_time,
}) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] =
    useState(false);
  const isPendingFeedback = title === "Pending Feedback";
  const isInterviewHistory = title === "Interview History";
  const isAcceptedInterviews =
    title === "Accepted Interviews";

  const isMeetLinkEnabled =
    isAcceptedInterviews &&
    isMeetingLinkEnabled(scheduled_time);

  // Generate appropriate tooltip message based on link status
  const getMeetingButtonTooltip = () => {
    if (!meet_link) return "No meeting link available";
    if (!isMeetLinkEnabled)
      return "Meeting access unlocks 1 hour before interview time";
    return "Start";
  };

  if (isInterviewHistory) {
    return null;
  }

  return (
    <>
      <Button
        Icon={Eye}
        onClick={() => {
          setIsDetailsModalOpen(true);
        }}
        disabled={false}
        title="View"
      />
      {isAcceptedInterviews && (
        <Button
          Icon={TickSquare}
          onClick={() => {}}
          disabled={true}
          title="Accept"
        />
      )}
      <Button
        disabled={isAcceptedInterviews}
        Icon={MessageText1}
        onClick={() => {
          if (isPendingFeedback) {
            navigate(`/interviewer/feedback/${id}`);
          }
        }}
        title="Feedback"
      />
      {isAcceptedInterviews && (
        <Button
          Icon={ArrowSquareRight}
          onClick={() => {
            window.open(meet_link, "_blank");
          }}
          disabled={!meet_link || !isMeetLinkEnabled}
          title={getMeetingButtonTooltip()}
        />
      )}
      {isDetailsModalOpen && (
        <ViewModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          details={candidate?.designation?.other_details}
        />
      )}
    </>
  );
};

ActionButtons.propTypes = {
  navigate: PropTypes.func.isRequired,
  candidate: PropTypes.object,
  title: PropTypes.string,
  meet_link: PropTypes.string,
  setIsDetailsModalOpen: PropTypes.func,
  scheduled_time: PropTypes.string,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};
