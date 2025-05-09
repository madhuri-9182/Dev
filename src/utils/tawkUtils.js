import CryptoJS from "crypto-js";

const TAWK_API_KEY =
  "7a2271319f4815cfd70b7c6e0381762dad5369ce";
const POLL_INTERVAL = 300;
const MAX_WAIT_TIME = 10000;

// Get Tawk API safely
export const getTawkAPI = () => window?.Tawk_API || null;

// Generate secure hash for Tawk authentication
export const generateTawkHash = (userId) => {
  if (!userId) return "";
  try {
    return CryptoJS.HmacSHA256(
      String(userId),
      TAWK_API_KEY
    ).toString(CryptoJS.enc.Hex);
  } catch (error) {
    console.error("Error generating Tawk hash:", error);
    return "";
  }
};

// Wait for Tawk API to be available
export const waitForTawkAPI = () => {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const checkTawk = () => {
      const tawkAPI = getTawkAPI();
      if (tawkAPI && typeof tawkAPI.login === "function") {
        return resolve(tawkAPI);
      }

      if (Date.now() - startTime >= MAX_WAIT_TIME) {
        return resolve(null);
      }

      setTimeout(checkTawk, POLL_INTERVAL);
    };

    checkTawk();
  });
};

// Set up visitor in secure mode
export const setupTawkVisitor = (userData) => {
  if (!userData?.userId) return false;

  try {
    const hash = generateTawkHash(userData.userId);
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.visitor = {
      name: userData.name || "User",
      email: userData.email || "",
      userId: String(userData.userId),
      hash: hash,
      ...(userData.role && { role: userData.role }),
    };
    return true;
  } catch (error) {
    console.error("Error setting up Tawk visitor:", error);
    return false;
  }
};

// Login user to Tawk
export const loginTawkUser = async (userData) => {
  if (!userData?.userId) return false;

  const tawkAPI = await waitForTawkAPI();
  if (!tawkAPI) return false;

  const hash = generateTawkHash(userData.userId);
  if (!hash) return false;

  return new Promise((resolve) => {
    try {
      tawkAPI.login(
        {
          hash,
          userId: String(userData.userId),
          ...(userData.email && { email: userData.email }),
          ...(userData.name && { name: userData.name }),
        },
        (error) => {
          if (error) {
            console.error("Tawk login error:", error);
            resolve(false);
          } else {
            console.log("Tawk login successful");
            resolve(true);
          }
        }
      );
    } catch (error) {
      console.error("Exception during Tawk login:", error);
      resolve(false);
    }
  });
};

// Logout user from Tawk - UPDATED
export const logoutTawkUser = async () => {
  const tawkAPI = getTawkAPI();
  if (!tawkAPI || typeof tawkAPI.logout !== "function")
    return false;

  // First, hide the widget before logout to prevent UI interactions
  if (typeof tawkAPI.hideWidget === "function") {
    tawkAPI.hideWidget();
  }

  // Add a small delay before actual logout
  await new Promise((resolve) => setTimeout(resolve, 200));

  return new Promise((resolve) => {
    try {
      tawkAPI.logout((error) => {
        if (error) {
          console.error("Tawk logout error:", error);
          resolve(false);
        } else {
          console.log("Tawk logout successful");
          resolve(true);
        }
      });
    } catch (error) {
      console.error("Exception during Tawk logout:", error);
      resolve(false);
    }
  });
};

// Control widget visibility
export const setTawkWidgetVisibility = (show = true) => {
  const tawkAPI = getTawkAPI();
  if (!tawkAPI) return false;

  try {
    if (show && typeof tawkAPI.showWidget === "function") {
      tawkAPI.showWidget();
      return true;
    } else if (
      !show &&
      typeof tawkAPI.hideWidget === "function"
    ) {
      tawkAPI.hideWidget();
      return true;
    }
  } catch (error) {
    console.error(
      `Error ${show ? "showing" : "hiding"} Tawk widget:`,
      error
    );
  }

  return false;
};
