import PropTypes from "prop-types";
import CandidateRow from "./CandidateRow";
import Empty from "../../../shared/Empty";

const CandidateList = ({
  candidates,
  utilities,
  candidateStatus,
  onViewCandidate,
}) => {
  if (!candidates.length) {
    return (
      <Empty description="No candidates found" />
    );
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
