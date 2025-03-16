// src/components/interviewer/components/InfiniteScrollTable.jsx
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  ArrowSquareRight,
  Eye,
  MessageText1,
  ReceiveSquare,
  TickSquare,
} from "iconsax-react";

// Utilities
import {
  createFileFromUrl,
  getJobLabel,
  getSpecialization,
  handleFileDownload,
} from "../../../../utils/util";
import {
  formatDate,
  formatTime,
  formatExperience,
} from "../utils/formatters";
import { LoadingState } from "../../../shared/loading-error-state";

/**
 * Action buttons component for table rows
 */
const ActionButtons = ({
  navigate,
  candidate,
  title,
  meet_link,
}) => {
  const isPendingFeedback = title === "Pending Feedback";
  const isInterviewHistory = title === "Interview History";
  const isAcceptedInterviews =
    title === "Accepted Interviews";

  if (isInterviewHistory) {
    return null;
  }

  return (
    <>
      <ReceiveSquare
        size={16}
        color="#171717"
        className="cursor-pointer"
        onClick={async () => {
          const file = await createFileFromUrl(
            candidate.cv
          );
          // download the file
          handleFileDownload(file);
        }}
      />
      <Eye
        size={16}
        color="#171717"
        className="cursor-pointer"
      />
      {isAcceptedInterviews && (
        <button
          disabled
          className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          <TickSquare size={16} color="#171717" />
        </button>
      )}
      <button
        disabled={isAcceptedInterviews}
        className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      >
        <MessageText1
          size={16}
          color="#171717"
          onClick={() => {
            if (isPendingFeedback) {
              navigate(
                `/interviewer/feedback/${candidate.id}`
              );
            }
          }}
        />
      </button>
      {isAcceptedInterviews && (
        <ArrowSquareRight
          className="cursor-pointer"
          size={16}
          color="#171717"
          onClick={() => {
            window.open(meet_link, "_blank");
          }}
        />
      )}
    </>
  );
};

ActionButtons.propTypes = {
  navigate: PropTypes.func.isRequired,
  candidate: PropTypes.object,
  title: PropTypes.string,
  meet_link: PropTypes.string,
};

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
    <div className="px-3 max-h-60 overflow-y-auto">
      {data.length === 0 ? (
        <p className="text-center text-sm">
          No records found
        </p>
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
                    <span className="px-4 flex gap-x-3 items-center justify-center">
                      <ActionButtons
                        navigate={navigate}
                        candidate={item.candidate}
                        meet_link={item.meet_link}
                        title={title}
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
