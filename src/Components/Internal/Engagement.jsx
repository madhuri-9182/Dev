import { debounce } from '@mui/material';
import { useEffect, useState, useRef, useCallback } from 'react';
import { IoSearchSharp } from 'react-icons/io5';
import MultiSelectFilter from '../../utils/MultiSelectFilter';
import axios from '../../api/axios';
import TableLoadingWrapper from '../../utils/TableLoadingWrapper';
import { useNavigate } from 'react-router-dom';

function Engagement() {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    domain: [],
    status: []
  });
  const navigate = useNavigate();
  // const isFirstRender = useRef(true);

  const STATUSES = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const handleChipClick = (type, value) => {
    setOffset(0);
    if (type === 'status') {
      setFilters((prev) => ({ ...prev, status: value.slice(-1) }));
    } else {
      setFilters((prev) => ({ ...prev, [type]: value }));
    }
  };

  const handleSearchChange = debounce((event) => {
    setOffset(0);
    setData([]);
    setSearchValue(event.target.value);
  }, 1000);

  const fetchEngagements = useCallback(async () => {
    // if (isFirstRender.current) {
    //   isFirstRender.current = false;
    //   return;
    // }
    try {
      setIsLoading(true);
      const response = await axios.get('/api/internal/engagements/', {
        params: {
          q: searchValue,
          offset: offset,
          domain: filters?.domain?.map(item => item.domain)?.join(','),
          status: filters?.status?.map(item => item.value)?.join(',')
        }
      });
      setData((prev) => offset === 0 ? response.data.results : [...prev, ...response.data.results]);
      setHasMore(response?.data?.next !== null);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [offset, filters, searchValue]);

  useEffect(() => {
    fetchEngagements();
  }, [offset, filters, searchValue, fetchEngagements]);

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 20 && !isLoading && hasMore) {
      setOffset((prev) => prev + 10);
    }
  };

  return (
    <div>
      {/* Search Section */}
      <div className="flex flex-col justify-end sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0 ml-auto">
        {/* Search Input */}
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full sm:w-80 border focus-within:border-blue-700">
          <input
            type="text"
            placeholder="Search Client by name"
            className="flex-1 bg-transparent text-gray-600 outline-none text-xs"
            onChange={handleSearchChange}
          />
          <IoSearchSharp className="text-[#49454F]" />
        </div>
      </div>

      {/* Domain and Status Filters */}
      <div className="flex flex-wrap mt-4 gap-2">
        {/* Domain Filter */}
        <MultiSelectFilter label='Domain' filter_state_name='domain' current_value={filters.domain} handleChipClick={handleChipClick} apiEndpoint={"/api/internal/client-domains/"} />

        {/* Status Filter */}
        <MultiSelectFilter label='Status' options={STATUSES} filter_state_name='status' current_value={filters.status} handleChipClick={handleChipClick} />
      </div>

      {/* Table Section */}
      <TableLoadingWrapper loading={isLoading} data={data}>
        <div className="overflow-x-auto mt-6 max-h-[500px]" onScroll={handleScroll}>
          <table className="min-w-full text-xs text-gray-500 border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase font-medium">
              <tr>
                <th scope="col" className="px-6 py-4 whitespace-nowrap text-left">CLIENT</th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap text-center">ACTIVE CANDIDATES</th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap text-center">SCHEDULED</th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap text-center">PENDING SCHEDULED</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="px-6 py-4 text-blue-600 font-bold cursor-pointer hover:underline" onClick={() => navigate(`/internal/engagement/${row.id}`)}>
                    {row.name}
                  </td>
                  <td className="px-6 py-4 text-center">{row.active_candidates}</td>
                  <td className="px-6 py-4 text-center">{row.scheduled}</td>
                  <td className="px-6 py-4 text-center">{row.pending_scheduled}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableLoadingWrapper>
    </div>
  );
}

export { Engagement as InternalEngagement };
