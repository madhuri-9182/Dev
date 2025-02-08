import PropTypes from "prop-types";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import Modal from "../../../shared/Modal";
import toast from "react-hot-toast";
import axios from "../../../../api/axios";
import { AnimatePresence } from "framer-motion";

const DeleteUserModal = ({ isOpen, onClose, id }) => {
  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/client/client-user/${id}/`);
    },
    onSuccess: () => {
      toast.success("User deleted successfully", {
        position: "top-right",
      });
      queryClient.invalidateQueries(["users"]); // Refetch users data
      onClose(); // Close modal after successful deletion
    },
    onError: () => {
      toast.error("Failed to delete user", {
        position: "top-right",
      });
    },
  });

  const handleDelete = () => {
    deleteUserMutation.mutate();
  };

  return (
    <AnimatePresence>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Delete User"
      >
        <div className="text-center">
          <p className="text-lg font-semibold mb-4">
            Are you sure you want to delete this user?
          </p>
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={handleDelete}
              className="px-6 py-[10px] rounded-[100px] text-white bg-[#E84D4D] transition-all duration-300 ease-in-out 
  hover:bg-gradient-to-r hover:from-[#E84D4D] hover:to-[#C0392B]  text-sm font-semibold  cursor-pointer"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="px-6 py-[10px] rounded-[100px] text-[#4A4459] bg-[#E8DEF8] transition-all duration-300 ease-in-out 
  hover:bg-gradient-to-r hover:from-[#E8DEF8] hover:to-[#D9CFF2] text-sm font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </AnimatePresence>
  );
};

DeleteUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default DeleteUserModal;
