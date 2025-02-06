import {
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import PropTypes from "prop-types";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return allowedRoles.includes(auth?.role) ? (
    <Outlet />
  ) : auth?.accessToken ? (
    <Navigate
      to="/unauthorized"
      state={{ from: location }}
      replace
    />
  ) : (
    <Navigate
      to="/auth/signin/loginmail"
      state={{ from: location }}
      replace
    />
  );
};

export default RequireAuth;

RequireAuth.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};
