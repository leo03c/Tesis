/**
 * Games Service - API endpoints for games in the store
 * Backend base: /api/games/
 */
import api from './api';

export interface Game {
  id: number;
  title: string;
  description?: string;
  image?: string;
  price?: number;
  rating?: number;
  tags?: string[];
  is_free?: boolean;
  developer?: string;
  release_date?: string;
}

export interface GamesResponse {
  results: Game[];
  count: number;
  next?: string;
  previous?: string;
}

/**
 * Get all games with optional filters
 */
export const getGames = (params?: Record<string, string | number | boolean>) => 
  api.get<GamesResponse>('/games', params);

/**
 * Get free games
 * Backend endpoint: /api/games/free/ or /api/games/?free=true
 */
export const getFreeGames = () => 
  api.get<GamesResponse>('/games/free');

/**
 * Get a specific game by ID
 * Backend endpoint: /api/games/{id}/
 */
export const getGame = (id: number) => 
  api.get<Game>(`/games/${id}`);

/**
 * Get games by category
 */
export const getGamesByCategory = (category: string) => 
  api.get<GamesResponse>('/games', { category });

/**
 * Search games
 */
export const searchGames = (query: string) => 
  api.get<GamesResponse>('/games', { search: query });

/**
 * Get featured/popular games
 */
export const getFeaturedGames = () => 
  api.get<GamesResponse>('/games', { featured: true });

const gamesService = {
  getGames,
  getFreeGames,
  getGame,
  getGamesByCategory,
  searchGames,
  getFeaturedGames,
};

export default gamesService;
