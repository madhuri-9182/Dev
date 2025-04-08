import PropTypes from "prop-types";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import Modal from "../../shared/Modal";
import toast from "react-hot-toast";
import axios from "../../../api/axios";
import { AnimatePresence } from "framer-motion";

const DeleteUserModal = ({ isOpen, onClose, id }) => {
  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/client/client-user/${id}/`);
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries(["users"]); // Refetch users data
      onClose(); // Close modal after successful deletion
    },
    onError: (error) => {
      const errorToDisplay = error?.response?.data?.message
        ? error.response.data.message
        : "Failed to delete user";
      toast.error(errorToDisplay);
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
          <p className="text-sm font-semibold mb-4">
            Are you sure you want to delete this user?
          </p>
          <div className="flex justify-center gap-2 mb-2">
            <button
              onClick={handleDelete}
              disabled={deleteUserMutation.isPending}
              className="px-6 py-[5px] rounded-[100px] text-white bg-[#E84D4D] transition-all duration-300 ease-in-out 
  hover:bg-gradient-to-r hover:from-[#E84D4D] hover:to-[#C0392B]  text-xs font-semibold  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="secondary-button"
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
