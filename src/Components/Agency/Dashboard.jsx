import { useMemo } from "react";
import { useJobContext } from "../../context/JobContext";
import { fetchJobs } from "../Client/Jobs/api";
import { useQuery } from "@tanstack/react-query";
import {
  getErrorMessage,
  getJobLabel,
} from "../../utils/util";
import {
  ErrorState,
  LoadingState,
} from "../shared/loading-error-state";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { JobCard } from "../Client/Jobs/JobListingComponents";
import { Pagination } from "@mui/material";
import Empty from "../shared/Empty";
import { fetchDashboardApi } from "../Client/Dashboard/api";
import { MY_AGENCY_JOBS } from "../Client/Dashboard/constants";
import PropTypes from "prop-types";

function Dashboard() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const { currentPage, handleChangePage } = useJobContext();

  const handleAddCandidateClick = (job) => {
    navigate("/agency/candidates/add-candidate", {
      state: {
        selectedJob: {
          id: job.id,
          name: job.name,
          label: getJobLabel(job.name),
          ...(job.specialization && {
            function: job.specialization,
          }),
        },
      },
    });
  };

  const queryFilters = useMemo(() => {
    return {
      page: currentPage,
    };
  }, [currentPage]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["agency-jobs", queryFilters, auth],
    queryFn: fetchJobs,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    error: dashboardError,
  } = useQuery({
    queryKey: ["agency-dashboard", auth],
    queryFn: fetchDashboardApi,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5,
  });

  const pendingTasksItems =
    dashboardData?.data?.job_role_aggregates?.map(
      (job_role) => ({
        label: getJobLabel(job_role.name),
        value: job_role.count,
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

  if (isLoading || isDashboardLoading)
    return <LoadingState />;
  if (isError || isDashboardError)
    return (
      <ErrorState
        message={getErrorMessage(error || dashboardError)}
      />
    );

  const lightBg = "bg-[#E7E4E8CC]";

  return (
    <div className="w-full">
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

      {data?.count ? (
        <>
          <div className="w-full flex flex-col gap-2">
            {data?.results.map((job, index) => (
              <JobCard
                key={job.id || index}
                job={job}
                onAddCandidate={handleAddCandidateClick}
              />
            ))}
          </div>

          <Pagination
            count={Math.ceil(data?.count / 10)}
            className="mt-4 flex justify-end"
            onChange={(e, page) => handleChangePage(page)}
            variant="outlined"
            size="small"
            shape="rounded"
            page={currentPage}
          />
        </>
      ) : (
        <Empty description="No Jobs Found" />
      )}
    </div>
  );
}

export { Dashboard as AgencyDashboard };

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
      className={` grid grid-cols-2 gap-x-16 xl:gap-x-20 gap-y-7 ${customClass} ${
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
