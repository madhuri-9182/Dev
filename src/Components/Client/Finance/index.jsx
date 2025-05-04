import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useInView } from "react-intersection-observer";
import { createTheme } from "@mui/material/styles";
import { Warning2 } from "iconsax-react";
import { CompanyLogo } from "../../../assets/index";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import {
  LoadingState,
  ErrorState,
} from "../../shared/loading-error-state";
import { getErrorMessage } from "../../../utils/util";

// Custom hooks
import {
  useCurrentFinanceData,
  useLastMonthFinanceData,
  useLastMonthModalData,
} from "./hooks/useFinanceData";
import { usePdfGenerator } from "./hooks/usePdfGenerator";

// Import the PDF generation function directly for past payments
import { generateCustomDateRangePdf } from "./utils/pdfGenerator";

// API imports
import { getFinance } from "./api";

// Components
import LastMonthAlert from "./components/LastMonthAlert";
import CurrentDues from "./components/CurrentDues";
import PastPayments from "./components/PastPayments";
import LastMonthModal from "./components/LastMonthModal";

// InView options for better performance
const INVIEW_OPTIONS = {
  threshold: 0,
  rootMargin: "300px 0px", // Load more data earlier
  delay: 300, // Debounce observation
  triggerOnce: false,
};

/**
 * Finance component - main entry point for the finance module
 */
