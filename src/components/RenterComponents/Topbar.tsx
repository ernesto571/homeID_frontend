import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useListingsStore } from "../../store/renter/ListingsStore";

export default function Topbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const { searchListings } = useListingsStore();
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Prevent searching on the very first render to avoid redundant calls 
    // since ListingsPage already calls fetchListings()
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      searchListings(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchListings]);

  const handleClearSearch = () => setSearchTerm("");

  return (
    <div className="bg-[#080e51]">
      {/* Mobile Search Bar */}
      <div className="flex md:hidden relative pt-2 justify-center">
        <div className="relative w-[80%]">
          <input
            className="py-2 pl-3 pr-10 w-full text-sm rounded-md outline-none text-gray-800"
            type="text"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <X 
              onClick={handleClearSearch}
              className="absolute right-3 top-2 text-gray-400 size-5 cursor-pointer"
            />
          )}
        </div>
      </div>

      <div className="text-gray-100 justify-between items-center w-[90%] md:w-[95%] mx-auto flex py-1 md:py-3">
        <p className="bg-[#9b9a9e] py-2 md:py-3 text-center px-2 md:px-5 text-sm md:text-[1.2rem] font-medium rounded-lg">
          For Rent
        </p>

        <span>
          {/* Desktop Search Bar */}
          <div className="hidden md:flex relative items-center">
            <Search className="absolute left-3 text-gray-500 size-5" />
            <input
              className="py-3 pl-10 pr-10 w-[300px] lg:w-[450px] text-sm rounded-md outline-none text-gray-800"
              type="text"
              placeholder="Search by city, title, or neighbourhood..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <X 
                onClick={handleClearSearch}
                className="absolute right-3 text-gray-400 size-5 cursor-pointer hover:text-gray-600"
              />
            )}
          </div>
        </span>

        <select className="text-gray-800 py-2 md:py-3 bg-white border-2 px-3 text-sm md:text-base rounded-md border-gray-200 outline-none">
          <option value="">Default Sorting</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="latest">Latest Listings</option>
        </select>
      </div>
    </div>
  );
}