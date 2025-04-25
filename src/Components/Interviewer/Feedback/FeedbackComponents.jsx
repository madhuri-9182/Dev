// FeedbackComponents.jsx - Responsive form components
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Listbox, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  Upload,
  X,
  Link as LinkIcon,
  FileText,
  Loader,
} from "lucide-react";

// Reusable Form Components with responsive design
export const FormSection = ({
  title,
  subtitle,
  icon,
  children,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[3.5fr_8.5fr] mb-8 lg:mb-10">
      <div className="flex flex-col lg:flex-row lg:justify-between mb-4 lg:mb-0">
        <div className="flex flex-col gap-y-1 lg:mr-3">
          <h2 className="text-lg font-bold bg-gradient-to-r from-black to-[#E41616] text-transparent bg-clip-text w-fit">
            {title}
          </h2>
          <p className="text-[#000000A1] text-sm lg:mb-6">
            {subtitle}
          </p>
        </div>
        <div className="hidden lg:flex flex-col items-center pr-8">
          <div className="bg-[#E6D3D3] rounded-full p-2 w-12 h-12 flex items-center justify-center">
            <img
              src={icon}
              alt="icon"
              height={26}
              width={26}
            />
          </div>
          <div className="w-0.5 bg-gray-200 grow mt-4"></div>
        </div>
      </div>
      <div className="flex-1">
        <div className="space-y-4 lg:space-y-6">{children}</div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-x-10">
      {children}
    </div>
  );
};

FormRow.propTypes = {
  children: PropTypes.node,
};

