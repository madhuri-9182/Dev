import { useEffect, useState, useRef, useCallback } from 'react'
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DOMAINS } from '../Constants/constants';
import { useForm } from 'react-hook-form';
import RolesSelect from './Components/RolesSelect';

function AddInterviewer() {
  const [selectedStrength, setSelectedStrength] = useState("")
  const [items, setItems] = useState([]);
  const [itemsSkills, setItemsSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, trigger, setError, setValue, clearErrors } = useForm();
  const hasInteracted = useRef(false); // Ref to track if the user has interacted with the form

  const validateRoles = useCallback(() => {
    if (items.length === 0) {
      setError("role", { type: "manual", message: "Please select at least one role." });
    } else {
      clearErrors("role");
    }  
  }, [items, setError, clearErrors]);

  useEffect(() => {
    // Revalidate role when items change, only if the user has interacted
    if (hasInteracted.current) {
      validateRoles();
    }
  }, [items, validateRoles]);

  useEffect(() => {
    // Revalidate skills when items change, only if the user has interacted
    if (hasInteracted.current) {
      trigger("skills"); // Trigger validation
      }
  }, [itemsSkills, trigger]);
  
  useEffect(() => {
    // Revalidate strength when items change, only if the user has interacted
    if (hasInteracted.current) {
      trigger("strength"); // Trigger validation
      }
  }, [selectedStrength, trigger]);


  const handleSelection = (value) => {
    const selectedRole = value;
    hasInteracted.current = true; // Mark as interacted

    if (selectedRole && !items.includes(selectedRole.id)) {
      setItems([...items, selectedRole.id]);
    }
  }

  const removeItem = (ItemToRemove) => {
    const updatedItems = items.filter(item => item !== ItemToRemove);
    setItems(updatedItems);
  }

  const handleSkillSelection = (e) => {
    const newSkillOption = e.target.value;
    hasInteracted.current = true; // Mark as interacted

    if (newSkillOption && !itemsSkills.includes(newSkillOption)) {
      setItemsSkills([...itemsSkills, newSkillOption]);
    }
  }

  const removeSkill = (ItemToRemove) => {
    const updatedSkills = itemsSkills.filter(item => item !== ItemToRemove);
    setItemsSkills(updatedSkills);

    if (updatedSkills.length === 0) {
      setError("skills", { type: "manual", message: "Please select at least one skill." });
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append("name", data.interviewerName);
      formdata.append("phone_number", "+91" + data.phone);
      formdata.append("email", data.email);
      formdata.append("current_company", data.currentCompany);
      formdata.append("previous_company", data.previousCompany);
      formdata.append("current_designation", data.currentDesignation);
      formdata.append("total_experience_years", data.totalExperienceYears);
      formdata.append("total_experience_months", data.totalExperienceMonths);
      formdata.append("interview_experience_years", data.interviewExperienceYears);
      formdata.append("interview_experience_months", data.interviewExperienceMonths);
      formdata.append("assigned_domain_ids", items);
      formdata.append("skills", JSON.stringify(itemsSkills));
      formdata.append("strength", data.strength);
      formdata.append("cv", data.cv[0]);

      await axios.post("/api/internal/interviewers/", formdata);
      toast.success(
        "Interviewer added successfully",
        {
          position: "top-right",
        }
      );
      navigate("/internal/interviewer");
    } catch (error) {
      let errorMessages;
      if (error?.response?.data?.errors) {
        errorMessages = Object.entries(error.response.data.errors).flatMap(([key, values]) => values.map(value => `${key}: ${value}`));
      }
      toast.error(errorMessages.join(', ') || "Failed to add interviewer", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e)=>{
      handleSubmit(onSubmit)(e);
      validateRoles();
      }}>
      <div className=' text-[14px]' >
        <div className='  ' >

          {/* MAIN 1 */}


          <div className=' '>
            <ul className='grid grid-cols-2 grid-rows-2 gap-2  pl-0 '>
              <li className='flex items-center justify-start gap-x-4 '>
                <div className='w-[30%]  flex items-end justify-end'>
                  <label htmlFor="interviewerName" className="w-full text-right text-[12px] text-[#6B6F7B] font-bold">Interviewer Name</label>
                </div>
                <div className='w-1/2'>
                  <input
                    type="text"
                    name="interviewerName"
                    placeholder='Interviewer Name'
                    className=" 2xl:w-[360px] xl:w-[300px]  h-[32px] md: border border-gray-300  text-center rounded-lg py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                    {...register("interviewerName", { required: "Interviewer Name is required", maxLength: { value: 255, message: "Name must be less than 255 characters" } })}
                  />
                  {errors.interviewerName && <span className="error-message" >{errors.interviewerName.message}</span>}
                </div>
              </li>

              <li className='flex items-center justify-start gap-x-4 '>
                <div className='w-[30%]  flex items-end justify-end'>
                  <label htmlFor="phone" className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold">Phone Number</label>
                </div>
                <div className='w-1/2'>
                  <input
                    type="text"
                    name="phone"
                    placeholder='Phone Number'
                    className=" 2xl:w-[360px] xl:w-[300px] h-[32px] border border-gray-300  text-center rounded-lg py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                    {...register("phone", { required: "Phone Number is required", pattern: { value: /^[0-9]{10}$/, message: "Phone number must be exactly 10 digits" } })}
                  />
                  {errors.phone && <span className="error-message" >{errors.phone.message}</span>}
                </div>
              </li>
              <li className='flex items-center justify-start gap-x-4 '>
                <div className='w-[30%]  flex items-end justify-end'>
                  <label htmlFor="email" className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold">Email ID</label>
                </div>
                <div className='w-1/2'>
                  <input
                    type="email"
                    name="email"
                    placeholder='Email ID'
                    className=" 2xl:w-[360px] xl:w-[300px] h-[32px] border border-gray-300 text-center rounded-lg py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                    {...register("email", { required: "Email is required", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Email must be in the correct format" } })}
                  />
                  {errors.email && <span className="error-message" >{errors.email.message}</span>}
                </div>
              </li>
            </ul>
          </div>
          <hr className=" h-[2px] rounded-full bg-[#F4F4F4] my-4" />





          {/* MAIN 2 */}
          <div className=''>
            <ul className='grid grid-cols-2 grid-rows-2 gap-2 '>
              <li className='flex items-center justify-start gap-x-4 '>
                <div className='w-[30%]  flex items-end justify-end'>
                  <label htmlFor="currentCompany" className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold">Current Company</label>
                </div>
                <div className='w-1/2'>
                  <input
                    type="text"
                    name="currentCompany"
                    placeholder='Current Company'
                    className=" 2xl:w-[360px] xl:w-[300px] h-[32px] border border-gray-300  text-center rounded-lg py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                    {...register("currentCompany", { required: "Current Company is required", maxLength: { value: 255, message: "Current company must be less than 255 characters" } })}
                  />
                  {errors.currentCompany && <span className="error-message" >{errors.currentCompany.message}</span>}
                </div>
              </li>

              <li className='flex items-center justify-start gap-x-4 '>
                <div className='w-[30%]  flex items-end justify-end'>
                  <label htmlFor="previousCompany" className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold">Previous Company</label>
                </div>
                <div className='w-1/2'>
                  <input
                    type="text"
                    name="previousCompany"
                    placeholder='Previous Company'
                    className=" 2xl:w-[360px] xl:w-[300px] h-[32px] border border-gray-300  text-center rounded-lg py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                    {...register("previousCompany", { required: "Previous Company is required", maxLength: { value: 255, message: "Previous company must be less than 255 characters" } })}
                  />
                  {errors.previousCompany && <span className="error-message" >{errors.previousCompany.message}</span>}
                </div>
              </li>
              <li className='flex items-center justify-start gap-x-4 '>
                <div className='w-[30%]  flex items-end justify-end'>
                  <label htmlFor="currentDesignation" className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold">Current Designation</label>
                </div>
                <div className='w-1/2'>
                  <input
                    type="text"
                    name="currentDesignation"
                    placeholder='Current Designation'
                    className=" 2xl:w-[360px] xl:w-[300px] h-[32px] border border-gray-300 text-center rounded-lg py-2 px-4  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                    {...register("currentDesignation", { required: "Current Designation is required", maxLength: { value: 255, message: "Current designation must be less than 255 characters" } })}
                  />
                  {errors.currentDesignation && <span className="error-message" >{errors.currentDesignation.message}</span>}
                </div>
              </li>
            </ul>
          </div>
          <hr className=" h-[2px] rounded-full bg-[#F4F4F4] my-4" />


          {/* MAIN 3 */}

          <div className=''>
            <ul className='grid grid-cols-2 gap-2   '>
              <li className='flex items-center justify-start gap-x-4 '>
                <div className='w-[30%]  flex items-end justify-end'>
                  <label className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold">Total Experience</label>
                </div>
                <div className='flex-col justify-start items-center w-1/2  '>
                  <div className='flex items-center 2xl:gap-2 gap-[6px]' >
                    <div>
                      <div className='flex items-center 2xl:gap-2 gap-[6px]'>
                        <input type="number" name="totalExperienceYears" placeholder='Years' className=' w-[80px] h-[32px] border border-gray-300  text-center rounded-lg pl-2  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]'
                          {...register("totalExperienceYears", { required: "Total experience in years is required", validate: value => value >= 0 && value <= 100 || "Total experience in years must be between 0 and 100" })}
                        />
                        <span className='text-[12px] text-[#6B6F7B] font-bold' >Years</span>
                      </div>
                      {errors.totalExperienceYears && <span className="error-message" >{errors.totalExperienceYears.message}</span>}
                    </div>
                    <div>
                      <div className='flex items-center 2xl:gap-2 gap-[6px]'>
                        <input type="number" name="totalExperienceMonths" placeholder='Months' className=' w-[80px] h-[32px] border border-gray-300  text-center rounded-lg pl-2  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]'
                          {...register("totalExperienceMonths", { required: "Total experience in months is required", validate: value => value >= 0 && value <= 11 || "Total experience in months must be between 0 and 11" })}
                        />
                        <span className='text-[12px] text-[#6B6F7B] font-bold' >Months</span>
                      </div>
                      {errors.totalExperienceMonths && <span className="error-message" >{errors.totalExperienceMonths.message}</span>}
                    </div>
                  </div>
                </div>
              </li>

              <li className='flex items-center justify-start gap-x-4  '>
                <div className='w-[30%]  flex items-end justify-end'>
                  <label className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold">Interview Experience</label>
                </div>
                <div className='flex-col justify-center items-center w-1/2  '>
                  <div className='flex items-center 2xl:gap-2 gap-[6px]' >
                    <div>
                      <div className='flex items-center 2xl:gap-2 gap-[6px]'>
                        <input type="number" name="interviewExperienceYears" placeholder='Years' className=' w-[80px] h-[32px] border border-gray-300  text-center rounded-lg pl-2  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]'
                          {...register("interviewExperienceYears", { required: "Interview experience in years is required", validate: value => value >= 0 && value <= 100 || "Interview experience in years must be between 0 and 100" })}
                        />
                        <span className='text-[12px] text-[#6B6F7B] font-bold' >Years</span>
                      </div>
                      {errors.interviewExperienceYears && <span className="error-message" >{errors.interviewExperienceYears.message}</span>}
                    </div>
                    <div>
                      <div className='flex items-center 2xl:gap-2 gap-[6px]'>
                        <input type="number" name="interviewExperienceMonths" placeholder='Months' className=' w-[80px] h-[32px] border border-gray-300  text-center rounded-lg pl-2  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]'
                          {...register("interviewExperienceMonths", { required: "Interview experience in months is required", validate: value => value >= 0 && value <= 11 || "Interview experience in months must be between 0 and 11" })}
                        />
                        <span className='text-[12px] text-[#6B6F7B] font-bold' >Months</span>
                      </div>
                      {errors.interviewExperienceMonths && <span className="error-message" >{errors.interviewExperienceMonths.message}</span>}
                    </div>
                  </div>
                </div>
              </li>

            </ul>
          </div>
          <hr className=" h-[2px] rounded-full bg-[#F4F4F4] my-4" />




          {/* main 4 single div use */}

          <div className={'mb-2'}>
            <ul className='grid grid-cols-2 gap-2  pb-0 '>
              <li className='flex items-center gap-x-4 justify-start  '>
                <div className='w-[30%]  flex items-center justify-center  '>
                  <label className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold ">Interview Assigned For</label>
                </div>
                <div className='w-1/2'>
                  <RolesSelect errors={errors} items={items} handleSelection={handleSelection} removeItem={removeItem} className='max-w-[140px] h-[32px] text-[12px]' />
                </div>
              </li>

              <li className='flex items-center justify-start gap-x-4 '>
                <div className='w-[30%]  flex items-center justify-center'>
                  <label className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold">Skills</label>
                </div>
                <div className='w-1/2'>
                  <select
                    name="skills"
                    {...register("skills", {
                      validate: () => itemsSkills.length > 0 || "Please select at least one skill."
                    })}
                    onChange={handleSkillSelection}
                    value={""}
                    className={`w-[140px] h-[32px] text-center text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px] border-[#CAC4D0] ${itemsSkills.length === 0 ? "text-gray-500" : "text-black"}`}
                  >
                    <option value="" disabled>Select Skills</option>
                    <option value="Python">Python</option>
                    <option value="Kafka">Kafka</option>
                    <option value="Java">Java</option>
                    <option value="DSA">DSA</option>
                    <option value="OOPS">OOPS</option>
                  </select>
                  {errors.skills && <span className="error-message" >{errors.skills.message}</span>}
                  <div className=' mt-[8px] w-[300px] gap-x-4'>
                    <ul className='flex flex-wrap justify-start gap-2 items-center ' > {itemsSkills.map((item, index) => (<li key={index} className=" flex justify-center items-center h-[32px] border border-[#49454F] pl-1 pr-1 rounded-lg  text-[#49454F]  "> {item} <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeSkill(item);
                      }}
                      className='pl-2' ><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.8 11.25L0.75 10.2L4.95 6L0.75 1.8L1.8 0.75L6 4.95L10.2 0.75L11.25 1.8L7.05 6L11.25 10.2L10.2 11.25L6 7.05L1.8 11.25Z" fill="#49454F" />
                      </svg>
                    </button> </li>))} </ul>
                  </div>
                </div>
              </li>
            </ul>
          </div>







          {/* main 5 */}

          <ul className='grid grid-cols-2 grid-rows gap-2 '>
            <li className='flex items-center justify-start gap-x-4 '>
              <div className='w-[30%]  flex items-end justify-end'>
                <label className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold">Strength</label>
              </div>
              <div className='w-1/2'>
                <select
                  name="strength"
                  {...register("strength", { required: "Please select a strength." })}
                  onChange={(e) => {
                    hasInteracted.current = true; // Mark as interacted 
                    setSelectedStrength(e.target.value);
                    setValue("strength", e.target.value);
                  }}
                  className={`w-[140px] h-[32px] text-center text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px] border-[#CAC4D0] ${selectedStrength === "" ? "text-gray-500" : "text-black"}`}
                  defaultValue={""}
                >
                  <option value="" disabled>Select Strength</option>
                  {Object.entries(DOMAINS).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
                {errors.strength && <span className="error-message" >{errors.strength.message}</span>}
              </div>
            </li>
          </ul>
          <hr className=" h-[2px] rounded-full bg-[#F4F4F4] my-4" />








          {/* MAIN 6 */}


          <div className='mt-4'>
            <ul className='grid grid-cols-2 gap-2 '>
              <li className='flex items-center justify-start gap-x-4 '>
                <div className='w-[30%]  flex items-end justify-end'>
                  <label className=" w-full text-right text-[12px] text-[#6B6F7B] font-bold">Upload CV</label>
                </div>
                <div className='w-1/2'>
                  <input
                    type="file"
                    name="cv"
                    {...register("cv", { required: "CV is required." })}
                    className="border border-gray-300 rounded-lg text-[12px]"
                  />
                  {errors.cv && <span className="error-message" >{errors.cv.message}</span>}
                </div>
              </li>
            </ul>
          </div>








          {/* Submit Button */}

          <div className='mt-4 flex justify-end mr-10 '>
            <Button disabled={loading} type="submit" sx={{ backgroundColor: "rgb(59, 130, 246)", color: "rgb(255, 255, 255)", borderRadius: "9999px" }} className="px-6 py-2 text-sm font-medium hover:bg-blue-600">
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: "white", // Change this to any color you want
                  }}
                />
              ) : (
                "Save"
              )}
            </Button>
          </div>

        </div>
      </div>
    </form>
  )
}

export { AddInterviewer as InternalAddInterviewer }
