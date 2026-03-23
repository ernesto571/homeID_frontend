import { create } from "zustand";
import axios from "../../lib/axios";
import toast from "react-hot-toast";

interface Property {
  id: number;
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

interface FormData {
  title: string;
  description: string;
  price: number;
  category: string;
  numOfBedrooms: number;
  numOfBathrooms: number;
  numOfGarages: number;
  size_sqft: number;
  land_size_sqft: number;
  year_built: number;
  numOfRooms: number;
  address: string;
  neighbourhood: string;
  city: string;
  state: string;
  country: string;
  amenities: string[];
  images: string[];
}

interface PropertyStore {
  properties: Property[];
  formData: FormData;
  isLoading: boolean;
  error: string | null;
  fetchLandlordProperties: () => Promise<void>;
  createProperty: (data: FormData) => Promise<number | null>;
  addPropertyAddress: (property_id: number, data: Partial<FormData>) => Promise<boolean>;
  addPropertyAmenities: (property_id: number, amenities: string[]) => Promise<boolean>;
  addPropertyImages: (property_id: number, images: File[]) => Promise<boolean>;
  updateProperty: (id: number, data: Partial<FormData>) => Promise<boolean>;
  deleteProperty: (id: number) => Promise<boolean>;
  deletePropertyImage: (image_id: number, image_url: string) => Promise<boolean>;
  setFormData: (data: Partial<FormData>) => void;
  resetFormData: () => void;
}

const initialFormData: FormData = {
  title: "",
  description: "",
  price: 0,
  category: "rent",
  numOfBedrooms: 0,
  numOfBathrooms: 0,
  numOfGarages: 0,
  size_sqft: 0,
  land_size_sqft: 0,
  year_built: 0,
  numOfRooms: 0,
  address: "",
  neighbourhood: "",
  city: "",
  state: "",
  country: "",
  amenities: [],
  images: [],
};

export const useLandlordPropertyStore = create<PropertyStore>((set) => ({
  properties: [],
  formData: initialFormData,
  isLoading: false,
  error: null,

  fetchLandlordProperties: async () => {
    console.log("📡 fetchLandlordProperties: starting...");
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get("/landlord/properties/my-properties");
      console.log("✅ fetchLandlordProperties: success", res.data);
      console.log("🖼️ First property images:", res.data.image_url);
      set({ properties: res.data.data, isLoading: false });
    } catch (err: any) {
      console.error("🔴 fetchLandlordProperties: failed", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      set({ error: err.message, isLoading: false });
      toast.error("Failed to fetch properties");
    }
  },

  createProperty: async (data) => {
    console.log("📡 createProperty: starting...", data);
    set({ isLoading: true });
    try {
      const res = await axios.post("/landlord/properties/create", {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        numOfBedrooms: data.numOfBedrooms,
        numOfBathrooms: data.numOfBathrooms,
        numOfGarages: data.numOfGarages,
        size_sqft: data.size_sqft,
        land_size_sqft: data.land_size_sqft,
        year_built: data.year_built,
        numOfRooms: data.numOfRooms,
      });
      console.log("✅ createProperty: success, property_id:", res.data.data.id);
      set({ isLoading: false });
      return res.data.data.id;
    } catch (err: any) {
      console.error("🔴 createProperty: failed", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      set({ error: err.message, isLoading: false });
      toast.error("Failed to create property");
      return null;
    }
  },

  addPropertyAddress: async (property_id, data) => {
    console.log("📡 addPropertyAddress: starting...", { property_id, ...data });
    try {
      const res = await axios.post("/landlord/properties/address", {
        property_id,
        address: data.address,
        neighbourhood: data.neighbourhood,
        city: data.city,
        state: data.state,
        country: data.country,
      });
      console.log("✅ addPropertyAddress: success", res.data);
      return true;
    } catch (err: any) {
      console.error("🔴 addPropertyAddress: failed", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      toast.error("Failed to save address");
      return false;
    }
  },

  addPropertyAmenities: async (property_id, amenities) => {
    console.log("📡 addPropertyAmenities: starting...", { property_id, amenities });
    try {
      const res = await axios.post("/landlord/properties/amenities", { property_id, amenities });
      console.log("✅ addPropertyAmenities: success", res.data);
      return true;
    } catch (err: any) {
      console.error("🔴 addPropertyAmenities: failed", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      toast.error("Failed to save amenities");
      return false;
    }
  },

  addPropertyImages: async (property_id, images) => {
    console.log("📡 addPropertyImages: starting...", { property_id, imageCount: images.length });
    try {
      const formData = new FormData();
      formData.append("property_id", String(property_id));
      images.forEach((img) => formData.append("images", img));
      const res = await axios.post("/landlord/properties/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ addPropertyImages: success", res.data);
      return true;
    } catch (err: any) {
      console.error("🔴 addPropertyImages: failed", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      toast.error("Failed to upload images");
      return false;
    }
  },

  updateProperty: async (id, data) => {
    console.log("📡 updateProperty: starting...", { id, data });
    set({ isLoading: true });
    try {
      const res = await axios.put(`/landlord/properties/${id}`, data);
      console.log("✅ updateProperty: success", res.data);
      set((state) => ({
        properties: state.properties.map((p) => (p.id === id ? res.data.data : p)),
        isLoading: false,
      }));
      toast.success("Property updated!");
      return true;
    } catch (err: any) {
      console.error("🔴 updateProperty: failed", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      set({ error: err.message, isLoading: false });
      toast.error("Failed to update property");
      return false;
    }
  },

  deleteProperty: async (id) => {
    console.log("📡 deleteProperty: starting...", { id });
    try {
      await axios.delete(`/landlord/properties/${id}`);
      console.log("✅ deleteProperty: success, removed id:", id);
      set((state) => ({
        properties: state.properties.filter((p) => p.id !== id),
      }));
      toast.success("Property deleted!");
      return true;
    } catch (err: any) {
      console.error("🔴 deleteProperty: failed", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      toast.error("Failed to delete property");
      return false;
    }
  },

  deletePropertyImage: async (image_id: number, image_url: string) => {
    console.log("📡 deletePropertyImage: starting...", { image_id, image_url });
    try {
        await axios.delete(`/landlord/properties/image/${image_id}`, {
            data: { image_url }
        });
        console.log("✅ deletePropertyImage: success, removed image:", image_url);

        // ✅ safely handle properties that might not have images array
        set((state) => ({
          properties: state.properties.map((p) => ({
              ...p,
              images: Array.isArray(p.images)
                  ? p.images.filter((img) => img?.url !== image_url)
                  : []
          }))
        }));

        toast.success("Image deleted!");
        return true;
    } catch (err: any) {
        console.error("🔴 deletePropertyImage: failed", {
            status: err.response?.status,
            data: err.response?.data,
            message: err.message,
        });
        toast.error("Failed to delete image");
        return false;
    }
},

  setFormData: (data) => {
    console.log("📝 setFormData:", data);
    set((state) => ({ formData: { ...state.formData, ...data } }));
  },

  resetFormData: () => {
    console.log("🔄 resetFormData: clearing form");
    set({ formData: initialFormData });
  },
}));