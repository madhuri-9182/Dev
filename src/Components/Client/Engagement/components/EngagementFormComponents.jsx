import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { Calendar } from "iconsax-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

// Field wrapper component for consistent styling
export const FieldWrapper = ({
  children,
  label,
  error,
}) => {
  return (
    <div>
      <div className="flex items-center w-full">
        <label className="w-32 flex-shrink-0 text-2xs font-semibold text-[#6B6F7B]">
          {label}
        </label>
        <div className="flex-1">
          <div className="w-full max-w-[220px]">
            {children}
          </div>
        </div>
      </div>
      <div className="flex items-center w-full">
        <p className="w-32"></p>
        {error && (
          <p className="mt-1 text-[10px] text-red-500">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

// Base styling for input and select fields
const baseFieldStyles = (hasError) => `
  w-full px-3 py-2 text-2xs rounded-lg border  bg-white
  ${hasError ? "border-red-500 " : "border-[#979DA3]"} 
  focus:outline-none focus:ring-1 focus:ring-blue-500 h-[30px] text-[#49454F]
`;

// Reusable Input Field Component
export const InputField = ({
  name,
  control,
  rules = {},
  label,
  type = "text",
  placeholder,
  disabled = false,
  prefix = null,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <FieldWrapper label={label} error={error?.message}>
          {prefix ? (
            <div className="relative flex items-center h-[30px]">
              <span className="absolute left-3 text-xs">
                {prefix}
              </span>
              <input
                {...field}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                className={`${baseFieldStyles(
                  !!error
                )} pl-10`}
              />
            </div>
          ) : (
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              className={baseFieldStyles(!!error)}
            />
          )}
        </FieldWrapper>
      )}
    />
  );
};

// Reusable Select Field Component
export const SelectField = ({
  name,
  control,
  rules = {},
  label,
  options = [],
  disabled = false,
  placeholder,
  valueKey = "value",
  labelKey = "label",
  booleanValues = false,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <FieldWrapper label={label} error={error?.message}>
          <select
            {...(booleanValues
              ? {
                  onChange: (e) =>
                    field.onChange(!!+e.target.value),
                  value: field.value ? 1 : 0,
                }
              : field)}
            disabled={disabled}
            className={`${baseFieldStyles(
              !!error
            )} custom-select ${
              disabled ? "text-[#a3a9b5]" : ""
            }`}
          >
            {placeholder ? (
              <option value="">{placeholder}</option>
            ) : null}
            {options.map((option) => (
              <option
                key={
                  booleanValues
                    ? option[valueKey]
                    : option[valueKey] || option
                }
                value={
                  booleanValues
                    ? option[valueKey]
                    : option[valueKey] || option
                }
              >
                {booleanValues
                  ? option[labelKey]
                  : option[labelKey] || option}
              </option>
            ))}
          </select>
        </FieldWrapper>
      )}
    />
  );
};

// Boolean Select Field Component (Yes/No)
export const BooleanSelectField = ({
  name,
  control,
  label,
  disabled = false,
}) => {
  const options = [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" },
  ];

  return (
    <SelectField
      name={name}
      control={control}
      label={label}
      options={options}
      disabled={disabled}
      booleanValues={true}
    />
  );
};

// Date Picker Field Component
export const DatePickerField = ({
  name,
  control,
  rules = {},
  label,
  disabled = false,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <FieldWrapper label={label} error={error?.message}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={
                field.value
                  ? dayjs(field.value, "DD/MM/YYYY")
                  : null
              }
              onChange={(newValue) => {
                field.onChange(
                  newValue
                    ? newValue.format("DD/MM/YYYY")
                    : null
                );
              }}
              format="DD/MM/YYYY"
              disabled={disabled}
              slotProps={{
                textField: {
                  size: "small",
                  error: !!error,
                  sx: {
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      height: "30px",
                    },
                    "& .MuiInputBase-input": {
                      padding: "8px 12px",
                      fontSize: "12px",
                    },
                  },
                },
                openPickerButton: {
                  children: (
                    <Calendar size={20} color="#171717" />
                  ),
                },
              }}
            />
          </LocalizationProvider>
        </FieldWrapper>
      )}
    />
  );
};

// PropTypes
FieldWrapper.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  error: PropTypes.string,
};

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  rules: PropTypes.object,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  prefix: PropTypes.string,
};

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  rules: PropTypes.object,
  label: PropTypes.string.isRequired,
  options: PropTypes.array,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  booleanValues: PropTypes.bool,
};

BooleanSelectField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

DatePickerField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  rules: PropTypes.object,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};
