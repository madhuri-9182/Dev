import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { CloseSquare } from "iconsax-react";

const ViewModal = ({ isOpen, onClose, details }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <motion.div
        className={`bg-white rounded-lg shadow-lg w-[420px] p-4 absolute top-[20%] left-[40%] transform -translate-x-1/2 overflow-y-auto max-h-[90vh] `}
        initial={{ opacity: 0, scale: 0.9 }} // Start hidden & small
        animate={{ opacity: 1, scale: 1 }} // Fully visible & normal size
        exit={{ opacity: 0, scale: 0.9 }} // Shrink and fade out
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex justify-center items-center border-b pb-2">
          <h2
            className={`text-base font-bold text-[#005BBB] uppercase`}
          >
            Details
          </h2>
        </div>
        <CloseSquare
          size={22}
          className="transition-transform text-[#f00001] cursor-pointer duration-300 hover:scale-105 hover:text-[#F22129]  absolute top-4 right-4"
          onClick={onClose}
        />

        {/* Modal Content */}
        {/* text-[#6B6F7B] */}
        <div className="mt-4">
          {details?.map((detail, idx) => (
            <div
              key={idx}
              className="mx-2 flex flex-col gap-y-1 "
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-[#49454F]">
                  {detail.details}
                </h3>
                <p className="text-xs text-[#6B6F7B]">
                  {detail.time.replace("min", " Minutes")}
                </p>
              </div>
              <div>
                <ul className="list-disc pl-4 m-0 text-[#6B6F7B] text-2xs">
                  {detail.guidelines
                    .split("\n")
                    .map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ViewModal;

ViewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  details: PropTypes.array,
};
