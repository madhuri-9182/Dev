// src/components/interviewer/components/Sidebar.jsx
import PropTypes from "prop-types";
// import { Link } from "react-router-dom";

/**
 * Sidebar component with navigation buttons
 */
const Sidebar = ({ handleCalendarClick, isLoading }) => (
  <div className="flex items-start justify-center w-56 py-5">
    <div className="mt-20 py-5 px-3 flex flex-col items-center justify-start rounded-2xl bg-[#E7E4E8CC] h-4/6 gap-y-4">
      {/* <Link
        to="/interviewer/payments"
        className="secondary-button h-8"
      >
        Check Receivables
      </Link> */}
      <button
        onClick={handleCalendarClick}
        className="primary-button w-full h-8"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Block Calendar"}
      </button>
    </div>
  </div>
);

Sidebar.propTypes = {
  handleCalendarClick: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default Sidebar;
