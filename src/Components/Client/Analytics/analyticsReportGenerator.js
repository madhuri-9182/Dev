/* eslint-disable no-unused-vars */
import { jsPDF } from "jspdf";
import dayjs from "dayjs";

/**
 * Adds common PDF header elements like title, dates, etc.
 * @param {Object} doc - jsPDF document instance
 * @param {string} startDate - Start date for report period
 * @param {string} endDate - End date for report period
 * @param {string} logoPath - Path to company logo (optional)
 */
const addPdfHeader = async (
  doc,
  startDate,
  endDate,
  logoPath
) => {
  try {
    // Add company logo if provided
    if (logoPath) {
      try {
        const img = new Image();
        img.src = logoPath;

        const addLogoToDoc = () => {
          const logoWidth = 18; // Target width in mm
          const aspectRatio = img.height / img.width;
          const logoHeight = logoWidth * aspectRatio;

          doc.addImage(
            logoPath,
            "PNG",
            14,
            10,
            logoWidth,
            logoHeight
          );
        };

        // If image is already loaded
        if (img.complete) {
          addLogoToDoc();
        } else {
          // Wait for image to load
          await new Promise((resolve) => {
            img.onload = () => {
              addLogoToDoc();
              resolve();
            };
            img.onerror = () => {
              console.error(
                "Failed to load logo image for PDF"
              );
              resolve(); // Resolve anyway to continue PDF generation
            };
          });
        }
      } catch (logoError) {
        console.error(
          "Error adding logo to PDF:",
          logoError
        );
        // Continue without logo if there's an error
      }
    }

    // Add report period and generation date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const reportPeriod = `Report Period: ${startDate} - ${endDate}`;
    const downloadDate = `Generated On: ${dayjs().format(
      "DD/MM/YYYY"
    )}`;
    doc.text(
      reportPeriod,
      doc.internal.pageSize.width - 14,
      15,
      { align: "right" }
    );
    doc.text(
      downloadDate,
      doc.internal.pageSize.width - 14,
      20,
      { align: "right" }
    );

    // Add horizontal separator line
    const pageWidth = doc.internal.pageSize.width;
    doc.setDrawColor(200, 200, 200); // Light gray color
    doc.setLineWidth(0.5);
    doc.line(14, 30, pageWidth - 14, 30);

    // Add title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Analytics Report", 14, 40);
  } catch (error) {
    console.error("Error in addPdfHeader:", error);
    throw new Error("Failed to create PDF header");
  }
};

/**
 * Gets the width of a text string in the document based on current font settings
 * @param {Object} doc - jsPDF document instance
 * @param {string} text - Text to measure
 * @returns {number} Width of text in document units
 */
const getTextWidth = (doc, text) => {
  return (
    (doc.getStringUnitWidth(text) * doc.getFontSize()) /
    doc.internal.scaleFactor
  );
};

/**
 * Adds status info section to PDF
 * @param {Object} doc - jsPDF document instance
 * @param {Array} statusInfoEntries - Status info data
 * @param {number} startY - Y-coordinate to start drawing
 * @returns {number} New Y position after drawing
 */
const addStatusInfoSection = (
  doc,
  statusInfoEntries,
  startY
) => {
  try {
    // Section title
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("STATUS INFO", 14, startY);

    // Measure text width for precise underline
    const titleWidth = getTextWidth(doc, "STATUS INFO");

    // Underline the title
    doc.setDrawColor(50, 50, 50);
    doc.setLineWidth(0.5);
    doc.line(14, startY + 1, 14 + titleWidth, startY + 1);

    // REDUCED GAP: from 10 to 6
    startY += 6;
    const cellHeight = 15;
    const cellWidth = 55;
    const columns = 3; // Display in 3 columns to save space
    // REDUCED GAP: from 5 to 3 in vertical spacing between rows
    const verticalGap = 3;

    statusInfoEntries.forEach((item, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = 14 + col * (cellWidth + 10);
      const y = startY + row * (cellHeight + verticalGap);

      // Draw background - rgb(243, 244, 246)
      doc.setFillColor(243, 244, 246);
      doc.roundedRect(
        x,
        y,
        cellWidth,
        cellHeight,
        2,
        2,
        "F"
      );

      // Draw label
      doc.setFontSize(9);
      doc.setTextColor(70, 70, 70);
      doc.text(item.label, x + 3, y + 6);

      // Draw value circle
      const circleX = x + cellWidth - 8;
      const circleY = y + cellHeight / 2;
      const circleRadius = 4;

      doc.setFillColor(151, 157, 163); // Gray circle for the value
      doc.circle(circleX, circleY, circleRadius, "F");

      // Draw value
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(
        item.value.toString(),
        circleX,
        circleY + 1,
        { align: "center" }
      );
    });

    return (
      startY +
      Math.ceil(statusInfoEntries.length / columns) *
        (cellHeight + verticalGap)
    );
  } catch (error) {
    console.error("Error in addStatusInfoSection:", error);
    throw new Error("Failed to create status info section");
  }
};

