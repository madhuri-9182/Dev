import PropTypes from 'prop-types';
import InfiniteScrollSelect from '../../../utils/InfiniteScrollSelect';
import { useState } from 'react';

function RolesSelect({ errors, items, handleSelection, removeItem, className = "", dropdownClassName = "" }) {
  const [roles, setRoles] = useState([]);
  
  return (
    <>
      <InfiniteScrollSelect
        apiEndpoint={`/api/internal/domain-designation/`}
        onSelect={(value) => {
          handleSelection(value);
         }}
        optionLabel='full_name'
        setParentItems={setRoles}
        placeholder='Select Role'
        className={className}
        dropdownClassName={dropdownClassName}
        maxId={items.length > 0 ? Math.max(...items) : 10}
        changeValue={false}
        selectedOptions={items}
        showDropdownAbove={true}
      />
      {errors.role && <span className="error-message" >{errors.role.message}</span>}
      {items?.length > 0 && <div className='mt-[8px] gap-x-4'>
        <ul className='flex flex-wrap justify-start gap-2 items-center'>
          {items.map((item, index) => (
            <li key={`${item}-${index}`} className={`flex justify-center items-center h-[32px] border border-[#49454F] pl-1 pr-1 rounded-lg text-[#49454F] ${dropdownClassName}`}>
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
      </div>}
    </>
  );
}

RolesSelect.propTypes = {
  items: PropTypes.array.isRequired,
  handleSelection: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  removeItem: PropTypes.func.isRequired,
  className: PropTypes.string,
  dropdownClassName: PropTypes.string,
};

export default RolesSelect;