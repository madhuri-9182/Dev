import axios from "../../api/axios";
export const googleCalendarAuthInitialization =
  async () => {
    const response = await axios.get(
      "/api/google-auth/init/"
    );
    console.log(response.data);
    return response.data;
  };

export const getGoogleEvents = async () => {
  const response = await axios.get("/api/events");
  return response.data;
};

export const interviewAcceptOrReject = async (param) => {
  const response = await axios.post(
    `/api/interviewer/interviewer-requst-confirmation/${param}/`
  );
  return response.data;
};

export const getAcceptedInterviews = async (page) => {
  const response = await axios.get(
    "/api/interviewer/accepted-interviews/",
    {
      params: {
        limit: 10,
        offset: (page - 1) * 10,
      },
    }
  );
  return response.data;
};

export const getPendingFeedbackInterviews = async (
  page
) => {
  const response = await axios.get(
    "/api/interviewer/pending-feedback/",
    {
      params: {
        limit: 10,
        offset: (page - 1) * 10,
      },
    }
  );
  return response.data;
};

export const getInterviewHistory = async (page) => {
  const response = await axios.get(
    "/api/interviewer/interview-history/",
    {
      params: {
        limit: 10,
        offset: (page - 1) * 10,
      },
    }
  );
  return response.data;
};

export const getCandidateFeedback = async (id) => {
  const response = await axios.get(
    `/api/interviewer/interview-feedback/${id}/`
  );
  return response.data;
};

export const updateCandidateFeedback = async ({
  id,
  data,
}) => {
  const response = await axios.patch(
    `/api/interviewer/interview-feedback/${id}/`,
    data
  );
  return response.data;
};
