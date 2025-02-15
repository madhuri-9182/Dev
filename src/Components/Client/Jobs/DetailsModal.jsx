import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import Modal from "../../shared/Modal";

const DetailsModal = ({
  isOpen,
  onClose,
  onSave,
  details,
  editDetail,
}) => {
  const [detail, setDetail] = useState("");
  const [time, setTime] = useState("");
  const [guidelines, setGuidelines] = useState("");

  useEffect(() => {
    if (editDetail) {
      setDetail(editDetail?.details || "");
      setTime(editDetail?.time?.replace("min", "") || "");
      setGuidelines(
        editDetail?.guidelines?.replace(/\n/g, ", ") || ""
      );
    } else {
      setDetail("");
      setTime("");
      setGuidelines("");
    }
  }, [editDetail, isOpen]);

  const handleSave = (e) => {
    e.preventDefault();
    const timeRegex = /^\d{1,2}$/;
    if (!timeRegex.test(time)) {
      return toast.error(
        "Invalid time format! Use numbers only."
      );
    }

    const totalMinutes =
      details.reduce(
        (sum, item) => sum + parseInt(item.time),
        0
      ) + parseInt(time);
    if (totalMinutes > 60) {
      return toast.error(
        "Total time cannot exceed 60 minutes."
      );
    }

    const newDetail = {
      id: editDetail ? editDetail.id : Date.now(),
      details: detail, // Fixed incorrect assignment
      time: `${time}min`,
      guidelines: guidelines.split(", ").join("\n"),
    };

    onSave(
      editDetail
        ? details.map((d) =>
            d.id === editDetail.id ? newDetail : d
          )
        : [...details, newDetail]
    );
    toast.success(
      editDetail
        ? "Detail updated successfully!"
        : "Detail added successfully!",
      {
        position: "top-right",
      }
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={editDetail ? "Edit Detail" : "Add Detail"}
      >
        <form onSubmit={handleSave}>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label name="name" label="Detail" />
              <Input
                type="text"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Enter Detail Name"
                required
              />
            </div>
            <div className="space-y-1">
              <Label name="time" label="Time" />
              <Input
                type="number"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Time (e.g., 10)"
                required
              />
            </div>
            <div className="space-y-1">
              <Label name="guidelines" label="Guidelines" />
              <Input
                value={guidelines}
                type="text"
                onChange={(e) =>
                  setGuidelines(e.target.value)
                }
                placeholder="Guidelines (comma-separated)"
                required
              />
            </div>
          </div>
          <div className="flex justify-end items-center gap-3 mt-8">
            <button
              type="button"
              className="px-6 py-[10px] rounded-[100px] text-[#65558F] border border-[#79747E] text-sm font-semibold cursor-pointer 
                transition-all duration-300 ease-in-out 
                hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6]"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-6 py-[10px] rounded-[100px] text-white bg-[#007AFF] transition-all duration-300 ease-in-out
             hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] text-sm font-semibold cursor-pointer"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </AnimatePresence>
  );
};

export default DetailsModal;

DetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  details: PropTypes.array.isRequired,
  editDetail: PropTypes.object,
};

const Label = ({ name, label }) => {
  return (
    <label
      htmlFor={name}
      className="block text-[#6B6F7B] text-xs font-bold"
    >
      {label}
    </label>
  );
};

Label.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

const Input = ({
  type,
  value,
  onChange,
  placeholder,
  required,
}) => {
  return (
    <input
      maxLength={type === "tel" ? 10 : undefined}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full px-3 py-2 border rounded-lg text-[13px] text-[#6B6F7B] font-medium"
    />
  );
};

Input.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};
