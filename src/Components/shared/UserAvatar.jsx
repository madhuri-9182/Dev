import { useState, useRef, useEffect } from "react";
import useAuth from "../../hooks/useAuth"; // Adjust path as needed

const UserAvatar = () => {
  const { auth, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] =
    useState(false);
  const dropdownRef = useRef(null);

  // Get the first character of the name, or 'U' if no name exists
  const getInitial = () => {
    if (auth?.name && auth.name.trim().length > 0) {
      return auth.name.trim()[0].toUpperCase();
    }
    return "U";
  };

  // Generate a background color based on the name
  const getBackgroundColor = () => {
    const initial = getInitial();
    // Simple hash function to generate a color
    const hash = initial.charCodeAt(0) % 5;
    const colors = [
      "bg-[#B2B7C0]",
      "bg-[#C2B5F0]",
      "bg-[#B8ED91]",
      "bg-[#A2E2D6]",
      "bg-[#C4D0B8]",
      "bg-[#7AEAE6]",
      "bg-[#A6F0A0]",
    ];
    return colors[hash];
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      <div
        className="loggedInUser cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div
          className={`flex items-center justify-center h-8 w-8 rounded-full overflow-hidden text-white font-bold text-lg shadow-md ${getBackgroundColor()}`}
        >
          {getInitial()}
        </div>
      </div>

      {isDropdownOpen && (
        <div className="absolute right-14 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div className="p-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center h-[25px] w-[25px] rounded-full overflow-hidden text-white text-base font-bold ${getBackgroundColor()} `}
              >
                {getInitial()}
              </div>
              <div
                className="text-default font-medium truncate text-black"
                title={auth?.name ? auth.name : "User"}
              >
                {auth?.name ? auth.name : "User"}
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={logout}
              className="block w-full text-left px-3 py-2 text-default text-red-600 hover:text-[#F00000] hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
