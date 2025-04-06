import axios from "../../../api/axios";

export const getFinance = async ({
  page = 1,
  param = {},
}) => {
  try {
    const response = await axios.get(
      "/api/client/finance/",
      {
        params: {
          limit: 10,
          offset: (page - 1) * 10,
          finance_month: param.finance_month,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching finance data:", error);
    throw error;
  }
};

export const getLastMonthFinance = async () => {
  const response = await axios.get("/api/client/finance/", {
    params: {
      finance_month: "last_month",
    },
  });
  return response.data;
};
