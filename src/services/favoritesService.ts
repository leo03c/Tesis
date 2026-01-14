/**
 * Favorites Service - API endpoints for user's favorite games
 * Backend base: /api/favorites/
 */
import api from './api';
import type { Game } from './gamesService';

export interface FavoriteGame {
  id: number;
  game: Game;
  added_date: string;
}

export interface FavoritesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FavoriteGame[];
}

/**
 * Get user's favorite games
 * Backend endpoint: GET /api/favorites/
 * Requires authentication
 */
export const getFavorites = (params?: Record<string, string | number | boolean>) => 
  api.get<FavoritesResponse>('/favorites/', params);

/**
 * Add a game to favorites
 * Backend endpoint: POST /api/favorites/
 * Requires authentication
 */
export const addFavorite = (gameId: number) => 
  api.post<FavoriteGame>('/favorites/', { game_id: gameId });

/**
 * Remove a game from favorites
 * Backend endpoint: DELETE /api/favorites/{id}/
 * Requires authentication
 */
export const removeFavorite = (id: number) => 
  api.delete<void>(`/favorites/${id}/`);

const favoritesService = {
  getFavorites,
  addFavorite,
  removeFavorite,
};

export default favoritesService;
