import axios from 'axios';
import config from '../config/environment';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: config.API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log requests in development
        if (import.meta.env.DEV) {
            console.log(`🌐 API ${config.method?.toUpperCase()}: ${config.url}`);
        }
        
        return config;
    },
    (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle authentication errors
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        
        // Log errors in development
        if (import.meta.env.DEV) {
            console.error('❌ API Error:', {
                url: error.config?.url,
                status: error.response?.status,
                message: error.response?.data?.message || error.message
            });
        }
        
        return Promise.reject(error);
    }
);

export default api;
