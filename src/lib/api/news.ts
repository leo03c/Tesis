import { apiClient } from './config';
import type { Article, PaginatedResponse } from '@/types/api';

// Get list of news articles
export async function getNews(): Promise<PaginatedResponse<Article>> {
  return apiClient<PaginatedResponse<Article>>('/api/news/', { requireAuth: false });
}

// Get news article by ID
export async function getNewsById(id: number): Promise<Article> {
  return apiClient<Article>(`/api/news/${id}/`, { requireAuth: false });
}
