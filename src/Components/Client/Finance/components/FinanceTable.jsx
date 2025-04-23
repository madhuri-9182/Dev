import PropTypes from "prop-types";
import { memo, useEffect, useRef } from "react";
import { getJobLabel } from "../../../../utils/util";
import {
  formatDate,
  formatCurrency,
} from "../utils/formatters";
import Empty from "../../../shared/Empty";

const formatYearsAndMonths = (years, months) => {
  if (years === undefined || months === undefined)
    return "N/A";

  // Calculate the decimal representation of years with months
  const decimalYears = years + months / 12;

  // Format to 2 decimal places
  return `${decimalYears.toFixed(2)} Years`;
};

/**
 * Reusable finance data table component (memoized)
 */
const FinanceTable = memo(
  ({
    data = [],
    isLoading = false,
    isFetchingNextPage = false,
    hasNextPage = false,
    infiniteScrollRef,
    isPastPaymentsTable,
  }) => {
    // Track the data length to detect duplicates (for debugging)
    const prevDataLength = useRef(0);

    // Check for potential data issues
    useEffect(() => {
      // Check for duplicate data as a debugging measure
      if (
        data.length > 0 &&
        data.length === prevDataLength.current &&
        hasNextPage
      ) {
        console.warn(
          "Possible duplicate data detected: Data length unchanged after fetch"
        );
      }

      // Detect potential infinite loop
      if (data.length > 100 && hasNextPage) {
        console.warn(
          "Large data set detected, may want to implement virtualization"
        );
      }

      prevDataLength.current = data.length;
    }, [data, hasNextPage]);

    // Table styling
    const tableStyles = {
      firstCol:
        "py-4 text-left text-[#2B313E] font-semibold text-default pl-3",
      standard:
        "py-4 text-left text-[#2B313E] font-normal text-xs",
      tableRow: (index) =>
        `${
          index % 2 === 1
            ? isPastPaymentsTable
              ? "bg-[#FFC7001F] border-y border-[#0000001A]"
              : "bg-[#e5ecf6d4] border-y border-[#0000001A]"
            : ""
        } 
       grid grid-cols-[2.5fr_2.5fr_2.5fr_2.5fr_2fr]`,
    };

    // Empty state
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
              <th className={tableStyles.standard}>
                AMOUNT
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              // Generate a more reliable unique key
              const key = item.candidate?.id
                ? `candidate-${item.candidate.id}-${index}`
                : `row-${
                    item.candidate?.name || "unknown"
                  }-${
                    item.scheduled_time || index
                  }-${index}`;

              return (
                <tr
                  key={key}
                  className={tableStyles.tableRow(index)}
                >
                  <td className={tableStyles.firstCol}>
                    {item.candidate?.name || "N/A"}
                  </td>
                  <td className={tableStyles.standard}>
                    {getJobLabel(item.candidate?.role) ||
                      "N/A"}
                  </td>
                  <td className={tableStyles.standard}>
                    {formatYearsAndMonths(
                      item.candidate?.year,
                      item.candidate?.month
                    )}
                  </td>
                  <td className={tableStyles.standard}>
                    {item.scheduled_time
                      ? formatDate(item.scheduled_time)
                      : "N/A"}
                  </td>
                  <td className={tableStyles.standard}>
                    {formatCurrency(item.client_amount)}
                  </td>
                </tr>
              );
            })}
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
  }
);

// Display name for debugging
FinanceTable.displayName = "FinanceTable";

FinanceTable.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  isFetchingNextPage: PropTypes.bool,
  hasNextPage: PropTypes.bool,
  infiniteScrollRef: PropTypes.any,
  isPastPaymentsTable: PropTypes.bool,
};

export default FinanceTable;
