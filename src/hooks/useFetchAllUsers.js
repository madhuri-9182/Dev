import { useQuery } from "@tanstack/react-query";
import axios from "../api/axios";

const fetchAllUsers = async () => {
  let allUsers = [];
  let nextUrl = `/api/client/client-user/?limit=10&offset=0`;

  while (nextUrl) {
    const response = await axios.get(nextUrl);
    const users = response.data.data.results;
    allUsers = [...allUsers, ...users];

    nextUrl = response.data.data.next || null;
  }

  return allUsers.map(({ id, name }) => ({
    id,
    name,
  }));
};

const useAllUsers = () => {
  return useQuery({
    queryKey: ["all-users"],
    queryFn: fetchAllUsers,
    staleTime: 1000 * 60 * 5, // Cache the data for 5 minutes
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });
};

export default useAllUsers;
