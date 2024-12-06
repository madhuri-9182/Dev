import React,{useState} from 'react'



function Dashboard() {

  const [categories,setCategories] = useState([
    { name: 'SDE-II', activeCount: 38 },
    { name: 'SDE-III', activeCount: 22 },
    { name: 'DevOps', activeCount: 15 },
    {name:'QA-I',activeCount:32}
  ]);

  return (
    <div className='w-full'>
      <div className='w-full flex gap-x-3'>
        <div className='p-2 flex flex-col gap-y-3'>
          <div>
            <h1 className='text-sm font-bold'> My Jobs  <span className='text-white bg-[#056DDC] rounded-full p-1'>38</span></h1>
          </div>
          <div className='p-2 pl-3 w-[400px] h-[200px] bg-[#EBEBEB] grid grid-cols-3 gap-2 rounded-lg'>
            <div className='p-1 flex flex-col items-start justify-center'>
              <span className='text-sm text-left'>SDE II</span>
              <span className='text-[24px] font-semibold'>3</span>
            </div>
            <div className='p-1 flex flex-col items-start justify-center'>
              <span className=' text-sm'>SDE III</span>
              <span className=' text-[24px] font-semibold'>7</span>
            </div>
            <div className='p-1 flex flex-col items-start justify-center'>
              <span className=' text-sm'>SDET I</span>
              <span className=' text-[24px] font-semibold'>5</span>
            </div>
            <div className='p-1 flex flex-col items-start justify-center'>
              <span className='text-sm'>EM</span>
              <span className='text-[24px] font-semibold'>9</span>
            </div>
            <div className='p-1 flex flex-col items-start justify-center'>
              <span className='text-sm'>SDE I (Frontend)</span>
              <span className='text-[24px] font-bold'>3</span>
            </div>
            <div className='p-1 flex flex-col items-start justify-center'>
              <span className='text-sm'>SDE II (Frontend)</span>
              <span className=' text-[24px] font-semibold'>3</span>
            </div>
            <div className='col-start-3 flex items-end justify-end'>
              <h1 className='text-sm text-right text-[#007AFF] underline'>See All</h1>
            </div>
          </div>
        </div>
        <div className='p-2 w-3/4 flex flex-col gap-y-3'>
          <div className='flex items-center justify-center'>
            <div>
              <div className='px-2 w-full'>
                <h1 className='text-sm font-bold'>Details</h1>
              </div>
              <div className='p-2 max-w-max flex items-center justify-start gap-x-6'>

                <div className='pl-5 pt-5 pr-2 pb-2 h-[200px] w-[200px] bg-[#E5ECF6] rounded-lg flex flex-col justify-between'>
                  <div className='flex flex-col'>
                    <span className='text-sm'>Total Candidates</span>
                    <span className='text-[24px] font-semibold'>650</span>
                  </div>
                  <div className=' flex items-end justify-end'>
                    <h1 className='text-sm text-right text-[#007AFF] underline'>See All</h1>
                  </div>
                </div>
                <div className='pl-5 pt-5 pr-2 pb-2 h-[200px] w-[200px] bg-[#E3F5FF] rounded-lg flex flex-col justify-between'>
                  <div className='flex flex-col'>
                    <span className='text-sm'>Selected Candidates</span>
                    <span className='text-[24px] font-semibold'>400</span>
                  </div>
                  <div className=' flex items-end justify-end'>
                    <h1 className='text-sm text-right text-[#007AFF] underline'>See All</h1>
                  </div>
                </div>
                <div className='pl-5 pt-5 pr-2 pb-2 h-[200px] w-[200px] bg-[#E5ECF6] rounded-lg flex flex-col justify-between'>
                  <div className='flex flex-col'>
                    <span className='text-sm'>Rejected Candidates</span>
                    <span className='text-[24px] font-semibold'>250</span>
                  </div>
                  <div className=' flex items-end justify-end'>
                    <h1 className='text-sm text-right text-[#007AFF] underline'>See All</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full space-y-2">
      {categories.map((category, index) => (
        <div key={index} className="px-4 w-full flex bg-[#EBEBEB] rounded-full">
          {/* Left Section */}
          <div className="px-2 py-1 w-[40%] flex items-center justify-center">
            <div className="w-[30%]">
              <span className="text-sm">{category.name}</span>
            </div>
            <div className="w-[70%] flex items-center justify-evenly">
              <div>
                <button
                  className="px-6 py-2 max-w-max bg-[#E8DEF8] rounded-full text-sm text-[#4A4459] hover:bg-[#eef8de] hover:duration-150"
                >
                  + Add Candidate
                </button>
              </div>
              <div>
                <button
                  className="px-4 py-2 max-w-max rounded-full text-[#4A4459] text-sm border-2 border-[#79747E] hover:bg-[#d2d2d2] hover:duration-150"
                >
                  + Archive
                </button>
              </div>
            </div>
          </div>
          {/* Right Section */}
          <div className="p-2 w-[60%] flex items-center justify-end group">
            <div>
              <span className="text-sm">
                Active Candidates{' '}
                <span className="ml-2 text-sm p-2 font-bold bg-gray-400 rounded-full group-hover:bg-[#056DDC] group-hover:text-white group-hover:duration-150">
                  {category.activeCount}
                </span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  )
}

export { Dashboard as AgencyDashboard }
