import PropTypes from "prop-types";

/**
 * Section heading component with count badge
 */
const Heading = ({ title, count }) => (
  <div className="flex items-center gap-x-2">
    <h1 className="text-[#1C1C1C] font-semibold text-sm">
      {title}
    </h1>
    <span className="text-white w-7 h-7 text-2xs bg-[#056DDC] rounded-full flex items-center justify-center">
      {count}
    </span>
  </div>
);

Heading.propTypes = {
  title: PropTypes.string,
  count: PropTypes.number,
};

export default Heading;
