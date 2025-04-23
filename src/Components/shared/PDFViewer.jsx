import { useState, useEffect, useRef } from "react";
import { LoadingState } from "../shared/loading-error-state";
import PropTypes from "prop-types";

// Optimized PDF viewer with virtualization and progressive loading
const PDFViewer = ({ pdfFile }) => {
  // DOM references
  const containerRef = useRef(null);
  const pdfDocumentRef = useRef(null);
  const pageRenderingRef = useRef({});
  const pdfPagesRef = useRef({});
  const observerRef = useRef(null);

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [isLibraryLoaded, setIsLibraryLoaded] =
    useState(false);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [visiblePages, setVisiblePages] = useState(
    new Set()
  );
  const [containerWidth, setContainerWidth] = useState(0);
  const [pageElements, setPageElements] = useState([]);

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

  // Load PDF.js library
  useEffect(() => {
    const loadPDFLibrary = async () => {
      if (window.pdfjsLib) {
        setIsLibraryLoaded(true);
        return;
      }

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

        setIsLibraryLoaded(true);
      } catch (error) {
        console.error(
          "Error loading PDF.js library",
          error
        );
        setError(
          "Failed to load PDF.js library: " + error.message
        );
        setIsLoading(false);
      }
    };

    loadPDFLibrary();
  }, []);

  // Load PDF document once library is loaded
  useEffect(() => {
    if (!isLibraryLoaded || !pdfFile) return;

    let isMounted = true;

    const loadPDFDocument = async () => {
      try {
        // Reset state when PDF file changes
        setIsLoading(true);
        setError(null);
        setLoadingProgress(0);
        setTotalPages(0);
        setPageElements([]);
        setVisiblePages(new Set());

        // Clear any existing document
        if (pdfDocumentRef.current) {
          pdfDocumentRef.current.destroy();
          pdfDocumentRef.current = null;
        }

        // Load the PDF document
        const loadingTask =
          window.pdfjsLib.getDocument(pdfFile);

        loadingTask.onProgress = (data) => {
          if (data.total && isMounted) {
            const percent = Math.round(
              (data.loaded / data.total) * 100
            );
            setLoadingProgress(percent);
          }
        };

        const pdf = await loadingTask.promise;

        if (!isMounted) return;

        pdfDocumentRef.current = pdf;
        setTotalPages(pdf.numPages);

        // Create placeholder elements for all pages
        const elements = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          elements.push({
            pageNum: i,
            key: `pdf-page-${i}`,
            loaded: false,
          });
        }

        setPageElements(elements);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading PDF document", error);
        if (isMounted) {
          setError(
            "Failed to load PDF document: " + error.message
          );
          setIsLoading(false);
        }
      }
    };

    loadPDFDocument();

    return () => {
      isMounted = false;
    };
  }, [isLibraryLoaded, pdfFile]);

  // Setup Intersection Observer for virtualization
  useEffect(() => {
    if (
      isLoading ||
      !containerRef.current ||
      totalPages === 0
    )
      return;

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    const options = {
      root: containerRef.current,
      rootMargin: "200px 0px", // Load pages 200px above and below viewport
      threshold: 0.1, // 10% visibility triggers callback
    };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const newVisiblePages = new Set(visiblePages);

        entries.forEach((entry) => {
          const pageNum = parseInt(
            entry.target.dataset.pageNum
          );

          if (entry.isIntersecting) {
            newVisiblePages.add(pageNum);
          } else {
            // Keep recently viewed pages in memory
            // Optionally, we could remove them if we want to free up memory
            // newVisiblePages.delete(pageNum);
          }
        });

        if (
          JSON.stringify([...newVisiblePages].sort()) !==
          JSON.stringify([...visiblePages].sort())
        ) {
          setVisiblePages(newVisiblePages);
        }
      },
      options
    );

    // Observe all page placeholders
    const pagePlaceholders =
      containerRef.current.querySelectorAll(
        ".pdf-page-placeholder"
      );
    pagePlaceholders.forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, totalPages, containerWidth]);

  // Render visible pages
  useEffect(() => {
    if (
      isLoading ||
      totalPages === 0 ||
      !containerWidth ||
      visiblePages.size === 0
    )
      return;

    const renderPage = async (pageNum) => {
      // Skip if already rendering or rendered
      if (
        pageRenderingRef.current[pageNum] ||
        pdfPagesRef.current[pageNum]
      )
        return;

      // Mark as rendering
      pageRenderingRef.current[pageNum] = true;

      try {
        // Get the page
        const page = await pdfDocumentRef.current.getPage(
          pageNum
        );

        // Calculate scale to fit width
        const viewport = page.getViewport({ scale: 1.0 });
        const scale =
          (containerWidth - 40) / viewport.width; // Account for padding
        const scaledViewport = page.getViewport({ scale });

        // Find placeholder element
        const placeholder = document.getElementById(
          `pdf-page-placeholder-${pageNum}`
        );
        if (!placeholder) {
          pageRenderingRef.current[pageNum] = false;
          return;
        }

        // Create canvas
        const canvas = document.createElement("canvas");
        canvas.id = `pdf-page-canvas-${pageNum}`;
        canvas.className = "pdf-page-canvas";

        // Set dimensions with pixel density consideration
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = scaledViewport.width * pixelRatio;
        canvas.height = scaledViewport.height * pixelRatio;

        // Set display size
        canvas.style.width = `${scaledViewport.width}px`;
        canvas.style.height = `${scaledViewport.height}px`;
        canvas.style.display = "block";

        // Add canvas to placeholder
        placeholder.innerHTML = "";
        placeholder.appendChild(canvas);
        placeholder.style.height = `${scaledViewport.height}px`;
        placeholder.classList.remove("bg-gray-100");

        // Get rendering context
        const context = canvas.getContext("2d");

        // Scale for high DPI
        context.scale(pixelRatio, pixelRatio);

        // Render page
        await page.render({
          canvasContext: context,
          viewport: scaledViewport,
        }).promise;

        // Store reference to rendered page
        pdfPagesRef.current[pageNum] = canvas;

        // Mark rendering complete
        pageRenderingRef.current[pageNum] = false;
      } catch (error) {
        console.error(
          `Error rendering page ${pageNum}:`,
          error
        );
        pageRenderingRef.current[pageNum] = false;
      }
    };

    // Render visible pages
    visiblePages.forEach((pageNum) => {
      renderPage(pageNum);
    });
  }, [visiblePages, isLoading, totalPages, containerWidth]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pdfDocumentRef.current) {
        pdfDocumentRef.current.destroy();
      }

      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Initial loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white bg-opacity-90">
          <LoadingState />
          <div className="mt-2 text-sm text-gray-600">
            Loading PDF ({loadingProgress}%)
          </div>
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

      {/* PDF container */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-auto p-4 bg-white"
        style={{ minHeight: "300px" }}
      >
        {!isLoading &&
          !error &&
          pageElements.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-500">
                No PDF content to display
              </p>
            </div>
          )}

        {!isLoading &&
          !error &&
          pageElements.map(({ pageNum, key }) => (
            <div
              key={key}
              id={`pdf-page-placeholder-${pageNum}`}
              className="pdf-page-placeholder bg-gray-100 rounded mb-4 mx-auto transition-all duration-300"
              data-page-num={pageNum}
              style={{
                width: containerWidth
                  ? `${containerWidth - 40}px`
                  : "100%",
                height: "300px", // Initial placeholder height
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="text-gray-400">
                Page {pageNum}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PDFViewer;

PDFViewer.propTypes = {
  pdfFile: PropTypes.string.isRequired,
};
