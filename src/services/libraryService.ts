// Library service - User's game library operations

import { api } from './api';
import type { LibraryGame, LibraryFilters, PlaytimeUpdate } from '@/types';

export interface LibraryResponse {
  library: LibraryGame[];
  total: number;
  totalHoursPlayed: number;
  installedCount: number;
}

export interface LibraryStats {
  totalGames: number;
  totalHoursPlayed: number;
  installedGames: number;
}

export const libraryService = {
  // Get user's library
  async getLibrary(filters?: LibraryFilters): Promise<LibraryResponse> {
    return api.get<LibraryResponse>('/library', filters as Record<string, string | number | boolean | undefined>);
  },

  // Get library statistics
  async getLibraryStats(): Promise<LibraryStats> {
    return api.get<LibraryStats>('/library/stats');
  },

  // Update game playtime
  async updatePlaytime(gameId: number, hoursPlayed: number): Promise<LibraryGame> {
    return api.put<LibraryGame>(`/library/${gameId}/playtime`, { hoursPlayed } as PlaytimeUpdate);
  },

  // Install a game (mark as installed)
  async installGame(gameId: number): Promise<LibraryGame> {
    return api.post<LibraryGame>(`/library/${gameId}/install`);
  },

  // Uninstall a game (mark as not installed)
  async uninstallGame(gameId: number): Promise<LibraryGame> {
    return api.post<LibraryGame>(`/library/${gameId}/uninstall`);
  },

  // Play a game (update last played)
  async playGame(gameId: number): Promise<LibraryGame> {
    return api.post<LibraryGame>(`/library/${gameId}/play`);
  },
};

export default libraryService;
