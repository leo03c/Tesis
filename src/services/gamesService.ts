/**
 * Games Service - API endpoints for games in the store
 * Backend base: /api/games/
 */
import api from './api';

export interface Tag {
  id: number;
  name: string;
  slug: string;
  game_count?: number;
}

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

export interface GameDetail extends Game {
  short_description?: string;
  images?: {
    cover?: string;
    screenshots?: string[];
    banner?: string;
  };
  videos?: {
    trailers?: string[];
    gameplay?: string[];
  };
  original_price?: number;
  discount?: number;
  genres?: string[];
  publisher?: string;
  platforms?: string[];
  requirements?: {
    minimum?: Record<string, string>;
    recommended?: Record<string, string>;
  };
  languages?: string[];
  age_rating?: string;
  review_count?: number;
  is_in_wishlist?: boolean;
  is_owned?: boolean;
}

export interface GamesResponse {
  results: Game[];
  count: number;
  next?: string;
  previous?: string;
}

export interface TagsResponse {
  results: Tag[];
  count: number;
  next?: string;
  previous?: string;
}

/**
 * Get all games with optional filters
 * Backend endpoint: /api/games/
 */
export const getGames = (params?: Record<string, string | number | boolean>) => 
  api.get<GamesResponse>('/games', params);

/**
 * Get free games
 * Backend endpoint: /api/games/?is_free=true
 */
export const getFreeGames = () => 
  api.get<GamesResponse>('/games', { is_free: true });

/**
 * Get a specific game by ID
 * Backend endpoint: /api/games/{id}/
 */
export const getGame = (id: number) => 
  api.get<GameDetail>(`/games/${id}`);

/**
 * Get all available tags
 * Backend endpoint: /api/games/tags/
 */
export const getTags = () => 
  api.get<TagsResponse>('/games/tags');

/**
 * Get games by tag
 * Backend endpoint: /api/games/?tag=slug
 */
export const getGamesByTag = (tagSlug: string) => 
  api.get<GamesResponse>('/games', { tag: tagSlug });

/**
 * Get games by category (alias for getGamesByTag for compatibility)
 * @deprecated Use getGamesByTag instead
 */
export const getGamesByCategory = (category: string) => 
  api.get<GamesResponse>('/games', { tag: category });

/**
 * Search games
 * Backend endpoint: /api/games/search/?q=term
 */
export const searchGames = (query: string) => 
  api.get<GamesResponse>('/games/search', { q: query });

/**
 * Get featured/popular games
 * Backend endpoint: /api/games/?featured=true
 */
export const getFeaturedGames = () => 
  api.get<GamesResponse>('/games', { featured: true });

const gamesService = {
  getGames,
  getFreeGames,
  getGame,
  getTags,
  getGamesByTag,
  getGamesByCategory,
  searchGames,
  getFeaturedGames,
};

export default gamesService;
