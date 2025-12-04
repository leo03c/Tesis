// News service - News and articles operations

import { api } from './api';
import type { News, FeaturedArticle, NewsCategory, NewsFilters } from '@/types';
import type { PaginatedResponse } from '@/types/api';

export interface NewsResponse {
  news: News[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export const newsService = {
  // Get all news with optional filters
  async getNews(filters?: NewsFilters): Promise<NewsResponse> {
    return api.get<NewsResponse>('/news', filters as Record<string, string | number | boolean | undefined>);
  },

  // Get featured news/articles
  async getFeaturedNews(): Promise<FeaturedArticle[]> {
    return api.get<FeaturedArticle[]>('/news/featured');
  },

  // Get news by ID
  async getNewsById(newsId: number): Promise<News> {
    return api.get<News>(`/news/${newsId}`);
  },

  // Get news categories
  async getCategories(): Promise<NewsCategory[]> {
    return api.get<NewsCategory[]>('/news/categories');
  },

  // Get news by category
  async getNewsByCategory(categorySlug: string, page = 1, perPage = 10): Promise<PaginatedResponse<News>> {
    return api.get<PaginatedResponse<News>>(`/news/category/${categorySlug}`, { page, perPage });
  },
};

export default newsService;
