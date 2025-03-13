import { IoSearchSharp } from "react-icons/io5";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

const SearchInput = ({ searchQuery, setSearchQuery }) => {
  const searchInputRef = useRef(null);
  const handleSearch = (e) => {
    const value = e.target.value;
    // Check if input is a number (contains only digits)
    if (/^\d+$/.test(value)) {
      // If it's a pure number, prepend +91
      setSearchQuery(`+91${value}`);
    } else if (
      value.startsWith("+91") &&
      /^\+91\d+$/.test(value)
    ) {
      // Allow continued typing after +91
      setSearchQuery(value);
    } else {
      // For non-numeric input or mixed input, don't add prefix
      setSearchQuery(value);
    }
  };

  useEffect(() => {
    // If the search query is just numbers without the +91 prefix
    if (
      searchQuery &&
      /^\d+$/.test(searchQuery) &&
      !searchQuery.startsWith("+91")
    ) {
      setSearchQuery(`+91${searchQuery}`);
    }
  }, [searchQuery, setSearchQuery]);

  // Add a useEffect to help with focus management
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();

      // Place cursor at the end of input
      const length = searchInputRef.current.value.length;
      searchInputRef.current.setSelectionRange(
        length,
        length
      );
    }
  }, [searchQuery]);

  return (
    <div className="flex items-center rounded-full h-[32px] px-4 py-2 w-[446px] border border-[#F4F4F4] focus-within:border-blue-700 bg-[#F4F4F4]">
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
