import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import {
  formatDate,
  formatCurrency,
} from "../../../Client/Finance/utils/formatters";
import { getJobLabel } from "../../../../utils/util";

/**
 * Adds common PDF header elements like logo, title, dates, etc.
 * @param {Object} doc - jsPDF document instance
 * @param {string} title - Document title
 * @param {string} startDate - Start date for billing period
 * @param {string} endDate - End date for billing period
 * @param {number} totalAmount - Total amount to display
 * @param {string} logoPath - Path to company logo
 */
const addPdfHeader = async (
  doc,
  title,
  startDate,
  endDate,
  totalAmount,
  logoPath
) => {
  // Add company logo
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
    console.error("Error adding logo to PDF:", logoError);
    // Continue without logo if there's an error
  }

  // Add billing period and download date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const billingPeriod = `Billing Period: ${startDate} - ${endDate}`;
  const downloadDate = `Date Printed: ${dayjs().format(
    "DD/MM/YYYY"
  )}`;
  doc.text(
    billingPeriod,
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

  const pageWidth = doc.internal.pageSize.width;
  doc.setDrawColor(200, 200, 200); // Light gray color
  doc.setLineWidth(0.5);
  doc.line(14, 30, pageWidth - 14, 30);

  // Add title and total
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(title, 14, 40);
  doc.text(
    `TOTAL: INR ${totalAmount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    doc.internal.pageSize.width - 14,
    40,
    { align: "right" }
  );
};

/**
 * Creates table data from finance items for interviewer
 * @param {Array} data - Array of finance data items
 * @returns {Array} Formatted table data
 */
const createInterviewerTableData = (data) => {
  return data.map((item) => [
    item.candidate.name,
    getJobLabel(item.candidate.role),
    `${item.candidate.year}.${item.candidate.month} Years`,
    formatDate(item.scheduled_time),
    formatCurrency(item.amount),
  ]);
};

/**
 * Adds table to PDF document for current receivables
 * @param {Object} doc - jsPDF document instance
 * @param {Array} tableData - Array of data for table rows
 */
const addCurrentReceivablesTableToPdf = (
  doc,
  tableData
) => {
  autoTable(doc, {
    startY: 50,
    head: [
      ["Candidate", "Role", "Experience", "Date", "Amount"],
    ],
    body: tableData,
    headStyles: {
      fillColor: [43, 49, 62],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [229, 236, 246],
    },
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
  });
};

/**
 * Adds table to PDF document for past payments with light yellow background
 * @param {Object} doc - jsPDF document instance
 * @param {Array} tableData - Array of data for table rows
 */
const addPastPaymentsTableToPdf = (doc, tableData) => {
  autoTable(doc, {
    startY: 50,
    head: [
      ["Candidate", "Role", "Experience", "Date", "Amount"],
    ],
    body: tableData,
    headStyles: {
      fillColor: [43, 49, 62],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [255, 249, 219], // Light yellow for past payments
    },
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
  });
};

/**
 * Generates a PDF for interviewer's current receivables
 * @param {Array} data - Finance data
 * @param {number} totalAmount - Total amount to display
 * @param {string} logoPath - Path to company logo
 */
export const generateInterviewerCurrentReceivablesPdf =
  async (data, totalAmount, logoPath) => {
    try {
      // Create PDF document
      const doc = new jsPDF();

      // Add header
      const currentDate = dayjs().format("DD/MM/YYYY");
      const startOfMonth = dayjs()
        .startOf("month")
        .format("DD/MM/YYYY");

      await addPdfHeader(
        doc,
        "Current Receivables",
        startOfMonth,
        currentDate,
        totalAmount,
        logoPath
      );

      // Create table data and add table
      const tableData = createInterviewerTableData(data);
      addCurrentReceivablesTableToPdf(doc, tableData);

      // Save the PDF
      doc.save("interviewer_current_receivables.pdf");
      return true;
    } catch (error) {
      console.error("Error generating PDF:", error);
      return false;
    }
  };

/**
 * Generates a PDF for interviewer's past payments
 * @param {Array} data - Finance data for last month
 * @param {number} totalAmount - Total amount to display
 * @param {string} logoPath - Path to company logo
 * @param {string} monthName - Name of the month for the past payments (optional)
 */
export const generateInterviewerPastPaymentsPdf = async (
  data,
  totalAmount,
  logoPath,
  monthName = null
) => {
  try {
    // Create PDF document
    const doc = new jsPDF();

    // Get last month's date range if not specified
    const lastMonthName =
      monthName ||
      dayjs().subtract(1, "month").format("MMMM");

    const lastMonthStart = dayjs()
      .subtract(1, "month")
      .startOf("month")
      .format("DD/MM/YYYY");
    const lastMonthEnd = dayjs()
      .subtract(1, "month")
      .endOf("month")
      .format("DD/MM/YYYY");

    // Add header
    await addPdfHeader(
      doc,
      `Past Payments (${lastMonthName})`,
      lastMonthStart,
      lastMonthEnd,
      totalAmount,
      logoPath
    );

    // Create table data and add table with light yellow background
    const tableData = createInterviewerTableData(data);
    addPastPaymentsTableToPdf(doc, tableData);

    // Save the PDF
    doc.save(
      `interviewer_past_payments_${lastMonthName.toLowerCase()}.pdf`
    );
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};
