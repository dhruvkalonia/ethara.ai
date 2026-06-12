import axios from 'axios';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';
import type { CreatePostRequest, PageResponse, Post } from '../types/post';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post<AuthResponse>('/api/auth/refresh', {
            refreshToken,
          });
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),

  getMe: () => api.get('/users/me').then((r) => r.data),
};

export const postsApi = {
  create: (data: CreatePostRequest) =>
    api.post<Post>('/posts', data).then((r) => r.data),

  getPublished: (page = 0, size = 20) =>
    api.get<PageResponse<Post>>('/posts', { params: { page, size } }).then((r) => r.data),

  getMine: (page = 0, size = 20) =>
    api.get<PageResponse<Post>>('/posts/mine', { params: { page, size } }).then((r) => r.data),

  getById: (id: string) => api.get<Post>(`/posts/${id}`).then((r) => r.data),
};

export default api;
