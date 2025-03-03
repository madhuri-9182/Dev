import axios from "../../../api/axios";

export const fetchUsers = async (page) => {
  const limit = 10;
  const offset = (page - 1) * limit;
  const response = await axios.get(
    `/api/client/client-user/`,
    {
      params: { limit, offset },
    }
  );
  return response.data;
};

export const updateUser = async ({ userData, id }) => {
  const response = await axios.patch(
    `/api/client/client-user/${id}/`,
    userData
  );
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post(
    "/api/client/client-user/",
    userData
  );
  return response.data;
};