const Finance = () => {
  // Auth check
  const { auth } = useAuth();

  // State
  const [showDuesAlert, setShowDuesAlert] = useState(true);
  const [isLastMonthModalOpen, setIsLastMonthModalOpen] =
    useState(false);
  const [isPastPaymentsLoading, setIsPastPaymentsLoading] =
    useState(false);

  // Refs for debouncing fetches
  const fetchingRef = useRef({
    current: false,
    timeout: null,
  });
  const lastMonthFetchingRef = useRef({
    current: false,
    timeout: null,
  });

  // Cleanup function for fetch timeouts
  const cleanupFetchTimeouts = useCallback(() => {
    if (fetchingRef.current.timeout) {
      clearTimeout(fetchingRef.current.timeout);
      fetchingRef.current.timeout = null;
    }

    if (lastMonthFetchingRef.current.timeout) {
      clearTimeout(lastMonthFetchingRef.current.timeout);
      lastMonthFetchingRef.current.timeout = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanupFetchTimeouts;
  }, [cleanupFetchTimeouts]);

  // Intersection observer hooks for infinite scrolling
  const { ref, inView } = useInView(INVIEW_OPTIONS);
  const { ref: lastMonthRef, inView: lastMonthInView } =
    useInView(INVIEW_OPTIONS);

  // Custom theme for Material UI components
  const theme = createTheme({
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              height: "32px",
              width: "120px",
              fontSize: "12px",
              borderRadius: "6px",
              backgroundColor: "white",
              "& fieldset": {
                borderColor: "#E0E0E0",
              },
              "&:hover fieldset": {
                borderColor: "#007AFF",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#007AFF",
                borderWidth: "1px",
              },
            },
            "& .MuiInputLabel-root": {
              display: "none",
            },
            "& .MuiInputBase-input": {
              padding: "8px 12px",
            },
            "& .MuiSvgIcon-root": {
              fontSize: "16px",
              marginRight: "2px",
            },
            "& .MuiInputAdornment-root": {
              marginLeft: "0",
              maxWidth: "24px",
            },
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            fontSize: "12px",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: "white",
          },
        },
      },
    },
  });

  // Get current finance data
  const {
    displayData,
    totalAmount,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
  } = useCurrentFinanceData();

  // Get last month finance data for alert
  const {
    hasPendingLastMonthDues,
    lastMonthDueAmount,
    lastMonthName,
    isLastMonthLoading,
    isLastMonthError,
    lastMonthError,
  } = useLastMonthFinanceData();

  // Get last month detailed data for modal
  const {
    lastMonthDisplayData,
    lastMonthModalTotalAmount,
    isLastMonthModalLoading,
    isLastMonthModalFetchingNextPage,
    hasLastMonthModalNextPage,
    fetchLastMonthModalNextPage,
    isLastMonthModalError,
    lastMonthModalError,
  } = useLastMonthModalData(isLastMonthModalOpen);

  // PDF generation hooks - ONLY for current month and last month
  const {
    isGeneratingPdf,
    generateCurrentMonthPdf,
    generateLastMonthPdf,
  } = usePdfGenerator(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
      return true;
    }
    return false;
  });

  // Safely fetch next page with debouncing
  const safelyFetchNextPage = useCallback(() => {
    if (
      !hasNextPage ||
      isFetchingNextPage ||
      fetchingRef.current.current
    ) {
      return;
    }

    fetchingRef.current.current = true;

    fetchNextPage()
      .catch((err) => {
        console.error("Error fetching next page:", err);
      })
      .finally(() => {
        // Reset the fetching state after a delay to prevent excessive calls
        if (fetchingRef.current.timeout) {
          clearTimeout(fetchingRef.current.timeout);
        }

        fetchingRef.current.timeout = setTimeout(() => {
          fetchingRef.current.current = false;
          fetchingRef.current.timeout = null;
        }, 500);
      });
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Safely fetch next page for last month with debouncing
  const safelyFetchLastMonthNextPage = useCallback(() => {
    if (
      !hasLastMonthModalNextPage ||
      isLastMonthModalFetchingNextPage ||
      lastMonthFetchingRef.current.current ||
      !isLastMonthModalOpen
    ) {
      return;
    }

    lastMonthFetchingRef.current.current = true;

    fetchLastMonthModalNextPage()
      .catch((err) => {
        console.error(
          "Error fetching next page for last month:",
          err
        );
      })
      .finally(() => {
        // Reset the fetching state after a delay to prevent excessive calls
        if (lastMonthFetchingRef.current.timeout) {
          clearTimeout(
            lastMonthFetchingRef.current.timeout
          );
        }

        lastMonthFetchingRef.current.timeout = setTimeout(
          () => {
            lastMonthFetchingRef.current.current = false;
            lastMonthFetchingRef.current.timeout = null;
          },
          500
        );
      });
  }, [
    fetchLastMonthModalNextPage,
    hasLastMonthModalNextPage,
    isLastMonthModalFetchingNextPage,
    isLastMonthModalOpen,
  ]);

  // Fetch next page when scrolling into view for current dues
  useEffect(() => {
    if (inView) {
      safelyFetchNextPage();
    }
  }, [inView, safelyFetchNextPage]);

  // Reset the fetchingRef when hasNextPage changes to false
  useEffect(() => {
    if (!hasNextPage) {
      fetchingRef.current.current = false;
    }
  }, [hasNextPage]);

  // Fetch next page for last month modal when scrolling
  useEffect(() => {
    if (lastMonthInView) {
      safelyFetchLastMonthNextPage();
    }
  }, [lastMonthInView, safelyFetchLastMonthNextPage]);

  // Reset the lastMonthFetchingRef when hasLastMonthModalNextPage changes to false
  useEffect(() => {
    if (!hasLastMonthModalNextPage) {
      lastMonthFetchingRef.current.current = false;
    }
  }, [hasLastMonthModalNextPage]);

  // Toggle last month modal with proper cleanup
  const toggleLastMonthModal = useCallback(() => {
    setIsLastMonthModalOpen((prev) => !prev);

    // Reset fetching state when closing modal
    if (isLastMonthModalOpen) {
      lastMonthFetchingRef.current.current = false;
      if (lastMonthFetchingRef.current.timeout) {
        clearTimeout(lastMonthFetchingRef.current.timeout);
        lastMonthFetchingRef.current.timeout = null;
      }
    }
  }, [isLastMonthModalOpen]);

  // Handler for generating current month PDF
  const handleGenerateCurrentMonthPdf = useCallback(() => {
    generateCurrentMonthPdf(
      displayData,
      totalAmount,
      CompanyLogo
    );
  }, [displayData, generateCurrentMonthPdf, totalAmount]);

  // Handler for generating last month PDF
  const handleGenerateLastMonthPdf = useCallback(() => {
    generateLastMonthPdf(
      lastMonthDisplayData,
      lastMonthModalTotalAmount,
      CompanyLogo
    );
  }, [
    generateLastMonthPdf,
    lastMonthDisplayData,
    lastMonthModalTotalAmount,
  ]);

  // Handler for past payments download - With improved error handling
  const handlePastPaymentsDownload = useCallback(
    async (dateRange) => {
      if (isPastPaymentsLoading) {
        return; // Prevent multiple concurrent downloads
      }

      // Validate date range
      if (!dateRange?.from || !dateRange?.to) {
        toast.error("Please select valid date range");
        return;
      }

      setIsPastPaymentsLoading(true);

      try {
        // Call the finance API with properly named date filters
        const response = await getFinance({
          page: 1,
          param: {
            from_date: dateRange.from,
            to_date: dateRange.to,
          },
        });

        // Check if there are results
        if (
          !response?.results ||
          response.results.length === 0
        ) {
          toast.error(
            "No results found for the selected time period"
          );
          return;
        }

        // Calculate total amount for PDF
        const pdfTotalAmount = response.results.reduce(
          (sum, item) => {
            const amount = parseFloat(item?.amount);
            return sum + (isNaN(amount) ? 0 : amount);
          },
          0
        );

        // Generate PDF
        await generateCustomDateRangePdf(
          response.results,
          pdfTotalAmount,
          CompanyLogo,
          dateRange.from,
          dateRange.to
        );

        toast.success("PDF generated successfully");
      } catch (error) {
        console.error(
          "Error with past payments download:",
          error
        );
        toast.error(
          "Failed to download payments: " +
            getErrorMessage(error)
        );
      } finally {
        setIsPastPaymentsLoading(false);
      }
    },
    [isPastPaymentsLoading]
  );

  // Access control check
  if (auth?.role !== "client_owner") {
    return (
      <div className="flex flex-col items-center justify-center min-h-60 text-[#ffa500]">
        <Warning2 className="h-12 w-12" />
        <p className="mt-2">
          You are not authorized to view this page.
        </p>
      </div>
    );
  }

  // Loading and error states with better error display
  if (isLoading || isLastMonthLoading)
    return <LoadingState />;

  if (isError || isLastMonthError)
    return (
      <ErrorState
        message={getErrorMessage(error || lastMonthError)}
      />
    );

  return (
    <div className="px-6 pb-6 pt-1 max-w-7xl mx-auto">
      {/* Alert for pending last month dues */}
      {hasPendingLastMonthDues && (
        <LastMonthAlert
          showDuesAlert={showDuesAlert}
          setShowDuesAlert={setShowDuesAlert}
          lastMonthName={lastMonthName}
          lastMonthDueAmount={lastMonthDueAmount}
          onViewClick={toggleLastMonthModal}
        />
      )}

      <div className="flex flex-col md:flex-row gap-x-12">
        {/* Current Dues Section */}
        <CurrentDues
          displayData={displayData}
          totalAmount={totalAmount}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          scrollRef={ref}
          onDownloadClick={handleGenerateCurrentMonthPdf}
          isGeneratingPdf={isGeneratingPdf}
        />

        {/* Past Payments Section - Completely independent loading state */}
        <PastPayments
          theme={theme}
          onDownloadClick={handlePastPaymentsDownload}
          isLoading={isPastPaymentsLoading}
        />
      </div>

      {/* Last Month Dues Modal */}
      <LastMonthModal
        isOpen={isLastMonthModalOpen}
        onClose={toggleLastMonthModal}
        title={`${lastMonthName} Dues`}
        className="w-[60vw] max-h-[80vh]"
        lastMonthDisplayData={lastMonthDisplayData}
        lastMonthModalTotalAmount={
          lastMonthModalTotalAmount
        }
        isLastMonthModalLoading={isLastMonthModalLoading}
        isLastMonthModalFetchingNextPage={
          isLastMonthModalFetchingNextPage
        }
        hasLastMonthModalNextPage={
          hasLastMonthModalNextPage
        }
        lastMonthModalError={lastMonthModalError}
        isLastMonthModalError={isLastMonthModalError}
        lastMonthRef={lastMonthRef}
        generateLastMonthPdf={handleGenerateLastMonthPdf}
        isGeneratingPdf={isGeneratingPdf}
      />
    </div>
  );
};

export default Finance;
