import React, { useState } from 'react'

function Payments() {
  const data = [
    {
      candidate: 'Abc Xyz',
      role: 'SDE II',
      experience: '4.2 Years',
      date: '07/12/2024',
      amount: '1200.00',
    },
    {
      candidate: 'Abc Xyz',
      role: 'SDE II',
      experience: '4.2 Years',
      date: '07/12/2024',
      amount: '1200.00',
    },
    {
      candidate: 'Abc Xyz',
      role: 'SDE II',
      experience: '4.2 Years',
      date: '07/12/2024',
      amount: '1200.00',
    },
    {
      candidate: 'Abc Xyz',
      role: 'SDE II',
      experience: '4.2 Years',
      date: '07/12/2024',
      amount: '1200.00',
    },
    {
      candidate: 'Abc Xyz',
      role: 'SDE II',
      experience: '4.2 Years',
      date: '07/12/2024',
      amount: '1200.00',
    },
    {
      candidate: 'Abc Xyz',
      role: 'SDE II',
      experience: '4.2 Years',
      date: '07/12/2024',
      amount: '1200.00',
    },
  ];

  const [fromDate, setFromDate] = useState('07/12/2024');
  const [toDate, setToDate] = useState('30/12/2024');
  const [year, setYear] = useState('2024');
  const [month, setMonth] = useState('Dec');


  return (
    <div className='flex'>
      <div className='p-4 w-1/2 h-screen'>
        <div className='p-2 flex items-center justify-between'>
          <h1 className='text-xl font-semibold'>Current Receivables</h1>
          <h1 className='text-xl font-semibold'>Total: INR 5,00,00.00</h1>
        </div>
        <div className="mt-[70px] overflow-hidden">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-black border-b-2 border-black">
                <th className="py-2 px-4 text-left  font-semibold text-xs sm:text-sm">Candidate</th>
                <th className="py-2 px-4 text-left font-semibold text-xs sm:text-sm">ROLE</th>
                <th className="py-2 px-4 text-left font-semibold text-xs sm:text-sm">EXPERIENCE</th>
                <th className="py-2 px-4 text-left  font-semibold text-xs sm:text-sm">DATE2</th>
                <th className="py-2 px-4 text-left font-semibold text-xs sm:text-sm">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? '' : 'bg-[#E5ECF6]'}`}
                >
                  <td className="py-2 px-4 text-gray-800 font-medium text-xs sm:text-sm">{row.candidate}</td>
                  <td className="py-2 px-4 text-gray-800 text-xs sm:text-sm">{row.role}</td>
                  <td className="py-2 px-4 text-gray-800 text-xs sm:text-sm">{row.experience}</td>
                  <td className="py-2 px-4 text-gray-800 text-xs sm:text-sm">{row.date}</td>
                  <td className="py-2 px-4 text-gray-800 text-xs sm:text-sm">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='mt-10 w-full flex items-center justify-end'>
            <button className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-full'>Download</button>
          </div>
        </div>
      </div>
      <div className='p-4 w-1/2 h-screen'>
        <div>
          <div className='p-2 flex items-center justify-between'>
            <h1 className='text-xl font-semibold'>Past Payments</h1>
            <h1 className='text-xl font-semibold'>Total: INR 1,00,00.00</h1>
          </div>
          <div className="p-2 flex flex-wrap items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* From Date */}
            <div className="flex items-center space-x-2">
              <label className="text-gray-600">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border rounded-md px-3 py-1 text-gray-700 focus:outline-none focus:border-blue-500"
                placeholder="From Date"
              />
            </div>

            {/* To Date */}
            <div className="flex items-center space-x-2">
              <label className="text-gray-600">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border rounded-md px-3 py-1 text-gray-700 focus:outline-none focus:border-blue-500"
                placeholder="To Date"
              />
            </div>

            {/* Divider */}
            <div className="hidden sm:block border-r border-gray-300 h-6"></div>

            {/* Year Dropdown */}
            <div>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="border rounded-md px-3 py-1 text-gray-700 focus:outline-none focus:border-blue-500"
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                {/* Add more years as needed */}
              </select>
            </div>

            {/* Month Dropdown */}
            <div>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border rounded-md px-3 py-1 text-gray-700 focus:outline-none focus:border-blue-500"
              >
                <option value="Jan">Jan</option>
                <option value="Feb">Feb</option>
                <option value="Mar">Mar</option>
                <option value="Apr">Apr</option>
                <option value="May">May</option>
                <option value="Jun">Jun</option>
                <option value="Jul">Jul</option>
                <option value="Aug">Aug</option>
                <option value="Sep">Sep</option>
                <option value="Oct">Oct</option>
                <option value="Nov">Nov</option>
                <option value="Dec">Dec</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-hidden">
          <table className="mt-5 w-full table-auto">
            <thead>
              <tr className="text-black border-b-2 border-black">
                <th className="py-2 px-4 text-left  font-semibold text-xs sm:text-sm">Candidate</th>
                <th className="py-2 px-4 text-left font-semibold text-xs sm:text-sm">ROLE</th>
                <th className="py-2 px-4 text-left font-semibold text-xs sm:text-sm">EXPERIENCE</th>
                <th className="py-2 px-4 text-left  font-semibold text-xs sm:text-sm">DATE</th>
                <th className="py-2 px-4 text-left font-semibold text-xs sm:text-sm">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? '' : 'bg-[#FFC700]'}`}
                >
                  <td className="py-2 px-4 text-gray-800 font-medium text-xs sm:text-sm">{row.candidate}</td>
                  <td className="py-2 px-4 text-gray-800 text-xs sm:text-sm">{row.role}</td>
                  <td className="py-2 px-4 text-gray-800 text-xs sm:text-sm">{row.experience}</td>
                  <td className="py-2 px-4 text-gray-800 text-xs sm:text-sm">{row.date}</td>
                  <td className="py-2 px-4 text-gray-800 text-xs sm:text-sm">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='mt-10 w-full flex items-center justify-end'>
            <button className='bg-blue-500 text-white font-semibold px-4 py-2 rounded-full'>Download</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payments
