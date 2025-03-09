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
