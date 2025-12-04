// Catalog/Developer project types

export type ProjectStatus = 'Borrador' | 'En desarrollo' | 'En revisión' | 'Publicado';

export interface Project {
  id: number;
  title: string;
  image: string;
  status: ProjectStatus;
  progress: number;
  lastUpdated: string;
  description?: string;
  createdAt: string;
}

export interface ProjectFilters {
  status?: ProjectStatus | 'todos';
  search?: string;
  sortBy?: 'title' | 'lastUpdated' | 'progress' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
  image?: string;
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  image?: string;
  status?: ProjectStatus;
  progress?: number;
}
