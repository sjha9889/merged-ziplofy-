import axios from "axios";
import { SUPER_ADMIN_TOKEN } from "../constants";

// Type-safe environment variable access
const getBaseURL = (): string => {
    return import.meta.env.VITE_BACKEND_URL
};

const axiosi = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token to every request
axiosi.interceptors.request.use(
    (config) => {
        const token = SUPER_ADMIN_TOKEN
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for global error handling
// axiosi.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     (error) => {
//         // Handle common errors globally
//         if (error.response?.status === 401) {
//             // Token expired or invalid
//             localStorage.removeItem('token');
//             // You can redirect to login page here
//             window.location.href = '/login';
//         }
//         return Promise.reject(error);
//     }
// );

export default axiosi;