import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { updateCandidate } from "../api";
import toast from "react-hot-toast";

const FinalSelectionDropdown = ({ candidate }) => {
  const queryClient = useQueryClient();
  const [isDropdownOpen, setIsDropdownOpen] =
    useState(false);
  const [selectedValue, setSelectedValue] = useState(
    candidate.final_selection_status || ""
  );
  const optionRef = useRef(null);

  const dropdownOptions = [
    { id: "R1R", name: "Round 1 Reject" },
    { id: "R2R", name: "Round 2 Reject" },
    { id: "R3R", name: "Round 3 Reject" },
    { id: "R4R", name: "Round 4 Reject" },
    { id: "OFD", name: "Offer Decline" },
    { id: "HMR", name: "HM Reject" },
    { id: "SLD", name: "Selected" },
    { id: "HD", name: "Hold" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        optionRef.current &&
        !optionRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener(
      "mousedown",
      handleClickOutside
    );
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const finalSelectionMutation = useMutation({
    mutationFn: updateCandidate,
    onSuccess: () => {
      // Invalidate and refetch candidates and stats
      queryClient.invalidateQueries({
        queryKey: ["candidates"],
      });
      toast.success("Candidate status updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSelect = (optionId) => {
    setSelectedValue(optionId);
    setIsDropdownOpen(false);

    // Call the parent component's handler if provided
    if (finalSelectionMutation.isLoading) {
      return;
    }

    finalSelectionMutation.mutate({
      id: candidate.id,
      data: {
        final_selection_status: optionId,
      },
    });
  };

  return (
    <div className="relative" ref={optionRef}>
      {/* Select Box */}
      <div
        className={`px-3 py-1 text-2xs border border-gray-400 rounded-lg flex cursor-pointer w-28 custom-select h-7 items-center`}
        onClick={() => {
          setIsDropdownOpen(!isDropdownOpen);
        }}
      >
        <span>
          {selectedValue
            ? dropdownOptions.find(
                (option) => option.id === selectedValue
              )?.name
            : "Select Status"}
        </span>
      </div>

      {/* Dropdown Options */}
      {isDropdownOpen && (
        <div className="absolute left-0 mt-1 w-28 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-auto">
          {dropdownOptions.map((option) => (
            <div
              key={option.id}
              className="p-2 bg-white hover:bg-[#007AFF] hover:text-white cursor-pointer text-2xs"
              onClick={() => handleSelect(option.id)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

FinalSelectionDropdown.propTypes = {
  candidate: PropTypes.object.isRequired,
  onStatusChange: PropTypes.func,
};

export default FinalSelectionDropdown;
