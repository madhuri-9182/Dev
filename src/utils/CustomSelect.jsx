import PropTypes from "prop-types";
import { useRef, useEffect } from "react";

const CustomSelect = ({
  isDropdownOpen,
  setIsDropdownOpen,
  selectedValue,
  setSelectedValue,
  dropdownOptions,
  errors,
  type,
  setErrors,
}) => {
  const optionRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        optionRef.current &&
        !optionRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }
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
    setSelectedValue(option);
    setIsDropdownOpen(false);
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (option && newErrors[type]) {
        delete newErrors[type];
      }
      return newErrors;
    });
  };

  return (
    <div className="relative w-2/3" ref={optionRef}>
      {/* Select Box with tags */}
      <div
        className={`rounded-lg text-xs py-2 px-3 border  cursor-pointer custom-select ${
          errors[type]
            ? "border-[#B10E0EE5]"
            : "border-[#CAC4D0]"
        }`}
        onClick={() => {
          setIsDropdownOpen(!isDropdownOpen);
        }}
      >
        <span
          className={
            selectedValue
              ? "text-[#49454F]"
              : "text-gray-400"
          }
        >
          {dropdownOptions.find(
            (option) => option.id === selectedValue
          )?.name
            ? dropdownOptions.find(
                (option) => option.id === selectedValue
              )?.name
            : type === "jobRole"
            ? "Select Job Role"
            : "Select Hiring Manager"}
        </span>
      </div>
      {/* Dropdown Options */}
      {isDropdownOpen && (
        <div className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto z-10">
          {dropdownOptions.map((option, idx) => (
            <div
              key={idx}
              className="p-2 bg-white hover:bg-[#007AFF] hover:text-white cursor-pointer text-xs"
              onClick={() => handleSelect(option.id)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;

CustomSelect.propTypes = {
  isDropdownOpen: PropTypes.bool,
  setIsDropdownOpen: PropTypes.func,
  selectedValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  setSelectedValue: PropTypes.func,
  dropdownOptions: PropTypes.array,
  errors: PropTypes.object,
  type: PropTypes.string,
  setErrors: PropTypes.func,
};
