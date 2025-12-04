// Following/followers types

export type FollowType = 'Desarrollador' | 'Usuario';

export interface FollowUser {
  id: number;
  name: string;
  avatar: string;
  followers: string;
  games: number;
  isFollowing: boolean;
  type: FollowType;
}

export interface FollowSuggestion {
  id: number;
  name: string;
  avatar: string;
  followers: string;
  games: number;
  type: FollowType;
}
