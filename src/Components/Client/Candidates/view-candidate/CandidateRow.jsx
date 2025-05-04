import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import FinalSelectionDropdown from "./FinalSelectionDropdown";
import useAuth from "../../../../hooks/useAuth";
import { ROLES } from "../../../Constants/constants";
import { useState } from "react";
import DropCandidateModal from "../components/DropCandidateModal";

const CandidateRow = ({
  candidate,
  utilities,
  candidateStatus,
  onViewCandidate,
}) => {
  const { getRoleName, getSourceName, formatDate } =
    utilities;
  const navigate = useNavigate();
  const { auth } = useAuth();
  const isClient = ROLES.CLIENT.includes(auth?.role);
  const [archiveModalOpen, setArchiveModalOpen] =
    useState(false);
  const [selectedCandidate, setSelectedCandidate] =
    useState(null);

  return (
    <>
      <div className="w-full flex items-center justify-evenly">
        <div
          className="w-full grid gap-x-5 py-2"
          style={{
            gridTemplateColumns:
              "1fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr",
          }}
        >
          {/* Name and Status */}
          <div className="flex flex-col justify-start items-start gap-2">
            <div
              className={`text-xs font-bold text-[#056DDC] uppercase  ${
                !["CSCH", "SCH"].includes(candidate?.status)
                  ? "hover:underline cursor-pointer"
                  : ""
              }`}
              onClick={() => {
                if (
                  ["CSCH", "SCH"].includes(
                    candidate?.status
                  )
                ) {
                  return;
                }
                if (candidate?.status === "NSCH") {
                  onViewCandidate(candidate);
                } else {
                  if (isClient) {
                    navigate(
                      `/client/candidates/${candidate.id}`,
                      {
                        state: {
                          id: candidate?.interviews[
                            candidate?.interviews?.length -
                              1
                          ],
                        },
                      }
                    );
                  } else {
                    navigate(
                      `/agency/candidates/${candidate.id}`,
                      {
                        state: {
                          id: candidate?.interviews[
                            candidate?.interviews?.length -
                              1
                          ],
                        },
                      }
                    );
                  }
                }
              }}
            >
              {candidate.name}
            </div>
            <StatusBadge
              status={candidate.status}
              candidateStatus={candidateStatus}
            />
          </div>

          {/* Role */}
          <div className="flex items-start justify-center py-1 text-2xs text-black">
            {getRoleName(candidate.designation?.name)}
          </div>

          {/* Type */}
          <div className="flex items-start justify-center py-1 text-2xs text-black uppercase">
            {getSourceName(candidate.source)}
          </div>

          {/* Date */}
          <div className="flex items-start justify-center py-1 text-2xs text-black">
            {formatDate(candidate.created_at)}
          </div>

          {/* Score */}
          <div className="flex items-start justify-center py-1 text-2xs text-black">
            <ScoreDisplay
              candidate={candidate}
              onViewCandidate={onViewCandidate}
            />
          </div>

          {/* Archive Option */}
          <div className="flex items-start justify-center py-1 text-2xs text-black">
            {["REC", "HREC"].includes(candidate.status) ? (
              <FinalSelectionDropdown
                candidate={candidate}
              />
            ) : ["NREC", "SNREC", "NJ"].includes(
                candidate?.status
              ) ? (
              <button
                className="text-2xs py-2 px-3 tertiary-button font-medium"
                type="button"
                onClick={() => {
                  setSelectedCandidate(candidate?.id);
                  setArchiveModalOpen(true);
                }}
              >
                Archive
              </button>
            ) : (
              "-"
            )}
          </div>

          {/* Engagement Option */}
          <div className="flex items-start justify-center py-1 text-xs text-black">
            {candidate.final_selection_status === "SLD" ? (
              <EngagementButton candidate={candidate} />
            ) : (
              "-"
            )}
          </div>
        </div>
      </div>
      {archiveModalOpen && (
        <DropCandidateModal
          onClose={() => {
            setArchiveModalOpen(false);
            setSelectedCandidate(null);
          }}
          id={selectedCandidate}
          archiveCandidate={true}
        />
      )}
    </>
  );
};

CandidateRow.propTypes = {
  candidate: PropTypes.object,
  utilities: PropTypes.object,
  candidateStatus: PropTypes.array,
  onViewCandidate: PropTypes.func,
};

// Sub-components to improve readability
const StatusBadge = ({ status, candidateStatus }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "HREC":
        return "bg-[#27AE60]";
      case "REC":
        return "bg-[#2ECC71]";
      case "NREC":
        return "bg-[#ec1313] text-white";
      case "SNREC":
        return "bg-[#B71C1C] text-white";
      case "NJ":
        return "bg-[#00ABF0] text-white";
      case "SCH":
        return "bg-[#DF8C0F] text-white";
      case "CSCH":
        return "bg-[#DF8C0F] text-white";
      default:
        return "bg-[#C4C4C4]";
    }
  };

  const statusName =
    candidateStatus.find((s) => s.id === status)?.name ||
    status;

  return (
    <div
      className={`text-2xs text-black px-[10px] py-[3px] rounded-md text-center ${getStatusClass(
        status
      )}`}
    >
      {statusName}
    </div>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string,
  candidateStatus: PropTypes.array,
};

const ScoreDisplay = ({ candidate, onViewCandidate }) => {
  if (["CSCH", "SCH"].includes(candidate?.status)) {
    return (
      <button
        type="button"
        className="text-xs py-2 px-3 rounded-[100px] font-medium tertiary-button"
        onClick={() => {
          onViewCandidate(candidate);
        }}
      >
        Reschedule
      </button>
    );
  }

  if (candidate.status === "NSCH") {
    return "-";
  }

  return <>Score: {candidate.score}/100</>;
};

ScoreDisplay.propTypes = {
  candidate: PropTypes.object,
  onViewCandidate: PropTypes.func,
};

const EngagementButton = ({ candidate }) => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const isClient = ROLES.CLIENT.includes(auth?.role);
  if (!isClient) return "-";
  return (
    <button
      className=" text-2xs py-2 px-3 tertiary-button"
      type="button"
      onClick={() => {
        navigate("/client/engagement/form", {
          state: { candidate },
        });
      }}
    >
      Push to Engagement
    </button>
  );
};

EngagementButton.propTypes = {
  candidate: PropTypes.object,
};

export default CandidateRow;