/**
 * Adds company percentage list section to PDF
 * @param {Object} doc - jsPDF document instance
 * @param {Array} companies - Array of company data with percentage
 * @param {string} title - Section title
 * @param {number} x - X-coordinate to start drawing
 * @param {number} y - Y-coordinate to start drawing
 * @param {number} width - Width of the section
 * @returns {number} New Y position after drawing
 */
const addCompanyListSection = (
  doc,
  companies,
  title,
  x,
  y,
  width
) => {
  try {
    // Section title
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(title, x, y);

    // Measure text width for precise underline
    const titleWidth = getTextWidth(doc, title);

    // Underline the title
    doc.setDrawColor(50, 50, 50);
    doc.setLineWidth(0.5);
    doc.line(x, y + 1, x + titleWidth, y + 1);

    // REDUCED GAP: from 10 to 5 between heading and content
    y += 5;

    if (!companies || companies.length === 0) {
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text("No data available", x + width / 2, y + 10, {
        align: "center",
      });
      return y + 20;
    }

    // Create company list with alternating backgrounds
    companies.forEach((item, index) => {
      const rowHeight = 12;
      const rowY = y + index * rowHeight;

      // Draw background with updated colors
      if (index % 2 === 0) {
        doc.setFillColor(255, 255, 255); // White
      } else {
        // rgb(255, 248, 230) for even cards
        doc.setFillColor(255, 248, 230);
      }
      doc.rect(x, rowY, width - 5, rowHeight, "F");

      // Draw company name
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(item.company, x + 4, rowY + 8);

      // Draw percentage
      doc.setTextColor(100, 100, 100);
      doc.text(
        `${item.percentage}%`,
        x + width - 10,
        rowY + 8,
        { align: "right" }
      );

      // Draw horizontal separator
      if (index < companies.length - 1) {
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.1);
        doc.line(
          x,
          rowY + rowHeight,
          x + width - 5,
          rowY + rowHeight
        );
      }
    });

    return y + companies.length * 12 + 3; // REDUCED GAP: reduced end padding from 5 to 3
  } catch (error) {
    console.error("Error in addCompanyListSection:", error);
    throw new Error(`Failed to create ${title} section`);
  }
};

/**
 * Adds ratio details section to PDF with cards in a single horizontal row
 * @param {Object} doc - jsPDF document instance
 * @param {Object} ratioDetails - Ratio details data
 * @param {number} x - X-coordinate to start drawing
 * @param {number} y - Y-coordinate to start drawing
 * @param {number} width - Width of the section
 * @returns {number} New Y position after drawing
 */
const addRatioDetailsSection = (
  doc,
  ratioDetails,
  x,
  y,
  width
) => {
  try {
    // Section title
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("RATIO DETAILS", x, y);

    // Measure text width for precise underline
    const titleWidth = getTextWidth(doc, "RATIO DETAILS");

    // Underline the title
    doc.setDrawColor(50, 50, 50);
    doc.setLineWidth(0.5);
    doc.line(x, y + 1, x + titleWidth, y + 1);

    // REDUCED GAP: from 10 to 6
    y += 6;

    // Handle case where ratioDetails is null or undefined
    const safeRatioDetails = ratioDetails || {};

    // Convert ratio details to a format similar to status info cards
    const entries = [
      {
        label: "Selection Ratio",
        value: String(
          safeRatioDetails.selection_ratio || "N/A"
        ),
      },
      {
        label: "Selection for Diversity",
        value: String(
          safeRatioDetails.selection_ratio_for_diversity ||
            "N/A"
        ),
      },
      {
        label: "Male vs Female",
        value: String(
          safeRatioDetails.total_male_vs_female || "N/A"
        ),
      },
    ];

    // UPDATED: Display cards in a single horizontal row
    const cardHeight = 15;
    const horizontalGap = 8; // Gap between cards
    const cardWidth = (width - 2 * horizontalGap) / 3; // Width of each card

    entries.forEach((item, index) => {
      const cardX = x + index * (cardWidth + horizontalGap);

      // Draw background - light blue background for ratio cards
      doc.setFillColor(229, 236, 246); // Light blue background
      doc.roundedRect(
        cardX,
        y,
        cardWidth,
        cardHeight,
        2,
        2,
        "F"
      );

      // Draw label
      doc.setFontSize(8);
      doc.setTextColor(50, 50, 50);
      doc.text(item.label, cardX + 3, y + 6);

      // Draw value - left aligned
      doc.setFontSize(9);
      doc.setTextColor(23, 23, 23);
      doc.setFont(undefined, "bold");
      doc.text(item.value, cardX + 3, y + 12);
      doc.setFont(undefined, "normal");
    });

    // Return position after the single row of cards
    return y + cardHeight + 3; // Added a small gap of 3 after the cards
  } catch (error) {
    console.error(
      "Error in addRatioDetailsSection:",
      error
    );
    throw new Error(
      "Failed to create ratio details section"
    );
  }
};

