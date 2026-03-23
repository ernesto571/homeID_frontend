import axiosLib from "axios";

const axios = axiosLib.create({
 baseURL: import.meta.env.DEV
    ? "http://localhost:3001/api"
    : import.meta.env.VITE_BACKEND_URL,
});

axios.interceptors.request.use(async (config) => {
  console.log("🌐 Making request to:", config.url);

  const token = await window.Clerk?.session?.getToken();

  console.log("🔑 Token exists:", !!token);

  if (token) {
    // Ensure headers exists AND is the correct type
    if (!config.headers) {
      console.error("no hwader")
    }

    // Now safely mutate
    (config.headers as any).Authorization = `Bearer ${token}`;
    console.log("✅ Authorization header set");
  } else {
    console.warn("⚠️ No token found!");
  }

  return config;
});

axios.interceptors.response.use(
  (response) => {
    console.log("✅ Response from:", response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error("❌ Request failed:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default axios;
