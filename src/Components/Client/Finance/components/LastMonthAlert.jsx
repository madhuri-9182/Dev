import PropTypes from "prop-types";
import { Warning2, CloseCircle } from "iconsax-react";
import { formatCurrency } from "../utils/formatters";

/**
 * Alert component for displaying last month's pending dues
 */
const LastMonthAlert = ({
  showDuesAlert,
  setShowDuesAlert,
  lastMonthName,
  lastMonthDueAmount,
  onViewClick,
}) => {
  if (!showDuesAlert) return null;

  return (
    <div className="bg-[#FFF3F3] border border-[#FF3B30] rounded-lg p-4 mb-4 flex justify-between items-center">
      <div className="flex items-center">
        <Warning2 className="h-5 w-5 text-[#FF3B30] mr-3" />
        <p className="text-sm text-[#FF3B30]">
          <span className="font-semibold">Important: </span>
          You have pending dues from {lastMonthName}. Please
          clear your pending amount of
          <span className="font-semibold">
            {" "}
            INR {formatCurrency(lastMonthDueAmount)}
          </span>
          .
        </p>
      </div>
      <div className="flex justify-center items-center gap-x-2">
        <button
          onClick={onViewClick}
          className="py-1 px-4 rounded-lg text-xs font-semibold text-white h-[28px] 
               bg-[#007AFF] transition-all duration-300 ease-in-out
               hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] cursor-pointer"
        >
          View
        </button>
        <button
          onClick={() => setShowDuesAlert(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <CloseCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

LastMonthAlert.propTypes = {
  showDuesAlert: PropTypes.bool.isRequired,
  setShowDuesAlert: PropTypes.func.isRequired,
  lastMonthName: PropTypes.string.isRequired,
  lastMonthDueAmount: PropTypes.number.isRequired,
  onViewClick: PropTypes.func.isRequired,
};

export default LastMonthAlert;
