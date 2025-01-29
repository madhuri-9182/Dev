import React from 'react'
import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {motion, useAnimation} from 'framer-motion';

//variants
import { fadeIn } from './variants';
import { useInView } from 'react-intersection-observer';

//Load Animation Imports
import Loader from './Loader';



// Material UI usages

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import './InterviewerCss.css';




const styles= {
  gradientText: {
    backgroundClip: 'text',
    color: 'transparent',
    backgroundImage: 'linear-gradient(to right, #000000, #B44B4B, #B44B4B)',
    
  },
  
}




function Feedback() {

  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [candidateExperience, setCandidateExperience] = useState('');
  const [candidateRole, setCandidateRole] = useState('');
  const [candidateCompany, setCandidateCompany] = useState('');
  const [interviewerExperience, setInterviewerExperience] = useState('');
  const [interviewerCompany, setInterviewerCompany] = useState('');
  const [interviewDate, setInterviewDate] = useState('');

  // 2nd section 
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState(90); // Initial skill level
  const [questions, setQuestions] = useState([
    { question: '', answer: '' },
    { question: '', answer: '' },
  ]);
  
  const [summary, setSummary] = useState('');

  const handleSkillNameChange = (event) => {
    setSkillName(event.target.value);
  };

  const handleSkillLevelChange = (event) => {
    setSkillLevel(parseInt(event.target.value, 10));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = useCallback((event) => {
    event.preventDefault(); 
    setQuestions([...questions, { question: '', answer: '' }]);
  }, [questions]);

  const handleSummaryChange = (event) => {
    setSummary(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
  };



  // Material UI Usages
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };


  // Skill Evaluations

  const [communicationRating, setCommunicationRating] = useState('');
  const [attitudeRating, setAttitudeRating] = useState('');
  const [strength, setStrength] = useState('');
  const [improvementPoints, setImprovementPoints] = useState('');

  const handleRatingChange = useCallback((section, rating) => {
    if (section === 'communication') {
      setCommunicationRating(rating);
    } else if (section === 'attitude') {
      setAttitudeRating(rating);
    }
  },[communicationRating,attitudeRating]);

  const handleStrengthChange =useCallback( (event) => {
    event.preventDefault(); 
    setStrength(event.target.value);
  },[strength]);

  const handleImprovementPointsChange = useCallback((event) => {
    event.preventDefault(); 
    setImprovementPoints(event.target.value);
  },[improvementPoints]);


  // overall rank
  const [selectedRemark, setSelectedRemark] = useState("")
  
  const handleStrengthSelection=(e) => {   
    setSelectedRemark(e.target.value);
  }

  //Animations

  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();
  const controls4 = useAnimation();
  const controls5 = useAnimation();
  const controls6 = useAnimation();
  const controls7 = useAnimation();

  const [ref1, inView1] = useInView({
    triggerOnce: true, 
  });
  const [ref2, inView2] = useInView({
    triggerOnce: true, 
  });
  const [ref3, inView3] = useInView({
    triggerOnce: true, 
  });
  const [ref4, inView4] = useInView({
    triggerOnce: true, 
  });
  const [ref5, inView5] = useInView({
    triggerOnce: true, 
  });
  const [ref6, inView6] = useInView({
    triggerOnce: true, 
  });
  const [ref7,inView7] = useInView({
    triggerOnce: true, 
  });

  useEffect(() => {
    if (inView1) {
      controls1.start("show"); 
    }
    if (inView2) {
      controls2.start("show"); 
    }
    if (inView3) {
      controls3.start("show"); 
    }
    if (inView4) {
      controls4.start("show"); 
    }
    if (inView5) {
      controls5.start("show"); 
    }
    if (inView6) {
      controls6.start("show"); 
    }
    if (inView7) {
      controls7.start("show"); 
    }
  }, [controls1, inView1, controls2, inView2, controls3, inView3, controls4, inView4, controls5, inView5, controls6, inView6, controls7, inView7]);

  //Loading Animation(Loader)
  const [loading, setLoading] = useState(false);
  useEffect(() => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 
    500);
  },[]);


  //navigations

  const navigate = useNavigate();
  const handleCancel = () => {
    
    window.scrollTo(0, 0);
    navigate("/interviewer/dashboard");
  };

  return (
    <div className='h-full' >
      {loading?<Loader/>: <> 
      <div className=' overflow-y-auto' >
      <div className='p-2 flex justify-center items-center  border-[#000000] ' >
        <div className='flex gap-4 font-semibold text-[36px] ' >
        
          <div style={styles.gradientText} > FEEDBACK FORM</div>
        </div>  
      </div>
      <div className='flex p-5' >
      
      <div className=' w-[100%] pl-8' >
      <form onSubmit="#">
        <motion.div
           ref={ref1} 
           variants={fadeIn('right', 0.1)} 
           initial="hidden"
           animate={controls1} 
        className='flex ' >
            <div className='flex flex-col w-[30%] ' >
              <span className='text-[24px] font-bold ' style={styles.gradientText} >Candidate Details</span>
              <span className='text-[16px] text-[#000000a1]' >Please Provide Candidate Details</span>
            </div>
           
            <div className="flex gap-3 w-[70%] ">
              <div className=' w-[50%] ' >
                <div className='w-[70%] ' >
                  <label htmlFor="candidateName" className="block text-[16px] font-semibold text-[#000000]">
                    Candidate Name:
                  </label>
                  <input
                    type="text"
                    id="candidateName"
                    placeholder='Enter Name'
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="mt-1 p-2 text-[14px] w-full border-[2px] border-gray-400 rounded-[13px] shadow-md outline-none  focus:border-[#056DDC] mb-[12px] "
                  />
                </div>
                <div className='w-[70%]' >
                  <label htmlFor="candidatePhone" className="block text-[16px] font-semibold text-[#000000]">
                    Candidate Phone Number:
                  </label>
                  <input
                    type="tel"
                    id="candidatePhone"
                    placeholder='Enter Number'
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    className="mt-1 p-2 text-[14px] w-full border-[2px] border-gray-400 rounded-[13px] shadow-md outline-none  focus:border-[#056DDC] mb-[12px] "
                  />
                </div>
                <div className='w-[70%]' >
                  <label htmlFor="candidateRole" className="block text-[16px] font-semibold text-[#000000]">
                    Role:
                  </label>
                  <input
                    type="text"
                    id="candidateRole"
                    placeholder='Enter Role'
                    value={candidateRole}
                    onChange={(e) => setCandidateRole(e.target.value)}
                    className="mt-1 p-2 text-[14px] w-full border-[2px] border-gray-400 rounded-[13px] shadow-md outline-none  focus:border-[#056DDC] mb-[12px] "
                  />
                </div>
              </div>
              <div className=' w-[50%]  ' >
                <div className=' w-[70%] ' >
                  <label htmlFor="candidateEmail" className="block text-[16px] font-semibold text-[#000000]">
                    Candidate Email:
                  </label>
                  <input
                    type="email"
                    id="candidateEmail"
                    placeholder='Enter Email'
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    className="mt-1 p-2 text-[14px] w-full border-[2px] border-gray-400 rounded-[13px] shadow-md outline-none  focus:border-[#056DDC] mb-[12px]"
                  />
                </div>
                <div className='w-[70%]' >
                  <label htmlFor="candidateExperience" className="block text-[16px] font-semibold text-[#000000]">
                    Candidate Year of Experience:
                  </label>
                  <input
                    type="number"
                    id="candidateExperience"
                    placeholder='Enter Year'
                    value={candidateExperience}
                    onChange={(e) => setCandidateExperience(e.target.value)}
                    className="mt-1 p-2 text-[14px] w-full border-[2px] border-gray-400 rounded-[13px] shadow-md outline-none  focus:border-[#056DDC] mb-[12px] "
                  />
                </div>
                <div className='w-[70%]' >
                  <label htmlFor="candidateCompany" className="block text-[16px] font-semibold text-[#000000]">
                    Current Company:
                  </label>
                  <input
                    type="text"
                    id="candidateCompany"
                    placeholder='Enter Company'
                    value={candidateCompany}
                    onChange={(e) => setCandidateCompany(e.target.value)}
                    className="mt-1 p-2 text-[14px] w-full border-[2px] border-gray-400 rounded-[13px] shadow-md outline-none  focus:border-[#056DDC] mb-[12px] "
                  />
                </div>
              </div>
            </div>
        </motion.div>  
        <motion.div
             ref={ref2}
             variants={fadeIn('left',0.1)}
             initial="hidden"
             animate={controls2}
             
            className='flex mt-16 ' >   
            <div className='flex flex-col w-[30%] ' >
            <span className='text-[24px] font-bold ' style={styles.gradientText} >Interviewer Details</span>
            <span className='text-[16px] text-[#000000a1]' >Please Provide Interviewer Details</span>
            </div>
            <div className="flex gap-3 w-[70%] ">
              <div className=' w-[50%] ' >
                <div className='w-[70%] ' >
                  <label htmlFor="candidateName" className="block text-[16px] font-semibold text-[#000000]">
                  Interviewer Year of Experience :
                  </label>
                  <input
                     type="number"
                     id="interviewerExperience"
                     placeholder='Enter Year'
                     value={interviewerExperience}
                     onChange={(e) => setInterviewerExperience(e.target.value)}
                    className="mt-1 p-2 text-[14px] w-full border-[2px] border-gray-400 rounded-[13px] shadow-md outline-none  focus:border-[#056DDC] mb-[12px] "
                  />
                </div>
                <div className='w-[70%]' >
                  <label htmlFor="candidatePhone" className="block text-[16px] font-semibold text-[#000000]">
                  Interview Date :
                  </label>
                  <input
                    type="date"
                    id="interviewDate"
                    value={interviewDate}
                    
                    placeholder="DD/MM/YYYY"
                    className="mt-1 p-2 text-[14px] w-full border-[2px] border-gray-400 rounded-[13px] shadow-md outline-none  focus:border-[#056DDC] mb-[12px] "
                  />
                </div>
              </div>
              <div className=' w-[50%]  ' >
                <div className=' w-[70%] ' >
                  <label htmlFor="candidateEmail" className="block text-[16px] font-semibold text-[#000000]">
                  Current Company :
                  </label>
                  <input
                    type="text"
                    id="interviewerCompany"
                    placeholder='Enter Company'
                    value={interviewerCompany}
                    onChange={(e) => setInterviewerCompany(e.target.value)}
                    className="mt-1 p-2 text-[14px] w-full border-[2px] border-gray-400 rounded-[13px] shadow-md outline-none  focus:border-[#056DDC] mb-[12px]"
                  />
                </div>
              </div>
            </div>
        </motion.div>  
         
        <motion.div 
              ref={ref3}
              variants={fadeIn('right',0.1)}
              initial="hidden"
              animate={controls3}

        className='flex mt-16 ' >   
            <div className='flex flex-col w-[30%] ' >
            <span className='text-[24px] font-bold ' style={styles.gradientText} >Question Asked</span>
            <span className='text-[16px] text-[#000000a1]' >Please Provide Asked Question</span>
            </div>
            <div className="flex gap-3 w-[70%]  ">
              <div className=' w-[90%]  p-3 border-[1px] rounded-xl border-black' >
                  <div className='' >
                      <div className='w-full  rounded-md text-[#0000008a] ' >
                        <div className="w-full flex justify-between px-2 items-center mb-4">
                          <input
                            type="text"
                            placeholder="Skill Name"
                            value={skillName}
                            onChange={handleSkillNameChange}
                            className="border-[2px] border-gray-400 rounded-[13px] shadow-md outline-none  focus:border-[#056DDC] px-3 py-1 "
                          />
                          <div className='flex justify-center items-center' >
                          <div className="w-48 bg-[#AC878787] rounded-full">
                            <div
                              className="rounded-full h-4 bg-gradient-to-r from-green-300 to-green-600 "
                              style={{ width: `${skillLevel}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-[12px] "><span className='text-[16px] text-[#000000] font-medium ' >{skillLevel}/</span>100</span>
                          </div>
                        </div>
                      </div>
                      
                  </div>
                  <div className='bg-[#E8F0F5] p-5 py-1 m-1 ' >
                    <ol className='list-decimal' >
                          <div className="">
                            {questions.map((question, index) => (
                               <li>
                              <div key={index} className=" rounded-md p-4">
                                <div className="mb-2">
                                  <label htmlFor={`question-${index}`} className="block text-sm font-medium text-gray-700">
                                    Question {index + 1}:
                                  </label>
                                  <textarea
                                    id={`question-${index}`}
                                    rows={2}
                                    placeholder='Question'
                                    value={question.question}
                                    onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none   "
                                  />
                                </div>
                                <div>
                                  <label htmlFor={`answer-${index}`} className="block text-sm font-medium text-gray-700">
                                    Answer:
                                  </label>
                                  <textarea
                                    id={`answer-${index}`}
                                    rows={2}
                                    placeholder='Answer'
                                    value={question.answer}
                                    onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 outline-none  focus:border-[#056DDC] "
                                  />
                                </div>
                              </div>
                              </li>
                            ))}
                          </div>
                        <div className='flex justify-end' >
                          <button
                            onClick={handleAddQuestion}
                          >
                            <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M16 0C12.8355 0 9.74207 0.858769 7.11088 2.46771C4.4797 4.07665 2.42894 6.3635 1.21793 9.03907C0.00693254 11.7146 -0.309921 14.6588 0.307443 17.4991C0.924806 20.3395 2.44866 22.9486 4.6863 24.9964C6.92394 27.0441 9.77487 28.4387 12.8786 29.0037C15.9823 29.5687 19.1993 29.2787 22.1229 28.1705C25.0466 27.0622 27.5454 25.1854 29.3035 22.7775C31.0616 20.3695 32 17.5385 32 14.6425C32 12.7196 31.5861 10.8156 30.7821 9.03907C29.978 7.26256 28.7994 5.64838 27.3137 4.2887C25.828 2.92901 24.0641 1.85045 22.1229 1.1146C20.1817 0.37874 18.1012 0 16 0ZM20.8 16.1068H17.6V19.0353C17.6 19.4236 17.4314 19.7961 17.1314 20.0707C16.8313 20.3453 16.4244 20.4995 16 20.4995C15.5757 20.4995 15.1687 20.3453 14.8686 20.0707C14.5686 19.7961 14.4 19.4236 14.4 19.0353V16.1068H11.2C10.7757 16.1068 10.3687 15.9525 10.0686 15.6779C9.76858 15.4033 9.60001 15.0309 9.60001 14.6425C9.60001 14.2542 9.76858 13.8817 10.0686 13.6071C10.3687 13.3325 10.7757 13.1783 11.2 13.1783H14.4V10.2498C14.4 9.86142 14.5686 9.48899 14.8686 9.21439C15.1687 8.93979 15.5757 8.78552 16 8.78552C16.4244 8.78552 16.8313 8.93979 17.1314 9.21439C17.4314 9.48899 17.6 9.86142 17.6 10.2498V13.1783H20.8C21.2243 13.1783 21.6313 13.3325 21.9314 13.6071C22.2314 13.8817 22.4 14.2542 22.4 14.6425C22.4 15.0309 22.2314 15.4033 21.9314 15.6779C21.6313 15.9525 21.2243 16.1068 20.8 16.1068Z" fill="#231F20" />
                            </svg>
                          </button>
                        </div>
                    </ol>
                    <ul>
                      <li className='px-3' >
                      <div className="mt-4">
                        <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                          Summary:
                        </label>
                        <textarea
                          id="summary"
                          rows={4}
                          value={summary}
                          onChange={handleSummaryChange}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 outline-none  focus:border-[#056DDC]"
                        />
                      </div>
                      </li>
                    </ul>
                  </div>
                  
              </div>
            </div>
        </motion.div>    
        <motion.div 
             ref={ref4}
             variants={fadeIn('left',0.1)}
             initial="hidden"
             animate={controls4}
            className='flex mt-16 ' >   
            <div className='flex flex-col w-[30%] ' >
            <span className='text-[24px] font-bold ' style={styles.gradientText} >Skill Evaluation</span>
            <span className='text-[16px] text-[#000000a1]' >Please Evaluate Candidate’s skill</span>
            </div>
            <div className="flex gap-3 w-[70%]  ">
                  <div className='flex flex-col gap-y-5 w-[90%]   ' >
                   
                    <div className='w-[100%]  p-3 border-[1px] rounded-xl border-black' >
                      <div className='text-[#000000] font-medium text-[24px]' >Communication</div>
                      <div className='text-[#000000] font-normal text-[17px] ' >How would you like to rate?</div>
                      <div className='flex justify-between' >
                        <button type='button'
                          className={`w-[180px] h-[35px] rounded-md ${communicationRating === 'Poor'
                            ? 'bg-[#F22129] text-white'
                            : 'bg-gray-200 text-gray-700'
                            }`}
                          onClick={() => handleRatingChange('communication', 'Poor')}
                        >
                          Poor
                        </button>
                        <button type='button'
                          className={`w-[180px] h-[35px]  rounded-md ${communicationRating === 'Average'
                            ? 'bg-[#FFD700] text-black'
                            : 'bg-gray-200 text-gray-700'
                            }`}
                          onClick={() => handleRatingChange('communication', 'Average')}
                        >
                          Average
                        </button>
                        <button type='button'
                          className={`w-[180px] h-[35px]  rounded-md ${communicationRating === 'Good'
                            ? 'bg-[#32CD32] text-white'
                            : 'bg-gray-200 text-gray-700'
                            }`}
                          onClick={() => handleRatingChange('communication', 'Good')}
                        >
                          Good
                        </button>
                        <button type='button'
                          className={`w-[180px] h-[35px]  rounded-md ${communicationRating === 'Excellent'
                            ? 'bg-[#008000] text-white'
                            : 'bg-gray-200 text-gray-700'
                            }`}
                          onClick={() => handleRatingChange('communication', 'Excellent')}
                        >
                          Excellent
                        </button>
                      </div>
                    </div>
                    <div className='w-[100%]  p-3 border-[1px] rounded-xl border-black' >
                      <div className='text-[#000000] font-medium text-[24px]' >Attitude</div>
                      <div className='text-[#000000] font-normal text-[17px] ' >How would you like to rate?</div>
                      <div className='flex justify-between' >
                        <button type='button'
                          className={`w-[180px] h-[35px]  rounded-md ${attitudeRating === 'Poor'
                              ? 'bg-[#F22129] text-white'
                              : 'bg-gray-200 text-gray-700'
                            }`}
                          onClick={() => handleRatingChange('attitude', 'Poor')}
                        >
                          Poor
                        </button>
                        <button type='button'
                          className={`w-[180px] h-[35px]  rounded-md ${attitudeRating === 'Average'
                              ? 'bg-[#FFD700] text-black'
                              : 'bg-gray-200 text-gray-700'
                            }`}
                          onClick={() => handleRatingChange('attitude', 'Average')}
                        >
                          Average
                        </button>
                        <button type='button'
                          className={`w-[180px] h-[35px]  rounded-md ${attitudeRating === 'Good'
                              ? 'bg-[#32CD32] text-white'
                              : 'bg-gray-200 text-gray-700'
                            }`}
                          onClick={() => handleRatingChange('attitude', 'Good')}
                        >
                          Good
                        </button>
                        <button type='button'
                          className={`w-[180px] h-[35px]  rounded-md ${attitudeRating === 'Excellent'
                              ? 'bg-[#008000] text-white'
                              : 'bg-gray-200 text-gray-700'
                            }`}
                          onClick={() => handleRatingChange('attitude', 'Excellent')}
                        >
                          Excellent
                        </button>
                      </div>
                    </div>
                  </div>
            </div>
        </motion.div>    
        <motion.div 
             ref={ref5}
             variants={fadeIn('right',0.1)}
             initial="hidden"
             animate={controls5}
            className='flex mt-16 ' >   
            <div className='flex flex-col w-[30%] ' >
            <span className='text-[24px] font-bold flex flex-wrap ' style={styles.gradientText} >Strength and Improvement</span>
            <span className='text-[16px] text-[#000000a1]' >Please Provide the Strength and </span>
            <span className='text-[16px] text-[#000000a1]' > Improvement point of the </span>
            <span className='text-[16px] text-[#000000a1]' >  Candidate</span>
            </div>
            <div className="flex gap-3 w-[70%]  ">
                  <div className='flex flex-col gap-y-5 w-[90%]   ' >
                   
                    <div className='w-[100%] ' >
                      <div>
                        <label htmlFor="strength" className="block text-[17px] font-medium text-[#000000]">
                          Candidate's Strength:
                        </label>
                        <textarea
                          id="strength"
                          rows={2}
                          value={strength}
                          placeholder='Please Provide the strength of the candidate'
                          onChange={handleStrengthChange}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 outline-none  focus:border-[#056DDC]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="improvementPoints"
                          className="block text-[17px] font-medium text-[#000000]"
                        >
                          Improvement Points:
                        </label>
                        <textarea
                          id="improvementPoints"
                          rows={2}
                          placeholder='Please provide the Improvement point of the candidate'
                          value={improvementPoints}
                          onChange={handleImprovementPointsChange}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 outline-none  focus:border-[#056DDC]"
                        />
                      </div>
                      
                      
                    </div>
                    
                  </div>
            </div>
        </motion.div> 
        <motion.div 
             ref={ref6}
             variants={fadeIn('left',0.1)}
             initial="hidden"
             animate={controls6}
            className='flex mt-16 ' >   
            <div className='flex flex-col w-[30%] ' >
            <span className='text-[24px] font-bold flex flex-wrap ' style={styles.gradientText} >Overall Remark</span>
            </div>
            <div className="flex gap-3 w-[70%]  ">
                  <div className='flex gap-y-5 w-[90%] gap-x-8  ' >
                   
                    
                      <div className='w-[50%]' >
                        <label htmlFor="strength" className="block text-[17px] font-medium text-[#000000]">
                        Overall Remark
                        </label>
                        <div className={`w-[90%] h-[60px] border-[1px] border-white rounded-lg ${selectedRemark == "Strongly Recommended" ? "bg-[#008000] " : "Null" }  ${selectedRemark == "Recommended" ? "bg-[#32CD32] " : "Null" }  ${selectedRemark == "Not Recommended" ? "bg-[#E23D28] " : "Null" }  ${selectedRemark == "Strongly Not Recommended" ? "bg-[#F22129] " : "Null" }`} >
                        <select
                            value={selectedRemark}
                            onChange={handleStrengthSelection}
                            
                            className={`  w-[100%] h-[59px] text-center text-black border rounded-md focus:outline-none bg-transparent  border-[#CAC4D0] ${selectedRemark == "bg-transparent" ? "text-gray-500": "text-black" }} `}
                          >
                            <option  value="" selected disabled >Remark</option>
                            <option value="Strongly Recommended">Strongly Recommended</option>
                            <option value="Recommended">Recommended</option>
                            <option value="Not Recommended">Not Recommended</option>
                            <option value="Strongly Not Recommended">Strongly Not Recommended</option>
                            
                          </select>
                        </div>
                      </div>
                      <div className='w-[50%]' >
                        <label
                          htmlFor="improvementPoints"
                          className="block text-[17px] font-medium text-[#000000]"
                        >
                          Overall Score (auto-Calculated)
                        </label>
                        <div className='w-[90%] h-[60px] border-[1px] border-[#000000] rounded-lg ' ></div>
                      </div>
                      
                      
                    
                    
                  </div>
            </div>
        </motion.div> 

        
            <motion.div
             ref={ref7}
             variants={fadeIn('down',0.1)}
             initial="hidden"
             animate={controls7}
            className='w-[95%] flex justify-end gap-x-8 mt-6 ' >
              
                <button
                  onClick={handleCancel}
                  className="w-[15%] h-[50px] text-white border-[3px] py-1 px-3 rounded-full bg-[#F22129]  transition ease-linear delay-150 hover:-translate-y-1 hover:scale-110 hover:border-[3px] hover:bg-gradient-to-r from-[#E32636] via-[#D2122E] to-[#EF0107] duration-300 ...  "
                >
                  Cancel
                </button>
                <button
                  className="w-[15%] h-[50px] text-white border-[3px] py-1 px-3 rounded-full  transition ease-linear delay-150 hover:-translate-y-1 hover:scale-110 hover:border-[3px] hover:bg-gradient-to-r from-[#0575E6] via-[#295cde] to-[#133bca] duration-300 ... bg-[#007AFF]"
                >
                  Submit Feedback
                </button>
            </motion.div>
        
      </form>
      </div>
      </div>
      </div>
      
      </>
  }
    </div>
   
    
  )
}

export { Feedback  }
