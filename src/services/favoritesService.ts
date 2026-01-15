/**
 * Favorites Service - API endpoints for user's favorite games
 * Backend base: /api/favorites/
 */
import api, { APIError } from './api';
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
 * Requires authentication
 * ⚠️ 401 se maneja como estado normal
 */
export const getFavorites = async (
  params?: Record<string, string | number | boolean>
): Promise<FavoritesResponse> => {
  try {
    return await api.get<FavoritesResponse>('/favorites/', params);
  } catch (error) {
    if (error instanceof APIError && error.status === 401) {
      // Usuario no logueado / sesión expirada
      return {
        count: 0,
        next: null,
        previous: null,
        results: [],
      };
    }
    throw error;
  }
};

/**
 * Add a game to favorites
 * Requires authentication
 */
export const addFavorite = async (gameId: number) => {
  try {
    return await api.post<FavoriteGame>('/favorites/', { game_id: gameId });
  } catch (error) {
    if (error instanceof APIError && error.status === 401) {
      throw new Error('Debes iniciar sesión para añadir a favoritos');
    }
    throw error;
  }
};

/**
 * Remove a game from favorites
 * Requires authentication
 */
export const removeFavorite = async (id: number) => {
  try {
    return await api.delete<void>(`/favorites/${id}/`);
  } catch (error) {
    if (error instanceof APIError && error.status === 401) {
      throw new Error('Debes iniciar sesión para eliminar de favoritos');
    }
    throw error;
  }
};

const favoritesService = {
  getFavorites,
  addFavorite,
  removeFavorite,
};

export default favoritesService;
