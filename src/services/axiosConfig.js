import axios from 'axios';
import config from '../config/environment';

// Create an instance with base URL
const api = axios.create({
    baseURL: `${config.API_BASE_URL}/api`
});

// Add request interceptor to attach token to all requests
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add response interceptor for centralized error handling
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        // Handle common errors
        if (error.response) {
            // Handle unauthorized errors - clear token and redirect to login
            if (error.response.status === 401) {
                console.log('Unauthorized access - clearing token');
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            
            // Log all API errors for debugging
            console.error('[API Error]', error.response.status, error.response.data);
        } else if (error.request) {
            // Request was made but no response received
            console.error('[API Request Error] No response received:', error.request);
        } else {
            // Error in setting up the request
            console.error('[API Config Error]', error.message);
        }
        
        return Promise.reject(error);
    }
);

// Add convenience methods for common API operations
const apiService = {
    // User authentication
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    verifyToken: () => api.get('/auth/verify'),
    
    // User registration completion
    completeRegistration: (registrationData) => api.post('/users/complete-registration', registrationData),
    checkRegistrationStatus: () => api.get('/users/registration-status'),
    
    // Allow direct access to instance for other operations
    get: api.get,
    post: api.post,
    put: api.put,
    delete: api.delete,
    
    // Return axios instance for custom configs
    instance: api
};

export default apiService;
