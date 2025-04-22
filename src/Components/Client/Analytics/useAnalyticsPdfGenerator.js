import { useState } from "react";
import {
  generateAnalyticsPdf,
  hasDataToGeneratePdf,
} from "./analyticsReportGenerator";
import toast from "react-hot-toast";
import { CompanyLogo } from "../../../assets";

/**
 * Custom hook for generating analytics PDF reports
 * @returns {Object} PDF generation state and functions
 */
export const useAnalyticsPdfGenerator = () => {
  const [isGeneratingPdf, setIsGeneratingPdf] =
    useState(false);

  /**
   * Checks if there is data available for PDF generation
   * @param {Array} selectedCandidates - Selected candidates data
   * @param {Array} rejectedCandidates - Rejected candidates data
   * @returns {boolean} True if there is data for PDF generation
   */
  const hasDataForPdf = (
    selectedCandidates,
    rejectedCandidates
  ) => {
    return hasDataToGeneratePdf(
      selectedCandidates,
      rejectedCandidates
    );
  };

  /**
   * Generates an analytics report PDF
   * @param {Object} analyticsData - The analytics data to include in the report
   * @param {Array} statusInfoEntries - Formatted status info entries
   * @param {Array} selectedCandidates - Selected candidates data
   * @param {Array} rejectedCandidates - Rejected candidates data
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   * @param {string} logoPath - Optional path to company logo
   */
  const generateAnalyticsReport = async (
    analyticsData,
    statusInfoEntries,
    selectedCandidates,
    rejectedCandidates,
    startDate,
    endDate,
    logoPath = CompanyLogo // Default logo path, adjust as needed
  ) => {
    setIsGeneratingPdf(true);

    try {
      // Check for required data
      if (!analyticsData) {
        throw new Error("Missing analytics data");
      }

      if (!startDate || !endDate) {
        throw new Error("Missing date range");
      }

      // Check if there is candidate data to display
      if (
        !hasDataForPdf(
          selectedCandidates,
          rejectedCandidates
        )
      ) {
        toast.error("No candidate data to download");
        return false;
      }

      // Generate the PDF
      await generateAnalyticsPdf(
        analyticsData,
        statusInfoEntries,
        selectedCandidates,
        rejectedCandidates,
        startDate,
        endDate,
        logoPath
      );

      // Success notification
      toast.success("Report downloaded successfully");
      return true;
    } catch (error) {
      console.error(
        "Error generating analytics PDF:",
        error
      );

      // Show specific error message if we know the reason
      if (
        error.message === "No candidate data to download"
      ) {
        toast.error("No candidate data to download");
      } else {
        toast.error(
          "Failed to generate report. Please try again."
        );
      }

      return false;
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return {
    isGeneratingPdf,
    generateAnalyticsReport,
    hasDataForPdf,
  };
};
