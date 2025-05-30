import axios from "../../../api/axios";

export const parseResume = async (file) => {
  const response = await axios.post(
    "/api/client/parse-resume/",
    file
  );
  return response.data;
};

export const addCandidate = async (data) => {
  const response = await axios.post(
    "/api/client/candidates/",
    data
  );
  return response.data;
};

export const updateCandidate = async ({ id, data }) => {
  const response = await axios.patch(
    `/api/client/candidate/${id}/`,
    data
  );
  return response.data;
};

export const getCandidates = async ({ queryKey }) => {
  const [, params] = queryKey;
  const response = await axios.get(
    "/api/client/candidates/",
    {
      params: getQueryParams(params),
    }
  );
  return response.data;
};

const getQueryParams = (params) => {
  const queryParams = {};
  queryParams.limit = 10;
  queryParams.offset = (params.page - 1) * 10;
  if (params.job_id) {
    queryParams.job_id = params.job_id;
  }
  if (params.status !== "All") {
    queryParams.status = params.status;
  }
  if (params.q) {
    queryParams.q = params.q;
  }
  if(params.specialization){
    queryParams.specialization = params.specialization
  }
  return queryParams;
};

export const deleteCandidate = async ({ id, reason }) => {
  const response = await axios.delete(
    `/api/client/candidate/${id}/`,
    {
      data: {
        reason,
      },
    }
  );
  return response.data;
};

export const getInterviewAvailability = async (data) => {
  const response = await axios.get(
    "/api/client/interviewer-availability/",
    {
      params: data,
    }
  );
  return response.data;
};

export const scheduleInterview = async (data) => {
  const response = await axios.post(
    "/api/interviewer/interviewer-request-notification/",
    data
  );
  return response.data;
};
