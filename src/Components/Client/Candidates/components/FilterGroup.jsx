import PropTypes from "prop-types";
import { FaCheck } from "react-icons/fa6";
import { JOB_NAMES } from "../../../Constants/constants";

export const FilterGroup = ({
  label,
  options,
  selectedOption,
  onSelect,
}) => (
  <div className="flex items-center gap-3">
    <span className="text-2xs font-semibold w-14 min-w-14">
      {label}
    </span>
    <div className="flex items-center gap-2 flex-wrap">
      {options?.map((option, idx) => (
        <button
          key={idx}
          className={`rounded-lg px-2 font-medium py-1 text-2xs flex items-center justify-center 
                ${
                  selectedOption === option.id
                    ? "bg-[#E8DEF8] text-[#4A4459] border-0"
                    : "text-[#4A4459] border border-[#CAC4D0]"
                }`}
          onClick={() => onSelect?.(option.id)}
        >
          {selectedOption === option.id && (
            <FaCheck className="mr-2" />
          )}
          {label === "Role"
            ? JOB_NAMES.find(
                (job) => job.id === option.name
              )?.name
              ? JOB_NAMES.find(
                  (job) => job.id === option.name
                )?.name
              : option.name
            : option.name}
        </button>
      ))}
    </div>
  </div>
);

FilterGroup.propTypes = {
  label: PropTypes.string,
  options: PropTypes.array,
  selectedOption: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onSelect: PropTypes.func,
};
