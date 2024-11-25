import React from 'react'

function Dashboard() {
  return (
    <div className='p-4 grid grid-cols-2 gap-y-6'>
      {/* Pending Task */}

      <div className='pendingTaskContainer p-4 w-full flex flex-col'>
        <div className='ml-[15%]'>
          <div className='pendingTaskHeading'>
            <h1 className='text-[18px]'>Pending Task <span className='text-white bg-[#056DDC] px-2 py-1 rounded-full'>38</span></h1>
          </div>
          <div className='pendingTaskBox mt-5'>
            <div className="p-4 bg-[#E7E4E8] rounded-xl w-5/6 ">
              <div className="grid grid-cols-2 gap-2 md:gap-4 gap-y-4 md:gap-y-6 text-center overflow-auto">
                <div>
                  <p className="text-base md:text-lg">SDE II</p>
                  <p className="text-lg md:text-xl font-bold">12</p>
                </div>
                <div>
                  <p className="text-base md:text-lg">SDE III</p>
                  <p className="text-lg md:text-xl font-bold">8</p>
                </div>
                <div>
                  <p className="text-base md:text-lg">SDET I</p>
                  <p className="text-lg md:text-xl font-bold">25</p>
                </div>
                <div>
                  <p className="text-base md:text-lg">EM</p>
                  <p className="text-lg md:text-xl font-bold">6</p>
                </div>
                <div>
                  <p className="text-base md:text-lg">SDE I (Frontend)</p>
                  <p className="text-lg md:text-xl font-bold">10</p>
                </div>
                <div>
                  <p className="text-base md:text-lg">SDE II (Frontend)</p>
                  <p className="text-lg md:text-xl font-bold">34</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* All Task */}
      <div className='pendingTaskContainer p-4 w-full flex flex-col '>
        <div className='ml-[15%] flex-grow flex flex-col'>
          <div className='pendingTaskHeading'>
            <h1 className='text-[18px]'>All Tasks<span className='text-white bg-[#056DDC] px-2 py-1 rounded-full'>38</span></h1>
          </div>
          <div className='pendingTaskBox mt-5 flex-grow overflow-y-auto'>
            <div className="p-4 bg-[#E7E4E8] rounded-xl w-5/6 h-full">
              <div className="grid grid-cols-2 gap-2 md:gap-4 gap-y-4 md:gap-y-6 text-center overflow-auto">
                <div>
                  <p className="text-base md:text-lg">Total interviews</p>
                  <p className="text-lg md:text-xl font-bold">12</p>
                </div>
                <div>
                  <p className="text-base md:text-lg">Pending Schedules</p>
                  <p className="text-lg md:text-xl font-bold">8</p>
                </div>
                <div>
                  <p className="text-base md:text-lg">Selects</p>
                  <p className="text-lg md:text-xl font-bold">25</p>
                </div>
                <div>
                  <p className="text-base md:text-lg">Joined</p>
                  <p className="text-lg md:text-xl font-bold">6</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>


      {/* My Jobs */}
      <div className='pendingTaskContainer p-4 w-full flex flex-col '>
        <div className='ml-[15%] flex-grow flex flex-col'>
          <div className='pendingTaskHeading'>
            <h1 className='text-[18px]'>My Jobs </h1>
          </div>
          <div className='pendingTaskBox mt-5 flex-grow overflow-y-auto'>
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-300 rounded-xl w-5/6 h-full">
              <div className="grid grid-cols-2 gap-2 md:gap-4 gap-y-4 text-white md:gap-y-6 text-center overflow-auto">
                <div>
                  <p className="text-lg md:text-lg">My Jobs</p>
                  <p className="text-lg md:text-xl font-bold">50</p>
                </div>
                <div>
                  <p className="text-lg md:text-lg">Total Candidates</p>
                  <p className="text-lg md:text-xl font-bold">650</p>
                </div>
                <div>
                  <p className="text-lg md:text-lg">Selected Candidates</p>
                  <p className="text-lg md:text-xl font-bold">340</p>
                </div>
                <div>
                  <p className="text-lg md:text-lg">Rejected Candidates</p>
                  <p className="text-lg md:text-xl font-bold">244</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
      {/* Analytics */}
      <div className='pendingTaskContainer p-4 w-full flex flex-col '>
        <div className='ml-[15%] flex-grow flex flex-col'>
          <div className='pendingTaskHeading'>
            <h1 className='text-[18px]'>Analytics</h1>
          </div>
          <div className='pendingTaskBox mt-5 flex-grow overflow-y-auto'>
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-300 rounded-xl w-5/6 h-full">
              <div className="grid grid-cols-2 gap-2 md:gap-4 gap-y-4 text-white md:gap-y-6 text-center overflow-auto">
                <div>
                  <p className="text-lg md:text-lg">Companies with more selects</p>
                  <p className="text-lg md:text-xl font-bold"></p>
                </div>
                <div>
                  <p className="text-lg md:text-lg">Diversity Ratio</p>
                  <p className="text-lg md:text-xl font-bold"></p>
                </div>
                <div>
                  <p className="text-lg md:text-lg">Ratio Wise Company Selects</p>
                  <p className="text-lg md:text-xl font-bold"></p>
                </div>
                <div>
                  <p className="text-lg md:text-lg">Interview Decline</p>
                  <p className="text-lg md:text-xl font-bold"></p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>



    </div>
  )
}

export default Dashboard
