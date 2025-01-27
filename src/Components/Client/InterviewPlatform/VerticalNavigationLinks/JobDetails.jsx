import React, { useState } from 'react';

const JobDetails = () => {
  const [selectedEssentials, setSelectedEssentials] = useState(['Java', 'React.js']);
  const essentialOptions = ['Java', 'OOPS', 'Springboot', 'React.js', 'AWS', 'Kafka'];

  const handleAddEssential = (event) => {
    const value = event.target.value;
    if (value && !selectedEssentials.includes(value)) {
      setSelectedEssentials([...selectedEssentials, value]);
    }
    event.target.value = ''; // Reset the dropdown to the default option
  };

  const handleRemoveEssential = (essential) => {
    setSelectedEssentials(selectedEssentials.filter((item) => item !== essential));
  };

  const styles = {
    
      shadow1: {
        boxShadow: '0 0px 6px #f0dcfc, 0 -0px 6px #f0dcfc, 0px 0 0px #f0dcfc, -0px 0 6px #f0dcfc'
      },
    
    container: {
      fontFamily: "Arial, sans-serif",
      width: "100%",
      padding: "30px",
      backgroundColor: "#ffffff",
      color: "#212529",
    },
    formRow: {
      marginLeft:"-100px",
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: '10px',
    },
    label: {
      fontSize: '14px',
      fontWeight: 600,
      width: '20%',
      textAlign: 'right',
      paddingRight:"20px"
    },
    input: {
      fontSize: '14px',
      padding: '8px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      width: '40%',
    },
    select: {
      fontSize: '14px',
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      width: '300px',
    },
    uploadBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '0px solid #ccc',
      borderRadius: '20px',
      padding: '10px',
      marginBottom: '10px',
      cursor: 'pointer',
      background: "#f0dcfc",
      width: '40%',
    },
    saveButton: {
      display: 'block',
      marginTop: '5px',
      padding: '10px',
      backgroundColor: '#f0dcfc',
      color: 'black',
      border: 'none',
      borderRadius: '20px',
      fontSize: '16px',
      cursor: 'pointer',
      textAlign: 'center',
      marginBottom:"20px"
    },
    tableContainer: {
      display: "grid",
      rowGap: "10px",
      marginTop: "30px",
    },
    tableRow: {
      display: "grid",
      gridTemplateColumns: "20% 15% 55% 10%",
      alignItems: "center",
      background: "#f5f2e6",
      borderRadius: "25px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      padding: "15px",
    },
    tableHeader: {
      fontWeight: "bold",
      fontSize: "14px",
      color: "black",
      paddingBottom: "10px",
      paddingLeft: "10px",
      display: "grid",
      gridTemplateColumns: "20% 15% 55% 10%",
      alignItems: "center",
    },
    ul: {
      listStyleType: "disc",
      paddingLeft: "20px",
      margin: 0,
    },
    editButton: {
      backgroundColor: "#f8f4e4",
      border: "1px solid #ccc",
      borderRadius: "6px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      cursor: "pointer",
      padding: "5px",
    },
    editIcon: {
      width: "20px",
      height: "20px",
    },
  };

  const rows = [
    { detail: "Intro", time: "5 Minutes", guidelines: "Introduce Yourself\nAsk Introduction\nEtc." },
    { detail: "Java Concept", time: "25 Minutes", guidelines: "Introduce Yourself\nAsk Introduction\nEtc." },
    { detail: "Database", time: "15 Minutes", guidelines: "Introduce Yourself\nAsk Introduction\nEtc." },
    { detail: "Test Cases", time: "10 Minutes", guidelines: "Introduce Yourself\nAsk Introduction\nEtc." },
    { detail: "Feedback", time: "5 Minutes", guidelines: "Introduce Yourself\nAsk Introduction\nEtc." },
  ];

  const recruiters = ['John Doe', 'Jane Smith', 'Emily Davis'];

  return (
    <div style={styles.container}>
      <div style={styles.formRow}>
        <label style={styles.label}>Job Role</label>
        <input type="text" value="SDE III" readOnly style={styles.input} />
      </div>

      <div style={styles.formRow}>
        <label style={styles.label}>Interview Time</label>
        <input type="text" value="60 Minutes" style={styles.input} />
      </div>

      <div style={styles.formRow}>
        <label style={styles.label}>Job Description</label>
        <div style={{...styles.shadow1}} className='flex items-center justify-center border-[3px] border-solid border-gray-300 rounded-[20px] p-2 mb-2 cursor-pointer bg-[#f0dcfc] w-[40%] transition ease-linear delay-150 hover:-translate-y-1 hover:scale-100 hover:border-[3px] hover:bg-gradient-to-r from-[#dda1ff] via-[#dfb5f8ef] to-[#f0dcfcda] duration-300 ... ' >Click to View</div>
      </div>

      <div style={styles.formRow}>
        <label style={styles.label}>Active/Archived</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '40%' }}>
          <select style={styles.select}>
            <option value="">Archived</option>
            {recruiters.map((recruiter) => (
              <option key={recruiter} value={recruiter}>
                {recruiter}
              </option>
            ))}
          </select>
          <button  className="block mt-4 p-2 bg-[#f0dcfc] text-black border-none rounded-[20px] text-[16px] cursor-pointer text-center mb-5 transition ease-linear delay-150 hover:-translate-y-1 hover:scale-100 hover:border-[3px] hover:bg-gradient-to-r from-[#dda1ff] via-[#dfb5f8ef] to-[#f0dcfcda] duration-300 hover:border-[#dfb5f8ef] ... " >Make Active</button>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <div>DETAILS</div>
          <div>TIME</div>
          <div>GUIDELINES</div>
          <div></div>
        </div>
        {rows.map((row, index) => (
          <div key={index} style={styles.tableRow} className='transition-all ease-linear delay-150 hover:-translate-y-[3px] hover:scale-40 hover:bg-[#ebebeb82] hover:border-[1px] hover:border-[#fcd740] ' >
            <div>{row.detail}</div>
            <div>{row.time}</div>
            <div>
              <ul style={styles.ul}>
                {row.guidelines.split("\n").map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
            <div style={{ textAlign: "center" }}>
              <button style={styles.editButton} className='shadow-lg transition ease-linear delay-150 hover:-translate-y-1 hover:scale-100 hover:border-[3px] duration-300 hover:border-[#ec5555ef] ... ' >
                <img
                  src="https://img.icons8.com/?size=100&id=49&format=png&color=000000"
                  alt="Edit"
                  style={styles.editIcon} className=' '
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobDetails;
