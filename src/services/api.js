import axios from 'axios';
import { getToken, removeToken } from '../utils/token';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000,
});

// Automatically inject JWT Bearer token into outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle expired sessions gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and on protected page, clean token and let ProtectedRoute handle redirect
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        removeToken();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
