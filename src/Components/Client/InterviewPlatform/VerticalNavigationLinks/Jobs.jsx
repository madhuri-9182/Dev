import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const styles = {
  body: {
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
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
    border: '2px solid black',
    borderRadius: '15px',
    fontSize: '14px',
    color: '#000',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  input: {
    padding: '8px 12px',
    border: '2px solid black',
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
    backgroundColor: '#f5f2e6',
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
    backgroundColor: '#f5f2e6',
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
    <div style={styles.body}>
      <div style={styles.header}>
        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="Search Client by Name"
            style={styles.searchInput}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
          </svg>
        </div>
        <button
          style={styles.addJobButton}
          onClick={() => navigate(`${location.pathname}/addjob`)}
        >
         + Add Job
        </button>
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
        <input type="date" style={styles.input} />
      </div>

      <div style={styles.table}>
        {rows.map((row, index) => (
          <div key={index} style={styles.row}>
            <div style={styles.nameColumn}>{row}</div>
            <div style={styles.btnGroup}>
              <button style={styles.btn} onClick={() => navigate(`${location.pathname}/jobdetails`)}>View</button>
              <button style={styles.btn}>+ Add Candidate</button>
              <button
                style={{ ...styles.btn, ...styles.btnArchive }}
                onClick={handleArchiveClick}
              >
                Archive
              </button>
            </div>
            <div style={styles.badgeContainer}>
              <span style={styles.badge}>Active Candidates</span>
              <div style={styles.circle}>29</div>
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
