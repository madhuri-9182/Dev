import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { DOMAINS } from '../Constants/constants';
import { debounce } from 'lodash';
import { CircularProgress } from '@mui/material';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import RolesSelect from './Components/RolesSelect';
import MultiSelectFilter from '../../utils/MultiSelectFilter';
import TableLoadingWrapper from '../../utils/TableLoadingWrapper';
import { Edit, Trash } from 'iconsax-react';
import { IoSearchSharp } from "react-icons/io5";
import Modal from '../shared/Modal';

function Interviewer() {
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
  });

  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ results: [] });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    strength: [],
    experience: []
  });

  const [deleteUserId, setDeleteUserId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const navigate = useNavigate();
  // const isFirstRender = useRef(true);
  const { register, handleSubmit, formState: { errors }, reset, setError, clearErrors } = useForm();

  const fetchData = useCallback((page, isMounted = true) => {
    // if (isFirstRender.current) {
    //   isFirstRender.current = false;
    //   return;
    // }
    axios.get(`/api/internal/interviewers/?offset=${(page - 1) * 10}${searchTerm ? `&q=${searchTerm}` : ''}${filters?.strength?.length > 0 ? `&strengths=${filters?.strength?.map((item) => item.value)?.join(",")}` : ""}${filters?.experience?.length > 0 ? `&experiences=${filters?.experience?.map((item) => item.value)?.join(",")}` : ""}`)
      .then(res => {
        if (isMounted) {
          setSummary(prev => ({
            ...prev,
            ...res.data,
            results: page === 1 ? res.data.results : [...prev.results, ...res.data.results],
          }));
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        if (isMounted) {
          setLoading(false);
        }
      });
  }, [filters, searchTerm]);

  const validateRoles = useCallback(() => {
    if (items.length === 0) {
      setError("role", { type: "manual", message: "Please select at least one role." });
    } else {
      clearErrors("role");
    }
  }, [items, setError, clearErrors]);

  useEffect(() => {
    let isMounted = true; // Flag to track if the component is mounted
    setSummary({ results: [] });
    setPage(1);
    setLoading(true);
    fetchData(1, isMounted); // Call fetchData with searchTerm

    return () => {
      isMounted = false; // Set flag to false on cleanup
    };
  }, [searchTerm, filters, fetchData]);

  useEffect(() => {
    const handleScroll = (e) => {
      const tableElement = e.target;
      const bottom = tableElement.scrollHeight - tableElement.scrollTop <= tableElement.clientHeight + 1;

      if (bottom && !loading && summary.next !== null) {
        setPage((prev) => prev + 1);
        setLoading(true);
        fetchData(page + 1);
      }
    };

    const tableElement = document.querySelector('.table-wrapper');
    if (tableElement) {
      tableElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (tableElement) {
        tableElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loading, summary]);

  useEffect(() => {
    // Revalidate role when items change
    validateRoles();
  }, [items, validateRoles]);

  const handleChipClick = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  const handleEditUserSubmit = (data) => {
    const updatedData = {}; // Create an object to hold only changed values

    // Check for changes and add to updatedData
    if (data.name !== editUser.name) updatedData.name = data.name;
    if (data.email !== editUser.email) updatedData.email = data.email;
    if (data.phone !== editUser.phone_number?.slice(3)) updatedData.phone_number = data.phone; // Adjusted to match API
    if (data.experience_years !== editUser.total_experience_years) updatedData.total_experience_years = data.experience_years;
    if (data.experience_months !== editUser.total_experience_months) updatedData.total_experience_months = data.experience_months;
    updatedData.assigned_domain_ids = items.join(",");

    setUpdateLoading(true);
    axios.patch(`/api/internal/interviewer/${editUser.id}/`, updatedData) // Use updatedData instead of data
      .then(() => {
        setSummary({
          results: []
        });
        setPage(1);
        setLoading(true);
        fetchData(1);
        setEditUserOpen(false);
        toast.success("Interviewer updated successfully", { position: "top-right" });
      })
      .catch((error) => {
        if (error?.response?.data?.errors) {
          const errorMessage = Object.values(error?.response?.data?.errors).flat().join(', ');
          toast.error(errorMessage, { position: "top-right" });
        } else {
          toast.error(error?.response?.data?.message, { position: "top-right" });
        }
        console.error("Error updating interviewer:", error);
      }).finally(() => setUpdateLoading(false));
  };

  const handleEditUserOpen = (interviewer) => {
    setEditUserOpen(true);
    setEditUser(interviewer);
    reset({
      name: interviewer.name,
      email: interviewer.email,
      phone: interviewer.phone_number?.slice(3),
      experience_years: interviewer.total_experience_years,
      experience_months: interviewer.total_experience_months,
      role: interviewer.assigned_domains
    });
    setItems(interviewer?.assigned_domains?.map(domain => domain.id) || []);
  };

  const handleEditUserClose = () => setEditUserOpen(false);

  const handleSelection = (value) => {
    const newOption = value;
    if (newOption && !items.includes(newOption.id)) {
      setItems([...items, newOption.id]);
    }
  }

  const removeItem = (ItemToRemove) => {
    setItems(items.filter(item => item !== ItemToRemove))
  }

  const STRENGTHS = [
    { label: "Backend", value: "backend" },
    { label: "Frontend", value: "frontend" },
    { label: "DevOps", value: "devops" },
    { label: "AI/ML", value: "aiml" },
    { label: "Testing", value: "testing" }
  ];

  const EXPERIENCES = [
    { label: "0-4 Years", value: "0-4" },
    { label: "4-8 Years", value: "5-8" },
    { label: "8-10 Years", value: "9-10" },
    { label: "10+ Years", value: "11" },
  ];

  const handleSearchChange = debounce((event) => {
    setSearchTerm(event.target.value);
  }, 1000);

  const downloadExcelReport = () => {
    const worksheet = XLSX.utils.json_to_sheet(summary.results.map(user => ({
      Name: user.name,
      Email: user.email,
      Phone: user.phone_number,
      Strength: DOMAINS[user.strength],
      Languages: user.skills.join(', '),
      Experience: `${user.total_experience_years > 0 ? `${user.total_experience_years} Years ` : ''}${user.total_experience_months > 0 ? `${user.total_experience_months} Months` : ''}`,
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Interviewers');

    // Generate buffer and download
    XLSX.writeFile(workbook, 'Interviewers_Report.xlsx');
  };

  const handleDeleteUser = (id) => {
    setDeleteUserId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    axios.delete(`/api/internal/interviewer/${deleteUserId}/`)
      .then(() => {
        setSummary(prev => ({
          ...prev,
          results: prev.results.filter(user => user.id !== deleteUserId)
        }));
        setDeleteUserId(null);
        setConfirmDeleteOpen(false);
        toast.success("Interviewer deleted successfully", { position: "top-right" });
      })
      .catch((error) => {
        console.error("Error deleting interviewer:", error);
        setConfirmDeleteOpen(false);
      });
  };

  const cancelDelete = () => {
    setDeleteUserId(null);
    setConfirmDeleteOpen(false);
  };

  return (
    <div className='p-6 pt-0 pl-0 text-[14px]'>
      <div className='w-full h-full flex flex-col items-center'>
        <div className='w-full flex pb-[12px] pr-3 justify-end space-x-4'>
          <div className='w-[466px] flex justify-around items-center border border-[#F4F4F4] bg-[#F4F4F4] rounded-[28px] pr-1 pl-1 focus-within:border-blue-700'>
            <input
              className='w-[358px] ml-1 text-[#979DA3] bg-[#F4F4F4] border-none focus:outline-none text-xs' type="text"
              placeholder='Search interviewer by Name, Email & Mobile Number'
              onChange={handleSearchChange}
            />
            <IoSearchSharp className="text-[#49454F]" />
          </div>
          <button className='primary-button h-[32px]' onClick={() => navigate("/internal/interviewer/addinterviewer")}>+ Add Interviewers</button>
        </div>
        <div className='w-full h-[104px] grid grid-cols-[1fr_1fr_1fr_1fr_1fr] 2xl:gap-x-7 gap-x-4 justify-between items-center p-2'>
          <div className='flex flex-col justify-center items-start p-4 pl-[15%] bg-[#E5ECF6] rounded-[16px]'>
            <span className='font-normal text-2xs'>Total Interviewers</span>
            <span className='text-[20px]'>{summary.total_interviewers || 0}</span>
          </div>
          <div className='flex flex-col justify-center items-start p-4 pl-[15%] bg-[#E5ECF6] rounded-[16px]'>
            <span className='font-normal text-2xs'>0-4 Years</span>
            <span className='text-[20px]'>{summary.years_0_4 || 0}</span>
          </div>
          <div className='flex flex-col justify-center items-start p-4 pl-[15%] bg-[#E5ECF6] rounded-[16px]'>
            <span className='font-normal text-2xs'>4-8 Years</span>
            <span className='text-[20px]'>{summary.years_5_8 || 0}</span>
          </div>
          <div className='flex flex-col justify-center items-start p-4 pl-[15%] bg-[#E5ECF6] rounded-[16px]'>
            <span className='font-normal text-2xs'>8-10 Years</span>
            <span className='text-[20px]'>{summary.years_9_10 || 0}</span>
          </div>
          <div className='flex flex-col justify-center items-start p-4 pl-[15%] bg-[#E5ECF6] rounded-[16px]'>
            <span className='font-normal text-2xs'>10+ Years</span>
            <span className='text-[20px]'>{summary.years_11 || 0}</span>
          </div>
        </div>
        <div className='w-full flex flex-col p-2 mt-1 mb-1'>
          <div className='flex justify-between'>
            <div className="flex items-center space-x-4 p-1">
              <div className="flex flex-wrap gap-y-2 gap-x-4">
                {/*Strength Filter */}
                <MultiSelectFilter label='Strength' options={STRENGTHS} filter_state_name="strength" current_value={filters?.strength} handleChipClick={handleChipClick} />

                {/* Experience Filter */}
                <MultiSelectFilter label='Experience' options={EXPERIENCES} filter_state_name="experience" current_value={filters?.experience} handleChipClick={handleChipClick} />
              </div>
            </div>
            <div className='flex gap-2 justify-center items-center font-bold'>
              <svg className='min-w-[18px]' width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.49996 18.3332H12.5C16.6666 18.3332 18.3333 16.6665 18.3333 12.4998V7.49984C18.3333 3.33317 16.6666 1.6665 12.5 1.6665H7.49996C3.33329 1.6665 1.66663 3.33317 1.66663 7.49984V12.4998C1.66663 16.6665 3.33329 18.3332 7.49996 18.3332Z" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.5 9.59131L10 12.0913L12.5 9.59131" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 12.0915V5.4248" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 13.7583C8.24167 14.8416 11.7583 14.8416 15 13.7583" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <button className='min-w-max text-xs' onClick={downloadExcelReport}>Download Report</button>
            </div>
          </div>
        </div>

        {/* User Table */}
        <TableLoadingWrapper loading={loading} data={summary?.results} >
          <div className="w-full mt-5 table-wrapper h-[355px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-black text-xs font-semibold text-[#2B313E]">
                  <th className="py-2 px-4">USERS</th>
                  <th className="py-2 px-4">EMAIL ID</th>
                  <th className="py-2 px-4">PHONE NO</th>
                  <th className="py-2 px-4">STRENGTH</th>
                  <th className="py-2 px-4">LANGUAGES</th>
                  <th className="py-2 px-4">EXPERIENCE</th>
                  <th className="py-2 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {summary?.results?.map((user, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? '' : 'bg-[#FFF8E0]'
                      } h-[80px] border-b-2 text-xs`}
                  >
                    <td className="py-3 px-4 font-semibold">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.phone_number}</td>
                    <td className="py-3 px-4">{DOMAINS[user.strength]}</td>
                    <td className="py-3 px-4">{user.skills.join(', ')}</td>
                    <td className="py-3 px-4">{`${user.total_experience_years > 0 && `${user.total_experience_years} Years `}${user.total_experience_months > 0 && `${user.total_experience_months} Months`}`}</td>
                    <td className="py-3 px-4">
                      <div className='w-full flex items-center gap-2'>
                        <Edit
                          size={16}
                          color="#171717"
                          className="hover:scale-110 hover:duration-150 cursor-pointer"
                          onClick={() => {
                            handleEditUserOpen(user)
                          }}
                        />

                        <Trash
                          size={16}
                          color="#F00"
                          className="hover:scale-110 hover:duration-150 cursor-pointer"
                          onClick={() => {
                            handleDeleteUser(user.id);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableLoadingWrapper>

        {/* Edit User Dialog */}
        <Modal isOpen={editUserOpen} onClose={handleEditUserClose} title="EDIT INTERVIEWER" className='w-[515px]' >
          <form onSubmit={(e) => {
            handleSubmit(handleEditUserSubmit)(e);
            validateRoles();
          }}>
            <div className="w-full flex-col flex items-center justify-center custom_lg:gap-2 md:gap-y-0">
              <div className="p-1 flex flex-col items-start w-full">
                <label className="w-1/4 text-[12px] font-medium text-gray-600 required-field-label">Name</label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  {...register("name", { required: "Name is required", maxLength: { value: 255, message: "Name must be less than 255 characters" } })}
                  className={`p-1 text-[12px] w-full border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <span className="error-message">{errors.name.message}</span>}
              </div>
              <div className="p-1 flex flex-col items-start w-full">
                <label className="w-1/4 text-[12px] font-medium text-[#6B6F7B] required-field-label">Mail ID</label>
                <input
                  type="email"
                  placeholder="Enter Mail ID"
                  {...register("email", { required: "Email is required" })}
                  className={`w-full p-1 text-[12px] border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <span className="error-message">{errors.email.message}</span>}
              </div>
              <div className="p-1 flex flex-col items-start w-full">
                <label className="w-full font-medium text-[#6B6F7B] text-[12px] required-field-label">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter number"
                  {...register("phone", { required: "Phone number is required" })}
                  className={`w-full p-1 text-[12px] border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && <span className="error-message">{errors.phone.message}</span>}
              </div>
              <div className="p-1 flex flex-col items-start w-full">
                <label className="w-full font-medium text-[#6B6F7B] text-[12px] required-field-label">Total Experience</label>
                <div className='flex items-center 2xl:gap-2 w-full justify-between' >
                  <div>
                    <div className='flex items-center 2xl:gap-2 gap-[6px]'>
                      <input type="number" name="experience_years" placeholder='Years' className='w-[185px] h-[29.6px] border border-gray-300  text-center rounded-lg pl-2  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]'
                        {...register("experience_years", { required: "Total experience in years is required", validate: value => value >= 0 && value <= 100 || "Total experience in years must be between 0 and 100" })}
                      />
                      <span className="font-medium text-[#6B6F7B] text-[12px]" >Years</span>
                    </div>
                    {errors.experience_years && <span className="error-message" >{errors.experience_years.message}</span>}
                  </div>
                  <div>
                    <div className='flex items-center 2xl:gap-2 gap-[6px]'>
                      <input type="number" name="experience_months" placeholder='Months' className='w-[185px] h-[29.6px] border border-gray-300  text-center rounded-lg pl-2  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]'
                        {...register("experience_months", { required: "Total experience in months is required", validate: value => value >= 0 && value <= 11 || "Total experience in months must be between 0 and 11" })}
                      />
                      <span className="font-medium text-[#6B6F7B] text-[12px]" >Months</span>
                    </div>
                    {errors.experience_months && <span className="error-message" >{errors.experience_months.message}</span>}
                  </div>
                </div>
              </div>
              <div className="p-1 flex flex-col items-start w-full">
                <label className="w-full font-medium text-[#6B6F7B] text-[12px] required-field-label">Job Assigned</label>
                <RolesSelect className='w-full h-[29.6px] text-[12px]' dropdownClassName='text-xs' errors={errors} items={items} handleSelection={handleSelection} removeItem={removeItem} />
              </div>
            </div>
            <div className='flex flex-row-reverse mt-2' >
              <button disabled={updateLoading} type="submit" className="primary-button">
                {updateLoading ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: "white", // Change this to any color you want
                    }}
                  />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </Modal>

        {/* Confirmation Dialog */}
        <Modal isOpen={confirmDeleteOpen} onClose={cancelDelete} title="Confirm Deletion" >
          <p>Are you sure you want to delete this Interviewer?</p>
          <div className='flex justify-end mt-2 gap-2' >
          <button onClick={cancelDelete} className="secondary-button">
            Cancel
          </button>
          <button onClick={confirmDelete} className="primary-button">
            Confirm
          </button>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export { Interviewer as InternalInterviewer }
