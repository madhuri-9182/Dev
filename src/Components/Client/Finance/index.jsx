import { useState, useEffect, useRef } from "react";
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
// This avoids using the hook's shared loading state
import { generateCustomDateRangePdf } from "./utils/pdfGenerator";

// API imports
import { getFinance } from "./api";

// Components
import LastMonthAlert from "./components/LastMonthAlert";
import CurrentDues from "./components/CurrentDues";
import PastPayments from "./components/PastPayments";
import LastMonthModal from "./components/LastMonthModal";

/**
 * Finance component - main entry point for the finance module
 */
const Finance = () => {
  // State
  const [showDuesAlert, setShowDuesAlert] = useState(true);
  const [isLastMonthModalOpen, setIsLastMonthModalOpen] =
    useState(false);
  const [isPastPaymentsLoading, setIsPastPaymentsLoading] =
    useState(false);

  // Ref to track if we've already tried to fetch next page
  const fetchingRef = useRef(false);

  // Auth check
  const { auth } = useAuth();

  // Intersection observer hooks for infinite scrolling with threshold and rootMargin
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px 0px",
    delay: 300, // Add a slight delay to prevent multiple rapid triggers
  });

  const { ref: lastMonthRef, inView: lastMonthInView } =
    useInView({
      threshold: 0,
      rootMargin: "200px 0px",
      delay: 300,
    });

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
    // data,
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
    // lastMonthData,
    hasPendingLastMonthDues,
    lastMonthDueAmount,
    lastMonthName,
    isLastMonthLoading,
    isLastMonthError,
  } = useLastMonthFinanceData();

  // Get last month detailed data for modal
  const {
    // lastMonthModalData,
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

  // Fetch next page when scrolling into view for current dues
  useEffect(() => {
    // Only fetch if inView AND hasNextPage AND not already fetching AND not already tried fetching
    if (
      inView &&
      hasNextPage &&
      !isFetchingNextPage &&
      !fetchingRef.current
    ) {
      fetchingRef.current = true;
      fetchNextPage().finally(() => {
        // Reset the fetchingRef after a short delay to prevent excessive calls
        setTimeout(() => {
          fetchingRef.current = false;
        }, 500);
      });
    }
  }, [
    inView,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  ]);

  // Reset the fetchingRef when hasNextPage changes to false
  useEffect(() => {
    if (!hasNextPage) {
      fetchingRef.current = false;
    }
  }, [hasNextPage]);

  // Ref to track if we've already tried to fetch next page for last month
  const lastMonthFetchingRef = useRef(false);

  // Fetch next page for last month modal when scrolling
  useEffect(() => {
    if (
      lastMonthInView &&
      hasLastMonthModalNextPage &&
      !isLastMonthModalFetchingNextPage &&
      isLastMonthModalOpen &&
      !lastMonthFetchingRef.current
    ) {
      lastMonthFetchingRef.current = true;
      fetchLastMonthModalNextPage().finally(() => {
        // Reset the lastMonthFetchingRef after a short delay
        setTimeout(() => {
          lastMonthFetchingRef.current = false;
        }, 500);
      });
    }
  }, [
    lastMonthInView,
    fetchLastMonthModalNextPage,
    hasLastMonthModalNextPage,
    isLastMonthModalFetchingNextPage,
    isLastMonthModalOpen,
  ]);

  // Reset the lastMonthFetchingRef when hasLastMonthModalNextPage changes to false
  useEffect(() => {
    if (!hasLastMonthModalNextPage) {
      lastMonthFetchingRef.current = false;
    }
  }, [hasLastMonthModalNextPage]);

  // Toggle last month modal
  const toggleLastMonthModal = () => {
    setIsLastMonthModalOpen((prev) => !prev);
  };

  // Handler for generating current month PDF
  const handleGenerateCurrentMonthPdf = () => {
    generateCurrentMonthPdf(
      displayData,
      totalAmount,
      CompanyLogo
    );
  };

  // Handler for generating last month PDF
  const handleGenerateLastMonthPdf = () => {
    generateLastMonthPdf(
      lastMonthDisplayData,
      lastMonthModalTotalAmount,
      CompanyLogo
    );
  };

  // Handler for past payments download - With completely independent PDF generation
  const handlePastPaymentsDownload = async (dateRange) => {
    // Set our own, independent loading state to true
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
        !response.results ||
        response.results.length === 0
      ) {
        // Show error toast if no data
        toast.error(
          "No results found for the selected time period"
        );
      } else {
        // Calculate total amount for PDF
        const pdfTotalAmount = response.results.reduce(
          (sum, item) => {
            return (
              sum + (parseFloat(item.client_amount) || 0)
            );
          },
          0
        );

        // Call the PDF generation function directly instead of using the hook
        // This ensures completely independent loading state
        try {
          await generateCustomDateRangePdf(
            response.results,
            pdfTotalAmount,
            CompanyLogo,
            dateRange.from,
            dateRange.to
          );
        } catch (pdfError) {
          console.error("Error generating PDF:", pdfError);
          toast.error("Failed to generate PDF");
        }
      }
    } catch (error) {
      console.error("Error fetching past payments:", error);
      toast.error(
        "Failed to download payments: " +
          getErrorMessage(error)
      );
    } finally {
      // Reset our own loading state
      setIsPastPaymentsLoading(false);
    }
  };

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

  // Loading and error states
  if (isLoading || isLastMonthLoading)
    return <LoadingState />;
  if (isError && isLastMonthError)
    return <ErrorState message={getErrorMessage(error)} />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
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
