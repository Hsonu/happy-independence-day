import api from './api';
import { ApiResponse, AuthResponse } from '@/types';

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
  if (data.success && data.data.token) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  return data.data;
};

export const registerUser = async (userData: {
  name: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  referralCode?: string;
}): Promise<AuthResponse> => {
  const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
  if (data.success && data.data.token) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  return data.data;
};

export const logoutUser = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch {
    // Continue with local cleanup even if API call fails
  }
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = async () => {
  const { data } = await api.get<ApiResponse<{ user: any }>>('/auth/me');
  return data.data.user;
};

export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};
