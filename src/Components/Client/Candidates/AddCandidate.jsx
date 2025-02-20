import { LogoutCurve } from "iconsax-react";
import { useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";

function ClientAddCandidate() {
  const [selectedFilters, setSelectedFilters] = useState({
    role: "All",
    fun: "All",
    source: "All",
  });

  const role = [
    "SDE II",
    "SDE III",
    "SDET I",
    "EM",
    "SDE I - Frontend",
    "SDE II - Frontend",
  ];
  const fun = ["All", "Frontend", "Backend"];
  const source = ["All", "Agency", "Client"];

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
      prevData.map((item) => ({
        ...item,
        isSelected: newSelectAll,
      }))
    );
  };

  const handleIndividualSelect = (index) => {
    const newData = [...data];
    newData[index].isSelected = !newData[index].isSelected;
    setData(newData);

    // Update "Select All" checkbox state
    const allSelected = newData.every(
      (item) => item.isSelected
    );
    setSelectAll(allSelected);
  };

  return (
    <div>
      <div className="pl-3 space-y-2">
        {/* Domain Filter */}
        <div className="flex items-center space-x-1">
          <span className="text-sm font-bold mr-[45px] flex">
            Role
          </span>
          {role.map((role) => (
            <button
              key={role}
              onClick={() => handleSelect("role", role)}
              className={`flex items-center justify-center px-2 py-1 border rounded-md text-xs w-auto ${
                selectedFilters.role === role
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
          <div className="flex items-center space-x-1">
            <span className="text-sm font-bold mr-4">
              Function{" "}
            </span>
            {fun.map((fun) => (
              <button
                key={fun}
                onClick={() => handleSelect("fun", fun)}
                className={`flex items-center justify-center px-2 py-1 border rounded-md text-xs w-auto ${
                  selectedFilters.fun === fun
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
          <div className="flex items-center space-x-1">
            <span className="text-sm font-bold mr-4">
              Source
            </span>
            {source.map((source) => (
              <button
                key={source}
                onClick={() =>
                  handleSelect("source", source)
                }
                className={`flex items-center justify-center px-2 py-1 border rounded-md text-xs w-auto ${
                  selectedFilters.source === source
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

      <div className="w-full flex mt-6">
        <div className="w-1/2 flex items-center justify-center">
          <div className="w-[468px] h-[184px] flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-all">
            <label
              htmlFor="fileInput"
              className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
            >
              <LogoutCurve
                className="rotate-90"
                color="#171717"
                size={24}
              />{" "}
              <span className="text-sm">Upload CV</span>
            </label>
            <input
              id="fileInput"
              type="file"
              className="hidden"
            />
          </div>
        </div>
        <div className="w-1/2 flex items-center justify-center">
          <div className="w-[468px] h-[184px] flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-all">
            <label
              htmlFor="fileInput"
              className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
            >
              <LogoutCurve
                className="rotate-90"
                color="#171717"
                size={24}
              />{" "}
              <span className="text-sm">
                Bulk Upload CV
              </span>
            </label>
            <input
              id="fileInput"
              type="file"
              className="hidden"
            />
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
            <div className="">
              {(uploadMode === "single"
                ? [data[0]]
                : data
              ).map((item, index) => (
                <div key={index} className="group">
                  <hr className="w-full bg-[#F4F4F4] h-[1px]" />
                  <div className="flex items-center justify-between px-4 py-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      checked={item.isSelected}
                      onChange={() =>
                        handleIndividualSelect(index)
                      }
                    />
                    <div className="flex-1 grid grid-cols-[1fr_1fr_1fr_1.5fr_1.2fr_1fr] gap-2 text-sm text-gray-700 ml-4">
                      <button className="flex items-center justify-between group-hover:text-[#056DDC] group-hover:font-semibold group-hover:duration-200">
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
                      <div className="flex items-center justify-around">
                        <button className="text-gray-500 hover:text-indigo-600 rounded-lg hover:scale-110 hover:duration-150">
                          <MdOutlineEdit
                            size={18}
                            className="text-[#65558F]"
                          />
                        </button>

                        <button
                          className="p-1 px-4 rounded-full text-sm font-semibold text-white h-[40px] 
                             bg-[#007AFF] transition-all duration-300 ease-in-out
                             hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] cursor-pointer flex items-center"
                          onClick={() => {
                            const url = `/client/candidates/schedule-interview`;
                            const stateData =
                              encodeURIComponent(
                                JSON.stringify({ item })
                              );
                            window.open(
                              `${url}?state=${stateData}`,
                              "_blank"
                            );
                          }}
                        >
                          <FaCheck className="mr-2" />{" "}
                          Submit
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
  );
}

export default ClientAddCandidate;
