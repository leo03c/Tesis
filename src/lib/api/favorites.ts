import { apiClient } from './config';
import type { Favorite, PaginatedResponse } from '@/types/api';

// Get user's favorites
export async function getFavorites(): Promise<PaginatedResponse<Favorite>> {
  return apiClient<PaginatedResponse<Favorite>>('/api/favorites/');
}

// Add game to favorites
export async function addToFavorites(gameId: number): Promise<Favorite> {
  return apiClient<Favorite>('/api/favorites/', {
    method: 'POST',
    body: { game: gameId },
  });
}

// Remove game from favorites
export async function removeFromFavorites(id: number): Promise<void> {
  return apiClient<void>(`/api/favorites/${id}/`, {
    method: 'DELETE',
  });
}
