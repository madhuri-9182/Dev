import PropTypes from 'prop-types';
import { useEffect, useRef, useState, useCallback } from 'react';
import axios from '../../src/api/axios';  // Import axios instance
import { KeyboardArrowDown } from '@mui/icons-material';

const InfiniteScrollSelect = ({ apiEndpoint, onSelect, setParentItems = ()=>{}, placeholder = "Select an option", className = "", maxId = 10 }) => {
    const [items, setItems] = useState([]);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const dropdownRef = useRef(null);
    const scrollRef = useRef(null);
    const mountedRef = useRef(false);

    const loadMoreItems = useCallback(async (isMounted = true, currentPage = 1) => {
        if (loading || !hasMoreItems) return;
        setLoading(true);
        try {
            const response = await axios.get(apiEndpoint, {
                params: { offset: (currentPage-1) * 10 }
            });
            if (isMounted && mountedRef.current) {
                const newItems = response.data.results;
                setItems(prevItems => currentPage === 1 ? newItems : [...prevItems, ...newItems]);
                setParentItems(prevItems => currentPage === 1 ? newItems : [...prevItems, ...newItems]);
                setHasMoreItems(response.data.next);
            }
        } catch (error) {
            console.error('Error loading items:', error);
        } finally {
            if (isMounted && mountedRef.current) {
                setLoading(false);
            }
        }
    }, [apiEndpoint]);

    // Initial load
    useEffect(() => {
        mountedRef.current = true;
        const initialLoadPages = Math.ceil(maxId / 10); // Calculate how many pages to load based on maxId
        const loadInitialItems = async () => {
            for (let i = 1; i <= initialLoadPages; i++) {
                await loadMoreItems(true, i);
            }
        };
        loadInitialItems();
        return () => {
            mountedRef.current = false;
        };
    }, [loadMoreItems, maxId]);

    // Scroll handler
    useEffect(() => {
        const handleScroll = () => {
            if (scrollRef.current && mountedRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
                if (scrollHeight - scrollTop <= clientHeight + 1 && hasMoreItems) {
                    loadMoreItems(true, page + 1);
                    setPage(prevPage => prevPage + 1);
                }
            }
        };

        if (scrollRef.current && mountedRef.current) {
            const refCurrent = scrollRef.current;
            refCurrent.addEventListener('scroll', handleScroll);
            return () => {
                refCurrent.removeEventListener('scroll', handleScroll);
            };
        }
    }, [hasMoreItems, isOpen]);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && mountedRef.current) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (item) => {
        if (mountedRef.current) {
            setSelectedItem("");
            onSelect(item);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full p-2 text-left text-gray-500 border border-[#CAC4D0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            >
                {selectedItem ? selectedItem.name : placeholder} <KeyboardArrowDown fontSize='small'/>
            </button>

            {isOpen && (
                <div 
                    ref={scrollRef}
                    className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto"
                >
                    {items.map(item => (
                        <div
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {item.full_name}
                        </div>
                    ))}
                    {loading && (
                        <div className="px-4 py-2 text-center text-gray-500">
                            Loading more options...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

InfiniteScrollSelect.propTypes = {
    apiEndpoint: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    setParentItems: PropTypes.func,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    maxId: PropTypes.number,
};

export default InfiniteScrollSelect;
