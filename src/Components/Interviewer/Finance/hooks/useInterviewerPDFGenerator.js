import { useState } from "react";
import {
  generateInterviewerCurrentReceivablesPdf,
  generateInterviewerPastPaymentsPdf,
} from "../utils/interviewerPDFGenerator";

/**
 * Custom hook for handling PDF generation for interviewer finance
 * @param {Function} fetchRemainingPages - Function to fetch any remaining pages of data
 * @returns {Object} PDF generation state and functions
 */
export const useInterviewerPdfGenerator = (
  fetchRemainingPages
) => {
  const [isGeneratingPdf, setIsGeneratingPdf] =
    useState(false);

  /**
   * Fetches all remaining pages of data with a safety mechanism
   */
  const fetchAllData = async () => {
    let safetyCounter = 0;
    const MAX_ITERATIONS = 20;

    try {
      while (
        (await fetchRemainingPages()) &&
        safetyCounter < MAX_ITERATIONS
      ) {
        safetyCounter++;
      }
      return true;
    } catch (error) {
      console.error("Error fetching all data:", error);
      return false;
    }
  };

  /**
   * Generates a PDF for current receivables
   * @param {Array} data - Finance data
   * @param {number} totalAmount - Total amount to display
   * @param {string} logoPath - Path to company logo
   */
  const generateCurrentReceivablesPdf = async (
    data,
    totalAmount,
    logoPath
  ) => {
    setIsGeneratingPdf(true);
    try {
      // Fetch all remaining data first
      await fetchAllData();

      // Generate the PDF
      await generateInterviewerCurrentReceivablesPdf(
        data,
        totalAmount,
        logoPath
      );
    } catch (error) {
      console.error(
        "Error generating current receivables PDF:",
        error
      );
      alert(
        "Error generating PDF. Check console for details."
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  /**
   * Generates a PDF for past payments
   * @param {Array} data - Finance data for past payments
   * @param {number} totalAmount - Total amount to display
   * @param {string} logoPath - Path to company logo
   * @param {string} monthName - Optional month name
   */
  const generatePastPaymentsPdf = async (
    data,
    totalAmount,
    logoPath,
    monthName = null
  ) => {
    setIsGeneratingPdf(true);
    try {
      // Fetch all remaining data first
      await fetchAllData();

      // Generate the PDF
      await generateInterviewerPastPaymentsPdf(
        data,
        totalAmount,
        logoPath,
        monthName
      );
    } catch (error) {
      console.error(
        "Error generating past payments PDF:",
        error
      );
      alert(
        "Error generating PDF. Check console for details."
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return {
    isGeneratingPdf,
    generateCurrentReceivablesPdf,
    generatePastPaymentsPdf,
  };
};
