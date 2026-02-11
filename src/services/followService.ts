/**
 * Follow/Social Service - API endpoints for following users and developers
 * Backend base: /api/social/
 */
import api from './api';

export interface SocialUserProfile {
  id: number;
  name: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  followers: string | number;
  followers_count?: number;
  games?: number;
  games_count?: number;
  is_following: boolean;
  type: 'Desarrollador' | 'Usuario';
}

// El API puede devolver el usuario directamente o envuelto en un objeto
export interface FollowItem extends SocialUserProfile {
  user?: SocialUserProfile;
}

export interface FollowingResponse {
  results: FollowItem[];
  count: number;
  next?: string;
  previous?: string;
}

/**
 * Get list of users/developers the current user is following
 * Backend endpoint: GET /api/social/following/
 */
export const getFollowing = () =>
  api.get<FollowingResponse>('/social/following');

/**
 * Get list of followers of the current user
 * Backend endpoint: GET /api/social/followers/
 */
export const getFollowers = () =>
  api.get<FollowingResponse>('/social/followers');

/**
 * Get suggested users to follow
 * Backend endpoint: GET /api/social/suggestions/
 */
export const getSuggestions = () =>
  api.get<FollowingResponse>('/social/suggestions');

/**
 * Follow a user or developer
 * Backend endpoint: POST /api/social/follow/{user_id}/
 */
export const followUser = (userId: number) =>
  api.post<{ success: boolean }>(`/social/follow/${userId}`);

/**
 * Unfollow a user or developer
 * Backend endpoint: DELETE /api/social/unfollow/{user_id}/
 */
export const unfollowUser = (userId: number) =>
  api.delete<void>(`/social/unfollow/${userId}`);

const followService = {
  getFollowing,
  getFollowers,
  getSuggestions,
  followUser,
  unfollowUser,
};

export default followService;
