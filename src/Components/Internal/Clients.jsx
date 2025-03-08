import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MultiSelectFilter from '../../utils/MultiSelectFilter';
import debounce from 'lodash/debounce';
import axios from '../../api/axios';
import TableLoadingWrapper from '../../utils/TableLoadingWrapper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { IconButton, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import toast from 'react-hot-toast';
import { Close, CreditCard, Done, Edit, Language, Mail, Person, Phone, PinDrop, ReceiptLong, Work } from '@mui/icons-material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialog-paper': {
    width: '500px', // You can customize this value to whatever you need
  },
}));

function Clients() {
  // Data for the table
  const [clients, setClients] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    domain: [],
    status: []
  });
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

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

  const handleClientClick = async (clientId) => {
    try {
      const response = await axios.get(`/api/internal/internal-client/${clientId}/`);
      setSelectedClient(response.data.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching client data:', error);
      toast.error("Failed to load client data", { position: "top-right" });
    }
  };

  const handleEditClick = () => {
    navigate(`${location.pathname}/addclient`, { state: { clientData: selectedClient, isEditing: true } });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
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
                    <td
                      className="px-6 py-4 text-blue-600 font-bold cursor-pointer hover:underline"
                      onClick={() => handleClientClick(client.id)}
                    >
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

      {/* Modal for Client Details */}
      <BootstrapDialog
        aria-labelledby="add-poc-dialog-title"
        open={isModalOpen}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.8)'
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, pb: 0 }} id="add-poc-dialog-title">
          <h1 className='font-bold text-[#056DDC] text-lg text-center'>View Client Details</h1>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => closeModal()}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <div>
            {/* Primary Details Section */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">Client Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Person className="text-indigo-500 mt-1 mr-3 flex-shrink-0" size={14} />
                    <div>
                      <p className="text-[10px] text-gray-500">Registered Name</p>
                      <p className="font-medium text-xs">{selectedClient?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Language className="text-indigo-500 mt-1 mr-3 flex-shrink-0" size={14} />
                    <div>
                      <p className="text-[10px] text-gray-500">Website</p>
                      <a href={selectedClient?.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">{selectedClient?.website}</a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Work className="text-indigo-500 mt-1 mr-3 flex-shrink-0" size={14} />
                    <div>
                      <p className="text-[10px] text-gray-500">Domain</p>
                      <p className="font-medium text-xs">{selectedClient?.domain}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">Address</h3>
                <div className="flex items-center">
                  <PinDrop className="text-indigo-500 mt-1 mr-3 flex-shrink-0" size={14} />
                  <div>
                    <p className="font-medium text-xs">{selectedClient?.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">Tax Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <ReceiptLong className="text-indigo-500 mt-1 mr-3 flex-shrink-0" size={14} />
                    <div>
                      <p className="text-[10px] text-gray-500">GSTIN</p>
                      <p className="font-medium text-xs">{selectedClient?.gstin}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <CreditCard className="text-indigo-500 mt-1 mr-3 flex-shrink-0" size={14} />
                    <div>
                      <p className="text-[10px] text-gray-500">PAN</p>
                      <p className="font-medium text-xs">{selectedClient?.pan}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">Status Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex items-center mt-1 mr-3">
                      {selectedClient?.is_signed === true ?
                        <Done className="text-green-500" size={14} /> :
                        <Close className="text-red-500" size={14} />
                      }
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500">Status</p>
                      <p className="font-medium text-xs">{selectedClient?.is_signed === true ? "Signed" : "Not Signed"}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Person className="text-indigo-500 mt-1 mr-3 flex-shrink-0" size={14} />
                    <div>
                      <p className="text-[10px] text-gray-500">Assigned To</p>
                      <p className="font-medium text-xs">{selectedClient?.assigned_to?.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Points of Contact Section */}
            <div className="flex items-center justify-between mt-4 mb2 pl-4">
              {/* <h2 className="text-sm font-semibold">Points of Contact</h2> */}
              <h2 className="text-xs uppercase text-gray-500 font-semibold mb-2">Points of Contact</h2>
            </div>

            {selectedClient?.points_of_contact?.map((poc, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md mb-2">
                <div className="flex justify-between">
                  <h3 className="font-medium text-xs">{poc.name}</h3>
                </div>
                <div className="mt-3">
                  <div className="flex items-center">
                    <Mail className="text-indigo-500 mr-2" size={10} />
                    <a href={`mailto:${poc.email}`} className="text-blue-600 hover:underline text-xs">{poc.email}</a>
                  </div>
                  <div className="flex items-center mt-2">
                    <Phone className="text-indigo-500 mr-2" size={10} />
                    <a href={`tel:${poc.phone}`} className="text-blue-600 hover:underline text-xs">{poc.phone}</a>
                  </div>
                </div>
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex justify-end mt-4">
              <button className='bg-[#056DDC] text-white p-2 px-4 rounded-full mb-2 text-sm' onClick={handleEditClick} >Edit Details <Edit sx={{ fontSize: 18, paddingBottom: '2px', paddingLeft: '2px' }} /></button>
            </div>

          </div>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}

export { Clients as InternalClients };