import axios from "axios";
import { API_URL, STORAGE_KEY } from "@/config/env";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Inject Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message;

    // Auto-Logout on 401 (Unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEY);
    }

    return Promise.reject(new Error(message));
  }
);
