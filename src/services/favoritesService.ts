/**
 * Favorites Service - API endpoints for user's favorite games
 * Backend base: /api/favorites/
 */
import api from './api';

export interface FavoriteGame {
  id: number;
  game_id: number;
  title: string;
  image?: string;
  tags?: string[];
  rating?: number;
  added_date?: string;
}

export interface FavoritesResponse {
  results: FavoriteGame[];
  count: number;
  next?: string;
  previous?: string;
}

/**
 * Get user's favorite games
 * Backend endpoint: /api/favorites/
 */
export const getFavorites = (params?: Record<string, string | number | boolean>) => 
  api.get<FavoritesResponse>('/favorites', params);

/**
 * Add a game to favorites
 * Backend endpoint: /api/favorites/
 */
export const addFavorite = (gameId: number) => 
  api.post<FavoriteGame>('/favorites', { game_id: gameId });

/**
 * Remove a game from favorites
 * Backend endpoint: /api/favorites/{gameId}/
 */
export const removeFavorite = (gameId: number) => 
  api.delete<void>(`/favorites/${gameId}`);

/**
 * Check if a game is in favorites
 * Backend endpoint: /api/favorites/{gameId}/
 */
export const isFavorite = (gameId: number) => 
  api.get<{ is_favorite: boolean }>(`/favorites/${gameId}`);

const favoritesService = {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
};

export default favoritesService;
