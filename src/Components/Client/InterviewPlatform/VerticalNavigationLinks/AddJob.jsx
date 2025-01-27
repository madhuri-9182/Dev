import React, { useState } from 'react';

const AddJob = () => {
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
    container: {
      width: '100%',
      maxWidth: '600px',
      margin: '20px 0px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#212529',
    },
    formRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '10px',
    },
    label: {
      fontSize: '14px',
      fontWeight: 600,
      width: '35%',
      height:'100%',
      marginRight: '20px',
      textAlign: 'right',
      alignItems:'center',
      justifyContent:'center',
    },
    input: {
      fontSize: '14px',
      padding: '8px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      width: '60%',
      
    },
    select: {
      fontSize: '14px',
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      width: '60%',
    },
    uploadBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px dashed #ccc',
      borderRadius: '6px',
      padding: '10px',
      marginBottom: '10px',
      cursor: 'pointer',
      
    },
    uploadIcon: {
      marginRight: '5px',
      fontSize: '18px',
    },
    textarea: {
      fontSize: '14px',
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      width: '100%',
      resize: 'none',
    },
    essentialsList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginTop: '10px',
    },
    essentialTag: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'white',
      fontSize: '12px',
      fontWeight: 600,
      padding: '6px 12px',
      borderRadius: '10px',
      border: '1px solid #ccc',
    },
    removeButton: {
      marginLeft: '8px',
      background: 'none',
      border: 'none',
      color: 'black',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    saveButton: {
      display: 'block',
      width: '15%',
      marginLeft: '500px',
      padding: '10px',
      backgroundColor: '#007aff',
      color: 'white',
      border: 'none',
      borderRadius: '20px',
      fontSize: '16px',
      cursor: 'pointer',
      textAlign: 'center',
    },
    uploadIconImage: {
        width: '24px', // Adjust as per design
        height: '24px',
        marginRight: '8px',
      },
      
  };

  const recruiters = ['John Doe', 'Jane Smith', 'Emily Davis'];
  const hiringManagers = ['Michael Scott', 'Dwight Schrute', 'Jim Halpert'];

  return (
    <div className='flex gap-x-14' >
    <div style={styles.container}   >
      <div style={styles.formRow} className='' >
        <label style={styles.label} className='' >Job Role</label>
        <input className='' type="text" value="SDE III" readOnly style={styles.input}  />
      </div>

      <div style={styles.formRow}>
        <label style={styles.label}>Job ID</label>
        <input type="text" placeholder="Optional" style={styles.input} className='text-black' />
      </div>

      <div style={styles.formRow}>
        <label style={styles.label}>Assigned Recruiter</label>
        <select style={styles.select}>
          <option value="">Select Recruiter</option>
          {recruiters.map((recruiter) => (
            <option key={recruiter} value={recruiter}>
              {recruiter}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.formRow}>
        <label style={styles.label}>Hiring Manager</label>
        <select style={styles.select}>
          <option value="">Select Hiring Manager</option>
          {hiringManagers.map((manager) => (
            <option key={manager} value={manager}>
              {manager}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.formRow}>
        <label style={styles.label}>Total Positions</label>
        <input type="text" value="-" readOnly style={styles.input} />
      </div>

      <div style={styles.formRow}>
        <label style={styles.label}>IC/Manager</label>
        <select style={styles.select}>
          <option value="IC">IC</option>
          <option value="Manager">Manager</option>
        </select>
      </div>

      <div style={styles.formRow}  >
  <label style={styles.label}>Job Description</label>
  <div style={{ width: '60%' }}>
    <div style={styles.uploadBox} className='hover:bg-gray-100' >
      <img
        src="https://img.icons8.com/?size=100&id=6b7l1lBTegrx&format=png&color=000000"
        alt="Upload Icon"
        style={styles.uploadIconImage}
      />
      Upload Here
    </div>
    <textarea
      placeholder="Paste Job Description Here"
      rows="4"
      style={styles.textarea}
    ></textarea>
  </div>
</div>

      <div style={styles.formRow}>
        <label style={styles.label}>Essentials</label>
        <div style={{ width: '60%' }}>
          <select style={styles.select} onChange={handleAddEssential}>
            <option value="">Select an Essential</option>
            {essentialOptions.map((essential) => (
              <option key={essential} value={essential}>
                {essential}
              </option>
            ))}
          </select>
          <div style={styles.essentialsList}>
            {selectedEssentials.map((essential) => (
              <div key={essential} style={styles.essentialTag}>
                {essential}
                <button
                  style={styles.removeButton}
                  onClick={() => handleRemoveEssential(essential)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button  className="block w-[15%] ml-[500px] p-2  text-white border-none rounded-[20px] text-[16px] cursor-pointer text-center  border-[3px] py-1 px-3   transition ease-linear delay-150 hover:-translate-y-1 hover:scale-110 hover:border-[3px] hover:bg-gradient-to-r from-[#0575E6] via-[#295cde] to-[#133bca] duration-300 ... bg-[#007AFF] "  >Save</button>
    </div>
    <div style={styles.container}   >

        <div style={styles.formRow}>
          <label style={styles.label}  >Add Questions:</label>
          <div style={{ width: '60%' }}>
            <div style={styles.uploadBox} className='hover:bg-gray-100 '>
              <img
                src="https://img.icons8.com/?size=100&id=6b7l1lBTegrx&format=png&color=000000"
                alt="Upload Icon"
                style={styles.uploadIconImage}
              />
              Upload Questions
            </div>
            <textarea
              placeholder="Add Questions"
              rows="4"
              style={styles.textarea}
            ></textarea>
          </div>
        </div>

    </div>
    </div>
  );
};

export default AddJob;
