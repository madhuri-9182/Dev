import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Settings() {

  const [users, setUsers] = useState([])
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [addUser, setAddUser] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("")
  const [jobAssigned, setJobAssigned] = useState("")
  const [errorMessage,setErrorMessage]=useState("")

  const handleSelectChange = (e) => {
    const selectedJob = e.target.value;
    if (selectedJob && !selectedJobs.includes(selectedJob)) {
      setSelectedJobs([...selectedJobs, selectedJob]);
    }
  };

  const handleRemoveJob = (job) => {
    setSelectedJobs(selectedJobs.filter((j) => j !== job));
  };

  const toggleAddUser = () => {
    setAddUser(!addUser)
  }

  //Get All Users
  const loadClientUsers = async () => {
    console.log("Hello");

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }

      console.log('Token found, making API request...');
      const response = await axios.get('http://127.0.0.1:8000/api/client/client-user/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.data.results);
      setUsers(response.data.data.results);
    } catch (error) {
      console.error("Error fetching client users:", error);
    }
  }
  useEffect(() => {
    loadClientUsers();
  }, []);


  //Add Users
  const handleAddUser = async (e) => {
    e.preventDefault();
    setErrorMessage("")
    if (!email || !name || !userType || !jobAssigned) {
      alert("All fields are required.")
      return;
    }
    console.log(email, name, userType, jobAssigned);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }

      console.log('Token found, making API request...');
      const response = await axios.post('http://127.0.0.1:8000/api/client/client-user/', {
        name: name,
        email: email,
        user_type: userType,
        job_assigned: jobAssigned,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept:'application/json'

        },
      });
      if(response.status===201){
        await loadClientUsers();
        setAddUser(false)
      }
      console.log(response);
    } catch (error) {
      console.error(error);
      if(error.response){
        setErrorMessage(error.response.data.email[0])
      }
    }

  }

  //Delete users

  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }
      const response = await axios.delete(`http://127.0.0.1:8000/api/client/client-user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          client_user_id: userId,  
        },
      });
      console.log(response.status);
      if(response.status===204){
        loadClientUsers();
      }
      
    } catch (error) {
      console.error("Error deleting user:", error);
    }

  }

  return (
    <div className='p-2'>
      <div className='flex items-center justify-end'>
        <div>
          <button
            onClick={toggleAddUser}
            className='h-[40px] w-[125px] bg-[#007AFF] rounded-full text-white text-lg'>+Add User</button>
        </div>
      </div>
      <div>
        <table className="w-full text-left border-collapse">
          <thead className='text-black'>
            <tr>
              <th className="py-2 px-4 border-b font-semibold">USERS</th>
              <th className="py-2 px-4 border-b font-semibold">EMAIL ID</th>
              <th className="py-2 px-4 border-b font-semibold">USER TYPE</th>
              <th className="py-2 px-4 border-b font-semibold">ACCESSIBILITY</th>
              <th className="py-2 px-4 border-b font-semibold">ADD DATE</th>
              <th className="py-2 px-4 border-b font-semibold">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className={`${user.highlighted ? 'bg-yellow-100' : ''} hover:bg-gray-100`}>
                <td className="py-3 px-4 font-semibold text-gray-800">{user.name}</td>
                <td className="py-3 px-4 text-gray-600">{user.email}</td>
                <td className="py-3 px-4 text-gray-600">{user.user_type}</td>
                <td className="py-3 px-4 text-gray-600">{user.job_assigned}</td>
                <td className="py-3 px-4 text-gray-600">{user.created_at}</td>
                <td className="py-3 px-4 flex space-x-2">
                  <button className="">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" /></svg>
                  </button>
                  <button
                  onClick={(e)=>{
                    e.preventDefault();
                    deleteUser(user.id)
                  }}
                   className="ml-6"
                   >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#171717"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>





      {
        addUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-[500px]">
              <h2 className="text-xl font-semibold mb-4">Add User</h2>
              <form className="space-y-6 max-w-xl mx-auto p-6">
                {/* Name Input */}
                <div className="flex items-center gap-x-4">
                  <label className="text-gray-700 font-medium w-1/3">Name</label>
                  <input
                    type="text"
                    onChange={(e) => { setName(e.target.value) }}
                    placeholder="TargetHR"
                    className="w-2/3 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email Input */}
                <div className="flex items-center gap-x-4">
                  <label className="text-gray-700 font-medium w-1/3">Email ID</label>
                  <input
                    type="email"
                    onChange={(e) => { setEmail(e.target.value) }}
                    placeholder="Pooja@Target.hr"
                    className="w-2/3 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* User Type Input */}
                <div className="flex items-center gap-x-4">
                  <label className="text-gray-700 font-medium w-1/3">User Type</label>
                  <select
                    onChange={(e) => setUserType(e.target.value)}
                    value={userType}
                    className="w-2/3 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select User Type</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="agency">Agency</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                {/* Job Assigned Dropdown */}
                <div className="flex items-center gap-x-4">
                  <label className="text-gray-700 font-medium w-1/3">Job Assigned</label>
                  <select
                    onChange={(e) => setJobAssigned(e.target.value)}
                    value={jobAssigned} // Initial value is an empty string
                    className="w-2/3 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Job</option> {/* Default placeholder option */}
                    <option value="sde3">sde3</option>
                    <option value="pe">pe</option>
                    <option value="sde2">sde2</option>
                    <option value="devops1">devops1</option>
                    <option value="em">em</option>
                    <option value="sdet2">sdet2</option>
                    <option value="sdet1">sdet1</option>
                  </select>
                </div>
                <h1 className='text-center text-red-300 text-xl'>{errorMessage}</h1>

                {/* Action Buttons */}
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    className="bg-red-200 text-red-700 py-2 px-4 rounded-md hover:bg-red-300"
                    onClick={toggleAddUser}
                  >
                    Delete
                  </button>
                  <button
                    type="submit"
                    onClick={handleAddUser}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </form>


            </div>
          </div>

        )
      }
























    </div>
  )
}

export default Settings
