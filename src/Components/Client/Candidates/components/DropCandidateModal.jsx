import PropTypes from "prop-types";
import { useState } from "react";
import { motion } from "framer-motion";
import { CloseSquare } from "iconsax-react";
import toast from "react-hot-toast";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteCandidate } from "../api";
import useRoleBasedNavigate from "../../../../hooks/useRoleBaseNavigate";

const DropCandidateModal = ({ onClose, id }) => {
  const queryClient = useQueryClient();
  const navigateTo = useRoleBasedNavigate();
  const [selectedReason, setSelectedReason] = useState("");

  const deleteCandidateMutation = useMutation({
    mutationFn: deleteCandidate,
    onSuccess: () => {
      toast.success("Candidate deleted successfully");
      queryClient.invalidateQueries("candidates");
      navigateTo("candidates");
      onClose();
    },
    onError: () => {
      toast.error("Failed to delete candidate");
    },
  });

  const handleDeleteCandidate = () => {
    deleteCandidateMutation.mutate({
      id,
      reason: selectedReason,
    });
  };
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
          <div className="flex justify-center items-center pb-2">
            <h2 className="font-semibold text-sm">
              Reason for Dropping
            </h2>
          </div>
          <CloseSquare
            size={22}
            className="transition-transform text-[#f00001] cursor-pointer duration-300 hover:scale-105 hover:text-[#F22129] absolute top-4 right-4"
            onClick={onClose}
          />
          {/* Modal Content */}
          <div className="flex flex-col gap-2">
            {[
              {
                label: "Candidate Not Interested",
                value: "CNI",
              },
              {
                label: "Candidate Not Available",
                value: "CNA",
              },
              {
                label: "Candidate Not Responded",
                value: "CNR",
              },
              {
                label: "Others",
                value: "OTH",
              },
            ].map((option, idx) => (
              <button
                key={idx}
                className={`flex items-center justify-center w-[300px] py-2 rounded-lg border text-2xs font-semibold transition-all duration-200
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
              className="secondary-button h-7 w-[140px]"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="primary-button h-7 w-[140px]"
              onClick={handleDeleteCandidate}
            >
              Save
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DropCandidateModal;

DropCandidateModal.propTypes = {
  onClose: PropTypes.func,
  id: PropTypes.number,
};
