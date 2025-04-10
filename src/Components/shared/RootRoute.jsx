import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../Constants/constants";

const RootRoute = () => {
  const { auth } = useAuth();

  if (Object.keys(auth).length === 0) {
    return (
      <Navigate to={"/auth/signin/loginmail"} replace />
    );
  } else if (ROLES.AGENCY.includes(auth?.role)) {
    return <Navigate to="/agency/dashboard" replace />;
  } else if (ROLES.INTERNAL.includes(auth?.role)) {
    return <Navigate to="/internal/dashboard" replace />;
  } else if (ROLES.CLIENT.includes(auth?.role)) {
    return <Navigate to="/client/dashboard" replace />;
  } else if (ROLES.INTERVIEWER.includes(auth?.role)) {
    return <Navigate to="/interviewer/dashboard" replace />;
  } else {
    // Handle unauthorized or unknown role
    return <Navigate to="/unauthorized" replace />;
  }
};

export default RootRoute;
