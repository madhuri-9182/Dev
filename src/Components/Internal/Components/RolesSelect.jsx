import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from '../../../api/axios';

function RolesSelect({ register, errors, items, handleSelection, removeItem, className="" }) {
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);

  useEffect(() => {
    let isMounted = true; // Flag to track if the component is mounted

    const fetchRoles = async () => {
      setRolesLoading(true);
      try {
        const response = await axios.get(`/api/internal/domain-designation/?offset=${0}&limit=${30}`); // Need to implement infinte scroll later
        if (isMounted) {
          setRoles(response?.data?.results || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setRolesLoading(false);
      }
    };
    fetchRoles();

    return () => {
      isMounted = false; // Set flag to false on cleanup
    };
  }, []);

  return (
    <>
      <select
        name="role"
        {...register("role", {
          validate: () => items.length > 0 || "Please select at least one role."
        })}
        onChange={(e)=>handleSelection(e, roles)}
        value={""}
        className={`w-[134px] h-[32px] text-center text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-[#CAC4D0] ${items.length === 0 ? "text-gray-500" : "text-black"} ${className}`}
      >
        <option value="" disabled>Select Roles</option>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>{role.full_name}</option>
        ))}
        {rolesLoading && <option disabled>Loading...</option>}
      </select>
      {errors.role && <span className="error-message" >{errors.role.message}</span>}
      <div className='mt-[8px] gap-x-4'>
        <ul className='flex flex-wrap justify-start gap-2 items-center'>
          {items.map((item, index) => (
            <li key={index} className="flex justify-center items-center h-[32px] border border-[#49454F] pl-1 pr-1 rounded-lg text-[#49454F]">
              {roles.find(role => role.id === Number(item))?.full_name}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeItem(item);
                }}
                className='pl-2'
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.8 11.25L0.75 10.2L4.95 6L0.75 1.8L1.8 0.75L6 4.95L10.2 0.75L11.25 1.8L7.05 6L11.25 10.2L10.2 11.25L6 7.05L1.8 11.25Z" fill="#49454F" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

RolesSelect.propTypes = {
  register: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  handleSelection: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  removeItem: PropTypes.object.isRequired,
  className: PropTypes.object.optional,
};

export default RolesSelect;