// Games service - CRUD operations for games

import { api } from './api';
import type { Game, FreeGame, GameFilters, Genre, Tag, Review } from '@/types';
import type { PaginatedResponse } from '@/types/api';

export interface GamesResponse {
  games: Game[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface FreeGamesResponse {
  games: FreeGame[];
}

export const gamesService = {
  // Get all games with optional filters
  async getGames(filters?: GameFilters): Promise<GamesResponse> {
    return api.get<GamesResponse>('/games', filters as Record<string, string | number | boolean | undefined>);
  },

  // Get free games
  async getFreeGames(): Promise<FreeGamesResponse> {
    return api.get<FreeGamesResponse>('/games/free');
  },

  // Get featured games
  async getFeaturedGames(): Promise<Game[]> {
    return api.get<Game[]>('/games/featured');
  },

  // Get game by ID
  async getGameById(gameId: number): Promise<Game> {
    return api.get<Game>(`/games/${gameId}`);
  },

  // Get game reviews
  async getGameReviews(gameId: number, page = 1, perPage = 10): Promise<PaginatedResponse<Review>> {
    return api.get<PaginatedResponse<Review>>(`/games/${gameId}/reviews`, { page, perPage });
  },

  // Get all genres
  async getGenres(): Promise<Genre[]> {
    return api.get<Genre[]>('/genres');
  },

  // Get all tags
  async getTags(): Promise<Tag[]> {
    return api.get<Tag[]>('/tags');
  },
};

export default gamesService;
