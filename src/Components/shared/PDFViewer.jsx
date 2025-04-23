import { useState, useEffect, useRef } from "react";
import { LoadingState } from "../shared/loading-error-state";
import PropTypes from "prop-types";

// Reusable PDF viewer component that accepts a PDF file source as a prop
const PDFViewer = ({ pdfFile }) => {
  // DOM references
  const containerRef = useRef(null);

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [renderedPages, setRenderedPages] = useState([]);
  const [containerWidth, setContainerWidth] = useState(0);

  // Measure container width when it's available
  useEffect(() => {
    if (!containerRef.current) return;

    const measureContainer = () => {
      const width = containerRef.current.clientWidth;
      setContainerWidth(width);
    };

    // Initial measurement
    measureContainer();

    // Re-measure on window resize
    window.addEventListener("resize", measureContainer);
    return () =>
      window.removeEventListener(
        "resize",
        measureContainer
      );
  }, []);

  // Main loading effect
  useEffect(() => {
    let isMounted = true;

    const loadPDFLibrary = async () => {
      if (window.pdfjsLib) return window.pdfjsLib;

      try {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
        script.async = true;

        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });

        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

        return window.pdfjsLib;
      } catch (error) {
        console.error(
          "Error loading PDF.js library",
          error
        );
        throw new Error(
          "Failed to load PDF.js library: " + error.message
        );
      }
    };

    const loadPDFDocument = async (pdfjsLib) => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfFile);

        loadingTask.onProgress = (data) => {
          if (data.total && isMounted) {
            const percent = Math.round(
              (data.loaded / data.total) * 50
            );
            setLoadingProgress(percent);
          }
        };

        const pdf = await loadingTask.promise;

        if (!isMounted) return null;
        setLoadingProgress(50);
        return pdf;
      } catch (error) {
        console.error("Error loading PDF document", error);
        throw new Error(
          "Failed to load PDF document: " + error.message
        );
      }
    };

    const renderPDFPages = async (pdf, availableWidth) => {
      try {
        if (!pdf) return [];

        const pageCanvases = [];
        const totalPages = pdf.numPages;

        for (
          let pageNum = 1;
          pageNum <= totalPages;
          pageNum++
        ) {
          if (!isMounted) return [];

          // Get the page
          const page = await pdf.getPage(pageNum);

          // Calculate scale to fit width
          const viewport = page.getViewport({ scale: 1.0 });
          const scale =
            (availableWidth - 20) / viewport.width; // Account for padding
          const scaledViewport = page.getViewport({
            scale,
          });

          // Create canvas
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          // Set dimensions with pixel density consideration
          const pixelRatio = window.devicePixelRatio || 1;
          canvas.width = scaledViewport.width * pixelRatio;
          canvas.height =
            scaledViewport.height * pixelRatio;

          // Set display size
          canvas.style.width = `${scaledViewport.width}px`;
          canvas.style.height = `${scaledViewport.height}px`;
          canvas.style.display = "block";
          canvas.style.margin = "0 auto 12px auto";
          canvas.style.boxShadow =
            "0 2px 5px rgba(0,0,0,0.1)";

          // Scale for high DPI
          context.scale(pixelRatio, pixelRatio);

          // Render page
          await page.render({
            canvasContext: context,
            viewport: scaledViewport,
          }).promise;

          pageCanvases.push(canvas);

          // Update progress (50-100%)
          if (isMounted) {
            const renderProgress =
              50 + Math.round((pageNum / totalPages) * 50);
            setLoadingProgress(renderProgress);
          }
        }
        return pageCanvases;
      } catch (error) {
        console.error("Error rendering PDF pages", error);
        throw new Error(
          "Failed to render PDF pages: " + error.message
        );
      }
    };

    const loadAndRenderPDF = async () => {
      try {
        // Reset state when PDF file changes
        setIsLoading(true);
        setError(null);
        setRenderedPages([]);
        setLoadingProgress(0);

        // Step 1: Make sure we have a container width to work with
        if (!containerWidth) {
          return; // Will retry when containerWidth changes
        }

        // Step 2: Load PDF.js library
        const pdfjsLib = await loadPDFLibrary();

        // Step 3: Load the PDF document
        const pdfDocument = await loadPDFDocument(pdfjsLib);

        // Step 4: Render all pages
        const pages = await renderPDFPages(
          pdfDocument,
          containerWidth
        );

        // Step 5: Update state with rendered pages
        if (isMounted && pages.length > 0) {
          setRenderedPages(pages);
          setLoadingProgress(100);

          // Delay setting isLoading to false slightly to ensure state updates
          setTimeout(() => {
            if (isMounted) {
              setIsLoading(false);
            }
          }, 100);
        }
      } catch (err) {
        console.error("PDF processing error:", err);
        if (isMounted) {
          setError(
            err.message || "Unknown error loading PDF"
          );
          setIsLoading(false);
        }
      }
    };

    loadAndRenderPDF();

    return () => {
      isMounted = false;
    };
  }, [containerWidth, pdfFile]); // Re-run when container width or pdfFile changes

  // Effect to append pages to the DOM
  useEffect(() => {
    if (
      isLoading ||
      renderedPages.length === 0 ||
      !containerRef.current
    ) {
      return;
    }

    // Clear existing content
    const container = containerRef.current;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Add pages to DOM
    renderedPages.forEach((canvas) => {
      container.appendChild(canvas);
    });
  }, [isLoading, renderedPages]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white bg-opacity-90">
          <LoadingState />
        </div>
      )}

      {/* Error message */}
      {!isLoading && error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-90">
          <div className="text-red-600 p-4 bg-red-50 rounded-md max-w-md shadow-md">
            <h3 className="font-bold mb-2">
              Error Loading PDF
            </h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* PDF container - always present so we can measure it */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-auto p-4 flex flex-col items-center"
        style={{
          backgroundColor: "#fff",
          minHeight: "300px",
          position: "relative",
        }}
      >
        {!isLoading &&
          !error &&
          renderedPages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-500">
                No PDF content to display
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default PDFViewer;

PDFViewer.propTypes = {
  pdfFile: PropTypes.string,
};
