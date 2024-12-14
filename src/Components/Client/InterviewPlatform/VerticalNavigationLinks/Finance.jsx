import React, { useState } from 'react';

function Finance() {
  const data = [
    {
      "Candidate": "Abc Xyz",
      "Role": "SDE II",
      "Experience": "4.2 Years",
      "Date": "09/09/2024",
      "Amount": 1200.00
    },
    {
      "Candidate": "Abc Xyz",
      "Role": "SDE II",
      "Experience": "4.2 Years",
      "Date": "17/10/2024",
      "Amount": 1200.00
    },
    {
      "Candidate": "Abc Xyz",
      "Role": "SDE II",
      "Experience": "4.2 Years",
      "Date": "22/10/2024",
      "Amount": 1200.00
    },
    {
      "Candidate": "Abc Xyz",
      "Role": "SDE II",
      "Experience": "4.2 Years",
      "Date": "07/11/2024",
      "Amount": 1200.00
    },
    {
      "Candidate": "Abc Xyz",
      "Role": "SDE II",
      "Experience": "4.2 Years",
      "Date": "10/11/2024",
      "Amount": 1200.00
    },
    {
      "Candidate": "Abc Xyz",
      "Role": "SDE II",
      "Experience": "4.2 Years",
      "Date": "07/12/2024",
      "Amount": 1200.00
    },
    {
      "Candidate": "Abc Xyz",
      "Role": "SDE II",
      "Experience": "4.2 Years",
      "Date": "07/12/2024",
      "Amount": 1200.00
    }
  ];

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [isDataRangeEntered,setIsDataRangeEntered] = useState(false);

  const parseDate = (dateStr) =>{
    const [day, month, year] = dateStr.split('/'); return `${year}/${month}/${day}`;
  };
  const filterDataByDate = () => {
    if (!startDate || !endDate) {
      setFilteredData(data);
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const filtered = data.filter(item => {
      
      const date = new Date(parseDate(item.Date));
      return date >= start && date <= end;
    });
    setFilteredData(filtered);
    setIsDataRangeEntered(true);
  };

  return (
    <div className='w-full h-screen text-[14px]'>
      <div className='w-full h-screen'>
        <div className='w-full flex font-semibold text-[20px] p-4'>
          <div className='w-[50%]'>Current Dues</div>
          <div className='w-[50%]'>Total: INR 5,00,000.00</div>
        </div>
        <div className='w-full h-full flex p-4 gap-16'>
          <div className='w-[75%]'>
            <table className="w-full text-left border-collapse">
              <thead className='text-black'>
                <tr>
                  <th className='py-2 px-4 max-w-max border-b-4 text-[15px] font-bold'>Candidate</th>
                  <th className='py-2 px-4 max-w-max border-b-4 text-[15px] font-normal'>ROLE</th>
                  <th className='py-2 px-4 max-w-max border-b-4 text-[15px] font-normal'>EXPERIENCE</th>
                  <th className='py-2 px-4 max-w-max border-b-4 text-[15px] font-normal'>DATE</th>
                  <th className='py-2 px-4 max-w-max border-b-4 text-[15px] font-normal'>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((data, index) => (
                  <tr key={index} className={`${index % 2 === 0 ? "" : (isDataRangeEntered ? "bg-[#FFC7001F] ": "bg-[#E5ECF6]" ) } h-[91px]`}>
                    <td className='py-3 px-4 max-w-max font-bold text-[15px]'>{data.Candidate}</td>
                    <td className='py-3 px-4 max-w-max'>{data.Role}</td>
                    <td className='py-3 px-4 max-w-max'>{data.Experience}</td>
                    <td className='py-3 px-4 max-w-max'>{data.Date}</td>
                    <td className='py-3 px-4 max-w-max'>{data.Amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='w-[25%] bg-[#E7E4E8CC] border rounded-[16px]'>
            <div className='flex items-center justify-center p-2 text-[#1C1C1C] text-[20px] font-semibold'>{isDataRangeEntered ? 'Duration': "Past Payments"}</div>
            <div className='space-y-4 mt-10'>
              <div className='w-full flex items-center justify-center gap-4'>
                <div className='text-right'>
                  <label htmlFor="from" className='text-[#6B6F7B] font-bold'>From</label>
                </div>
                <div className='text-left'>
                  <input 
                    type="date"
                    onChange={(e) => setStartDate(e.target.value)}
                    value={startDate}
                    
                    className='w-[124px] h-[32px] text-center border-nonfocus:outline-none border border-[#CAC4D0] focus:ring-1 focus:ring-blue-500 rounded-lg bg-transparent'
                  />
                </div>
              </div>
              <div className='w-full flex items-center justify-center gap-4 pl-4'>
                <div className='text-right'>
                  <label htmlFor="to" className='text-[#6B6F7B] font-bold'>To</label>
                </div>
                <div className='text-left'>
                  <input 
                    type="date"
                    onChange={(e) => setEndDate(e.target.value)}
                    value={endDate}
                    
                    className='w-[124px] h-[32px] text-center border-nonfocus:outline-none border border-[#CAC4D0] focus:ring-1 focus:ring-blue-500 rounded-lg bg-transparent'
                  />
                </div>
              </div>
              <div className='w-full flex items-center justify-center'>
                <div className='w-[79px] h-[32px] flex justify-center items-center bg-[#007AFF] border-0 rounded-[100px] text-[#FFFFFF] font-normal'>
                  <button className='w-full h-full  flex justify-center items-center ' onClick={filterDataByDate}>
                    Go
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='w-[75%] mt-14 flex items-center justify-end'>
        <div className='w-[111px] h-[32px] p-2 flex justify-center items-center bg-[#007AFF] border-0 rounded-[100px] text-[#FFFFFF] font-normal'>
          <button>Download</button>
        </div>
      </div>
      <div className='w-[25%]'></div>
    </div>
  );
}

export default Finance;
