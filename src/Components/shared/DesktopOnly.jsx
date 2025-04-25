import { isDesktop } from "react-device-detect";
import PropTypes from "prop-types";

const DesktopOnly = ({ children }) => {
  if (!isDesktop) {
    return (
      <div className="text-center mt-4 text-xs sm:text-base mx-8 text-[#6B6F7B] font-medium">
        Not supported. Please use a desktop to access the
        application.
      </div>
    );
  }
  return children;
};

export default DesktopOnly;

DesktopOnly.propTypes = {
  children: PropTypes.node,
};