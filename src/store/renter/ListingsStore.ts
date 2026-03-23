import { create } from "zustand";
import axios from "../../lib/axios";
import toast from "react-hot-toast";

interface Listing {
    id: number;
    landlord_first_name: string;
    landlord_last_name: string;
    landlord_email: string;
    landlord_profile_pic: string;
    title: string;
    description: string;
    price: number;
    category: string;
    bedrooms: number;
    bathrooms: number;
    garages: number;
    size_sqft: number;
    land_size_sqft: number;
    year_built: number;
    rooms: number;
    address: string;
    neighbourhood: string;
    city: string;
    state: string;
    country: string;
    images: { id: number; url: string }[];
    amenities: string[];
    created_at: string;
}

interface ListingsStore {
    allListings: Listing[];
    isLoading: boolean;
    error: string | null;
    fetchListings: () => Promise<void>;
    // Add the search function definition here
    searchListings: (query: string) => Promise<void>;
}

export const useListingsStore = create<ListingsStore>((set, get) => ({
    allListings: [],
    isLoading: true, // Start as true if you're fetching on mount
    error: null,

    // Fetch all listings
    fetchListings: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.get("/renter/listings");
            set({ allListings: res.data.data, isLoading: false });
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Failed to fetch listings";
            set({ error: errorMessage, isLoading: false, allListings: [] });
            toast.error(errorMessage);
        }
    },

    // New search function
    searchListings: async (query: string) => {
        // Optimization: If search bar is cleared, just fetch all listings again
        if (!query.trim()) {
            return get().fetchListings();
        }

        set({ isLoading: true, error: null });
        try {
            // This matches the /listings/search route in your Express router
            const res = await axios.get(`/renter/listings/search?q=${encodeURIComponent(query)}`);
            
            set({ 
                allListings: res.data.data, 
                isLoading: false 
            });
        } catch (error: any) {
            console.error("Search error:", error);
            const errorMessage = error.response?.data?.error || "Search failed";
            
            set({ 
                error: errorMessage, 
                isLoading: false,
                allListings: [] 
            });
            toast.error(errorMessage);
        }
    }
}));


