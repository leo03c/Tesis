/**
 * Catalog Service - API endpoints for developer's game catalog
 * Backend base: /api/catalog/
 * 
 * NOTE: Frontend was calling /api/developer/projects which should be /api/catalog/
 */
import api from './api';

export interface Project {
  id: number;
  title: string;
  description?: string;
  image?: string;
  status: 'draft' | 'in_development' | 'in_review' | 'published';
  status_display?: string;
  progress: number;
  last_updated?: string;
  created_at?: string;
}

export interface ProjectsResponse {
  results: Project[];
  count: number;
  next?: string;
  previous?: string;
}

export interface CreateProjectData {
  title: string;
  description?: string;
  image?: string;
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  image?: string;
  status?: Project['status'];
  progress?: number;
}

/**
 * Get all projects in the developer's catalog
 * Backend endpoint: /api/catalog/
 */
export const getProjects = (params?: Record<string, string | number | boolean>) => 
  api.get<ProjectsResponse>('/catalog', params);

/**
 * Get a specific project by ID
 * Backend endpoint: /api/catalog/{id}/
 */
export const getProject = (id: number) => 
  api.get<Project>(`/catalog/${id}`);

/**
 * Create a new project
 * Backend endpoint: /api/catalog/
 */
export const createProject = (data: CreateProjectData) => 
  api.post<Project>('/catalog', data);

/**
 * Update an existing project
 * Backend endpoint: /api/catalog/{id}/
 */
export const updateProject = (id: number, data: UpdateProjectData) => 
  api.put<Project>(`/catalog/${id}`, data);

/**
 * Partial update of a project
 * Backend endpoint: /api/catalog/{id}/
 */
export const patchProject = (id: number, data: Partial<UpdateProjectData>) => 
  api.patch<Project>(`/catalog/${id}`, data);

/**
 * Delete a project
 * Backend endpoint: /api/catalog/{id}/
 */
export const deleteProject = (id: number) => 
  api.delete<void>(`/catalog/${id}`);

/**
 * Get projects by status
 */
export const getProjectsByStatus = (status: Project['status']) => 
  api.get<ProjectsResponse>('/catalog', { status });

const catalogService = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  patchProject,
  deleteProject,
  getProjectsByStatus,
};

export default catalogService;
