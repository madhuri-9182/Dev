import PropTypes from 'prop-types';

const InterviewFeedbackPDF = ({ data }) => {
  const interviewData = {
    "interview_id": 2,
    "interview_date": "14/03/2025 08:00:00",
    "candidate": {
      "name": "Samyak Rout",
      "email": "samyak@mailsac.com",
      "phone": "+918759004569",
      "year": 2,
      "month": 8,
      "company": "JP Morgan",
      "role": "SDE-II",
      "current_designation": "Django developer",
      "source": "CLT",
      "specialization": "backend",
      "cv": "/media/candidate_cvs/Akhil_Resume.pdf",
      "remark": "POW POW, POW POW POW, POW POW POW POW"
    },
    "interviewer": {
      "name": "Sumit Interviewer",
      "total_experience_years": 5,
      "total_experience_months": 8,
      "current_company": "Hiringdog"
    },
    "skill_based_performance": {
      "python with pytorch": {
        "score": "45",
        "summary": "Awesome python skills and knowledge of pytorch and",
        "questions": [
          {
            "ans": "Decorator is the function that alters the behavior of another function without changing the original code.",
            "que": "What is a decorator? "
          }
        ]
      }
    },
    "skill_evaluation": {
      "Attitude": "poor",
      "Communication": "average"
    },
    "strength": "DSA, Python, TensorFlow, Pytorch, MySQL",
    "improvement_points": "Projects",
    "overall_remark": "REC",
    "overall_score": 85,
    "recording_link": null
  };

  const {
    interview_date,
    candidate,
    interviewer,
    skill_based_performance,
    skill_evaluation,
    strength,
    improvement_points,
    overall_remark,
    overall_score
  } = interviewData || data;

  // Parse interview date and time
  const formatDateTime = (dateTimeString) => {
    try {
      const [datePart, timePart] = dateTimeString.split(' ');
      const time = timePart ? timePart.substring(0, 5) : '';
      return { date: datePart, time };
    } catch (e) {
      console.error('Error parsing date and time:', e);
      return { date: dateTimeString, time: '' };
    }
  };

  const { date, time } = formatDateTime(interview_date);

  // Convert skill_based_performance object to array
  const skillsPerformance = Object.entries(skill_based_performance || {}).map(([name, data]) => ({
    skillName: name,
    score: parseInt(data.score) || 0,
    summary: data.summary || '',
    questions: data.questions || []
  }));

  // Helper function to render score bar
  const renderScoreBar = (score, width = 270, height = 12, color = "green") => (
    <div className="flex gap-2 items-center">
      <div className="bg-[#AC878787] rounded-xl" style={{ height: `${height}px`, width: `${width}px` }}>
        <div
          className="rounded-xl"
          style={{
            height: `${height}px`,
            width: `${score}%`,
            background: color
          }}
        />
      </div>
      <p className="text-[12px]">{score}/<span className="text-[9px] text-[#a5aeb5]">100</span></p>
    </div>
  );

  // Get the recommendation color
  const getRecommendationColor = () => {
    if (overall_remark === "HREC") return "#038a0e";
    if (overall_remark === "REC") return "#3CBA68";
    if (overall_remark === "NREC") return "#FD7E14";
    if (overall_remark === "SNREC") return "#DC3545";
    if (overall_remark === "NJ") return "#00ABF0";
    return "bg-[#000000]";
  };

  // Get recommendation text
  const getRecommendationText = () => {
    if (overall_remark === "HREC") return "HIGHLY RECOMMENDED";
    if (overall_remark === "REC") return "RECOMMENDED";
    if (overall_remark === "NREC") return "NOT RECOMMENDED";
    if (overall_remark === "SNREC") return "STRONGLY NOT RECOMMENDED";
    if (overall_remark === "NJ") return "NOT JOINED";
    return overall_remark;
  };

  // Convert skill evaluation to an array for display
  const skillEvaluationArray = Object.entries(skill_evaluation || {}).map(([name, rating]) => ({
    name,
    rating,
    score: rating === 'excellent' ? 100 :
      rating === 'good' ? 75 :
        rating === 'average' ? 50 :
          rating === 'poor' ? 25 : 50
  }));

  // Calculate total experience
  const getTotalExperience = (year, month) => {
    const years = year || 0;
    const months = month || 0;

    if (years === 0) {
      return `${months} months`;
    } else if (months === 0) {
      return `${years} years`;
    } else {
      return `${years} years ${months} months`;
    }
  };

  return (
    <div className="mx-auto w-[21cm]">
      {/* HEADER */}
      <div className="flex items-end justify-between pr-[10px] border-b-[1px] border-[#000000]">
        <div className="flex items-center">
          <img src="/hiring-dog-logo.png" alt="Logo" className="w-[50px] mr-[5px]" />
          <h1 className="font-bold text-base">INTERVIEW REPORT</h1>
        </div>
        <div className="flex gap-2 text-[10px]">
          <p>{date}</p>
          <p>{time}</p>
        </div>
      </div>

      {/* BODY */}
      <div className="p-[15px] pb-0">
        {/* Candidate Info */}
        <div
          className="rounded-xl pt-[18px] pb-[34px] mb-[10px]"
          style={{ background: "linear-gradient(90deg, rgba(174, 212, 235, 0.63) 0%, rgba(202, 206, 208, 0.63) 100%)" }}
        >
          <div className="flex items-center justify-between pb-[16px] pl-[26px] pr-[10px]">
            <h1 className="text-[32px] font-bold">{candidate.name}</h1>
            <div className="flex flex-col gap-2">
              <div className={'p-[4px] font-bold text-white rounded-md text-xs h-[28px] flex items-center justify-center'} style={{ backgroundColor: getRecommendationColor() }} >
                {getRecommendationText()}
              </div>
              <div className={'text-center p-[2px] font-bold text-white rounded-md text-base w-[150px] bg-[#A4333582]'}>
                {overall_score}/100
              </div>
            </div>
          </div>
          <hr className="h-[1.5px] bg-[#000000]" />
          <div className="pl-[26px] pt-[18px] pr-[25px] grid-cols-3 grid gap-4 text-[12px]">
            <div className="flex gap-2 items-center">
              <p className='min-w-[96px]' >Interview Stage : </p>
              <p className="bg-white rounded-lg w-full px-[4px]">Round 1</p>
            </div>
            <div className="flex gap-2 items-center">
              <p className='min-w-[121px]' >Applied For : </p>
              <p className="bg-white rounded-lg w-full px-[4px]">{candidate.role || "N/A"}</p>
            </div>
            <div className="flex gap-2 items-center">
              <p className='min-w-[93px]' >Interview Date : </p>
              <p className="bg-white rounded-lg w-full px-[4px]">{date}</p>
            </div>
            <div className="flex gap-2 items-center">
              <p className='min-w-[96px]' >Current Design. : </p>
              <p className="bg-white rounded-lg w-full px-[4px]">{candidate.role || "N/A"}</p>
            </div>
            <div className="flex gap-2 items-center">
              <p className='min-w-[121px]' >Current Company : </p>
              <p className="bg-white rounded-lg w-full px-[4px]">{candidate.company || "N/A"}</p>
            </div>
            <div className="flex gap-2 items-center">
              <p className='min-w-[93px]' >Strength : </p>
              <p className="bg-white rounded-lg w-full px-[4px]">{candidate.specialization || "N/A"}</p>
            </div>
            <div className="flex gap-2 items-center">
              <p className='min-w-[96px]' >Total Experience : </p>
              <p className="bg-white rounded-lg w-full px-[4px]">{getTotalExperience(candidate.year, candidate.month)}</p>
            </div>
            <div className="flex gap-2 items-center">
              <p className='min-w-[121px]' >Interviewer Company : </p>
              <p className="bg-white rounded-lg w-full px-[4px]">{interviewer.current_company || "N/A"}</p>
            </div>
            <div className="flex gap-2 items-center">
              <p className='min-w-[93px]' >Interviewer Exp. : </p>
              <p className="bg-white rounded-lg w-full px-[4px]">{getTotalExperience(interviewer.total_experience_years, interviewer.total_experience_months)}</p>
            </div>
          </div>
        </div>

        {/* Score */}
        <div
          className="rounded-xl pr-[14px] pl-[26px] mb-[10px] flex"
          style={{ background: "linear-gradient(90deg, rgba(174, 212, 235, 0.63) 0%, rgba(202, 206, 208, 0.63) 100%)" }}
        >
          <div className="w-[70%] pt-[20px] pb-[25px] pr-[10px] border border-r-[#000000] border-l-0 border-y-0">
            <p className="text-[13px] font-semibold mb-[20px]">Score & Values ({skillEvaluationArray.length})</p>
            {skillEvaluationArray.map((skill, index) => (
              <div key={index} className="flex gap-2 items-center mb-[15px]">
                <p className="text-[12px] min-w-[140px]">{skill.name}</p>
                {renderScoreBar(skill.score, 270, 12, "linear-gradient(90deg, rgba(228, 12, 12, 0.81) 16%, rgba(187, 243, 3, 0.5346) 52%, rgba(5, 170, 54, 0.81) 100%)")}
              </div>
            ))}
          </div>
          <div className="pt-[30px] pb-[25px] pl-[10px]">
            <svg width="100%" viewBox="0 0 692 451" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="692" height="451" fill="#130303" />
              <line x1="34" y1="387" x2="669" y2="387" stroke="white" strokeWidth="10" />
              <path d="M385 187L326.5 220.775V153.225L385 187Z" fill="#D9D9D9" />
            </svg>
          </div>
        </div>

        {/* Strength and Improvements */}
        <div
          className="rounded-xl pr-[14px] pl-[26px] pt-[11px] pb-[12px] mb-[10px]"
          style={{ background: "linear-gradient(90deg, rgba(174, 212, 235, 0.63) 0%, rgba(202, 206, 208, 0.63) 100%)" }}
        >
          <div className="flex items-center text-[#137204] text-[13px] font-medium">
            <svg className="mr-1" width="20" height="20" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M25.0003 45.8332C36.5063 45.8332 45.8337 36.5058 45.8337 24.9998C45.8337 13.4939 36.5063 4.1665 25.0003 4.1665C13.4944 4.1665 4.16699 13.4939 4.16699 24.9998C4.16699 36.5058 13.4944 45.8332 25.0003 45.8332Z"
                fill="#3DDAB4"
              />
              <path
                d="M40.7196 18.2449L36.4738 14.1709L23.7238 27.3261L17.3738 21.2844L13.2998 25.5303L19.6279 31.5511L23.8748 35.6032L23.8811 35.5969L23.8873 35.6032L27.979 31.374L40.7196 18.2449Z"
                fill="#C1F5EA"
              />
              <path
                d="M23.8811 35.597L27.979 31.3741L23.7238 27.3262L19.6279 31.5512L23.8811 35.597Z"
                fill="white"
              />
            </svg>
            Strength
          </div>
          <div className="bg-white mt-[10px] mb-[15px] rounded-lg p-3 text-xs">
            {strength}
          </div>

          <div className="flex items-center text-[#D32323] text-[13px] font-medium">
            <svg className="mr-1" width="16" height="16" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.5 36L10.75 24.25L14.25 20.75L22.5 29L43.5 8C38.75 3.25 32.25 0 25 0C11.25 0 0 11.25 0 25C0 38.75 11.25 50 25 50C38.75 50 50 38.75 50 25C50 20.25 48.75 16 46.5 12.25L22.5 36Z"
                fill="#8C1A11"
              />
            </svg>
            Improvements
          </div>
          <div className="bg-white mt-[10px] mb-[15px] rounded-lg p-3 text-xs">
            {improvement_points}
          </div>
        </div>

        {/* Question and answers skill wise */}
        {skillsPerformance.map((skillAssessment, skillIndex) => (
          <div
            key={skillIndex}
            className="rounded-xl pr-[14px] pl-[8px] mb-[10px] flex"
            style={{ background: "linear-gradient(90deg, rgba(174, 212, 235, 0.63) 0%, rgba(202, 206, 208, 0.63) 100%)" }}
          >
            <div className="w-[100%] py-[18px] pr-[10px] border border-r-[#000000] border-l-0 border-y-0">
              <div className="bg-white p-[10px] pt-[7px] rounded-lg border border-black">
                <div className="flex justify-between items-center">
                  <p className="text-[12px] border border-[#000000] rounded pl-[8px] pr-[16px]">
                    {skillAssessment.skillName}
                  </p>
                  {renderScoreBar(skillAssessment.score, 150, 12, "#976464CF")}
                </div>
                <div
                  className="rounded-md px-[10px] pt-[8px] pb-[38px] mt-[5px]"
                  style={{ background: "linear-gradient(90deg, rgba(174, 212, 235, 0.63) 0%, rgba(202, 206, 208, 0.63) 100%)" }}
                >
                  {skillAssessment.questions.map((qa, qaIndex) => (
                    <div key={qaIndex} className="mb-[16px]">
                      <div className="flex items-center gap-2 mb-[5px]">
                        <p className="text-[15px]">{qaIndex + 1}.</p>
                        <div className="bg-white w-full min-h-[35px] rounded-md text-[12px] pl-[10px] flex items-center">
                          {qa.que}
                        </div>
                      </div>
                      <div className="bg-white max-w-full min-h-[35px] rounded-md text-[12px] pl-[10px] flex items-center ml-[20px]">
                        {qa.ans}
                      </div>
                    </div>
                  ))}
                  <div className="mb-[5px] ml-[20px] text-[12px]">Summary :</div>
                  <div className="bg-white max-w-full min-h-[100px] rounded-md text-[12px] pl-[10px] pt-[8px] ml-[20px]">
                    {skillAssessment.summary}
                  </div>
                </div>
              </div>
            </div>
            <div className="py-[18px] pl-[10px]">
              <svg width="100%" viewBox="0 0 692 451" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="692" height="451" fill="#130303" />
                <line x1="34" y1="387" x2="669" y2="387" stroke="white" strokeWidth="10" />
                <path d="M385 187L326.5 220.775V153.225L385 187Z" fill="#D9D9D9" />
              </svg>
            </div>
          </div>
        ))}

        {/* Overall remark */}
        <div
          className="rounded-xl pt-[18px] pb-[36px] px-[24px] mb-[10px]"
          style={{ background: "linear-gradient(90deg, rgba(174, 212, 235, 0.63) 0%, rgba(202, 206, 208, 0.63) 100%)" }}
        >
          <p className="text-[13px] font-semibold mb-[10px]">Overall Remark</p>
          <div className="bg-white p-[10px] pt-[7px] rounded-lg w-full min-h-[200px] text-[12px]">
            {overall_remark}
          </div>
        </div>
      </div>
    </div>
  );
};

InterviewFeedbackPDF.propTypes = {
  data: PropTypes.object.isRequired
}

export default InterviewFeedbackPDF;