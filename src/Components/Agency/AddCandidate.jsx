import React, { useState } from 'react'

function AddCandidate() {

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

        </div>
    )
}

export { AddCandidate as AgencyAddCandidate }
