import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import axios from '../../api/axios';
import { DOMAINS } from '../Constants/constants';
import { debounce } from 'lodash';
import { Button, CircularProgress, TableCell, TableRow } from '@mui/material';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import RolesSelect from './Components/RolesSelect';
import MultiSelectFilter from '../../utils/MultiSelectFilter';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialog-paper': {
    width: '515px', // Customize width as needed
  },
}));

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

  const { register, handleSubmit, formState: { errors }, reset, trigger } = useForm();

  // Debounced function to fetch data
  const fetchData = useCallback(debounce((page, isMounted = true) => {
    setLoading(true);
    axios.get(`/api/internal/interviewers/?offset=${(page - 1) * 10}${searchTerm ? `&q=${searchTerm}` : ''}${filters?.strength?.length > 0 ? `&strength=${filters?.strength?.map((item) => item.value)?.join(",")}` : ""}${filters?.experience?.length > 0 ? `&experience=${filters?.experience?.map((item) => item.value)?.join(",")}` : ""}`)
      .then(res => {
        if (isMounted) {
          setSummary(prev => ({
            ...prev,
            ...res.data,
            results: res?.data?.results?.length > 0 ? [...prev.results, ...res.data.results] : [],
          }));
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        if (isMounted) {
          setLoading(false);
        }
      });
  }, 1000), [filters, searchTerm]);

  useEffect(() => {
    let isMounted = true; // Flag to track if the component is mounted
    setSummary({ results: [] });
    setPage(1);
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
    trigger("role"); // Trigger validation
  }, [items, trigger]);

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

  const handleSelection = (e) => {
    const newOption = e.target.value;
    if (newOption && !items.includes(newOption)) {
      setItems([...items, newOption]);
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Reset scroll position if needed
    const tableElement = document.querySelector('.table-wrapper');
    if (tableElement) {
      tableElement.scrollTop = 0; // Reset scroll position
    }
  };

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
          <div className='w-[466px] h-[40px] flex justify-around items-center border border-[#F4F4F4] bg-[#F4F4F4] rounded-[28px] pr-1 pl-1 focus-within:border-blue-700'>
            <input
              className='w-[358px] h-[36px] ml-1 text-[#979DA3] bg-[#F4F4F4] border-none focus:outline-none' type="text"
              placeholder='Search interviewer by Name, Email & Mobile Number'
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
            </button>
          </div>
          <div className='w-[171px] h-[40px] text-[14px] flex justify-center items-center bg-[#007AFF] border-0 rounded-[100px] text-[#FFFFFF] font-medium'>
            <Link to="/internal/addinterviewer">
              + Add Interviewers</Link>
          </div>
        </div>
        <div className='w-full h-[104px] grid grid-cols-[1fr_1fr_1fr_1fr_1fr] 2xl:gap-x-7 gap-x-4 justify-between items-center p-2'>
          <div className='flex flex-col justify-center items-start p-4 pl-[15%] bg-[#E5ECF6] rounded-[16px]'>
            <span className='font-normal'>Total Interviewers</span>
            <span className='font-semibold text-[24px]'>{summary.total_interviewers}</span>
          </div>
          <div className='flex flex-col justify-center items-start p-4 pl-[15%] bg-[#E5ECF6] rounded-[16px]'>
            <span className='font-normal'>0-4 Years</span>
            <span className='font-semibold text-[24px]'>{summary.years_0_4}</span>
          </div>
          <div className='flex flex-col justify-center items-start p-4 pl-[15%] bg-[#E5ECF6] rounded-[16px]'>
            <span className='font-normal'>4-8 Years</span>
            <span className='font-semibold text-[24px]'>{summary.years_5_8}</span>
          </div>
          <div className='flex flex-col justify-center items-start p-4 pl-[15%] bg-[#E5ECF6] rounded-[16px]'>
            <span className='font-normal'>8-10 Years</span>
            <span className='font-semibold text-[24px]'>{summary.years_9_10}</span>
          </div>
          <div className='flex flex-col justify-center items-start p-4 pl-[15%] bg-[#E5ECF6] rounded-[16px]'>
            <span className='font-normal'>10+ Years</span>
            <span className='font-semibold text-[24px]'>{summary.years_11}</span>
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
              <svg className='min-w-[20px]' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.49996 18.3332H12.5C16.6666 18.3332 18.3333 16.6665 18.3333 12.4998V7.49984C18.3333 3.33317 16.6666 1.6665 12.5 1.6665H7.49996C3.33329 1.6665 1.66663 3.33317 1.66663 7.49984V12.4998C1.66663 16.6665 3.33329 18.3332 7.49996 18.3332Z" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.5 9.59131L10 12.0913L12.5 9.59131" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 12.0915V5.4248" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 13.7583C8.24167 14.8416 11.7583 14.8416 15 13.7583" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <button className='min-w-max' onClick={downloadExcelReport}>Download Report</button>
            </div>
          </div>
        </div>

        {/* User Table */}
        {summary?.results?.length > 0 ? <div className="w-full mt-5 table-wrapper h-[355px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-black text-sm font-semibold text-[#2B313E]">
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
                    } h-[80px] border-b-2`}
                >
                  <td className="py-3 px-4 font-semibold text-sm">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.phone_number}</td>
                  <td className="py-3 px-4">{DOMAINS[user.strength]}</td>
                  <td className="py-3 px-4">{user.skills.join(', ')}</td>
                  <td className="py-3 px-4">{`${user.total_experience_years > 0 && `${user.total_experience_years} Years `}${user.total_experience_months > 0 && `${user.total_experience_months} Months`}`}</td>
                  <td className="py-3 px-4">
                    <div className='w-full flex items-center justify-between'>
                      <button
                        className="hover:scale-110 hover:duration-150"
                        onClick={() => { handleEditUserOpen(user) }}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.1665 1.6665H7.49984C3.33317 1.6665 1.6665 3.33317 1.6665 7.49984V12.4998C1.6665 16.6665 3.33317 18.3332 7.49984 18.3332H12.4998C16.6665 18.3332 18.3332 16.6665 18.3332 12.4998V10.8332" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M13.3666 2.51688L6.7999 9.08354C6.5499 9.33354 6.2999 9.82521 6.2499 10.1835L5.89157 12.6919C5.75823 13.6002 6.3999 14.2335 7.30823 14.1085L9.81657 13.7502C10.1666 13.7002 10.6582 13.4502 10.9166 13.2002L17.4832 6.63354C18.6166 5.50021 19.1499 4.18354 17.4832 2.51688C15.8166 0.850211 14.4999 1.38354 13.3666 2.51688Z" stroke="#171717" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12.4248 3.4585C12.9831 5.45016 14.5415 7.0085 16.5415 7.57516" stroke="#171717" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>

                      <button className='hover:scale-110 hover:duration-150' onClick={() => handleDeleteUser(user.id)}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.5 4.98356C14.725 4.70856 11.9333 4.56689 9.15 4.56689C7.5 4.56689 5.85 4.65023 4.2 4.81689L2.5 4.98356" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M7.0835 4.1415L7.26683 3.04984C7.40016 2.25817 7.50016 1.6665 8.9085 1.6665H11.0918C12.5002 1.6665 12.6085 2.2915 12.7335 3.05817L12.9168 4.1415" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M15.7082 7.6167L15.1665 16.0084C15.0748 17.3167 14.9998 18.3334 12.6748 18.3334H7.32484C4.99984 18.3334 4.92484 17.3167 4.83317 16.0084L4.2915 7.6167" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M8.6084 13.75H11.3834" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M7.9165 10.4165H12.0832" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> : <TableRow>
          <TableCell colSpan={5} align='center'>
            No Data Found
          </TableCell>
        </TableRow>}
        {/* Loading Component */}
        {loading && (
          <div className={`flex justify-center items-center ${summary?.results?.length === 0 ? "h-[45vh]" : "h-[10vh]"}`}>
            <CircularProgress />
          </div>
        )}
        {/* Edit User Dialog */}
        <BootstrapDialog
          onClose={handleEditUserClose}
          aria-labelledby="edit-user-dialog-title"
          open={editUserOpen}
          BackdropProps={{
            sx: { backgroundColor: 'rgba(255, 255, 255, 0.8)' },
          }}
        >
          <DialogTitle id="edit-user-dialog-title" sx={{ m: 0, p: 2 }}>
            <h1 className="font-bold text-[#056DDC] text-lg text-center">EDIT INTERVIEWER</h1>
            <IconButton
              aria-label="close"
              onClick={handleEditUserClose}
              sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <form onSubmit={handleSubmit(handleEditUserSubmit)}>
            <DialogContent dividers>
              <div className="w-full flex-col flex items-center justify-center custom_lg:gap-2 md:gap-y-0">
                <div className="p-1 flex flex-col items-start custom_lg:gap-2 md:gap-0 w-full">
                  <label className="w-1/4 text-sm font-medium text-gray-600">Name</label>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    {...register("name", { required: "Name is required" })}
                    className={`p-1 text-sm w-full border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && <span className="error-message">{errors.name.message}</span>}
                </div>
                <div className="p-1 flex flex-col items-start custom_lg:gap-2 md:gap-0 w-full">
                  <label className="w-1/4 text-sm font-medium text-[#6B6F7B]">Mail ID</label>
                  <input
                    type="email"
                    placeholder="Enter Mail ID"
                    {...register("email", { required: "Email is required" })}
                    className={`w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <span className="error-message">{errors.email.message}</span>}
                </div>
                <div className="p-1 flex flex-col items-start custom_lg:gap-2 md:gap-0 w-full">
                  <label className="w-full text-sm font-medium text-[#6B6F7B]">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter number"
                    {...register("phone", { required: "Phone number is required" })}
                    className={`w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
                  />
                  {errors.phone && <span className="error-message">{errors.phone.message}</span>}
                </div>
                <div className="p-1 flex flex-col items-start custom_lg:gap-2 md:gap-0 w-full">
                  <label className="w-full text-sm font-medium text-[#6B6F7B]">Total Experience</label>
                  <div className='flex items-center 2xl:gap-2 w-full justify-between' >
                    <div>
                      <div className='flex items-center 2xl:gap-2 gap-[6px]'>
                        <input type="number" name="experience_years" placeholder='Years' className='w-[160px] h-[29.6px] border border-gray-300  text-center rounded-lg pl-2  focus:outline-none focus:ring-2 focus:ring-blue-500'
                          {...register("experience_years", { required: "Total experience in years is required", validate: value => value >= 0 && value <= 100 || "Total experience in years must be between 0 and 100" })}
                        />
                        <span>Years</span>
                      </div>
                      {errors.experience_years && <span className="error-message" >{errors.experience_years.message}</span>}
                    </div>
                    <div>
                      <div className='flex items-center 2xl:gap-2 gap-[6px]'>
                        <input type="number" name="experience_months" placeholder='Months' className='w-[160px] h-[29.6px] border border-gray-300  text-center rounded-lg pl-2  focus:outline-none focus:ring-2 focus:ring-blue-500'
                          {...register("experience_months", { required: "Total experience in months is required", validate: value => value >= 0 && value <= 11 || "Total experience in months must be between 0 and 11" })}
                        />
                        <span>Months</span>
                      </div>
                      {errors.experience_months && <span className="error-message" >{errors.experience_months.message}</span>}
                    </div>
                  </div>
                </div>
                <div className="p-1 flex flex-col items-start custom_lg:gap-2 md:gap-0 w-full">
                  <label className="w-full text-sm font-medium text-[#6B6F7B]">Job Assigned</label>
                  <RolesSelect className='w-full h-[29.6px]' register={register} errors={errors} items={items} handleSelection={handleSelection} removeItem={removeItem} />
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button disabled={updateLoading} type="submit" sx={{ backgroundColor: "rgb(59, 130, 246)", color: "rgb(255, 255, 255)", borderRadius: "9999px" }} className="px-6 py-2 text-sm font-medium hover:bg-blue-600">
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
              </Button>
            </DialogActions>
          </form>
        </BootstrapDialog>

        {/* Confirmation Dialog */}
        <BootstrapDialog
          onClose={cancelDelete}
          aria-labelledby="confirm-delete-dialog-title"
          open={confirmDeleteOpen}
          BackdropProps={{
            sx: { backgroundColor: 'rgba(255, 255, 255, 0.8)' },
          }}
        >
          <DialogTitle id="confirm-delete-dialog-title" sx={{ m: 0, p: 2 }}>
            <h1 className="font-bold text-[#056DDC] text-lg text-center">Confirm Deletion</h1>
          </DialogTitle>
          <DialogContent dividers>
            <p>Are you sure you want to delete this Interviewer?</p>
          </DialogContent>
          <DialogActions>
            <button onClick={cancelDelete} className="text-[#4A4459] border py-1 px-3 rounded-full bg-[#E8DEF8]">
              Cancel
            </button>
            <button onClick={confirmDelete} className="text-white border py-1 px-3 rounded-full bg-[#056DDC]">
              Confirm
            </button>
          </DialogActions>
        </BootstrapDialog>
      </div>
    </div>
  )
}

export { Interviewer as InternalInterviewer }
