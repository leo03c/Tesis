// User types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  bio?: string;
  is_developer?: boolean;
  date_joined?: string;
  followers_count?: number;
  following_count?: number;
}

export interface UserProfile extends User {
  games_count?: number;
  library_count?: number;
}

// Authentication types
export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Game types
export interface Tag {
  id: number;
  name: string;
  slug: string;
  games_count?: number;
}

export interface Game {
  id: number;
  title: string;
  slug?: string;
  description?: string;
  short_description?: string;
  image: string;
  cover_image?: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  is_free?: boolean;
  is_featured?: boolean;
  on_sale?: boolean;
  rating?: number;
  reviews_count?: number;
  tags: Tag[];
  developer?: User;
  release_date?: string;
  created_at?: string;
}

export interface GameFilters {
  tag?: string;
  featured?: boolean;
  max_price?: number;
  on_sale?: boolean;
  ordering?: string;
}

export interface GameSearchParams {
  q: string;
}

// Library types
export interface LibraryItem {
  id: number;
  game: Game;
  hours_played?: number;
  last_played?: string;
  installed?: boolean;
  added_at: string;
}

// Favorite types
export interface Favorite {
  id: number;
  game: Game;
  added_at: string;
}

// Catalog/Project types
export interface Project {
  id: number;
  title: string;
  description?: string;
  image: string;
  status: 'draft' | 'in_development' | 'in_review' | 'published';
  progress: number;
  last_updated?: string;
  created_at?: string;
}

export interface ProjectCreateData {
  title: string;
  description?: string;
  image?: string;
}

// Social types
export interface FollowUser {
  id: number;
  username: string;
  avatar?: string;
  followers_count?: number;
  games_count?: number;
  is_following?: boolean;
  user_type?: string;
}

// News types
export interface Article {
  id: number;
  title: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  image: string;
  author?: User;
  published_at?: string;
  created_at?: string;
}

// Support types
export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string;
  order?: number;
}

export interface SupportTicket {
  id: number;
  subject: string;
  message: string;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at?: string;
  updated_at?: string;
}

export interface TicketCreateData {
  subject: string;
  message: string;
  category?: string;
}

// Pagination types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// API Error type
export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}
