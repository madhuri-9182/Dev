import { useEffect, useState, useRef } from "react";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../Constants/constants";
import {
  setupTawkVisitor,
  loginTawkUser,
  logoutTawkUser,
  setTawkWidgetVisibility,
  getTawkAPI,
} from "../../utils/tawkUtils";

const TawkMessenger = () => {
  const { auth } = useAuth();
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const currentUserRef = useRef(null);
  const retryCountRef = useRef(0);

  // Property and widget IDs
  const propertyId = "6818bbf1138f991917bc7112";
  const widgetId = "1iqg9sah9";

  // User role check
  const allowedRoles = [
    ...ROLES.CLIENT,
    ...ROLES.AGENCY,
    ...ROLES.INTERVIEWER,
  ];

  const isUserAllowed = () => {
    return (
      !!auth?.accessToken &&
      !!auth?.role &&
      allowedRoles.includes(auth.role)
    );
  };

  // Handle widget initialization
  const handleBeforeLoad = () => {
    if (auth?.id && auth?.email) {
      setupTawkVisitor({
        userId: auth.id,
        email: auth.email,
        name: auth.name || "User",
        role: auth.role,
      });
    }
  };

  // Handle widget load success
  const handleWidgetLoad = () => {
    console.log("Tawk widget loaded");
    setTimeout(() => {
      setIsWidgetReady(true);
      retryCountRef.current = 0;
    }, 1000);
  };

  // Handle widget load error with retry
  const handleWidgetLoadError = (error) => {
    console.error("Error loading Tawk widget:", error);

    if (retryCountRef.current < 3) {
      retryCountRef.current += 1;
      const delay = 3000 * retryCountRef.current;

      console.log(
        `Retrying Tawk widget initialization in ${delay}ms (attempt ${retryCountRef.current})`
      );
      setTimeout(() => setIsWidgetReady(false), delay);
    } else {
      console.error(
        "Failed to initialize Tawk widget after 3 attempts"
      );
    }
  };

  // NEW: Add cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      // Component unmounting, ensure Tawk is cleaned up
      const tawkAPI = getTawkAPI();
      if (
        tawkAPI &&
        typeof tawkAPI.hideWidget === "function"
      ) {
        tawkAPI.hideWidget();
      }
    };
  }, []);

  // Handle user authentication state - UPDATED
  useEffect(() => {
    if (!isWidgetReady) return;

    const handleUserChange = async () => {
      const userId = auth?.id;
      const userEmail = auth?.email;
      const isAuthenticated = !!userId && !!userEmail;
      const previousUser = currentUserRef.current;

      // User logged in or changed
      if (isAuthenticated && userId !== previousUser) {
        // Logout previous user if needed
        if (previousUser) {
          // Hide widget first
          setTawkWidgetVisibility(false);
          // Small delay
          await new Promise((resolve) =>
            setTimeout(resolve, 200)
          );
          // Then logout
          await logoutTawkUser();
        }

        // Login new user
        const userData = {
          userId,
          email: userEmail,
          name: auth.name || "User",
          role: auth.role,
        };

        const success = await loginTawkUser(userData);

        if (success) {
          currentUserRef.current = userId;
          // Show widget after successful login
          setTawkWidgetVisibility(true);
        } else {
          // Retry login once
          setTimeout(async () => {
            const retrySuccess = await loginTawkUser(
              userData
            );
            currentUserRef.current = userId;
            if (retrySuccess) {
              setTawkWidgetVisibility(true);
            }
          }, 2000);
        }
      }
      // User logged out - IMPROVED LOGOUT SEQUENCE
      else if (!isAuthenticated && previousUser) {
        // First, hide the widget
        setTawkWidgetVisibility(false);

        // Add a small delay
        await new Promise((resolve) =>
          setTimeout(resolve, 200)
        );

        // Then logout
        await logoutTawkUser();
        currentUserRef.current = null;
      }
    };

    handleUserChange();
  }, [
    auth?.id,
    auth?.email,
    auth?.name,
    auth?.role,
    isWidgetReady,
  ]);

  // Control widget visibility
  useEffect(() => {
    if (!isWidgetReady) return;

    if (isUserAllowed() && currentUserRef.current) {
      setTawkWidgetVisibility(true);
    } else {
      setTawkWidgetVisibility(false);
    }

    return () => setTawkWidgetVisibility(false);
  }, [isWidgetReady, auth?.role, auth?.accessToken]);

  // Don't render anything if user not allowed
  if (!isUserAllowed()) {
    return null;
  }

  return (
    <div className="tawk-messenger-container">
      <TawkMessengerReact
        propertyId={propertyId}
        widgetId={widgetId}
        onBeforeLoad={handleBeforeLoad}
        onLoad={handleWidgetLoad}
        onError={handleWidgetLoadError}
      />
    </div>
  );
};

export default TawkMessenger;
