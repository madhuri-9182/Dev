import PropTypes from "prop-types";

const CandidateRow = ({
  candidate,
  utilities,
  candidateStatus,
  onViewCandidate,
}) => {
  const { getRoleName, getSourceName, formatDate } =
    utilities;

  return (
    <div className="w-full flex items-center justify-evenly">
      <div
        className="w-full grid gap-x-5 py-2"
        style={{
          gridTemplateColumns:
            "1.2fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 1.2fr",
        }}
      >
        {/* Name and Status */}
        <div className="flex flex-col justify-start items-start gap-2">
          <div
            className="text-xs font-bold text-[#056DDC] uppercase cursor-pointer"
            onClick={() => onViewCandidate(candidate)}
          >
            {candidate.name}
          </div>
          <StatusBadge
            status={candidate.status}
            candidateStatus={candidateStatus}
          />
        </div>

        {/* Role */}
        <div className="flex items-start justify-start py-1 text-2xs text-black">
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
          <ScoreDisplay candidate={candidate} />
        </div>

        {/* Archive Option */}
        <div className="flex items-start justify-center py-1 text-2xs text-black">
          {candidate.status === "REC" ? (
            <ArchiveButton />
          ) : (
            "-"
          )}
        </div>

        {/* Engagement Option */}
        <div className="flex items-start justify-center py-1 text-xs text-black">
          {candidate.status === "REC" ? (
            <EngagementButton />
          ) : (
            "-"
          )}
        </div>
      </div>
    </div>
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
      case "REC":
        return "bg-[#2ECC71]";
      case "NREC":
        return "bg-[#B10E0E] text-white";
      case "SCH":
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

const ScoreDisplay = ({ candidate }) => {
  if (candidate.status === "SCH") {
    return (
      <button className="bg-[#E8DEF8] text-[#4A4459] text-xs py-2 px-3 rounded-[100px] font-medium transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6] cursor-pointer flex justify-center items-center">
        Reschedule
      </button>
    );
  }

  if (candidate.status === "NSCH") {
    return "-";
  }

  return <>Score: {candidate.score}/500</>;
};

ScoreDisplay.propTypes = {
  candidate: PropTypes.object,
};

const ArchiveButton = () => (
  <button className="ml-3 px-3 py-1 text-2xs border border-gray-400 rounded-lg flex">
    Archived
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.99992 12.4997L5.83325 8.33301H14.1666L9.99992 12.4997Z"
        fill="#1D1B20"
      />
    </svg>
  </button>
);

const EngagementButton = () => (
  <button className="bg-[#E8DEF8] text-[#4A4459] text-2xs py-2 px-3 rounded-[100px] font-medium transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6] cursor-pointer flex justify-center items-center">
    Push to Engagement
  </button>
);

export default CandidateRow;
