import PropTypes from "prop-types";
import { Fragment } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { getJobLabel } from "../../../../utils/util";

export const CandidateFilters = ({
  value,
  onChange,
  options,
  placeholder,
  displayValue,
}) => {
  const listboxOptions = options || [];
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <ListboxButton
          className={`relative custom-select w-full rounded-lg border border-[#979DA3] py-1 px-3 text-left text-2xs text-[#49454F] shadow-sm focus:outline-none`}
        >
          <span className="block truncate">
            {displayValue || placeholder}
          </span>
        </ListboxButton>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-2xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {listboxOptions.length > 0 &&
              listboxOptions.map((option) => {
                const optionValue =
                  option.value !== undefined
                    ? option.value
                    : option.id !== undefined
                    ? option.id
                    : option;
                const optionLabel =
                  option.label || option.name || option;

                // Check if this option is selected
                const isSelected = value === optionValue;

                return (
                  <ListboxOption
                    key={
                      typeof optionValue === "object"
                        ? JSON.stringify(optionValue)
                        : optionValue
                    }
                    value={optionValue}
                    className={({ active }) =>
                      `${
                        active
                          ? "bg-[#007AFF] text-white"
                          : "text-gray-900"
                      }
                      relative cursor-pointer select-none py-1 px-3`
                    }
                  >
                    <span
                      className={`block truncate ${
                        isSelected
                          ? "font-medium"
                          : "font-normal"
                      }`}
                    >
                      {typeof optionLabel === "string"
                        ? placeholder === "All Roles"
                          ? getJobLabel(optionLabel)
                          : optionLabel
                        : JSON.stringify(optionLabel)}
                    </span>
                  </ListboxOption>
                );
              })}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  );
};

CandidateFilters.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  displayValue: PropTypes.string,
};
