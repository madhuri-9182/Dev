import PropTypes from "prop-types";

export const SaveButton = ({
  disabled,
  label,
  type,
  onClick,
}) => (
  <button
    className="primary-button w-28"
    type={type}
    disabled={disabled}
    onClick={onClick}
  >
    {label}
  </button>
);

SaveButton.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

export const CancelButton = ({ onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    className="secondary-button w-28"
  >
    {label}
  </button>
);

CancelButton.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string,
};
