/**
 * Auth Service - API endpoints for authentication
 * Backend base: /api/auth/, /api/login/, /api/register/
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
  password: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email?: string;
  token: string;
}

/**
 * Login user
 * Backend endpoint: /api/login/
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.detail || 'Error en el login');
  }
  
  return data;
};

/**
 * Register new user
 * Backend endpoint: /api/register/
 */
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.detail || 'Error en el registro');
  }
  
  return data;
};

/**
 * Logout user
 * Backend endpoint: /api/auth/logout/
 */
export const logout = async (): Promise<void> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  await fetch(`${API_BASE_URL}/api/auth/logout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Token ${token}` } : {}),
    },
  });
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

/**
 * Verify token is valid
 * Backend endpoint: /api/auth/verify/
 */
export const verifyToken = async (): Promise<boolean> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  if (!token) return false;
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
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
  logout,
  verifyToken,
};

export default authService;
