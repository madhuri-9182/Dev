import React, { useState, useEffect } from 'react';




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

  const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

  const currentYear = new Date().getFullYear();
  const years=[];

  for(let year=currentYear; year>=2000; year-- ){
    years.push(year);
  }
  
   

  
  const [filteredData, setFilteredData] = useState(data);
  const [isDataRangeEntered,setIsDataRangeEntered] = useState(false);

  const parseDate = (dateStr) =>{
    const [day, month, year] = dateStr.split('/'); return `${year}/${month}/${day}`;
  };
  

  
   const [selectedYear2, setSelectedYear2] = useState(new Date().getFullYear()); 
   const [selectedMonth2, setSelectedMonth2] = useState(new Date().getMonth() + 1); 
   const [selectedDay2, setSelectedDay2] = useState(new Date().getDate());
   const [days2, setDays2] = useState([]); 
   useEffect(() => { 
        const days2InMonth = new Date(selectedYear2, selectedMonth2, 0).getDate(); 
        const days2Array = Array.from({ length: days2InMonth }, (_, i) => i + 1); setDays2(days2Array); }
        , [selectedYear2, selectedMonth2]);
   
   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); 
   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); 
   const [selectedDay, setSelectedDay] = useState(new Date().getDate());
   const [days, setDays] = useState([]); 
   useEffect(() => { 
          const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate(); 
          const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1); setDays(daysArray); }
          , [selectedYear, selectedMonth]);
  
   
   const filterDataByDate = () => {
    
      
    
        console.log("i roshan");
        
      const startDate =new Date (`${selectedYear}/${selectedMonth}/${selectedDay}`);
      const endDate =new Date (`${selectedYear2}/${selectedMonth2}/${selectedDay2}`);
      
      
      
    if (!startDate || !endDate) {
      setFilteredData(data);
      return;
    }
    if (startDate > endDate ) {
      alert("Please mention date in the correct order!!")
    }else{
    
    const filtered = data.filter(item => {
      
      const date =new Date (parseDate(item.Date));
      
      
      return date >= startDate && date <= endDate;
    });
    setFilteredData(filtered);
    setIsDataRangeEntered(true);
  }
  };
    
    
    
  


  return (
    <div className='w-full h-screen text-[14px]  '>
      <div className='w-full h-screen'>
        <div className='w-full flex font-semibold text-[20px] p-4'>
          <div className='w-[50%]'>{isDataRangeEntered? "Past Payments": "Current Dues"}</div>
          <div className='w-[50%]'>Total: INR 5,00,000.00</div>
        </div>
        <div className='w-full  flex mt-6 gap-16  '>
          <div className='w-[75%]'>
            <table className="w-full text-left ">
              <thead className='text-black'>
                <tr className='border-b-[3px] border-[#4F4F4F] ' >
                  <th className='py-2 px-4 max-w-max  text-[15px] font-bold'>Candidate</th>
                  <th className='py-2 px-4 max-w-max  text-[15px] font-normal'>ROLE</th>
                  <th className='py-2 px-4 max-w-max  text-[15px] font-normal'>EXPERIENCE</th>
                  <th className='py-2 px-4 max-w-max  text-[15px] font-normal'>DATE</th>
                  <th className='py-2 px-4 max-w-max  text-[15px] font-normal'>AMOUNT</th>
                </tr>
              </thead>
              <tbody className=''  >
                
                {filteredData.map((data, index) => (  
                  <tr key={index} className={`${index % 2 === 0 ? "bg-[#EBEBEB80]" : (isDataRangeEntered ? "bg-[#EBEBEB80] ": "bg-[#EBEBEB80]" ) } h-[91px]  border-b border-gray-300  `}>
                    <td className='py-3 px-4 max-w-max font-bold text-[15px] mb-2 '>{data.Candidate}</td>
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
              <div className=' w-full flex justify-center items-center  ' >
                
                <div className=" w-[70%] flex flex-col items-center justify-center  gap-2 "> 
                  <div className='grid grid-cols-[1fr_2fr]  items-center gap-x-2 ' >
                    <span className='flex justify-end items-center font-bold ' >Year </span>
                    <select

                      className="w-[100px] h-[35px] text-center border border-gray-300 rounded-md hover:border-2 hover:border-[#007AFF] focus:outline-none"
                      value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} >
                      {years.map((year) => (
                        <option key={year} value={year}  > {year} </option>
                      ))}
                    </select>
                  </div>
                  <div className='grid grid-cols-[1fr_2fr]  items-center gap-x-2 ' >
                    <span className='flex justify-end items-center font-bold' >Month</span>
                  <select
                    className={`w-[100px] h-[35px] text-center border border-gray-300 rounded-md p-2 hover:border-2 hover:border-[#007AFF] focus:outline-none`}                       value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} >
                      {months.map((month, index) => ( 
                        <option key={month} value={index + 1}> {month} </option> 
                        ))} 
                  </select> 
                  </div>

                        

                  <div className='w-[130px] h-[32px] mt-4 mb-1 flex justify-center items-center bg-[#007AFF] border-2 transition ease-linear delay-150 hover:-translate-y-1 hover:scale-110 hover:border-[3px] hover:bg-gradient-to-r from-[#0575E6] via-[#295cde] to-[#133bca] duration-300 ... rounded-[100px] text-[#FFFFFF] font-normal'>
                  <button className='w-full h-full  flex justify-center items-center ' onClick="#">
                    <span className='mr-1' >
                    <svg width="20px" height="17px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fill="#ffffff"> <path d="M8.75 1.75a.75.75 0 00-1.5 0v6.59L5.3 6.24a.75.75 0 10-1.1 1.02L7.45 10.76a.78.78 0 00.038.038.748.748 0 001.063-.037l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V1.75z"></path> <path d="M1.75 9a.75.75 0 01.75.75v3c0 .414.336.75.75.75h9.5a.75.75 0 00.75-.75v-3a.75.75 0 011.5 0v3A2.25 2.25 0 0112.75 15h-9.5A2.25 2.25 0 011 12.75v-3A.75.75 0 011.75 9z"></path> </g> </g></svg> 
                    </span>
                    <span>Past Receipt</span>

                  </button>
                </div>
                </div>
              </div>  
              
            </div>
          </div>



        </div>
        <div className=' w-full  flex p-4 gap-16  ' >
        <div className='w-[75%]  flex items-center justify-end '>
          <div className='w-[111px] h-[32px] p-2 flex justify-center items-center transition ease-linear delay-150 hover:-translate-y-1 hover:scale-110 hover:border-[3px] hover:bg-gradient-to-r from-[#0575E6] via-[#295cde] to-[#133bca] duration-300 ... bg-[#007AFF] border-0 rounded-[100px] text-[#FFFFFF] font-normal'>
            <button>Download</button>
          </div>
        </div>
        <div className='w-[25%]  ' ></div>
        </div> 
      </div>
      
      
    </div>
  );
}

export default Finance;
