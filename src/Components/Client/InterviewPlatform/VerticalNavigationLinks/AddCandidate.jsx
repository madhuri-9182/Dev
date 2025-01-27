import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

function AddCandidate() {

    const navigate = useNavigate();
    const [selectedFilters, setSelectedFilters] = useState({
        role: "All",
        fun: "All",
        source: "All"
    });

    const role = ["SDE II", "SDE III", "SDET I", "EM", "SDE I - Frontend", "SDE II - Frontend"];
    const fun = ["All", "Frontend", "Backend"];
    const source = ["All", "Agency", "Client"]

    const handleSelect = (category, value) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [category]: value,
        }));
    };

    const [data, setData] = useState([
        {
            name: "John Smith",
            experience: "7 Years 3 Months",
            mobile: "1234567890",
            email: "john.smith@example.com",
            company: "Abc Corp",
        },
        {
            name: "Emma Johnson",
            experience: "5 Years 6 Months",
            mobile: "9876543210",
            email: "emma.johnson@example.com",
            company: "Tech Solutions",
        },
        {
            name: "Michael Brown",
            experience: "3 Years 2 Months",
            mobile: "9123456780",
            email: "michael.brown@example.com",
            company: "Innovatech",
        },
        {
            name: "Sophia Garcia",
            experience: "10 Years 8 Months",
            mobile: "8123456789",
            email: "sophia.garcia@example.com",
            company: "FutureWorks",
        },
        {
            name: "James Miller",
            experience: "2 Years 4 Months",
            mobile: "7012345678",
            email: "james.miller@example.com",
            company: "HealthCare Inc.",
        },
        {
            name: "Olivia Martinez",
            experience: "6 Years 5 Months",
            mobile: "9923456789",
            email: "olivia.martinez@example.com",
            company: "Green Energy",
        },
        {
            name: "Liam Anderson",
            experience: "4 Years 7 Months",
            mobile: "9876543120",
            email: "liam.anderson@example.com",
            company: "Bright Minds",
        },
        {
            name: "Isabella Wilson",
            experience: "8 Years 1 Month",
            mobile: "8098765432",
            email: "isabella.wilson@example.com",
            company: "Smart Solutions",
        },
        {
            name: "Benjamin Thomas",
            experience: "3 Years 10 Months",
            mobile: "9212345678",
            email: "benjamin.thomas@example.com",
            company: "Data Analytics Co.",
        },
        {
            name: "Charlotte Moore",
            experience: "9 Years 11 Months",
            mobile: "8543219876",
            email: "charlotte.moore@example.com",
            company: "AI Innovations",
        },
    ]);

    const [uploadMode, setUploadMode] = useState("none");
    const [selectAll, setSelectAll] = useState(false);

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setData((prevData) =>
            prevData.map((item) => ({ ...item, isSelected: newSelectAll }))
        );
    };

    const handleIndividualSelect = (index) => {
        const newData = [...data];
        newData[index].isSelected = !newData[index].isSelected;
        setData(newData);

        // Update "Select All" checkbox state
        const allSelected = newData.every((item) => item.isSelected);
        setSelectAll(allSelected);
    };



    return (
        <div>


            <div className="pl-3 space-y-2">
                {/* Domain Filter */}
                <div className="flex items-center space-x-1">
                    <span className="text-sm font-bold mr-[45px] flex">Role</span>
                    {role.map((role) => (
                        <button
                            key={role}
                            onClick={() => handleSelect("role", role)}
                            className={`flex items-center justify-center px-2 py-1 border rounded-md text-xs w-auto ${selectedFilters.role === role
                                ? "bg-purple-100 text-purple-700 border-purple-300"
                                : "bg-white text-gray-700 border-gray-300"
                                }`}
                        >
                            {/* Tick container */}
                            {selectedFilters.role === role && (
                                <span className="w-4 h-4 flex justify-center items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-3 h-3 text-purple-700"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </span>
                            )}
                            {role}
                        </button>
                    ))}
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-10">
                    <div className='flex items-center space-x-1'>
                        <span className="text-sm font-bold mr-4">Function </span>
                        {fun.map((fun) => (
                            <button
                                key={fun}
                                onClick={() => handleSelect("fun", fun)}
                                className={`flex items-center justify-center px-2 py-1 border rounded-md text-xs w-auto ${selectedFilters.fun === fun
                                    ? "bg-purple-100 text-purple-700 border-purple-300"
                                    : "bg-white text-gray-700 border-gray-300"
                                    }`}
                            >
                                {/* Tick container */}
                                {selectedFilters.fun === fun && (
                                    <span className="w-4 h-4 flex justify-center items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-3 h-3 text-purple-700"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </span>
                                )}
                                {fun}
                            </button>
                        ))}
                    </div>
                    <div className='flex items-center space-x-1'>
                        <span className="text-sm font-bold mr-4">Source</span>
                        {source.map((source) => (
                            <button
                                key={source}
                                onClick={() => handleSelect("source", source)}
                                className={`flex items-center justify-center px-2 py-1 border rounded-md text-xs w-auto ${selectedFilters.source === source
                                    ? "bg-purple-100 text-purple-700 border-purple-300"
                                    : "bg-white text-gray-700 border-gray-300"
                                    }`}
                            >
                                {/* Tick container */}
                                {selectedFilters.source === source && (
                                    <span className="w-4 h-4 flex justify-center items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-3 h-3 text-purple-700"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </span>
                                )}
                                {source}
                            </button>
                        ))}
                    </div>

                </div>
            </div>









            <div className='w-full flex mt-6'>
                <div className='w-1/2 flex items-center justify-center'>
                    <div class="w-[468px] h-[184px] flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-all">
                        <label for="fileInput" class="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.4398 8.8999C20.0398 9.2099 21.5098 11.0599 21.5098 15.1099L21.5098 15.2399C21.5098 19.7099 19.7198 21.4999 15.2498 21.4999L8.72976 21.4999C4.25976 21.4999 2.46976 19.7099 2.46976 15.2399L2.46976 15.1099C2.46976 11.0899 3.91976 9.2399 7.45976 8.9099" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12 15.0001L12 3.62012" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M15.3496 5.85L11.9996 2.5L8.64961 5.85" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                            <span class="text-sm">Upload CV</span>
                        </label>
                        <input id="fileInput" type="file" class="hidden" />
                    </div>
                </div>
                <div className='w-1/2 flex items-center justify-center'>
                    <div class="w-[468px] h-[184px] flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-all">
                        <label for="fileInput" class="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.4398 8.8999C20.0398 9.2099 21.5098 11.0599 21.5098 15.1099L21.5098 15.2399C21.5098 19.7099 19.7198 21.4999 15.2498 21.4999L8.72976 21.4999C4.25976 21.4999 2.46976 19.7099 2.46976 15.2399L2.46976 15.1099C2.46976 11.0899 3.91976 9.2399 7.45976 8.9099" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12 15.0001L12 3.62012" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M15.3496 5.85L11.9996 2.5L8.64961 5.85" stroke="#171717" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                            <span class="text-sm">Bulk Upload CV</span>
                        </label>
                        <input id="fileInput" type="file" class="hidden" />
                    </div>
                </div>


            </div>

            <div className="w-full mt-6">
                {uploadMode === "none" ? (
                    // Initial state with the two buttons
                    <div className="mt-9 w-full flex flex-col items-center justify-evenly border border-red-500 py-5">
                        <h1 className="text-lg text-red-500 font-bold">
                            Added temporarily until the API is ready.
                        </h1>
                        <div className="w-full flex items-center justify-around">
                            <button
                                className="bg-gray-300 px-4 py-2 text-lg rounded-full"
                                onClick={() => setUploadMode("single")} // Display only one item
                            >
                                CV Upload
                            </button>
                            <button
                                className="bg-gray-300 px-4 py-2 text-lg rounded-full"
                                onClick={() => setUploadMode("bulk")} // Display all items
                            >
                                Bulk CV Upload
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* Heading Row */}
                        <div className="flex items-center justify-between px-4 py-3 text-[#6B6F7B] font-bold">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                checked={selectAll}
                                onChange={handleSelectAll}
                            />
                            <div className="flex-1 grid grid-cols-[1fr_1fr_1fr_1.5fr_1.2fr_1fr] gap-2 text-sm text-gray-700 ml-4">
                                <div>Name</div>
                                <div>Experience</div>
                                <div>Mobile Number</div>
                                <div className="truncate">Email ID</div>
                                <div>Company</div>
                                <div></div>
                            </div>
                        </div>

                        {/* Data Rows */}
                        <div className=''>
                            {(uploadMode === "single" ? [data[0]] : data).map((item, index) => (
                                <div key={index} className="group">
                                    <hr className="w-full bg-[#F4F4F4] h-[1px]" />
                                    <div className="flex items-center justify-between px-4 py-3">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            checked={item.isSelected}
                                            onChange={() => handleIndividualSelect(index)}
                                        />
                                        <div className="flex-1 grid grid-cols-[1fr_1fr_1fr_1.5fr_1.2fr_1fr] gap-2 text-sm text-gray-700 ml-4">
                                            <button className="flex items-center justify-between group-hover:text-[#056DDC] group-hover:font-semibold group-hover:duration-200"

                                            >
                                                {item.name}
                                            </button>
                                            <div className="flex items-center justify-between">
                                                {item.experience}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                {item.mobile}
                                            </div>
                                            <div className="flex items-center justify-between truncate">
                                                {item.email}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>{item.company}</div>
                                            </div>
                                            <div className='flex items-center justify-around'>
                                                <button className="text-gray-500 hover:text-indigo-600 rounded-lg hover:scale-110 hover:duration-150">
                                                    <svg
                                                        width="28"
                                                        height="28"
                                                        viewBox="0 0 28 28"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        style={{ filter: "drop-shadow(4px 6px 8px rgba(0, 0, 0, 0.2))" }}
                                                    >
                                                        <path
                                                            d="M7 21H8.425L18.2 11.225L16.775 9.8L7 19.575V21ZM5 23V18.75L18.2 5.575C18.4 5.39167 18.6208 5.25 18.8625 5.15C19.1042 5.05 19.3583 5 19.625 5C19.8917 5 20.15 5.05 20.4 5.15C20.65 5.25 20.8667 5.4 21.05 5.6L22.425 7C22.625 7.18333 22.7708 7.4 22.8625 7.65C22.9542 7.9 23 8.15 23 8.4C23 8.66667 22.9542 8.92083 22.8625 9.1625C22.7708 9.40417 22.625 9.625 22.425 9.825L9.25 23H5ZM17.475 10.525L16.775 9.8L18.2 11.225L17.475 10.525Z"
                                                            fill="#65558F"
                                                        />
                                                    </svg>
                                                </button>

                                                <button
                                                    className="text-gray-500 hover:text-indigo-600 rounded-lg hover:scale-110 hover:duration-150"
                                                    onClick={() => {
                                                        const url = `/client/candidates/schedule-interview`;
                                                        const stateData = encodeURIComponent(JSON.stringify({ item }));
                                                        window.open(`${url}?state=${stateData}`, '_blank');
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#75FB4C">
                                                        <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                                                    </svg>
                                                </button>

                                                <button className="text-gray-500 hover:text-indigo-600 rounded-lg hover:scale-110 hover:duration-150">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M17.5 4.98356C14.725 4.70856 11.9333 4.56689 9.15 4.56689C7.5 4.56689 5.85 4.65023 4.2 4.81689L2.5 4.98356" stroke="red" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M7.0835 4.1415L7.26683 3.04984C7.40016 2.25817 7.50016 1.6665 8.9085 1.6665H11.0918C12.5002 1.6665 12.6085 2.2915 12.7335 3.05817L12.9168 4.1415" stroke="red" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M15.7082 7.6167L15.1665 16.0084C15.0748 17.3167 14.9998 18.3334 12.6748 18.3334H7.32484C4.99984 18.3334 4.92484 17.3167 4.83317 16.0084L4.2915 7.6167" stroke="red" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M8.6084 13.75H11.3834" stroke="red" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M7.9165 10.4165H12.0832" stroke="red" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>

                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>



        </div>
    )
}

export { AddCandidate as ClientAddCandidate }
