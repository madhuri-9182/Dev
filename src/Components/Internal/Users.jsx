import React, { useCallback, useEffect, useRef } from "react";
import { useState } from 'react';
import axios from '../../api/axios';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TableLoadingWrapper from '../../utils/TableLoadingWrapper';
import { debounce } from 'lodash';
import { useForm } from 'react-hook-form';
import InfiniteScrollSelect from "../../utils/InfiniteScrollSelect";
import toast from "react-hot-toast";
import { Button, CircularProgress } from "@mui/material";
import { ACCESSIBILITY, EMAIL_REGEX, MOBILE_REGEX, USER_TYPE } from "../Constants/constants";

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


function Users() {
  const [clientUsers, setClientUsers] = useState([]);
  const [hdipUsers, setHdipUsers] = useState([]);
  const [hasMoreClient, setHasMoreClient] = useState([]);
  const [hasMoreUsers, setHasMoreUsers] = useState([]);
  const [clientPage, setClientPage] = useState(1);
  const [hdipPage, setHdipPage] = useState(1);
  const [searchClient, setSearchClient] = useState("");
  const [searchHdip, setSearchHdip] = useState("");
  const [loadingClient, setLoadingClient] = useState(false);
  const [loadingHdip, setLoadingHdip] = useState(false);
  const [savingHdip, setSavingHdip] = useState(false);
  const [savingClient, setSavingClient] = useState(false);
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedInternalClient, setSelectedInternalClient] = useState({});

  const { register, handleSubmit, reset, setError, clearErrors, getValues, formState: { errors } } = useForm();
  const { register: clientRegister, handleSubmit: clientHandleSubmit, reset: clientReset, setError: clientSetError, clearErrors: clientClearErrors, getValues: clientGetValues, formState: { errors: clientErrors } } = useForm();
  const hasInteracted = useRef(false); // Ref to track if the user has interacted with the form

  const fetchClientUsers = async (query = "") => {
    setLoadingClient(true);
    try {
      const response = await axios.get(`/api/internal/internal-client-user/`, {
        params: {
          offset: (clientPage - 1) * 10,
          q: query || searchClient
        }
      });
      setClientUsers(prev => clientPage === 1 ? response?.data?.results || [] : [...prev, ...response?.data?.results || []]);
      setHasMoreClient(response?.data?.next !== null);
    } catch (error) {
      console.error("Error fetching client users:", error);
    } finally {
      setLoadingClient(false);
    }
  };

  const fetchHdipUsers = async (query = "") => {
    setLoadingHdip(true);
    try {
      const response = await axios.get(`/api/internal/hdip-users/`, {
        params: {
          offset: (hdipPage - 1) * 10,
          q: query || searchHdip
        }
      });
      setHdipUsers(prev => hdipPage === 1 ? response?.data?.results || [] : [...prev, ...response?.data?.results || []]);
      setHasMoreUsers(response?.data?.next !== null);
    } catch (error) {
      console.error("Error fetching HDIP users:", error);
    } finally {
      setLoadingHdip(false);
    }
  };

  // Debounced search functions
  const debouncedClientSearch = debounce((value) => {
    setClientUsers([]); // Clear client users when search value changes
    setClientPage(1); // Reset to first page
    setSearchClient(value); // Set the new search value
    fetchClientUsers(value); // Fetch with the new search value
  }, 1000);

  const debouncedHdipSearch = debounce((value) => {
    setHdipUsers([]); // Clear HDIP users when search value changes
    setHdipPage(1); // Reset to first page
    setSearchHdip(value); // Set the new search value
    fetchHdipUsers(value); // Fetch with the new search value
  }, 1000);

  useEffect(() => {
    fetchClientUsers();
  }, [clientPage]);

  useEffect(() => {
    fetchHdipUsers();
  }, [hdipPage]);

  const validateInternalClient = useCallback(() => {
    if (!selectedInternalClient?.id) {
      clientSetError("internal_client", { type: "manual", message: "Please select a client." });
    } else {
      clientClearErrors("internal_client");
    }
  }, [selectedInternalClient, clientSetError, clientClearErrors]);

  const validateClients = useCallback(() => {
    if (selectedClients.length === 0) {
      setError("client", { type: "manual", message: "Please select at least one Client." });
    } else {
      clearErrors("client");
    }
  }, [selectedClients, setError, clearErrors]);

  useEffect(() => {
    // Revalidate, only if the user has interacted
    if (hasInteracted.current) {
      validateClients();
    }
  }, [selectedClients, validateClients]);

  useEffect(() => {
    // Revalidate if the user has interacted
    if (hasInteracted.current) {
      validateInternalClient();
    }
  }, [selectedInternalClient, validateInternalClient]);

  const handleClientSelection = (value) => {
    hasInteracted.current = true; // Mark as interacted

    if (value && !selectedClients.includes(value)) {
      setSelectedClients([...selectedClients, value]);
    }
  }

  const removeSkill = (ItemToRemove) => {
    const updatedItems = selectedClients.filter(item => item !== ItemToRemove);
    setSelectedClients(updatedItems);
  }

  const [editClientUser, setEditClientUser] = useState(null);

  const toggleEditClientUser = (index) => {
    setEditClientUser(index);
    clientReset();
    setSelectedInternalClient(clientUsers[index]?.client);
  }

  const toggleSaveClientUser = () => {
    setEditClientUser(null)
  }
  
  const [addHdipUser, setAddHdipUser] = React.useState(false);
  const handleAddHdipUserOpen = () => {
    reset();
    hasInteracted.current = false;
    setSelectedClients([]);
    setAddHdipUser(true);
  };
  const handleAddHdipUserClose = () => {
    setAddHdipUser(false);
  };
  const [addClientUser, setAddClientuser] = React.useState(false);
  const handleAddClientUserOpen = () => {
    clientReset();
    hasInteracted.current = false;
    setSelectedInternalClient({});
    setAddClientuser(true)
  }
  const handleAddClientUserClose = () => {
    setAddClientuser(false)
  }

  const [editHdipUser, setEditHdipUser] = useState("")

  const toggleEditHdipUser = (index) => {
    setEditHdipUser(index)
    reset();
    setSelectedClients(hdipUsers[index]?.client);
  }

  const toggleSaveHdipUser = () => {
    setEditHdipUser(null);
  }

  // Refs for scroll containers
  const clientScrollRef = useRef(null);
  const hdipScrollRef = useRef(null);

  // Infinite scroll for client users
  const handleClientScroll = () => {
    if (clientScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = clientScrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 5 && !loadingClient && hasMoreClient) { // Check if scrolled to bottom
        setClientPage(prev => prev + 1);
      }
    }
  };

  // Infinite scroll for HDIP users
  const handleHdipScroll = () => {
    if (hdipScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = hdipScrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 5 && !loadingHdip && hasMoreUsers) { // Check if scrolled to bottom
        setHdipPage(prev => prev + 1);
      }
    }
  };

  const onSubmitHdipUser = (data) => {
    setSavingHdip(true);
    axios.post("/api/internal/hdip-users/", {
      name: data.name,
      email: data.email,
      phone: "+91" + data.phone,
      role: data.access,
      client_ids: selectedClients.map(client => client.id)
    })
      .then(res => {
        toast.success("HDIP User created successfully", { position: "top-right" })
        if (hdipPage === 1) {
          fetchHdipUsers();
        } else {
          setHdipPage(1);
        }
        setSavingHdip(false);
        handleAddHdipUserClose();
      })
      .catch(error => {
        setSavingHdip(false);
        console.error(error);
        if (error.response.data.errors) {
          const errorMessages = Object.entries(error.response.data.errors).map(([key, value]) => `${key}: ${value.join(', ')}`).join(', ');
          toast.error(errorMessages, { position: "top-right" });
        }
      });
  };

  const onEditHdipUser = (data, e) => {
    setSavingHdip(true);
    let payload = {};
    if (data.name !== e?.item?.name) payload.name = data.name;
    if (data.email !== e?.item?.user?.email) payload.email = data.email;
    if (data.phone !== e?.item?.user?.phone?.slice(3)) payload.phone = "+91" + data.phone;
    if (data.access !== e?.item?.user?.role) payload.role = data.access;
    if (selectedClients?.map(client => client.id) !== e?.item?.client?.map(client => client.id)) payload.client_ids = selectedClients?.map(client => client.id);

    axios.patch(`/api/internal/hdip-user/${e?.item?.id}/`, payload)
      .then(res => {
        toast.success("HDIP User updated successfully", { position: "top-right" })
        setSavingHdip(false);
        toggleSaveHdipUser()
        setHdipUsers(prevState => {
          const newState = [...prevState];
          if (payload.name) newState[e.index].name = payload.name;
          if (payload.email) newState[e.index].user.email = payload.email;
          if (payload.phone) newState[e.index].user.phone = payload.phone;
          if (payload.role) newState[e.index].user.role = payload.role;
          if (payload.client_ids) newState[e.index].client = selectedClients;
          return newState;
        });
      })
      .catch(error => {
        setSavingHdip(false);
        if (error.response.data.errors) {
          const errorMessages = Object.entries(error.response.data.errors).map(([key, value]) => `${key}: ${value.join(', ')}`).join(', ');
          toast.error(errorMessages, { position: "top-right" });
        }
      });
  };

  const onSubmitClientUser = (data) => {
    setSavingClient(true);
    axios.post("/api/internal/internal-client-user/", {
      name: data.name,
      email: data.email,
      phone: "+91" + data.phone,
      accessibility: data.accessibility,
      role: data.role,
      internal_client_id: selectedInternalClient?.id
    })
      .then(res => {
        toast.success("Client User created successfully", { position: "top-right" })
        if (clientPage === 1) {
          fetchClientUsers();
        } else {
          setClientPage(1);
        }
        setSavingClient(false);
        handleAddClientUserClose();
      })
      .catch(error => {
        setSavingClient(false);
        if (error.response.data.errors) {
          const errorMessages = Object.entries(error.response.data.errors).map(([key, value]) => `${key}: ${value.join(', ')}`).join(', ');
          toast.error(errorMessages, { position: "top-right" });
        }
      });
  };

  const onEditClientUser = (data, e) => {
    setSavingClient(true);
    let payload = {};
    if (data.name !== e?.item?.name) payload.name = data.name;
    if (data.email !== e?.item?.user?.email) payload.email = data.email;
    if (data.phone !== e?.item?.user?.phone?.slice(3)) payload.phone = "+91" + data.phone;
    if (data.accessibility !== e?.item?.accessibility) payload.accessibility = data.accessibility;
    if (data.role !== e?.item?.user?.role) payload.role = data.role;
    if (selectedInternalClient?.id !== e?.item?.client?.id) payload.internal_client_id = selectedInternalClient?.id;

    axios.patch(`/api/internal/internal-client-user/${e?.item?.id}/`, payload)
      .then(res => {
        toast.success("Client User updated successfully", { position: "top-right" })
        setSavingClient(false);
        toggleSaveClientUser()
        setClientUsers(prevState => {
          const newState = [...prevState];
          if (payload.name) newState[e.index].name = payload.name;
          if (payload.email) newState[e.index].user.email = payload.email;
          if (payload.phone) newState[e.index].user.phone = payload.phone;
          if (payload.accessibility) newState[e.index].accessibility = payload.accessibility;
          if (payload.role) newState[e.index].user.role = payload.role;
          if (payload.internal_client_id) newState[e.index].client = selectedInternalClient;
          return newState;
        });
      })
      .catch(error => {
        setSavingClient(false);
        if (error.response.data.errors) {
          const errorMessages = Object.entries(error.response.data.errors).map(([key, value]) => `${key}: ${value.join(', ')}`).join(', ');
          toast.error(errorMessages, { position: "top-right" });
        }
      });
  };

  return (
    <div>
      <div>
        <div>
          <div className="flex items-center gap-x-5">
            <h1 className="text-sm font-semibold">CLIENT USERS</h1>

            <React.Fragment>
              <div>
                <button
                  className="border h-[32px] px-6 rounded-full bg-[#056DDC] font-medium text-white text-sm"
                  onClick={handleAddClientUserOpen}
                >
                  + Add
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
                  <div className='font-bold text-[#056DDC] text-lg text-center'>ADD CLIENT USER</div>
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
                  <form onSubmit={(e) => {
                    clientHandleSubmit(onSubmitClientUser)(e);
                    validateInternalClient();
                  }} >
                    <div className=" w-full flex-col flex items-center justify-center custom_lg:gap-2 md:gap-y-0 ">
                      <div className="p-1 flex flex-col items-start custom_lg:gap-2 md:gap-0 w-full">
                        <label className="w-1/4 text-sm font-medium text-gray-600">Client</label>
                        <InfiniteScrollSelect
                          apiEndpoint={`/api/internal/internal-client/`}
                          onSelect={(value) => {
                            setSelectedInternalClient(value);
                            hasInteracted.current = true; // Mark as interacted
                          }}
                          optionLabel='name'
                          placeholder='Select Client'
                          className="text-sm h-[29.6px]"
                          dropdownClassName="text-sm"
                        />
                        {clientErrors.internal_client && <span className="error-message">{clientErrors.internal_client.message}</span>}
                      </div>
                      <div className="p-1 flex flex-col items-start custom_lg:gap-2 md:gap-0 w-full">
                        <label className="w-1/4 text-sm font-medium text-[#6B6F7B]">User Name</label>
                        <input
                          type="text"
                          placeholder="Ashok Samal"
                          className="w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          {...clientRegister('name', { required: 'Name is required', maxLength: { value: 100, message: 'Name must be 100 characters or less' } })}
                        />
                        {clientErrors.name && <span className="error-message">{clientErrors.name.message}</span>}
                      </div>
                      <div className="p-1 flex flex-col items-start custom_lg:gap-2 md:gap-0 w-full">
                        <label className="w-1/4 text-sm font-medium text-[#6B6F7B]">Mail ID</label>
                        <input
                          type="text"
                          placeholder="rober@xyz.com"
                          className="w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          {...clientRegister('email', {
                            required: 'Email is required',
                            pattern: {
                              value: EMAIL_REGEX,
                              message: 'Please enter email with valid format'
                            }
                          })}
                        />
                        {clientErrors.email && <span className="error-message">{clientErrors.email.message}</span>}
                      </div>
                      <div className="p-1 flex flex-col items-start custom_lg:gap-2 md:gap-0 w-full">
                        <label className="w-full text-sm font-medium text-[#6B6F7B]">Phone Number</label>
                        <input
                          placeholder="9876543210"
                          className="w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          {...clientRegister('phone', {
                            required: 'Phone number is required',
                            pattern: {
                              value: MOBILE_REGEX,
                              message: 'Please enter valid phone number.'
                            }
                          })}
                        />
                        {clientErrors.phone && <span className="error-message">{clientErrors.phone.message}</span>}
                      </div>
                      <div className="p-1 flex flex-col items-start custom_lg:gap-2 md:gap-0 w-full">
                        <label className="w-1/4 text-sm font-medium text-[#6B6F7B]">Role</label>
                        <select
                          defaultValue={""}
                          className={`w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${clientGetValues("role") ? "text-black" : "text-gray-400"}`}
                          {...clientRegister("role", { required: "Please select role." })}
                        >
                          <option disabled value="">Select</option>
                          <option value="client_user" className="text-black">Client User</option>
                          <option value={"client_admin"} className="text-black">Client Admin</option>
                        </select>
                        {clientErrors.role && <span className="error-message">{clientErrors.role.message}</span>}
                      </div>
                      <div className="p-1 flex flex-col items-start custom_lg:gap-2 md:gap-0 w-full">
                        <label className=" text-sm font-medium text-[#6B6F7B]">Access</label>
                        <select
                          defaultValue={""}
                          className={`w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${clientGetValues("accessibility") ? "text-black" : "text-gray-400"}`}
                          {...clientRegister("accessibility", { required: "Please select access." })}
                        >
                          <option value="" disabled>Select Access</option>
                          <option value="AJ" className="text-black">All Jobs</option>
                          <option value="AGJ" className="text-black">Assigned Jobs</option>
                        </select>
                        {clientErrors.accessibility && <span className="error-message">{clientErrors.accessibility.message}</span>}
                      </div>
                    </div>
                    <DialogActions>
                      <Button disabled={savingClient} type="submit" sx={{ backgroundColor: "rgb(59, 130, 246)", color: "rgb(255, 255, 255)", borderRadius: "9999px" }} className="px-6 py-2 text-sm font-medium hover:bg-blue-600">
                        {savingClient ? (
                          <CircularProgress
                            size={24}
                            sx={{
                              color: "white", // Change this to any color you want
                            }}
                          />
                        ) : (
                          "SAVE"
                        )}
                      </Button>
                    </DialogActions>
                  </form>
                </DialogContent>
              </BootstrapDialog>
            </React.Fragment>


            {/* Search Input Section */}
            <div className="flex flex-col justify-end sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0 ml-auto">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full sm:w-80 border focus-within:border-blue-700">
                <input
                  type="text"
                  placeholder="Search users by name"
                  className="flex-1 bg-transparent text-gray-600 outline-none text-sm"
                  onChange={(e) => debouncedClientSearch(e.target.value)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table Headers */}
        <TableLoadingWrapper loading={loadingClient} data={clientUsers}>
          <div className="mt-4 overflow-y-auto text-xs">
            <div className="w-full grid grid-cols-[1fr_1fr_2fr_1fr_1fr_1fr_0.5fr] gap-2 font-semibold">
              <div className="pl-6 pr-4 p-2 w-full">CLIENT</div>
              <div className="px-4 p-2 w-full">USER</div>
              <div className="px-4 p-2 w-full">MAIL ID</div>
              <div className="px-4 p-2 w-full">PHONE NO</div>
              <div className="px-4 p-2 w-full">ROLE</div>
              <div className="px-4 p-2 w-full">ACCESS</div>
              <div className="pr-6 pl-4 p-2 w-full"></div>
            </div>

            {/* Mapping Dynamic Data */}
            <div ref={clientScrollRef} onScroll={handleClientScroll} style={{ maxHeight: '195px', overflowY: 'auto' }}>
              {clientUsers.map((item, index) => (
                <form key={item.email || index} onSubmit={(e) => {
                  e.index = index;
                  e.item = item;
                  clientHandleSubmit(onEditClientUser)(e);
                  validateInternalClient();
                }}>
                  <div
                    className={`${editClientUser === index ? "bg-none border border-black" : "bg-[#EBEBEB]"} grid grid-cols-[1fr_1fr_2fr_1fr_1fr_1fr_0.5fr]  mt-1 rounded-full items-center justify-center max-h-max`}
                  >
                    <div className="pl-5 pr-3 py-1 w-auto">
                      {editClientUser === index ?
                        <>
                          <InfiniteScrollSelect
                            apiEndpoint={`/api/internal/internal-client/`}
                            onSelect={(value) => {
                              setSelectedInternalClient(value);
                              hasInteracted.current = true; // Mark as interacted
                            }}
                            optionLabel='name'
                            placeholder='Select Client'
                            className="text-xs p-[4px]"
                            dropdownClassName="text-xs"
                            defaultValue={item?.client}
                          />
                          {clientErrors.internal_client && <span className="error-message">{clientErrors.internal_client.message}</span>}
                        </> : item?.client?.name}
                    </div>
                    <div className="px-3 py-1 w-auto">
                      {editClientUser === index ?
                        <>
                          <input
                            defaultValue={item?.name}
                            placeholder="Ashok Samal"
                            className="w-full p-1 text-xs border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            {...clientRegister('name', { required: 'Name is required', maxLength: { value: 100, message: 'Name must be 100 characters or less' } })}
                          />
                          {clientErrors.name && <span className="error-message">{clientErrors.name.message}</span>}
                        </> : item?.name}
                    </div>
                    <div className="px-3 py-1 w-auto">
                      {editClientUser === index ?
                        <>
                          <input
                            defaultValue={item?.user?.email}
                            placeholder="rober@xyz.com"
                            className="w-full p-1 text-xs border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            {...clientRegister('email', {
                              required: 'Email is required',
                              pattern: {
                                value: EMAIL_REGEX,
                                message: 'Please enter email with valid format'
                              }
                            })}
                          />
                          {clientErrors.email && <span className="error-message">{clientErrors.email.message}</span>}
                        </>
                        : item?.user?.email}
                    </div>
                    <div className="px-3 py-1 w-auto">
                      {editClientUser === index ?
                        <>
                          <input
                            defaultValue={item?.user?.phone?.slice(3)}
                            placeholder="9876543210"
                            className="w-full p-1 text-xs border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            {...clientRegister('phone', {
                              required: 'Phone number is required',
                              pattern: {
                                value: MOBILE_REGEX,
                                message: 'Please enter valid phone number.'
                              }
                            })}
                          />
                          {clientErrors.phone && <span className="error-message">{clientErrors.phone.message}</span>}
                        </>
                        : item?.user?.phone?.slice(3)}
                    </div>
                    <div className="px-3 py-1 w-auto">
                      {editClientUser === index ?
                        <>
                          <select
                            defaultValue={item?.user?.role}
                            className={`w-full p-1 text-xs border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black`}
                            {...clientRegister("role", { required: "Please select role." })}
                          >
                            <option disabled value="">Select</option>
                            <option value="client_user" className="text-black">Client User</option>
                            <option value={"client_admin"} className="text-black">Client Admin</option>
                          </select>
                          {clientErrors.role && <span className="error-message">{clientErrors.role.message}</span>}
                        </>
                        : USER_TYPE[item?.user?.role]}
                    </div>
                    <div className="px-3 py-1 w-auto">
                      {editClientUser === index ?
                        <>
                          <select
                            defaultValue={item?.accessibility}
                            className={`w-full p-1 text-xs border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black}`}
                            {...clientRegister("accessibility", { required: "Please select access." })}
                          >
                            <option value="" disabled>Select Access</option>
                            <option value="AJ" className="text-black">All Jobs</option>
                            <option value="AGJ" className="text-black">Assigned Jobs</option>
                          </select>
                          {clientErrors.accessibility && <span className="error-message">{clientErrors.accessibility.message}</span>}
                        </> : ACCESSIBILITY[item?.accessibility]}
                    </div>
                    <div className="px-4 py-1 w-full flex items-center justify-center">
                      {editClientUser === index ?
                        <div
                          className='flex items-center justify-center gap-x-2'
                        >
                          <button
                            className='py-1 px-2 rounded-lg font-bold bg-[#056DDC] text-white'
                            type="submit"
                          >Save</button>
                          <button
                            onClick={() => { toggleSaveClientUser() }}
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
                </form>
              ))}
            </div>
          </div>
        </TableLoadingWrapper>
      </div>

      <div className="mt-[42px]" >
        <div>
          <div className="flex items-center gap-x-5">
            <h1 className="text-sm font-semibold">HDIP USERS</h1>
            <React.Fragment>
              <div>
                <button
                  className="border h-[32px] px-6 rounded-full bg-[#056DDC] font-medium text-white text-sm"
                  onClick={handleAddHdipUserOpen}
                >
                  + Add
                </button>
              </div>
              <BootstrapDialog
                onClose={handleAddHdipUserClose}
                aria-labelledby="add-poc-dialog-title"
                open={addHdipUser}
                BackdropProps={{
                  sx: {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)'
                  },
                }}
              >
                <DialogTitle sx={{ m: 0, p: 2 }} id="add-poc-dialog-title">
                  <div className='font-bold text-[#056DDC] text-lg text-center'>ADD HDIP USER</div>
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
                  <form onSubmit={(e) => {
                    handleSubmit(onSubmitHdipUser)(e);
                    validateClients();
                  }}>
                    <div>
                      <div className="p-1 flex flex-col items-start justify-center gap-2">
                        <label className="w-full text-sm font-medium text-gray-600">Name</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="p-1 text-sm w-full border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          {...register('name', { required: 'Name is required', maxLength: { value: 255, message: 'Name must be 255 characters or less' } })}
                        />
                        {errors.name && <span className="error-message">{errors.name.message}</span>}
                      </div>
                      <div className="p-1 flex flex-col items-start justify-center gap-2">
                        <label className="w-full text-sm font-medium text-[#6B6F7B]">Access</label>
                        <select
                          {...register('access', { required: 'Access is required' })}
                          className={`w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${getValues("access") ? "text-black" : "text-gray-500"}`}
                          defaultValue=""
                        >
                          <option value="" disabled>Select Access</option>
                          <option value="admin" className="text-black">Admin</option>
                          <option value="moderator" className="text-black">Moderator</option>
                        </select>
                        {errors.access && <span className="error-message">{errors.access.message}</span>}
                      </div>
                      <div className="p-1 flex flex-col items-start justify-center gap-2">
                        <label className="w-full text-sm font-medium text-[#6B6F7B]">Mail ID</label>
                        <input
                          placeholder="rober@xyz.com"
                          className="p-1 text-sm w-full border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          {...register('email', {
                            required: 'Email is required',
                            pattern: {
                              value: EMAIL_REGEX,
                              message: 'Please enter email with valid format'
                            }
                          })}
                        />
                        {errors.email && <span className="error-message">{errors.email.message}</span>}
                      </div>
                      <div className="p-1 flex flex-col items-start justify-center gap-2">
                        <label className="w-full text-sm font-medium text-[#6B6F7B]">Phone Number</label>
                        <input
                          placeholder="9876543210"
                          className="p-1 text-sm w-full border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          {...register('phone', {
                            required: 'Phone number is required',
                            pattern: {
                              value: MOBILE_REGEX,
                              message: 'Please enter valid phone number.'
                            }
                          })}
                        />
                        {errors.phone && <span className="error-message">{errors.phone.message}</span>}
                      </div>
                      <div className="p-1 flex flex-col items-start justify-center gap-2">
                        <label className="w-full text-sm font-medium text-[#6B6F7B]">Client</label>
                        <InfiniteScrollSelect
                          apiEndpoint={`/api/internal/internal-client/`}
                          onSelect={(value) => {
                            handleClientSelection(value);
                          }}
                          optionLabel='name'
                          placeholder='Select Client'
                          className='h-[29.6px] text-sm'
                          dropdownClassName='text-sm'
                          changeValue={false}
                        />
                        {errors.client && <span className="error-message">{errors.client.message}</span>}
                        {selectedClients.length > 0 &&
                          <div className=' mt-[8px] w-[300px] gap-x-4'>
                            <ul className='flex flex-wrap justify-start gap-2 items-center text-sm' > {selectedClients.map((item, index) => (<li key={index} className=" flex justify-center items-center h-[32px] border border-[#49454F] pl-1 pr-1 rounded-lg  text-[#49454F]  "> {item?.name} <button
                              onClick={(e) => {
                                e.preventDefault();
                                removeSkill(item);
                              }}
                              className='pl-2' ><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.8 11.25L0.75 10.2L4.95 6L0.75 1.8L1.8 0.75L6 4.95L10.2 0.75L11.25 1.8L7.05 6L11.25 10.2L10.2 11.25L6 7.05L1.8 11.25Z" fill="#49454F" />
                              </svg>
                            </button> </li>))} </ul>
                          </div>}
                      </div>
                    </div>
                    <DialogActions>
                      <Button disabled={savingHdip} type="submit" sx={{ backgroundColor: "rgb(59, 130, 246)", color: "rgb(255, 255, 255)", borderRadius: "9999px" }} className="px-6 py-2 text-sm font-medium hover:bg-blue-600">
                        {savingHdip ? (
                          <CircularProgress
                            size={24}
                            sx={{
                              color: "white", // Change this to any color you want
                            }}
                          />
                        ) : (
                          "SAVE"
                        )}
                      </Button>
                    </DialogActions>
                  </form>
                </DialogContent>
              </BootstrapDialog>
            </React.Fragment>


            {/* Search Input Section */}
            <div className="flex flex-col justify-end sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0 ml-auto">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full sm:w-80 border focus-within:border-blue-700">
                <input
                  type="text"
                  placeholder="Search users by name"
                  className="flex-1 bg-transparent text-gray-600 outline-none text-sm"
                  onChange={(e) => debouncedHdipSearch(e.target.value)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table Headers */}
        <TableLoadingWrapper loading={loadingHdip} data={hdipUsers}>
          <div className="mt-4 overflow-y-auto text-xs">
            <div className="w-full grid grid-cols-[1fr_1fr_2fr_1fr_1fr_0.5fr] gap-2 font-semibold">
              <div className="pl-6 pr-4 p-2 w-full">NAME</div>
              <div className="px-4 p-2 w-full">ROLE</div>
              <div className="px-4 p-2 w-full">EMAIL</div>
              <div className="px-4 p-2 w-full">PHONE NO</div>
              <div className="px-4 p-2 w-full">CLIENT</div>
              <div className="pr-6 pl-4 p-2 w-full"></div>
            </div>

            {/* Mapping Dynamic Data */}
            <div ref={hdipScrollRef} onScroll={handleHdipScroll} style={{ maxHeight: '195px', overflowY: 'auto' }}>
              {hdipUsers.map((item, index) => (
                <form key={item.email || index} onSubmit={(e) => {
                  e.index = index;
                  e.item = item;
                  handleSubmit(onEditHdipUser)(e);
                  validateClients();
                }}>
                  <div
                    className={`${editHdipUser === index ? "bg-none border border-black" : "bg-[#EBEBEB]"} grid grid-cols-[1fr_1fr_2fr_1fr_1fr_0.5fr] mt-1 rounded-full items-center justify-center max-h-max`}
                  >
                    <div className="px-3 py-1 w-auto">
                      {editHdipUser === index ? (
                        <>
                          <input
                          defaultValue={item?.name}
                            type="text"
                            placeholder="John Doe"
                            className="p-1 text-sm w-full border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            {...register('name', { required: 'Name is required', maxLength: { value: 255, message: 'Name must be 255 characters or less' } })}
                          />
                          {errors.name && <span className="error-message">{errors.name.message}</span>}
                        </>
                      ) : item?.name}
                    </div>
                    <div className="px-3 py-1 w-auto">
                      {editHdipUser === index ? (
                        <>
                          <select
                            {...register('access', { required: 'Access is required' })}
                            className={`w-full p-1 text-sm border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${getValues("access") ? "text-black" : "text-gray-500"}`}
                            defaultValue={item?.user?.role}
                          >
                            <option value="" disabled>Select Access</option>
                            <option value="admin" className="text-black">Admin</option>
                            <option value="moderator" className="text-black">Moderator</option>
                          </select>
                          {errors.access && <span className="error-message">{errors.access.message}</span>}
                        </>
                      ) : item?.user?.role?.charAt(0).toUpperCase() + item?.user?.role?.slice(1)}
                    </div>
                    <div className="px-3 py-1 w-auto">
                      {editHdipUser === index ? (
                        <>
                          <input
                          defaultValue={item?.user?.email}
                            placeholder="rober@xyz.com"
                            className="p-1 text-sm w-full border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            {...register('email', {
                              required: 'Email is required',
                              pattern: {
                                value: EMAIL_REGEX,
                                message: 'Please enter email with valid format'
                              }
                            })}
                          />
                          {errors.email && <span className="error-message">{errors.email.message}</span>}
                        </>
                      ) : item?.user?.email}
                    </div>
                    <div className="px-3 py-1 w-auto">
                      {editHdipUser === index ? (
                        <>
                          <input
                          defaultValue={item?.user?.phone?.slice(3)}
                            placeholder="9876543210"
                            className="p-1 text-sm w-full border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            {...register('phone', {
                              required: 'Phone number is required',
                              pattern: {
                                value: MOBILE_REGEX,
                                message: 'Please enter valid phone number.'
                              }
                            })}
                          />
                          {errors.phone && <span className="error-message">{errors.phone.message}</span>}
                        </>
                      ) : item?.user?.phone}
                    </div>
                    <div className="px-3 py-1 w-auto">
                      {editHdipUser === index ? (
                        <>
                          <InfiniteScrollSelect
                            apiEndpoint={`/api/internal/internal-client/`}
                            onSelect={(value) => {
                              handleClientSelection(value);
                            }}
                            optionLabel='name'
                            placeholder='Select Client'
                            className='h-[29.6px] text-sm'
                            dropdownClassName='text-sm'
                            changeValue={false}
                          />
                          {errors.client && <span className="error-message">{errors.client.message}</span>}
                          {selectedClients.length > 0 &&
                            <div className=' mt-[8px] w-[300px] gap-x-4'>
                              <ul className='flex flex-wrap justify-start gap-2 items-center text-sm' > {selectedClients.map((item, index) => (<li key={index} className=" flex justify-center items-center h-[32px] border border-[#49454F] pl-1 pr-1 rounded-lg  text-[#49454F]  "> {item?.name} <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeSkill(item);
                                }}
                                className='pl-2' ><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1.8 11.25L0.75 10.2L4.95 6L0.75 1.8L1.8 0.75L6 4.95L10.2 0.75L11.25 1.8L7.05 6L11.25 10.2L10.2 11.25L6 7.05L1.8 11.25Z" fill="#49454F" />
                                </svg>
                              </button> </li>))} </ul>
                            </div>}
                        </>
                      ) : item?.client?.map(client => client?.name)?.join(', ')}
                    </div>

                    <div className="px-4 py-1 w-full flex items-center justify-center">
                      {editHdipUser === index ?
                        <div
                          className='flex items-center justify-center gap-x-2'
                        >
                          <button
                            className='py-1 px-2 rounded-lg font-bold bg-[#056DDC] text-white'
                            type="submit"
                          >Save</button>
                          <button
                            onClick={() => { toggleSaveHdipUser() }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                          </button>


                        </div>

                        :
                        <button
                          className="p-1 bg-gray-200 shadow-md hover:bg-gray-300 rounded-lg"
                          onClick={() => { toggleEditHdipUser(index) }}
                        >
                          <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 21H8.425L18.2 11.225L16.775 9.8L7 19.575V21ZM5 23V18.75L18.2 5.575C18.4 5.39167 18.6208 5.25 18.8625 5.15C19.1042 5.05 19.3583 5 19.625 5C19.8917 5 20.15 5.05 20.4 5.15C20.65 5.25 20.8667 5.4 21.05 5.6L22.425 7C22.625 7.18333 22.7708 7.4 22.8625 7.65C22.9542 7.9 23 8.15 23 8.4C23 8.66667 22.9542 8.92083 22.8625 9.1625C22.7708 9.40417 22.625 9.625 22.425 9.825L9.25 23H5ZM17.475 10.525L16.775 9.8L18.2 11.225L17.475 10.525Z" fill="#65558F" />
                          </svg>

                        </button>
                      }
                    </div>
                  </div>
                </form>
              ))}
            </div>
          </div>
        </TableLoadingWrapper>
      </div>


    </div>
  );
}

export { Users as InternalUsers };
