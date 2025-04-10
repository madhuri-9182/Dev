import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../Components/Constants/constants";

const useRoleBasedNavigate = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const navigateTo = (pathname) => {
    if (ROLES.AGENCY.includes(auth?.role)) {
      navigate(`/agency/${pathname}`);
    } else if (ROLES.CLIENT.includes(auth?.role)) {
      navigate(`/client/${pathname}`);
    } else {
      // Handle unauthorized or unknown role
      navigate("/unauthorized");
    }
  };

  return navigateTo;
};

export default useRoleBasedNavigate;
