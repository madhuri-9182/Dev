import { useQuery } from "@tanstack/react-query";
import axios from "../api/axios";
import useAuth from "./useAuth";

const fetchAllJobs = async () => {
  let allJobs = [];
  let nextUrl = `/api/client/jobs/?limit=10&offset=0`;

  while (nextUrl) {
    const response = await axios.get(nextUrl);
    const jobs = response.data.results;
    allJobs = [...allJobs, ...jobs];

    nextUrl = response.data.next || null;
  }
  return allJobs.map(
    ({
      id,
      name,
      clients,
      hiring_manager,
      specialization,
    }) => ({
      id,
      name,
      clients,
      hiring_manager,
      specialization,
    })
  );
};

const useAllJobs = () => {
  const { auth } = useAuth();
  return useQuery({
    queryKey: ["all-jobs", auth],
    queryFn: fetchAllJobs,
    staleTime: 1000 * 60 * 5, // Cache the data for 5 minutes
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });
};

export default useAllJobs;
