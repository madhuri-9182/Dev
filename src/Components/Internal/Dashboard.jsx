import { useEffect, useState } from "react";
import axios from "../../api/axios";

function Dashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get("/api/internal/dashboard/").then((res) => {
      setData(res.data.data);
    });
  }, [])

  return (
    <div className="flex h-full overflow-hidden px-4">
      <div className="flex flex-col w-1/2 p-4 h-full">
        <div className="">
          <div className="pendingTaskHeading">
            <h1 className="text-[18px] font-semibold text-[#333B69]">
              Interviewers
              <span className={`ml-2 text-white bg-[#056DDC] ${(data?.interviewers?.total || 0) > 9 ? "p-1" : "py-1 px-2"} rounded-full text-[16px]`}>
                {data?.interviewers?.total || 0}
              </span>
            </h1>
          </div>
          <div className="pendingTaskBox mt-4">
            <div className="p-[30px] bg-[#E7E4E8] rounded-lg w-[90%]">
              <div className="grid grid-cols-2 gap-x-[80px] gap-y-[32px] overflow-auto">
                <div>
                  <p className="text-xs mb-[8px]">
                    Pending Acceptance
                  </p>
                  <p className="text-sm font-semibold">
                  {data?.interviewers?.pending_acceptance || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-[8px]">
                    Interview Decline
                  </p>
                  <p className="text-sm font-semibold">
                  {data?.interviewers?.interview_declined || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-[8px]">Recommended</p>
                  <p className="text-sm font-semibold">
                    {data?.interviewers?.recommended || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-[8px]">Rejected</p>
                  <p className="text-sm font-semibold">
                  {data?.interviewers?.rejected || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-[8px]">
                    Strong Candidates
                  </p>
                  <p className="text-sm font-semibold">
                  {data?.interviewers?.strong_candidates || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-[8px]">Scheduled</p>
                  <p className="text-sm font-semibold">
                  {data?.interviewers?.scheduled || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" mt-8">
          <div className="pendingTaskHeading">
            <h1 className="text-[18px] font-semibold text-[#333B69]">
              Clients
            </h1>
          </div>
          <div className="pendingTaskBox mt-2">
            <div className="p-[30px] bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg w-[90%]">
              <div className="grid grid-cols-2 gap-x-[80px] gap-y-[32px] text-white overflow-auto">
                <div>
                  <p className="text-xs mb-[8px]">Active Clients</p>
                  <p className="text-sm font-semibold">
                  {data?.clients?.active_clients || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-[8px]">Passive Clients</p>
                  <p className="text-sm font-semibold">
                  {data?.clients?.passive_clients || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-[8px] min-w-max">
                    Pending Onboardings
                  </p>
                  <p className="text-sm font-semibold">
                  {data?.clients?.passive_clients || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-[8px]">Client Users</p>
                  <p className="text-sm font-semibold">
                  {data?.clients?.client_users || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" mt-8">
          <div className="pendingTaskHeading">
            <h1 className="text-[18px] font-semibold text-[#333B69]">
              Details
            </h1>
          </div>
          <div className="pendingTaskBox mt-2">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg w-[90%]">
              <div className="grid grid-cols-2 gap-x-[80px] gap-y-[32px] text-white overflow-auto">
                <div>
                  <p className="text-xs mb-[8px]">
                    Total Interviews
                  </p>
                  <p className="text-sm font-semibold">
                  {data?.details?.total_interviewers || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-[8px]">New Interviews</p>
                  <p className="text-sm font-semibold">
                  {data?.details?.new_interviewers || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-[8px]">Active Jobs</p>
                  <p className="text-sm font-semibold">
                  {data?.details?.active_jobs || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-[8px]">
                    Total Candidates
                  </p>
                  <p className="text-sm font-semibold">
                  {data?.details?.total_candidates || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="w-1/2 p-4 h-full border-l border-[#E7E4E8] border-solid">
        <div className="w-[90%]">
          <div className="pendingTaskHeading">
            <h1 className="text-[18px] font-semibold text-[#333B69]">
              Messages
              <span className="ml-2 text-white bg-[#056DDC] p-1 rounded-full text-[16px]">
                38
              </span>
            </h1>
          </div>
          <div className="pendingTaskBox mt-4">
            <div className="p-3 bg-[#E7E4E8] h-full rounded-lg flex flex-col items-center justify-center gap-y-2">
              <div className="w-11/12 h-14 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl"></div>
              <div className="w-11/12 h-14 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl"></div>
              <div className="w-11/12 h-14 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl"></div>
              <div className="w-11/12 h-14 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl"></div>
              <div className="w-11/12 h-14 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl"></div>
              <div className="w-11/12 h-14 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl"></div>
              <div className="w-11/12 h-14 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl"></div>
              <div className="w-11/12 h-14 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export { Dashboard as InternalDashboard };
