import { useEffect } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import Modal from "../../shared/Modal";

// Keep original Label component
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

// Keep original Input component
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

const DetailsModal = ({
  isOpen,
  onClose,
  onSave,
  details,
  editDetail,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      detail: "",
      time: "",
      guidelines: "",
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (editDetail) {
      reset({
        detail: editDetail?.details || "",
        time: editDetail?.time?.replace("min", "") || "",
        guidelines:
          editDetail?.guidelines?.replace(/\n/g, ", ") ||
          "",
      });
    } else {
      reset({
        detail: "",
        time: "",
        guidelines: "",
      });
    }
  }, [editDetail, isOpen, reset]);

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

  // No custom button components - will use original button styles

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
              <Controller
                name="detail"
                control={control}
                rules={{
                  required: "Detail name is required",
                }}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Enter Detail Name"
                    error={errors.detail}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(e.target.value)
                    }
                  />
                )}
              />
              {errors.detail && (
                <p className="text-[#B10E0EE5] text-[10px] mt-1">
                  {errors.detail.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label name="time" label="Time" />
              <Controller
                name="time"
                control={control}
                rules={{
                  required: "Time is required",
                  pattern: {
                    value: /^\d{1,2}$/,
                    message:
                      "Invalid time format! Use numbers only.",
                  },
                }}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder="Time (e.g., 10)"
                    error={errors.time}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(e.target.value)
                    }
                  />
                )}
              />
              {errors.time && (
                <p className="text-[#B10E0EE5] text-[10px] mt-1">
                  {errors.time.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label name="guidelines" label="Guidelines" />
              <Controller
                name="guidelines"
                control={control}
                rules={{
                  required: "Guidelines are required",
                }}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Guidelines (comma-separated)"
                    error={errors.guidelines}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(e.target.value)
                    }
                  />
                )}
              />
              {errors.guidelines && (
                <p className="text-[#B10E0EE5] text-[10px] mt-1">
                  {errors.guidelines.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end items-center gap-2 mt-6 mb-2">
            <button
              type="button"
              className="secondary-button h-7"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="primary-button h-7"
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

DetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  details: PropTypes.array.isRequired,
  editDetail: PropTypes.object,
};

export default DetailsModal;
