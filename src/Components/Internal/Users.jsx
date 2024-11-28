import React from "react";
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialog-paper': {
    width: '600px', // You can customize this value to whatever you need
    maxWidth: '80%', // Ensure it doesn't exceed 80% of the screen width
  },
}));


function Users() {
  const [showAll, setShowAll] = useState(false); // State to toggle visibility
  const [hdipShowAll, setHdipShowAll] = useState(false)
  const data = [
    { name: "Sudeep Pradhan", role: "Admin", mail: "firstname.lastname@abcdef.com", phone: "1234567890", domain: "Ecommerce", client: "Phonepe", access: "Access" },
    { name: "Sandy Pradhan", role: "User", mail: "sandy.pradhan@abcdef.com", phone: "5234567898", domain: "Healthcare", client: "Client 2", access: "Read" },
    { name: "S Samal", role: "User", mail: "ssamal@abcdef.com", phone: "3334567894", domain: "Education", client: "Client 3", access: "Write" },
    { name: "Daniel Smith", role: "User", mail: "daniel.smith@abcdef.com", phone: "5435567892", domain: "Finance", client: "Client 4", access: "Read" },
    { name: "Alice Johnson", role: "Admin", mail: "alice.johnson@abcdef.com", phone: "6545678901", domain: "Marketing", client: "Client 5", access: "Write" },
    { name: "Bob Lee", role: "User", mail: "bob.lee@abcdef.com", phone: "7656789012", domain: "Retail", client: "Client 6", access: "Read" },
    { name: "Charlie Brown", role: "Admin", mail: "charlie.brown@abcdef.com", phone: "8767890123", domain: "Technology", client: "Client 7", access: "Access" },
  ];
  const data2 = [
    { name: "John Doe", role: "Admin", mail: "john.doe@xyz.com", phone: "9876543210", domain: "Finance", client: "BankCorp", access: "Full Access" },
    { name: "Jane Smith", role: "User", mail: "jane.smith@xyz.com", phone: "8765432109", domain: "Healthcare", client: "HealthPlus", access: "Read" },
    { name: "Michael Brown", role: "User", mail: "michael.brown@xyz.com", phone: "7654321098", domain: "Technology", client: "TechWorld", access: "Write" },
    { name: "Emily Davis", role: "Admin", mail: "emily.davis@xyz.com", phone: "6543210987", domain: "Marketing", client: "MarketX", access: "Full Access" },
    { name: "David Wilson", role: "User", mail: "david.wilson@xyz.com", phone: "5432109876", domain: "Retail", client: "RetailCo", access: "Read" },
    { name: "Sophia Taylor", role: "Admin", mail: "sophia.taylor@xyz.com", phone: "4321098765", domain: "Education", client: "EduCare", access: "Write" },
    { name: "James Lee", role: "User", mail: "james.lee@xyz.com", phone: "3210987654", domain: "Ecommerce", client: "EcomPlus", access: "Access" },
  ];

  // Function to handle button click
  const toggleVisibility = () => {
    setShowAll(!showAll);
  };
  const toggleVisibility2 = () => {
    setHdipShowAll(!hdipShowAll);
  };



  const [editClientUser, setEditClientUser] = useState(null);

  const toggleEditClientUser = (index) => {
    console.log(index);
    setEditClientUser(index);
  }
  const toggleSaveClientUser = (index) => {
    setEditClientUser(null)
  }
  const cancelEdit = (index) => {
    setEditClientUser(null)
  }
  const [addHdipUser, setAddHdipUser] = React.useState(false);
  const handleAddHdipUserOpen = () => {
    setAddHdipUser(true);
  };
  const handleAddHdipUserClose = () => {
    setAddHdipUser(false);
  };
  const [addClientUser,setAddClientuser]=React.useState(false);
  const handleAddClientUserOpen=()=>{
    setAddClientuser(true)
  }
  const handleAddClientUserClose=()=>{
    setAddClientuser(false)
  }

  const [editHdipUser, setEditHdipUser] = useState("")

  const toggleEditHdipUser = (mail) => {
    console.log(mail);

    console.log("Clicked on Edit");

    setEditHdipUser(mail)
  }
  const toggleSaveHdipUser = (mail) => {
    console.log("Clicked on Save");
    setEditHdipUser(mail);
  }
  const cancelEditHdipUser = () => {
    console.log("Clicked on Cancel");
    setEditHdipUser("")
  }


  return (
    <div>
      {/* Search Input Section */}
      <div className="flex flex-col justify-end sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0 ml-auto">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full sm:w-80">
          <input
            type="text"
            placeholder="Search Client by name"
            className="flex-1 bg-transparent text-gray-600 outline-none text-sm"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-5 w-5 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M16.5 10.5a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
        </div>
      </div>


      <div>
        <div>
          <div className="flex items-center gap-x-5">
            <h1 className="text-md font-semibold">CLIENT USERS</h1>



            <React.Fragment>
              <div>
                <button
                  className="border p-1 px-4 rounded-full bg-[#056DDC] font-medium text-white"
                  onClick={handleAddClientUserOpen}
                >
                  + Add
                </button>
              </div>
              <BootstrapDialog
                onClose={handleAddClientUserClose}
                aria-labelledby="add-poc-dialog-title"
                open={addClientUser}
              >
                <DialogTitle sx={{ m: 0, p: 2 }} id="add-poc-dialog-title">
                  <h1 className='font-bold text-[#056DDC]'>ADD CLIENT USER</h1>
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleAddClientUserClose}
                  sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                  })}
                >
                  <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                  <div
                  >
                    <div className="p-2 flex items-center justify-center gap-3">
                      <label className="w-1/4 text-base font-medium text-gray-600">Client Name</label>
                      <input
                        type="text"
                        placeholder="Phonepe"
                        className="p-2 w-3/4 border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="p-2 flex items-center justify-center gap-3">
                      <label className="w-1/4 text-base font-medium text-[#6B6F7B]">User Name</label>
                      <input
                        type="text"
                        placeholder="Ashok Samal"
                        className="w-3/4 p-2 border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                   
                    <div className="p-2 flex items-center justify-center gap-3">
                      <label className="w-1/4 text-base font-medium text-[#6B6F7B]">Mail ID</label>
                      <input
                        type="mail"
                        placeholder="rober@xyz.com"
                        className="w-3/4 p-2 border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      
                    </div>
                    <div className="p-2 flex items-center justify-center gap-3">
                      <label className="w-1/4 text-base font-medium text-[#6B6F7B]">Phone Number</label>
                      <input
                        type="number"
                        placeholder="9876543210"
                        className="w-3/4 p-2 border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="p-2 flex items-center justify-center gap-3">
                      <label className="w-1/4 text-base font-medium text-[#6B6F7B]">Domain</label>
                      <input
                        type="text"
                        placeholder="Ecommerce"
                        className="w-3/4 p-2 border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="p-2 flex items-center justify-center gap-3">
                      <label className="w-1/4 text-base font-medium text-[#6B6F7B]">Access</label>
                      <select name="" id=""
                        className="w-3/4 p-2 border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Access" disabled>Read / Write</option>
                        <option value="2024-11-28">Read Only</option>
                        <option value="2024-11-29">Write Only</option>
                        <option value="2024-11-29">Both</option>
                      </select>
                    </div>
                  </div>
                </DialogContent>
                <DialogActions>
                  <div className="px-5 py-2">
                    <button
                      onClick={handleAddClientUserClose}
                      className="text-white border py-2 px-5 rounded-full bg-[#056DDC] ">
                      SAVE
                    </button>
                  </div>
                </DialogActions>
              </BootstrapDialog>
            </React.Fragment>

          </div>
        </div>

        {/* Table Headers */}
        <div className="mt-4">
          <div className="w-full grid grid-cols-[1fr_1fr_2fr_1fr_1fr_1fr_0.5fr] gap-2 text-sm font-semibold">
            <div className="px-6 p-2 w-full">CLIENT</div>
            <div className="px-4 p-2 w-full">USER</div>
            <div className="px-4 p-2 w-full">MAIL ID</div>
            <div className="px-4 p-2 w-full">PHONE NO</div>
            <div className="px-4 p-2 w-full">DOMAIN</div>
            <div className="px-4 p-2 w-full">ACCESS</div>
            <div className="px-6 p-2 w-full"></div>
          </div>

          {/* Mapping Dynamic Data */}
          <div
            className={`overflow-hidden transition-all duration-1000 ease-in-out ${showAll ? "max-h-[1000px]" : "max-h-[200px]" // Adjust max-height accordingly
              }`}
          >
            {data.slice(0, showAll ? data.length : 3).map((item, index) => (
              <div
                key={index}
                className={`${editClientUser === index ? "bg-none border border-black" : "bg-[#EBEBEB]"} grid grid-cols-[1fr_1fr_2fr_1fr_1fr_1fr_0.5fr]  mt-1 rounded-full items-center justify-center max-h-max`}
              >
                <div className="px-5 py-1 w-auto">
                  <input
                    type="text"
                    disabled={editClientUser !== index}
                    value={item.client}
                    className={`block w-full text-left border sm:text-sm px-2 py-2 ${editClientUser === index
                      ? ' focus:outline-none border border-[#E8DEF8] focus:ring-1 focus:ring-blue-500 rounded-lg'
                      : ''
                      }`}
                  />
                </div>
                <div className="px-3 py-1 w-auto">
                  <input
                    type="text"
                    disabled={editClientUser !== index}
                    value={item.name}
                    className={`block w-full text-left border sm:text-sm px-2 py-2 ${editClientUser === index
                      ? ' focus:outline-none border border-[#E8DEF8] focus:ring-1 focus:ring-blue-500 rounded-lg'
                      : ''
                      }`}
                  />
                </div>
                <div className="px-3 py-1 w-auto">
                  <input
                    type="text"
                    disabled={editClientUser !== index}
                    value={item.mail}
                    className={`block w-full text-left border sm:text-sm px-2 py-2 ${editClientUser === index
                      ? ' focus:outline-none border border-[#E8DEF8] focus:ring-1 focus:ring-blue-500 rounded-lg'
                      : ''
                      }`}
                  />
                </div>
                <div className="px-3 py-1 w-auto">
                  <input
                    type="text"
                    disabled={editClientUser !== index}
                    value={item.phone}
                    className={`block w-full text-left border sm:text-sm px-2 py-2 ${editClientUser === index
                      ? ' focus:outline-none border border-[#E8DEF8] focus:ring-1 focus:ring-blue-500 rounded-lg'
                      : ''
                      }`}
                  />
                </div>
                <div className="px-3 py-1 w-auto">
                  <input
                    type="text"
                    disabled={editClientUser !== index}
                    value={item.domain}
                    className={`block w-full text-left border sm:text-sm px-2 py-2 ${editClientUser === index
                      ? ' focus:outline-none border border-[#E8DEF8] focus:ring-1 focus:ring-blue-500 rounded-lg'
                      : ''
                      }`}
                  />
                </div>
                <div className="px-3 py-1 w-auto"><input
                  type="text"
                  disabled={editClientUser !== index}
                  value={item.access}
                  className={`block w-full text-left border sm:text-sm px-2 py-2 ${editClientUser === index
                    ? ' focus:outline-none border border-[#E8DEF8] focus:ring-1 focus:ring-blue-500 rounded-lg'
                    : ''
                    }`}
                /></div>
                <div className="px-4 py-1 w-full flex items-center justify-center">
                  {editClientUser === index ?
                    <div
                      className='flex items-center justify-center gap-x-2'
                    >
                      <button
                        className='py-1 px-2 rounded-lg font-bold bg-[#056DDC] text-white'
                        onClick={() => { toggleSaveClientUser(index) }}
                      >Save</button>
                      <button
                        onClick={() => { cancelEdit(index) }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                      </button>


                    </div>

                    :
                    <button
                      className="p-1 bg-gray-200 shadow-md hover:bg-gray-300 rounded-lg"
                      onClick={() => { toggleEditClientUser(index) }}
                    >
                      <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 21H8.425L18.2 11.225L16.775 9.8L7 19.575V21ZM5 23V18.75L18.2 5.575C18.4 5.39167 18.6208 5.25 18.8625 5.15C19.1042 5.05 19.3583 5 19.625 5C19.8917 5 20.15 5.05 20.4 5.15C20.65 5.25 20.8667 5.4 21.05 5.6L22.425 7C22.625 7.18333 22.7708 7.4 22.8625 7.65C22.9542 7.9 23 8.15 23 8.4C23 8.66667 22.9542 8.92083 22.8625 9.1625C22.7708 9.40417 22.625 9.625 22.425 9.825L9.25 23H5ZM17.475 10.525L16.775 9.8L18.2 11.225L17.475 10.525Z" fill="#65558F" />
                      </svg>

                    </button>
                  }
                </div>
              </div>
            ))}
          </div>

          {/* Toggle Button */}
          <div className="flex justify-end mt-4 text-blue-500">
            <button
              onClick={toggleVisibility}
              className="px-4 py-2"
            >
              {showAll ? "Show Less" : "See All"}
            </button>
          </div>
        </div>
      </div>

      <div>
        <div>
          <div className="flex items-center gap-x-5">
            <h1 className="text-md font-semibold">HDIP USERS</h1>
            <React.Fragment>
              <div>
                <button
                  className="border p-1 px-4 rounded-full bg-[#056DDC] font-medium text-white"
                  onClick={handleAddHdipUserOpen}
                >
                  + Add
                </button>
              </div>
              <BootstrapDialog
                onClose={handleAddHdipUserClose}
                aria-labelledby="add-poc-dialog-title"
                open={addHdipUser}
              >
                <DialogTitle sx={{ m: 0, p: 2 }} id="add-poc-dialog-title">
                  <h1 className='font-bold text-[#056DDC]'>ADD HDIP USER</h1>
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleAddHdipUserClose}
                  sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                  })}
                >
                  <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                  <div
                  >
                    <div className="p-2 flex items-center justify-center gap-3">
                      <label className="w-1/4 text-base font-medium text-gray-600">Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="p-2 w-3/4 border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="p-2 flex items-center justify-center gap-3">
                      <label className="w-1/4 text-base font-medium text-[#6B6F7B]">Access</label>
                      <select name="" id=""
                        className="w-3/4 p-2 border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        
                        <option value="Access">Admin / User</option>
                        <option value="2024-11-28">Admin</option>
                        <option value="2024-11-29">User</option>
                      </select>
                    </div>
                   
                    <div className="p-2 flex items-center justify-center gap-3">
                      <label className="w-1/4 text-base font-medium text-[#6B6F7B]">Mail ID</label>
                      <input
                        type="mail"
                        placeholder="rober@xyz.com"
                        className="w-3/4 p-2 border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="p-2 flex items-center justify-center gap-3">
                      <label className="w-1/4 text-base font-medium text-[#6B6F7B]">Phone Number</label>
                      <input
                        type="number"
                        placeholder="9876543210"
                        className="w-3/4 p-2 border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="p-2 flex items-center justify-center gap-3">
                      <label className="w-1/4 text-base font-medium text-[#6B6F7B]">Client</label>
                      <input
                        type="text"
                        placeholder="HealthPlus"
                        className="w-3/4 p-2 border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </DialogContent>
                <DialogActions>
                  <div className="px-5 py-2">
                    <button
                      onClick={handleAddHdipUserClose }
                      className="text-white border py-2 px-5 rounded-full bg-[#056DDC] ">
                      SAVE
                    </button>
                  </div>
                </DialogActions>
              </BootstrapDialog>
            </React.Fragment>
          </div>
        </div>

        {/* Table Headers */}
        <div className="mt-4">
          <div className="w-full grid grid-cols-[1fr_1fr_2fr_1fr_1fr_0.5fr] gap-2 text-sm font-semibold">
            <div className="px-6 p-2 w-full">NAME</div>
            <div className="px-4 p-2 w-full">ROLE</div>
            <div className="px-4 p-2 w-full">EMAIL</div>
            <div className="px-4 p-2 w-full">PHONE NO</div>
            <div className="px-4 p-2 w-full">CLIENT</div>
            <div className="px-6 p-2 w-full"></div>
          </div>

          {/* Mapping Dynamic Data */}
          <div
            className={`overflow-hidden transition-all duration-1000 ease-in-out ${hdipShowAll ? "max-h-[1000px]" : "max-h-[200px]" // Adjust max-height accordingly
              }`}
          >
            {data2.slice(0, hdipShowAll ? data2.length : 3).map((item, index) => (
              <div
                key={item.mail}
                className={`${editHdipUser === item.mail ? "bg-none border border-black" : "bg-[#EBEBEB]"} grid grid-cols-[1fr_1fr_2fr_1fr_1fr_0.5fr] mt-1 rounded-full items-center justify-center max-h-max`}
              >
                <div className="px-3 py-1 w-auto">
                  <input
                    type="text"
                    disabled={editHdipUser !== item.mail}
                    value={item.name}
                    className={`block w-full text-left border sm:text-sm px-2 py-2 ${editHdipUser === item.mail
                      ? ' focus:outline-none border border-[#E8DEF8] focus:ring-1 focus:ring-blue-500 rounded-lg'
                      : ''
                      }`}
                  />
                </div>
                <div className="px-3 py-1 w-auto">
                  <input
                    type="text"
                    disabled={editHdipUser !== item.mail}
                    value={item.role}
                    className={`block w-full text-left border sm:text-sm px-2 py-2 ${editHdipUser === item.mail
                      ? ' focus:outline-none border border-[#E8DEF8] focus:ring-1 focus:ring-blue-500 rounded-lg'
                      : ''
                      }`}
                  />
                </div>
                <div className="px-3 py-1 w-auto">
                  <input
                    type="text"
                    disabled={editHdipUser !== item.mail}
                    value={item.mail}
                    className={`block w-full text-left border sm:text-sm px-2 py-2 ${editHdipUser === item.mail
                      ? ' focus:outline-none border border-[#E8DEF8] focus:ring-1 focus:ring-blue-500 rounded-lg'
                      : ''
                      }`}
                  />
                </div>
                <div className="px-3 py-1 w-auto">
                  <input
                    type="text"
                    disabled={editHdipUser !== item.mail}
                    value={item.phone}
                    className={`block w-full text-left border sm:text-sm px-2 py-2 ${editHdipUser === item.mail
                      ? ' focus:outline-none border border-[#E8DEF8] focus:ring-1 focus:ring-blue-500 rounded-lg'
                      : ''
                      }`}
                  />
                </div>
                <div className="px-3 py-1 w-auto">
                  <input
                    type="text"
                    disabled={editHdipUser !== item.mail}
                    value={item.client}
                    className={`block w-full text-left border sm:text-sm px-2 py-2 ${editHdipUser === item.mail
                      ? ' focus:outline-none border border-[#E8DEF8] focus:ring-1 focus:ring-blue-500 rounded-lg'
                      : ''
                      }`}
                  />
                </div>

                <div className="px-4 py-1 w-full flex items-center justify-center">
                  {editHdipUser === item.mail ?
                    <div
                      className='flex items-center justify-center gap-x-2'
                    >
                      <button
                        className='py-1 px-2 rounded-lg font-bold bg-[#056DDC] text-white'
                        onClick={() => { toggleSaveHdipUser(item.mail) }}
                      >Save</button>
                      <button
                        onClick={() => { cancelEditHdipUser(item.mail) }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                      </button>


                    </div>

                    :
                    <button
                      className="p-1 bg-gray-200 shadow-md hover:bg-gray-300 rounded-lg"
                      onClick={() => { toggleEditHdipUser(item.mail) }}
                    >
                      <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 21H8.425L18.2 11.225L16.775 9.8L7 19.575V21ZM5 23V18.75L18.2 5.575C18.4 5.39167 18.6208 5.25 18.8625 5.15C19.1042 5.05 19.3583 5 19.625 5C19.8917 5 20.15 5.05 20.4 5.15C20.65 5.25 20.8667 5.4 21.05 5.6L22.425 7C22.625 7.18333 22.7708 7.4 22.8625 7.65C22.9542 7.9 23 8.15 23 8.4C23 8.66667 22.9542 8.92083 22.8625 9.1625C22.7708 9.40417 22.625 9.625 22.425 9.825L9.25 23H5ZM17.475 10.525L16.775 9.8L18.2 11.225L17.475 10.525Z" fill="#65558F" />
                      </svg>

                    </button>
                  }
                </div>
              </div>
            ))}
          </div>

          {/* Toggle Button */}
          <div className="flex justify-end mt-4 text-blue-500">
            <button
              onClick={toggleVisibility2}
              className="px-4 py-2"
            >
              {hdipShowAll ? "Show Less" : "See All"}
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}

export { Users as InternalUsers };
