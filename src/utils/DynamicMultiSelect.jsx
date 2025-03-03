import PropTypes from "prop-types";
import { useRef } from "react";

export default function DynamicMultiSelect({
  inputValue,
  handleAddTag,
  setInputValue,
}) {
  const inputRef = useRef(null);

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
        placeholder="Essential Skills (Press Enter to add)"
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
  inputValue: PropTypes.string,
  handleAddTag: PropTypes.func,
  setInputValue: PropTypes.func,
};
