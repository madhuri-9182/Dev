import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "../../api/axios";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

// Import your existing Privacy Policy and Terms components
import PrivacyPolicy from "../Client/PrivacyPolicy";
import TermsAndConditions from "../Client/tnc/index";
import { ROLES } from "../Constants/constants";
import InterviewerTermsAndConditions from "../Client/tnc/InterviewTnC";

const TermsAndConditionsModal = ({ auth, onAccept }) => {
  const [activeTab, setActiveTab] = useState("terms");
  const [isChecked, setIsChecked] = useState(false);

  // Mutation to update terms acceptance using the login API
  const acceptTermsMutation = useMutation({
    mutationFn: async () => {
      // Using the login API with an accept_terms flag
      const response = await axios.post(
        "/api/tnc-accepted/"
      );
      return response.data;
    },
    onSuccess: () => {
      // Update auth with new token and accepted terms flag
      const updatedAuth = {
        ...auth,
        is_policy_and_tnc_accepted: true,
      };

      toast.success(
        "Terms and conditions accepted successfully"
      );
      onAccept(updatedAuth);
    },
    onError: (error) => {
      console.error("Error accepting terms:", error);
      toast.error(
        "Failed to accept terms. Please try again."
      );
    },
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleSubmit = () => {
    if (isChecked) {
      acceptTermsMutation.mutate();
    }
  };

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md shadow-lg w-11/12 max-w-4xl max-h-[90vh] flex flex-col">
        <div className="px-4 py-2 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            Terms and Privacy Policy
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-4 mt-3">
          <button
            className={`px-2 py-2 font-medium text-default ${
              activeTab === "terms"
                ? "text-[#056DDC] border-b-2 border-[#056DDC]"
                : "text-gray-500"
            }`}
            onClick={() => handleTabChange("terms")}
          >
            Terms and Conditions
          </button>
          <button
            className={`px-2 py-2 font-medium text-default ${
              activeTab === "privacy"
                ? "text-[#056DDC] border-b-2 border-[#056DDC]"
                : "text-gray-500"
            }`}
            onClick={() => handleTabChange("privacy")}
          >
            Privacy Policy
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === "privacy" ? (
            <PrivacyPolicy />
          ) : ROLES.INTERVIEWER.includes(auth.role) ? (
            <InterviewerTermsAndConditions />
          ) : (
            <TermsAndConditions />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <label className="flex items-center mb-4 sm:mb-0 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 mr-2 text-[#056DDC] border-gray-300 rounded focus:ring-[#056DDC]"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <span className="text-sm">
                I have read and agree to the Privacy Policy
                and Terms & Conditions
              </span>
            </label>
            <button
              className="primary-button"
              disabled={
                !isChecked || acceptTermsMutation.isPending
              }
              onClick={handleSubmit}
            >
              {acceptTermsMutation.isPending
                ? "Processing..."
                : "Accept and Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

TermsAndConditionsModal.propTypes = {
  auth: PropTypes.object.isRequired,
  onAccept: PropTypes.func.isRequired,
};

export default TermsAndConditionsModal;
