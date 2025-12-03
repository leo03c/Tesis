import { apiClient } from './config';
import type { FollowUser, PaginatedResponse } from '@/types/api';

// Follow a user
export async function followUser(userId: number): Promise<void> {
  return apiClient<void>(`/api/social/follow/${userId}/`, {
    method: 'POST',
  });
}

// Unfollow a user
export async function unfollowUser(userId: number): Promise<void> {
  return apiClient<void>(`/api/social/unfollow/${userId}/`, {
    method: 'DELETE',
  });
}

// Get list of followers
export async function getFollowers(): Promise<PaginatedResponse<FollowUser>> {
  return apiClient<PaginatedResponse<FollowUser>>('/api/social/followers/');
}

// Get list of users being followed
export async function getFollowing(): Promise<PaginatedResponse<FollowUser>> {
  return apiClient<PaginatedResponse<FollowUser>>('/api/social/following/');
}
