import PropTypes from "prop-types";
import { useState } from "react";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ArrowSquareRight,
  Eye,
  MessageText1,
  ReceiveSquare,
  TickSquare,
} from "iconsax-react";

// Utilities
import {
  createFileFromUrl,
  handleFileDownload,
} from "../../../../utils/util";
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
  },
}));

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
  title,
  meet_link,
}) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] =
    useState(false);
  const isPendingFeedback = title === "Pending Feedback";
  const isInterviewHistory = title === "Interview History";
  const isAcceptedInterviews =
    title === "Accepted Interviews";

  if (isInterviewHistory) {
    return null;
  }

  return (
    <>
      <Button
        Icon={ReceiveSquare}
        disabled={false}
        onClick={async () => {
          const file = await createFileFromUrl(
            candidate.cv
          );
          // download the file
          handleFileDownload(file);
        }}
        title={"Download"}
      />
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
            navigate(
              `/interviewer/feedback/${candidate.id}`
            );
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
          disabled={false}
          title="Start"
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
};
