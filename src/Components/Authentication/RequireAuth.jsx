import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import PropTypes from "prop-types";
import { ROLES, ROLES_REDIRECTS } from "../Constants/constants";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  const getUserType = () => {
    return (
      Object.entries(ROLES).find(([key, roles]) =>
        roles.includes(auth?.role)
      )?.[0] || "UNKNOWN"
    );
  };
  return allowedRoles.includes(auth?.role) ? (
    <Outlet />
  ) : auth?.accessToken ? (
    <Navigate
      to={`${ROLES_REDIRECTS[getUserType()]}`}
      state={{ from: location }}
      replace
    />
  ) : (
    <Navigate to="/auth/signin/loginmail" state={{ from: location }} replace />
  );
};

export default RequireAuth;

RequireAuth.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};
