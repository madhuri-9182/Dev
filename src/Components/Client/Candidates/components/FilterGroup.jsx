import PropTypes from "prop-types";
import { FaCheck } from "react-icons/fa6";
import { getJobLabel, getSpecialization } from "../../../../utils/util";

export const FilterGroup = ({
  label,
  options,
  selectedOption,
  onSelect,
  disabled = false, // Add disabled prop with default value
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
                        ? "bg-[#E8DEF8] text-[#4A4459] border border-[#E8DEF8]"
                        : "text-[#4A4459] border border-[#CAC4D0]"
                    }
                    ${
                      disabled && selectedOption !== option.id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                    ${
                      disabled && selectedOption === option.id
                        ? "opacity-90"
                        : ""
                    }`}
              onClick={() => !disabled && onSelect?.(option.id)}
              disabled={disabled}
              title={
                disabled
                  ? "This filter is locked based on the selected job"
                  : ""
              }
            >
              {selectedOption === option.id && (
                <FaCheck className="mr-2" />
              )}
              {label === "Role"
                ? `${getJobLabel(option.name)} ( ${getSpecialization(option.specialization)})`
                : option.name}
            </button>
          ))}
        </div>
      </div>
)

FilterGroup.propTypes = {
  label: PropTypes.string,
  options: PropTypes.array,
  selectedOption: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onSelect: PropTypes.func,
  disabled: PropTypes.bool, // Add PropType for disabled
};
