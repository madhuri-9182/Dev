// src/components/interviewer/components/InfiniteScrollTable.jsx
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// Utilities
import {
  getJobLabel,
  getSpecialization,
} from "../../../../utils/util";
import {
  formatDate,
  formatTime,
  formatExperience,
} from "../utils/formatters";
import { LoadingState } from "../../../shared/loading-error-state";
import { ActionButtons } from "./ActionButtons";
import Empty from "../../../shared/Empty";

/**
 * Table component with infinite scroll capability
 */
const InfiniteScrollTable = ({
  data,
  isLoading,
  loaderRef,
  title,
}) => {
  const navigate = useNavigate();
  const tableHeadingAndBodyClassName =
    "px-4 text-left text-wrap";

  return (
    <div className="px-3 h-60 overflow-y-auto">
      {data.length === 0 ? (
        <Empty description="No interviews found" />
      ) : (
        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-black text-xs font-semibold uppercase grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1.5fr] items-center">
              <th className={tableHeadingAndBodyClassName}>
                Name
              </th>
              <th className={tableHeadingAndBodyClassName}>
                Role
              </th>
              <th className={tableHeadingAndBodyClassName}>
                Function
              </th>
              <th className={tableHeadingAndBodyClassName}>
                Date
              </th>
              <th className={tableHeadingAndBodyClassName}>
                Time
              </th>
              <th className={tableHeadingAndBodyClassName}>
                Experience
              </th>
              <th className={tableHeadingAndBodyClassName}>
                Company
              </th>
              <th className="px-4 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td colSpan={8} className="p-0">
                  <div className="bg-[#EBEBEB80] text-2xs rounded-2xl font-normal grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1.5fr] items-center py-3">
                    <span
                      className={
                        tableHeadingAndBodyClassName
                      }
                    >
                      {item.candidate.name}
                    </span>
                    <span
                      className={
                        tableHeadingAndBodyClassName
                      }
                    >
                      {getJobLabel(
                        item.candidate.designation?.name
                      ) || "N/A"}
                    </span>
                    <span
                      className={
                        tableHeadingAndBodyClassName
                      }
                    >
                      {getSpecialization(
                        item.candidate.specialization
                      ) || "N/A"}
                    </span>
                    <span
                      className={
                        tableHeadingAndBodyClassName
                      }
                    >
                      {formatDate(item.scheduled_time)}
                    </span>
                    <span
                      className={
                        tableHeadingAndBodyClassName
                      }
                    >
                      {formatTime(item.scheduled_time)}
                    </span>
                    <span
                      className={
                        tableHeadingAndBodyClassName
                      }
                    >
                      {formatExperience(
                        item.candidate.year,
                        item.candidate.month
                      )}
                    </span>
                    <span
                      className={
                        tableHeadingAndBodyClassName
                      }
                    >
                      {item.candidate.company || "N/A"}
                    </span>
                    <span className="px-2 flex gap-x-1 items-center justify-center">
                      <ActionButtons
                        navigate={navigate}
                        candidate={item.candidate}
                        meet_link={item.meeting_link}
                        title={title}
                        scheduled_time={item.scheduled_time}
                      />
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Loader element - this is what triggers loading more data */}
      <div
        ref={loaderRef}
        className=" w-full flex items-center justify-center"
      >
        {isLoading && <LoadingState />}
      </div>
    </div>
  );
};

InfiniteScrollTable.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  loaderRef: PropTypes.func,
  title: PropTypes.string,
};

export default InfiniteScrollTable;
