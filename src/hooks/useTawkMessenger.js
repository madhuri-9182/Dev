import { useEffect, useRef, useState } from "react";

export const useTawkMessenger = (
  isAuthenticated,
  userRole,
  allowedRoles
) => {
  const [isVisible, setIsVisible] = useState(false);
  const tawkContainerRef = useRef(null);

  // Safe access to Tawk_API
  const getTawkAPI = () => window.Tawk_API || null;

  // Check if user is allowed to see the widget
  useEffect(() => {
    const isUserAllowed =
      isAuthenticated && allowedRoles.includes(userRole);
    setIsVisible(isUserAllowed);

    const tawkAPI = getTawkAPI();

    if (tawkAPI) {
      if (isUserAllowed) {
        tawkAPI.showWidget?.();
      } else {
        tawkAPI.hideWidget?.();
      }
    }
  }, [isAuthenticated, userRole, allowedRoles]);

  // Handle clicks outside the widget
  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (event) => {
      const tawkAPI = getTawkAPI();

      // Only proceed if Tawk API exists and chat is maximized
      if (!tawkAPI || !tawkAPI.isChatMaximized?.()) return;

      // Check if click was on a Tawk element using the ref and attribute detection
      const clickedOnTawk =
        // Check our container ref
        tawkContainerRef.current?.contains(event.target) ||
        // Check for Tawk-specific elements
        !!event.target.closest(
          '[class*="tawk"],[id*="tawk"],iframe[title*="chat" i]'
        );

      if (!clickedOnTawk) {
        tawkAPI.minimize();
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, [isVisible]);

  return { isVisible, tawkContainerRef };
};
