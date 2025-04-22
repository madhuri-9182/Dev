import {
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { useMemo } from "react";
import dayjs from "dayjs";
import { getFinance, getLastMonthFinance } from "../api";

/**
 * Custom hook for fetching current finance data with pagination
 * @returns {Object} Query results and calculated values
 */
export const useCurrentFinanceData = () => {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["finance"],
    queryFn: ({ pageParam = 1 }) =>
      getFinance({ page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      // Ensure offset is a valid number
      const offset =
        typeof lastPage.offset === "number"
          ? lastPage.offset
          : 0;

      // Calculate total items fetched so far across all pages
      const totalItemsFetched = allPages.reduce(
        (total, page) => total + page.results.length,
        0
      );

      // If we've fetched everything, don't request more
      if (totalItemsFetched >= lastPage.count) {
        return undefined;
      }

      // Calculate next page number based on total fetched
      const nextPage =
        Math.floor(totalItemsFetched / 10) + 1;

      // Add a safety check to prevent duplicate API calls
      // If the next offset would be the same as the current one, return undefined
      if (nextPage * 10 - 10 === offset) {
        return undefined;
      }

      return nextPage;
    },
    // Add this option to prevent excessive refetching
    refetchOnWindowFocus: false,
    // Set a reasonable number of retry attempts
    retry: 1,
  });

  // Calculate total amount
  const totalAmount = useMemo(() => {
    if (!data) return 0;

    return data.pages.reduce((sum, page) => {
      return page.results.reduce((pageSum, item) => {
        return (
          pageSum + (parseFloat(item.client_amount) || 0)
        );
      }, sum);
    }, 0);
  }, [data]);

  // Format the data for display
  const displayData = useMemo(() => {
    return (
      data?.pages.flatMap((page) => page.results) || []
    );
  }, [data]);

  return {
    data,
    displayData,
    totalAmount,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
  };
};

/**
 * Custom hook for fetching last month finance data
 * @returns {Object} Query results and calculated values
 */
export const useLastMonthFinanceData = () => {
  const {
    data: lastMonthData,
    isLoading: isLastMonthLoading,
    isError: isLastMonthError,
  } = useQuery({
    queryKey: ["lastMonthFinance"],
    queryFn: () => getLastMonthFinance(),
    refetchOnWindowFocus: false,
  });

  // Check if there are pending dues from last month
  const hasPendingLastMonthDues = useMemo(() => {
    if (!lastMonthData) return false;
    return lastMonthData.count > 0;
  }, [lastMonthData]);

  // Format the due amount for last month
  const lastMonthDueAmount = useMemo(() => {
    if (!lastMonthData || !lastMonthData.results) return 0;

    return lastMonthData.results.reduce((sum, item) => {
      return sum + (parseFloat(item.client_amount) || 0);
    }, 0);
  }, [lastMonthData]);

  // Get last month's name
  const lastMonthName = dayjs()
    .subtract(1, "month")
    .format("MMMM");

  return {
    lastMonthData,
    hasPendingLastMonthDues,
    lastMonthDueAmount,
    lastMonthName,
    isLastMonthLoading,
    isLastMonthError,
  };
};

/**
 * Custom hook for fetching last month's detailed finance data for modal
 * @param {boolean} isModalOpen - Whether the modal is open
 * @returns {Object} Query results and calculated values for the modal
 */
export const useLastMonthModalData = (isModalOpen) => {
  const {
    data: lastMonthModalData,
    isLoading: isLastMonthModalLoading,
    isFetchingNextPage: isLastMonthModalFetchingNextPage,
    hasNextPage: hasLastMonthModalNextPage,
    fetchNextPage: fetchLastMonthModalNextPage,
    isError: isLastMonthModalError,
    error: lastMonthModalError,
  } = useInfiniteQuery({
    queryKey: ["finance", "lastMonth"],
    queryFn: ({ pageParam = 1 }) =>
      getFinance({
        page: pageParam,
        param: { finance_month: "last_month" },
      }),
    getNextPageParam: (lastPage, allPages) => {
      // Ensure offset is a valid number
      const offset =
        typeof lastPage.offset === "number"
          ? lastPage.offset
          : 0;

      // Calculate total items fetched so far across all pages
      const totalItemsFetched = allPages.reduce(
        (total, page) => total + page.results.length,
        0
      );

      // If we've fetched everything, don't request more
      if (totalItemsFetched >= lastPage.count) {
        return undefined;
      }

      // Calculate next page number based on total fetched
      const nextPage =
        Math.floor(totalItemsFetched / 10) + 1;

      // Add a safety check to prevent duplicate API calls
      // If the next offset would be the same as the current one, return undefined
      if (nextPage * 10 - 10 === offset) {
        return undefined;
      }

      return nextPage;
    },
    enabled: isModalOpen, // Only fetch when modal is open
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Calculate total amount for last month modal
  const lastMonthModalTotalAmount = useMemo(() => {
    if (!lastMonthModalData) return 0;

    return lastMonthModalData.pages.reduce((sum, page) => {
      return page.results.reduce((pageSum, item) => {
        return (
          pageSum + (parseFloat(item.client_amount) || 0)
        );
      }, sum);
    }, 0);
  }, [lastMonthModalData]);

  // Prepare last month data for modal
  const lastMonthDisplayData = useMemo(() => {
    return (
      lastMonthModalData?.pages.flatMap(
        (page) => page.results
      ) || []
    );
  }, [lastMonthModalData]);

  return {
    lastMonthModalData,
    lastMonthDisplayData,
    lastMonthModalTotalAmount,
    isLastMonthModalLoading,
    isLastMonthModalFetchingNextPage,
    hasLastMonthModalNextPage,
    fetchLastMonthModalNextPage,
    isLastMonthModalError,
    lastMonthModalError,
  };
};
