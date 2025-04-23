import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import dayjs from "dayjs";
import {
  getInterviewerFinance,
  getInterviewerLastMonthFinance,
} from "../api";

// Default query options to maintain consistency
const DEFAULT_QUERY_OPTIONS = {
  refetchOnWindowFocus: false,
  retry: 1,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
};

const createPaginationHandler = (pageSize = 10) => {
  return (lastPage, allPages) => {
    // Validate response data
    if (!lastPage || typeof lastPage !== "object") {
      console.error(
        "Invalid pagination response:",
        lastPage
      );
      return undefined;
    }

    // Ensure required properties exist
    const count =
      typeof lastPage.count === "number"
        ? lastPage.count
        : 0;
    const offset =
      typeof lastPage.offset === "number"
        ? lastPage.offset
        : 0;
    const results = Array.isArray(lastPage.results)
      ? lastPage.results
      : [];

    if (count === 0 || results.length === 0) {
      return undefined; // No more data to fetch
    }

    // Calculate total items fetched so far
    const totalItemsFetched = allPages.reduce(
      (total, page) =>
        total +
        (Array.isArray(page.results)
          ? page.results.length
          : 0),
      0
    );

    // If we've fetched everything, don't request more
    if (totalItemsFetched >= count) {
      return undefined;
    }

    // Calculate next page number based on total fetched
    const nextPage =
      Math.floor(totalItemsFetched / pageSize) + 1;

    // Add a safety check to prevent duplicate API calls
    // If the next offset would be the same as the current one, return undefined
    const nextOffset = (nextPage - 1) * pageSize;
    if (nextOffset === offset) {
      console.warn(
        `Preventing duplicate API call with offset ${offset}`
      );
      return undefined;
    }

    return nextPage;
  };
};

const calculateTotalAmount = (items = []) => {
  return items.reduce((sum, item) => {
    const amount = parseFloat(item?.client_amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
};

/**
 * Base hook for fetching finance data with pagination
 * @param {string} queryKey - The query key for React Query
 * @param {Function} apiFn - The API function to call
 * @param {Object} options - Additional options
 * @returns {Object} Query results and calculated values
 */
const useFinanceData = (queryKey, apiFn, options = {}) => {
  const paginationHandler = useMemo(
    () => createPaginationHandler(10),
    []
  );

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await apiFn({
          page: pageParam,
          ...options.params,
        });

        // Additional validation of response data
        if (!response || !Array.isArray(response.results)) {
          throw new Error("Invalid API response format");
        }

        return response;
      } catch (error) {
        console.error(`${queryKey} API error:`, error);
        throw error;
      }
    },
    getNextPageParam: paginationHandler,
    ...DEFAULT_QUERY_OPTIONS,
  });

  // Calculate total amount
  const totalAmount = useMemo(() => {
    if (!data) return 0;

    return data.pages.reduce((sum, page) => {
      return page.results
        ? sum + calculateTotalAmount(page.results)
        : sum;
    }, 0);
  }, [data]);

  // Format the data for display
  const displayData = useMemo(() => {
    if (!data || !data.pages) return [];

    // Safely flatten and map all pages
    return data.pages
      .filter((page) => page && Array.isArray(page.results))
      .flatMap((page) => page.results);
  }, [data]);

  // Debug info for pagination
  useMemo(() => {
    if (data?.pages && data.pages.length > 0) {
      const lastPage = data.pages[data.pages.length - 1];
      const totalItems = data.pages.reduce(
        (sum, page) => sum + (page.results?.length || 0),
        0
      );

      console.debug(
        `${queryKey} data: ${totalItems}/${
          lastPage.count || 0
        } items loaded, Last offset: ${
          lastPage.offset
        }, Has more: ${!!hasNextPage}`
      );
    }
  }, [data, hasNextPage, queryKey]);

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

export const useCurrentInterviewerFinanceData = () => {
  return useFinanceData("finance", getInterviewerFinance);
};

export const useInterviewerLastMonthFinanceData = () => {
  const financePaginationData = useFinanceData(
    "lastMonthFinance",
    getInterviewerLastMonthFinance
  );

  // Get last month's name
  const lastMonthName = useMemo(
    () => dayjs().subtract(1, "month").format("MMMM"),
    []
  );

  // Check if there are pending dues from last month
  const hasPendingLastMonthDues = useMemo(() => {
    const { displayData } = financePaginationData;
    return displayData.length > 0;
  }, [financePaginationData.displayData]);

  return {
    ...financePaginationData,
    lastMonthName,
    hasPendingLastMonthDues,
    lastMonthDueAmount: financePaginationData.totalAmount,
    lastMonthData: financePaginationData.data,
  };
};
