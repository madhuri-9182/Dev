import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getErrorMessage,
  getJobLabel,
} from "../../../utils/util";
import {
  ErrorState,
  LoadingState,
} from "../../shared/loading-error-state";
import { fetchDashboardApi } from "../../Client/Dashboard/api";
import { MY_AGENCY_JOBS } from "../../Client/Dashboard/constants";
import useAuth from "../../../hooks/useAuth";
import PropTypes from "prop-types";

// Extracted and reused card components
const CardHeader = ({ title, count = null }) => (
  <div className="items-center gap-2 flex">
    <p className="text-[#333B69] text-md font-semibold">
      {title}
    </p>
    {count !== null && (
      <span className="w-6 h-6 bg-[#056DDC] text-white text-default rounded-full flex items-center justify-center">
        {count}
      </span>
    )}
  </div>
);

const CardItems = ({
  items,
  bgColor,
  textColor = "text-black",
  customClass = "",
  title = "",
}) => (
  <div
    className={`shadow ${bgColor} p-6 xl:p-8 rounded-2xl`}
  >
    <div
      className={`grid grid-cols-2 gap-x-16 xl:gap-x-20 gap-y-7 ${customClass} ${
        title === "Pending Tasks" && items.length > 4
          ? "overflow-auto hover-scrollbar"
          : ""
      }`}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`flex flex-col gap-1 ${textColor}`}
        >
          <p
            className="text-2xs font-medium cursor-pointer hover:underline"
            onClick={item.onClick}
          >
            {item.label}
          </p>
          {item.value !== undefined && (
            <p className="text-xs font-bold">
              {item.value}
            </p>
          )}
        </div>
      ))}
    </div>
  </div>
);

function TopDashboard({ onJobRoleSelect }) {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["agency-dashboard", auth],
    queryFn: fetchDashboardApi,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5,
  });

  if (isLoading) return <LoadingState />;
  if (isError)
    return <ErrorState message={getErrorMessage(error)} />;

  const pendingTasksItems =
    dashboardData?.data?.job_role_aggregates?.map(
      (job_role) => ({
        label: getJobLabel(job_role.name),
        value: job_role.count,
        onClick: () => {
          onJobRoleSelect(job_role.name);
        },
      })
    ) || [];

  const pendingTasksCount = pendingTasksItems?.reduce(
    (acc, item) => acc + item.value,
    0
  );

  const myJobsItems = MY_AGENCY_JOBS.map((job) => ({
    label: job.label,
    value:
      dashboardData?.data?.job_aggregates[job.key] || 0,
    onClick: () => {
      if (job?.state) {
        navigate(job.path, { state: job.state });
      } else {
        navigate(job.path);
      }
    },
  }));

  const lightBg = "bg-[#E7E4E8CC]";

  return (
    <div className="w-full flex gap-x-8 mb-5">
      <div className="w-2/5 flex flex-col gap-y-5">
        <CardHeader
          title={"My Jobs"}
          count={pendingTasksCount || 0}
        />
        <CardItems
          items={pendingTasksItems}
          bgColor={lightBg}
          title="Pending Tasks"
          customClass="h-36"
        />
      </div>
      <div className="w-3/5 flex flex-col gap-y-5">
        <div className="h-6 flex items-center">
          <CardHeader title={"Details"} />
        </div>
        <div className="grid grid-cols-3 gap-x-3">
          {myJobsItems.map((item, index) => {
            // Determine background color based on index
            const bgColor =
              index === 0
                ? "bg-[#E5ECF6]"
                : index === 1
                ? "bg-[#E3F5FF]"
                : "bg-[#E5ECF6]";

            return (
              <div
                key={index}
                onClick={() =>
                  item.onClick && item.onClick()
                }
                className={`${bgColor} rounded-2xl shadow p-6 cursor-pointer transition-transform hover:scale-[1.02]`}
              >
                <div className="h-36">
                  <p className="text-[#333B69] font-medium text-2xs">
                    {item.label}
                  </p>
                  {item.value !== undefined && (
                    <p className="text-[#333B69] text-default font-bold mt-1">
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

TopDashboard.propTypes = {
  onJobRoleSelect: PropTypes.func.isRequired,
};

CardHeader.propTypes = {
  title: PropTypes.string,
  count: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

CardItems.propTypes = {
  items: PropTypes.array,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  customClass: PropTypes.string,
  title: PropTypes.string,
};

export default TopDashboard;
