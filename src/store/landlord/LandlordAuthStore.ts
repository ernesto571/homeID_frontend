import { create } from "zustand";
import axios from "../../lib/axios";

interface Profile {
  clerk_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  last_login: Date | null;
  role: string;
  profile_pic: string;
}

interface AuthState {
  profile: Profile | null;
  loading: boolean;
  fetchLandlordProfile: () => Promise<void>;
  createLandlordProfile: () => Promise<void>;
  clearProfile: () => void;
}

export const useLandlordAuthStore = create<AuthState>((set) => ({
  profile: null,
  loading: false,

  clearProfile: () => {
    set({ profile: null, loading: false });
  },

  createLandlordProfile: async () => {
    console.log("🧑‍💻 createLandlordProfile: sending request...");
    try {
      const res = await axios.post("/users/create-landlord-profile");
      console.log("🟢 createLandlordProfile: backend response", res.data);
    } catch (err: any) {
      console.error("🔴 createLandlordProfile failed:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      throw err;
    }
  },

  
  fetchLandlordProfile: async () => {
    console.log("📡 fetchLandlordProfile: sending request...");
    set({ loading: true });

    try {
      const res = await axios.get("/users/user-profile");
      const data = res.data;

      console.log("🟢 fetchLandlordProfile: backend response", data);

      set({
        profile: {
          clerk_id: data.clerk_id,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          last_login: data.last_login ? new Date(data.last_login) : null,
          role: data.role,
          profile_pic: data.profile_pic
        },
        loading: false,
      });
    } catch (err: any) {
      console.error("🔴 fetchLandlordProfile failed:", {
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
  }

}));
 