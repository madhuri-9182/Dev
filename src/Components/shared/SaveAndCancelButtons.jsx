import PropTypes from "prop-types";

export const SaveButton = ({
  disabled,
  label,
  type,
  onClick,
}) => (
  <button
    className="px-6 py-2 rounded-[100px] text-white border text-xs font-semibold cursor-pointer
     enabled:border-[#007AFF] enabled:bg-[#007AFF] 
     enabled:hover:bg-gradient-to-r enabled:hover:from-[#007AFF] enabled:hover:to-[#005BBB] 
     disabled:cursor-not-allowed disabled:bg-[#CAC4D0] disabled:border-[#CAC4D0] transition-all duration-300 ease-in-out w-28"
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
    className="px-6 py-2 rounded-[100px] text-[#65558F] border border-[#79747E] text-xs font-semibold cursor-pointer 
        transition-all duration-300 ease-in-out 
        hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6] w-28"
  >
    {label}
  </button>
);

CancelButton.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string,
};
