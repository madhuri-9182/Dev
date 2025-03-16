// src/components/interviewer/InterviewRecord.jsx
import { useNavigate } from "react-router-dom";
import {
  useMutation,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

// API imports
import axios from "../../../api/axios";
import {
  getGoogleEvents,
  getAcceptedInterviews,
  getInterviewHistory,
  getPendingFeedbackInterviews,
} from "../api";
import useAuth from "../../../hooks/useAuth";

// Component imports
import Heading from "./Components/Heading";
import InfiniteScrollTable from "./Components/InfiniteScrollTable";
import Sidebar from "./Components/Sidebar";

// Constants
const QUERY_STALE_TIME = 5 * 60 * 1000; // 5 minutes

function InterviewRecord() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  // Create InView hooks for each table
  const [acceptedRef, isAcceptedInView] = useInView({
    threshold: 0.1,
  });
  const [pendingRef, isPendingInView] = useInView({
    threshold: 0.1,
  });
  const [historyRef, isHistoryInView] = useInView({
    threshold: 0.1,
  });

  // Helper function for extracting next page parameter
  const getNextPageFromUrl = (nextUrl) => {
    if (nextUrl) {
      const url = new URL(nextUrl);
      const pageParam = url.searchParams.get("offset");
      if (pageParam) {
        return parseInt(pageParam) / 10 + 1; // Converting offset to page number
      }
    }
    return undefined; // No more pages
  };

  // Infinite query for accepted interviews
  const acceptedInterviewsQuery = useInfiniteQuery({
    queryKey: ["acceptedInterviews", auth],
    queryFn: ({ pageParam = 1 }) =>
      getAcceptedInterviews(pageParam),
    getNextPageParam: (lastPage) =>
      getNextPageFromUrl(lastPage.next),
    staleTime: QUERY_STALE_TIME,
  });

  // Infinite query for pending feedback
  const pendingFeedbackQuery = useInfiniteQuery({
    queryKey: ["pendingFeedback", auth],
    queryFn: ({ pageParam = 1 }) =>
      getPendingFeedbackInterviews(pageParam),
    getNextPageParam: (lastPage) =>
      getNextPageFromUrl(lastPage.next),
    staleTime: QUERY_STALE_TIME,
  });

  // Infinite query for interview history
  const interviewHistoryQuery = useInfiniteQuery({
    queryKey: ["interviewHistory", auth],
    queryFn: ({ pageParam = 1 }) =>
      getInterviewHistory(pageParam),
    getNextPageParam: (lastPage) =>
      getNextPageFromUrl(lastPage.next),
    staleTime: QUERY_STALE_TIME,
  });

  // Load more data when intersecting with viewport
  useEffect(() => {
    if (
      isAcceptedInView &&
      acceptedInterviewsQuery.hasNextPage &&
      !acceptedInterviewsQuery.isFetchingNextPage
    ) {
      acceptedInterviewsQuery.fetchNextPage();
    }
  }, [isAcceptedInView, acceptedInterviewsQuery]);

  useEffect(() => {
    if (
      isPendingInView &&
      pendingFeedbackQuery.hasNextPage &&
      !pendingFeedbackQuery.isFetchingNextPage
    ) {
      pendingFeedbackQuery.fetchNextPage();
    }
  }, [isPendingInView, pendingFeedbackQuery]);

  useEffect(() => {
    if (
      isHistoryInView &&
      interviewHistoryQuery.hasNextPage &&
      !interviewHistoryQuery.isFetchingNextPage
    ) {
      interviewHistoryQuery.fetchNextPage();
    }
  }, [isHistoryInView, interviewHistoryQuery]);

  // Process flattened data for each query
  const acceptedInterviews =
    acceptedInterviewsQuery.data?.pages.flatMap(
      (page) => page.results
    ) || [];
  const pendingFeedback =
    pendingFeedbackQuery.data?.pages.flatMap(
      (page) => page.results
    ) || [];
  const interviewHistory =
    interviewHistoryQuery.data?.pages.flatMap(
      (page) => page.results
    ) || [];

  const acceptedCount =
    acceptedInterviewsQuery.data?.pages[0]?.count || 0;
  const pendingCount =
    pendingFeedbackQuery.data?.pages[0]?.count || 0;
  const historyCount =
    interviewHistoryQuery.data?.pages[0]?.count || 0;

  // Mutation for checking events API
  const checkEventsMutation = useMutation({
    mutationFn: getGoogleEvents,
    onSuccess: (data) => {
      if (data && data.status === "success") {
        navigate("/interviewer/calendar");
      } else {
        handleBlockCalendar();
      }
    },
    onError: (error) => {
      console.error("Error checking events API:", error);
      handleBlockCalendar();
    },
  });

  const handleBlockCalendar = async () => {
    try {
      const response = await axios.get(
        "/api/google-auth/init/"
      );
      if (response.data?.data?.url) {
        window.location.href = response.data.data.url;
      }
    } catch (error) {
      console.error(
        "Error initializing Google Auth:",
        error
      );
    }
  };

  const handleCalendarClick = () => {
    checkEventsMutation.mutate();
  };

  return (
    <div className="flex h-full px-8 gap-x-5">
      <div className="w-full h-screen pt-8 flex flex-col gap-y-5">
        <div className="flex flex-col gap-y-3">
          <Heading
            title={"Accepted Interviews"}
            count={acceptedCount}
          />
          {acceptedInterviewsQuery.isLoading ? (
            <div className="text-center py-4">
              Loading accepted interviews...
            </div>
          ) : acceptedInterviewsQuery.isError ? (
            <div className="text-center py-4 text-red-500">
              Error loading accepted interviews:{" "}
              {acceptedInterviewsQuery.error.message}
            </div>
          ) : (
            <InfiniteScrollTable
              data={acceptedInterviews}
              isLoading={
                acceptedInterviewsQuery.isFetchingNextPage
              }
              loaderRef={acceptedRef}
            />
          )}
        </div>

        <div className="flex flex-col gap-y-3">
          <Heading
            title={"Pending Feedback"}
            count={pendingCount}
          />
          {pendingFeedbackQuery.isLoading ? (
            <div className="text-center py-4">
              Loading pending feedback...
            </div>
          ) : pendingFeedbackQuery.isError ? (
            <div className="text-center py-4 text-red-500">
              Error loading pending feedback:{" "}
              {pendingFeedbackQuery.error.message}
            </div>
          ) : (
            <InfiniteScrollTable
              data={pendingFeedback}
              isLoading={
                pendingFeedbackQuery.isFetchingNextPage
              }
              loaderRef={pendingRef}
            />
          )}
        </div>

        <div className="flex flex-col gap-y-3">
          <Heading
            title={"Interview History"}
            count={historyCount}
          />
          {interviewHistoryQuery.isLoading ? (
            <div className="text-center py-4">
              Loading interview history...
            </div>
          ) : interviewHistoryQuery.isError ? (
            <div className="text-center py-4 text-red-500">
              Error loading interview history:{" "}
              {interviewHistoryQuery.error.message}
            </div>
          ) : (
            <InfiniteScrollTable
              data={interviewHistory}
              isLoading={
                interviewHistoryQuery.isFetchingNextPage
              }
              loaderRef={historyRef}
            />
          )}
        </div>
      </div>

      {/* Button Sidebar */}
      <Sidebar
        handleCalendarClick={handleCalendarClick}
        isLoading={checkEventsMutation.isLoading}
      />
    </div>
  );
}

export default InterviewRecord;
