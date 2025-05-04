import {
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { useMemo } from "react";
import dayjs from "dayjs";
import { getFinance, getLastMonthFinance } from "../api";

// Default query options to maintain consistency
const DEFAULT_QUERY_OPTIONS = {
  refetchOnWindowFocus: false,
  retry: 1,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
};

/**
 * Creates a getNextPageParam function for infinite queries
 * @param {number} pageSize - Items per page
 * @returns {Function} getNextPageParam function for useInfiniteQuery
 */
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

/**
 * Parse and calculate total amount from finance data
 * @param {Array} items - Array of finance items
 * @returns {number} Total amount
 */
const calculateTotalAmount = (items = []) => {
  return items.reduce((sum, item) => {
    const amount = parseFloat(item?.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
};

/**
 * Custom hook for fetching current finance data with pagination
 * @returns {Object} Query results and calculated values
 */
export const useCurrentFinanceData = () => {
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
    queryKey: ["finance"],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await getFinance({
          page: pageParam,
        });

        // Additional validation of response data
        if (!response || !Array.isArray(response.results)) {
          throw new Error("Invalid API response format");
        }

        return response;
      } catch (error) {
        console.error("Finance API error:", error);
        throw error;
      }
    },
    getNextPageParam: paginationHandler,
    ...DEFAULT_QUERY_OPTIONS,
  });

  // Calculate total amount
  const totalAmount = useMemo(() => {
    if (!data) return 0;

    // Safely calculate total amount
    if (data?.pages[0]?.total_amount) {
      return data.pages[0].total_amount;
    }

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
        `Finance data: ${totalItems}/${
          lastPage.count || 0
        } items loaded, Last offset: ${
          lastPage.offset
        }, Has more: ${!!hasNextPage}`
      );
    }
  }, [data, hasNextPage]);

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
    error: lastMonthError,
  } = useQuery({
    queryKey: ["lastMonthFinance"],
    queryFn: async () => {
      try {
        const response = await getLastMonthFinance();

        // Additional validation of response data
        if (!response || !Array.isArray(response.results)) {
          throw new Error("Invalid API response format");
        }

        return response;
      } catch (error) {
        console.error(
          "Last month finance API error:",
          error
        );
        throw error;
      }
    },
    ...DEFAULT_QUERY_OPTIONS,
  });

  // Check if there are pending dues from last month
  const hasPendingLastMonthDues = useMemo(() => {
    if (!lastMonthData) return false;
    return (
      lastMonthData.count > 0 &&
      lastMonthData.results?.length > 0
    );
  }, [lastMonthData]);

  // Format the due amount for last month
  const lastMonthDueAmount = useMemo(() => {
    if (
      !lastMonthData ||
      !Array.isArray(lastMonthData.results)
    )
      return 0;

    if (lastMonthData?.total_amount) {
      return lastMonthData.total_amount;
    }
    return calculateTotalAmount(lastMonthData.results);
  }, [lastMonthData]);

  // Get last month's name
  const lastMonthName = useMemo(
    () => dayjs().subtract(1, "month").format("MMMM"),
    []
  );

  return {
    lastMonthData,
    hasPendingLastMonthDues,
    lastMonthDueAmount,
    lastMonthName,
    isLastMonthLoading,
    isLastMonthError,
    lastMonthError,
  };
};

/**
 * Custom hook for fetching last month's detailed finance data for modal
 * @param {boolean} isModalOpen - Whether the modal is open
 * @returns {Object} Query results and calculated values for the modal
 */
export const useLastMonthModalData = (isModalOpen) => {
  const paginationHandler = useMemo(
    () => createPaginationHandler(10),
    []
  );

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
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await getFinance({
          page: pageParam,
          param: { finance_month: "last_month" },
        });

        // Additional validation of response data
        if (!response || !Array.isArray(response.results)) {
          throw new Error("Invalid API response format");
        }

        return response;
      } catch (error) {
        console.error(
          "Last month modal data API error:",
          error
        );
        throw error;
      }
    },
    getNextPageParam: paginationHandler,
    enabled: isModalOpen, // Only fetch when modal is open
    ...DEFAULT_QUERY_OPTIONS,
  });

  // Calculate total amount for last month modal
  const lastMonthModalTotalAmount = useMemo(() => {
    if (!lastMonthModalData) return 0;

    if (lastMonthModalData?.pages[0]?.total_amount) {
      return lastMonthModalData?.pages[0].total_amount;
    }

    return lastMonthModalData.pages.reduce((sum, page) => {
      return page.results
        ? sum + calculateTotalAmount(page.results)
        : sum;
    }, 0);
  }, [lastMonthModalData]);

  // Prepare last month data for modal
  const lastMonthDisplayData = useMemo(() => {
    if (!lastMonthModalData || !lastMonthModalData.pages)
      return [];

    // Safely flatten and map all pages
    return lastMonthModalData.pages
      .filter((page) => page && Array.isArray(page.results))
      .flatMap((page) => page.results);
  }, [lastMonthModalData]);

  // Debug info for pagination
  useMemo(() => {
    if (
      lastMonthModalData?.pages &&
      lastMonthModalData.pages.length > 0 &&
      isModalOpen
    ) {
      const lastPage =
        lastMonthModalData.pages[
          lastMonthModalData.pages.length - 1
        ];
      const totalItems = lastMonthModalData.pages.reduce(
        (sum, page) => sum + (page.results?.length || 0),
        0
      );

      console.debug(
        `Last month data: ${totalItems}/${
          lastPage.count || 0
        } items loaded, Last offset: ${
          lastPage.offset
        }, Has more: ${!!hasLastMonthModalNextPage}`
      );
    }
  }, [
    lastMonthModalData,
    hasLastMonthModalNextPage,
    isModalOpen,
  ]);

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
