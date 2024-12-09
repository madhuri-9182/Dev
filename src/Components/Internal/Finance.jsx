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
      marginTop:"60px",
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      justifyContent:"left"
      
    },
    card: {
      
      width: '250px',
      height:"80px",
      backgroundColor: '#e5ecf6',
      padding: '20px',
      textAlign: 'center',
      borderRadius: '10px',
      fontWeight: 'bold',
      fontSize: '18px',
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
        <input
          type="text"
          placeholder="Search Users by Name"
          style={styles.searchBar}
        />
        <img src="https://img.icons8.com/?size=100&id=132&format=png&color=000000" alt="" style={{height:"20px",display:"flex",position:"absolute",right:"100px"}} />
        
        


        
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

        <div style={styles.summary}>
          <div style={styles.card}>Paid<br />INR 1234000</div>
          <div style={styles.card}>Unpaid<br />INR 234000</div>
          <div style={styles.card}>Total<br />INR 2234000</div>
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
          <div style={styles.card}>Paid<br />INR 1234000</div>
          <div style={styles.card}>Unpaid<br />INR 234500</div>
          <div style={styles.card}>Total<br />INR 2234400</div>
        </div>
      </section>
    </div>
  );
};



export  { Finance as InternalFinance}
