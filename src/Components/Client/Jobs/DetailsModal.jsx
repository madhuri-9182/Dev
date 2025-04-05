import { useEffect } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import Modal from "../../shared/Modal";

const DetailsModal = ({
  isOpen,
  onClose,
  onSave,
  details,
  editDetail,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      detail: "",
      time: "",
      guidelines: "",
    },
  });

  useEffect(() => {
    if (editDetail) {
      setValue("detail", editDetail?.details || "");
      setValue(
        "time",
        editDetail?.time?.replace("min", "") || ""
      );
      setValue(
        "guidelines",
        editDetail?.guidelines?.replace(/\n/g, ", ") || ""
      );
    } else {
      reset({
        detail: "",
        time: "",
        guidelines: "",
      });
    }
  }, [editDetail, isOpen, setValue, reset]);

  const onSubmit = (data) => {
    // Calculate total minutes with proper handling for edit case
    let totalMinutes = 0;

    if (editDetail) {
      // When editing, exclude the current item's time from the calculation
      totalMinutes =
        details.reduce(
          (sum, item) =>
            sum +
            (item.id === editDetail.id
              ? 0
              : parseInt(item.time)),
          0
        ) + parseInt(data.time);
    } else {
      // When adding a new item, include all existing items plus the new one
      totalMinutes =
        details.reduce(
          (sum, item) => sum + parseInt(item.time),
          0
        ) + parseInt(data.time);
    }

    if (totalMinutes > 60) {
      toast.error("Total time cannot exceed 60 minutes.");
      return;
    }

    const newDetail = {
      id: editDetail ? editDetail.id : Date.now(),
      details: data.detail,
      time: `${data.time}min`,
      guidelines: data.guidelines.split(", ").join("\n"),
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
        : "Detail added successfully!"
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label name="detail" label="Detail" />
              <Input
                type="text"
                {...register("detail", {
                  required: "Detail name is required",
                })}
                placeholder="Enter Detail Name"
                error={errors.detail}
              />
              {errors.detail && (
                <p className="text-[#B10E0EE5] text-[10px] mt-1">
                  {errors.detail.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label name="time" label="Time" />
              <Input
                type="number"
                {...register("time", {
                  required: "Time is required",
                  pattern: {
                    value: /^\d{1,2}$/,
                    message:
                      "Invalid time format! Use numbers only.",
                  },
                })}
                placeholder="Time (e.g., 10)"
                error={errors.time}
              />
              {errors.time && (
                <p className="text-[#B10E0EE5] text-[10px] mt-1">
                  {errors.time.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label name="guidelines" label="Guidelines" />
              <Input
                type="text"
                {...register("guidelines", {
                  required: "Guidelines are required",
                })}
                placeholder="Guidelines (comma-separated)"
                error={errors.guidelines}
              />
              {errors.guidelines && (
                <p className="text-[#B10E0EE5] text-[10px] mt-1">
                  {errors.guidelines.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end items-center gap-2 mt-4 mb-2">
            <button
              type="button"
              className="px-6 py-[5px] rounded-[100px] text-[#65558F] border border-[#79747E] text-xs font-semibold cursor-pointer 
                transition-all duration-300 ease-in-out 
                hover:bg-gradient-to-r hover:from-[#ECE8F2] hover:to-[#DCD6E6]"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-6 py-[5px] rounded-[100px] text-white bg-[#007AFF] border border-[#007AFF] transition-all duration-300 ease-in-out
             hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] text-xs font-semibold cursor-pointer"
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
      className="block text-[#6B6F7B] text-2xs font-bold required-field-label"
    >
      {label}
    </label>
  );
};

Label.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

const Input = ({ type, placeholder, error, ...rest }) => {
  return (
    <input
      maxLength={type === "tel" ? 10 : undefined}
      type={type}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded-lg text-2xs text-[#6B6F7B] font-medium ${
        error ? "border-red-500" : ""
      }`}
      {...rest}
    />
  );
};

Input.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.object,
};
