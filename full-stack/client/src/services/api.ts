import axios from 'axios';
import { User, Store, Rating, RegisterData, LoginData, DashboardStats, FilterOptions } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  updatePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.put('/auth/password', data);
    return response.data;
  },
};

// Stores API
export const storesAPI = {
  getAll: async (filters?: FilterOptions) => {
    const response = await api.get('/stores', { params: filters });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/stores/${id}`);
    return response.data;
  },
  
  create: async (data: Omit<Store, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/stores', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Store>) => {
    const response = await api.put(`/stores/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/stores/${id}`);
    return response.data;
  },
};

// Ratings API
export const ratingsAPI = {
  submit: async (data: { storeId: string; rating: number }) => {
    const response = await api.post('/ratings', data);
    return response.data;
  },
  
  update: async (id: string, data: { rating: number }) => {
    const response = await api.put(`/ratings/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/ratings/${id}`);
    return response.data;
  },
  
  getByStore: async (storeId: string) => {
    const response = await api.get(`/ratings/store/${storeId}`);
    return response.data;
  },
  
  getUserRating: async (storeId: string) => {
    const response = await api.get(`/ratings/user/${storeId}`);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
  
  getAllUsers: async (filters?: FilterOptions) => {
    const response = await api.get('/admin/users', { params: filters });
    return response.data;
  },
  
  createUser: async (data: RegisterData & { role: string }) => {
    const response = await api.post('/admin/users', data);
    return response.data;
  },
  
  updateUser: async (id: string, data: Partial<User>) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },
  
  deleteUser: async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
  
  getAllStores: async (filters?: FilterOptions) => {
    const response = await api.get('/admin/stores', { params: filters });
    return response.data;
  },
  
  createStore: async (data: Omit<Store, 'id' | 'createdAt' | 'updatedAt'> & { ownerId: string }) => {
    const response = await api.post('/admin/stores', data);
    return response.data;
  },
  
  updateStore: async (id: string, data: Partial<Store> & { ownerId?: string }) => {
    const response = await api.put(`/admin/stores/${id}`, data);
    return response.data;
  },
  
  deleteStore: async (id: string) => {
    const response = await api.delete(`/admin/stores/${id}`);
    return response.data;
  },
};

// Store Owner API
export const storeOwnerAPI = {
  getStoreStats: async (storeId: string) => {
    const response = await api.get(`/store-owner/stores/${storeId}/stats`);
    return response.data;
  },
  
  getStoreRatings: async (storeId: string) => {
    const response = await api.get(`/store-owner/stores/${storeId}/ratings`);
    return response.data;
  },
};

export default api; 