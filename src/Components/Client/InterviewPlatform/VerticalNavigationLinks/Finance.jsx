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
    
      if (selectedYear<selectedYear2 && selectedMonth<selectedMonth2 && selectedDay<selectedDay2) {
        alert("Please mention date in correct order ")
        
        
      }else{
    
    
      const startDate =new Date (`${selectedYear}/${selectedMonth}/${selectedDay}`);
      const endDate =new Date (`${selectedYear2}/${selectedMonth2}/${selectedDay2}`);
      
      
      
    if (!startDate || !endDate) {
      setFilteredData(data);
      return;
    }
    
    const filtered = data.filter(item => {
      
      const date =new Date (parseDate(item.Date));
      
      
      return date >= startDate && date <= endDate;
    });
    setFilteredData(filtered);
    setIsDataRangeEntered(true);
  }
  };
    
    
    
  


  return (
    <div className='w-full h-screen text-[14px]'>
      <div className='w-full h-screen'>
        <div className='w-full flex font-semibold text-[20px] p-4'>
          <div className='w-[50%]'>{isDataRangeEntered? "Past Payments": "Current Dues"}</div>
          <div className='w-[50%]'>Total: INR 5,00,000.00</div>
        </div>
        <div className='w-full  flex mt-6 gap-16  '>
          <div className='w-[75%]'>
            <table className="w-full text-left border-collapse">
              <thead className='text-black'>
                <tr className='border-b-[3px] border-[#4F4F4F] ' >
                  <th className='py-2 px-4 max-w-max  text-[15px] font-bold'>Candidate</th>
                  <th className='py-2 px-4 max-w-max  text-[15px] font-normal'>ROLE</th>
                  <th className='py-2 px-4 max-w-max  text-[15px] font-normal'>EXPERIENCE</th>
                  <th className='py-2 px-4 max-w-max  text-[15px] font-normal'>DATE</th>
                  <th className='py-2 px-4 max-w-max  text-[15px] font-normal'>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((data, index) => (  
                  <tr key={index} className={`${index % 2 === 0 ? "" : (isDataRangeEntered ? "bg-[#FFC7001F] ": "bg-[#E5ECF6]" ) } h-[91px] border-b border-gray-300 `}>
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
              <div className=' w-full flex justify-end items-center' >
                <span className='w-[20%]  flex justify-end ' >From:</span>  
                <div className=" w-[80%]  lg:flex lg:flex-wrap md:grid md:grid-cols-2 flex-wrap items-center justify-center  gap-2 "> 
                  
                  <select
                    className={` h-[35px] border border-gray-300 rounded-md p-2  `}                       value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} >
                      {months.map((month, index) => ( 
                        <option key={month} value={index + 1}> {month} </option> 
                        ))} 
                  </select> 
                  <select 
                    className=" h-[35px]  border border-gray-300 rounded-md " 
                    onChange={(e)=> setSelectedDay(parseInt(e.target.value))}
                    value={selectedDay}
                    >     
                    {days.map((day) => (
                      <option key={day} value={day}> {day} </option>
                      ))} 
                  </select> 
                  <select 
                    className=" h-[35px] border border-gray-300 rounded-md " value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} >
                      {years.map((year)=>(
                        <option key={year} value={year}>{year}</option>
                      ))}
                  </select>
                  
                  
                </div>
              </div>  
              <div className=' w-full flex justify-center items-center ' >
                <span className='w-[20%] flex justify-end ' >To:</span>  
                <div className=" w-[80%] lg:flex lg:flex-wrap md:grid md:grid-cols-2 flex-wrap items-center justify-center  gap-2 "> 
                  
                  <select
                    className=" h-[35px] border border-gray-300 rounded-md p-2" value={selectedMonth2} onChange={(e) => setSelectedMonth2(parseInt(e.target.value))} >
                      {months.map((month, index) => ( 
                        <option key={month} value={index + 1}> {month} </option> 
                        ))} 
                  </select> 
                  <select 
                    className=" h-[35px]  border border-gray-300 rounded-md "
                    value={selectedDay2}
                    onChange={(e)=>setSelectedDay2(parseInt(e.target.value))} >     
                    {days2.map((day) => (
                      <option key={day} value={day}> {day} </option>
                      ))} 
                  </select> 
                  <select 
                    className=" h-[35px] border border-gray-300 rounded-md " value={selectedYear2} onChange={(e) => setSelectedYear2(parseInt(e.target.value))} >
                      {years.map((year)=>(
                        <option key={year} value={year}>{year}</option>
                      ))}
                  </select>
                  
                  
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
        <div className=' w-full  flex p-4 gap-16  ' >
        <div className='w-[75%]  flex items-center justify-end '>
          <div className='w-[111px] h-[32px] p-2 flex justify-center items-center bg-[#007AFF] border-0 rounded-[100px] text-[#FFFFFF] font-normal'>
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
