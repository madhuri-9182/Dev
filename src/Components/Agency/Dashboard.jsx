import { useMemo, useState } from "react";
import useAllJobs from "../../hooks/useFetchAllJobs";
import TopDashboard from "./components/TopDashboard";
import DashboardJobListing from "./components/DashboardJobListing";

function Dashboard() {
  const { data: allJobs } = useAllJobs();
  const [jobRole, setJobRole] = useState(null);

  // Process the all jobs data once to group by name
  const groupedJobs = useMemo(() => {
    if (!allJobs) return {};

    return allJobs.reduce((acc, job) => {
      if (job && job.name) {
        if (!acc[job.name]) {
          acc[job.name] = [];
        }
        acc[job.name].push(job.id);
      }
      return acc;
    }, {});
  }, [allJobs]);

  // Create job status array based on selected job role
  const jobStatus = useMemo(() => {
    return groupedJobs?.[jobRole]
      ? [groupedJobs?.[jobRole]]
      : [];
  }, [groupedJobs, jobRole]);

  // Handler for job role selection from the top dashboard
  const handleJobRoleSelect = (role) => {
    setJobRole(role);
  };

  return (
    <div className="w-full">
      {/* Top dashboard section with its own API handling */}
      <TopDashboard onJobRoleSelect={handleJobRoleSelect} />

      {/* Job listing section with its own API handling */}
      <DashboardJobListing jobStatus={jobStatus} />
    </div>
  );
}

export { Dashboard as AgencyDashboard };
