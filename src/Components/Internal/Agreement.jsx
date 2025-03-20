import { useState, useEffect, useRef } from 'react'
import { IoSearchSharp } from 'react-icons/io5';
import axios from '../../api/axios';
import TableLoadingWrapper from '../../utils/TableLoadingWrapper';
import { debounce } from 'lodash';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { CircularProgress } from '@mui/material';

function Agreement() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editClientUser, setEditClientUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const containerRef = useRef(null);
  const initialRenderRef = useRef(true);

  const fetchAgreements = async (query = "") => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/api/internal/agreements/`, {
        params: {
          offset: (page - 1) * 10,
          q: query
        }
      });
      setData(prev => page === 1 ? response.data.results : [...prev, ...response.data.results]);
      setHasMore(response.data.next !== null);
    } catch (error) {
      console.error("Error fetching agreements:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce((value) => {
    setSearchQuery(value);
    setData([]); // Clear data when search value changes
    setPage(1); // Reset to first page
  }, 1000);

  useEffect(() => {
    // Only fetch data when the component is fully mounted (skip initial render in strict mode)
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }
    
    fetchAgreements(searchQuery);
  }, [page, searchQuery]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    
    if (scrollTop + clientHeight >= scrollHeight - 20 && !loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const onSubmit = (data, e) => {
    setSaving(true);
    let payload = {};

    payload.agreements = ["0-4", "4-6", "6-8", "8-10", "10+"]?.map(year => {
      if (data[`rate_${year}`] > 0) {
        return {
          "years_of_experience": year,
          "rate": data[`rate_${year}`],
          "agreement_id": e?.item?.agreements?.find(agreement => agreement?.years_of_experience === year)?.id
        }
      }
    })?.filter(item => item)

    axios.patch(`/api/internal/agreement/${e?.item?.id}/`, payload)
      .then(() => {
        toast.success(`Agreement updated successfully`, { position: "top-right" })
        setSaving(false);
        toggleSaveClientUser()
        setData(prevState => {
          const newState = [...prevState];
          newState[e.index] = { ...payload, name: e?.item?.name, id: e?.item?.id, agreements: payload?.agreements?.map(agreement => ({ ...agreement, id: agreement?.agreement_id })) };
          return newState;
        });
      })
      .catch(error => {
        setSaving(false);
        if (error.response.data.errors) {
          const errorMessages = Object.entries(error.response.data.errors).map(([key, value]) => `${key}: ${value.join(', ')}`).join(', ');
          toast.error(errorMessages, { position: "top-right" });
        }
      });
  };

  const toggleEditClientUser = (index) => {
    reset();
    setEditClientUser(index);
  }

  const toggleSaveClientUser = () => {
    setEditClientUser(null)
  }

  return (
    <div className='text-[12px]'>
      <div className='w-full h-full flex justify-between items-center px-5 mb-8 ' >
        <div className='font-semibold text-sm' >Years of Experience & Agreed Rates</div>
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full sm:w-80 border focus-within:border-blue-700">
          <input
            type="text"
            placeholder="Search Client by name"
            className="flex-1 bg-transparent text-gray-600 outline-none text-xs"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
          <IoSearchSharp className="text-[#49454F]" />
        </div>
      </div>

      <div 
        ref={containerRef} 
        className="transition-all duration-1000 ease-in-out text-2xs max-h-[75vh] overflow-auto"
        onScroll={handleScroll}
      >
        <TableLoadingWrapper loading={loading} data={data}>
          {data?.map((item, index) => (
            <form key={item.id || index} onSubmit={(e) => {
              e.index = index;
              e.item = item;
              handleSubmit(onSubmit)(e);
            }}>
              <div
                className={`${editClientUser === index ? "bg-none border border-black" : "bg-[#EBEBEB]"} grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_0.5fr] mx-5 mt-2 rounded-[16px] items-center bg-[#EBEBEB80] justify-center max-h-max`}
              >
                <div className="px-5 py-1 w-auto ">
                  <span className='text-blue-600 font-bold text-xs' >{item?.name}</span>
                </div>
                {["0-4", "4-6", "6-8", "8-10", "10+"].map(year => {
                  return <div key={year} className="px-3 py-[10px] w-auto text-black flex flex-col gap-y-[4px]">
                    <label className='font-semibold' >{year} Years</label>
                    {editClientUser === index ? <>
                      <input
                        type="number"
                        placeholder={`${year} Years Rate`}
                        defaultValue={item?.agreements?.find(agreement => agreement?.years_of_experience === year)?.rate || 0}
                        className="block w-full text-left font-normal focus:outline-none border border-[#E8DEF8] focus:ring-1 focus:ring-blue-500 rounded-lg h-[30px] pl-[10px]"
                        {...register(`rate_${year}`, {
                          required: 'This is required',
                          valueAsNumber: true,
                          min: { value: 1, message: 'Value must be greater than 0' }
                        })}
                      />
                      {errors[`rate_${year}`] && <span className="error-message">{errors[`rate_${year}`].message}</span>}
                    </> : item?.agreements?.find(agreement => agreement?.years_of_experience === year)?.rate || 0}
                  </div>
                })}

                <div className="px-4 py-1 w-full flex items-center justify-center">
                  {editClientUser === index ?
                    <div className='flex items-center justify-center gap-x-2'>
                      <button
                        className='py-1 px-2 rounded-lg font-bold bg-[#056DDC] text-white text-xs'
                        type="submit"
                      >
                        {saving ? <CircularProgress
                          size={16}
                          sx={{
                            color: "white", // Change this to any color you want
                          }}
                        />
                          : "Save"}
                      </button>
                      <button
                        type='button'
                        onClick={() => {
                          toggleSaveClientUser();
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                      </button>
                    </div>
                    :
                    <button
                      className="p-1 bg-gray-200 shadow-md hover:bg-gray-300 rounded-lg"
                      onClick={() => { toggleEditClientUser(index) }}
                    >
                      <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 21H8.425L18.2 11.225L16.775 9.8L7 19.575V21ZM5 23V18.75L18.2 5.575C18.4 5.39167 18.6208 5.25 18.8625 5.15C19.1042 5.05 19.3583 5 19.625 5C19.8917 5 20.15 5.05 20.4 5.15C20.65 5.25 20.8667 5.4 21.05 5.6L22.425 7C22.625 7.18333 22.7708 7.4 22.8625 7.65C22.9542 7.9 23 8.15 23 8.4C23 8.66667 22.9542 8.92083 22.8625 9.1625C22.7708 9.40417 22.625 9.625 22.425 9.825L9.25 23H5ZM17.475 10.525L16.775 9.8L18.2 11.225L17.475 10.525Z" fill="#65558F" />
                      </svg>
                    </button>
                  }
                </div>
              </div>
            </form>
          ))}
        </TableLoadingWrapper>
      </div>
    </div>
  )
}

export { Agreement as InternalAgreements }