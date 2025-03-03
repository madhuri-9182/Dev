import PropTypes from "prop-types";
import CandidateRow from "./CandidateRow";

const CandidateList = ({
  candidates,
  utilities,
  candidateStatus,
  onViewCandidate,
}) => {
  if (!candidates.length) {
    return <div className="text-center">No data found</div>;
  }

  return (
    <div>
      <hr className="bg-[F4F4F4] w-[100%] h-[1px] rounded-full" />
      {candidates.map((person, index) => (
        <div key={index}>
          <CandidateRow
            candidate={person}
            utilities={utilities}
            candidateStatus={candidateStatus}
            onViewCandidate={onViewCandidate}
          />
          <hr className="bg-[F4F4F4] w-[100%] h-[1px] rounded-full" />
        </div>
      ))}
    </div>
  );
};

export default CandidateList;

CandidateList.propTypes = {
  candidates: PropTypes.array,
  utilities: PropTypes.object,
  candidateStatus: PropTypes.array,
  onViewCandidate: PropTypes.func,
};
