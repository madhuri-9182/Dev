import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import Modal from "../../shared/Modal";
import { WEBSITE_REGEX } from "../../Constants/constants";
import { AddCircle } from "iconsax-react";
import { LightTooltip } from "../../shared/LightTooltip";

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
  // State for links
  const [links, setLinks] = useState([]);
  const [currentLink, setCurrentLink] = useState("");
  const [linkError, setLinkError] = useState("");
  // New state for combined validation error
  const [combinedError, setCombinedError] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      detail: "",
      time: "",
      guidelines: "",
    },
  });

  // Watch guidelines field value for validation
  const guidelinesValue = watch("guidelines");

  // Function to validate URL
  const isValidUrl = (url) => {
    return WEBSITE_REGEX.test(url);
  };

  // Function to add a link
  const addLink = () => {
    if (!currentLink.trim()) {
      setLinkError("Link cannot be empty");
      return;
    }

    if (!isValidUrl(currentLink)) {
      setLinkError("Please enter a valid URL");
      return;
    }

    setLinks([...links, currentLink]);
    setCurrentLink("");
    setLinkError("");

    // Clear combined error when a link is added
    setCombinedError("");
  };

  // Function to remove a link
  const removeLink = (index) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    setLinks(newLinks);

    // Check if we need to show combined error after link removal
    if (
      newLinks.length === 0 &&
      (!guidelinesValue || !guidelinesValue.trim())
    ) {
      setCombinedError(
        "At least one guideline or link is required"
      );
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    if (editDetail) {
      // Extract links from guidelines if they exist
      const guidelines = editDetail?.guidelines || "";
      const guidelineItems = guidelines.split("\n");

      const extractedLinks = [];
      const normalGuidelines = [];

      guidelineItems.forEach((item) => {
        if (isValidUrl(item)) {
          extractedLinks.push(item);
        } else {
          normalGuidelines.push(item);
        }
      });

      reset({
        detail: editDetail?.details || "",
        time: editDetail?.time?.replace("min", "") || "",
        guidelines: normalGuidelines.join(", "),
      });

      setLinks(extractedLinks);
    } else {
      reset({
        detail: "",
        time: "",
        guidelines: "",
      });
      setLinks([]);
    }

    // Clear errors when modal opens
    setCombinedError("");
    setLinkError("");
  }, [editDetail, isOpen, reset]);

  const onSubmit = (data) => {
    // First, validate that at least one of guidelines or links is not empty
    if (
      (!data.guidelines || !data.guidelines.trim()) &&
      links.length === 0
    ) {
      setCombinedError(
        "At least one guideline or link is required"
      );
      return;
    }

    // Calculate total minutes with proper handling for edit case
    let totalMinutes = 0;

    if (editDetail) {
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

    // Combine guidelines text with links
    const guidelinesArray = data.guidelines
      ? data.guidelines
          .split(", ")
          .filter((item) => item.trim() !== "")
      : [];
    const allGuidelines = [...guidelinesArray, ...links];

    const newDetail = {
      id: editDetail ? editDetail.id : Date.now(),
      details: data.detail,
      time: `${data.time}min`,
      guidelines: allGuidelines.join("\n"),
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

  // Check combined validation when guidelines field changes
  useEffect(() => {
    if (
      links.length === 0 &&
      (!guidelinesValue || !guidelinesValue.trim())
    ) {
      setCombinedError(
        "At least one guideline or link is required"
      );
    } else {
      setCombinedError("");
    }
  }, [guidelinesValue, links]);

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
                rules={
                  {
                    // Remove required validation as we'll handle it separately
                  }
                }
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Guidelines (comma-separated)"
                    error={errors.guidelines}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  />
                )}
              />
              {errors.guidelines && (
                <p className="text-[#B10E0EE5] text-[10px] mt-1">
                  {errors.guidelines.message}
                </p>
              )}
            </div>

            {/* New Links Section */}
            <div className="space-y-1">
              <Label name="links" label="Links" />
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter a URL"
                  error={
                    linkError
                      ? { message: linkError }
                      : null
                  }
                  value={currentLink}
                  onChange={(e) =>
                    setCurrentLink(e.target.value)
                  }
                />
                <LightTooltip
                  title="Click to Add Link"
                  placement="top"
                  color="#007AFF"
                  PopperProps={{
                    sx: {
                      zIndex: 99999, // Ensure the tooltip is above other elements
                    },
                  }}
                >
                  <button
                    type="button"
                    className="text-[#007AFF] rounded-lg text-2xs"
                    onClick={addLink}
                  >
                    <AddCircle />
                  </button>
                </LightTooltip>
              </div>
              {linkError && (
                <p className="text-[#B10E0EE5] text-[10px] mt-1">
                  {linkError}
                </p>
              )}

              {/* Display added links */}
            </div>
          </div>
          {links.length > 0 && (
            <div className="mt-2">
              <p className="text-2xs font-bold text-[#6B6F7B]">
                Added Links:
              </p>
              <ul className="mt-1 space-y-1">
                {links.map((link, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between text-2xs"
                  >
                    <span className="truncate max-w-[80%] text-blue-500">
                      {link}
                    </span>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeLink(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {combinedError && (
            <p className="text-[#B10E0EE5] text-[10px] mt-1">
              {combinedError}
            </p>
          )}
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
