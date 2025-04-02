import { useInfiniteQuery } from "@tanstack/react-query";
import { getFinance } from "./api";
import useAuth from "../../../hooks/useAuth";
import { LoadingState, ErrorState } from "../../shared/loading-error-state";
import { Warning2 } from "iconsax-react";
import { useInView } from "react-intersection-observer";
import { useEffect, useMemo, useState } from "react";
import { getJobLabel } from '../../../utils/util';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Empty from "../../shared/Empty";

const Finance = () => {
  // State and hooks
  const { auth } = useAuth();
  const [dateRange, setDateRange] = useState({
    from: '07/12/2024',
    to: '30/12/2024'
  });
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { ref, inView } = useInView({ threshold: 0 });

  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  // Handle date changes
  const handleDateChange = (field, value) => {
    const date = new Date(value);
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    setDateRange(prev => ({
      ...prev,
      [field]: formattedDate
    }));
  };

  // Data fetching with React Query
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError
  } = useInfiniteQuery({
    queryKey: ['finance'],
    queryFn: () => getFinance(),
    getNextPageParam: (lastPage) => 
      lastPage.next ? parseInt(lastPage.next.split('page=')[1]) : undefined
  });

  // Calculate total amount
  const totalAmount = useMemo(() => {
    if (!data) return 0;
    
    return data.pages.reduce((sum, page) => {
      return page.results.reduce((pageSum, item) => {
        return pageSum + (parseFloat(item.client_amount) || 0);
      }, sum);
    }, 0);
  }, [data]);

  // Fetch next page when scrolling into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // PDF Generation
  const generatePDF = async () => {
    try {
      setIsGeneratingPdf(true);
      
      // Fetch remaining pages if necessary (with safety mechanism)
      let safetyCounter = 0;
      const MAX_ITERATIONS = 20;
      
      while (hasNextPage && safetyCounter < MAX_ITERATIONS) {
        await fetchNextPage();
        safetyCounter++;
      }
      
      // Create PDF document
      const doc = new jsPDF();
      
      // Add title and total
      doc.setFontSize(14);
      doc.text('Current Dues', 14, 20);
      doc.text(`TOTAL: INR ${totalAmount.toLocaleString('en-IN', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`, 14, 30);
      
      // Get all finance data and prepare table
      const allData = data?.pages.flatMap(page => page.results) || [];
      const tableData = allData.map(item => [
        item.candidate.name,
        getJobLabel(item.candidate.role),
        `${item.candidate.year}.${item.candidate.month} Years`,
        formatDate(item.scheduled_time),
        formatCurrency(item.client_amount)
      ]);
      
      // Create table with autoTable
      autoTable(doc, {
        startY: 40,
        head: [['Candidate', 'ROLE', 'EXPERIENCE', 'DATE', 'AMOUNT']],
        body: tableData,
        headStyles: { 
          fillColor: [43, 49, 62],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [229, 236, 246]
        },
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 3
        }
      });
      
      // Save the PDF
      doc.save('finance_report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Check console for details.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Helper Functions
  const formatDate = (dateTime) => {
    return typeof dateTime === 'string' && dateTime.includes(' ') 
      ? dateTime.split(' ')[0] 
      : dateTime;
  };

  const formatCurrency = (amount) => {
    return parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  };

  // Access control check
  if (auth?.role !== 'client_owner') {
    return (
      <div className="flex flex-col items-center justify-center min-h-60 text-[#ffa500]">
        <Warning2 className="h-12 w-12" />
        <p className="mt-2">You are not authorized to view this page.</p>
      </div>
    );
  }

  // Loading and error states
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  // Prepare data for rendering
  const displayData = data?.pages.flatMap(page => page.results) || [];

  // Table styling
  const tableStyles = {
    firstCol: "py-4 text-left text-[#2B313E] font-semibold text-default pl-3",
    standard: "py-4 text-left text-[#2B313E] font-normal text-xs"
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-x-12">
        {/* Current Dues Section */}
        <div className="md:w-3/4">
          <div className="flex flex-col md:flex-row md:justify-between mb-12">
            <div className="mb-4 md:mb-0">
              <h2 className="text-base font-bold text-[#1C1C1C]">Current Dues</h2>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1C1C1C]">
                TOTAL: INR {totalAmount.toLocaleString('en-IN', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </h2>
            </div>
          </div>

          {/* Current Dues Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-[3px] border-[#4F4F4F] grid grid-cols-[2.5fr_2.5fr_2.5fr_2.5fr_2fr]">
                  <th className={tableStyles.firstCol}>Candidate</th>
                  <th className={tableStyles.standard}>ROLE</th>
                  <th className={tableStyles.standard}>EXPERIENCE</th>
                  <th className={tableStyles.standard}>DATE</th>
                  <th className={tableStyles.standard}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {displayData.length > 0 ? (
                  <>
                   {displayData.map((item, index) => (
                  <tr 
                    key={`${item.candidate.name}-${item.scheduled_time}-${index}`}
                    className={`${index % 2 === 1 ? "bg-[#e5ecf6d4] border-y border-[#0000001A]" : ""} grid grid-cols-[2.5fr_2.5fr_2.5fr_2.5fr_2fr]`}
                  >
                    <td className={tableStyles.firstCol}>{item.candidate.name}</td>
                    <td className={tableStyles.standard}>{getJobLabel(item.candidate.role)}</td>
                    <td className={tableStyles.standard}>{item.candidate.year}.{item.candidate.month} Years</td>
                    <td className={tableStyles.standard}>{formatDate(item.scheduled_time)}</td>
                    <td className={tableStyles.standard}>{formatCurrency(item.client_amount)}</td>
                  </tr>
                ))}
                  </>
                ): null}
              </tbody>
            </table>
            
            {/* Infinite scroll loading indicator */}
            <div ref={ref} className="py-4 text-center text-gray-500">
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
                ${isGeneratingPdf ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {isGeneratingPdf ? "Generating..." : "Download"}
            </button>
          </div>
          )}
        </div>
        
        {/* Past Payments Section */}
        <div className="md:w-1/4 mt-16">
          <div className="bg-[#E7E4E8CC] min-h-[60vh] rounded-2xl py-6 px-4">
            <h2 className="text-base font-bold text-center text-[#1C1C1C] mb-8">Past Payments</h2>
            
            <div className="space-y-4">
              {/* From date input */}
              <div className="flex justify-between items-center px-3">
                <label className="text-[#6B6F7B] text-default">From</label>
                <input 
                  type="date" 
                  value={formatDateForInput(dateRange.from)}
                  onChange={(e) => handleDateChange('from', e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-default w-28"
                />
              </div>
              
              {/* To date input */}
              <div className="flex justify-between items-center px-3">
                <label className="text-[#6B6F7B] text-default">To</label>
                <input 
                  type="date" 
                  value={formatDateForInput(dateRange.to)}
                  onChange={(e) => handleDateChange('to', e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-default w-28"
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
  );
};

export default Finance;