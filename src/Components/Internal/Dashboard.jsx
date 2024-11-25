import React from 'react'

function Dashboard() {
  return (
    <div className='flex h-full overflow-hidden p-4'>
      <div class="flex flex-col w-1/2 p-4 h-full">
        <div className=''>
          <div className='pendingTaskHeading'>
            <h1 className='text-[16px] font-medium'>
              Interviewers
              <span className='ml-2 text-white bg-[#056DDC] px-2 py-0.5 rounded-full text-[12px]'>38</span>
            </h1>
          </div>
          <div className='pendingTaskBox mt-4'>
            <div className="p-3 bg-[#E7E4E8] rounded-lg w-4/5">
              <div className="grid grid-cols-2 gap-2 text-center overflow-auto">
                <div>
                  <p className="text-sm">Pending Acceptance</p>
                  <p className="text-base font-semibold">12</p>
                </div>
                <div>
                  <p className="text-sm">Interview Decline</p>
                  <p className="text-base font-semibold">8</p>
                </div>
                <div>
                  <p className="text-sm">Recommended</p>
                  <p className="text-base font-semibold">25</p>
                </div>
                <div>
                  <p className="text-sm">Rejected</p>
                  <p className="text-base font-semibold">6</p>
                </div>
                <div>
                  <p className="text-sm">Strong Candidates</p>
                  <p className="text-base font-semibold">10</p>
                </div>
                <div>
                  <p className="text-sm">Schedule</p>
                  <p className="text-base font-semibold">34</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=' mt-8'>
          <div className='pendingTaskHeading'>
            <h1 className='text-[16px] font-medium'>
              Clients
            </h1>
          </div>
          <div className='pendingTaskBox mt-2'>
            <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg w-4/5">
              <div className="grid grid-cols-2 gap-2 text-center text-white overflow-auto">
                <div>
                  <p className="text-sm">Active Clients</p>
                  <p className="text-base font-semibold">12</p>
                </div>
                <div>
                  <p className="text-sm">Passive Clients</p>
                  <p className="text-base font-semibold">8</p>
                </div>
                <div>
                  <p className="text-sm">Pending Onboardings</p>
                  <p className="text-base font-semibold">25</p>
                </div>
                <div>
                  <p className="text-sm">Client Users</p>
                  <p className="text-base font-semibold">6</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=' mt-8'>
          <div className='pendingTaskHeading'>
            <h1 className='text-[16px] font-medium'>
              Details
            </h1>
          </div>
          <div className='pendingTaskBox mt-2'>
            <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg w-4/5">
              <div className="grid grid-cols-2 gap-2 text-center text-white overflow-auto">
                <div>
                  <p className="text-sm">Total Interviews</p>
                  <p className="text-base font-semibold">12</p>
                </div>
                <div>
                  <p className="text-sm">New Interviews</p>
                  <p className="text-base font-semibold">8</p>
                </div>
                <div>
                  <p className="text-sm">Active Jobs</p>
                  <p className="text-base font-semibold">25</p>
                </div>
                <div>
                  <p className="text-sm">Total Candidates</p>
                  <p className="text-base font-semibold">6</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-1/2 p-4 h-full">
      <div className='ml-[15%]'>
          <div className='pendingTaskHeading'>
            <h1 className='text-[16px] font-medium'>
              Messages
              <span className='ml-2 text-white bg-[#056DDC] px-2 py-0.5 rounded-full text-[12px]'>38</span>
            </h1>
          </div>
          <div className='pendingTaskBox mt-4'>
            <div className="p-3 bg-[#E7E4E8] h-full rounded-lg flex flex-col items-center justify-center gap-y-2">
                <div className='w-11/12 h-14 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl'></div>
                <div className='w-11/12 h-14 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl'></div>
                <div className='w-11/12 h-14 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl'></div>
                <div className='w-11/12 h-14 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl'></div>
                <div className='w-11/12 h-14 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl'></div>
                <div className='w-11/12 h-14 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl'></div>
                <div className='w-11/12 h-14 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl'></div>
                <div className='w-11/12 h-14 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Dashboard as InternalDashboard }
