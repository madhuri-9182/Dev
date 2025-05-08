import CryptoJS from "crypto-js";

// Your Tawk.to API key (from Admin > Property Settings)
const TAWK_API_KEY =
  "7a2271319f4815cfd70b7c6e0381762dad5369ce"; // Replace with your actual API key

// Max time to wait for Tawk API to be ready (in milliseconds)
const MAX_WAIT_TIME = 15000;
const POLL_INTERVAL = 300;

/**
 * Safely gets the Tawk API if available
 * @returns {Object|null} Tawk_API object or null
 */
export const getTawkAPI = () => {
  if (typeof window !== "undefined" && window.Tawk_API) {
    return window.Tawk_API;
  }
  return null;
};

/**
 * Generate hash for Tawk.to login (HMAC SHA256)
 * @param {string|number} userId - User ID to hash
 * @returns {string} HMAC SHA256 hash or empty string on error
 */
export const generateTawkHash = (userId) => {
  if (!userId) return "";

  // Ensure userId is a string
  const userIdStr = String(userId);

  // Generate hash using HMAC SHA256
  try {
    return CryptoJS.HmacSHA256(
      userIdStr,
      TAWK_API_KEY
    ).toString(CryptoJS.enc.Hex);
  } catch (error) {
    console.error("Error generating Tawk hash:", error);
    return "";
  }
};

/**
 * Creates a promise that rejects after a timeout
 * @param {number} ms - Milliseconds before timeout
 * @returns {Promise} A promise that rejects after specified milliseconds
 */
const timeoutPromise = (ms) => {
  return new Promise((_, reject) => {
    setTimeout(
      () =>
        reject(
          new Error(`Operation timed out after ${ms}ms`)
        ),
      ms
    );
  });
};

/**
 * Waits for Tawk API to be fully initialized and ready
 * @param {number} [maxWaitMs=MAX_WAIT_TIME] - Maximum time to wait in milliseconds
 * @returns {Promise<boolean>} Resolves to true if API is ready, false otherwise
 */
export const waitForTawk = async (
  maxWaitMs = MAX_WAIT_TIME
) => {
  // Create a promise that polls for Tawk API availability
  const pollPromise = new Promise((resolve) => {
    const startTime = Date.now();

    const checkTawk = () => {
      const tawkAPI = getTawkAPI();

      // Check if API is available and login function exists
      if (tawkAPI && typeof tawkAPI.login === "function") {
        resolve(true);
        return;
      }

      // Check if we've exceeded the maximum wait time
      if (Date.now() - startTime >= maxWaitMs) {
        resolve(false);
        return;
      }

      // Continue polling
      setTimeout(checkTawk, POLL_INTERVAL);
    };

    // Start polling
    checkTawk();
  });

  // Race the polling promise against a timeout
  try {
    return await Promise.race([
      pollPromise,
      timeoutPromise(maxWaitMs + 1000), // Add 1 second buffer
    ]);
  } catch (error) {
    console.warn("Tawk API wait timed out:", error.message);
    return false;
  }
};

/**
 * Login user to Tawk.to
 * @param {Object} userData - User data for login
 * @param {string|number} userData.userId - User ID (required)
 * @param {string} [userData.email] - User email
 * @param {string} [userData.name] - User name
 * @param {string} [userData.role] - User role
 * @returns {Promise<boolean>} Resolves to true if login successful, false otherwise
 */
export const loginTawkUser = async (userData) => {
  if (!userData?.userId) {
    console.error("Missing required userId for Tawk login");
    return false;
  }

  // Wait for Tawk to be fully initialized
  const isReady = await waitForTawk();
  if (!isReady) {
    console.warn("Tawk API not available after waiting");
    return false;
  }

  const tawkAPI = getTawkAPI();
  if (!tawkAPI) return false;

  // Generate hash using HMAC SHA256
  const hash = generateTawkHash(userData.userId);
  if (!hash) {
    console.error("Failed to generate hash for Tawk login");
    return false;
  }

  // Prepare login data
  const loginData = {
    hash: hash,
    userId: String(userData.userId), // Ensure userId is a string
  };

  // Add optional fields if they exist
  if (userData.email) loginData.email = userData.email;
  if (userData.name) loginData.name = userData.name;

  // Return a promise for the login operation
  return new Promise((resolve) => {
    try {
      tawkAPI.login(loginData, (error) => {
        if (error) {
          console.error("Tawk login error:", error);
          resolve(false);
        } else {
          console.log("Tawk login successful");
          resolve(true);
        }
      });
    } catch (error) {
      console.error("Exception during Tawk login:", error);
      resolve(false);
    }
  });
};

/**
 * Logout user from Tawk.to
 * @returns {Promise<boolean>} Resolves to true if logout successful, false otherwise
 */
export const logoutTawkUser = async () => {
  const tawkAPI = getTawkAPI();
  if (!tawkAPI || typeof tawkAPI.logout !== "function") {
    console.warn("Tawk API not available for logout");
    return false;
  }

  // Return a promise for the logout operation
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

/**
 * Set widget visibility
 * @param {boolean} show - Whether to show or hide the widget
 * @returns {boolean} Whether the operation was successful
 */
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

/**
 * Enhanced setup for Tawk visitor with secure mode
 * @param {Object} userData - User data
 * @returns {boolean} Whether setup was successful
 */
export const setupTawkVisitor = (userData) => {
  if (!userData?.userId) return false;

  try {
    // Generate the secure hash
    const hash = generateTawkHash(userData.userId);

    // Set up visitor object with secure mode
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.visitor = {
      name: userData.name || "User",
      email: userData.email || "",
      userId: String(userData.userId),
      hash: hash,
    };

    // Add any additional attributes
    if (userData.role) {
      window.Tawk_API.visitor.role = userData.role;
    }

    return true;
  } catch (error) {
    console.error("Error setting up Tawk visitor:", error);
    return false;
  }
};
