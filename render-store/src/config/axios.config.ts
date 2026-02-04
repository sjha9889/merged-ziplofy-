import type { AxiosInstance } from "axios";
import axios from "axios";
import { safeLocalStorage } from "../types/local-storage";

export const axiosi: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosi.interceptors.request.use(
  (config) => {
    const token = safeLocalStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
