import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

interface Enquiry {
    id: number;
    property_id: number;
    renter_id: number;
    full_name: string;
    phone_number: string; // ✅ string not number — phone numbers can have +44, spaces etc.
    email_address: string; // ✅ match backend field name
    message: string;
    status: string;
    created_at: string;
}

interface FormData {
    property_id: number; // ✅ needed to link enquiry to property
    full_name: string;
    phone_number: string;
    email_address: string;
    message: string;
}

interface EnquiryStore {
    formData: FormData;
    enquiries: Enquiry[];
    isLoading: boolean;
    error: string | null;
    sendEnquiry: (data: FormData) => Promise<boolean>;
    fetchLandlordEnquiries: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAsReplied: (id: number) => Promise<void>;
    setFormData: (data: Partial<FormData>) => void;
    resetFormData: () => void;
}

const initialFormData: FormData = {
    property_id: 0,
    full_name: '',
    phone_number: '',
    email_address: '',
    message: ''
}

export const useEnquiryStore = create<EnquiryStore>((set) => ({
    enquiries: [],
    formData: initialFormData,
    isLoading: false,
    error: null,

    sendEnquiry: async (data) => {
        console.log("📡 sendEnquiry: starting...", data);
        set({ isLoading: true });
        try {
            const res = await axios.post("/enquiries/submit", data);
            console.log("✅ sendEnquiry: success", res.data);
            set({ isLoading: false });
            toast.success("Enquiry sent successfully!");
            return true;
        } catch (err: any) {
            console.error("🔴 sendEnquiry: failed", {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message,
            });
            set({ error: err.message, isLoading: false });
            toast.error("Failed to send enquiry");
            return false;
        }
    },

    fetchLandlordEnquiries: async () => {
        console.log("📡 fetchLandlordEnquiries: starting...");
        set({ isLoading: true });
        try {
            const res = await axios.get("/enquiries");
            console.log("✅ fetchLandlordEnquiries: success", res.data);
            set({ enquiries: res.data.data, isLoading: false });
        } catch (err: any) {
            console.error("🔴 fetchLandlordEnquiries: failed", {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message,
            });
            set({ error: err.message, isLoading: false });
            toast.error("Failed to fetch enquiries");
        }
    },

    markAsRead: async (id) => {
        console.log("📡 markAsRead: starting...", { id });
        try {
            await axios.patch(`/enquiries/${id}/read`);
            console.log("✅ markAsRead: success");
            // ✅ update local state immediately
            set((state) => ({
                enquiries: state.enquiries.map((e) =>
                    e.id === id ? { ...e, status: "read" } : e
                )
            }));
        } catch (err: any) {
            console.error("🔴 markAsRead: failed", err.message);
        }
    },

    markAsReplied: async (id) => {
        console.log("📡 markAsReplied: starting...", { id });
        try {
            await axios.patch(`/enquiries/${id}/replied`);
            console.log("✅ markAsReplied: success");
            // ✅ update local state immediately
            set((state) => ({
                enquiries: state.enquiries.map((e) =>
                    e.id === id ? { ...e, status: "replied" } : e
                )
            }));
            toast.success("Marked as replied!");
        } catch (err: any) {
            console.error("🔴 markAsReplied: failed", err.message);
            toast.error("Failed to mark as replied");
        }
    },

    setFormData: (data) => {
        console.log("📝 setFormData:", data);
        set((state) => ({ formData: { ...state.formData, ...data } }));
    },

    resetFormData: () => {
        console.log("🔄 resetFormData: clearing form");
        set({ formData: initialFormData });
    }
}));