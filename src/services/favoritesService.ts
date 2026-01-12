/**
 * Favorites Service - API endpoints for user's favorite games
 * Backend base: /api/favorites/
 */
import api from './api';

export interface FavoriteGame {
  id: number;
  game: number;
  title: string;
  image?: string;
  tags?: string[];
  rating?: number;
  added_at?: string;
}

export interface FavoritesResponse {
  results: FavoriteGame[];
  count: number;
  next?: string;
  previous?: string;
}

/**
 * Get user's favorite games
 * Backend endpoint: GET /api/favorites/
 */
export const getFavorites = (params?: Record<string, string | number | boolean>) => 
  api.get<FavoritesResponse>('/favorites', params);

/**
 * Add a game to favorites
 * Backend endpoint: POST /api/favorites/
 * Django expects { game_id: gameId }
 */
export const addFavorite = (gameId: number) => 
  api.post<FavoriteGame>('/favorites', { game_id: gameId });

/**
 * Remove a game from favorites
 * Backend endpoint: DELETE /api/favorites/{id}/
 */
export const removeFavorite = (id: number) => 
  api.delete<void>(`/favorites/${id}`);

const favoritesService = {
  getFavorites,
  addFavorite,
  removeFavorite,
};

export default favoritesService;
