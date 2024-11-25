import React, { useState } from 'react';

function Users() {
  const [showAll, setShowAll] = useState(false); // State to toggle visibility
  const [hdipShowAll,setHdipShowAll]=useState(false)
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
            <button className="px-6 py-1 bg-blue-600 text-white rounded-full">+ Add</button>
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
                className="grid grid-cols-[1fr_1fr_2fr_1fr_1fr_1fr_0.5fr] bg-[#EBEBEB] mt-1 rounded-full items-center justify-center max-h-max"
              >
                <div className="px-6 py-1 w-auto">{item.client}</div>
                <div className="px-3 py-1 w-auto">{item.name}</div>
                <div className="px-3 py-1 w-auto">{item.mail}</div>
                <div className="px-3 py-1 w-auto">{item.phone}</div>
                <div className="px-3 py-1 w-auto">{item.domain}</div>
                <div className="px-3 py-1 w-auto">{item.access}</div>
                <div className="px-6 py-1 w-auto flex justify-center">
                  <button className="p-1 bg-gray-200 shadow-md hover:bg-gray-300 rounded-lg">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 21H8.425L18.2 11.225L16.775 9.8L7 19.575V21ZM5 23V18.75L18.2 5.575C18.4 5.39167 18.6208 5.25 18.8625 5.15C19.1042 5.05 19.3583 5 19.625 5C19.8917 5 20.15 5.05 20.4 5.15C20.65 5.25 20.8667 5.4 21.05 5.6L22.425 7C22.625 7.18333 22.7708 7.4 22.8625 7.65C22.9542 7.9 23 8.15 23 8.4C23 8.66667 22.9542 8.92083 22.8625 9.1625C22.7708 9.40417 22.625 9.625 22.425 9.825L9.25 23H5ZM17.475 10.525L16.775 9.8L18.2 11.225L17.475 10.525Z" fill="#65558F" />
                    </svg>
                  </button>
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
            <button className="px-6 py-1 bg-blue-600 text-white rounded-full">+ Add</button>
          </div>
        </div>

        {/* Table Headers */}
        <div className="mt-4">
          <div className="w-full grid grid-cols-[1fr_1fr_2fr_1fr_1fr_0.5fr] gap-2 text-sm font-semibold">
            <div className="px-6 p-2 w-full">NAME</div>
            <div className="px-4 p-2 w-full">ROLE</div>
            <div className="px-4 p-2 w-full">PHONE NO</div>
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
                key={index}
                className="grid grid-cols-[1fr_1fr_2fr_1fr_1fr_0.5fr] bg-[#EBEBEB] mt-1 rounded-full items-center justify-center max-h-max"
              >
                <div className="px-6 py-2 w-auto">{item.client}</div>
                <div className="px-4 py-2 w-auto">{item.name}</div>
                <div className="px-4 py-2 w-auto">{item.mail}</div>
                <div className="px-4 py-2 w-auto">{item.phone}</div>
                <div className="px-4 py-2 w-auto">{item.domain}</div>
          
                <div className="px-3 py-1 w-auto flex justify-center">
                  <button className="p-1 bg-gray-200 shadow-md hover:bg-gray-300 rounded-lg">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 21H8.425L18.2 11.225L16.775 9.8L7 19.575V21ZM5 23V18.75L18.2 5.575C18.4 5.39167 18.6208 5.25 18.8625 5.15C19.1042 5.05 19.3583 5 19.625 5C19.8917 5 20.15 5.05 20.4 5.15C20.65 5.25 20.8667 5.4 21.05 5.6L22.425 7C22.625 7.18333 22.7708 7.4 22.8625 7.65C22.9542 7.9 23 8.15 23 8.4C23 8.66667 22.9542 8.92083 22.8625 9.1625C22.7708 9.40417 22.625 9.625 22.425 9.825L9.25 23H5ZM17.475 10.525L16.775 9.8L18.2 11.225L17.475 10.525Z" fill="#65558F" />
                    </svg>
                  </button>
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
