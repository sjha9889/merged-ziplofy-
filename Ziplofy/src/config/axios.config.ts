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
    const token = safeLocalStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 globally
// axiosi.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Handle 401 Unauthorized responses globally
//     if (error.response?.status === 401) {
//       console.log('401 Unauthorized - clearing auth data and redirecting to auth service');
      
//       // Clear localStorage
//       localStorage.removeItem('accessToken');
//       localStorage.removeItem('token');
      
//       // Redirect to auth service
//       window.location.href = 'http://localhost:3000/login';
//     }
    
//     return Promise.reject(error);
//   }
// );