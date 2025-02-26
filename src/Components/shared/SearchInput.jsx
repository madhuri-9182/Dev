import { IoSearchSharp } from "react-icons/io5";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

const SearchInput = ({ searchQuery, setSearchQuery }) => {
  const searchInputRef = useRef(null);
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  // Add a useEffect to help with focus management
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchQuery, searchInputRef]);
  return (
    <div className="flex items-center rounded-full px-4 py-3 w-[446px] border border-[#F4F4F4] focus-within:border-blue-700 bg-[#F4F4F4]">
      <input
        ref={searchInputRef}
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search Candidate by Name, Email & Mobile Number"
        className="flex-1 text-[#49454F] outline-none text-xs bg-transparent"
      />
      <IoSearchSharp className="text-[#49454F]" />
    </div>
  );
};

export default SearchInput;

SearchInput.propTypes = {
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func,
};
