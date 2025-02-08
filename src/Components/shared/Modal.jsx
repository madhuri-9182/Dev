import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { CloseSquare } from "iconsax-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <motion.div
        className="bg-white rounded-lg shadow-lg w-[500px] p-5 absolute top-[20%] left-[40%] transform -translate-x-1/2"
        initial={{ opacity: 0, scale: 0.9 }} // Start hidden & small
        animate={{ opacity: 1, scale: 1 }} // Fully visible & normal size
        exit={{ opacity: 0, scale: 0.9 }} // Shrink and fade out
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex justify-center items-center border-b pb-2">
          <h2
            className={`text-xl font-bold ${
              title === "Delete User"
                ? "text-[#f00001]"
                : "text-[#005BBB]"
            } uppercase`}
          >
            {title}
          </h2>
        </div>
        <CloseSquare
          size={30}
          className="transition-transform text-[#f00001] cursor-pointer duration-300 hover:scale-105 hover:text-[#F22129]  absolute top-4 right-4"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="mt-4">{children}</div>
      </motion.div>
    </div>
  );
};

export default Modal;

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
};
