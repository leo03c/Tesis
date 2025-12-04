// Base API configuration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

// Get token from localStorage (client-side only)
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Build URL with query parameters
const buildUrl = (endpoint: string, params?: Record<string, string | number | boolean | undefined>): string => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
};

// Base fetch wrapper with error handling and auth
export const api = {
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;
    const url = buildUrl(endpoint, params);
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    const token = getAuthToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
      (error as Error & { status: number; data: unknown }).status = response.status;
      (error as Error & { status: number; data: unknown }).data = errorData;
      throw error;
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    return JSON.parse(text);
  },

  get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  },

  post<T>(endpoint: string, data?: unknown, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      params,
    });
  },

  put<T>(endpoint: string, data?: unknown, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      params,
    });
  },

  patch<T>(endpoint: string, data?: unknown, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      params,
    });
  },

  delete<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', params });
  },
};

export default api;
