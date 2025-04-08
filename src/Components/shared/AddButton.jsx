import PropTypes from "prop-types";

const AddButton = ({ onClick, label, className }) => {
  return (
    <button
      className={`${className} h-[32px] primary-button`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default AddButton;

AddButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
};
