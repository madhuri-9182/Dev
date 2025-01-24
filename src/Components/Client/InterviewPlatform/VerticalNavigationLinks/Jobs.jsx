import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const styles = {
  body: {
    fontFamily: 'Roboto, sans-serif',
    margin: 0,
    padding: '20px',
    backgroundColor: '#fff',
    color: '#212529',
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: '20px',
    padding: '8px 16px',
    width: '300px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    fontSize: '14px',
    color: '#495057',
  },
  addJobButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  filters: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  select: {
    fontWeight: '600',
    padding: '8px 12px',
    border: '2px solid #979DA3',
    borderRadius: '15px',
    fontSize: '14px',
    color: '#000',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  input: {
    padding: '8px 12px',
    border: '2px solid #979DA3',
    borderRadius: '15px',
    fontSize: '14px',
    color: '#495057',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontWeight: '600',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 5px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    padding: '10px',
  },
  row: {
    backgroundColor: '#EBEBEB80',
    borderRadius: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
    padding: '10px 20px',
    gap: '10px',
    fontWeight: '600',
  },
  nameColumn: {
    display: 'flex',
    alignItems: 'center',
    width: '150px',
    textAlign: 'left',
    gap: '10px',
  },
  circle: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#979797',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
  },
  btnGroup: {
    display: 'flex',
    gap: '10px',
    transform: 'translateX(-30px)',
  },
  btn: {
    padding: '6px 16px',
    fontSize: '14px',
    color: 'black',
    backgroundColor: '#E8DEF8',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  btnArchive: {
    backgroundColor: '#FF0000',
    color: 'black',
    border: '1px solid black',
  },
  badgeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginLeft: 'auto',
  },
  badge: {
    padding: '6px 12px',
    fontSize: '16px',
    borderRadius: '20px',
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
    display: 'inline-block',
    minWidth: '120px',
  },
};

const Jobs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Initialize useLocation
  const rows = [
    'SDE-II',
    'SDE-III',
    'SDET-II',
    'SDET-I',
    'EM',
    'PE',
    'DEVOPS-II',
    'SDE-I',
    'QA-I',
    'QA-II',
  ];

  const handleArchiveClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={styles.body} className='text-[14px]' >
      <div style={styles.header}>
      <div className="flex items-center border-2 border-white bg-gray-100 rounded-full px-4 py-2 w-[360px] hover:border-2 hover:border-blue-500  ">
            <input
              type="text"
              placeholder="Search Client by name"
              className="flex-1 bg-transparent text-gray-600 outline-none text-sm"
            />
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
          </div>
        <div className=' h-[45px] w-[120px] flex items-center ' >
        <button
          className=' border-[3px] border-white bg-gradient-to-r bg-from-[#0575E6]-via-[#295cde]-to-[#133bca] hover:border-[3px] hover:border-blue-500 hover:bg-gradient-to-r from-[#0575E6] via-[#295cde] to-[#133bca]  '
          style={styles.addJobButton}
          onClick={() => navigate(`${location.pathname}/addjob`)}
        >
         + Add Job
        </button>
        </div>
      </div>

      <div style={styles.filters}>
        <select style={styles.select}>
          <option value="SDE-II">SDE-II</option>
          <option value="SDE-III">SDE-III</option>
        </select>
        <select style={styles.select}>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
        <select style={styles.select}>
          <option value="Hiring Manager">Hiring Manager</option>
        </select>
        <select style={styles.select}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <input type="date" style={styles.input} className='text-black' />
      </div>
      
      <div style={styles.table}  >
        {rows.map((row, index) => (
          <div key={index}  className='h-12 bg-[#EBEBEB80] rounded-[20px] shadow-md flex items-center justify-between mb-[10px] px-[10px] py-[20px] gap-[10px] font-semibold transition-all ease-linear delay-150 hover:-translate-y-[3px] hover:scale-40 hover:bg-[#ebebeb82] hover:border-[1px] hover:border-gray-400  '  >
            <div style={styles.nameColumn} className='text-[14px] font-normal' >{row}</div>
            <div  className="flex gap-2 transform -translate-x-8"  >
              <button className="px-4 py-1 text-sm text-yellow-500 bg-yellow-50  border-[1px] border-yellow-500 rounded-full cursor-pointer duration-200 transition ease-linear delay-150 hover:-translate-y-1 hover:scale-40  "
              onClick={() => navigate(`${location.pathname}/jobdetails`)}>View</button>
              <button  className="px-4 py-1 text-sm text-blue-600 border-[1px] border-blue-600 bg-blue-100  rounded-full cursor-pointer transition-all ease-linear delay-150 hover:-translate-y-1 hover:scale-40 
               ">+ Add Candidate</button>
              <button
                
                 className="px-4 py-1 text-sm text-red-500 bg-red-100  border-[1px] border-red-500 rounded-full cursor-pointer  duration-200 transition ease-linear delay-150 hover:-translate-y-1 hover:scale-40 "
                onClick={handleArchiveClick}
              >
                Archive
              </button>
             

            </div>
            <div  className=' flex items-center gap-[10px] ml-auto ' >
              <span className='px-3 py-1  font-normal text-[#000000] text-center inline-block min-w-[120px] rounded-full'>Active Candidates</span>
              <div  className="w-6 h-6 rounded-full bg-white text-[#979DA3] border-[2px] border-[#979DA3] flex items-center justify-center text-sm font-semibold 
               " >29</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 130,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              width: '300px',
              textAlign: 'center',
            }}
          >
            <h2 style={{fontSize:"20px",fontWeight:"600"}}>Reason for Archive</h2>
            <button style={{ display: 'block', margin: '10px 0', border:"1px solid black", padding:"5px 70px ",borderRadius:"8px" }}>Position Filled</button>
            <button style={{ display: 'block', margin: '10px 0', border:"1px solid black", padding:"5px 60px ",borderRadius:"8px" }}>Position On Hold</button>
            <button style={{ display: 'block', margin: '10px 0', border:"1px solid black", padding:"5px 100px ",borderRadius:"8px" }}>Other</button>
            <button
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: '#f5f2e6',
                borderRadius: '25px',
                border: '1px solid black',
                marginRight:"10px"
              }}
              onClick={closeModal}
              
            >
              Cancel
            </button>
            <button
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#007AFF',
                color: '#fff',
                borderRadius: '25px',
              }}
              onClick={() => {
                console.log('Archive Confirmed');
                closeModal();
              }}
            >
              Archive
            </button>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
