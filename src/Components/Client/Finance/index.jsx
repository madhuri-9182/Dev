import { useInfiniteQuery } from "@tanstack/react-query";
import { getFinance } from "./api";
import useAuth from "../../../hooks/useAuth";
import { LoadingState, ErrorState } from "../../shared/loading-error-state";
import { Warning2 } from "iconsax-react";
import { useInView } from "react-intersection-observer";
import { useEffect, useMemo, useState } from "react";
import { getJobLabel } from '../../../utils/util';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';

const Finance = () => {
    const {auth} = useAuth();
    const [fromDate, setFromDate] = useState('07/12/2024');
    const [toDate, setToDate] = useState('30/12/2024');
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const formatDateForInput = (dateString) => {
      if (!dateString) return '';
      const [day, month, year] = dateString.split('/');
      return `${year}-${month}-${day}`;
    };

    const { ref, inView } = useInView({
      threshold: 0, // Trigger as soon as the element is in view
    });

   const {data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, isError} = useInfiniteQuery({
    queryKey: ['finance'],
    queryFn: () => getFinance(),
    getNextPageParam: (lastPage) => {
      // Return the next page number, or undefined if there are no more pages
      return lastPage.next ? parseInt(lastPage.next.split('page=')[1]) : undefined;
    }
   });

   const totalAmount = useMemo(() => {
    if (!data) return 0;
    
    let sum = 0;
    data.pages.forEach(page => {
      page.results.forEach(item => {
        sum += parseFloat(item.client_amount) || 0;
      });
    });
    
    return sum;
  }, [data]);

   useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Function to download all finance data as PDF
  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPdf(true);
      
      // Fetch remaining pages if necessary (with safety mechanism)
      let safetyCounter = 0;
      const MAX_ITERATIONS = 20; // Prevent infinite loops
      
      while (hasNextPage && safetyCounter < MAX_ITERATIONS) {
        await fetchNextPage();
        safetyCounter++;
      }
      
      // Create new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(14);
      doc.text('Current Dues', 14, 20);
      
      // Add total amount
      doc.setFontSize(14);
      doc.text(`TOTAL: INR ${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 14, 30);
      
      // Get all finance data
      const allData = data?.pages.flatMap(page => page.results) || [];
      
      // Prepare table data
      const tableData = allData.map(item => [
        item.candidate.name,
        getJobLabel(item.candidate.role),
        `${item.candidate.year}.${item.candidate.month} Years`,
        typeof item.scheduled_time === 'string' && item.scheduled_time.includes(' ') 
          ? item.scheduled_time.split(' ')[0] 
          : item.scheduled_time,
        parseFloat(item.client_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })
      ]);
      
      // Create table - using the imported autoTable function
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
      setIsGeneratingPdf(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGeneratingPdf(false);
      alert('Error generating PDF. Check console for details.');
    }
  };

  // Function to download past payments PDF based on date range
  const handleDownloadPastPaymentsPDF = async () => {
    try {
      setIsGeneratingPdf(true);
      
      // Here you would typically fetch past payments data based on date range
      // For now, we'll create a simple PDF showing the date range
      
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Past Payments Report', 14, 20);
      
      // Add date range
      doc.setFontSize(12);
      doc.text(`Date Range: ${fromDate} to ${toDate}`, 14, 30);
      
      // You would typically add a table with past payment data here
      doc.text('No past payment data available for the selected date range.', 14, 40);
      
      // Save the PDF
      doc.save('past_payments_report.pdf');
      setIsGeneratingPdf(false);
    } catch (error) {
      console.error('Error generating past payments PDF:', error);
      setIsGeneratingPdf(false);
    }
  };
   
   if(auth?.role !== 'client_owner'){
    return (
      <div className="flex flex-col items-center justify-center min-h-60 text-[#ffa500]">
            <Warning2 className="h-12 w-12" />
            <p className="mt-2">
              You are not authorized to view this page.
            </p>
          </div>
    )
   }
   if(isLoading) return <LoadingState />
    if(isError) return <ErrorState />

    const displayData = data?.pages.flatMap(page => page.results) || [];

    const tableFirstColClassName = `py-4 text-left text-[#2B313E] font-semibold text-default pl-3`;
    const tableClassName = `py-4 text-left text-[#2B313E] font-normal text-xs`;

  return (
    <div className="p-6 max-w-7xl mx-auto">
    
    <div className="flex flex-col md:flex-row gap-x-12">
      {/* Main table section */}
      <div className="md:w-2/3">
      <div className="flex flex-col md:flex-row md:justify-between mb-12">
      <div className="mb-4 md:mb-0">
        <h2 className="text-base font-bold text-[#1C1C1C]">Current Dues</h2>
      </div>
      <div>
        <h2 className="text-base font-bold text-[#1C1C1C]">TOTAL: INR {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
      </div>
    </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-[3px] border-[#4F4F4F]">
                <th className={tableFirstColClassName}>Candidate</th>
                <th className={tableClassName}>ROLE</th>
                <th className={tableClassName}>EXPERIENCE</th>
                <th className={tableClassName}>DATE</th>
                <th className={tableClassName}>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((item, index) => {
                const isEven = index % 2 === 1;
                
                return (
                  <tr 
                    key={`${item.candidate.name}-${item.scheduled_time}-${index}`}
                    className={isEven ? "bg-[#e5ecf6d4] border-y border-[#0000001A]" : ""}
                  >
                    <td className={tableFirstColClassName}>{item.candidate.name}</td>
                    <td className={tableClassName}>{getJobLabel(item.candidate.role)}</td>
                    <td className={tableClassName}>{item.candidate.year}.{item.candidate.month} Years</td>
                    <td className={tableClassName}>{typeof item.scheduled_time === 'string' && item.scheduled_time.includes(' ') 
                      ? item.scheduled_time.split(' ')[0] 
                      : item.scheduled_time}
                    </td>
                    <td className={tableClassName}>
                      {parseFloat(item.client_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {/* Loading indicator */}
          <div ref={ref} className="py-4 text-center text-gray-500">
            {isFetchingNextPage 
              ? "Loading more..." 
              : hasNextPage 
                ? "Scroll for more" 
                : ""}
          </div>
        </div>
        
        {/* Download button at bottom */}
        <div className="mt-6 flex justify-end">
          <button 
          type="button"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className={`py-2 px-6 rounded-full text-xs font-semibold text-white h-[32px] 
             bg-[#007AFF] transition-all duration-300 ease-in-out
             hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] 
             ${isGeneratingPdf ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}>
            {isGeneratingPdf ? "Generating..." : "Download"}
          </button>
        </div>
      </div>
      
      {/* Past payments panel */}
      <div className="md:w-1/3 mt-16">
        <div className="bg-gray-100 rounded-lg p-6">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-8">Past Payments</h2>
          
          <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-gray-700">From</label>
                <input 
                  type="date" 
                  value={formatDateForInput(fromDate)}
                  onChange={(e) => {
                    // Convert from YYYY-MM-DD to DD/MM/YYYY format
                    const date = new Date(e.target.value);
                    const formattedDate = date.toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    });
                    setFromDate(formattedDate);
                  }}
                  className="border border-gray-300 rounded-md px-3 py-2 w-40"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <label className="text-gray-700">To</label>
                <input 
                  type="date" 
                  value={formatDateForInput(toDate)}
                  onChange={(e) => {
                    // Convert from YYYY-MM-DD to DD/MM/YYYY format
                    const date = new Date(e.target.value);
                    const formattedDate = date.toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    });
                    setToDate(formattedDate);
                  }}
                  className="border border-gray-300 rounded-md px-3 py-2 w-40"
                />
              </div>
            
            <div className="flex justify-center mt-8">
              <button 
                onClick={handleDownloadPastPaymentsPDF}
                disabled={isGeneratingPdf}
                className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full transition duration-300 w-full
                ${isGeneratingPdf ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {isGeneratingPdf ? "Generating..." : "Click to Download"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Finance