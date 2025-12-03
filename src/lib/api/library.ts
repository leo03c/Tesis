import { apiClient } from './config';
import type { LibraryItem, PaginatedResponse } from '@/types/api';

// Get user's library
export async function getLibrary(): Promise<PaginatedResponse<LibraryItem>> {
  return apiClient<PaginatedResponse<LibraryItem>>('/api/library/');
}

// Add game to library
export async function addToLibrary(gameId: number): Promise<LibraryItem> {
  return apiClient<LibraryItem>('/api/library/', {
    method: 'POST',
    body: { game: gameId },
  });
}

// Get library item by ID
export async function getLibraryItem(id: number): Promise<LibraryItem> {
  return apiClient<LibraryItem>(`/api/library/${id}/`);
}

// Update library item (e.g., hours played, installed status)
export async function updateLibraryItem(
  id: number, 
  data: Partial<LibraryItem>
): Promise<LibraryItem> {
  return apiClient<LibraryItem>(`/api/library/${id}/`, {
    method: 'PUT',
    body: data,
  });
}

// Remove game from library
export async function removeFromLibrary(id: number): Promise<void> {
  return apiClient<void>(`/api/library/${id}/`, {
    method: 'DELETE',
  });
}
