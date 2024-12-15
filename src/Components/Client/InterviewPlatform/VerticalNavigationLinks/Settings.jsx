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
    name:"",
    email:""
  });

  const handleAddUserOpen = () => setAddUserOpen(true);
  const handleAddUserClose = () => setAddUserOpen(false);

  const handleEditUserOpen = (name, email) => {
    setEditUserOpen(true)
    setEditUser({ name, email })
  };
  const handleEditUserClose = () => setEditUserOpen(false);

  return (
    <div>
      {/* Add User Button */}
      <div className="w-full flex items-center justify-end">
        <button
          className="border p-1 px-4 rounded-full bg-[#056DDC] font-medium text-white"
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
          <div className="w-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center max-w-max gap-y-1">
              <BasicInputTextField label="Name" placeholder="Enter your name" width="360px" />
              <BasicInputTextField label="Email ID" placeholder="Enter your Email ID" width="360px" />
              <BasicInputTextField label="User Type" placeholder="Enter user type" width="360px" />
              <CheckboxesTags
                label="Job Assigned"
                placeholder="Select Job"
                values={[
                  { title: 'SDE III' },
                  { title: 'PE' },
                  { title: 'SDE II' },
                  { title: 'DevOps I' },
                  { title: 'EM' },
                  { title: 'SDET II' },
                  { title: 'SDET I' },
                ]}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleAddUserClose}
            className="text-white border py-1 px-3 rounded-full bg-[#056DDC]"
          >
            SAVE
          </button>
        </DialogActions>
      </BootstrapDialog>

      {/* User Table */}
      <div className="w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-black text-sm font-semibold text-[#2B313E] text-center">
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
                className={`${index % 2 === 0 ? 'hover:bg-[#f2f2f2]' : 'bg-[#FFF8E0] hover:bg-[#ffedb3]'
                  } h-[80px] text-center`}
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
          <div className="w-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center max-w-max gap-y-1">
              <BasicInputTextField label="Name" placeholder="Enter your name" value={editUser.name} width="360px" />
              <BasicInputTextField label="Email ID" placeholder="Enter your Email ID" value={editUser.email} width="360px" />
              <BasicInputTextField label="User Type" placeholder="Enter user type" width="360px" />
              <CheckboxesTags
                label="Job Assigned"
                placeholder="Select Job"
                values={[
                  { title: 'SDE III' },
                  { title: 'PE' },
                  { title: 'SDE II' },
                  { title: 'DevOps I' },
                  { title: 'EM' },
                  { title: 'SDET II' },
                  { title: 'SDET I' },
                ]}
              />
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
