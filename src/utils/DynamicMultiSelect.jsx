import PropTypes from "prop-types";
import { useRef, useState } from "react";

export default function DynamicMultiSelect({selectedValues, setValue, placeholder }) {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  
  // Handle adding tag
  const handleAddTag = (value) => {
    if (
      value.trim() &&
      !selectedValues.includes(value)
    ) {
      setValue(value)
    }
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      handleAddTag(inputValue.trim());
      setInputValue(""); // Clear input after adding tag
      e.preventDefault(); // Prevent form submission
    }
  };

  return (
    <div className="w-2/3 relative">
      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        className="rounded-lg text-2xs py-2 px-3 border border-[#CAC4D0] text-[#49454F] w-full"
        placeholder={`${placeholder} (Press Enter to add)`}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

DynamicMultiSelect.propTypes = {
  selectedValues: PropTypes.array.isRequired,
  setValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired
};
