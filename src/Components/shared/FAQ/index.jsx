import { useState } from "react";
import {
  clientFaqsData,
  interviewerFaqsData,
} from "./constants";
import { ChevronDown, ChevronUp } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import { ROLES } from "../../Constants/constants";

const FAQ = () => {
  const { auth } = useAuth();
  const isInterviewer = ROLES.INTERVIEWER.includes(
    auth?.role
  );
  // State to track which FAQ is expanded in each category
  const [expandedFaqs, setExpandedFaqs] = useState({});

  // Function to toggle expansion state for a specific FAQ
  const toggleFaq = (category, index) => {
    setExpandedFaqs((prev) => {
      const key = `${category}-${index}`;

      // Create a new object to avoid mutating state directly
      const newState = { ...prev };

      // Toggle the current FAQ - if it's open, close it; if closed, open it
      newState[key] = !prev[key];

      return newState;
    });
  };

  const faqsData = isInterviewer
    ? interviewerFaqsData
    : clientFaqsData;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white">
      {/* Map through each category */}
      {Object.entries(faqsData).map(([category, faqs]) => (
        <div key={category} className="mb-8">
          <h2 className="text-base font-semibold mb-4 text-gray-700 border-b pb-2">
            {category}
          </h2>

          {/* Map through each FAQ in the current category */}
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isExpanded =
                expandedFaqs[`${category}-${index}`];

              return (
                <div
                  key={index}
                  className="border rounded-lg overflow-hidden shadow-sm"
                >
                  {/* Question (header) - clickable to expand/collapse */}
                  <button
                    onClick={() =>
                      toggleFaq(category, index)
                    }
                    className="w-full flex justify-between items-center px-4 py-3 text-left font-medium bg-gray-50 hover:bg-gray-100 transition-colors text-[#374151]"
                  >
                    <span className="pr-8 text-default">
                      {faq.question}
                    </span>
                    {isExpanded ? (
                      <ChevronUp
                        className="flex-shrink-0"
                        size={20}
                      />
                    ) : (
                      <ChevronDown
                        className="flex-shrink-0"
                        size={20}
                      />
                    )}
                  </button>

                  {/* Answer - shown only when expanded */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-4 bg-white">
                      <p className="text-[#4a4459] text-xs">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
