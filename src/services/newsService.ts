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
  results: NewsArticle[];
  count: number;
  next?: string;
  previous?: string;
}

/**
 * Get all news articles
 * Backend endpoint: /api/news/
 */
export const getNews = (params?: Record<string, string | number | boolean>) => 
  api.get<NewsResponse>('/news', params);

/**
 * Get featured news articles
 * Backend endpoint: /api/news/ with featured filter
 */
export const getFeaturedNews = () => 
  api.get<NewsResponse>('/news', { featured: true });

/**
 * Get a specific news article by ID
 * Backend endpoint: /api/news/{id}/
 */
export const getNewsArticle = (id: number) => 
  api.get<NewsArticle>(`/news/${id}`);

/**
 * Get news by category
 */
export const getNewsByCategory = (category: string) => 
  api.get<NewsResponse>('/news', { category });

/**
 * Search news articles
 */
export const searchNews = (query: string) => 
  api.get<NewsResponse>('/news', { search: query });

const newsService = {
  getNews,
  getFeaturedNews,
  getNewsArticle,
  getNewsByCategory,
  searchNews,
};

export default newsService;
