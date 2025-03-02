import PropTypes from "prop-types";

const CandidateStats = ({ stats }) => {
  return (
    <div className="w-full grid grid-cols-5 gap-x-3 justify-evenly">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col gap-2 p-4 bg-[#E5ECF6] rounded-2xl"
        >
          <span className="text-2xs text-[#1C1C1C]">
            {stat.label}
          </span>
          <span className="text-xl leading-5 text-[#171717]">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CandidateStats;

CandidateStats.propTypes = {
  stats: PropTypes.array,
};
