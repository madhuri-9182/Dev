import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { CircularProgress } from '@mui/material';
import toast from "react-hot-toast";
import axios from '../../api/axios';
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from 'react-hook-form';
import InfiniteScrollSelect from "../../utils/InfiniteScrollSelect";
import { EMAIL_REGEX, MOBILE_REGEX } from "../Constants/constants";
import Modal from "../shared/Modal";

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
        if (clientData) {
            // Prefill form data
            setValue("name", clientData?.name);
            setValue("website", clientData?.website);
            setValue("domain", clientData?.domain);
            setValue("gstin", clientData?.gstin);
            setValue("pan", clientData?.pan);
            setValue("is_signed", `${clientData?.is_signed}`);
            setValue("address", clientData?.address);
            setAssignedTo(clientData?.assigned_to?.id);

            // Set POC rows
            if (clientData?.points_of_contact && clientData?.points_of_contact.length > 0) {
                const formattedPocs = clientData?.points_of_contact.map(poc => ({
                    name: poc.name,
                    email: poc.email,
                    phone: poc.phone ? poc.phone.replace('+91', '') : ''
                }));
                setRows(formattedPocs);
            }
        }
    }, [clientData, setValue]);

    const validateAssignTo = useCallback(() => {
        if (!assignedTo) {
            setError("assigned_to", { type: "manual", message: "Please select a user." });
        } else {
            clearErrors("assigned_to");
        }
    }, [assignedTo, setError, clearErrors]);

    const validatePOC = useCallback(() => {
        if (rows?.length === 0) {
            setError("poc", { type: "manual", message: "Please add at least one point of contact." });
        } else {
            clearErrors("poc");
        }
    }, [rows, setError, clearErrors]);

    useEffect(() => {
        // Revalidate if the user has interacted
        if (hasInteracted.current) {
            validateAssignTo();
        }
    }, [assignedTo, validateAssignTo]);

    useEffect(() => {
        // Revalidate if the user has interacted
        if (hasInteracted.current) {
            validatePOC();
        }
    }, [rows, validatePOC]);

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
    };

    const handleDeletePoc = (e, index) => {
        e.preventDefault();
        setRows((prevRows) => prevRows.filter((_, idx) => idx !== index));
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const payload = {
                // Only include fields that have changed
            };

            // Check for changes and add to payload
            if (data.name !== clientData?.name) payload.name = data.name;
            if (data.website !== clientData?.website) payload.website = data.website;
            if (data.domain !== clientData?.domain) payload.domain = data.domain;
            if (data.gstin !== clientData?.gstin) payload.gstin = data.gstin;
            if (data.pan !== clientData?.pan) payload.pan = data.pan;
            if (data.is_signed !== clientData?.is_signed) payload.is_signed = data.is_signed === "true";
            if (data.address !== clientData?.address) payload.address = data.address;
            if (assignedTo !== clientData?.assigned_to?.id) payload.assigned_to = assignedTo;

            // Check for changes in points of contact
            payload.points_of_contact = rows.map(row => ({ ...row, phone: `+91${row.phone}` }));

            if (isEditing && clientData?.id) {
                // Use PATCH for updating
                await axios.patch(`/api/internal/internal-client/${clientData?.id}/`, payload);
                toast.success("Client updated successfully", { position: "top-right" });
            } else {
                // Use POST for creating
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

    return (
        <React.Fragment>
            <div>
                {location.pathname === "/internal/clients/addclient" && (
                    <form onSubmit={(e) => {
                        handleSubmit(onSubmit)(e);
                        validateAssignTo();
                        validatePOC();
                    }}>
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
                                                pattern: { value: /^https?:\/\/.+/, message: "Website must be a valid URL." }
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
                                            }}
                                            optionLabel='name'
                                            placeholder='Select User'
                                            className="text-[12px] h-[32px] min-w-[360px] text-center justify-center"
                                            dropdownClassName="text-[12px]"
                                            defaultValue={clientData?.assigned_to}
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
                                        <div className="col-span-1 flex items-center space-x-2">
                                            <button
                                                className="flex items-center justify-center hover:bg-blue-100 hover:duration-300 p-2 rounded-xl"
                                                onClick={(e) => handleOpenPocDialog(e, row, index)}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.1665 1.6665H7.49984C3.33317 1.6665 1.6665 3.33317 1.6665 7.49984V12.4998C1.6665 16.6665 3.33317 18.3332 7.49984 18.3332H12.4998C16.6665 18.3332 18.3332 16.6665 18.3332 12.4998V10.8332" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M13.3666 2.51688L6.7999 9.08354C6.5499 9.33354 6.2999 9.82521 6.2499 10.1835L5.89157 12.6919C5.75823 13.6002 6.3999 14.2335 7.30823 14.1085L9.81657 13.7502C10.1666 13.7002 10.6582 13.4502 10.9166 13.2002L17.4832 6.63354C18.6166 5.50021 19.1499 4.18354 17.4832 2.51688C15.8166 0.850211 14.4999 1.38354 13.3666 2.51688Z" stroke="#171717" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M12.4248 3.4585C12.9831 5.45016 14.5415 7.0085 16.5415 7.57516" stroke="#171717" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                            <button onClick={(e) => handleDeletePoc(e, index)} className="p-2 text-gray-500 hover:text-red-500">
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