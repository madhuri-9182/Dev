import {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../Constants/constants";
import {
  setupTawkVisitor,
  getTawkAPI,
  loginTawkUser,
  logoutTawkUser,
  setTawkWidgetVisibility,
} from "../../utils/tawkUtils";

const TawkMessenger = () => {
  const { auth } = useAuth();
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] =
    useState(false);
  const currentUserRef = useRef(null);
  const widgetInitAttemptsRef = useRef(0);
  const maxInitAttempts = 3;

  // Property and widget IDs
  const propertyId = "6818bbf1138f991917bc7112";
  const widgetId = "1iqg9sah9";

  // Determine if user is allowed to see the widget
  const allowedRoles = [
    ...ROLES.CLIENT,
    ...ROLES.AGENCY,
    ...ROLES.INTERVIEWER,
  ];

  const isUserAllowed = useCallback(() => {
    return (
      !!auth?.accessToken &&
      !!auth?.role &&
      allowedRoles.includes(auth.role)
    );
  }, [auth?.accessToken, auth?.role, allowedRoles]);

  // Setup function for onBeforeLoad - sets up secure mode
  const handleBeforeLoad = useCallback(() => {
    // Only set visitor info if user is authenticated
    if (auth?.id && auth?.email) {
      setupTawkVisitor({
        userId: auth.id,
        email: auth.email,
        name: auth.name || "User",
        role: auth.role,
      });
    }
  }, [auth?.id, auth?.email, auth?.name, auth?.role]);

  // Handle widget ready state
  const handleWidgetLoad = useCallback(() => {
    console.log("Tawk widget loaded");

    // Use a short timeout to ensure widget is fully initialized
    const timer = setTimeout(() => {
      setIsWidgetReady(true);
      widgetInitAttemptsRef.current = 0;
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle widget load error
  const handleWidgetLoadError = useCallback(
    (error) => {
      console.error("Error loading Tawk widget:", error);

      widgetInitAttemptsRef.current += 1;

      if (widgetInitAttemptsRef.current < maxInitAttempts) {
        // Try again after a delay
        const retryTimer = setTimeout(() => {
          console.log(
            `Retrying Tawk widget initialization (attempt ${widgetInitAttemptsRef.current})`
          );
          setIsWidgetReady(false); // Force re-render
        }, 3000 * widgetInitAttemptsRef.current); // Increasing backoff

        return () => clearTimeout(retryTimer);
      } else {
        console.error(
          `Failed to initialize Tawk widget after ${maxInitAttempts} attempts`
        );
      }
    },
    [maxInitAttempts]
  );

  // Handle user login/logout using the API methods
  useEffect(() => {
    if (!isWidgetReady) return;

    const handleUserChange = async () => {
      const userId = auth?.id;
      const userEmail = auth?.email;

      // Current state
      const isAuthenticated = !!userId && !!userEmail;
      const previousUser = currentUserRef.current;

      // User logged in and changed or is new
      if (isAuthenticated && userId !== previousUser) {
        // If there was a previous user, logout first
        if (previousUser && isUserLoggedIn) {
          await logoutTawkUser();
          setIsUserLoggedIn(false);
        }

        // Prepare login data
        const userData = {
          userId: userId,
          email: userEmail,
          name: auth.name || "User",
          role: auth.role,
        };

        // Login the new user
        const success = await loginTawkUser(userData);

        if (success) {
          currentUserRef.current = userId;
          setIsUserLoggedIn(true);
        } else {
          console.error("Failed to login Tawk user");
          // Retry login once after a short delay
          setTimeout(async () => {
            const retrySuccess = await loginTawkUser(
              userData
            );
            if (retrySuccess) {
              currentUserRef.current = userId;
              setIsUserLoggedIn(true);
            }
          }, 2000);
        }
      }
      // User logged out
      else if (!isAuthenticated && previousUser) {
        if (isUserLoggedIn) {
          await logoutTawkUser();
          setIsUserLoggedIn(false);
        }
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
    isUserLoggedIn,
  ]);

  // Handle widget visibility
  useEffect(() => {
    if (!isWidgetReady) return;

    // Check if user is allowed to see the widget
    const shouldShowWidget = isUserAllowed();
    setTawkWidgetVisibility(shouldShowWidget);

    // Return cleanup function
    return () => {
      // Ensure widget is hidden when component unmounts
      const tawkAPI = getTawkAPI();
      if (
        tawkAPI &&
        typeof tawkAPI.hideWidget === "function"
      ) {
        tawkAPI.hideWidget();
      }
    };
  }, [isWidgetReady, isUserAllowed]);

  // Early return if not allowed
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
