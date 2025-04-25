// MobileTabNavigation.jsx - New component for tab navigation

import PropTypes from "prop-types";
import { Questions, Business, Improvement, Remark, Resources, Skill, User } from "../../../assets";

const MobileTabNavigation = ({ activeSection, onTabClick }) => {
  const tabs = [
    { id: "candidate", icon: User, label: "Candidate" },
    { id: "interviewer", icon: Business, label: "Interviewer" },
    { id: "skills", icon: Questions, label: "Skills" },
    { id: "evaluation", icon: Skill, label: "Evaluation" },
    { id: "strength", icon: Improvement, label: "Strength" },
    { id: "overall", icon: Remark, label: "Remark" },
    { id: "resources", icon: Resources, label: "Resources" },
  ];

  return (
    <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          return (
            <button
              key={tab.id}
              onClick={() => onTabClick(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[80px] py-3 px-2 text-xs font-medium whitespace-nowrap transition-colors duration-200 
                ${activeSection === tab.id 
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" 
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
            >
                 <img
              src={tab.icon}
              alt="icon"
              height={20}
              width={20}
            />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

MobileTabNavigation.propTypes = {
  activeSection: PropTypes.string.isRequired,
  onTabClick: PropTypes.func.isRequired,
};

export default MobileTabNavigation;