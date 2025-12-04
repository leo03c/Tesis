// Library-related types

export interface LibraryGame {
  id: number;
  gameId: number;
  title: string;
  image: string;
  hoursPlayed: number;
  lastPlayed: string;
  installed: boolean;
  addedAt: string;
}

export interface LibraryFilters {
  installed?: boolean;
  search?: string;
  sortBy?: 'title' | 'hoursPlayed' | 'lastPlayed' | 'addedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PlaytimeUpdate {
  gameId: number;
  hoursPlayed: number;
}
