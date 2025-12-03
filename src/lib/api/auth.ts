import { apiClient, tokenStorage } from './config';
import type { 
  User, 
  AuthTokens, 
  LoginCredentials, 
  RegisterData 
} from '@/types/api';

export interface LoginResponse {
  user?: User;
  access: string;
  refresh: string;
}

export interface RegisterResponse {
  user: User;
  access: string;
  refresh: string;
}

// Login user
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await apiClient<LoginResponse>('/api/auth/login/', {
    method: 'POST',
    body: credentials,
    requireAuth: false,
  });
  
  // Store tokens
  tokenStorage.setTokens(response.access, response.refresh);
  
  return response;
}

// Register new user
export async function register(data: RegisterData): Promise<RegisterResponse> {
  const response = await apiClient<RegisterResponse>('/api/auth/register/', {
    method: 'POST',
    body: data,
    requireAuth: false,
  });
  
  // Store tokens
  tokenStorage.setTokens(response.access, response.refresh);
  
  return response;
}

// Logout user
export async function logout(): Promise<void> {
  try {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) {
      await apiClient<void>('/api/auth/logout/', {
        method: 'POST',
        body: { refresh: refreshToken },
      });
    }
  } finally {
    tokenStorage.clearTokens();
  }
}

// Refresh access token
export async function refreshToken(): Promise<AuthTokens> {
  const refresh = tokenStorage.getRefreshToken();
  if (!refresh) {
    throw new Error('No refresh token available');
  }
  
  const response = await apiClient<AuthTokens>('/api/auth/token/refresh/', {
    method: 'POST',
    body: { refresh },
    requireAuth: false,
  });
  
  tokenStorage.setTokens(response.access, refresh);
  
  return response;
}

// Get current authenticated user
export async function getCurrentUser(): Promise<User> {
  return apiClient<User>('/api/auth/me/');
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!tokenStorage.getAccessToken();
}
