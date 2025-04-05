import { Warning2 } from "iconsax-react";
import PropTypes from "prop-types";

export const LoadingState = () => {
  return (
    <div className="flex items-center justify-center min-h-60">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};
export const ErrorState = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-60 text-[#B10E0EE5]">
      <Warning2 className="h-12 w-12" />
      <p className="mt-2">
        {message ||
          "An error occurred while loading the data. Please try again later."}
      </p>
    </div>
  );
};

ErrorState.propTypes = {
  message: PropTypes.string,
};
