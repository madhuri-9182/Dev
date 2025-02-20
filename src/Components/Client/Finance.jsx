import { useState } from "react";

function Finance() {
  const data = [
    {
      Candidate: "Abc Xyz",
      Role: "SDE II",
      Experience: "4.2 Years",
      Date: "09/09/2024",
      Amount: 1200.0,
    },
    {
      Candidate: "Abc Xyz",
      Role: "SDE II",
      Experience: "4.2 Years",
      Date: "17/10/2024",
      Amount: 1200.0,
    },
    {
      Candidate: "Abc Xyz",
      Role: "SDE II",
      Experience: "4.2 Years",
      Date: "22/10/2024",
      Amount: 1200.0,
    },
    {
      Candidate: "Abc Xyz",
      Role: "SDE II",
      Experience: "4.2 Years",
      Date: "07/11/2024",
      Amount: 1200.0,
    },
    {
      Candidate: "Abc Xyz",
      Role: "SDE II",
      Experience: "4.2 Years",
      Date: "10/11/2024",
      Amount: 1200.0,
    },
    {
      Candidate: "Abc Xyz",
      Role: "SDE II",
      Experience: "4.2 Years",
      Date: "07/12/2024",
      Amount: 1200.0,
    },
    {
      Candidate: "Abc Xyz",
      Role: "SDE II",
      Experience: "4.2 Years",
      Date: "07/12/2024",
      Amount: 1200.0,
    },
  ];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currentYear = new Date().getFullYear();
  const years = [];

  for (let year = currentYear; year >= 2000; year--) {
    years.push(year);
  }
  const isDateRangeEntered = false;

  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  );

  return (
    <div className="w-full h-screen text-[14px]  ">
      <div className="w-full h-screen">
        <div className="w-full flex font-semibold text-[20px] p-4">
          <div className="w-[50%]">
            {isDateRangeEntered
              ? "Past Payments"
              : "Current Dues"}
          </div>
          <div className="w-[50%]">
            Total: INR 5,00,000.00
          </div>
        </div>
        <div className="w-full  flex mt-6 gap-16  ">
          <div className="w-[75%]">
            <table className="w-full text-left ">
              <thead className="text-black">
                <tr className="border-b-[3px] border-[#4F4F4F] ">
                  <th className="py-2 px-4 max-w-max  text-[15px] font-bold">
                    Candidate
                  </th>
                  <th className="py-2 px-4 max-w-max  text-[15px] font-normal">
                    ROLE
                  </th>
                  <th className="py-2 px-4 max-w-max  text-[15px] font-normal">
                    EXPERIENCE
                  </th>
                  <th className="py-2 px-4 max-w-max  text-[15px] font-normal">
                    DATE
                  </th>
                  <th className="py-2 px-4 max-w-max  text-[15px] font-normal">
                    AMOUNT
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {data.map((data, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0
                        ? "bg-[#EBEBEB80]"
                        : isDateRangeEntered
                        ? "bg-[#EBEBEB80] "
                        : "bg-[#EBEBEB80]"
                    } h-[91px]  border-b border-gray-300  `}
                  >
                    <td className="py-3 px-4 max-w-max font-bold text-[15px] mb-2 ">
                      {data.Candidate}
                    </td>
                    <td className="py-3 px-4 max-w-max">
                      {data.Role}
                    </td>
                    <td className="py-3 px-4 max-w-max">
                      {data.Experience}
                    </td>
                    <td className="py-3 px-4 max-w-max">
                      {data.Date}
                    </td>
                    <td className="py-3 px-4 max-w-max">
                      {data.Amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="w-[25%] bg-[#E7E4E8CC] border rounded-[16px]">
            <div className="flex items-center justify-center p-2 text-[#1C1C1C] text-[20px] font-semibold">
              {isDateRangeEntered
                ? "Duration"
                : "Past Payments"}
            </div>
            <div className="space-y-4 mt-10">
              <div className=" w-full flex justify-center items-center  ">
                <div className=" w-[70%] flex flex-col items-center justify-center  gap-2 ">
                  <div className="grid grid-cols-[1fr_2fr]  items-center gap-x-2 ">
                    <span className="flex justify-end items-center font-bold ">
                      Year{" "}
                    </span>
                    <select
                      className="w-[100px] h-[35px] text-center border border-gray-300 rounded-md hover:border-2 hover:border-[#007AFF] focus:outline-none"
                      value={selectedYear}
                      onChange={(e) =>
                        setSelectedYear(
                          parseInt(e.target.value)
                        )
                      }
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {" "}
                          {year}{" "}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-[1fr_2fr]  items-center gap-x-2 ">
                    <span className="flex justify-end items-center font-bold">
                      Month
                    </span>
                    <select
                      className={`w-[100px] h-[35px] text-center border border-gray-300 rounded-md p-2 hover:border-2 hover:border-[#007AFF] focus:outline-none`}
                      value={selectedMonth}
                      onChange={(e) =>
                        setSelectedMonth(
                          parseInt(e.target.value)
                        )
                      }
                    >
                      {months.map((month, index) => (
                        <option
                          key={month}
                          value={index + 1}
                        >
                          {" "}
                          {month}{" "}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-4 flex items-center justify-center">
                    <button
                      className="p-1 px-4 rounded-full text-sm font-semibold text-white h-[40px] 
                                                    bg-[#007AFF] transition-all duration-300 ease-in-out
                                                    hover:bg-gradient-to-r hover:from-[#007AFF] hover:to-[#005BBB] cursor-pointer flex items-center"
                      onClick="#"
                    >
                      Click to Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" w-full  flex p-4 gap-16  ">
          <div className="w-[75%]  flex items-center justify-end ">
            <div className="w-[111px] h-[32px] p-2 flex justify-center items-center transition ease-linear delay-150 hover:-translate-y-1 hover:scale-110 hover:border-[3px] hover:bg-gradient-to-r from-[#0575E6] via-[#295cde] to-[#133bca] duration-300 ... bg-[#007AFF] border-0 rounded-[100px] text-[#FFFFFF] font-normal">
              <button>Download</button>
            </div>
          </div>
          <div className="w-[25%]  "></div>
        </div>
      </div>
    </div>
  );
}

export default Finance;
