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
      is_diversity_hiring,
    }) => ({
      id,
      name,
      clients,
      hiring_manager,
      specialization,
      is_diversity_hiring,
    })
  );
};

const useAllJobs = () => {
  const { auth } = useAuth();
  return useQuery({
    queryKey: ["all-jobs", auth],
    queryFn: fetchAllJobs,
    staleTime: 1000 * 60 * 4, // Cache the data for 5 minutes
    refetchOnWindowFocus: false, // Prevent refetching on window focus
    refetchInterval: 1000 * 60 * 4,
  });
};

export default useAllJobs;
