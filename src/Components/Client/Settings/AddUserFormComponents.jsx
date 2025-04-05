import PropTypes from "prop-types";
import { Fragment } from "react";
import {
  Listbox,
  Transition,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";

export const FormField = ({
  label,
  error,
  children,
  required,
}) => (
  <div className="space-y-1">
    <label
      className={`block text-[#6B6F7B] text-2xs font-bold ${
        required ? "required-field-label" : ""
      }`}
    >
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
  required: PropTypes.bool,
};

FormField.defaultProps = {
  required: false,
};

// Input component
export const Input = ({
  type,
  value,
  onChange,
  placeholder,
  maxLength,
  error,
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    maxLength={maxLength}
    placeholder={placeholder}
    className={`w-full px-3 py-2 border rounded-lg text-2xs text-[#6B6F7B] font-medium ${
      error ? "border-[#B10E0EE5]" : "border-[#CAC4D0]"
    }`}
  />
);

Input.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  error: PropTypes.string,
};

// Custom Select
export const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder,
  type,
  errors,
}) => {
  // Find selected option
  const selectedOption =
    options.find((option) => option.id === value) || null;

  const handleChange = (option) => {
    // Format the change to match the expected onChange interface
    onChange({ target: { value: option.id } });
  };

  return (
    <Listbox value={selectedOption} onChange={handleChange}>
      {({ open }) => (
        <div className="relative w-full">
          <ListboxButton
            className={`relative w-full rounded-lg text-2xs py-2 px-3 border text-left cursor-pointer custom-select ${
              errors?.[type]
                ? "border-[#B10E0EE5]"
                : "border-[#CAC4D0]"
            }`}
          >
            <span
              className={`block truncate ${
                selectedOption
                  ? "text-[#49454F]"
                  : "text-gray-400"
              }`}
            >
              {selectedOption
                ? selectedOption.name
                : placeholder}
            </span>
          </ListboxButton>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto z-10">
              {options.map((option) => (
                <ListboxOption
                  key={option.id}
                  value={option}
                  className={({ active }) =>
                    `p-2 cursor-pointer text-2xs ${
                      active
                        ? "bg-[#007AFF] text-white"
                        : "bg-white text-[#49454F]"
                    }`
                  }
                >
                  {option.name}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      )}
    </Listbox>
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
  type: PropTypes.string,
  errors: PropTypes.object,
};
