import PropTypes from "prop-types";
import {
  ArrowLeft,
  ArrowLeft2,
  ArrowRight2,
} from "iconsax-react";
import { Loader2 } from "lucide-react";

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
 * @param {Boolean} props.needsGoogleSync Whether Google Calendar sync is needed
 * @param {Function} props.handleGoogleSync Handler for Google sync button
 * @param {Boolean} props.isSyncing Whether Google Calendar is currently syncing
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
  needsGoogleSync,
  handleGoogleSync,
  isSyncing,
}) => {
  const getViewBtnClass = (view) => {
    return `${googleCalViewBtn} ${
      activeView === view
        ? "bg-[#e8f0fe] text-[#1a73e8]"
        : "bg-transparent text-[#3c4043]"
    }`;
  };

  const googleCalendarIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="20"
      height="20"
      viewBox="0 0 48 48"
    >
      <rect
        width="22"
        height="22"
        x="13"
        y="13"
        fill="#fff"
      ></rect>
      <polygon
        fill="#1e88e5"
        points="25.68,20.92 26.688,22.36 28.272,21.208 28.272,29.56 30,29.56 30,18.616 28.56,18.616"
      ></polygon>
      <path
        fill="#1e88e5"
        d="M22.943,23.745c0.625-0.574,1.013-1.37,1.013-2.249c0-1.747-1.533-3.168-3.417-3.168 c-1.602,0-2.972,1.009-3.33,2.453l1.657,0.421c0.165-0.664,0.868-1.146,1.673-1.146c0.942,0,1.709,0.646,1.709,1.44 c0,0.794-0.767,1.44-1.709,1.44h-0.997v1.728h0.997c1.081,0,1.993,0.751,1.993,1.64c0,0.904-0.866,1.64-1.931,1.64 c-0.962,0-1.784-0.61-1.914-1.418L17,26.802c0.262,1.636,1.81,2.87,3.6,2.87c2.007,0,3.64-1.511,3.64-3.368 C24.24,25.281,23.736,24.363,22.943,23.745z"
      ></path>
      <polygon
        fill="#fbc02d"
        points="34,42 14,42 13,38 14,34 34,34 35,38"
      ></polygon>
      <polygon
        fill="#4caf50"
        points="38,35 42,34 42,14 38,13 34,14 34,34"
      ></polygon>
      <path
        fill="#1e88e5"
        d="M34,14l1-4l-1-4H9C7.343,6,6,7.343,6,9v25l4,1l4-1V14H34z"
      ></path>
      <polygon
        fill="#e53935"
        points="34,34 34,42 42,34"
      ></polygon>
      <path
        fill="#1565c0"
        d="M39,6h-5v8h8V9C42,7.343,40.657,6,39,6z"
      ></path>
      <path
        fill="#1565c0"
        d="M9,42h5v-8H6v5C6,40.657,7.343,42,9,42z"
      ></path>
    </svg>
  );

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

        {/* Sync Google Calendar Button */}
      </div>
      <div className="flex items-center gap-x-3">
        {needsGoogleSync && (
          <button
            className="bg-transparent border border-[#dadce0] rounded-full text-[#3c4043] font-medium px-4 py-2 cursor-pointer transition-colors duration-200 hover:bg-[#f6f6f6] text-default flex items-center gap-x-2 justify-center"
            onClick={handleGoogleSync}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Syncing...
              </>
            ) : (
              <>
                {googleCalendarIcon()}
                Sync Google Calendar
              </>
            )}
          </button>
        )}
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
  needsGoogleSync: PropTypes.bool,
  handleGoogleSync: PropTypes.func,
  isSyncing: PropTypes.bool,
};

const googleCalNavBtn =
  "bg-transparent border-none text-[#5f6368] text-lg w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-[#f6f6f6]";

const googleCalViewBtn =
  " border-none text-sm font-medium px-4 py-2 cursor-pointer transition-colors duration-200 hover:bg-[#f6f6f6]";
