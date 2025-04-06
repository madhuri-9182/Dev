import axios from "../../../api/axios";

/**
 * Fetches finance data with optional pagination and filtering
 * @param {Object} options - Function options
 * @param {number} options.page - Page number (starting from 1)
 * @param {Object} options.param - Additional parameters
 * @returns {Promise} API response with finance data
 */
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

/**
 * Fetches finance data specifically for the last month
 * @returns {Promise} API response with last month's finance data
 */
export const getLastMonthFinance = async () => {
  const response = await axios.get("/api/client/finance/", {
    params: {
      finance_month: "last_month",
    },
  });
  return response.data;
};

/**
 * Fetches finance data for a specific date range
 * @param {Object} dateRange - The date range to fetch data for
 * @param {string} dateRange.from - Start date in DD/MM/YYYY format
 * @param {string} dateRange.to - End date in DD/MM/YYYY format
 * @returns {Promise} API response with finance data for the date range
 */
// export const getFinanceByDateRange = async (dateRange) => {
//   try {
//     const response = await axios.get("/api/client/finance/", {
//       params: {
//         from_date: dateRange.from,
//         to_date: dateRange.to,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching finance data by date range:", error);
//     throw error;
//   }
// };
