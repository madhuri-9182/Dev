import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardApi } from "./api";
import {
  LoadingState,
  ErrorState,
} from "../../shared/loading-error-state";
import { getJobLabel } from "../../../utils/util";
import { ALL_TASKS, ANALYTICS, MY_JOBS } from "./constants";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard", auth],
    queryFn: fetchDashboardApi,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  const dashboardData = data?.data || {};

  // Prepare data for each card
  const pendingTasksItems =
    dashboardData?.job_role_aggregates?.map((job_role) => ({
      label: getJobLabel(job_role.name),
      value: job_role.count,
    })) || [];

  const allTasksItems = ALL_TASKS.map((task) => ({
    label: task.label,
    value: task.key
      ? dashboardData?.candidates[task.key] || 0
      : "",
  }));

  const myJobsItems = MY_JOBS.map((job) => ({
    label: job.label,
    value: dashboardData?.job_aggregates[job.key] || 0,
    onClick: ()=> {
      if(job?.state){
        navigate(job.path, {state: job.state});
      } else {
        navigate(job.path);
      }
    }

  }));

  const analyticsItems = ANALYTICS.map((analytics) => ({
    label: analytics.label,
  }));

  const blueGradient =
    "bg-gradient-to-r from-[#2D60FF] to-[#539BFF]";
  const lightBg = "bg-[#E7E4E8CC]";

  // Determine if we need taller light background cards
  const needsTallerCards = pendingTasksItems.length > 4;
  const lightBgCardHeight = needsTallerCards
    ? "h-44"
    : "h-28";

  const filteredAllTaskItems = !needsTallerCards
    ? allTasksItems.slice(0, 4)
    : allTasksItems;

  return (
    <div className="px-20 py-10">
      <div className="grid grid-cols-2 gap-x-24 xl:gap-x-36 gap-y-12 xl:gap-y-16 h-">
        {/* Pending Tasks */}
        <div className="w-full flex flex-col gap-y-6">
          <CardHeader
            title="Pending Tasks"
            count={dashboardData.pending_task || 0}
          />
          <CardItems
            items={pendingTasksItems}
            bgColor={lightBg}
            title="Pending Tasks"
            customClass={lightBgCardHeight}
          />
        </div>

        {/* All Tasks */}
        <div className="w-full flex flex-col gap-y-6">
          <CardHeader
            title="All Tasks"
            count={dashboardData.all_task || 0}
          />
          <CardItems
            items={filteredAllTaskItems}
            bgColor={lightBg}
            customClass={lightBgCardHeight}
          />
        </div>

        {/* My Jobs */}
        <div className="w-full flex flex-col gap-y-6">
          <CardHeader title="My Jobs" />
          <CardItems
            items={myJobsItems}
            bgColor={blueGradient}
            textColor="text-white"
            customClass="h-28"
          />
        </div>

        {/* Analytics */}
        <div className="w-full flex flex-col gap-y-6">
          <CardHeader title="Analytics" />
          <CardItems
            items={analyticsItems}
            bgColor={blueGradient}
            textColor="text-white"
            customClass="h-28"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

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

// Component for displaying card items
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
      className={` grid grid-cols-2 gap-x-16 xl:gap-x-20 gap-y-7 ${customClass} ${
        title === "Pending Tasks" && items.length > 4
          ? "overflow-auto hover-scrollbar"
          : ""
      }`}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`flex flex-col gap-1 ${textColor} cursor-pointer`}
          onClick={item.onClick}
        >
          <p className="text-2xs font-medium">
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

CardHeader.propTypes = {
  title: PropTypes.string,
  count: PropTypes.number,
};

CardItems.propTypes = {
  items: PropTypes.array,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  customClass: PropTypes.string,
  title: PropTypes.string,
};
