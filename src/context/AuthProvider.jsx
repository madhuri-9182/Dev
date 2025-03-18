import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "../api/axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const logout = async () => {
    try {
      const response = await axios.post(
        "/api/logout/",
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 205) {
        toast.success("Logged out successfully");
        setAuth({});
        // Send a message to all other tabs to log out
        const channel = new BroadcastChannel("auth");
        channel.postMessage("logout");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const channel = new BroadcastChannel("auth");
    channel.onmessage = (event) => {
      if (event.data === "logout") {
        // Log out the current user
        setAuth({});
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
