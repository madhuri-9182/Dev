import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import toast from "react-hot-toast";
import axios from '../../api/axios';
import { CircularProgress } from '@mui/material';




const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialog-paper': {
    width: '400px', // You can customize this value to whatever you need
  },
}));




function Clients() {
  // Data for the table
  const clients = [
    { name: "PhonePay", activeJobs: 25, passiveJobs: 10, totalCandidates: 15 },
    { name: "Wayfair", activeJobs: 26, passiveJobs: 12, totalCandidates: 14 },
    { name: "Quince", activeJobs: 11, passiveJobs: 8, totalCandidates: 3 },
    { name: "Flipkart", activeJobs: 12, passiveJobs: 9, totalCandidates: 3 },
    { name: "Coinbase", activeJobs: 8, passiveJobs: 6, totalCandidates: 2 },
    { name: "Vahan", activeJobs: 6, passiveJobs: 5, totalCandidates: 1 },
    { name: "Zepto", activeJobs: 14, passiveJobs: 12, totalCandidates: 2 },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [addPocOpen, setAddPocOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const handleAddPocOpen = (e) => {
    e.preventDefault();
    setAddPocOpen(true);
  };

  const handleAddPocClose = (e) => {
    e.preventDefault();
    const name = e.target.elements['poc-name'].value;
    const phone = e.target.elements['poc-phone'].value;
    const email = e.target.elements['poc-email'].value;
    setRows([...rows, { name, phone, email }]);
    setAddPocOpen(false);
  }

  const validatePOCChange = (e) => {
    const { name, value } = e.target;

    // Custom validation messages
    if (name === "poc-name" && (value.length < 1 || value.length > 255)) {
      e.target.setCustomValidity("Name must be between 1 and 255 characters.");
    } else if (name === "poc-email" && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      e.target.setCustomValidity("Email must be in the correct format.");
    } else if (name === "poc-phone" && !/^[0-9]{10}$/.test(value)) {
      e.target.setCustomValidity("Phone number must be exactly 10 digits.");
    } else {
      e.target.setCustomValidity(""); // Clear custom message
    }
  }

  const handleEditOpen = (e, row, index) => {
    e.preventDefault();
    setEditOpen(true);
    setSelectedRow({ ...row, index });
  };

  const handleEditClose = (e) => {
    e.preventDefault();

    const name = e.target.elements['poc-name'].value;
    const phone = e.target.elements['poc-phone'].value;
    const email = e.target.elements['poc-email'].value;

    const updatedRows = rows.map((row, index) => {
      if (index === selectedRow.index) {
        return { ...row, name, phone, email };
      }
      return row;
    });

    setRows(updatedRows);
    setSelectedRow(null);
    setEditOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rows?.length < 1) {
      toast.error("Please add at least one POC.", { position: "top-right" });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        "name": e.target.elements['name'].value,
        "website": e.target.elements['website'].value,
        "domain": e.target.elements['domain'].value,
        "gstin": e.target.elements['gstin'].value,
        "pan": e.target.elements['pan'].value,
        "is_signed": e.target.elements['is_signed'].value === "Signed",
        "assigned_to": "-",//e.target.elements['assigned_to'].value,
        "address": e.target.elements['address'].value,
        "points_of_contact": rows.map(row => ({ ...row, phone: `+91${row.phone}` }))
      }
      await axios.post("/api/internal/internal-client/", payload);
      toast.success(
        "Client added successfully",
        {
          position: "top-right",
        }
      );
      navigate("/internal/clients");
    } catch (error) {
      let errorMessages;
      if (error?.response?.data?.errors?.errors) {
        errorMessages = Object.entries(error.response.data.errors.errors).flatMap(([key, values]) => values.map(value => `${key}: ${value}`));
      } else if (error?.response?.data?.errors) {
        errorMessages = Object.entries(error.response.data.errors).flatMap(([key, value]) => Object.entries(value).flatMap(([errorKey, errorValues]) => errorValues.map(errorValue => `${errorKey}: ${errorValue}`)));
      }
      toast.error(errorMessages.join(', ') || "Failed to add client", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Custom validation messages
    if (name === "name" && (value.length < 1 || value.length > 255)) {
      e.target.setCustomValidity("Name must be between 1 and 255 characters.");
    } else if (name === "website" && !/^https?:\/\/.+/.test(value)) {
      e.target.setCustomValidity("Website must be a valid URL.");
    } else if (name === "domain" && (value.length < 1 || value.length > 255)) {
      e.target.setCustomValidity("Domain must be between 1 and 255 characters.");
    } else if (name === "gstin" && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value)) {
      e.target.setCustomValidity("GSTIN must be in the format 22AAAAA0000A1Z5");
    } else if (name === "pan" && !/[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(value)) {
      e.target.setCustomValidity("PAN must be in the format ABCDE1234F.");
      // } else if (name === "assigned_to" && (value.length < 1 || value.length > 255)) {
      //   e.target.setCustomValidity("Assigned To must be between 1 and 255 characters.");
    } else if (name === "address" && (value.length < 1 || value.length > 255)) {
      e.target.setCustomValidity("Address must be between 1 and 255 characters.");
    } else {
      e.target.setCustomValidity(""); // Clear custom message
    }
  };

  const [selectedFilters, setSelectedFilters] = useState({
    domain: "All",
    status: "All",
  });

  const domains = ["All", "Domain 1", "Domain 2", "Domain 3", "Domain 4", "Domain 5"];
  const statuses = ["All", "Active", "Inactive"];

  const handleSelect = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  return (
    <div className="px-6">

      <div>

        {location.pathname === "/internal/clients" && (
          <div>
            {/* Search and Add Client Section */}
            <div className="flex flex-col justify-end sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0 ml-auto">
              {/* Search Input */}
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full sm:w-80 border focus-within:border-blue-700">
                <input
                  type="text"
                  placeholder="Search Client by name"
                  className="flex-1 bg-transparent text-gray-600 outline-none text-sm"
                />
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
              </div>

              {/* Add Client Button */}
              <button
                className="flex items-center justify-center space-x-2 bg-[#007AFF] text-white px-4 py-2 rounded-full text-sm font-medium w-full sm:w-auto"
                onClick={() => navigate(`${location.pathname}/addclient`)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                <span> Add Client</span>
              </button>
            </div>
            {/* Domain and Status Filters */}
            <div className="space-y-2 mt-1">
              {/* Domain Filter */}
              <div className="flex items-center space-x-1">
                <span className="text-sm font-bold mr-2 flex">Domain</span>
                {domains.map((domain) => (
                  <button
                    key={domain}
                    onClick={() => handleSelect("domain", domain)}
                    className={`flex items-center justify-center px-2 py-1 border rounded-md text-xs w-auto ${selectedFilters.domain === domain
                      ? "bg-purple-100 text-purple-700 border-purple-300"
                      : "bg-white text-gray-700 border-gray-300"
                      }`}
                  >
                    {/* Tick container */}
                    {selectedFilters.domain === domain && (
                      <span className="w-4 h-4 flex justify-center items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3 text-purple-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                    {domain}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-1">
                <span className="text-sm font-bold mr-4">Status</span>
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleSelect("status", status)}
                    className={`flex items-center justify-center px-2 py-1 border rounded-md text-xs w-auto ${selectedFilters.status === status
                      ? "bg-purple-100 text-purple-700 border-purple-300"
                      : "bg-white text-gray-700 border-gray-300"
                      }`}
                  >
                    {/* Tick container */}

                    {selectedFilters.status === status && (
                      <span className="w-4 h-4 flex justify-center items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3 text-purple-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}

                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full text-sm text-left text-gray-500 border-collapse">
                <thead className="bg-gray-100 text-gray-700 uppercase font-medium">
                  <tr>
                    <th scope="col" className="px-6 py-4 whitespace-nowrap">
                      Client
                    </th>
                    <th scope="col" className="px-6 py-4 whitespace-nowrap text-center">
                      Active Jobs
                    </th>
                    <th scope="col" className="px-6 py-4 whitespace-nowrap text-center">
                      Passive Jobs
                    </th>
                    <th scope="col" className="px-6 py-4 whitespace-nowrap text-center">
                      Total Candidates
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-6 py-4 text-blue-600 font-bold ">
                        {client.name}
                      </td>
                      <td className="px-6 py-4 text-center">{client.activeJobs}</td>
                      <td className="px-6 py-4 text-center">{client.passiveJobs}</td>
                      <td className="px-6 py-4 text-center">{client.totalCandidates}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>












      {/* Add Client Section */}

      <div>
        {location.pathname === "/internal/clients/addclient" && (
          <form onSubmit={handleSubmit} >
            <div>
              <ul className="flex flex-col gap-y-2">
                <li className="flex items-center">
                  <label className="text-[#6B6F7B] font-bold text-xs w-1/6 px-4">Client Registered Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Client Name"
                    onChange={handleInputChange}
                    required
                    className="block w-[360px] h-[32px] border border-gray-300 rounded-lg shadow-sm text-xs text-center px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </li>
                <li className="flex items-center">
                  <label className="text-[#6B6F7B] font-bold text-xs w-1/6 px-4">Website</label>
                  <input
                    type="url"
                    name="website"
                    placeholder="Enter Web Address"
                    onChange={handleInputChange}
                    required
                    className="block w-[360px] h-[32px] border border-gray-300 rounded-lg shadow-sm text-xs text-center px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </li>
                <li className="flex items-center">
                  <label className="text-[#6B6F7B] font-bold text-xs w-1/6 px-4">Domain</label>
                  <input
                    type="text"
                    name="domain"
                    placeholder="Enter Domain Name"
                    onChange={handleInputChange}
                    required
                    className="block w-[360px] h-[32px] border border-gray-300 rounded-lg shadow-sm text-xs text-center px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </li>
                <li className="flex items-center">
                  <label className="text-[#6B6F7B] font-bold text-xs w-1/6 px-4">GSTIN</label>
                  <input
                    type="text"
                    name="gstin"
                    placeholder="Enter GSTIN"
                    onChange={handleInputChange}
                    required
                    className="block w-[360px] h-[32px] border border-gray-300 rounded-lg shadow-sm text-xs text-center px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </li>
                <li className="flex items-center">
                  <label className="text-[#6B6F7B] font-bold text-xs w-1/6 px-4">PAN</label>
                  <input
                    type="text"
                    name="pan"
                    placeholder="Enter PAN"
                    onChange={handleInputChange}
                    required
                    className="block w-[360px] h-[32px] border border-gray-300 rounded-lg shadow-sm text-xs text-center px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </li>
                <li className="flex items-center">
                  <label className="text-[#6B6F7B] font-bold text-xs w-1/6 px-4">Signed/Not Signed</label>
                  <select
                    name="is_signed"
                    required
                    className="block w-[360px] h-[32px] border border-gray-300 rounded-lg shadow-sm text-xs text-center px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Signed">Signed</option>
                    <option value="Not Signed">Not Signed</option>
                  </select>
                </li>
                {/* <li className="flex items-center">
                  <label className="text-sm font-medium text-right text-gray-700 w-1/6 px-4">Assigned To</label>
                  <input
                    type="text"
                    name="assigned_to"
                    placeholder="Select user"
                    onChange={handleInputChange}
                    required
                    className="block w-[360px] h-[32px] border border-gray-300 rounded-lg shadow-sm text-xs text-center px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </li> */}
                <li className="flex items-center">
                  <label className="text-[#6B6F7B] font-bold text-xs w-1/6 px-4">Address</label>
                  <textarea
                    name="address"
                    placeholder="Add Address"
                    onChange={handleInputChange}
                    required
                    className="block w-[360px] h-[114px] border border-gray-300 rounded-lg shadow-sm text-xs px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-md w-full mt-6">
              <div className="flex items-center gap-x-5 mb-4">
                <div className="relative group inline-block">
                  {/* Always visible text */}
                  <h2 className="text-sm font-semibold text-black">POC</h2>

                  {/* Tooltip */}
                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
                  >
                    Point of Contact
                  </div>
                </div>

                <button
                  className="border p-2 px-4 rounded-full bg-purple-200 font-medium text-sm"
                  onClick={handleAddPocOpen}
                >
                  + Add
                </button>
              </div>

              {/* Rows */}
              <div className="space-y-4 pl-[65px]">
                {rows.map((row, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4">
                    <div className="p-2 flex items-center justify-center gap-3">
                      <label className="text-[#6B6F7B] font-bold text-xs">Name:</label>
                      <input
                        type="text"
                        value={row.name}
                        disabled
                        className="w-full h-[32px] p-2 border text-center text-xs border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="p-2 flex items-center justify-center gap-3">
                      <label className="text-[#6B6F7B] font-bold text-xs min-w-fit">Email ID:</label>
                      <input
                        type="email"
                        value={row.email}
                        disabled
                        className="w-full h-[32px] p-2 border text-center text-xs border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="p-2 flex items-center justify-center gap-3">
                      <label className="text-[#6B6F7B] font-bold text-xs min-w-fit">Mobile No.:</label>
                      <input
                        type="text"
                        value={row.phone}
                        disabled
                        className="w-full h-[32px] p-2 border text-center text-xs border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-1 flex items-center space-x-2">

                      <button
                        className="flex items-center justify-center hover:bg-blue-100 hover:duration-300 p-2 rounded-xl"
                        onClick={(e) => handleEditOpen(e, row, index)}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.1665 1.6665H7.49984C3.33317 1.6665 1.6665 3.33317 1.6665 7.49984V12.4998C1.6665 16.6665 3.33317 18.3332 7.49984 18.3332H12.4998C16.6665 18.3332 18.3332 16.6665 18.3332 12.4998V10.8332" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M13.3666 2.51688L6.7999 9.08354C6.5499 9.33354 6.2999 9.82521 6.2499 10.1835L5.89157 12.6919C5.75823 13.6002 6.3999 14.2335 7.30823 14.1085L9.81657 13.7502C10.1666 13.7002 10.6582 13.4502 10.9166 13.2002L17.4832 6.63354C18.6166 5.50021 19.1499 4.18354 17.4832 2.51688C15.8166 0.850211 14.4999 1.38354 13.3666 2.51688Z" stroke="#171717" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12.4248 3.4585C12.9831 5.45016 14.5415 7.0085 16.5415 7.57516" stroke="#171717" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button onClick={(e) => {
                        e.preventDefault();
                        setRows((prevRows) => prevRows.filter((row, idx) => idx !== index));
                      }} className="p-2 text-gray-500 hover:text-red-500">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.5 4.98356C14.725 4.70856 11.9333 4.56689 9.15 4.56689C7.5 4.56689 5.85 4.65023 4.2 4.81689L2.5 4.98356" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M7.0835 4.1415L7.26683 3.04984C7.40016 2.25817 7.50016 1.6665 8.9085 1.6665H11.0918C12.5002 1.6665 12.6085 2.2915 12.7335 3.05817L12.9168 4.1415" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M15.7082 7.6167L15.1665 16.0084C15.0748 17.3167 14.9998 18.3334 12.6748 18.3334H7.32484C4.99984 18.3334 4.92484 17.3167 4.83317 16.0084L4.2915 7.6167" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M8.6084 13.75H11.3834" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M7.9165 10.4165H12.0832" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
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
          </form>
        )}
      </div>
      <BootstrapDialog
        aria-labelledby="add-poc-dialog-title"
        open={addPocOpen}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.8)'
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="add-poc-dialog-title">
          <h1 className='font-bold text-[#056DDC] text-lg text-center'>ADD POC</h1>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setAddPocOpen(false)}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <form onSubmit={handleAddPocClose}>
          <DialogContent dividers>
            <div>
              <div className="p-1 flex flex-col items-start justify-center gap-2">
                <label className="w-full text-sm font-medium text-[#6B6F7B]">POC Name</label>
                <input
                  type="text"
                  name="poc-name"
                  required
                  placeholder="Enter POC Name"
                  onChange={validatePOCChange}
                  className="p-1 text-sm w-full border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="p-1 flex flex-col items-start justify-center gap-2">
                <label className="w-full text-sm font-medium text-[#6B6F7B]">Phone Number</label>
                <input
                  type="text"
                  name="poc-phone"
                  required
                  placeholder="Enter Phone Number"
                  onChange={validatePOCChange}
                  className="p-1 text-sm w-full border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="p-1 flex flex-col items-center justify-center gap-2">
                <label className="w-full text-sm font-medium text-[#6B6F7B]">Mail ID</label>
                <input
                  type="mail"
                  required
                  name="poc-email"
                  placeholder="Enter Mail ID"
                  onChange={validatePOCChange}
                  className="p-1 text-sm w-full border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

          </DialogContent>
          <DialogActions>
            <div className="px-5 py-2">
              <button
                type="html"
                className="text-white text-sm border py-2  px-5 rounded-full bg-[#056DDC] ">
                Save
              </button>
            </div>
          </DialogActions>
        </form>
      </BootstrapDialog>

      <BootstrapDialog
        aria-labelledby="edit-dialog-title"
        open={editOpen}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.8)'
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="edit-dialog-title">
          <h1 className='font-bold text-[#056DDC] text-center text-lg'>EDIT POC</h1>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setEditOpen(false)}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <form onSubmit={handleEditClose}>
          <DialogContent dividers>
            <div>
              <div className="p-1 flex flex-col items-center justify-center gap-2">
                <label className="w-full text-sm font-medium text-[#6B6F7B]">POC Name</label>
                <input
                  type="text"
                  defaultValue={selectedRow?.name}
                  name="poc-name"
                  onChange={validatePOCChange}
                  className="w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="p-1 flex flex-col items-center justify-center gap-2">
                <label className="w-full text-sm font-medium text-[#6B6F7B]">Phone Number</label>
                <input
                  type="text"
                  defaultValue={selectedRow?.phone}
                  onChange={validatePOCChange}
                  name="poc-phone"
                  className="w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="p-1 flex flex-col items-center justify-center gap-2">
                <label className="w-full text-sm font-medium text-[#6B6F7B]">Mail ID</label>
                <input
                  type="mail"
                  defaultValue={selectedRow?.email}
                  name="poc-email"
                  onChange={validatePOCChange}
                  className="w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <div
              className='px-5 py-2'
            >
              <button
                type="submit"
                className="text-white text-sm border py-2 px-5 rounded-full bg-[#056DDC] ">
                Save
              </button>
            </div>
          </DialogActions>
        </form>
      </BootstrapDialog>
    </div>
  );
}

export { Clients as InternalClients };
