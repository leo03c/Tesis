/**
 * Library Service - API endpoints for user's game library
 * Backend base: /api/library/
 */
import api from './api';

export interface LibraryGame {
  id: number;
  game: number;
  title: string;
  image?: string;
  hours_played: number;
  last_played?: string;
  installed: boolean;
  added_at?: string;
}

export interface LibraryResponse {
  results: LibraryGame[];
  count: number;
  next?: string;
  previous?: string;
}

/**
 * Get user's game library
 * Backend endpoint: /api/library/
 */
export const getLibrary = (params?: Record<string, string | number | boolean>) => 
  api.get<LibraryResponse>('/library', params);

/**
 * Get a specific game from the library
 * Backend endpoint: /api/library/{id}/
 */
export const getLibraryGame = (id: number) => 
  api.get<LibraryGame>(`/library/${id}`);

/**
 * Add a game to the library (after purchase)
 * Backend endpoint: /api/library/
 * Django expects { game: gameId } not { game_id: gameId }
 */
export const addToLibrary = (gameId: number) => 
  api.post<LibraryGame>('/library', { game: gameId });

/**
 * Remove a game from the library
 * Backend endpoint: DELETE /api/library/{id}/
 */
export const removeFromLibrary = (id: number) => 
  api.delete<void>(`/library/${id}`);

/**
 * Update library game info (e.g., mark as installed)
 * Backend endpoint: /api/library/{id}/
 */
export const updateLibraryGame = (id: number, data: Partial<LibraryGame>) => 
  api.patch<LibraryGame>(`/library/${id}`, data);

const libraryService = {
  getLibrary,
  getLibraryGame,
  addToLibrary,
  removeFromLibrary,
  updateLibraryGame,
};

export default libraryService;
