import PropTypes from "prop-types";
import { getFeedbackColor, COLORS } from "../../util";

export const ProgressBar = ({ progress }) => {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(
    Math.max(Number(progress) || 0, 0),
    100
  );
  const barColor = getFeedbackColor(normalizedProgress);

  return (
    <div className={`w-[200px]`}>
      <div
        className="w-full h-2 bg-[#E5E7EB] rounded-full"
        role="progressbar"
        aria-valuenow={normalizedProgress}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          style={{
            width: `${normalizedProgress}%`,
            backgroundColor: barColor,
            height: "100%",
            borderRadius: "9999px",
            transition:
              "width 0.5s ease-in-out, background-color 0.5s ease-in-out",
          }}
        />
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  width: PropTypes.string,
  className: PropTypes.string,
};

export const SkillTable = ({ skills }) => {
  if (!skills || Object.keys(skills).length === 0) {
    return (
      <div className="text-center py-4">
        No skills data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
      <table className="table-auto border-collapse w-full ">
        <thead>
          <tr
            className={`bg-[${COLORS.PRIMARY}] border-b text-[${COLORS.TEXT_PRIMARY}] font-semibold text-xs`}
          >
            <th className="px-3 py-2 text-left border border-[#00000070]">
              Skill
            </th>
            <th className="px-3 py-2 text-center border border-[#00000070]">
              Score
            </th>
            <th className="px-3 py-2 text-center border border-[#00000070]">
              Summary
            </th>
          </tr>
        </thead>
        <tbody className={`bg-[${COLORS.SECONDARY}]`}>
          {Object.keys(skills).map((skill, index) => (
            <tr
              key={index}
              className={`border-b text-xs text-[${COLORS.TEXT_PRIMARY}]`}
            >
              <td className="px-3 py-2 border border-[#00000070]">
                {skill}
              </td>
              <td className="px-3 py-2 border border-[#00000070] text-center">
                {skills[skill].score}
              </td>
              <td className="px-3 py-2 border border-[#00000070]">
                {skills[skill].summary ||
                  "No summary available"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

SkillTable.propTypes = {
  skills: PropTypes.objectOf(
    PropTypes.shape({
      score: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      summary: PropTypes.string,
    })
  ).isRequired,
};

export const SkillList = ({ skills }) => {
  if (!skills || Object.keys(skills).length === 0) {
    return (
      <div className="text-center py-4">
        No skills data available
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-y-6">
      {Object.keys(skills).map((key, idx) => (
        <li
          key={idx}
          className="list-none flex gap-x-6 justify-between items-center"
        >
          <p className="text-default text-[#49454F] fon-medium">
            {key}
          </p>
          <div className="flex items-center gap-x-6">
            <ProgressBar progress={skills[key]?.score} />
            <p className="text-default text-[#49454F]">
              <span className="text-md mr-1 font-semibold">
                {skills[key]?.score}
              </span>
              <span className="opacity-70">/100</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

SkillList.propTypes = {
  skills: PropTypes.objectOf(
    PropTypes.shape({
      score: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      summary: PropTypes.string,
    })
  ).isRequired,
};
