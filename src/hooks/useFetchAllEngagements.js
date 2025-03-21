import { useQuery } from "@tanstack/react-query";
import axios from "../api/axios";
import useAuth from "./useAuth";

const fetchAllEngagements = async () => {  
  if (window.location.pathname.includes('internal/engagement')) {
    return null; // Return null to indicate no data
  }

  let allCandidates = [];
  let nextUrl = "/api/client/engagements/?limit=10&offset=0";

  while (nextUrl) {
    const response = await axios.get(nextUrl);
    const candidates = response.data.results;
    allCandidates = [...allCandidates, ...candidates];

    nextUrl = response.data.next || null;
  }
  return allCandidates;
};

const useAllEngagements = () => {
  const { auth } = useAuth();
  return useQuery({
    queryKey: ["all-engagements", auth],
    queryFn: fetchAllEngagements,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export default useAllEngagements;
