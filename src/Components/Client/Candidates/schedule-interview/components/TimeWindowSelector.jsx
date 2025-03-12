import PropTypes from "prop-types";

/**
 * Component for selecting specific time windows within a time slot
 */
function TimeWindowSelector({
  selectedTimeSlot,
  availableWindows,
  selectedWindow,
  handleWindowSelect,
}) {
  if (!selectedTimeSlot || !availableWindows.length)
    return null;

  return (
    <div className="mt-8">
      <div className="flex items-center space-x-1">
        <span className="text-xs font-bold mr-4 text-[#6B6F7B]">
          Available 1-hour Windows
        </span>
        <div className="flex items-center space-x-2 flex-wrap">
          {availableWindows.map((window, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleWindowSelect(window)}
              className={`flex items-center justify-center px-2 py-1 border rounded-md text-2xs w-auto ${
                selectedWindow === window.window
                  ? "bg-purple-100 text-purple-700 border-purple-300"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {selectedWindow === window.window && (
                <span className="w-4 h-4 flex justify-center items-center mr-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3 text-purple-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              )}
              {window.window}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TimeWindowSelector;

TimeWindowSelector.propTypes = {
  selectedTimeSlot: PropTypes.string,
  availableWindows: PropTypes.array,
  selectedWindow: PropTypes.string,
  handleWindowSelect: PropTypes.func,
};
