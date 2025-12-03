import { apiClient } from './config';
import type { Game, GameFilters, Tag, PaginatedResponse } from '@/types/api';

// Get list of games with optional filters
export async function getGames(filters?: GameFilters): Promise<PaginatedResponse<Game>> {
  const params = new URLSearchParams();
  
  if (filters) {
    if (filters.tag) params.append('tag', filters.tag);
    if (filters.featured !== undefined) params.append('featured', String(filters.featured));
    if (filters.max_price !== undefined) params.append('max_price', String(filters.max_price));
    if (filters.on_sale !== undefined) params.append('on_sale', String(filters.on_sale));
    if (filters.ordering) params.append('ordering', filters.ordering);
  }
  
  const queryString = params.toString();
  const endpoint = `/api/games/${queryString ? `?${queryString}` : ''}`;
  
  return apiClient<PaginatedResponse<Game>>(endpoint, { requireAuth: false });
}

// Get game by ID
export async function getGameById(id: number): Promise<Game> {
  return apiClient<Game>(`/api/games/${id}/`, { requireAuth: false });
}

// Search games
export async function searchGames(query: string): Promise<PaginatedResponse<Game>> {
  const params = new URLSearchParams({ q: query });
  return apiClient<PaginatedResponse<Game>>(`/api/games/search/?${params.toString()}`, { 
    requireAuth: false 
  });
}

// Get all tags/categories
export async function getTags(): Promise<Tag[]> {
  return apiClient<Tag[]>('/api/games/tags/', { requireAuth: false });
}

// Get featured games
export async function getFeaturedGames(): Promise<PaginatedResponse<Game>> {
  return getGames({ featured: true });
}

// Get free games
export async function getFreeGames(): Promise<PaginatedResponse<Game>> {
  return getGames({ max_price: 0 });
}

// Get games on sale
export async function getGamesOnSale(): Promise<PaginatedResponse<Game>> {
  return getGames({ on_sale: true });
}
