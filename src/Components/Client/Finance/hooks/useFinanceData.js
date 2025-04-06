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
    getNextPageParam: (lastPage) => {
      // If the total count is greater than the current offset + limit, there are more pages
      const currentItemCount =
        (lastPage.offset || 0) + lastPage.results.length;
      if (currentItemCount < lastPage.count) {
        return lastPage.offset / 10 + 2; // Next page number
      }
      return undefined;
    },
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
    getNextPageParam: (lastPage) => {
      const currentItemCount =
        (lastPage.offset || 0) + lastPage.results.length;
      if (currentItemCount < lastPage.count) {
        return lastPage.offset / 10 + 2;
      }
      return undefined;
    },
    enabled: isModalOpen, // Only fetch when modal is open
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
