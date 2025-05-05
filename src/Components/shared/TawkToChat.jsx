import { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../Constants/constants";

/**
 * This component doesn't render anything, it just bridges between
 * React's auth state and the Tawk.to widget by using sessionStorage
 */
const TawkAuthBridge = () => {
  const { auth } = useAuth();

  useEffect(() => {
    // Check if user is authenticated and has allowed role
    const allowedRoles = [
      ...ROLES.CLIENT,
      ...ROLES.AGENCY,
      ...ROLES.INTERVIEWER,
    ];
    const isUserAllowed =
      auth?.accessToken && allowedRoles.includes(auth.role);

    // Prepare user info for the Tawk widget
    const tawkUserInfo = {
      isAllowed: isUserAllowed,
      name: auth?.name || auth?.username || "User",
    };

    // Store in sessionStorage for the Tawk script to access
    sessionStorage.setItem(
      "tawkUserInfo",
      JSON.stringify(tawkUserInfo)
    );

    // Dispatch an event to notify our HTML script
    window.dispatchEvent(new Event("tawkInfoUpdated"));

    return () => {
      // No special cleanup needed
    };
  }, [auth]);

  // This component doesn't render anything
  return null;
};

export default TawkAuthBridge;
