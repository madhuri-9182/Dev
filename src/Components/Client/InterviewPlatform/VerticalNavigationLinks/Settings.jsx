import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import BasicInputTextField from '../../../../utils/BasicInputTextField';
import CheckboxesTags from '../../../../utils/CheckboxesTags';

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

function Settings() {
  const data = [
    { name: 'Ashok Samal', email: '123@gmail.com', phone: 1234567890, strength: 'SQL', language: 'Java', experience: 23 },
    { name: 'Sudeep', email: '234@gmail.com', phone: 1234567890, strength: 'SQL', language: 'Java', experience: 23 },
    { name: 'Roshan', email: '345@gmail.com', phone: 1234567890, strength: 'SQL', language: 'Java', experience: 23 },
    { name: 'Richa', email: '123@gmail.com', phone: 1234567890, strength: 'SQL', language: 'Java', experience: 23 },
    { name: 'Ruchi', email: '234@gmail.com', phone: 1234567890, strength: 'SQL', language: 'Java', experience: 23 },
    { name: 'Sam Johnson', email: '345@gmail.com', phone: 1234567890, strength: 'SQL', language: 'Java', experience: 23 },
  ];


  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editUser, setEditUser] = useState({
    name: "",
    email: ""
  });
  const [selectedOption, setSelectedOption] = useState('');
  const [items, setItems] = useState([]);

  const handleAddUserOpen = () => setAddUserOpen(true);
  const handleAddUserClose = () => setAddUserOpen(false);

  const handleEditUserOpen = (name, email) => {
    setEditUserOpen(true)
    setEditUser({ name, email })
  };
  const handleEditUserClose = () => setEditUserOpen(false);

  const handleSelection = (e) => {
    const selectedRole = e.target.value;

    if (selectedRole && !items.includes(selectedRole)) {
      setItems([...items, selectedRole]);
      setSelectedOption("");
    }
  }
  const removeItem = (ItemToRemove) => {
    console.log("hii remove clicked");

    setItems(items.filter(item => item !== ItemToRemove))
  }

  return (
    <div>
      {/* Add User Button */}
      <div className="w-full flex items-center justify-end">
        <button
          className="border p-1 px-4 rounded-full bg-[#056DDC] text-sm font-medium text-white"
          onClick={handleAddUserOpen}
        >
          + Add User
        </button>
      </div>

      {/* Add User Dialog */}
      <BootstrapDialog
        onClose={handleAddUserClose}
        aria-labelledby="add-user-dialog-title"
        open={addUserOpen}
        BackdropProps={{
          sx: { backgroundColor: 'rgba(255, 255, 255, 0.8)' },
        }}
      >
        <DialogTitle id="add-user-dialog-title" sx={{ m: 0, p: 2 }}>
          <h1 className="font-bold text-[#056DDC] text-lg text-center">ADD USER</h1>
          <IconButton
            aria-label="close"
            onClick={handleAddUserClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <div className=" w-full flex-col flex items-center justify-center custom_lg:gap-2 md:gap-y-0 ">
            <div className="p-1 flex flex-col items-start custom_lg:gap-2 md:gap-0 w-full">
              <label className="w-1/4 text-sm font-medium text-gray-600">Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                className="p-1 text-sm w-full border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="p-1 flex flex-col items-start custom_lg:gap-2 md:gap-0 w-full">
              <label className="w-1/4 text-sm font-medium text-[#6B6F7B]">Mail ID</label>
              <input
                type="mail"
                placeholder="Enter Mail ID"
                className="w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="p-1 flex flex-col items-start custom_lg:gap-2 md:gap-0 w-full">
              <label className="w-full text-sm font-medium text-[#6B6F7B]">User Type</label>
              <input
                type="text"
                placeholder="Enter User Type"
                className="w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="p-1 flex flex-col items-start custom_lg:gap-2 md:gap-0 w-full">
              <label className="w-full text-sm font-medium text-[#6B6F7B]">Job Assigned</label>
              <select
                onChange={handleSelection}
                value={selectedOption}
                className={`w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${items.length === 0 ? "text-gray-500" : "text-black"} `}>
                <option value="" disabled>Select Roles</option>
                <option value="EM">EM</option>
                <option value="PM">PM</option>
                <option value="SDE II">SDE II</option>
                <option value="SDE III">SDE III</option>
                <option value="SDE IV">SDE IV</option>
              </select>
            </div>



            
            <div className='w-1/2 flex items-center justify-start '>
                    <div className='w-[300px]  gap-x-4'>
                      <ul className='flex flex-wrap justify-start gap-4 items-center ' > {items.map((item, index) => (<li key={index} className=" flex justify-center items-center h-[32px] border border-[#49454F] pl-1 pr-1 rounded-lg  text-[#49454F]  "> {item} <button
                        onClick={() => removeItem(item)}
                        className='pl-2' ><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.8 11.25L0.75 10.2L4.95 6L0.75 1.8L1.8 0.75L6 4.95L10.2 0.75L11.25 1.8L7.05 6L11.25 10.2L10.2 11.25L6 7.05L1.8 11.25Z" fill="#49454F" />
                        </svg>
                      </button> </li>))} </ul>
                    </div>
                  </div>














































          </div>
        </DialogContent>
        <DialogActions>
        <button
            onClick={handleAddUserClose}
            className="text-[#4A4459] border py-1 px-3 rounded-full bg-[#E8DEF8]"
          >
            Delete
          </button>
          <button
            onClick={handleAddUserClose}
            className="text-white border py-1 px-3 rounded-full bg-[#056DDC]"
          >
            Save
          </button>
        </DialogActions>
      </BootstrapDialog>

      {/* User Table */}
      <div className="w-full mt-5">
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
            {data.map((user, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? '' : 'bg-[#FFF8E0]'
                  } h-[80px] border-b-2`}
              >
                <td className="py-3 px-4 font-semibold text-sm">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.phone}</td>
                <td className="py-3 px-4">{user.strength}</td>
                <td className="py-3 px-4">{user.language}</td>
                <td className="py-3 px-4">{user.experience}</td>
                <td className="py-3 px-4">
                  <div className='w-full flex items-center justify-between'>


                    <button
                      className="hover:scale-110 hover:duration-150"
                      onClick={() => { handleEditUserOpen(user.name, user.email) }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.1665 1.6665H7.49984C3.33317 1.6665 1.6665 3.33317 1.6665 7.49984V12.4998C1.6665 16.6665 3.33317 18.3332 7.49984 18.3332H12.4998C16.6665 18.3332 18.3332 16.6665 18.3332 12.4998V10.8332" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M13.3666 2.51688L6.7999 9.08354C6.5499 9.33354 6.2999 9.82521 6.2499 10.1835L5.89157 12.6919C5.75823 13.6002 6.3999 14.2335 7.30823 14.1085L9.81657 13.7502C10.1666 13.7002 10.6582 13.4502 10.9166 13.2002L17.4832 6.63354C18.6166 5.50021 19.1499 4.18354 17.4832 2.51688C15.8166 0.850211 14.4999 1.38354 13.3666 2.51688Z" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M12.4248 3.4585C12.9831 5.45016 14.5415 7.0085 16.5415 7.57516" stroke="#171717" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>

                    </button>

                    <button className='hover:scale-110 hover:duration-150'>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5 4.98356C14.725 4.70856 11.9333 4.56689 9.15 4.56689C7.5 4.56689 5.85 4.65023 4.2 4.81689L2.5 4.98356" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M7.0835 4.1415L7.26683 3.04984C7.40016 2.25817 7.50016 1.6665 8.9085 1.6665H11.0918C12.5002 1.6665 12.6085 2.2915 12.7335 3.05817L12.9168 4.1415" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M15.7082 7.6167L15.1665 16.0084C15.0748 17.3167 14.9998 18.3334 12.6748 18.3334H7.32484C4.99984 18.3334 4.92484 17.3167 4.83317 16.0084L4.2915 7.6167" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8.6084 13.75H11.3834" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M7.9165 10.4165H12.0832" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>

                    </button>
                  </div>
                </td>
                
              </tr>
            ))}
           
          </tbody>
        </table>
      </div>

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
          <h1 className="font-bold text-[#056DDC] text-lg text-center">EDIT USER</h1>
          <IconButton
            aria-label="close"
            onClick={handleEditUserClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
        <div className=" w-full flex-col flex items-center justify-center custom_lg:gap-2 md:gap-y-0 ">
            <div className="p-1 flex flex-col items-start custom_lg:gap-2 md:gap-0 w-full">
              <label className="w-1/4 text-sm font-medium text-gray-600">Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                value={editUser.name}
                className="p-1 text-sm w-full border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="p-1 flex flex-col items-start custom_lg:gap-2 md:gap-0 w-full">
              <label className="w-1/4 text-sm font-medium text-[#6B6F7B]">Mail ID</label>
              <input
                type="mail"
                placeholder="Enter Mail ID"
                value={editUser.email}
                className="w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="p-1 flex flex-col items-start custom_lg:gap-2 md:gap-0 w-full">
              <label className="w-full text-sm font-medium text-[#6B6F7B]">User Type</label>
              <input
                type="text"
                placeholder="Enter User Type"
                className="w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="p-1 flex flex-col items-start custom_lg:gap-2 md:gap-0 w-full">
              <label className="w-full text-sm font-medium text-[#6B6F7B]">Job Assigned</label>
              <select
                onChange={handleSelection}
                value={selectedOption}
                className={`w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${items.length === 0 ? "text-gray-500" : "text-black"} `}>
                <option value="" disabled>Select Roles</option>
                <option value="EM">EM</option>
                <option value="PM">PM</option>
                <option value="SDE II">SDE II</option>
                <option value="SDE III">SDE III</option>
                <option value="SDE IV">SDE IV</option>
              </select>
            </div>



            
            <div className='w-1/2 flex items-center justify-start '>
                    <div className='w-[300px]  gap-x-4'>
                      <ul className='flex flex-wrap justify-start gap-4 items-center ' > {items.map((item, index) => (<li key={index} className=" flex justify-center items-center h-[32px] border border-[#49454F] pl-1 pr-1 rounded-lg  text-[#49454F]  "> {item} <button
                        onClick={() => removeItem(item)}
                        className='pl-2' ><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.8 11.25L0.75 10.2L4.95 6L0.75 1.8L1.8 0.75L6 4.95L10.2 0.75L11.25 1.8L7.05 6L11.25 10.2L10.2 11.25L6 7.05L1.8 11.25Z" fill="#49454F" />
                        </svg>
                      </button> </li>))} </ul>
                    </div>
                  </div>














































          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleEditUserClose}
            className="text-white border py-1 px-3 rounded-full bg-[#056DDC]"
          >
            SAVE
          </button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

export default Settings;
