import PropTypes from "prop-types";
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import axios from "../../src/api/axios"; // Import axios instance
import { KeyboardArrowDown } from "@mui/icons-material";

const InfiniteScrollSelect = forwardRef(
  (
    {
      apiEndpoint,
      onSelect,
      optionLabel,
      setParentItems = () => {},
      placeholder = "Select an option",
      className = "",
      dropdownClassName = "",
      maxId = 10,
      changeValue = true,
      defaultValue = null,
      selectedOptions = [],
      showDropdownAbove = false,
      disabled = false,
    },
    ref
  ) => {
    const [items, setItems] = useState([]);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] =
      useState(defaultValue);
    const [dropdownPosition, setDropdownPosition] =
      useState({ top: 0, left: 0, width: 0 });
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const scrollRef = useRef(null);
    const mountedRef = useRef(false);

    useImperativeHandle(ref, () => ({
      updateState: (newState) => {
        setItems((prevItems) => {
          if (
            prevItems?.some(
              (item) => item.id === newState.id
            )
          ) {
            return [...prevItems];
          } else {
            return [...prevItems, newState];
          }
        });
      },
    }));

    const loadMoreItems = useCallback(
      async (isMounted = true, currentPage = 1) => {
        if (loading || !hasMoreItems) return;
        setLoading(true);
        try {
          const response = await axios.get(apiEndpoint, {
            params: { offset: (currentPage - 1) * 10 },
          });
          if (isMounted && mountedRef.current) {
            const newItems = response.data.results;
            setItems((prevItems) =>
              currentPage === 1
                ? newItems
                : [...prevItems, ...newItems]
            );
            setParentItems((prevItems) =>
              currentPage === 1
                ? newItems
                : [...prevItems, ...newItems]
            );
            setHasMoreItems(response.data.next);
          }
        } catch (error) {
          console.error("Error loading items:", error);
        } finally {
          if (isMounted && mountedRef.current) {
            setLoading(false);
          }
        }
      },
      [apiEndpoint]
    );

    useEffect(() => {
      setSelectedItem(defaultValue);
    }, [defaultValue]);

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
          const { scrollTop, scrollHeight, clientHeight } =
            scrollRef.current;
          if (
            scrollHeight - scrollTop <= clientHeight + 1 &&
            hasMoreItems
          ) {
            loadMoreItems(true, page + 1);
            setPage((prevPage) => prevPage + 1);
          }
        }
      };

      if (scrollRef.current && mountedRef.current) {
        const refCurrent = scrollRef.current;
        refCurrent.addEventListener("scroll", handleScroll);
        return () => {
          refCurrent.removeEventListener(
            "scroll",
            handleScroll
          );
        };
      }
    }, [hasMoreItems, isOpen]);

    // Filter out already selected items
    const filteredItems = items?.filter(
      (item) =>
        !selectedOptions
          ?.map((si) => si?.id || si)
          ?.includes(item.id)
    );

    // Update dropdown position when opened
    useEffect(() => {
      if (isOpen && buttonRef.current) {
        const rect =
          buttonRef.current.getBoundingClientRect();

        // Calculate estimated height of dropdown (approximate height per item)
        const itemHeight = 40; // Estimated height per item in pixels
        const paddingHeight = 16; // Extra padding

        // Ensure we always have at least one item's height (for "No options available")
        const estimatedHeight = Math.min(
          Math.max(
            (filteredItems.length || 1) * itemHeight +
              paddingHeight,
            50
          ),
          240 // Max height as set in max-h-60 (60*4=240px)
        );

        setDropdownPosition({
          top: showDropdownAbove
            ? rect.top - estimatedHeight
            : rect.bottom,
          left: rect.left,
          width: rect.width,
        });
      }
    }, [isOpen, showDropdownAbove, filteredItems.length]);

    // Click outside handler
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target) &&
          scrollRef.current &&
          !scrollRef.current.contains(event.target) &&
          mountedRef.current
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
      return () =>
        document.removeEventListener(
          "mousedown",
          handleClickOutside
        );
    }, []);

    const handleSelect = (item) => {
      if (mountedRef.current) {
        if (changeValue) {
          setSelectedItem(item);
          setIsOpen(false);
        } else {
          setSelectedItem("");
        }
        onSelect(item);
      }
    };

    return (
      <div className="relative w-full" ref={dropdownRef}>
        <button
          disabled={disabled}
          type="button"
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center w-full p-2 text-[rgb(0 0 0 / 87%)] border border-[#CAC4D0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            disabled ? "cursor-not-allowed" : ""
          } ${className}`}
        >
          {selectedItem ? (
            selectedItem.name
          ) : (
            <span className="text-[#afb3b6]">
              {placeholder}
            </span>
          )}{" "}
          <KeyboardArrowDown
            fontSize="small"
            className="absolute top-2 right-2"
          />
        </button>

        {isOpen && (
          <div
            ref={scrollRef}
            style={{
              position: "fixed",
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              zIndex: 9999,
            }}
            className={`bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto ${dropdownClassName}`}
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {item[optionLabel]}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-center text-gray-500">
                No options available
              </div>
            )}
            {loading && (
              <div className="px-4 py-2 text-center text-gray-500">
                Loading more options...
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

InfiniteScrollSelect.displayName = "InfiniteScrollSelect";

InfiniteScrollSelect.propTypes = {
  apiEndpoint: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  optionLabel: PropTypes.string.isRequired,
  setParentItems: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  dropdownClassName: PropTypes.string,
  maxId: PropTypes.number,
  changeValue: PropTypes.bool,
  defaultValue: PropTypes.object,
  selectedOptions: PropTypes.array,
  showDropdownAbove: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default InfiniteScrollSelect;
