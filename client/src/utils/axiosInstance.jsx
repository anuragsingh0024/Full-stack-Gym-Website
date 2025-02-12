import axios from "axios";
import { toast } from "react-hot-toast";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // Update with your API base URL
  withCredentials: true, // Important if using cookies
});

// Request interceptor (optional - for adding headers)
axiosInstance.interceptors.request.use(
  (config) => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection! Please check your network.");
      return Promise.reject(new Error("No Internet Connection"));
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle offline errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!navigator.onLine) {
      toast.error("You are offline! Check your internet connection.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
