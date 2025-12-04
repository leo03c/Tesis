// Catalog service - Developer projects operations

import { api } from './api';
import type { Project, ProjectFilters, CreateProjectRequest, UpdateProjectRequest } from '@/types';

export interface CatalogResponse {
  projects: Project[];
  total: number;
}

export const catalogService = {
  // Get developer's projects
  async getProjects(filters?: ProjectFilters): Promise<CatalogResponse> {
    return api.get<CatalogResponse>('/developer/projects', filters as Record<string, string | number | boolean | undefined>);
  },

  // Get project by ID
  async getProjectById(projectId: number): Promise<Project> {
    return api.get<Project>(`/developer/projects/${projectId}`);
  },

  // Create a new project
  async createProject(data: CreateProjectRequest): Promise<Project> {
    return api.post<Project>('/developer/projects', data);
  },

  // Update a project
  async updateProject(projectId: number, data: UpdateProjectRequest): Promise<Project> {
    return api.put<Project>(`/developer/projects/${projectId}`, data);
  },

  // Delete a project
  async deleteProject(projectId: number): Promise<void> {
    return api.delete<void>(`/developer/projects/${projectId}`);
  },

  // Submit project for review
  async submitForReview(projectId: number): Promise<Project> {
    return api.post<Project>(`/developer/projects/${projectId}/submit`);
  },

  // Publish project (after approval)
  async publishProject(projectId: number): Promise<Project> {
    return api.post<Project>(`/developer/projects/${projectId}/publish`);
  },
};

export default catalogService;