export const FormField = ({
  label,
  children,
  optional = false,
}) => {
  return (
    <div className="">
      <label className="block mb-1 text-sm lg:text-default font-[550] required-field-label">
        {label}:
        {optional && (
          <span className="text-gray-500 font-normal ml-1 text-xs lg:text-sm">
            (Optional)
          </span>
        )}
      </label>
      {children}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
  optional: PropTypes.bool,
};

export const Input = React.forwardRef(
  (
    { label, placeholder, error, optional, ...props },
    ref
  ) => {
    const { name } = props;

    return (
      <FormField label={label} optional={optional}>
        <input
          ref={ref}
          className="w-full px-3 py-2 text-sm lg:text-default text-[#49454F] rounded-md border border-gray-300 focus:border-blue-500 outline-none disabled:cursor-not-allowed disabled:bg-[#b0b0b03a] disabled:opacity-50"
          placeholder={placeholder}
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
  optional: PropTypes.bool,
};

export const TextArea = React.forwardRef(
  ({ label, placeholder, error, ...props }, ref) => {
    const { name } = props;

    return (
      <FormField label={label}>
        <textarea
          ref={ref}
          className="w-full px-3 py-2 text-sm lg:text-default rounded-md border border-gray-300 focus:border-blue-500 outline-none text-[#49454F]"
          placeholder={placeholder}
          rows={4}
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
    const { name } = props;
    const selectedOption = options.find(
      (option) => option.id === value
    );

    return (
      <FormField label={label}>
        <Listbox
          value={selectedOption || ""}
          onChange={(option) => {
            onChange(option.id);
          }}
          {...props}
        >
          <div className="relative">
            <Listbox.Button
              ref={ref}
              className="w-full px-3 py-2 text-sm lg:text-default text-left rounded-md border border-gray-300 focus:border-blue-500 outline-none text-[#49454F]"
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

// FileUpload component with responsive design
export const FileUpload = React.forwardRef(
  (
    {
      label,
      accept,
      error,
      onChange,
      isLoading = false,
      defaultFileName = null,
      ...props
    },
    ref
  ) => {
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [internalError, setInternalError] = useState(null);
    const fileInputRef = React.useRef(null);
    const { name } = props;

    useEffect(() => {
      if (props.value instanceof File) {
        setFile(props.value);
        const url = URL.createObjectURL(props.value);
        setFileUrl(url);

        return () => {
          if (url) URL.revokeObjectURL(url);
        };
      }
    }, [props.value]);

    useEffect(() => {
      if (!error && internalError) {
        setInternalError(null);
      }
    }, [error, internalError]);

    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];

      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }

      setFile(selectedFile);

      if (selectedFile) {
        try {
          const url = URL.createObjectURL(selectedFile);
          setFileUrl(url);
          setInternalError(null);
        } catch (err) {
          console.error("Error creating object URL:", err);
          setInternalError("Unable to preview file");
          setFileUrl(null);
        }
      } else {
        setFileUrl(null);
      }

      if (onChange) {
        onChange(selectedFile);
      }
    };

    const handleRemoveFile = () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }

      setFile(null);
      setFileUrl(null);
      setInternalError(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (onChange) {
        onChange(null);
      }
    };

    const handleButtonClick = () => {
      fileInputRef.current.click();
    };

    const displayFileName = file ? file.name : defaultFileName;
    const displayError = internalError ? { message: internalError } : error;

    return (
      <div className="mb-4">
        <label className="block mb-1 text-sm lg:text-default font-[550] required-field-label">
          {label}:
          <span className="text-gray-500 font-normal ml-1 text-xs lg:text-sm">
            (Optional)
          </span>
        </label>

        <div className="flex flex-col space-y-3">
          <input
            ref={(element) => {
              if (ref) {
                if (typeof ref === "function") {
                  ref(element);
                } else {
                  ref.current = element;
                }
              }
              fileInputRef.current = element;
            }}
            className="hidden"
            type="file"
            accept={accept}
            onChange={handleFileChange}
            data-error-key={name}
            {...props}
          />

          <div>
            <button
              type="button"
              onClick={handleButtonClick}
              disabled={isLoading}
              className={`px-4 py-2 text-sm lg:text-default bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 flex items-center ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <Loader size={16} className="mr-2 animate-spin" />
              ) : (
                <Upload size={16} className="mr-2" />
              )}
              {isLoading
                ? "Loading file..."
                : file || displayFileName
                ? "Change File"
                : "Upload File"}
            </button>
          </div>

          {(file || (displayFileName && !isLoading)) && (
            <div className="flex items-center py-2 px-3 bg-gray-50 rounded-md border border-gray-100">
              <div className="flex-1 flex flex-col">
                <div className="flex items-center">
                  <FileText size={16} className="text-gray-500 mr-2" />
                  {fileUrl ? (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs lg:text-sm font-medium truncate max-w-[90%]"
                    >
                      {displayFileName}
                    </a>
                  ) : (
                    <span className="text-xs lg:text-sm truncate max-w-[90%] text-[#49454F]">
                      {displayFileName}
                    </span>
                  )}
                </div>
                {file && (
                  <span className="text-xs text-gray-500 ml-6">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                )}
              </div>
              {fileUrl && (
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-gray-500 hover:text-red-500 p-1"
                  aria-label="Remove file"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          )}

          {displayError && (
            <p className="text-2xs text-[#B10E0EE5]">
              {displayError.message}
            </p>
          )}

          <p className="text-xs text-gray-500">
            Maximum file size: 10MB. Supported formats: PDF, DOC, DOCX, JPG, PNG
          </p>
        </div>
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

FileUpload.propTypes = {
  label: PropTypes.string,
  accept: PropTypes.string,
  error: PropTypes.object,
  onChange: PropTypes.func,
  name: PropTypes.string,
  isLoading: PropTypes.bool,
  defaultFileName: PropTypes.string,
  value: PropTypes.any,
};

export const LinkInput = React.forwardRef(
  ({ label, placeholder, error, ...props }, ref) => {
    const { name } = props;

    return (
      <FormField label={label} optional={true}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <LinkIcon size={16} className="text-gray-400" />
          </div>
          <input
            ref={ref}
            className="w-full pl-10 pr-3 py-2 text-sm lg:text-default text-[#49454F] rounded-md border border-gray-300 focus:border-blue-500 outline-none"
            placeholder={placeholder}
            type="url"
            data-error-key={name}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-2xs text-[#B10E0EE5]">
            {error.message}
          </p>
        )}
      </FormField>
    );
  }
);

LinkInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.object,
  name: PropTypes.string,
};