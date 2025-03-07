import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MultiSelectFilter from '../../utils/MultiSelectFilter';
import debounce from 'lodash/debounce';
import axios from '../../api/axios';
import TableLoadingWrapper from '../../utils/TableLoadingWrapper';

function Clients() {
  // Data for the table
  const [clients, setClients] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    domain: [],
    status: []
  });

  const STATUSES = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const handleChipClick = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/internal/internal-client/', {
        params: { q: searchValue, offset: offset, domain: filters?.domain?.map(item => item.id)?.join(','), status: filters?.status?.map(item => item.value)?.join(',') },
      });
      setClients((prev) => offset === 0 ? response.data.results : [...prev, ...response.data.results]);
      setHasMore(response?.data?.next !== null);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleSearchChange = debounce((event) => {
    setOffset(0);
    setClients([]);
    setSearchValue(event.target.value);
  }, 1000);

  useEffect(() => {
    fetchClients();
  }, [offset, filters, searchValue]);

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 20 && !isLoading && hasMore) {
      setOffset((prev) => prev + 10);
    }
  };

  return (
    <div className="px-6">
      <div>
        {/* Search and Add Client Section */}
        <div className="flex flex-col justify-end sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0 ml-auto">
          {/* Search Input */}
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full sm:w-80 border focus-within:border-blue-700">
            <input
              type="text"
              placeholder="Search Client by name"
              className="flex-1 bg-transparent text-gray-600 outline-none text-sm"
              onChange={handleSearchChange}
            />
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
          </div>

          {/* Add Client Button */}
          <button
            className="flex items-center justify-center space-x-2 bg-[#007AFF] text-white px-4 py-2 rounded-full text-sm font-medium w-full sm:w-auto"
            onClick={() => navigate(`${location.pathname}/addclient`)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span> Add Client</span>
          </button>
        </div>
        {/* Domain and Status Filters */}
        <div className="flex flex-wrap mt-4 gap-2">
          {/* Domain Filter */}
          <MultiSelectFilter label='Domain' filter_state_name='domain' current_value={filters.domain} handleChipClick={handleChipClick} apiEndpoint={"/api/internal/client-domains/"} />

          {/* Status Filter */}
          <MultiSelectFilter label='Status' options={STATUSES} filter_state_name='status' current_value={filters.status} handleChipClick={handleChipClick} />
        </div>

        {/* Table Section */}
        <TableLoadingWrapper loading={isLoading} data={clients} >
          <div className="overflow-x-auto overflow-y-scroll max-h-[500px] mt-6" onScroll={handleScroll}>
            <table className="min-w-full text-sm text-left text-gray-500 border-collapse">
              <thead className="bg-gray-100 text-gray-700 uppercase font-medium">
                <tr>
                  <th scope="col" className="px-6 py-4 whitespace-nowrap">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-4 whitespace-nowrap text-center">
                    Active Jobs
                  </th>
                  <th scope="col" className="px-6 py-4 whitespace-nowrap text-center">
                    Passive Jobs
                  </th>
                  <th scope="col" className="px-6 py-4 whitespace-nowrap text-center">
                    Total Candidates
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-6 py-4 text-blue-600 font-bold ">
                      {client.name}
                    </td>
                    <td className="px-6 py-4 text-center">{client.active_jobs}</td>
                    <td className="px-6 py-4 text-center">{client.passive_jobs}</td>
                    <td className="px-6 py-4 text-center">{client.total_candidates}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableLoadingWrapper>
      </div>
    </div>
  );
}

export { Clients as InternalClients };
