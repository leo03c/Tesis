import { getSession } from 'next-auth/react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Endpoints públicos (NO requieren auth)
 */
const PUBLIC_ENDPOINTS = [
  '/games/games/freegames',
  '/games/games/most_downloaded',
  '/games/games/best_offers',
  '/games/games/top_rated',
  '/games/games',
  '/games/tags',
  '/games/plataformas',
  '/news',
  '/auth/token/refresh',
];

let cachedAccessToken: string | null = null;

function isPublicEndpoint(endpoint: string): boolean {
  const cleanEndpoint = endpoint.split('?')[0].replace(/\/$/, '');
  return PUBLIC_ENDPOINTS.some(publicEndpoint => {
    const cleanPublic = publicEndpoint.replace(/\/$/, '');
    return (
      cleanEndpoint === cleanPublic ||
      cleanEndpoint.startsWith(cleanPublic + '/')
    );
  });
}

function ensureTrailingSlash(url: string): string {
  const [path, query] = url.split('?');
  const pathWithSlash = path.endsWith('/') ? path : `${path}/`;
  return query ? `${pathWithSlash}?${query}` : pathWithSlash;
}

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
    public url?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  params?: Record<string, string | number | boolean>;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
  canRetry = true
): Promise<T> {
  const { method = 'GET', body, params } = options;

  let url = `${API_BASE_URL}${endpoint}`;

  if (params) {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [k, v]) => {
        acc[k] = String(v);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    url = `${url}?${queryString}`;
  }

  url = ensureTrailingSlash(url);

  const headers: HeadersInit = {};
  const isFormData = body instanceof FormData;

  // Solo establecer Content-Type si no es FormData
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  // 🔐 Autenticación SOLO si el endpoint no es público
  if (!isPublicEndpoint(endpoint)) {
    const session = await getSession();
    const accessToken = cachedAccessToken || session?.accessToken;

    // ⛔ NO hay sesión → NO hacer request
    if (!accessToken) {
      throw new APIError('Not authenticated', 401, null, endpoint);
    }

    headers.Authorization = `Bearer ${accessToken}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include',
    signal: controller.signal,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const tryRefreshToken = async () => {
    const session = await getSession();
    const refreshToken = (session as any)?.refreshToken as string | undefined;
    if (!refreshToken) {
      return null;
    }

    try {
      const refreshResponse = await fetch(
        ensureTrailingSlash(`${API_BASE_URL}/auth/token/refresh`),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );

      if (!refreshResponse.ok) {
        return null;
      }

      const refreshData = await refreshResponse.json();
      if (refreshData?.access) {
        cachedAccessToken = refreshData.access;
        return cachedAccessToken;
      }
    } catch {
      return null;
    }

    return null;
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(timeout);

    if (response.status === 204 || response.status === 205) {
      return {} as T;
    }

    let data: any = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    // 🔒 401 = estado normal (sesión expirada / backend reiniciado)
    if (response.status === 401) {
      if (!isPublicEndpoint(endpoint) && canRetry) {
        const newAccessToken = await tryRefreshToken();
        if (newAccessToken) {
          return request<T>(endpoint, options, false);
        }
        cachedAccessToken = null;
      }

      throw new APIError('Unauthorized', 401, data, url);
    }

    if (!response.ok) {
      throw new APIError(
        `HTTP error ${response.status}`,
        response.status,
        data,
        url
      );
    }

    return data;
  } catch (error: any) {
    clearTimeout(timeout);

    // 🌐 Backend caído / timeout
    if (error.name === 'AbortError') {
      throw new APIError('Backend no disponible', 0, null, url);
    }

    if (error instanceof APIError) {
      throw error;
    }

    throw new APIError(
      error instanceof Error ? error.message : 'Unknown error',
      0,
      null,
      url
    );
  }
}

const api = {
  get: <T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ) => request<T>(endpoint, { method: 'GET', params }),

  post: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'POST', body }),

  put: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'PATCH', body }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};

export default api;
