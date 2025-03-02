import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import PropTypes from "prop-types";
import {
  ROLES,
  ROLES_REDIRECTS,
} from "../Constants/constants";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  const userMainRole = Object.entries(ROLES).find(
    // eslint-disable-next-line no-unused-vars
    ([_, roles]) => roles.includes(auth?.role)
  )?.[0];

  const isRootPath = location.pathname === "/";

  if (allowedRoles.includes(auth?.role)) {
    return <Outlet />;
  }

  if (auth?.accessToken) {
    if (isRootPath) {
      return (
        <Navigate
          to={ROLES_REDIRECTS[userMainRole]}
          replace
        />
      );
    } else {
      return (
        <Navigate
          to="/unauthorized"
          state={{ from: location }}
          replace
        />
      );
    }
  }

  return (
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
