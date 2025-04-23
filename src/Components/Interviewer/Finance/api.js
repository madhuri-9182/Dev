import axios from "../../../api/axios";

export const getInterviewerFinance = async ({
  page = 1,
}) => {
  const params = {
    limit: 10,
    offset: (page - 1) * 10,
  };

  try {
    const response = await axios.get(
      "/api/interviewer/finance/",
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching finance data:", error);
  }
};

export const getInterviewerLastMonthFinance = async ({
  page = 1,
}) => {
  const params = {
    limit: 10,
    offset: (page - 1) * 10,
    finance_month: "last_month",
  };
  try {
    const response = await axios.get(
      "/api/interviewer/finance/",
      { params }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching last month finance data:",
      error
    );
  }
};
