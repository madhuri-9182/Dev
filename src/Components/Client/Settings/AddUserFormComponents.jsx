import PropTypes from "prop-types";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export const FormField = ({ label, error, children }) => (
  <div className="space-y-1">
    <label className="block text-[#6B6F7B] text-2xs font-bold">
      {label}
    </label>
    {children}
    <p
      className={`text-[#B10E0EE5] text-[10px] ${
        error ? "visible mt-2" : "invisible"
      }`}
    >
      {error || ""}
    </p>
  </div>
);

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  children: PropTypes.node.isRequired,
};

// Input component
export const Input = ({
  type,
  value,
  onChange,
  placeholder,
  required,
  maxLength,
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    required={required}
    maxLength={maxLength}
    placeholder={placeholder}
    className="w-full px-3 py-2 border rounded-lg text-2xs text-[#6B6F7B] font-medium"
  />
);

Input.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  maxLength: PropTypes.number,
};

// Custom Select component matching the provided design
export const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder,
  type,
  errors,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] =
    useState(false);
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
  }, []);

  // Find selected option name
  const selectedOptionName = useMemo(() => {
    const selected = options.find(
      (option) => option.id === value
    );
    return selected ? selected.name : "";
  }, [options, value]);

  return (
    <div className="relative w-full" ref={optionRef}>
      {/* Select Box */}
      <div
        className={`rounded-lg text-2xs py-2 px-3 border cursor-pointer custom-select ${
          errors?.[type]
            ? "border-[#B10E0EE5]"
            : "border-[#CAC4D0]"
        }`}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span
          className={
            value ? "text-[#49454F]" : "text-gray-400"
          }
        >
          {selectedOptionName || placeholder}
        </span>
      </div>

      {/* Dropdown Options */}
      {isDropdownOpen && (
        <div className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto z-10">
          {options.map((option) => (
            <div
              key={option.id}
              className="p-2 bg-white hover:bg-[#007AFF] hover:text-white cursor-pointer text-2xs"
              onClick={() => {
                onChange({ target: { value: option.id } });
                setIsDropdownOpen(false);
              }}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

CustomSelect.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
  errors: PropTypes.object,
};
