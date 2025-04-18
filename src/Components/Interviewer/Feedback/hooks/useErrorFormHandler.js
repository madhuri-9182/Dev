import { useEffect, useRef } from "react";

/**
 * Custom hook for handling form errors with focus and smooth scrolling
 * @param {Object} errors - The form errors object from react-hook-form
 * @param {Object} options - Additional options
 * @returns {Object} - Utility functions for error handling
 */
export const useFormErrorHandler = (
  errors,
  options = {}
) => {
  const {
    scrollBehavior = "smooth",
    scrollBlock = "center",
    focusDelay = 500,
  } = options;

  // Ref to track if we've attempted submission
  const hasAttemptedSubmit = useRef(false);

  // Find the first error element in the DOM
  const findFirstErrorElement = () => {
    // Function to find the first error path in the error object
    const findFirstErrorPath = (obj, path = "") => {
      // Handle errors in arrays (like skills)
      if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          if (obj[i] && typeof obj[i] === "object") {
            const result = findFirstErrorPath(
              obj[i],
              `${path}[${i}]`
            );
            if (result) return result;
          }
        }
        return null;
      }

      // Handle errors in objects
      if (obj && typeof obj === "object") {
        // If this is an actual field error with a message, return the path
        if (obj.message) {
          return path;
        }

        // Otherwise, explore all properties
        for (const key in obj) {
          const newPath = path ? `${path}.${key}` : key;
          const result = findFirstErrorPath(
            obj[key],
            newPath
          );
          if (result) return result;
        }
      }

      return null;
    };

    // Get the first error path from the errors object
    const errorPath = findFirstErrorPath(errors);
    if (!errorPath) return null;

    // Convert the path to a query selector
    // Handle special cases for different input types
    const normalizedPath = errorPath.replace(
      /\[(\d+)\]/g,
      ".$1"
    );

    // Try different selectors based on form structure
    // First try with exact name match
    let selector = `[name="${normalizedPath}"]`;
    let element = document.querySelector(selector);

    // If not found, try with data-error-key attribute
    if (!element) {
      selector = `[data-error-key="${normalizedPath}"]`;
      element = document.querySelector(selector);
    }

    // If still not found, try partial match for arrays or nested fields
    if (!element) {
      const parts = normalizedPath.split(".");
      // Try with closest parent container
      for (let i = parts.length - 1; i >= 0; i--) {
        const partialPath = parts.slice(0, i).join(".");
        if (partialPath) {
          selector = `[data-error-section="${partialPath}"]`;
          element = document.querySelector(selector);
          if (element) break;
        }
      }
    }

    // If still not found, look for elements with error-related classes
    if (!element) {
      // Find the first visible error message
      const errorMsg = document.querySelector(
        ".text-\\[\\#B10E0EE5\\]"
      );
      if (errorMsg) {
        // Get the closest input or container
        element = errorMsg
          .closest(".mb-6, .mb-5, .mb-4")
          ?.querySelector(
            'input, textarea, select, [role="listbox"]'
          );
      }
    }

    return element;
  };

  // Function to scroll to and focus on an element
  const scrollToAndFocusElement = (element) => {
    if (!element) return;

    // Get the element's position
    const rect = element.getBoundingClientRect();
    const isInViewport =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight ||
          document.documentElement.clientHeight) &&
      rect.right <=
        (window.innerWidth ||
          document.documentElement.clientWidth);

    // If not in viewport, scroll to it
    if (!isInViewport) {
      // Scroll with smooth behavior
      element.scrollIntoView({
        behavior: scrollBehavior,
        block: scrollBlock,
      });

      // Wait for the scroll to complete before focusing
      setTimeout(() => {
        // Try to focus the element
        if (typeof element.focus === "function") {
          element.focus({ preventScroll: true });
        }
      }, focusDelay);
    } else {
      // If already in viewport, just focus
      if (typeof element.focus === "function") {
        element.focus({ preventScroll: true });
      }
    }
  };

  // Function to handle errors (to be called on form submission failure)
  const handleErrors = () => {
    hasAttemptedSubmit.current = true;

    // Find and focus the first error element
    const firstErrorElement = findFirstErrorElement();
    scrollToAndFocusElement(firstErrorElement);
  };

  // Effect to handle errors when they change after submission attempt
  useEffect(() => {
    if (
      hasAttemptedSubmit.current &&
      errors &&
      Object.keys(errors).length > 0
    ) {
      // Find and focus the first error element
      const firstErrorElement = findFirstErrorElement();
      scrollToAndFocusElement(firstErrorElement);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  return {
    handleErrors,
    findFirstErrorElement,
    scrollToAndFocusElement,
    hasAttemptedSubmit,
  };
};

export default useFormErrorHandler;
