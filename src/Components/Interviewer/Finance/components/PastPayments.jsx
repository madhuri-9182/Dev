import PropTypes from "prop-types";
import FinanceTable from "../../../Client/Finance/components/FinanceTable";

/**
 * Component for displaying current dues
 */
const PastPayments = ({
  displayData,
  totalAmount,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  scrollRef,
  onDownloadClick,
  isGeneratingPdf,
}) => {
  return (
    <div className="md:w-1/2">
      <div className="flex flex-col md:flex-row md:justify-between mb-12">
        <div className="mb-4 md:mb-0">
          <h2 className="text-base font-bold text-[#1C1C1C]">
            Past Payments
          </h2>
        </div>
        <div>
          <h2 className="text-base font-bold text-[#1C1C1C]">
            TOTAL: INR{" "}
            {totalAmount.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
        </div>
      </div>

      {/* Current Dues Table */}
      <FinanceTable
        data={displayData}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        infiniteScrollRef={scrollRef}
        isPastPaymentsTable={true} // Adjust this based on your needs
      />

      {/* Download button */}
      {displayData?.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onDownloadClick}
            disabled={isGeneratingPdf}
            className="primary-button h-8"
          >
            {isGeneratingPdf ? "Generating..." : "Download"}
          </button>
        </div>
      )}
    </div>
  );
};

PastPayments.propTypes = {
  displayData: PropTypes.array.isRequired,
  totalAmount: PropTypes.number.isRequired,
  isLoading: PropTypes.bool,
  isFetchingNextPage: PropTypes.bool,
  hasNextPage: PropTypes.bool,
  scrollRef: PropTypes.any,
  onDownloadClick: PropTypes.func.isRequired,
  isGeneratingPdf: PropTypes.bool,
};

export default PastPayments;
