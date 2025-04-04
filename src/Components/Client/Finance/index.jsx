import {
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { getFinance, getLastMonthFinance } from "./api";
import useAuth from "../../../hooks/useAuth";
import {
  LoadingState,
  ErrorState,
} from "../../shared/loading-error-state";
import { Warning2, CloseCircle } from "iconsax-react";
import { useInView } from "react-intersection-observer";
import { useEffect, useMemo, useState } from "react";
import { getJobLabel } from "../../../utils/util";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Empty from "../../shared/Empty";
// Import Material UI DatePicker components
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";
import dayjs from "dayjs";
// Import company logo
import { CompanyLogo } from "../../../assets/index"; // Update this path to match your actual logo location

const Finance = () => {
  // State and hooks
  const { auth } = useAuth();
  const [dateRange, setDateRange] = useState({
    from: dayjs().subtract(1, "month").format("DD/MM/YYYY"),
    to: dayjs().format("DD/MM/YYYY"),
  });
  const [showDuesAlert, setShowDuesAlert] = useState(true);

  const [isGeneratingPdf, setIsGeneratingPdf] =
    useState(false);
  const { ref, inView } = useInView({ threshold: 0 });

  // Parse date string in DD/MM/YYYY format to dayjs object
  const parseDate = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split("/");
    return dayjs(`${year}-${month}-${day}`);
  };

  // Custom theme for Material UI components to match existing styles
  const theme = createTheme({
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              height: "32px",
              width: "120px", // Slightly wider to accommodate date with smaller icon
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
            // Make the date picker icon smaller
            "& .MuiSvgIcon-root": {
              fontSize: "16px",
              marginRight: "2px",
            },
            // Ensure the input takes more space by reducing icon area
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
      // Make the popup calendar have white background too
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: "white",
          },
        },
      },
    },
  });

  // Handle date changes
  const handleDateChange = (field, date) => {
    if (!date) return;

    const formattedDate = date.format("DD/MM/YYYY");
    setDateRange((prev) => ({
      ...prev,
      [field]: formattedDate,
    }));
  };

  // Query for last month's pending dues
  const {
    data: lastMonthData,
    isLoading: isLastMonthLoading,
    isError: isLastMonthError,
  } = useQuery({
    queryKey: ["lastMonthFinance"],
    queryFn: () => getLastMonthFinance(),
  });

  // Data fetching with React Query for current dues
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ["finance"],
    queryFn: ({ pageParam = 1 }) => getFinance(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.next
        ? parseInt(lastPage.next.split("page=")[1])
        : undefined,
  });

  // Calculate total amount
  const totalAmount = useMemo(() => {
    if (!data) return 0;

    return data.pages.reduce((sum, page) => {
      return page.results.reduce((pageSum, item) => {
        return (
          pageSum + (parseFloat(item.client_amount) || 0)
        );
      }, sum);
    }, 0);
  }, [data]);

  // Check if there are pending dues from last month
  const hasPendingLastMonthDues = useMemo(() => {
    if (!lastMonthData) return false;
    return lastMonthData.count > 0;
  }, [lastMonthData]);

  // Format the due amount for last month
  const lastMonthDueAmount = useMemo(() => {
    if (!lastMonthData || !lastMonthData.results) return 0;

    return lastMonthData.results.reduce((sum, item) => {
      return sum + (parseFloat(item.client_amount) || 0);
    }, 0);
  }, [lastMonthData]);

  // Fetch next page when scrolling into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    inView,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  ]);

  // PDF Generation
  const generatePDF = async () => {
    try {
      setIsGeneratingPdf(true);

      // Fetch remaining pages if necessary (with safety mechanism)
      let safetyCounter = 0;
      const MAX_ITERATIONS = 20;

      while (
        hasNextPage &&
        safetyCounter < MAX_ITERATIONS
      ) {
        await fetchNextPage();
        safetyCounter++;
      }

      // Create PDF document
      const doc = new jsPDF();

      // Add company logo
      try {
        // Create an Image object to get proper dimensions
        const img = new Image();
        img.src = CompanyLogo;

        // Function to handle image loading and maintain aspect ratio
        const addLogoToDoc = () => {
          const logoWidth = 18; // Target width in mm
          const aspectRatio = img.height / img.width;
          const logoHeight = logoWidth * aspectRatio;

          doc.addImage(
            CompanyLogo,
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

      // Add billing period and download date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const billingPeriod = `Billing Period: ${dayjs()
        .startOf("month")
        .format("DD/MM/YYYY")} - ${dayjs().format(
        "DD/MM/YYYY"
      )}`;
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
      doc.text("Current Dues", 14, 40);
      doc.text(
        `TOTAL: INR ${totalAmount.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        doc.internal.pageSize.width - 14,
        40,
        { align: "right" }
      );

      // Get all finance data and prepare table
      const allData =
        data?.pages.flatMap((page) => page.results) || [];
      const tableData = allData.map((item) => [
        item.candidate.name,
        getJobLabel(item.candidate.role),
        `${item.candidate.year}.${item.candidate.month} Years`,
        formatDate(item.scheduled_time),
        formatCurrency(item.client_amount),
      ]);

      // Create table with autoTable
      autoTable(doc, {
        startY: 50,
        head: [
          [
            "Candidate",
            "ROLE",
            "EXPERIENCE",
            "DATE",
            "AMOUNT",
          ],
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

      // Save the PDF
      doc.save("finance_report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        "Error generating PDF. Check console for details."
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Helper Functions
  const formatDate = (dateTime) => {
    return typeof dateTime === "string" &&
      dateTime.includes(" ")
      ? dateTime.split(" ")[0]
      : dateTime;
  };

  const formatCurrency = (amount) => {
    return parseFloat(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    });
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
  if (isError && isLastMonthError) return <ErrorState />;

  // Prepare data for rendering
  const displayData =
    data?.pages.flatMap((page) => page.results) || [];

  // Table styling
  const tableStyles = {
    firstCol:
      "py-4 text-left text-[#2B313E] font-semibold text-default pl-3",
    standard:
      "py-4 text-left text-[#2B313E] font-normal text-xs",
  };

  // Last month name for alert
  const lastMonthName = dayjs()
    .subtract(1, "month")
    .format("MMMM");

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Alert for pending last month dues */}
          {hasPendingLastMonthDues && showDuesAlert && (
            <div className="bg-[#FFF3F3] border border-[#FF3B30] rounded-lg p-4 mb-4 flex justify-between items-center">
              <div className="flex items-center">
                <Warning2 className="h-5 w-5 text-[#FF3B30] mr-3" />
                <p className="text-sm text-[#FF3B30]">
                  <span className="font-semibold">
                    Important:{" "}
                  </span>
                  You have pending dues from {lastMonthName}
                  . Please clear your pending amount of
                  <span className="font-semibold">
                    {" "}
                    INR {formatCurrency(lastMonthDueAmount)}
                  </span>
                  .
                </p>
              </div>
              <button
                onClick={() => setShowDuesAlert(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <CloseCircle className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-x-12">
            {/* Current Dues Section */}
            <div className="md:w-3/4">
              <div className="flex flex-col md:flex-row md:justify-between mb-12">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-base font-bold text-[#1C1C1C]">
                    Current Dues
                  </h2>
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#1C1C1C]">
                    TOTAL: INR{" "}
                    {totalAmount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h2>
                </div>
              </div>

              {/* Current Dues Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-[3px] border-[#4F4F4F] grid grid-cols-[2.5fr_2.5fr_2.5fr_2.5fr_2fr]">
                      <th className={tableStyles.firstCol}>
                        Candidate
                      </th>
                      <th className={tableStyles.standard}>
                        ROLE
                      </th>
                      <th className={tableStyles.standard}>
                        EXPERIENCE
                      </th>
                      <th className={tableStyles.standard}>
                        DATE
                      </th>
                      <th className={tableStyles.standard}>
                        AMOUNT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.length > 0 ? (
                      <>
                        {displayData.map((item, index) => (
                          <tr
                            key={`${item.candidate.name}-${item.scheduled_time}-${index}`}
                            className={`${
                              index % 2 === 1
                                ? "bg-[#e5ecf6d4] border-y border-[#0000001A]"
                                : ""
                            } grid grid-cols-[2.5fr_2.5fr_2.5fr_2.5fr_2fr]`}
                          >
                            <td
                              className={
                                tableStyles.firstCol
                              }
                            >
                              {item.candidate.name}
                            </td>
                            <td
                              className={
                                tableStyles.standard
                              }
                            >
                              {getJobLabel(
                                item.candidate.role
                              )}
                            </td>
                            <td
                              className={
                                tableStyles.standard
                              }
                            >
                              {item.candidate.year}.
                              {item.candidate.month} Years
                            </td>
                            <td
                              className={
                                tableStyles.standard
                              }
                            >
                              {formatDate(
                                item.scheduled_time
                              )}
                            </td>
                            <td
                              className={
                                tableStyles.standard
                              }
                            >
                              {formatCurrency(
                                item.client_amount
                              )}
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : null}
                  </tbody>
                </table>

                {/* Infinite scroll loading indicator */}
                <div
                  ref={ref}
                  className="py-4 text-center text-gray-500"
                >
                  {isFetchingNextPage
                    ? "Loading more..."
                    : hasNextPage
                    ? "Scroll for more"
                    : ""}
                </div>
              </div>
              {/* Empty state for no data */}
              {displayData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-4">
                  <Empty description="No data to display" />
                </div>
              )}

              {/* Download button */}
              {displayData.length > 0 && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={generatePDF}
                    disabled={isGeneratingPdf}
                    className={`
                    py-2 px-6 rounded-full text-xs font-semibold text-white h-[32px] 
                    bg-[#007AFF] transition-all duration-300 ease-in-out
                    hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] 
                    ${
                      isGeneratingPdf
                        ? "opacity-70 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  `}
                  >
                    {isGeneratingPdf
                      ? "Generating..."
                      : "Download"}
                  </button>
                </div>
              )}
            </div>

            {/* Past Payments Section */}
            <div className="md:w-1/4 mt-16">
              <div className="bg-[#E7E4E8CC] min-h-[60vh] rounded-2xl py-6 px-4">
                <h2 className="text-base font-bold text-center text-[#1C1C1C] mb-8">
                  Past Payments
                </h2>

                <div className="space-y-4">
                  {/* From date input using Material UI DatePicker */}
                  <div className="flex justify-between items-center px-3">
                    <label className="text-[#6B6F7B] text-default">
                      From
                    </label>
                    <DatePicker
                      value={parseDate(dateRange.from)}
                      onChange={(date) =>
                        handleDateChange("from", date)
                      }
                      slotProps={{
                        textField: {
                          size: "small",
                          sx: {
                            "& .MuiSvgIcon-root": {
                              fontSize: "15px",
                            },
                            "& .MuiInputAdornment-root": {
                              marginLeft: "0",
                              maxWidth: "24px",
                            },
                          },
                        },
                        // Make sure popper has white background
                        popper: {
                          sx: {
                            "& .MuiPaper-root": {
                              backgroundColor: "white",
                            },
                          },
                        },
                      }}
                      format="DD/MM/YYYY"
                    />
                  </div>

                  {/* To date input using Material UI DatePicker */}
                  <div className="flex justify-between items-center px-3">
                    <label className="text-[#6B6F7B] text-default">
                      To
                    </label>
                    <DatePicker
                      value={parseDate(dateRange.to)}
                      onChange={(date) =>
                        handleDateChange("to", date)
                      }
                      slotProps={{
                        textField: {
                          size: "small",
                          sx: {
                            "& .MuiSvgIcon-root": {
                              fontSize: "15px",
                            },
                            "& .MuiInputAdornment-root": {
                              marginLeft: "0",
                              maxWidth: "24px",
                            },
                          },
                        },
                        // Make sure popper has white background
                        popper: {
                          sx: {
                            "& .MuiPaper-root": {
                              backgroundColor: "white",
                            },
                          },
                        },
                      }}
                      format="DD/MM/YYYY"
                    />
                  </div>
                </div>

                {/* Download past payments button */}
                <div className="flex justify-center mt-16 w-[90%] mx-auto">
                  <button
                    className={`
                      py-2 px-6 rounded-full text-xs font-semibold text-white h-[32px] 
                      bg-[#007AFF] transition-all duration-300 ease-in-out
                      hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB]
                      cursor-pointer
                    `}
                  >
                    Click to Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default Finance;
