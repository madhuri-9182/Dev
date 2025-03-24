import PropTypes from "prop-types";

export const FormItem = ({ formItems }) => {
  if (!formItems || formItems.length === 0) {
    return null;
  }

  return (
    <div
      className={`grid grid-cols-3 gap-y-4 gap-x-16 items-center`}
    >
      {formItems.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center gap-x-3 justify-end"
        >
          <label
            className="text-2xs font-bold text-right w-1/3 text-[#6B6F7B]"
            htmlFor={`form-item-${idx}`}
          >
            {item.label}
          </label>
          <input
            id={`form-item-${idx}`}
            value={item.value || ""}
            readOnly
            type="text"
            aria-label={item.label}
            className={`rounded-lg w-[200px] text-2xs py-[6px] px-3 border text-center ${item.className}`}
          />
        </div>
      ))}
    </div>
  );
};

FormItem.propTypes = {
  formItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      className: PropTypes.string,
    })
  ).isRequired,
};
