import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.post(
        "/api/refresh/",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const accessToken = response.data.data.access;
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
      const role = response.data.data.role;
      const name = response.data.data.name;
      const email = response.data.data.email;
      setAuth({ accessToken, role, name, email });
      return response.data.access;
    } catch (error) {
      console.log(error);
    }
  };
  return refresh;
};

export default useRefreshToken;
