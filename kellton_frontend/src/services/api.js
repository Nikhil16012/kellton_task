import axios from 'axios';
import toast from 'react-hot-toast';


const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;

export const adminService = {
  async getAllUsers() {
    const response = await api.get("/admin/users");
    return response.data;
  },
  async deactivateUser(userId) {
    const response = await api.patch(`/admin/users/${userId}/deactivate`);
    return response.data;
  },
  async activateUser(userId) {
    const response = await api.patch(`/admin/users/${userId}/activate`);
    return response.data;
  },
  async getDashboardStats() {
    const response = await api.get("/admin/dashboard");
    return response.data;
  },
  async getUserTasks(userId) {
    const response = await api.get(`/admin/users/${userId}/tasks`);
    return response.data;
  },
}; 
