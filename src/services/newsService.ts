/**
 * News Service - API endpoints for news/articles
 * Backend base: /api/news/
 */
import api from './api';

export interface NewsArticle {
  id: number;
  title: string;
  description?: string;
  content?: string;
  image?: string;
  author?: string;
  published_date?: string;
  is_featured?: boolean;
  category?: string;
}

export interface NewsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NewsArticle[];
}

/**
 * Get all news articles
 * Backend endpoint: /api/news/
 */
export const getNews = (params?: Record<string, string | number | boolean>) => 
  api.get<NewsResponse>('/news', params);

/**
 * Get a specific news article by ID
 * Backend endpoint: /api/news/{id}/
 */
export const getNewsById = (id: number) =>
  api.get<NewsArticle>(`/news/${id}`);

/**
 * Get featured news articles
 * Backend endpoint: /api/news/ with featured filter
 */
export const getFeaturedNews = () => 
  api.get<NewsResponse>('/news', { featured: true });

const newsService = {
  getNews,
  getNewsById,
  getFeaturedNews,
};

export default newsService;
