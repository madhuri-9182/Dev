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
    },
    ratesButton: {
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
    },
    searchBar: {
      padding: '10px',
      width: '30%',
      border: '1px solid #ccc',
      borderRadius: '25px',
      backgroundColor:"#eaebdf"
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
      width: '25%',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    card: {
      backgroundColor: '#e9f3ff',
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
        <div>
          <select style={styles.select}>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
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
      </header>

      {/* Clients Section */}
      <section style={styles.section}>
        <div style={styles.tableContainer}>
          <h3 style={{fontWeight:"600",marginBottom:"20px"}}>CLIENTS</h3>
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
                <td style={styles.td}>PHONEPAY</td>
                <td style={styles.td}>Paid</td>
                <td style={styles.td}>December</td>
                <td style={styles.td}>INR 1200</td>
              </tr>
              <tr>
                <td style={styles.td}>WAYFAIR</td>
                <td style={styles.td}>Unpaid</td>
                <td style={styles.td}>December</td>
                <td style={styles.td}>INR 1200</td>
              </tr>
              <tr>
                <td style={styles.td}>QUINCE</td>
                <td style={styles.td}>Paid</td>
                <td style={styles.td}>December</td>
                <td style={styles.td}>INR 2800</td>
              </tr>
              <tr>
                <td style={styles.td}>FLIPKART</td>
                <td style={styles.td}>Unpaid</td>
                <td style={styles.td}>December</td>
                <td style={styles.td}>INR 2000</td>
              </tr>
              <tr>
                <td style={styles.td}>FLIPKART</td>
                <td style={styles.td}>Paid</td>
                <td style={styles.td}>December</td>
                <td style={styles.td}>INR 2000</td>
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
        <h3 style={{fontWeight:"600",marginBottom:"20px"}}>INTERVIEWERS</h3>
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
                <td style={styles.td}>RAJESH</td>
                <td style={styles.td}>Paid</td>
                <td style={styles.td}>December</td>
                <td style={styles.td}>INR 1200</td>
              </tr>
              <tr>
                <td style={styles.td}>STEVE</td>
                <td style={styles.td}>Unpaid</td>
                <td style={styles.td}>December</td>
                <td style={styles.td}>INR 1200</td>
              </tr>
              <tr>
                <td style={styles.td}>SCOTT</td>
                <td style={styles.td}>Paid</td>
                <td style={styles.td}>December</td>
                <td style={styles.td}>INR 2800</td>
              </tr>
              <tr>
                <td style={styles.td}>BRIAN</td>
                <td style={styles.td}>Unpaid</td>
                <td style={styles.td}>December</td>
                <td style={styles.td}>INR 2000</td>
              </tr>
              <tr>
                <td style={styles.td}>CRISTIE</td>
                <td style={styles.td}>Paid</td>
                <td style={styles.td}>December</td>
                <td style={styles.td}>INR 2000</td>
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
