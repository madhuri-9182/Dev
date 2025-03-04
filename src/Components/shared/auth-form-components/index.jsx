import React from "react";
import PropTypes from "prop-types";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { FaCircleCheck } from "react-icons/fa6";
import { Switch } from "@headlessui/react";

export const Input = ({
  type,
  value,
  onChange,
  required,
  id,
  ...props
}) => {
  return (
    <React.Fragment>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        id={id}
        className="border-2 rounded-md w-[100%] px-2 py-[10px] text-xs"
        {...props}
      />
    </React.Fragment>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
};

export const Label = ({ name, label, className }) => {
  return (
    <label
      htmlFor={name}
      className={`text-xs font-medium font-outfit text-label ${className}`}
    >
      {label}
    </label>
  );
};

Label.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
};

export const SubmitButton = ({ disabled, label }) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full p-[11px] font-outfit font-bold text-sm text-[#FFFFFF] tracking-[1%] leading-[auto] bg-[#056DDC] rounded-[100px] disabled:bg-[#B0B0B0] disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
};

SubmitButton.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
};

export const SecondaryButton = ({
  onClick,
  label,
  disabled,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="w-full p-2 mt-5 font-bold text-sm text-link border-0 shadow-md bg-[#FFFFFF] rounded-[21px] disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
};

SecondaryButton.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};

export const ViewHideEyeButton = ({
  onClick,
  isPasswordVisible,
  className,
}) => {
  return (
    <p
      className={`text-[20px] cursor-pointer ${className}`}
      onClick={onClick}
    >
      {isPasswordVisible ? (
        <AiOutlineEyeInvisible />
      ) : (
        <AiOutlineEye />
      )}
    </p>
  );
};

ViewHideEyeButton.propTypes = {
  onClick: PropTypes.func,
  isPasswordVisible: PropTypes.bool,
  className: PropTypes.string,
};

export const MatchedPassword = ({
  isMatched,
  className,
}) => {
  return (
    <p>
      {isMatched && (
        <FaCircleCheck
          className={`text-[#2ECC71] text-lg font-bold ${className}`}
        />
      )}
    </p>
  );
};

MatchedPassword.propTypes = {
  isMatched: PropTypes.bool,
  className: PropTypes.string,
};

export const PasswordCriteriaList = ({ criteria }) => {
  const PASSWORD_CRITERIA = [
    {
      name: "Between 8 and 20 characters",
      checked: criteria.length,
    },
    {
      name: "1 upper case letter",
      checked: criteria.uppercase,
    },
    {
      name: "1 or more numbers",
      checked: criteria.number,
    },
    {
      name: "1 or more special characters",
      checked: criteria.specialChar,
    },
  ];

  return (
    <div>
      <p className="text-gray-500 uppercase text-xs font-bold mb-4">
        Your password must contain
      </p>
      <ul className="list-none flex flex-col gap-1">
        {PASSWORD_CRITERIA.map((criteriaItem, index) => (
          <li
            key={index}
            className="flex items-center font-semibold text-2xs text-gray-500"
          >
            <Switch
              checked={criteriaItem.checked}
              className={`${"bg-gray-200"} flex h-4 w-4 mr-2 rounded-full transition-colors focus:outline-none items-center justify-center`}
              disabled
            >
              {criteriaItem.checked && (
                <span className="flex items-center justify-center text-white h-[12px] w-[12px] bg-green-500 rounded-full"></span>
              )}
            </Switch>
            {criteriaItem.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

PasswordCriteriaList.propTypes = {
  criteria: PropTypes.object,
};
