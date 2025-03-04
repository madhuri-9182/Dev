import PropTypes from "prop-types";
import { useRef, useEffect } from "react";

const MultiSelect = ({
  selectedRecruiters,
  setSelectedRecruiters,
  isRecruitersDropdownOpen,
  setIsRecruitersDropdownOpen,
  options,
  errors,
  setErrors,
}) => {
  const optionRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        optionRef.current &&
        !optionRef.current.contains(event.target)
      ) {
        setIsRecruitersDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (option) => {
    if (!selectedRecruiters.includes(option)) {
      setSelectedRecruiters([
        ...selectedRecruiters,
        option,
      ]);
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        if (option && newErrors.recruiters) {
          delete newErrors.recruiters;
        }
        return newErrors;
      });
    }
  };

  const removeTag = (option) => {
    setSelectedRecruiters(
      selectedRecruiters.filter((item) => item !== option)
    );
  };

  const dropdownOptions = options?.filter(
    (option) => !selectedRecruiters.includes(option.name)
  );

  return (
    <div className="relative w-2/3" ref={optionRef}>
      {/* Select Box with Tags */}
      <div
        className={`rounded-lg text-2xs ${
          selectedRecruiters.length ? "py-1" : "py-2"
        } px-3 border ${
          errors.recruiters
            ? "border-[#B10E0EE5]"
            : "border-[#CAC4D0]"
        } text-[#49454F] custom-select flex flex-wrap items-center gap-1 cursor-pointer`}
        onClick={() =>
          setIsRecruitersDropdownOpen(
            !isRecruitersDropdownOpen
          )
        }
      >
        {selectedRecruiters.length > 0 ? (
          selectedRecruiters.map((option, idx) => (
            <span
              key={idx}
              className="flex items-center justify-between bg-[#F8F8F8] text-2xs font-semibold px-2 py-1 rounded-lg border border-[#CAC4D0] text-[#49454F]"
            >
              {
                dropdownOptions?.find(
                  (dropdownOption) =>
                    dropdownOption.id === option
                )?.name
              }
              <button
                type="button"
                className="ml-1 text-[#49454F] focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(option);
                }}
              >
                ×
              </button>
            </span>
          ))
        ) : (
          <span className="text-gray-400">
            Select Recruiters
          </span>
        )}
      </div>

      {/* Dropdown Options */}
      {isRecruitersDropdownOpen &&
      dropdownOptions.length ? (
        <div className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto z-10">
          {dropdownOptions.map((option) => (
            <div
              key={option.id}
              className="p-2 bg-white hover:bg-[#007AFF] hover:text-white cursor-pointer text-2xs"
              onClick={() => handleSelect(option.id)}
            >
              {option.name}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default MultiSelect;

MultiSelect.propTypes = {
  selectedRecruiters: PropTypes.array,
  setSelectedRecruiters: PropTypes.func,
  isRecruitersDropdownOpen: PropTypes.bool,
  setIsRecruitersDropdownOpen: PropTypes.func,
  options: PropTypes.array,
  errors: PropTypes.object,
  setErrors: PropTypes.func,
};
