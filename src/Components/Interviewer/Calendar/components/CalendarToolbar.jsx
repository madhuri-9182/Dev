import PropTypes from "prop-types";
import {
  ArrowLeft,
  ArrowLeft2,
  ArrowRight2,
} from "iconsax-react";

/**
 * Calendar toolbar component
 * @param {Object} props Component props
 * @param {String} props.calendarTitle Current calendar title
 * @param {String} props.activeView Current active view
 * @param {Function} props.handleToday Handler for Today button
 * @param {Function} props.handlePrev Handler for Previous button
 * @param {Function} props.handleNext Handler for Next button
 * @param {Function} props.handleViewChange Handler for view change
 * @param {Function} props.handleBack Handler for Back button
 * @returns {JSX.Element} Toolbar component
 */
const CalendarToolbar = ({
  calendarTitle,
  activeView,
  handleToday,
  handlePrev,
  handleNext,
  handleViewChange,
  handleBack,
}) => {
  const getViewBtnClass = (view) => {
    return `${googleCalViewBtn} ${
      activeView === view
        ? "bg-[#e8f0fe] text-[#1a73e8]"
        : "bg-transparent text-[#3c4043]"
    }`;
  };

  return (
    <div className="flex justify-between items-center py-2 px-4 mb-2">
      <div className="flex items-center gap-4">
        <button
          className="bg-transparent border border-[#dadce0] rounded-full text-[#3c4043] text-sm font-medium p-2 cursor-pointer transition-colors duration-200 hover:bg-[#f6f6f6] flex items-center gap-x-1 justify-around"
          title="Back"
          onClick={handleBack}
        >
          <ArrowLeft size="16" color="#3c4043" />
        </button>
        <button
          className="bg-transparent border border-[#dadce0] rounded-full text-[#3c4043] font-medium px-4 py-2 cursor-pointer transition-colors duration-200 hover:bg-[#f6f6f6] text-default"
          onClick={handleToday}
        >
          Today
        </button>
        <div className="flex items-center gap-1">
          <button
            className={googleCalNavBtn}
            onClick={handlePrev}
          >
            <ArrowLeft2 size="20" />
          </button>
          <button
            className={googleCalNavBtn}
            onClick={handleNext}
          >
            <ArrowRight2 size="20" />
          </button>
        </div>
        <h2 className="text-xl font-medium text-[#3c4043]">
          {calendarTitle}
        </h2>
      </div>
      <div className="flex items-center">
        <div className="flex border border-[#dadce0] overflow-hidden rounded-3xl">
          <button
            className={getViewBtnClass("dayGridMonth")}
            onClick={() => handleViewChange("dayGridMonth")}
          >
            Month
          </button>
          <button
            className={getViewBtnClass("timeGridWeek")}
            onClick={() => handleViewChange("timeGridWeek")}
          >
            Week
          </button>
          <button
            className={getViewBtnClass("timeGridDay")}
            onClick={() => handleViewChange("timeGridDay")}
          >
            Day
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarToolbar;

CalendarToolbar.propTypes = {
  calendarTitle: PropTypes.string,
  activeView: PropTypes.string,
  handleToday: PropTypes.func,
  handlePrev: PropTypes.func,
  handleNext: PropTypes.func,
  handleViewChange: PropTypes.func,
  handleBack: PropTypes.func,
};

const googleCalNavBtn =
  "bg-transparent border-none text-[#5f6368] text-lg w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-[#f6f6f6]";

const googleCalViewBtn =
  " border-none text-sm font-medium px-4 py-2 cursor-pointer transition-colors duration-200 hover:bg-[#f6f6f6]";
