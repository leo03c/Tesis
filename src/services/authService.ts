/**
 * Auth Service - API endpoints for authentication
 * Backend base: /api/auth/login/, /api/auth/register/, /api/auth/me/, /api/auth/token/refresh/
 */
import api from './api';
import { getSession } from 'next-auth/react';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  created_at: string;
}

export interface AuthResponse {
  user: UserProfile;
  access: string;
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
}

/**
 * Login user
 * Backend endpoint: POST /api/auth/login/
 */
export const login = (credentials: LoginCredentials) =>
  api.post<AuthResponse>('/auth/login/', credentials);

/**
 * Register new user
 * Backend endpoint: POST /api/auth/register/
 */
export const register = (data: RegisterData) =>
  api.post<AuthResponse>('/auth/register/', data);

/**
 * Get current user profile
 * Backend endpoint: GET /api/auth/me/
 * Requires authentication
 */
export const getUserProfile = () =>
  api.get<UserProfile>('/auth/me/');

/**
 * Update user profile (text fields)
 * Backend endpoint: PATCH /api/auth/me/
 * Requires authentication
 */
export const updateUserProfile = (data: Partial<UserProfile>) =>
  api.patch<UserProfile>('/auth/me/', data);

/**
 * Update user avatar
 * Backend endpoint: PATCH /api/auth/me/
 * Requires authentication
 * Uses multipart/form-data
 */
export const updateUserAvatar = async (file: File) => {
  const session = await getSession();
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${session?.accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al actualizar avatar');
  }

  return response.json();
};

/**
 * Refresh access token
 * Backend endpoint: POST /api/auth/token/refresh/
 */
export const refreshToken = (refreshToken: string) =>
  api.post<RefreshTokenResponse>('/auth/token/refresh/', { refresh: refreshToken });

/**
 * Logout user (client-side only, clears session)
 */
export const logout = () => {
  // Next-auth maneja el logout
  // Esta función puede usarse para limpiar estado adicional si es necesario
  return Promise.resolve();
};

const authService = {
  login,
  register,
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
  refreshToken,
  logout,
};

export default authService;
