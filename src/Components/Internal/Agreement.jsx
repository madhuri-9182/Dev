import React, { useState } from 'react'
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialog-paper': {
    width: '400px' // You can customize this value to whatever you need
  },
}));


function Agreement() {







    // JSON DATA 
    const data=[
      {
        "company": "Phonepe",
        "salaries": {
          "0-4 Years": 2800.00,
          "4-6 Years": 3500.00,
          "6-8 Years": 4500.00,
          "8-10 Years": 6000.00,
          "10+ Years": 6500.00
        }
      },
      {
        "company": "Coinbase",
        "salaries": {
          "0-4 Years": 2800.00,
          "4-6 Years": 3500.00,
          "6-8 Years": 4500.00,
          "8-10 Years": 6000.00,
          "10+ Years": 6500.00
        }
      },
      {
        "company": "Cred",
        "salaries": {
          "0-4 Years": 2800.00,
          "4-6 Years": 3500.00,
          "6-8 Years": 4500.00,
          "8-10 Years": 6000.00,
          "10+ Years": 6500.00
        }
      },
      {
        "company": "Wayfair",
        "salaries": {
          "0-4 Years": 2800.00,
          "4-6 Years": 3500.00,
          "6-8 Years": 4500.00,
          "8-10 Years": 6000.00,
          "10+ Years": 6500.00
        }
      },
      {
        "company": "Linkedin",
        "salaries": {
          "0-4 Years": 2800.00,
          "4-6 Years": 3500.00,
          "6-8 Years": 4500.00,
          "8-10 Years": 6000.00,
          "10+ Years": 6500.00
        }
      },
      {
        "company": "Vahan",
        "salaries": {
          "0-4 Years": 2800.00,
          "4-6 Years": 3500.00,
          "6-8 Years": 4500.00,
          "8-10 Years": 6000.00,
          "10+ Years": 6500.00
        }
      },
      {
        "company": "Quince",
        "salaries": {
          "0-4 Years": 2800.00,
          "4-6 Years": 3500.00,
          "6-8 Years": 4500.00,
          "8-10 Years": 6000.00,
          "10+ Years": 6500.00
        }
      },
      {
        "company": "Attentive",
        "salaries": {
          "0-4 Years": 2800.00,
          "4-6 Years": 3500.00,
          "6-8 Years": 4500.00,
          "8-10 Years": 6000.00,
          "10+ Years": 6500.00
        }
      },
      {
        "company": "Navi",
        "salaries": {
          "0-4 Years": 2800.00,
          "4-6 Years": 3500.00,
          "6-8 Years": 4500.00,
          "8-10 Years": 6000.00,
          "10+ Years": 6500.00
        }
      }
    ]
    
    const[showAll, setShowAll] = useState(false);

    const toggleVisibility= () =>{
      setShowAll(!showAll);
    }

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    
    const togglePopup = () => {
      setIsPopupVisible(!isPopupVisible);
      console.log("clicked");
      
    };

    

    const [addClientUser, setAddClientuser] = React.useState(false);
  const handleAddClientUserOpen = () => {
    setAddClientuser(true)
  }

  const handleAddClientUserClose = () => {
    setAddClientuser(false)
  }

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



  return (
    <div className='text-[12px] ' >
      <div className='w-full h-full flex justify-between items-center px-5 mb-12 ' > 
          <div className='font-semibold text-[16px] ' >Years of Experience & Agreed Rates</div>
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


          
          <div
            className={`overflow-hidden transition-all duration-1000 ease-in-out  ${showAll ? "max-h-[1000px]" : "h-full" // Adjust max-height accordingly
              }`}
          >
            {data.slice(0, showAll ? data.length : data.length).map((item, index) => (
              <div className='font-semibold  ' >
              <div
                key={index}
                className={`${editClientUser === index ? "bg-none border border-black" : "bg-[#EBEBEB]"} grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_0.5fr] ml-6 mr-6 mt-2 rounded-[16px] items-center bg-[#EBEBEB80] justify-center max-h-max`}
              >
                <div className="px-5 py-1 w-auto ">
                  <input
                    type="text"
                    disabled
                    value={item.company}
                    className="block w-full text-left font-bold text-[16px] px-[5px] py-2 text-[#056DDC]"
                  />
                </div>
                <div className="px-3 py-1 w-auto text-black font-semibold  ">
                  <label htmlFor="">0-4 Years</label>
                  <input
                    type="number"
                    disabled={editClientUser !== index}
                    value={item.salaries['0-4 Years'].toFixed(2)}
                    className={`block w-full text-left font-normal px-[5px] py-2 ${editClientUser === index
                      ? ' focus:outline-none border border-[#E8DEF8] focus:ring-1 focus:ring-blue-500 rounded-lg'
                      : 'border border-none'
                      }`}
                  />
                </div>
                <div className="px-3 py-1 w-auto text-black font-semibold  ">
                  <label htmlFor="">4-6 Years</label>
                  <input
                    type="number"
                    disabled={editClientUser !== index}
                    value={item.salaries['4-6 Years'].toFixed(2)}
                    className={`block w-full text-left font-normal px-[5px] py-2 ${editClientUser === index
                      ? ' focus:outline-none border border-[#E8DEF8] focus:ring-1 focus:ring-blue-500 rounded-lg'
                      : 'border border-none'
                      }`}
                  />
                </div>
                <div className="px-3 py-1 w-auto text-black font-semibold  ">
                  <label htmlFor="">6-8 Years</label>
                  <input
                    type="number"
                    disabled={editClientUser !== index}
                    value={item.salaries['6-8 Years'].toFixed(2)}
                    className={`block w-full text-left font-normal px-[5px] py-2 ${editClientUser === index
                      ? ' focus:outline-none border border-[#E8DEF8] focus:ring-1 focus:ring-blue-500 rounded-lg'
                      : 'border border-none'
                      }`}
                  />
                </div>
                <div className="px-3 py-1 w-auto text-black font-semibold  ">
                  <label htmlFor="">8-10 Years</label>
                  <input
                    type="number"
                    disabled={editClientUser !== index}
                    value={item.salaries['8-10 Years'].toFixed(2)}
                    className={`block w-full text-left font-normal px-[5px] py-2 ${editClientUser === index
                      ? ' focus:outline-none border border-[#E8DEF8] focus:ring-1 focus:ring-blue-500 rounded-lg'
                      : 'border border-none'
                      }`}
                  />
                </div>
                <div className="px-3 py-1 w-auto text-black font-semibold  ">
                  <label htmlFor="">10+ Years</label>
                  <input
                    type="number"
                    disabled={editClientUser !== index}
                    value={item.salaries['10+ Years'].toFixed(2)}
                    className={`block w-full text-left font-normal px-[5px] py-2 ${editClientUser === index
                      ? ' focus:outline-none border border-[#E8DEF8] focus:ring-1 focus:ring-blue-500 rounded-lg'
                      : 'border border-none'
                      }`}
                  />
                </div>
                
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
              </div>
            ))}
          </div>
          <div className='w-full mt-2 h-[56px] flex bg-[#EBEBEB80] rounded-[16px] justify-end items-center pr-12' >
          <React.Fragment>
              <div>
                <button
                  className="border p-1 px-4 rounded-full text-[16px] font-bold text-[#056DDC]"
                  onClick={handleAddClientUserOpen}
                >
                  + Add New
                </button>
              </div>
              <BootstrapDialog
                onClose={handleAddClientUserClose}
                aria-labelledby="add-poc-dialog-title"
                open={addClientUser}
                BackdropProps={{
                  sx: {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)'
                  },
                }}
              >
                <DialogTitle sx={{ m: 0, p: 2 }} id="add-poc-dialog-title">
                  <h1 className='font-bold text-[#056DDC] text-lg text-center'>New Agreements</h1>
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
                  <div className=" w-full flex-col flex items-center justify-center gap-y-2">
                    <div className="p-1 flex flex-col items-start gap-2 w-full">
                      <label className="w-full text-sm font-medium text-gray-700">Company Name</label>
                      <input
                        type="text"
                        placeholder="Phonepe"
                        className="p-1 text-sm w-full border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="p-1 flex flex-col items-start gap-2 w-full">
                      <label className="w-full text-sm font-medium text-gray-700">0-4 Years Rate</label>
                      <input
                        type="number"
                        placeholder="2800.00"
                        className="w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="p-1 flex flex-col items-start gap-2 w-full">
                      <label className="w-full text-sm font-medium text-gray-700">4-6 Years Rate</label>
                      <input
                        type="number"
                        placeholder="2800.00"
                        className="w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="p-1 flex flex-col items-start gap-2 w-full">
                      <label className="w-full text-sm font-medium text-gray-700">6-8 Years Rate</label>
                      <input
                        type="number"
                        placeholder="2800.00"
                        className="w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="p-1 flex flex-col items-start gap-2 w-full">
                      <label className="w-full text-sm font-medium text-gray-700">8-10 Years Rate</label>
                      <input
                        type="numbers"
                        placeholder="2800.00"
                        className="w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="p-1 flex flex-col items-start gap-2 w-full">
                      <label className="w-full text-sm font-medium text-gray-700">10+ Years Rate</label>
                      <input
                        type="numbers"
                        placeholder="2800.00"
                        className="w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
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
              
              
             {/* Popup Div */}
             
             
          </div>
          
          
      </div>
    
  )
}

export {Agreement as InternalAgreements}
