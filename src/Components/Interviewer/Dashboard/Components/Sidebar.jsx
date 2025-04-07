// src/components/interviewer/components/Sidebar.jsx
import PropTypes from "prop-types";
// import { Link } from "react-router-dom";

/**
 * Sidebar component with navigation buttons
 */
const Sidebar = ({ handleCalendarClick, isLoading }) => (
  <div className="flex items-start justify-center w-52 py-5">
    <div className="mt-20 py-5 px-3 flex flex-col items-center justify-start rounded-2xl bg-[#E7E4E8CC] h-4/6 gap-y-4">
      {/* <Link
        to="/interviewer/payments"
        className="py-2 px-3 w-full text-default font-medium border border-[#79747E] rounded-full text-[#65558F] transition-all duration-300 ease-in-out 
          hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6]"
      >
        Check Receivables
      </Link> */}
      <button
        onClick={handleCalendarClick}
        className="py-2 px-4 rounded-full text-default font-medium text-white
         bg-[#007AFF] transition-all duration-300 ease-in-out
         hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] cursor-pointer w-full"
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
