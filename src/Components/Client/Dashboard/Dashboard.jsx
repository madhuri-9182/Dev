import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardApi } from "./api";
import {
  LoadingState,
  ErrorState,
} from "../../shared/loading-error-state";
import {
  getErrorMessage,
  getJobLabel,
} from "../../../utils/util";
import { ALL_TASKS, MY_JOBS } from "./constants";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Add styles for the carousel animations
const animationStyles = `
.slide-from-right {
  animation: slideFromRight 300ms ease-in-out;
}

.slide-from-left {
  animation: slideFromLeft 300ms ease-in-out;
}

@keyframes slideFromRight {
  0% { transform: translateX(100%); }
  100% { transform: translateX(0); }
}

@keyframes slideFromLeft {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(0); }
}
`;

const Dashboard = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dashboard", auth],
    queryFn: fetchDashboardApi,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) return <LoadingState />;
  if (isError)
    return <ErrorState message={getErrorMessage(error)} />;

  const dashboardData = data?.data || {};

  // Prepare data for each card
  const pendingTasksItems =
    dashboardData?.job_role_aggregates?.map((job_role) => ({
      label: getJobLabel(job_role.name),
      value: job_role.count,
      onClick: () => {
        navigate("/client/jobs", {
          state: { job_role: job_role.name },
        });
      },
    })) || [];

  const allTasksItems = ALL_TASKS.map((task) => ({
    label: task.label,
    value: task.key
      ? dashboardData?.candidates[task.key] || 0
      : "",
    onClick: () => {
      if (task.path) {
        if (task?.state) {
          navigate(task.path, { state: task.state });
        } else {
          navigate(task.path);
        }
      }
    },
  }));

  const myJobsItems = MY_JOBS.map((job) => ({
    label: job.label,
    value: dashboardData?.job_aggregates[job.key] || 0,
    onClick: () => {
      if (job?.state) {
        navigate(job.path, { state: job.state });
      } else {
        navigate(job.path);
      }
    },
  }));

  // const analyticsItems = ANALYTICS.map((analytics) => ({
  //   label: analytics.label,
  // }));

  const blueGradient =
    "bg-gradient-to-r from-[#2D60FF] to-[#539BFF]";
  const lightBg = "bg-[#E7E4E8CC]";

  const lightBgCardHeight = "h-28";

  const filteredAllTaskItems = allTasksItems.slice(0, 4);

  const pendingTasksCount = pendingTasksItems.reduce(
    (acc, item) => acc + item.value,
    0
  );
  const allTasksCount = allTasksItems.reduce(
    (acc, item) => acc + item.value,
    0
  );

  return (
    <div className="px-20 py-10">
      {/* Add the animation styles to the document */}
      <style
        dangerouslySetInnerHTML={{
          __html: animationStyles,
        }}
      />
      <div className="grid grid-cols-2 gap-x-24 xl:gap-x-36 gap-y-12 xl:gap-y-16 h-">
        {/* Pending Tasks */}
        <div className="w-full flex flex-col gap-y-6">
          <CardHeader
            title="Pending Tasks"
            count={pendingTasksCount || 0}
          />
          <CarouselCardItems
            items={pendingTasksItems}
            bgColor={lightBg}
            title="Pending Tasks"
            customClass={lightBgCardHeight}
            itemsPerPage={4}
          />
        </div>

        {/* All Tasks */}
        <div className="w-full flex flex-col gap-y-6">
          <CardHeader
            title="All Tasks"
            count={allTasksCount || 0}
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
        {/* <div className="w-full flex flex-col gap-y-6">
          <CardHeader title="Analytics" />
          <CardItems
            items={analyticsItems}
            bgColor={blueGradient}
            textColor="text-white"
            customClass="h-28"
          />
        </div> */}
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

// Component for displaying card items with carousel
const CarouselCardItems = ({
  items,
  bgColor,
  textColor = "text-black",
  customClass = "",
  itemsPerPage = 4,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationClass, setAnimationClass] = useState("");
  const [displayedPage, setDisplayedPage] = useState(0);

  // Calculate total pages
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Get items for a specific page
  const getPageItems = (pageNum) => {
    const startIndex = pageNum * itemsPerPage;
    return items.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  };

  // Handle page change
  const changePage = (newPage) => {
    if (newPage === currentPage || isAnimating) return;
    setIsAnimating(true);

    if (newPage > currentPage) {
      // Going to next page (slide from right to left)
      setAnimationClass("slide-from-right");
    } else {
      // Going to previous page (slide from left to right)
      setAnimationClass("slide-from-left");
    }

    // Set page that will be shown during animation
    setDisplayedPage(newPage);

    // Small delay to allow animation to complete
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsAnimating(false);
      setAnimationClass("");
    }, 300);
  };

  // Next and previous page handlers
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      changePage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      changePage(currentPage - 1);
    }
  };

  // Determine which page to show
  const pageToShow = isAnimating
    ? displayedPage
    : currentPage;
  const currentItems = getPageItems(pageToShow);

  return (
    <div
      className={`shadow ${bgColor} p-6 xl:p-8 rounded-2xl relative`}
    >
      <div className="relative overflow-hidden">
        <div
          className={`grid grid-cols-2 gap-x-16 xl:gap-x-20 gap-y-7 ${customClass} ${animationClass}`}
        >
          {currentItems.map((item, idx) => (
            <div
              key={`${pageToShow}-${idx}`}
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

      {/* Navigation controls */}
      {totalPages > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-1 px-6 xl:px-8">
          {/* Left arrow button - now next to dots */}
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            className={`flex items-center justify-center h-6 w-6 ${
              currentPage === 0
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            aria-label="Previous page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={
                textColor === "text-white"
                  ? "white"
                  : "#333B69"
              }
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          {/* Pagination dots */}
          <div className="flex justify-center gap-1">
            {Array.from({ length: totalPages }).map(
              (_, idx) => (
                <button
                  key={idx}
                  onClick={() => changePage(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    pageToShow === idx
                      ? "bg-[#056DDC] w-4"
                      : "bg-gray-300"
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              )
            )}
          </div>

          {/* Right arrow button - now next to dots */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            className={`flex items-center justify-center h-6 w-6 ${
              currentPage === totalPages - 1
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            aria-label="Next page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={
                textColor === "text-white"
                  ? "white"
                  : "#333B69"
              }
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

// Original CardItems component
const CardItems = ({
  items,
  bgColor,
  textColor = "text-black",
  customClass = "",
}) => (
  <div
    className={`shadow ${bgColor} p-6 xl:p-8 rounded-2xl`}
  >
    <div
      className={`grid grid-cols-2 gap-x-16 xl:gap-x-20 gap-y-7 ${customClass}`}
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

CarouselCardItems.propTypes = {
  items: PropTypes.array,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  customClass: PropTypes.string,
  title: PropTypes.string,
  itemsPerPage: PropTypes.number,
};
