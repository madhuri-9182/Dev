import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { CloseSquare } from "iconsax-react";
import FinanceTable from "./FinanceTable";
import { ErrorState } from "../../../shared/loading-error-state";
import { getErrorMessage } from "../../../../utils/util";

/**
 * Modal component for displaying last month's dues
 */
const LastMonthModal = ({
  isOpen,
  onClose,
  title,
  className = "",
  children,
  // New props for the finance table
  lastMonthDisplayData = [],
  lastMonthModalTotalAmount = 0,
  isLastMonthModalLoading = false,
  isLastMonthModalFetchingNextPage = false,
  hasLastMonthModalNextPage = false,
  lastMonthModalError = null,
  isLastMonthModalError = false,
  lastMonthRef = null,
  generateLastMonthPdf = () => {},
  isGeneratingPdf = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <motion.div
        className={`bg-white rounded-lg shadow-lg w-[420px] p-4 absolute top-[10%] overflow-y-auto max-h-[90vh] ${className}`}
        initial={{ opacity: 0, scale: 0.9 }} // Start hidden & small
        animate={{ opacity: 1, scale: 1 }} // Fully visible & normal size
        exit={{ opacity: 0, scale: 0.9 }} // Shrink and fade out
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex justify-center items-center border-b pb-2">
          <h2
            className={`text-base font-bold ${
              title === "Delete User"
                ? "text-[#f00001]"
                : "text-[#005BBB]"
            } uppercase`}
          >
            {title}
          </h2>
        </div>
        <CloseSquare
          size={22}
          className="transition-transform text-[#f00001] cursor-pointer duration-300 hover:scale-105 hover:text-[#F22129] absolute top-4 right-4"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="mt-4">
          {children ? (
            children
          ) : (
            <div className="p-4">
              {isLastMonthModalLoading ? (
                <div className="flex justify-center py-8">
                  Loading...
                </div>
              ) : isLastMonthModalError ? (
                <ErrorState
                  message={getErrorMessage(
                    lastMonthModalError
                  )}
                />
              ) : (
                <>
                  <div className="flex justify-between mb-6">
                    <h2 className="text-lg font-bold text-[#1C1C1C]">
                      {title}
                    </h2>
                    <h2 className="text-lg font-bold text-[#1C1C1C]">
                      TOTAL: INR{" "}
                      {lastMonthModalTotalAmount.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </h2>
                  </div>

                  <FinanceTable
                    data={lastMonthDisplayData}
                    isLoading={isLastMonthModalLoading}
                    isFetchingNextPage={
                      isLastMonthModalFetchingNextPage
                    }
                    hasNextPage={hasLastMonthModalNextPage}
                    infiniteScrollRef={lastMonthRef}
                  />

                  {/* Download and Pay buttons */}
                  {lastMonthDisplayData.length > 0 && (
                    <div className="mt-6 flex justify-end items-center gap-x-3">
                      <button
                        type="button"
                        onClick={generateLastMonthPdf}
                        disabled={isGeneratingPdf}
                        className={`
                          py-2 px-6 rounded-full text-xs font-semibold text-white h-[32px] 
                          bg-[#007AFF] transition-all duration-300 ease-in-out
                          hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] 
                          ${
                            isGeneratingPdf
                              ? "opacity-70 cursor-not-allowed"
                              : "cursor-pointer"
                          }
                        `}
                      >
                        {isGeneratingPdf
                          ? "Generating..."
                          : "Download"}
                      </button>
                      <button
                        type="button"
                        className="py-2 px-6 rounded-full text-xs font-semibold text-white h-[32px] 
                          bg-[#007AFF] transition-all duration-300 ease-in-out
                          hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] cursor-pointer"
                      >
                        Pay Now
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

LastMonthModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  lastMonthDisplayData: PropTypes.array,
  lastMonthModalTotalAmount: PropTypes.number,
  isLastMonthModalLoading: PropTypes.bool,
  isLastMonthModalFetchingNextPage: PropTypes.bool,
  hasLastMonthModalNextPage: PropTypes.bool,
  lastMonthModalError: PropTypes.object,
  isLastMonthModalError: PropTypes.bool,
  lastMonthRef: PropTypes.object,
  generateLastMonthPdf: PropTypes.func,
  isGeneratingPdf: PropTypes.bool,
};

export default LastMonthModal;
