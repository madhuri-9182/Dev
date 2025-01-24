import React from 'react'

const styles = {
  shadow1: {
    boxShadow: '0 0px 6px #c1c1c1, 0 -0px 0px #c1c1c1, 0px 0 0px #c1c1c1, -0px 0 6px #c1c1c1'
  }
};


function Dashboard() {
  return (
    <div className='-mt-5 p-1 grid grid-cols-2'>
      {/* Pending Task */}

      <div className='pendingTaskContainer p-4 w-full flex flex-col '>
        <div className='ml-[5%]'>
          <div className='pendingTaskHeading'>
            <h1 className='text-[18px] font-semibold text-[#333B69]'>Pending Task <span className='text-white text-sm font-normal bg-[#056DDC] px-2 py-2 rounded-full'>38</span></h1>
          </div>
          <div className='pendingTaskBox mt-5'>
            <div className="p-6 bg-[#E7E4E8] rounded-xl w-[400px] h-[246px] transition ease-linear delay-150 hover:-translate-y-0 hover:scale-110 " style={styles.shadow1} >
              <div className="grid grid-cols-2 gap-2 md:gap-4 gap-y-4 md:gap-y-6 text-center overflow-auto">
                <div className='p-1 flex flex-col items-start '>
                  <p className="text-base md:text-sm">SDE II</p>
                  <p className="text-lg md:text-sm font-bold">12</p>
                </div>
                <div className='p-1 flex flex-col items-start '>
                  <p className="text-base md:text-sm">SDE III</p>
                  <p className="text-lg md:text-sm font-bold">8</p>
                </div>
                <div className='p-1 flex flex-col items-start '>
                  <p className="text-base md:text-sm">SDET I</p>
                  <p className="text-lg md:text-sm font-bold">25</p>
                </div>
                <div className='p-1 flex flex-col items-start '>
                  <p className="text-base md:text-sm">EM</p>
                  <p className="text-lg md:text-sm font-bold">6</p>
                </div>
                <div className='p-1 flex flex-col items-start '>
                  <p className="text-base md:text-sm">SDE I (Frontend)</p>
                  <p className="text-lg md:text-sm font-bold">10</p>
                </div>
                <div className='p-1 flex flex-col items-start '>
                  <p className="text-base md:text-sm">SDE II (Frontend)</p>
                  <p className="text-lg md:text-sm font-bold">34</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* All Task */}
      <div className='pendingTaskContainer p-4 w-full flex flex-col '>
        <div className='ml-[5%] flex-grow flex flex-col'>
          <div className='pendingTaskHeading'>
          <h1 className='text-[18px] font-semibold text-[#333B69]'>All Task <span className='text-white text-sm font-normal bg-[#056DDC] px-2 py-2 rounded-full'>38</span></h1>
          </div>
          <div className='pendingTaskBox mt-5 '>
            <div className="p-6 bg-[#E7E4E8] rounded-xl w-[400px] h-[246px] transition ease-linear delay-150 hover:-translate-y-0 hover:scale-110 " style={styles.shadow1}>
              <div className="grid grid-cols-2 gap-2 md:gap-4 gap-y-4 md:gap-y-6 text-center overflow-auto">
                <div className='p-1 flex flex-col items-start '>
                  <p className="text-base md:text-sm">Total Interviews</p>
                  <p className="text-lg md:text-sm font-bold">12</p>
                </div>
                <div className='p-1 flex flex-col items-start '>
                  <p className="text-base md:text-sm">Pending Schedule</p>
                  <p className="text-lg md:text-sm font-bold">8</p>
                </div>
                <div className='p-1 flex flex-col items-start '>
                  <p className="text-base md:text-sm">Selects</p>
                  <p className="text-lg md:text-sm font-bold">25</p>
                </div>
                <div className='p-1 flex flex-col items-start '>
                  <p className="text-base md:text-sm">Joined</p>
                  <p className="text-lg md:text-sm font-bold">6</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>


      {/* My Jobs */}
      <div className='pendingTaskContainer p-4 w-full flex flex-col '>
        <div className='ml-[5%] flex-grow flex flex-col'>
          <div className='pendingTaskHeading'>
            <h1 className='text-[18px] font-semibold text-[#333B69]'>My Jobs </h1>
          </div>
          <div className='pendingTaskBox mt-5 '>
            <div style={styles.shadow1} className="p-6 bg-gradient-to-r from-blue-600 to-blue-300 rounded-xl w-[400px] h-[170px] transition ease-linear delay-150 hover:-translate-y-0 hover:scale-110" >
              <div className="grid grid-cols-2 gap-2 md:gap-4 gap-y-4 text-white md:gap-y-6 text-center overflow-auto">
                <div className='p-1 flex flex-col items-start '>
                  <p className="text-base md:text-sm">My Jobs</p>
                  <p className="text-lg md:text-sm font-bold">50</p>
                </div>
                <div className='p-1 flex flex-col items-start '>
                  <p className="text-base md:text-sm">Total Candidates</p>
                  <p className="text-lg md:text-sm font-bold">650</p>
                </div>
                <div className='p-1 flex flex-col items-start '>
                  <p className="text-base md:text-sm">Selected Candidates</p>
                  <p className="text-lg md:text-sm font-bold">340</p>
                </div>
                <div className='p-1 flex flex-col items-start '>
                  <p className="text-base md:text-sm">Rejected Candidates</p>
                  <p className="text-lg md:text-sm font-bold">244</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>


      {/* Analytics */}
      <div className='pendingTaskContainer p-4 w-full flex flex-col '>
        <div className='ml-[5%] flex-grow flex flex-col'>
          <div className='pendingTaskHeading'>
            <h1 className='text-[18px] font-semibold text-[#333B69]'>Analytics</h1>
          </div>
          <div className='pendingTaskBox mt-5 '>
            <div style={styles.shadow1} className="p-6 bg-gradient-to-r from-blue-600 to-blue-300 rounded-xl w-[400px] h-[170px] transition ease-linear delay-150 hover:-translate-y-0 hover:scale-110">
              <div className="grid grid-cols-2 gap-2 md:gap-4 gap-y-4 text-white md:gap-y-6 text-left overflow-auto">
                <div className='p-1 flex flex-col items-start '>
                  <p className="text-base md:text-sm">Companies with More Selects</p>
                  <p className="text-lg md:text-sm font-bold"></p>
                </div>
                <div className='p-1 flex flex-col items-start '>
                  <p className="text-base md:text-sm">Diversity Ratio</p>
                  <p className="text-lg md:text-sm font-bold"></p>
                </div>
                <div className='p-1 flex flex-col items-start '>
                  <p className="text-base md:text-sm">Role Wise Company Selects</p>
                  <p className="text-lg md:text-sm font-bold"></p>
                </div>
                <div className='p-1 flex flex-col items-start '>
                  <p className="text-base md:text-sm">Interview Declined</p>
                  <p className="text-lg md:text-sm font-bold"></p>
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
