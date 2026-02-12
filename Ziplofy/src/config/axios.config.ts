import type { AxiosInstance } from "axios";
import axios from "axios";
import { safeLocalStorage } from "../types/local-storage";


export const axiosi: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosi.interceptors.request.use(
  (config) => {
    // Always read fresh from localStorage at request time to avoid stale tokens
    const token = safeLocalStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Remove Authorization header if no token exists
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 globally
axiosi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized responses globally
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Unauthorized';
      console.log('401 Unauthorized:', errorMessage);
      
      // Clear localStorage tokens
      safeLocalStorage.removeItem('accessToken');
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('token');
      }
      
      // Only redirect if we're not already on a login/auth page
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/auth')) {
        // Optionally redirect to auth service or login page
        // window.location.href = 'http://localhost:3000/login';
      }
    }
    
    return Promise.reject(error);
  }
);