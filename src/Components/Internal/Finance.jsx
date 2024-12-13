import React from 'react';

const Finance = () => {
  // CSS styles as a const object
  const styles = {
    container: {
      width: '90%',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: '20px 0',
    },
    select: {
      marginRight: '10px',
      padding: '5px',
      border:"1px solid gray ",
      borderRadius:"8px",
      marginLeft:"20px",
    },
    ratesButton: {
      padding: '6px 30px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      marginLeft:"200px"
    },
    searchBar: {
      padding: '6px 20px',
      width: '25%',
      border: '1px solid #ccc',
      borderRadius: '25px',
      backgroundColor:"#faf1e0"
    },
    section: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '30px',
      alignItems: 'flex-start',
    },
    tableContainer: {
      width: '70%',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px',
    },
    th: {
      backgroundColor: '#f9f9f9',
      fontWeight: 'bold',
      textAlign: 'left',
      borderBottom: '1px solid #ddd',
      padding: '12px 8px',
      color: '#333',
    },
    td: {
      padding: '12px 8px',
      borderBottom: '1px solid #ddd',
      fontSize: '14px',
      color: '#555',
    },
    td1: {
      padding: '12px 8px',
      borderBottom: '1px solid #ddd',
      fontSize: '14px',
      color: '#555',
      display:"flex",
      flexDirection:"row"
    },
    nameCell: {
      color: '#007bff', // Blue color for names
      fontWeight: 'bold',
    },
    clickable: {
      color: '#007bff',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    paymentIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    summary: {
      marginTop: "60px",
      display: 'flex',
      flexDirection: 'column',
      gap: '10px 10px',
      alignItems: "flex-start", // Left align
    },
    card: {
      width: '250px',
      height: "80px",
      backgroundColor: '#e5ecf6',
      padding: '10px 20px', // Adjust padding for better alignment
      textAlign: 'left', // Align text to the left
      borderRadius: '10px',
      fontWeight: 'normal',
      fontSize: '16px', // Match the smaller "Paid/Unpaid/Total" text
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    label: {
      
      fontSize: '14px',
      color: '#606060', // Grey color for the label
    },
    amount: {
      fontSize: '20px',
      color: '#000', // Black color for the amount
      fontWeight: 'bold',
      marginTop: '-25px',
    },
  };
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div  style={{display:"flex",flexDirection:"row"}}>
          <p style={{fontWeight:"600",padding: '5px'}}>Year</p>
          <select style={styles.select}>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
          <p style={{fontWeight:"600",padding: '5px'}}>Month</p>
          <select style={styles.select}>
          
            <option value="Dec">Dec</option>
            <option value="Nov">Nov</option>
          </select>
        </div>
        <button style={styles.ratesButton}>Rates</button>
        {/* <input
          type="text"
          placeholder="Search Users by Name"
          style={styles.searchBar}
        />
        
        <img src="https://img.icons8.com/?size=100&id=132&format=png&color=000000" alt="" style={{height:"20px",display:"flex",position:"absolute",right:"100px"}} /> */}
        <div className="flex flex-col justify-end sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0 ml-auto">
             
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search Client by name"
                  className="flex-1 bg-transparent text-gray-600 outline-none text-sm"
                />
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
          </div>
          </div>
        


        
      </header>

      {/* Clients Section */}
      <section style={styles.section}>
        <div style={styles.tableContainer}>
          <h3 style={{fontWeight:"600",marginBottom:"20px",marginLeft:"6px"}}>CLIENTS</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>CLIENT</th>
                <th style={styles.th}>PAYMENT</th>
                <th style={styles.th}>MONTH</th>
                <th style={styles.th}>AMOUNT</th>
                
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...styles.td, ...styles.nameCell }}>PHONEPAY</td>
                <td style={styles.td}>Paid</td>
                <td style={styles.td}>December</td>
                <td style={styles.td1} >
                  INR 1200
                  <img src="https://img.icons8.com/?size=100&id=x1qBi4Tv868U&format=png&color=000000" alt="" style={{height:"20px",display:"flex",position:"absolute",marginLeft:"100px"}} />
                  </td>
                
              </tr>
              <tr>
                <td style={{ ...styles.td, ...styles.nameCell }}>WAYFAIR</td>
                <td style={styles.td}>Unpaid</td>
                <td style={styles.td}>December</td>
                <td style={styles.td1} >
                  INR 1200
                  <img src="https://img.icons8.com/?size=100&id=x1qBi4Tv868U&format=png&color=000000" alt="" style={{height:"20px",display:"flex",position:"absolute",marginLeft:"100px"}} />
                  </td>
              </tr>
              <tr>
                <td style={{ ...styles.td, ...styles.nameCell }}>QUINCE</td>
                <td style={styles.td}>Paid</td>
                <td style={styles.td}>December</td>
                <td style={styles.td1} >
                  INR 1200
                  <img src="https://img.icons8.com/?size=100&id=x1qBi4Tv868U&format=png&color=000000" alt="" style={{height:"20px",display:"flex",position:"absolute",marginLeft:"100px"}} />
                  </td>
              </tr>
              <tr>
                <td style={{ ...styles.td, ...styles.nameCell }}>FLIPKART</td>
                <td style={styles.td}>Unpaid</td>
                <td style={styles.td}>December</td>
                <td style={styles.td1} >
                  INR 1200
                  <img src="https://img.icons8.com/?size=100&id=x1qBi4Tv868U&format=png&color=000000" alt="" style={{height:"20px",display:"flex",position:"absolute",marginLeft:"100px"}} />
                  </td>
              </tr>
              <tr>
                <td style={{ ...styles.td, ...styles.nameCell }}>FLIPKART</td>
                <td style={styles.td}>Paid</td>
                <td style={styles.td}>December</td>
                <td style={styles.td1} >
                  INR 1200
                  <img src="https://img.icons8.com/?size=100&id=x1qBi4Tv868U&format=png&color=000000" alt="" style={{height:"20px",display:"flex",position:"absolute",marginLeft:"100px"}} />
                  </td>
              </tr>
            </tbody>
          </table>
        </div>
{/* ----------- */}
<div style={styles.summary}>
  <div style={styles.card}>
    <span style={styles.label}>Paid</span>
    <br />
    <span style={styles.amount}>INR 1234000</span>
  </div>
  <div style={styles.card}>
    <span style={styles.label}>Unpaid</span>
    <br />
    <span style={styles.amount}>INR 234500</span>
  </div>
  <div style={styles.card}>
    <span style={styles.label}>Total</span>
    <br />
    <span style={styles.amount}>INR 2234400</span>
  </div>
