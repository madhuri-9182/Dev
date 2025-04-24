import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { CircularProgress } from '@mui/material';
import toast from "react-hot-toast";
import axios from '../../api/axios';
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from 'react-hook-form';
import InfiniteScrollSelect from "../../utils/InfiniteScrollSelect";
import { EMAIL_REGEX, MOBILE_REGEX, WEBSITE_REGEX } from "../Constants/constants";
import Modal from "../shared/Modal";
import { Edit, Trash } from "iconsax-react";

function AddClient() {
    const [rows, setRows] = useState([]);
    const [pocDialogOpen, setPocDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [assignedTo, setAssignedTo] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const { isEditing, clientData } = useMemo(() => ({
        isEditing: state?.isEditing || false,
        clientData: state?.clientData || null
    }), [state]);

    const hasInteracted = useRef(false); // Ref to track if the user has interacted with the form
    const formInitialized = useRef(false); // Ref to track if form has been initialized with existing data
    const { register, handleSubmit, formState: { errors }, setError, clearErrors, setValue } = useForm();

    // POC form using React Hook Form
    const {
        register: registerPoc,
        handleSubmit: handleSubmitPoc,
        formState: { errors: pocErrors },
        reset: resetPocForm,
        setValue: setPocValue
    } = useForm();

    // Fetch client data if in edit mode
    useEffect(() => {
        if (clientData && !formInitialized.current) {
            // Prefill form data
            setValue("name", clientData?.name);
            setValue("website", clientData?.website);
            setValue("domain", clientData?.domain);
            setValue("gstin", clientData?.gstin);
            setValue("pan", clientData?.pan);
            setValue("client_level", clientData?.client_level?.toString());
            setValue("is_signed", `${clientData?.is_signed}`);
            setValue("address", clientData?.address);
            setAssignedTo(clientData?.assigned_to?.id);

            // Set POC rows
            if (clientData?.points_of_contact && clientData?.points_of_contact.length > 0) {
                const formattedPocs = clientData?.points_of_contact.map(poc => ({
                    name: poc.name,
                    email: poc.email,
                    phone: poc.phone ? poc.phone.replace('+91', '') : '',
                    id: poc.id
                }));
                setRows(formattedPocs);
            }

            // Mark form as initialized with data
            formInitialized.current = true;
            
            // Clear any pre-existing errors for fields populated with valid data
            if (clientData?.assigned_to?.id) {
                clearErrors("assigned_to");
            }
            
            if (clientData?.points_of_contact && clientData?.points_of_contact.length > 0) {
                clearErrors("poc");
            }
        }
    }, [clientData, setValue, clearErrors]);

    const validateAssignTo = useCallback(() => {
        if (!assignedTo) {
            setError("assigned_to", { type: "manual", message: "Please select a user." });
            return false;
        } else {
            clearErrors("assigned_to");
            return true;
        }
    }, [assignedTo, setError, clearErrors]);

    const validatePOC = useCallback(() => {
        if (rows?.length === 0) {
            setError("poc", { type: "manual", message: "Please add at least one point of contact." });
            return false;
        } else {
            clearErrors("poc");
            return true;
        }
    }, [rows, setError, clearErrors]);

    useEffect(() => {
        // Only validate if form has been interacted with or if we're in edit mode and form is initialized
        if (hasInteracted.current || (isEditing && formInitialized.current)) {
            validateAssignTo();
        }
    }, [assignedTo, validateAssignTo, isEditing]);

    useEffect(() => {
        // Only validate if form has been interacted with or if we're in edit mode and form is initialized
        if (hasInteracted.current || (isEditing && formInitialized.current)) {
            validatePOC();
        }
    }, [rows, validatePOC, isEditing]);

    const handleOpenPocDialog = (e, row = null, index = null) => {
        e.preventDefault();
        if (row) {
            setSelectedRow({ ...row, index });
            // Pre-fill form values for editing
            setPocValue("pocName", row.name);
            setPocValue("pocPhone", row.phone);
            setPocValue("pocEmail", row.email);
        } else {
            setSelectedRow(null);
            resetPocForm(); // Reset form when adding new POC
        }
        setPocDialogOpen(true);
    };

    const handleClosePocDialog = () => {
        setPocDialogOpen(false);
        setSelectedRow(null);
        resetPocForm();
    };

    const handlePocSubmit = (data) => {
        if (selectedRow) {
            // Update existing POC
            const updatedRows = rows.map((row, index) => {
                if (index === selectedRow.index) {
                    return {
                        name: data.pocName,
                        phone: data.pocPhone,
                        email: data.pocEmail
                    };
                }
                return row;
            });
            setRows(updatedRows);
        } else {
            // Add new POC
            setRows([...rows, {
                name: data.pocName,
                phone: data.pocPhone,
                email: data.pocEmail
            }]);
        }
        handleClosePocDialog();
        hasInteracted.current = true; // Mark form as interacted with when POCs are added/edited
    };

    const handleDeletePoc = (e, index) => {
        e.preventDefault();
        setRows((prevRows) => prevRows.filter((_, idx) => idx !== index));
        hasInteracted.current = true; // Mark form as interacted with when POCs are deleted
    };

    const onSubmit = async (data) => {
        // Run validations first
        const isAssignToValid = validateAssignTo();
        const isPocValid = validatePOC();
        
        if (!isAssignToValid || !isPocValid) {
            return; // Stop submission if validations fail
        }
        
        try {
            setLoading(true);
            
            const formattedPocs = rows.map((row) => {
                const formattedPoc = {
                  name: row.name,
                  email: row.email,
                  phone: row.phone.startsWith("+91")
                    ? row.phone
                    : `+91${row.phone}`,
                };
                
                if (row.id) {
                  formattedPoc.poc_id = row.id;
                }
                
                return formattedPoc;
              });
            
            if (isEditing && clientData?.id) {
                // Use PATCH for updating
                let payload = {};
                
                // Only add these fields if they have changed
                if (data.name !== clientData?.name) payload.name = data.name;
                if (data.website !== clientData?.website) payload.website = data.website;
                if (data.domain !== clientData?.domain) payload.domain = data.domain;
                if (data.gstin !== clientData?.gstin) payload.gstin = data.gstin;
                if (data.pan !== clientData?.pan) payload.pan = data.pan;
                if (data.client_level !== clientData?.client_level?.toString()) {
                    payload.client_level = parseInt(data.client_level);
                }
                if (data.is_signed !== String(clientData?.is_signed)) {
                    payload.is_signed = data.is_signed === "true";
                }
                if (data.address !== clientData?.address) payload.address = data.address;
                
                // Always include assigned_to and points_of_contact in the payload
                payload.assigned_to = assignedTo;
                payload.points_of_contact = formattedPocs;
                
                await axios.patch(`/api/internal/internal-client/${clientData?.id}/`, payload);
                toast.success("Client updated successfully", { position: "top-right" });
            } else {
                // Use POST for creating
                const payload = {
                    // Always include these required fields in a new client
                    name: data.name,
                    website: data.website,
                    domain: data.domain,
                    gstin: data.gstin,
                    pan: data.pan,
                    client_level: parseInt(data.client_level),
                    is_signed: data.is_signed === "true",
                    address: data.address,
                    assigned_to: assignedTo,
                    points_of_contact: formattedPocs
                };
                
                await axios.post("/api/internal/internal-client/", payload);
                toast.success("Client added successfully", { position: "top-right" });
            }
    
            navigate("/internal/clients");
        } catch (error) {
            let errorMessages;
            if (error?.response?.data?.errors?.errors) {
                errorMessages = Object.entries(error.response.data.errors.errors).flatMap(([key, values]) => values.map(value => `${key}: ${value}`));
            } else if (error?.response?.data?.errors) {
                errorMessages = Object.entries(error.response.data.errors).flatMap(([rowNo, errors]) => Object.entries(errors).flatMap(([errorKey, errorValues]) => errorValues.map(errorValue => `Row No. ${rowNo} - ${errorKey}: ${errorValue}`)));
            }
            toast.error(errorMessages?.join(', ') || (isEditing ? "Failed to update client" : "Failed to add client"), { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = (e) => {
        hasInteracted.current = true; // Mark as interacted during submission attempt
        
        // Run validations and then submit
        handleSubmit(onSubmit)(e);
    };

    return (
        <React.Fragment>
            <div>
                {location.pathname === "/internal/clients/addclient" && (
                    <form onSubmit={handleFormSubmit}>
                        <div>
                            <div className="text-xl font-bold mb-6">{isEditing ? "Edit Client" : "Add Client"}</div>
                            <ul className="flex flex-col gap-y-2">
                                <li className="flex items-center">
                                    <label className="text-[#6B6F7B] font-bold text-xs w-1/5 px-4 required-field-label">Client Registered Name</label>
                                    <div>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Enter Client Name"
                                            {...register("name", {
                                                required: "Client Name is required",
                                                maxLength: { value: 255, message: "Name must be less than 255 characters." }
                                            })}
                                            className="block w-[360px] h-[32px] border border-gray-300 rounded-lg shadow-sm text-xs text-center px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {errors.name && <span className="error-message">{errors.name.message}</span>}
                                    </div>
                                </li>
                                <li className="flex items-center">
                                    <label className="text-[#6B6F7B] font-bold text-xs w-1/5 px-4 required-field-label">Website</label>
                                    <div>
                                        <input
                                            name="website"
                                            placeholder="Enter Web Address"
                                            {...register("website", {
                                                required: "Website is required",
                                                pattern: { value: WEBSITE_REGEX, message: "Website must be a valid URL." }
                                            })}
                                            className="block w-[360px] h-[32px] border border-gray-300 rounded-lg shadow-sm text-xs text-center px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {errors.website && <span className="error-message">{errors.website.message}</span>}
                                    </div>
                                </li>
                                <li className="flex items-center">
                                    <label className="text-[#6B6F7B] font-bold text-xs w-1/5 px-4 required-field-label">Domain</label>
                                    <div>
                                        <input
                                            type="text"
                                            name="domain"
                                            placeholder="Enter Domain Name"
                                            {...register("domain", {
                                                required: "Domain is required",
                                                maxLength: { value: 255, message: "Domain must be less than 255 characters." }
                                            })}
                                            className="block w-[360px] h-[32px] border border-gray-300 rounded-lg shadow-sm text-xs text-center px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {errors.domain && <span className="error-message">{errors.domain.message}</span>}
                                    </div>
                                </li>
                                <li className="flex items-center">
                                    <label className="text-[#6B6F7B] font-bold text-xs w-1/5 px-4 required-field-label">GSTIN</label>
                                    <div>
                                        <input
                                            type="text"
                                            name="gstin"
                                            placeholder="Enter GSTIN"
                                            {...register("gstin", {
                                                required: "GSTIN is required",
                                                pattern: { value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, message: "GSTIN must be in the format 22AAAAA0000A1Z5" }
                                            })}
                                            className="block w-[360px] h-[32px] border border-gray-300 rounded-lg shadow-sm text-xs text-center px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {errors.gstin && <span className="error-message">{errors.gstin.message}</span>}
                                    </div>
                                </li>
                                <li className="flex items-center">
                                    <label className="text-[#6B6F7B] font-bold text-xs w-1/5 px-4 required-field-label">PAN</label>
                                    <div>
                                        <input
                                            type="text"
                                            name="pan"
                                            placeholder="Enter PAN"
                                            {...register("pan", {
                                                required: "PAN is required",
                                                pattern: { value: /[A-Z]{5}[0-9]{4}[A-Z]{1}/, message: "PAN must be in the format ABCDE1234F." }
                                            })}
                                            className="block w-[360px] h-[32px] border border-gray-300 rounded-lg shadow-sm text-xs text-center px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {errors.pan && <span className="error-message">{errors.pan.message}</span>}
                                    </div>
                                </li>
                                <li className="flex items-center">
                                    <label className="text-[#6B6F7B] font-bold text-xs w-1/5 px-4 required-field-label">Client Level</label>
                                    <div>
                                        <select
                                            name="client_level"
                                            defaultValue={""}
                                            {...register("client_level", { required: "Client Level is required." })}
                                            className="block w-[360px] h-[32px] border border-gray-300 rounded-lg shadow-sm text-xs text-center px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option disabled value="">Select</option>
                                            <option value={"1"}>1</option>
                                            <option value={"2"}>2</option>
                                            <option value={"3"}>3</option>
                                        </select>
                                        {errors.client_level && <span className="error-message">{errors.client_level.message}</span>}
                                    </div>
                                </li>
                                <li className="flex items-center">
                                    <label className="text-[#6B6F7B] font-bold text-xs w-1/5 px-4 required-field-label">Signed/Not Signed</label>
                                    <div>
                                        <select
                                            name="is_signed"
                                            defaultValue={""}
                                            {...register("is_signed", { required: "Please select Signed or Not Signed." })}
                                            className="block w-[360px] h-[32px] border border-gray-300 rounded-lg shadow-sm text-xs text-center px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option disabled value="">Select</option>
                                            <option value={"true"}>Signed</option>
                                            <option value={"false"}>Not Signed</option>
                                        </select>
                                        {errors.is_signed && <span className="error-message">{errors.is_signed.message}</span>}
                                    </div>
                                </li>
                                <li className="flex items-center">
                                    <label className="text-[#6B6F7B] font-bold text-xs w-1/5 px-4 required-field-label">Assigned To</label>
                                    <div>
                                        <InfiniteScrollSelect
                                            apiEndpoint={`/api/internal/hdip-users/`}
                                            onSelect={(value) => {
                                                setAssignedTo(value?.id);
                                                hasInteracted.current = true; // Mark as interacted
                                                clearErrors("assigned_to"); // Clear error when value is selected
                                            }}
                                            optionLabel='name'
                                            placeholder='Select User'
                                            className="text-[12px] h-[32px] min-w-[360px] text-center justify-center"
                                            dropdownClassName="text-[12px]"
                                            defaultValue={clientData?.assigned_to}
                                            initialValue={clientData?.assigned_to?.id}
                                        />
                                        {errors.assigned_to && <span className="error-message">{errors.assigned_to.message}</span>}
                                    </div>
                                </li>
                                <li className="flex items-center">
                                    <label className="text-[#6B6F7B] font-bold text-xs w-1/5 px-4 required-field-label">Address</label>
                                    <div>
                                        <textarea
                                            name="address"
                                            placeholder="Add Address"
                                            {...register("address", {
                                                required: "Address is required",
                                                maxLength: { value: 255, message: "Address must be less than 255 characters." }
                                            })}
                                            className="block w-[360px] h-[114px] border border-gray-300 rounded-lg shadow-sm text-xs px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {errors.address && <span className="error-message">{errors.address.message}</span>}
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="p-6 rounded-md w-full mt-6">
                            <div className="flex items-center gap-x-5 mb-4">
                                <div className="relative group inline-block">
                                    {/* Always visible text */}
                                    <div className="text-sm font-semibold text-black required-field-label">POC</div>

                                    {/* Tooltip */}
                                    <div
                                        className="absolute left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
                                    >
                                        Point of Contact
                                    </div>
                                </div>

                                <button
                                    className="border p-2 px-4 rounded-full bg-purple-200 font-medium text-sm"
                                    onClick={(e) => handleOpenPocDialog(e)}
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
                                        <div className="col-span-1 flex items-center gap-x-3">
                                               <Edit
                                                size={18}
                                                color="#171717"
                                                className="hover:scale-110 hover:duration-150 cursor-pointer"
                                                onClick={(e) => handleOpenPocDialog(e, row, index)}
                                               />
                                                <Trash
                                                size={18}
                                                color="#F00"
                                                className={`hover:scale-110 hover:duration-150 cursor-pointer ${!isEditing || index !== 0 ? "" : "invisible"}`}
                                                onClick={(e) => handleDeletePoc(e, index)}
                                                />
                                        </div>
                                    </div>
                                ))}
                                {errors.poc && <span className="error-message">{errors.poc.message}</span>}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button disabled={loading} type="submit" className="primary-button">
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
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
            <Modal isOpen={pocDialogOpen} onClose={handleClosePocDialog} title={selectedRow ? 'Edit POC' : 'Add POC'}>
                <form onSubmit={handleSubmitPoc(handlePocSubmit)}>
                    <div className="flex-col flex custom_lg:gap-2 md:gap-y-0">
                        <div className="p-1 flex flex-col items-start justify-center">
                            <label className="w-full text-sm font-medium text-[#6B6F7B] required-field-label">POC Name</label>
                            <input
                                type="text"
                                placeholder="Enter POC Name"
                                {...registerPoc("pocName", {
                                    required: "POC Name is required",
                                    maxLength: { value: 255, message: "Name must be between 1 and 255 characters." }
                                })}
                                className="p-1 text-sm w-full border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {pocErrors.pocName && <span className="error-message">{pocErrors.pocName.message}</span>}
                        </div>
                        <div className="p-1 flex flex-col items-start justify-center">
                            <label className="w-full text-sm font-medium text-[#6B6F7B] required-field-label">Phone Number</label>
                            <input
                                type="text"
                                placeholder="Enter Phone Number"
                                {...registerPoc("pocPhone", {
                                    required: "Phone number is required",
                                    pattern: {
                                        value: MOBILE_REGEX,
                                        message: "Phone number must be exactly 10 digits."
                                    }
                                })}
                                className="p-1 text-sm w-full border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {pocErrors.pocPhone && <span className="error-message">{pocErrors.pocPhone.message}</span>}
                        </div>
                        <div className="p-1 flex flex-col items-start justify-center">
                            <label className="w-full text-sm font-medium text-[#6B6F7B] required-field-label">Mail ID</label>
                            <input
                                type="email"
                                placeholder="Enter Mail ID"
                                {...registerPoc("pocEmail", {
                                    required: "Email is required",
                                    pattern: {
                                        value: EMAIL_REGEX,
                                        message: "Email must be in the correct format."
                                    }
                                })}
                                className="p-1 text-sm w-full border text-center border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {pocErrors.pocEmail && <span className="error-message">{pocErrors.pocEmail.message}</span>}
                        </div>
                    </div>
                    <div className="flex flex-row-reverse" >
                        <button
                            type="submit"
                            className="primary-button mt-3"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </Modal>
        </React.Fragment>
    );
}

export default AddClient;