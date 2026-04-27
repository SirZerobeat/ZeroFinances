import axios, { AxiosInstance } from 'axios';

// API Base URL - Configure based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  // Token will be added by authStore when available
  return config;
});

// Handle responses and errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth on unauthorized
      console.error('Unauthorized - clearing auth');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
