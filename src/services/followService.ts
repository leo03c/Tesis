/**
 * Follow/Social Service - API endpoints for following users and developers
 * Backend base: /api/social/
 * 
 * NOTE: Frontend was calling /api/following which should be /api/social/following/
 */
import api from './api';

export interface UserProfile {
  id: number;
  name: string;
  username?: string;
  avatar?: string;
  followers: string | number;
  games?: number;
  is_following: boolean;
  type: 'Desarrollador' | 'Usuario';
}

export interface FollowingResponse {
  results: UserProfile[];
  count: number;
  next?: string;
  previous?: string;
}

/**
 * Get list of users/developers the current user is following
 * Backend endpoint: /api/social/following/
 */
export const getFollowing = () => 
  api.get<FollowingResponse>('/social/following');

/**
 * Get list of followers of the current user
 * Backend endpoint: /api/social/followers/
 */
export const getFollowers = () => 
  api.get<FollowingResponse>('/social/followers');

/**
 * Get suggested users/developers to follow
 * Backend endpoint: /api/social/suggestions/
 */
export const getSuggestions = () => 
  api.get<FollowingResponse>('/social/suggestions');

/**
 * Follow a user or developer
 * Backend endpoint: /api/social/follow/{userId}/
 */
export const followUser = (userId: number) => 
  api.post<{ success: boolean }>(`/social/follow/${userId}`);

/**
 * Unfollow a user or developer
 * Backend endpoint: /api/social/follow/{userId}/
 */
export const unfollowUser = (userId: number) => 
  api.delete<void>(`/social/follow/${userId}`);

/**
 * Check if current user is following a specific user
 * Backend endpoint: /api/social/following/{userId}/
 */
export const isFollowing = (userId: number) => 
  api.get<{ is_following: boolean }>(`/social/following/${userId}`);

const followService = {
  getFollowing,
  getFollowers,
  getSuggestions,
  followUser,
  unfollowUser,
  isFollowing,
};

export default followService;
