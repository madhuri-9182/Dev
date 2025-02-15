import axios from "../../../api/axios";

export const fetchJobs = async ({ queryKey }) => {
  const [, params] = queryKey;
  const response = await axios.get("/api/client/jobs/", {
    params: getQueryParams(params),
  });
  return response.data;
};

const getQueryParams = (params) => {
  const queryParams = {};
  queryParams.limit = 10;
  queryParams.offset = (params.page - 1) * 10;
  if (params.job_ids.length) {
    queryParams.job_ids = params.job_ids.join(",");
  }
  if (params.hiring_manager_ids.length) {
    queryParams.hiring_manager_ids =
      params.hiring_manager_ids.join(",");
  }
  if (params.recruiter_ids.length) {
    queryParams.recruiter_ids =
      params.recruiter_ids.join(",");
  }
  if (params.post_job_date) {
    queryParams.post_job_date = params.post_job_date;
  }
  return queryParams;
};

export const archiveJob = async ({ archiveId, reason }) => {
  const response = await axios.patch(
    `/api/client/job/${archiveId}/`,
    {
      reason_for_archived: reason,
    }
  );
  return response.data;
};

export const createJob = async (jobData) => {
  const response = await axios.post(
    "/api/client/jobs/",
    jobData
  );
  return response.data;
};

export const updateJob = async ({ jobData, id }) => {
  const response = await axios.patch(
    `/api/client/job/${id}/`,
    jobData
  );
  return response.data;
};
