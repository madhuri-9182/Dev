import { createContext, useState } from "react";
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
        toast.success("Logged out successfully", {
          position: "top-right",
        });
        setAuth({});
      }
    } catch (error) {
      console.log(error);
    }
  };

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
