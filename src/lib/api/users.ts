import { apiClient } from './config';
import type { User, UserProfile } from '@/types/api';

// Get current user profile
export async function getProfile(): Promise<UserProfile> {
  return apiClient<UserProfile>('/api/users/profile/');
}

// Update current user profile
export async function updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  return apiClient<UserProfile>('/api/users/profile/', {
    method: 'PUT',
    body: data,
  });
}

// Get public user profile by ID
export async function getUserById(id: number): Promise<User> {
  return apiClient<User>(`/api/users/${id}/`);
}
