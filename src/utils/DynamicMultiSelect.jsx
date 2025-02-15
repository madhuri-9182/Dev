import PropTypes from "prop-types";
import { useRef, useEffect } from "react";

const predefinedOptions = [
  "Java",
  "OOPS",
  "Springboot",
  "React.js",
  "AWS",
  "Kafka",
];

export default function DynamicMultiSelect({
  inputValue,
  isEssentialSkillsDropdownOpen,
  handleAddTag,
  setIsEssentialSkillsDropdownOpen,
  setInputValue,
}) {
  const dropdownRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue) {
      handleAddTag(inputValue);
      e.preventDefault(); // Prevent form submission
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsEssentialSkillsDropdownOpen(false);
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

  return (
    <div className="w-2/3 relative" ref={dropdownRef}>
      {/* Input Field */}
      <input
        type="text"
        className="rounded-lg text-xs py-2 px-3 border border-[#CAC4D0] text-[#49454F] w-full custom-select"
        placeholder="Select Essential Skills"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        onClick={() => {
          setIsEssentialSkillsDropdownOpen(
            !isEssentialSkillsDropdownOpen
          );
        }}
        onKeyDown={handleKeyDown}
      />

      {/* Dropdown Options */}
      {isEssentialSkillsDropdownOpen && (
        <ul className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto z-10">
          {predefinedOptions
            .filter((option) =>
              option
                .toLowerCase()
                .includes(inputValue.toLowerCase())
            )
            .map((option) => (
              <li
                key={option}
                className="p-2 bg-white hover:bg-[#007AFF] hover:text-white cursor-pointer text-xs"
                onClick={() => handleAddTag(option)}
              >
                {option}
              </li>
            ))}
          {inputValue &&
            !predefinedOptions.includes(inputValue) && (
              <li
                className="p-2 bg-white hover:bg-[#007AFF] hover:text-white cursor-pointer text-xs"
                onClick={() => handleAddTag(inputValue)}
              >
                Add {inputValue}
              </li>
            )}
        </ul>
      )}
    </div>
  );
}

DynamicMultiSelect.propTypes = {
  inputValue: PropTypes.string,
  isEssentialSkillsDropdownOpen: PropTypes.bool,
  handleAddTag: PropTypes.func,
  setIsEssentialSkillsDropdownOpen: PropTypes.func,
  setInputValue: PropTypes.func,
};