</div>
      </section>

      {/* Interviewers Section */}
      <section style={styles.section}>
        <div style={styles.tableContainer}>
        <h3 style={{fontWeight:"600",marginBottom:"20px",marginLeft:"6px"}}>INTERVIEWERS</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>NAME</th>
                <th style={styles.th}>PAYMENT</th>
                <th style={styles.th}>MONTH</th>
                <th style={styles.th}>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...styles.td, ...styles.nameCell }}>RAJESH</td>
                <td style={styles.td}>Paid</td>
                <td style={styles.td}>December</td>
                <td style={styles.td1} >
                  INR 1200
                  <img src="https://img.icons8.com/?size=100&id=x1qBi4Tv868U&format=png&color=000000" alt="" style={{height:"20px",display:"flex",position:"absolute",marginLeft:"100px"}} />
                  </td>
              </tr>
              <tr>
                <td style={{ ...styles.td, ...styles.nameCell }}>STEVE</td>
                <td style={styles.td}>Unpaid</td>
                <td style={styles.td}>December</td>
                <td style={styles.td1} >
                  INR 1200
                  <img src="https://img.icons8.com/?size=100&id=x1qBi4Tv868U&format=png&color=000000" alt="" style={{height:"20px",display:"flex",position:"absolute",marginLeft:"100px"}} />
                  </td>
              </tr>
              <tr>
                <td style={{ ...styles.td, ...styles.nameCell }}>SCOTT</td>
                <td style={styles.td}>Paid</td>
                <td style={styles.td}>December</td>
                <td style={styles.td1} >
                  INR 1200
                  <img src="https://img.icons8.com/?size=100&id=x1qBi4Tv868U&format=png&color=000000" alt="" style={{height:"20px",display:"flex",position:"absolute",marginLeft:"100px"}} />
                  </td>
              </tr>
              <tr>
                <td style={{ ...styles.td, ...styles.nameCell }}>BRIAN</td>
                <td style={styles.td}>Unpaid</td>
                <td style={styles.td}>December</td>
                <td style={styles.td1} >
                  INR 1200
                  <img src="https://img.icons8.com/?size=100&id=x1qBi4Tv868U&format=png&color=000000" alt="" style={{height:"20px",display:"flex",position:"absolute",marginLeft:"100px"}} />
                  </td>
              </tr>
              <tr>
                <td style={{ ...styles.td, ...styles.nameCell }}>CRISTIE</td>
                <td style={styles.td}>Paid</td>
                <td style={styles.td}>December</td>
                <td style={styles.td1} >
                  INR 1200
                  <img src="https://img.icons8.com/?size=100&id=x1qBi4Tv868U&format=png&color=000000" alt="" style={{height:"20px",display:"flex",position:"absolute",marginLeft:"100px"}} />
                  </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={styles.summary}>
  <div style={styles.card}>
    <span style={styles.label}>Paid</span>
    <br />
    <span style={styles.amount}>INR 1234000</span>
  </div>
  <div style={styles.card}>
    <span style={styles.label}>Unpaid</span>
    <br />
    <span style={styles.amount}>INR 234500</span>
  </div>
  <div style={styles.card}>
    <span style={styles.label}>Total</span>
    <br />
    <span style={styles.amount}>INR 2234400</span>
  </div>
</div>
      </section>
    </div>
  );
};



export  { Finance as InternalFinance}
