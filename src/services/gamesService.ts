/**
 * Games Service - API endpoints for games in the store
 * Backend base: /api/games/
 */
import api from './api';

export interface Tag {
  id: number;
  name: string;
  slug: string;
  games_count?: string; // Agregado según la API
}

export interface Platform {
  id: number;
  nombre: string;
  icono: string;
}

export interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Game {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  price: string;
  discount: number;
  final_price: string;
  rating: string;
  download_count: number;
  release_date: string;
  developer_name: string;
  idiomas_disponibles: string[];
  editor: string;
  tamano_descarga_mb: number;
  tags: Tag[];
  plataformas: Platform[];
  featured: boolean;
  reviews: Review[];
  created_at: string;
  updated_at: string;
}

export interface GamesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
}

export interface TagsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Tag[];
}

/**
 * Get all games with optional filters
 * Backend endpoint: /api/games/games/
 */
export const getGames = (params?: Record<string, string | number | boolean>) => 
  api.get<GamesResponse>('/games/games/', params);

/**
 * Get free games
 * Backend endpoint: /api/games/games/freegames/
 * Returns array directly, not paginated
 */
export const getFreeGames = () => 
  api.get<Game[]>('/games/games/freegames/');

/**
 * Get a specific game by ID
 * Backend endpoint: /api/games/games/{id}/
 */
export const getGame = (id: number) => 
  api.get<Game>(`/games/games/${id}`);

/**
 * Get a specific game by slug
 * Backend endpoint: /api/games/games/{slug}/
 */
export const getGameBySlug = (slug: string) => 
  api.get<Game>(`/games/games/${slug}`);

/**
 * Get featured/popular games
 * Backend endpoint: /api/games/games/?featured=true
 */
export const getFeaturedGames = () => 
  api.get<GamesResponse>('/games/games/', { featured: true });

/**
 * Get all tags/categories
 * Backend endpoint: /api/games/tags/
 */
export const getTags = () => 
  api.get<TagsResponse>('/games/tags/');

/**
 * Get games by tag
 * Backend endpoint: /api/games/games/?tags={tagId}
 */
export const getGamesByTag = (tagId: number) => 
  api.get<GamesResponse>('/games/games/', { tags: tagId });

/**
 * Get games by tag slug
 * Backend endpoint: /api/games/games/?tags={tagSlug}
 */
export const getGamesByTagSlug = (tagSlug: string) => 
  api.get<GamesResponse>('/games/games/', { tags: tagSlug });

const gamesService = {
  getGames,
  getFreeGames,
  getGame,
  getGameBySlug,
  getFeaturedGames,
  getTags,
  getGamesByTag,
  getGamesByTagSlug,
};

export default gamesService;
