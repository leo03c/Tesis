/**
 * Base API configuration for making HTTP requests to the Django backend.
 * All endpoints must end with a trailing slash as Django requires it.
 */

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean>;
}

/**
 * Ensures the URL has a trailing slash (required by Django)
 */
function ensureTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

/**
 * Build URL with query parameters
 */
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
  let url = `${API_BASE_URL}/api${ensureTrailingSlash(endpoint)}`;
  
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url = `${url}?${searchParams.toString()}`;
  }
  
  return url;
}

/**
 * Get the authentication token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

/**
 * Make an API request
 */
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', headers = {}, body, params } = options;
  
  const url = buildUrl(endpoint, params);
  
  const token = getAuthToken();
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Token ${token}`;
  }
  
  const response = await fetch(url, {
    method,
    headers: { ...defaultHeaders, ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json();
}

/**
 * API client with methods for each HTTP verb
 */
export const api = {
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean>) => 
    request<T>(endpoint, { method: 'GET', params }),
  
  post: <T>(endpoint: string, body?: unknown) => 
    request<T>(endpoint, { method: 'POST', body }),
  
  put: <T>(endpoint: string, body?: unknown) => 
    request<T>(endpoint, { method: 'PUT', body }),
  
  patch: <T>(endpoint: string, body?: unknown) => 
    request<T>(endpoint, { method: 'PATCH', body }),
  
  delete: <T>(endpoint: string) => 
    request<T>(endpoint, { method: 'DELETE' }),
};

export { API_BASE_URL };
export default api;
