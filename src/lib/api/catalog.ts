import { apiClient } from './config';
import type { Project, ProjectCreateData, PaginatedResponse } from '@/types/api';

// Get developer's catalog
export async function getCatalog(): Promise<PaginatedResponse<Project>> {
  return apiClient<PaginatedResponse<Project>>('/api/catalog/');
}

// Create new project
export async function createProject(data: ProjectCreateData): Promise<Project> {
  return apiClient<Project>('/api/catalog/', {
    method: 'POST',
    body: data,
  });
}

// Get project by ID
export async function getProject(id: number): Promise<Project> {
  return apiClient<Project>(`/api/catalog/${id}/`);
}

// Update project
export async function updateProject(id: number, data: Partial<Project>): Promise<Project> {
  return apiClient<Project>(`/api/catalog/${id}/`, {
    method: 'PUT',
    body: data,
  });
}

// Delete project
export async function deleteProject(id: number): Promise<void> {
  return apiClient<void>(`/api/catalog/${id}/`, {
    method: 'DELETE',
  });
}