/**
 * Checks if there is enough data to generate a PDF
 * @param {Array} selectedCandidates - Selected candidates data
 * @param {Array} rejectedCandidates - Rejected candidates data
 * @returns {boolean} True if there is data to generate a PDF
 */
export const hasDataToGeneratePdf = (
  selectedCandidates,
  rejectedCandidates
) => {
  return (
    (selectedCandidates && selectedCandidates.length > 0) ||
    (rejectedCandidates && rejectedCandidates.length > 0)
  );
};

/**
 * Generates a PDF for analytics data
 * @param {Object} analyticsData - Analytics data
 * @param {Array} statusInfoEntries - Formatted status info entries
 * @param {Array} selectedCandidates - Selected candidates data
 * @param {Array} rejectedCandidates - Rejected candidates data
 * @param {string} startDate - Start date for report period (YYYY-MM-DD)
 * @param {string} endDate - End date for report period (YYYY-MM-DD)
 * @param {string} logoPath - Path to company logo (optional)
 * @returns {Promise<boolean>} True if the PDF was generated successfully
 * @throws {Error} If there is no data to generate a PDF
 */
export const generateAnalyticsPdf = async (
  analyticsData,
  statusInfoEntries,
  selectedCandidates,
  rejectedCandidates,
  startDate,
  endDate,
  logoPath
) => {
  try {
    // First check if there is data to generate a PDF
    if (
      !hasDataToGeneratePdf(
        selectedCandidates,
        rejectedCandidates
      )
    ) {
      throw new Error("No candidate data to download");
    }

    // Create PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - 28; // 14mm margins on each side

    // Format dates for display
    const formattedStartDate =
      dayjs(startDate).format("DD/MM/YYYY");
    const formattedEndDate =
      dayjs(endDate).format("DD/MM/YYYY");

    // Add header
    await addPdfHeader(
      doc,
      formattedStartDate,
      formattedEndDate,
      logoPath
    );

    // Add status info section
    let currentY = 50;
    // REDUCED GAP: from 15 to 10 between sections
    currentY =
      addStatusInfoSection(
        doc,
        statusInfoEntries,
        currentY
      ) + 10;

    // Make sure analyticsData and ratio_details exist before passing to function
    const safeRatioDetails =
      analyticsData && analyticsData.ratio_details
        ? analyticsData.ratio_details
        : {};

    // Add Ratio Details section in a horizontal layout
    // REDUCED GAP: from 15 to 10 between sections
    currentY =
      addRatioDetailsSection(
        doc,
        safeRatioDetails,
        14,
        currentY,
        contentWidth
      ) + 10;

    // Setup columns for candidates sections
    const columnWidth = (contentWidth - 5) / 2;

    // Create column layout with more space for candidate lists
    // Add Selected Candidates section
    const selectedY = addCompanyListSection(
      doc,
      selectedCandidates,
      "SELECTED CANDIDATES",
      14,
      currentY,
      columnWidth
    );

    // Add Rejected Candidates section
    const rejectedY = addCompanyListSection(
      doc,
      rejectedCandidates,
      "REJECTED CANDIDATES",
      14 + columnWidth + 5,
      currentY,
      columnWidth
    );

    // Save the PDF
    const fileName = `analytics_report_${startDate.replace(
      /-/g,
      ""
    )}_to_${endDate.replace(/-/g, "")}.pdf`;
    doc.save(fileName);
    return true;
  } catch (error) {
    console.error("Error generating analytics PDF:", error);
    throw error; // Rethrow to be handled by caller
  }
};
