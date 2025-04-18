import React from "react";
import PropTypes from "prop-types";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "lucide-react";

// Reusable Form Components
export const FormSection = ({
  title,
  subtitle,
  icon,
  children,
}) => {
  return (
    <div className="grid grid-cols-[3.5fr_8.5fr] mb-10">
      <div className="flex justify-between">
        <div className="flex flex-col gap-y-1 mr-3">
          <h2 className="text-lg font-bold bg-gradient-to-r from-black to-[#E41616] text-transparent bg-clip-text">
            {title}
          </h2>
          <p className="text-[#000000A1] text-sm mb-6">
            {subtitle}
          </p>
        </div>
        <div className="flex flex-col items-center pr-8">
          <div className="bg-[#E6D3D3] rounded-full p-2 w-12 h-12 flex items-center justify-center">
            <img
              src={icon}
              alt="icon"
              height={30}
              width={30}
            />
          </div>
          <div className="w-0.5 bg-gray-200 grow mt-4"></div>
        </div>
      </div>
      <div className="flex-1">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

FormSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.string,
  children: PropTypes.node,
};

export const FormRow = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
      {children}
    </div>
  );
};

FormRow.propTypes = {
  children: PropTypes.node,
};

export const FormField = ({ label, children }) => {
  return (
    <div className="">
      <label className="block mb-1 text-default font-[550] required-field-label">
        {label}:
      </label>
      {children}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
};

export const Input = React.forwardRef(
  ({ label, placeholder, error, ...props }, ref) => {
    // Extract the name from props for data attributes
    const { name } = props;

    return (
      <FormField label={label}>
        <input
          ref={ref}
          className="w-full px-3 py-2 text-default text-[#49454F] rounded-md border border-gray-300 focus:border-blue-500 outline-none disabled:cursor-not-allowed disabled:bg-[#b0b0b03a] disabled:opacity-50"
          placeholder={placeholder}
          // Add data attribute for error handling
          data-error-key={name}
          {...props}
        />
        {error && (
          <p className="mt-1 text-2xs text-[#B10E0EE5]">
            {error.message}
          </p>
        )}
      </FormField>
    );
  }
);

Input.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.object,
  name: PropTypes.string,
};

export const TextArea = React.forwardRef(
  ({ label, placeholder, error, ...props }, ref) => {
    // Extract the name from props for data attributes
    const { name } = props;

    return (
      <FormField label={label}>
        <textarea
          ref={ref}
          className="w-full px-3 py-2 text-default rounded-md border border-gray-300 focus:border-blue-500 outline-none text-[#49454F]"
          placeholder={placeholder}
          rows={4}
          // Add data attribute for error handling
          data-error-key={name}
          {...props}
        />
        {error && (
          <p className="text-2xs text-[#B10E0EE5]">
            {error.message}
          </p>
        )}
      </FormField>
    );
  }
);

TextArea.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.object,
  name: PropTypes.string,
};

export const Select = React.forwardRef(
  (
    { label, options, error, value, onChange, ...props },
    ref
  ) => {
    // Extract the name from props for data attributes
    const { name } = props;

    // Find the selected option based on the form value
    const selectedOption = options.find(
      (option) => option.id === value
    );

    return (
      <FormField label={label}>
        <Listbox
          value={selectedOption || ""}
          onChange={(option) => {
            // Pass the id value to react-hook-form
            onChange(option.id);
          }}
          {...props}
        >
          <div className="relative">
            <Listbox.Button
              ref={ref}
              className="w-full px-3 py-2 text-default text-left rounded-md border border-gray-300 focus:border-blue-500 outline-none text-[#49454F]"
              // Add data attribute for error handling
              data-error-key={name}
            >
              <span className="block truncate">
                {selectedOption?.name || "Select an option"}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDownIcon
                  className="w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-xs bg-white rounded-md shadow-lg max-h-40 ring-1 ring-black ring-opacity-5 focus:outline-none">
                {options.map((option, optionIdx) => (
                  <Listbox.Option
                    key={optionIdx}
                    className={({ active }) =>
                      `${
                        active
                          ? "text-white bg-blue-600"
                          : "text-[#49454F]"
                      }
                      cursor-default select-none relative py-2 px-4`
                    }
                    value={option}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`${
                            selected
                              ? "font-medium"
                              : "font-normal"
                          } block truncate`}
                        >
                          {option.name}
                        </span>
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
        {error && (
          <p className="mt-1 text-2xs text-[#B10E0EE5]">
            {error.message}
          </p>
        )}
      </FormField>
    );
  }
);

Select.propTypes = {
  label: PropTypes.string,
  options: PropTypes.array,
  error: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
};
