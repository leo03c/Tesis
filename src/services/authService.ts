/**
 * Auth Service - API endpoints for authentication
 * Backend base: /api/auth/login/, /api/auth/register/, /api/auth/me/, /api/auth/token/refresh/
 */
import { API_BASE_URL } from './api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  username: string;
  password1: string;
  password2: string;
  privacyAccepted: boolean;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  name?: string;
}

export interface JWTAuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface AuthResponse {
  id: number;
  username: string;
  email?: string;
  token: string;
}

/**
 * Extract error message from Django API response
 * Handles different error response formats from Django REST Framework
 */
const extractErrorMessage = (data: Record<string, unknown>, defaultMessage: string): string => {
  if (typeof data.detail === 'string') return data.detail;
  if (typeof data.error === 'object' && data.error !== null && 'message' in data.error) {
    return (data.error as { message: string }).message;
  }
  if (typeof data.message === 'string') return data.message;
  // Handle field-level validation errors from Django
  if (typeof data === 'object' && data !== null) {
    const values = Object.values(data);
    if (values.length > 0 && Array.isArray(values[0])) {
      return values.flat().join(', ');
    }
  }
  return defaultMessage;
};

/**
 * Store JWT tokens in localStorage
 */
const storeTokens = (access: string, refresh: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }
};

/**
 * Clear tokens from localStorage
 */
const clearTokens = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token'); // Clear legacy token
  }
};

/**
 * Get the access token from localStorage
 */
const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

/**
 * Get the refresh token from localStorage
 */
const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token');
  }
  return null;
};

/**
 * Login user
 * Backend endpoint: /api/auth/login/
 * Returns JWT tokens: { access, refresh, user }
 */
export const login = async (credentials: LoginCredentials): Promise<JWTAuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(extractErrorMessage(data, 'Error en el login'));
  }
  
  // Store JWT tokens
  if (data.access && data.refresh) {
    storeTokens(data.access, data.refresh);
  }
  
  return data;
};

/**
 * Register new user
 * Backend endpoint: /api/auth/register/
 * Django expects password1 and password2 for confirmation
 */
export const register = async (userData: RegisterData): Promise<JWTAuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(extractErrorMessage(data, 'Error en el registro'));
  }
  
  // Store JWT tokens if returned
  if (data.access && data.refresh) {
    storeTokens(data.access, data.refresh);
  }
  
  return data;
};

/**
 * Refresh JWT access token
 * Backend endpoint: /api/auth/token/refresh/
 */
export const refreshToken = async (): Promise<{ access: string }> => {
  const refresh = getRefreshToken();
  
  if (!refresh) {
    throw new Error('No refresh token available');
  }
  
  const response = await fetch(`${API_BASE_URL}/api/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    clearTokens();
    throw new Error(extractErrorMessage(data, 'Error al renovar el token'));
  }
  
  // Update access token
  if (data.access && typeof window !== 'undefined') {
    localStorage.setItem('access_token', data.access);
  }
  
  return data;
};

/**
 * Get current authenticated user
 * Backend endpoint: /api/auth/me/
 */
export const getCurrentUser = async (): Promise<User> => {
  const token = getAccessToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(extractErrorMessage(data, 'Error al obtener usuario'));
  }
  
  return data;
};

/**
 * Logout user
 * Backend endpoint: /api/auth/logout/
 */
export const logout = async (): Promise<void> => {
  const token = getAccessToken();
  
  if (token) {
    await fetch(`${API_BASE_URL}/api/auth/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  }
  
  clearTokens();
};

/**
 * Verify token is valid
 * Backend endpoint: /api/auth/verify/
 */
export const verifyToken = async (): Promise<boolean> => {
  const token = getAccessToken();
  
  if (!token) return false;
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return response.ok;
  } catch {
    return false;
  }
};

const authService = {
  login,
  register,
  refreshToken,
  getCurrentUser,
  logout,
  verifyToken,
  getAccessToken,
  getRefreshToken,
  clearTokens,
};

export default authService;
