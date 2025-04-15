import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MultiSelectFilter from "../../utils/MultiSelectFilter";
import debounce from "lodash/debounce";
import axios from "../../api/axios";
import TableLoadingWrapper from "../../utils/TableLoadingWrapper";
import toast from "react-hot-toast";
import {
  Close,
  CreditCard,
  Done,
  Edit,
  Language,
  Mail,
  Person,
  Phone,
  PinDrop,
  ReceiptLong,
  StackedLineChart,
  Work,
} from "@mui/icons-material";
import Modal from "../shared/Modal";
import { IoSearchSharp } from "react-icons/io5";

function Clients() {
  // Data for the table
  const [clients, setClients] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    domain: [],
    status: [],
  });
  const [selectedClient, setSelectedClient] =
    useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // const firstRender = useRef(true); // Tracks first render to skip unnecessary duplicate calls

  const STATUSES = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const handleChipClick = (type, value) => {
    setOffset(0);
    if (type === "status") {
      setFilters((prev) => ({
        ...prev,
        status: value.slice(-1),
      }));
    } else {
      setFilters((prev) => ({ ...prev, [type]: value }));
    }
  };

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "/api/internal/internal-client/",
        {
          params: {
            q: searchValue,
            offset,
            domain: filters?.domain
              ?.map((item) => item.domain)
              ?.join(","),
            status: filters?.status
              ?.map((item) => item.value)
              ?.join(","),
          },
        }
      );

      setClients((prev) =>
        offset === 0
          ? response.data.results
          : [...prev, ...response.data.results]
      );
      setHasMore(response?.data?.next !== null);
    } catch (error) {
      console.error("Error fetching clients:", error);
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
    // if (firstRender.current) {
    //   firstRender.current = false; // Skip first duplicate call in Strict Mode
    //   return;
    // }
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, filters, searchValue]);

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } =
      event.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight + 20 &&
      !isLoading &&
      hasMore
    ) {
      setOffset((prev) => prev + 10);
    }
  };

  const handleClientClick = async (clientId) => {
    try {
      const response = await axios.get(
        `/api/internal/internal-client/${clientId}/`
      );
      setSelectedClient(response.data.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching client data:", error);
      toast.error("Failed to load client data", {
        position: "top-right",
      });
    }
  };

  const handleEditClick = () => {
    navigate(`${location.pathname}/addclient`, {
      state: {
        clientData: selectedClient,
        isEditing: true,
      },
    });
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
              className="flex-1 bg-transparent text-gray-600 outline-none text-xs"
              onChange={handleSearchChange}
            />
            <IoSearchSharp className="text-[#49454F]" />
          </div>

          {/* Add Client Button */}
          <button
            className="primary-button h-[32px]"
            onClick={() =>
              navigate(`${location.pathname}/addclient`)
            }
          >
            + Add Client
          </button>
        </div>
        {/* Domain and Status Filters */}
        <div className="flex flex-wrap mt-4 gap-2">
          {/* Domain Filter */}
          <MultiSelectFilter
            label="Domain"
            filter_state_name="domain"
            current_value={filters.domain}
            handleChipClick={handleChipClick}
            apiEndpoint={"/api/internal/client-domains/"}
          />

          {/* Status Filter */}
          <MultiSelectFilter
            label="Status"
            options={STATUSES}
            filter_state_name="status"
            current_value={filters.status}
            handleChipClick={handleChipClick}
          />
        </div>

        {/* Table Section */}
        <TableLoadingWrapper
          loading={isLoading}
          data={clients}
        >
          <div
            className="overflow-x-auto overflow-y-scroll max-h-[500px] mt-6"
            onScroll={handleScroll}
          >
            <table className="min-w-full text-xs text-left text-gray-500 border-collapse">
              <thead className="bg-gray-100 text-gray-700 uppercase font-medium">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    Client
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    Active Jobs
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    Passive Jobs
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    Total Candidates
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, index) => (
                  <tr key={index} className="border-b">
                    <td
                      className="px-6 py-4 text-blue-600 font-bold cursor-pointer hover:underline"
                      onClick={() =>
                        handleClientClick(client.id)
                      }
                    >
                      {client.name}
                    </td>
                    <td className="px-6 py-4">
                      {client.active_jobs}
                    </td>
                    <td className="px-6 py-4">
                      {client.passive_jobs}
                    </td>
                    <td className="px-6 py-4">
                      {client.total_candidates}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableLoadingWrapper>
      </div>

      {/* Modal for Client Details */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="View Client Details"
        className="w-[500px] max-h-[75vh] top-auto"
      >
        {/* Primary Details Section */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">
              Client Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Person
                  className="text-indigo-500 mt-1 mr-3 flex-shrink-0"
                  size={14}
                />
                <div>
                  <p className="text-[10px] text-gray-500">
                    Registered Name
                  </p>
                  <p className="font-medium text-xs">
                    {selectedClient?.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Language
                  className="text-indigo-500 mt-1 mr-3 flex-shrink-0"
                  size={14}
                />
                <div>
                  <p className="text-[10px] text-gray-500">
                    Website
                  </p>
                  <a
                    href={selectedClient?.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs"
                  >
                    {selectedClient?.website}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <Work
                  className="text-indigo-500 mt-1 mr-3 flex-shrink-0"
                  size={14}
                />
                <div>
                  <p className="text-[10px] text-gray-500">
                    Domain
                  </p>
                  <p className="font-medium text-xs">
                    {selectedClient?.domain}
                  </p>
                </div>
              </div>
              {selectedClient?.client_level ? (
                <div className="flex items-start">
                  <StackedLineChart
                    className="text-indigo-500 mt-1 mr-3 flex-shrink-0"
                    size={14}
                  />
                  <div>
                    <p className="text-[10px] text-gray-500">
                      Client Level
                    </p>
                    <p className="font-medium text-xs">
                      {selectedClient?.client_level || 1}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">
              Address
            </h3>
            <div className="flex items-center">
              <PinDrop
                className="text-indigo-500 mt-1 mr-3 flex-shrink-0"
                size={14}
              />
              <div>
                <p className="font-medium text-xs">
                  {selectedClient?.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">
              Tax Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <ReceiptLong
                  className="text-indigo-500 mt-1 mr-3 flex-shrink-0"
                  size={14}
                />
                <div>
                  <p className="text-[10px] text-gray-500">
                    GSTIN
                  </p>
                  <p className="font-medium text-xs">
                    {selectedClient?.gstin}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CreditCard
                  className="text-indigo-500 mt-1 mr-3 flex-shrink-0"
                  size={14}
                />
                <div>
                  <p className="text-[10px] text-gray-500">
                    PAN
                  </p>
                  <p className="font-medium text-xs">
                    {selectedClient?.pan}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">
              Status Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex items-center mt-1 mr-3">
                  {selectedClient?.is_signed === true ? (
                    <Done
                      className="text-green-500"
                      size={14}
                    />
                  ) : (
                    <Close
                      className="text-red-500"
                      size={14}
                    />
                  )}
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">
                    Status
                  </p>
                  <p className="font-medium text-xs">
                    {selectedClient?.is_signed === true
                      ? "Signed"
                      : "Not Signed"}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Person
                  className="text-indigo-500 mt-1 mr-3 flex-shrink-0"
                  size={14}
                />
                <div>
                  <p className="text-[10px] text-gray-500">
                    Assigned To
                  </p>
                  <p className="font-medium text-xs">
                    {selectedClient?.assigned_to?.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Points of Contact Section */}
        <div className="flex items-center justify-between mt-4 mb2 pl-4">
          {/* <h2 className="text-sm font-semibold">Points of Contact</h2> */}
          <h2 className="text-xs uppercase text-gray-500 font-semibold mb-2">
            Points of Contact
          </h2>
        </div>

        {selectedClient?.points_of_contact?.map(
          (poc, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-md mb-2"
            >
              <div className="flex justify-between">
                <h3 className="font-medium text-xs">
                  {poc.name}
                </h3>
              </div>
              <div className="mt-3">
                <div className="flex items-center">
                  <Mail
                    className="text-indigo-500 mr-2"
                    size={10}
                  />
                  <a
                    href={`mailto:${poc.email}`}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    {poc.email}
                  </a>
                </div>
                <div className="flex items-center mt-2">
                  <Phone
                    className="text-indigo-500 mr-2"
                    size={10}
                  />
                  <a
                    href={`tel:${poc.phone}`}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    {poc.phone}
                  </a>
                </div>
              </div>
            </div>
          )
        )}

        {/* Action Buttons */}
        <div className="flex justify-end mt-4">
          <button
            className="primary-button"
            onClick={handleEditClick}
          >
            Edit{" "}
            <Edit
              sx={{
                fontSize: 16,
                paddingBottom: "2px",
                paddingLeft: "2px",
              }}
            />
          </button>
        </div>
      </Modal>
    </div>
  );
}

export { Clients as InternalClients };
