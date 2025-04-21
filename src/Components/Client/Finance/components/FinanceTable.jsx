import PropTypes from "prop-types";
import { getJobLabel } from "../../../../utils/util";
import {
  formatDate,
  formatCurrency,
} from "../utils/formatters";
import Empty from "../../../shared/Empty";

/**
 * Reusable finance data table component
 */
const FinanceTable = ({
  data = [],
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  infiniteScrollRef,
}) => {
  // Table styling
  const tableStyles = {
    firstCol:
      "py-4 text-left text-[#2B313E] font-semibold text-default pl-3",
    standard:
      "py-4 text-left text-[#2B313E] font-normal text-xs",
  };

  if (data.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-4">
        <Empty description="No data to display" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-[3px] border-[#4F4F4F] grid grid-cols-[2.5fr_2.5fr_2.5fr_2.5fr_2fr]">
            <th className={tableStyles.firstCol}>
              Candidate
            </th>
            <th className={tableStyles.standard}>ROLE</th>
            <th className={tableStyles.standard}>
              EXPERIENCE
            </th>
            <th className={tableStyles.standard}>DATE</th>
            <th className={tableStyles.standard}>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={`${item.candidate.name}-${item.scheduled_time}-${index}`}
              className={`${
                index % 2 === 1
                  ? "bg-[#e5ecf6d4] border-y border-[#0000001A]"
                  : ""
              } grid grid-cols-[2.5fr_2.5fr_2.5fr_2.5fr_2fr]`}
            >
              <td className={tableStyles.firstCol}>
                {item.candidate.name}
              </td>
              <td className={tableStyles.standard}>
                {getJobLabel(item.candidate.role)}
              </td>
              <td className={tableStyles.standard}>
                {item.candidate.year}.{item.candidate.month}{" "}
                Years
              </td>
              <td className={tableStyles.standard}>
                {formatDate(item.scheduled_time)}
              </td>
              <td className={tableStyles.standard}>
                {formatCurrency(item.client_amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Infinite scroll loading indicator */}
      <div
        ref={infiniteScrollRef}
        className="py-4 text-center text-gray-500"
      >
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
          ? "Scroll for more"
          : ""}
      </div>
    </div>
  );
};

FinanceTable.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  isFetchingNextPage: PropTypes.bool,
  hasNextPage: PropTypes.bool,
  infiniteScrollRef: PropTypes.any,
};

export default FinanceTable;
