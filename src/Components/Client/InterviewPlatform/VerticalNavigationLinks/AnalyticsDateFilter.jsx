import React, { useState } from 'react'
import CustomDatePicker from '../../../../utils/CustomDatePicker'

function AnalyticsDateFilter() {
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
        <div className='p-8'>
            <div className=''>
                <div className="">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-4">

                        <div>
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

                        </div>
                        <div className='flex items-center justify-center'>
                            <div>
                                <label htmlFor="From"
                                    className='mr-4 text-[#6B6F7B] text-sm'
                                >From</label>
                                <CustomDatePicker />
                            </div>
                            <div className='ml-4 text-sm'>
                                <label htmlFor="From"
                                    className='mr-4 text-[#6B6F7B]'
                                >To</label>
                                <CustomDatePicker />
                            </div>
                        </div>
                        <div>


                            <button className="w-[176px] h-[32px] bg-[#056DDC] text-sm rounded-full text-white flex items-center justify-center gap-x-3">
                                <div>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 12L5.25 8.25L6.3 7.1625L8.25 9.1125V3H9.75V9.1125L11.7 7.1625L12.75 8.25L9 12ZM4.5 15C4.0875 15 3.73438 14.8531 3.44063 14.5594C3.14688 14.2656 3 13.9125 3 13.5V11.25H4.5V13.5H13.5V11.25H15V13.5C15 13.9125 14.8531 14.2656 14.5594 14.5594C14.2656 14.8531 13.9125 15 13.5 15H4.5Z" fill="white" />
                                    </svg>
                                </div>
                                <div>Download Report</div>
                            </button>
                        </div>
                    </div>

                    <div className='p-4 flex items-center justify-center mt-4'>



                        {/* Main Grid Section */}
                        <div className="grid grid-cols-12 gap-4">
                            {/* Status Info Section */}
                            <div className="col-span-2">
                                <h3 className="text-sm font-semibold mb-2 text-center">STATUS INFO</h3>
                                <div className="mt-4 space-y-4">
                                    {[
                                        ["Total Candidates", 650],
                                        ["Total Interviews", 600],
                                        ["Top Performers", 50],
                                        ["Good Candidates", 120],
                                        ["Rejected", 400],
                                        ["Declined by Candidate", 20],
                                        ["Declined by Panel", 10],
                                    ].map(([label, value], index) => (
                                        <div
                                            key={index}
                                            className="bg-[#EBEBEB] w-[203px] h-[48px] p-2 gap-x-5 text-sm rounded-lg text-black flex items-center justify-between"
                                        >
                                            <div className='text-sm'>{label}</div>
                                            <div className=" bg-[#979797] text-white w-[32px] h-[32px] rounded-full flex items-center justify-center">{value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Selected and Rejected Candidates Section */}
                            <div className="ml-16 col-span-7 grid grid-cols-2 gap-x-16">
                                {/* Selected Candidates */}
                                <div>
                                    <h3 className="text-sm font-semibold mb-2">SELECTED CANDIDATES</h3>
                                    <hr className='bg-[#4F4F4F] h-[3px] rounded-full' />
                                    <div className="">

                                        {[
                                            ["Cred", "23%"],
                                            ["Amazon", "20%"],
                                            ["Google", "15%"],
                                            ["Navi", "8%"],
                                            ["Quince", "5%"],
                                        ].map(([company, percentage], index) => (
                                            <div>


                                                <div
                                                    key={index}
                                                    className={`w-[331px] h-[91px] p-3 pr-[25%] flex items-center justify-between ${index % 2 === 0 ? 'bg-white' : 'bg-[#FFFBEB]'
                                                        }`}
                                                >

                                                    <span className='font-semibold text-black'>{company}</span>
                                                    <span className="text-[#4F4F4F]">{percentage}</span>
                                                </div>
                                                <hr className='bg-gray-100 h-[1px] w-[331px]' />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Rejected Candidates */}
                                <div>
                                    <h3 className="text-sm font-semibold mb-2">REJECTED CANDIDATES</h3>
                                    <hr className='bg-[#4F4F4F] h-[3px] rounded-full' />
                                    <div className="">
                                        {[
                                            ["Rupeek", "23%"],
                                            ["Salesforce", "20%"],
                                            ["Adobe", "15%"],
                                            ["Zee", "8%"],
                                            ["Thoughtspot", "5%"],
                                        ].map(([company, percentage], index) => (
                                            <div>


                                                <div
                                                    key={index}
                                                    className={`w-[331px] h-[91px] p-3 pr-[25%] flex items-center justify-between ${index % 2 === 0 ? 'bg-white' : 'bg-[#FFFBEB]'
                                                        }`}
                                                >
                                                    <span className='font-semibold text-black'>{company}</span>
                                                    <span className="text-[#4F4F4F]">{percentage}</span>
                                                </div>
                                                <hr className='bg-gray-100 h-[1px] w-[331px]' />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Ratio Details Section */}
                            <div className="ml-16 col-span-2">
                                <h3 className="text-sm font-semibold mb-2">RATIO DETAILS</h3>
                                <div className="space-y-4">
                                    <div className="w-[200px] h-[96px] bg-[#E5ECF6] p-4 rounded-xl text-gray-600">
                                        <p className='text-[#1C1C1C] text-sm'>Selection Ratio</p>
                                        <p className="text-2xl text-[#1C1C1C] font-bold">1:28</p>
                                    </div>
                                    <div className="w-[200px] h-[96px] bg-[#E5ECF6] p-4 rounded-xl text-gray-600">
                                        <p className='text-[#1C1C1C] text-sm'>Selection Ratio for Diversity</p>
                                        <p className="text-2xl text-[#1C1C1C] font-bold">1:6</p>
                                    </div>
                                    <div className="w-[200px] h-[96px] bg-[#E5ECF6] p-4 rounded-xl text-gray-600">
                                        <p className='text-[#1C1C1C] text-sm'>Total Male VS Female Profiles</p>
                                        <p className="text-2xl text-[#1C1C1C] font-bold">7:5</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnalyticsDateFilter
