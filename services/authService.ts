import { api } from './api';

// Coincide exactamente con LoginResponse del backend
export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
}

export interface RegisterResponse {
  message: string;
}

export const authService = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }),

  register: (email: string, password: string) =>
    api.post<RegisterResponse>('/auth/register', { email, password }),

  me: () => api.get<{ id: string; email: string }>('/auth/me'),

  logout: () => api.post<{ message: string }>('/auth/logout', {}),
};
