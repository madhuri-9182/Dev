import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      // Check if the current window endpoint matches verification/:id
      if (
        window.location.pathname.startsWith(
          "/verification/"
        )
      ) {
        throw new Error("Moving to Verification page"); // Call logout function
      }

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
      const is_password_change =
        response.data.data.is_password_change;
      const is_policy_and_tnc_accepted =
        response.data.data.is_policy_and_tnc_accepted;
      setAuth({
        accessToken,
        role,
        name,
        email,
        is_policy_and_tnc_accepted,
        is_password_change,
      });
      return response.data.access;
    } catch (error) {
      console.log(error);
    }
  };
  return refresh;
};

export default useRefreshToken;
