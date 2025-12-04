// Game-related types

export interface Game {
  id: number;
  title: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  tags: string[];
  rating: number;
  description?: string;
  releaseDate?: string;
  developer?: string;
  publisher?: string;
}

export interface FreeGame {
  id: number;
  title: string;
  image: string;
  tags: string[];
  rating: number;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface GameFilters {
  genre?: string;
  tag?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price' | 'rating' | 'releaseDate' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}
