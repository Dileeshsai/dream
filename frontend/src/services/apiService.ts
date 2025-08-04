// apiService.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // or your backend URL
});
// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    console.log('Token available:', !!token);
    console.log('Token value:', token ? token.substring(0, 20) + '...' : 'null');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.log('No token found, request will be made without authorization');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data, error.config?.url);
    return Promise.reject(error);
  }
);

export default api;

export const apiPost = (...args: Parameters<typeof api.post>) => api.post(...args);
export const apiGet = (...args: Parameters<typeof api.get>) => api.get(...args);
export const apiPut = (...args: Parameters<typeof api.put>) => api.put(...args);
export const apiDelete = (...args: Parameters<typeof api.delete>) => api.delete(...args);