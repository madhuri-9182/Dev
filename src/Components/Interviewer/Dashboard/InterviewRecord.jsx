import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

// API imports
import {
  getAcceptedInterviews,
  getInterviewHistory,
  getPendingFeedbackInterviews,
} from "../api";
import useAuth from "../../../hooks/useAuth";

// Component imports
import Heading from "./Components/Heading";
import Table from "./Components/Table";
import VerificationAlert from "./Components/VerificationAlert";

function InterviewRecord() {
  const { auth } = useAuth();

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
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });

  // Infinite query for pending feedback
  const pendingFeedbackQuery = useInfiniteQuery({
    queryKey: ["pendingFeedback", auth],
    queryFn: ({ pageParam = 1 }) =>
      getPendingFeedbackInterviews(pageParam),
    getNextPageParam: (lastPage) =>
      getNextPageFromUrl(lastPage.next),
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });

  // Infinite query for interview history
  const interviewHistoryQuery = useInfiniteQuery({
    queryKey: ["interviewHistory", auth],
    queryFn: ({ pageParam = 1 }) =>
      getInterviewHistory(pageParam),
    getNextPageParam: (lastPage) =>
      getNextPageFromUrl(lastPage.next),
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
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

  // Check if any query has failed with verification error
  const hasVerificationError =
    (acceptedInterviewsQuery.data?.pages[0]?.status ===
      "failed" &&
      acceptedInterviewsQuery.data?.pages[0]?.message?.includes(
        "please verify your email and phone"
      )) ||
    (pendingFeedbackQuery.data?.pages[0]?.status ===
      "failed" &&
      pendingFeedbackQuery.data?.pages[0]?.message?.includes(
        "please verify your email and phone"
      )) ||
    (interviewHistoryQuery.data?.pages[0]?.status ===
      "failed" &&
      interviewHistoryQuery.data?.pages[0]?.message?.includes(
        "please verify your email and phone"
      ));
  return (
    <div className="flex h-full px-8 gap-x-5">
      {!hasVerificationError ? (
        <>
          <div className="w-full pt-8 flex flex-col gap-y-5">
            <div className="flex flex-col gap-y-3">
              <Heading
                title={"Accepted Interviews"}
                count={acceptedCount}
              />
              <Table
                query={acceptedInterviewsQuery}
                data={acceptedInterviews}
                loaderRef={acceptedRef}
                title={"Accepted Interviews"}
              />
            </div>

            <div className="flex flex-col gap-y-3">
              <Heading
                title={"Pending Feedback"}
                count={pendingCount}
              />
              <Table
                query={pendingFeedbackQuery}
                data={pendingFeedback}
                loaderRef={pendingRef}
                title={"Pending Feedback"}
              />
            </div>

            <div className="flex flex-col gap-y-3">
              <Heading
                title={"Interview History"}
                count={historyCount}
              />
              <Table
                query={interviewHistoryQuery}
                data={interviewHistory}
                loaderRef={historyRef}
                title={"Interview History"}
              />
            </div>
          </div>
        </>
      ) : (
        <VerificationAlert />
      )}
    </div>
  );
}

export default InterviewRecord;
