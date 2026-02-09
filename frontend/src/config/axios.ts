import axios from "axios";

// Type-safe environment variable access
const getBaseURL = (): string => {
    return import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
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
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else if (config.headers && 'Authorization' in config.headers) {
            delete (config.headers as any).Authorization;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for global error handling
axiosi.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors globally
        if (error.response?.status === 401) {
            // Token expired or invalid
            console.log('🔐 Authentication failed, clearing token');
            localStorage.removeItem('admin_token');
            localStorage.removeItem('userData');
            localStorage.removeItem('userRole');
            localStorage.removeItem('isSuperAdmin');
            // Don't auto-redirect, let the component handle it
        }
        return Promise.reject(error);
    }
);

export default axiosi;