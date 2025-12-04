/**
 * Library Service - API endpoints for user's game library
 * Backend base: /api/library/
 */
import api from './api';

export interface LibraryGame {
  id: number;
  game_id: number;
  title: string;
  image?: string;
  hours_played: number;
  last_played?: string;
  installed: boolean;
  added_date?: string;
}

export interface LibraryResponse {
  results: LibraryGame[];
  count: number;
  next?: string;
  previous?: string;
}

export interface LibraryStats {
  total_games: number;
  total_hours_played: number;
  installed_count: number;
}

/**
 * Get user's game library
 * Backend endpoint: /api/library/
 */
export const getLibrary = (params?: Record<string, string | number | boolean>) => 
  api.get<LibraryResponse>('/library', params);

/**
 * Get a specific game from the library
 * Backend endpoint: /api/library/{gameId}/
 */
export const getLibraryGame = (gameId: number) => 
  api.get<LibraryGame>(`/library/${gameId}`);

/**
 * Add a game to the library (after purchase)
 * Backend endpoint: /api/library/
 */
export const addToLibrary = (gameId: number) => 
  api.post<LibraryGame>('/library', { game_id: gameId });

/**
 * Update library game info (e.g., mark as installed)
 * Backend endpoint: /api/library/{gameId}/
 */
export const updateLibraryGame = (gameId: number, data: Partial<LibraryGame>) => 
  api.patch<LibraryGame>(`/library/${gameId}`, data);

/**
 * Get installed games only
 */
export const getInstalledGames = () => 
  api.get<LibraryResponse>('/library', { installed: true });

/**
 * Get not installed games
 */
export const getNotInstalledGames = () => 
  api.get<LibraryResponse>('/library', { installed: false });

/**
 * Get library statistics
 * Backend endpoint: /api/library/stats/
 */
export const getLibraryStats = () => 
  api.get<LibraryStats>('/library/stats');

const libraryService = {
  getLibrary,
  getLibraryGame,
  addToLibrary,
  updateLibraryGame,
  getInstalledGames,
  getNotInstalledGames,
  getLibraryStats,
};

export default libraryService;
