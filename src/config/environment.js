const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

export const config = {
    // Environment
    NODE_ENV: import.meta.env.MODE,
    
    // API Configuration - Remove /api from base URL
    API_BASE_URL: isDevelopment 
        ? 'http://localhost:2006'
        : 'https://api.yourdomain.com',
    
    // Frontend URLs
    FRONTEND_URL: isDevelopment 
        ? 'http://localhost:5173'
        : 'https://yourdomain.com',
    
    // Google OAuth
    GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '3368622032-ddc2ntil0nlbuk0qdp8iii8r7a2lugq2.apps.googleusercontent.com',
    
    // Other services
    JITSI_DOMAIN: import.meta.env.VITE_JITSI_DOMAIN || 'meet.jit.si',
    
    // Flags
    isDevelopment,
    isProduction,
    
    // Debug
    enableLogging: isDevelopment
};

// Log configuration in development
if (isDevelopment) {
    console.log('🔧 Frontend Environment:', {
        NODE_ENV: config.NODE_ENV,
        API_BASE_URL: config.API_BASE_URL,
        FRONTEND_URL: config.FRONTEND_URL,
        isDevelopment: config.isDevelopment
    });
}

export default config;
