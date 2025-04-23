import { useEffect, useRef, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { CompanyLogo } from "../../../assets/index";
import {
  LoadingState,
  ErrorState,
} from "../../shared/loading-error-state";
import { getErrorMessage } from "../../../utils/util";

// Import the interviewer finance hooks
import {
  useCurrentInterviewerFinanceData,
  useInterviewerLastMonthFinanceData,
} from "./hooks/useInterviewFinanceData";

// Import the PDF generation function for interviewer finance
import { useInterviewerPdfGenerator } from "./hooks/useInterviewerPDFGenerator";

// Components
import CurrentReceivables from "./components/CurrentReceivables";
import PastPayments from "./components/PastPayments";
import { ArrowLeft } from "iconsax-react";
import { useNavigate } from "react-router-dom";

// InView options for better performance
const INVIEW_OPTIONS = {
  threshold: 0,
  rootMargin: "300px 0px", // Load more data earlier
  delay: 300, // Debounce observation
  triggerOnce: false,
};

/**
 * InterviewerFinance component - simplified version for interviewers showing current and past month dues
 */
const InterviewerFinance = () => {
  const navigate = useNavigate();
  // Create separate InView refs for current and last month sections
  const {
    ref: currentMonthRef,
    inView: currentMonthInView,
  } = useInView(INVIEW_OPTIONS);
  const { ref: lastMonthRef, inView: lastMonthInView } =
    useInView(INVIEW_OPTIONS);

  // Refs for debouncing fetches - one for each data source
  const currentFetchingRef = useRef({
    current: false,
    timeout: null,
  });

  const lastMonthFetchingRef = useRef({
    current: false,
    timeout: null,
  });

  // Cleanup function for fetch timeouts
  const cleanupFetchTimeouts = useCallback(() => {
    if (currentFetchingRef.current.timeout) {
      clearTimeout(currentFetchingRef.current.timeout);
      currentFetchingRef.current.timeout = null;
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

  // Get current interviewer finance data
  const {
    displayData,
    totalAmount,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
  } = useCurrentInterviewerFinanceData();

  // Get last month interviewer finance data (now with pagination support)
  const {
    displayData: lastMonthDisplayData,
    totalAmount: lastMonthDueAmount,
    isLoading: isLastMonthLoading,
    isFetchingNextPage: isLastMonthFetchingNextPage,
    hasNextPage: hasLastMonthNextPage,
    fetchNextPage: fetchLastMonthNextPage,
    isError: isLastMonthError,
    error: lastMonthError,
    lastMonthName,
  } = useInterviewerLastMonthFinanceData();

  // PDF generation hooks - one for current month, one for last month
  const {
    isGeneratingPdf: isGeneratingCurrentPdf,
    generateCurrentReceivablesPdf,
  } = useInterviewerPdfGenerator(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
      return true;
    }
    return false;
  });

  const {
    isGeneratingPdf: isGeneratingPastPdf,
    generatePastPaymentsPdf,
  } = useInterviewerPdfGenerator(() => {
    if (
      hasLastMonthNextPage &&
      !isLastMonthFetchingNextPage
    ) {
      fetchLastMonthNextPage();
      return true;
    }
    return false;
  });

  // Safely fetch next page with debouncing for current month
  const safelyFetchCurrentNextPage = useCallback(() => {
    if (
      !hasNextPage ||
      isFetchingNextPage ||
      currentFetchingRef.current.current
    ) {
      return;
    }

    currentFetchingRef.current.current = true;

    fetchNextPage()
      .catch((err) => {
        console.error(
          "Error fetching next page for current month:",
          err
        );
      })
      .finally(() => {
        // Reset the fetching state after a delay to prevent excessive calls
        if (currentFetchingRef.current.timeout) {
          clearTimeout(currentFetchingRef.current.timeout);
        }

        currentFetchingRef.current.timeout = setTimeout(
          () => {
            currentFetchingRef.current.current = false;
            currentFetchingRef.current.timeout = null;
          },
          500
        );
      });
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Safely fetch next page with debouncing for last month
  const safelyFetchLastMonthNextPage = useCallback(() => {
    if (
      !hasLastMonthNextPage ||
      isLastMonthFetchingNextPage ||
      lastMonthFetchingRef.current.current
    ) {
      return;
    }

    lastMonthFetchingRef.current.current = true;

    fetchLastMonthNextPage()
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
    fetchLastMonthNextPage,
    hasLastMonthNextPage,
    isLastMonthFetchingNextPage,
  ]);

  // Fetch next page when scrolling into view for current dues
  useEffect(() => {
    if (currentMonthInView) {
      safelyFetchCurrentNextPage();
    }
  }, [currentMonthInView, safelyFetchCurrentNextPage]);

  // Fetch next page when scrolling into view for last month dues
  useEffect(() => {
    if (lastMonthInView) {
      safelyFetchLastMonthNextPage();
    }
  }, [lastMonthInView, safelyFetchLastMonthNextPage]);

  // Reset the fetchingRef when hasNextPage changes to false
  useEffect(() => {
    if (!hasNextPage) {
      currentFetchingRef.current.current = false;
    }
    if (!hasLastMonthNextPage) {
      lastMonthFetchingRef.current.current = false;
    }
  }, [hasNextPage, hasLastMonthNextPage]);

  // Handler for generating current month PDF
  const handleGenerateCurrentReceivablesPdf =
    useCallback(() => {
      generateCurrentReceivablesPdf(
        displayData,
        totalAmount,
        CompanyLogo
      );
    }, [
      displayData,
      generateCurrentReceivablesPdf,
      totalAmount,
    ]);

  // Handler for generating last month PDF
  const handleGeneratePastPaymentsPdf = useCallback(() => {
    generatePastPaymentsPdf(
      lastMonthDisplayData,
      lastMonthDueAmount,
      CompanyLogo,
      lastMonthName
    );
  }, [
    lastMonthDisplayData,
    generatePastPaymentsPdf,
    lastMonthDueAmount,
    lastMonthName,
  ]);

  // Loading and error states with better error display
  if (isLoading && isLastMonthLoading)
    return <LoadingState />;

  if (isError && isLastMonthError)
    return (
      <ErrorState
        message={getErrorMessage(error || lastMonthError)}
      />
    );

  return (
    <div className="px-12 py-6 mx-auto">
      <div className="flex mb-6">
        <button
          className="bg-transparent border border-[#dadce0] rounded-full text-[#3c4043] text-sm font-medium p-2 cursor-pointer transition-colors duration-200 hover:bg-[#f6f6f6] flex items-center gap-x-1 justify-around"
          title="Back"
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeft size="16" color="#3c4043" />
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-x-10">
        {/* Current Month Receivables */}
        <CurrentReceivables
          displayData={displayData}
          totalAmount={totalAmount}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          scrollRef={currentMonthRef}
          onDownloadClick={
            handleGenerateCurrentReceivablesPdf
          }
          isGeneratingPdf={isGeneratingCurrentPdf}
        />

        {/* Last Month Payments */}
        <PastPayments
          displayData={lastMonthDisplayData}
          totalAmount={lastMonthDueAmount}
          isLoading={isLastMonthLoading}
          isFetchingNextPage={isLastMonthFetchingNextPage}
          hasNextPage={hasLastMonthNextPage}
          scrollRef={lastMonthRef}
          monthName={lastMonthName}
          onDownloadClick={handleGeneratePastPaymentsPdf}
          isGeneratingPdf={isGeneratingPastPdf}
        />
      </div>
    </div>
  );
};

export default InterviewerFinance;
