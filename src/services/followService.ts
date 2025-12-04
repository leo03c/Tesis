// Follow service - Following/followers operations

import { api } from './api';
import type { FollowUser, FollowSuggestion } from '@/types';

export interface FollowingResponse {
  following: FollowUser[];
  total: number;
}

export interface SuggestionsResponse {
  suggestions: FollowSuggestion[];
}

export const followService = {
  // Get users/developers that the current user is following
  async getFollowing(): Promise<FollowingResponse> {
    return api.get<FollowingResponse>('/following');
  },

  // Get follow suggestions
  async getSuggestions(): Promise<SuggestionsResponse> {
    return api.get<SuggestionsResponse>('/following/suggestions');
  },

  // Follow a user/developer
  async follow(userId: number): Promise<FollowUser> {
    return api.post<FollowUser>(`/following/${userId}`);
  },

  // Unfollow a user/developer
  async unfollow(userId: number): Promise<void> {
    return api.delete<void>(`/following/${userId}`);
  },

  // Get followers of the current user
  async getFollowers(): Promise<FollowingResponse> {
    return api.get<FollowingResponse>('/followers');
  },
};

export default followService;
