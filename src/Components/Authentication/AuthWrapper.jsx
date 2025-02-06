import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const AuthWrapper = () => {
  const { auth } = useAuth();
  const location = useLocation();

  if (auth?.accessToken) {
    return (
      <Navigate to={location.state?.from || "/"} replace />
    );
  }

  // If user is not logged in, render the authorization pages
  return <Outlet />;
};

export default AuthWrapper;
