import { create } from "zustand";
import axios from "../../lib/axios";

interface Profile {
  clerk_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  last_login: Date | null;
  role: String
}

interface AuthState {
  profile: Profile | null;
  loading: boolean;
  fetchProfile: () => Promise<void>;
  createRenterProfile: () => Promise<void>;
  clearProfile: () => void;
}

export const useRenterAuthStore = create<AuthState>((set) => ({
  profile: null,
  loading: false,

  clearProfile: () => {
    set({ profile: null, loading: false });
  },

  createRenterProfile: async () => {
    console.log("🧑‍💻 createProfile: sending request...");
    try {
      const res = await axios.post("/users/create-renter-profile");
      console.log("🟢 createREnterProfile: backend response", res.data);
    } catch (err: any) {
      console.error("🔴 createRenterProfile failed:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      throw err;
    }
  },

  fetchProfile: async () => {
    console.log("📡 fetchProfile: sending request...");
    set({ loading: true });

    try {
      const res = await axios.get("/users/user-profile");
      const data = res.data;

      console.log("🟢 fetchProfile: backend response", data);

      set({
        profile: {
          clerk_id: data.clerk_id,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          last_login: data.last_login ? new Date(data.last_login) : null,
          role: data.role
        },
        loading: false,
      });
    } catch (err: any) {
      console.error("🔴 fetchProfile failed:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      set({ loading: false });

      if (err.response?.status === 401 || err.response?.status === 404) {
        set({ profile: null });
      }

      throw err;
    }
  },
}));
