import PropTypes from "prop-types";
import { useState } from "react";
import { motion } from "framer-motion";
import { CloseSquare } from "iconsax-react";
import {
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import axios from "../../../api/axios";
import toast from "react-hot-toast";

const archiveJob = async ({ archiveId, reason }) => {
  const response = await axios.patch(
    `/api/client/job/${archiveId}/`,
    {
      reason_for_archived: reason,
    }
  );
  return response.data;
};

const ArchiveModal = ({ isOpen, onClose, archiveId }) => {
  const [selectedReason, setSelectedReason] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: archiveJob,
    onSuccess: () => {
      toast.success("Job archived successfully", {
        position: "top-right",
      });
      queryClient.invalidateQueries("jobs");
      onClose();
    },
    onError: (error) => {
      toast.error(
        error.response.data.message
          ? error.response.data.message
          : "Failed to archive job",
        {
          position: "top-right",
        }
      );
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <motion.div
        className="bg-white rounded-lg shadow-lg w-[400px] p-5 absolute top-[30%] left-[40%] transform -translate-x-1/2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="flex flex-col gap-8 justify-center items-center ">
          <div className="flex justify-center items-center pb-2">
            <h2 className="font-semibold text-sm">
              Reason for Archive
            </h2>
          </div>
          <CloseSquare
            size={30}
            className="transition-transform text-[#f00001] cursor-pointer duration-300 hover:scale-105 hover:text-[#F22129] absolute top-4 right-4"
            onClick={onClose}
          />

          {/* Modal Content */}
          <div className="flex flex-col gap-2">
            {[
              { label: "Position Filled", value: "PF" },
              { label: "Position On Hold", value: "POH" },
              { label: "Other", value: "OTH" },
            ].map((option) => (
              <button
                key={option.value}
                className={`flex items-center justify-center w-[300px] py-2 rounded-lg border text-xs font-semibold transition-all duration-200
                ${
                  selectedReason === option.value
                    ? "bg-[#007AFF] text-white border-[#007AFF]" // Selected state
                    : "border-[#CAC4D0] text-[#49454F] bg-white" // Default state
                }`}
                onClick={() =>
                  setSelectedReason(option.value)
                }
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-center items-center mb-4">
            <button
              className="px-6 py-2 rounded-[100px] text-[#65558F] border border-[#79747E] text-sm font-semibold cursor-pointer 
                transition-all duration-300 ease-in-out 
                hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6] w-[140px]"
              onClick={onClose}
            >
              Delete
            </button>
            <button
              className="px-6 py-2 rounded-[100px] text-white bg-[#007AFF] transition-all duration-300 ease-in-out
             hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] text-sm font-semibold cursor-pointer w-[140px]"
              onClick={() => {
                mutation.mutate({
                  archiveId,
                  reason: selectedReason,
                });
              }}
            >
              Save
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ArchiveModal;

ArchiveModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  archiveId: PropTypes.string.isRequired,
};
