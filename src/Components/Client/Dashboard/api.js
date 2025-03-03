import axios from "../../../api/axios";

export const fetchDashboardApi = async () => {
  const response = await axios.get(
    "/api/client/dashboard/"
  );
  return response.data;
};
