import axios from 'axios';
import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Inject Supabase auth token on every request
api.interceptors.request.use(async (config) => {
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  }
  return config;
});

// Normalize error responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ─── Auth API ───────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// ─── Bikes API ──────────────────────────────────────────
export const bikesAPI = {
  list: (params) => api.get('/bikes', { params }),
  getById: (id) => api.get(`/bikes/${id}`),
  create: (data) => api.post('/bikes', data),
  update: (id, data) => api.put(`/bikes/${id}`, data),
  delete: (id) => api.delete(`/bikes/${id}`),
};

// ─── Upload API ─────────────────────────────────────────
export const uploadAPI = {
  uploadImages: (formData) =>
    api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteImage: (publicId) => api.delete(`/upload/${publicId}`),
};

// ─── Admin API ──────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getBikes: (params) => api.get('/admin/bikes', { params }),
  updateBikeStatus: (id, status) => api.put(`/admin/bikes/${id}/status`, { status }),
  deleteBike: (id) => api.delete(`/admin/bikes/${id}`),
};

export default api;
