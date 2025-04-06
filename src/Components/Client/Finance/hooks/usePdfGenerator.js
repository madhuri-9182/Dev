import { useState } from "react";
import {
  generateCurrentMonthPdf,
  generateLastMonthPdf,
} from "../utils/pdfGenerator";

/**
 * Custom hook for handling PDF generation
 * @param {Function} fetchRemainingPages - Function to fetch any remaining pages of data
 * @returns {Object} PDF generation state and functions
 */
export const usePdfGenerator = (fetchRemainingPages) => {
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
   * Generates a PDF for current month's finance data
   * @param {Array} data - Finance data
   * @param {number} totalAmount - Total amount to display
   * @param {string} logoPath - Path to company logo
   */
  const generateCurrentMonthPdfHandler = async (
    data,
    totalAmount,
    logoPath
  ) => {
    setIsGeneratingPdf(true);
    try {
      // Fetch all remaining data first
      await fetchAllData();

      // Generate the PDF
      await generateCurrentMonthPdf(
        data,
        totalAmount,
        logoPath
      );
    } catch (error) {
      console.error(
        "Error generating current month PDF:",
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
   * Generates a PDF for last month's finance data
   * @param {Array} data - Finance data for last month
   * @param {number} totalAmount - Total amount to display
   * @param {string} logoPath - Path to company logo
   */
  const generateLastMonthPdfHandler = async (
    data,
    totalAmount,
    logoPath
  ) => {
    setIsGeneratingPdf(true);
    try {
      // Fetch all remaining data first
      await fetchAllData();

      // Generate the PDF
      await generateLastMonthPdf(
        data,
        totalAmount,
        logoPath
      );
    } catch (error) {
      console.error(
        "Error generating last month PDF:",
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
    generateCurrentMonthPdf: generateCurrentMonthPdfHandler,
    generateLastMonthPdf: generateLastMonthPdfHandler,
  };
};
