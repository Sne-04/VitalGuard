import axios from 'axios';

// Use the environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

console.log('🔧 API Configuration:', { API_URL, env: import.meta.env.VITE_API_URL });

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('📤 API Request:', config.method.toUpperCase(), config.url, config.data);
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log('📥 API Response:', response.config.url, response.status, response.data);
        return response;
    },
    (error) => {
        console.error('❌ Response Error:', error.config?.url, error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export default api;
