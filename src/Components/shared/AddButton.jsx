import PropTypes from "prop-types";

const AddButton = ({ onClick, label, className }) => {
  return (
    <button
      className={`p-1 px-4 rounded-full text-xs font-semibold text-white ${className} h-[32px] 
             bg-[#007AFF] transition-all duration-300 ease-in-out
             hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] cursor-pointer`}
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
