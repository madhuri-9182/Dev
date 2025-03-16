import { useQuery } from "@tanstack/react-query";
import axios from "../api/axios";
import useAuth from "./useAuth";

const fetchAllCandidates = async () => {
  let allCandidates = [];
  let nextUrl = "/api/client/candidates/?limit=10&offset=0";

  while (nextUrl) {
    const response = await axios.get(nextUrl);
    const candidates = response.data.results;
    allCandidates = [...allCandidates, ...candidates];

    nextUrl = response.data.next || null;
  }
  return allCandidates;
};

const useAllCandidates = () => {
  const { auth } = useAuth();
  return useQuery({
    queryKey: ["all-candidates", auth],
    queryFn: fetchAllCandidates,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export default useAllCandidates;
