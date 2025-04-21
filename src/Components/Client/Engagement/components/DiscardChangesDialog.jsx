// components/DiscardChangesDialog.jsx
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const DiscardChangesDialog = ({
  open,
  onClose,
  onDiscard,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <motion.div
        className="bg-white rounded-lg shadow-lg w-[400px] p-4 absolute top-[30%] left-[40%] transform -translate-x-1/2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="flex flex-col gap-6 justify-center items-center">
          <div className="flex justify-center items-center">
            <h2 className="font-semibold text-sm">
              Unsaved Changes
            </h2>
          </div>

          {/* Modal Content */}
          <div className="text-center px-4">
            <p className="text-[#49454F] text-default">
              You have unsaved changes to your template.
              Would you like to discard these changes?
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-center items-center mb-4 w-[90%]">
            <button
              className="secondary-button w-1/2"
              onClick={() => onClose(false)}
            >
              Keep Editing
            </button>
            <button
              className="px-6 py-[5px] rounded-[100px] h-[30px] text-white bg-[#E84D4D] border border-[#E84D4D] transition-all duration-300 ease-in-out 
  hover:bg-gradient-to-r hover:from-[#E84D4D] hover:to-[#C0392B]  text-xs font-semibold  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-1/2"
              onClick={onDiscard}
            >
              Discard Changes
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

DiscardChangesDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDiscard: PropTypes.func.isRequired,
};

export default DiscardChangesDialog;
