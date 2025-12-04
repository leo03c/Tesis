// News-related types

export interface News {
  id: number;
  title: string;
  description: string;
  image: string;
  category?: string;
  createdAt: string;
  author?: string;
}

export interface FeaturedArticle {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface NewsCategory {
  id: number;
  name: string;
  slug: string;
}

export interface NewsFilters {
  category?: string;
  search?: string;
  page?: number;
  perPage?: number;
}
