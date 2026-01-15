import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Lista de endpoints públicos que NO requieren autenticación
 */
const PUBLIC_ENDPOINTS = [
  '/games/games/freegames',
  '/games/games',
  '/games/tags',
  '/news',
];

/**
 * Verifica si un endpoint es público
 */
function isPublicEndpoint(endpoint: string): boolean {
  const cleanEndpoint = endpoint.split('?')[0].replace(/\/$/, '');
  
  return PUBLIC_ENDPOINTS.some(publicEndpoint => {
    const cleanPublic = publicEndpoint.replace(/\/$/, '');
    return cleanEndpoint === cleanPublic || cleanEndpoint.startsWith(cleanPublic + '/');
  });
}

/**
 * Asegura que la URL tenga trailing slash antes de query params
 */
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
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, params } = options;

  // Construir URL base
  let url = `${API_BASE_URL}${endpoint}`;

  // Agregar query params si existen
  if (params) {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    url = `${url}?${queryString}`;
  }

  // Asegurar trailing slash (DRF lo requiere)
  url = ensureTrailingSlash(url);

  // Headers base
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Agregar token de autenticación si el endpoint lo requiere
  if (!isPublicEndpoint(endpoint)) {
    try {
      const session = await getSession();
      console.log('[API] Session for auth:', session);
      console.log('[API] Session accessToken:', session?.accessToken);
      
      if (session?.accessToken) {
        headers['Authorization'] = `Bearer ${session.accessToken}`;
        console.log('[API] Token added to headers');
      } else {
        console.warn('[API] No access token found for authenticated endpoint:', endpoint);
      }
    } catch (error) {
      console.error('[API] Error getting session:', error);
    }
  } else {
    console.log('[API] Public endpoint, no auth required:', endpoint);
  }

  // Configuración de la petición
  const config: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    console.log(`[API] ${method} ${url}`);
    console.log('[API] Headers:', JSON.stringify(headers, null, 2));
    
    const response = await fetch(url, config);
    
    console.log('[API] Response status:', response.status);
    console.log('[API] Response headers:', response.headers);

    // Manejar respuesta sin contenido (204, 205)
    if (response.status === 204 || response.status === 205) {
      return {} as T;
    }

    // Intentar parsear JSON
    let data;
    try {
      data = await response.json();
      console.log('[API] Response data:', data);
    } catch {
      data = null;
      console.log('[API] No JSON data in response');
    }

    if (!response.ok) {
      // ⛔ 401 y 403 NO son errores de consola (son estados esperados)
      if (response.status !== 401 && response.status !== 403) {
        console.error('[API] Error response:', {
          status: response.status,
          statusText: response.statusText,
          url,
          data,
          hasAuthHeader: !!headers['Authorization']
        });
      }

      throw new APIError(
        `HTTP error! status: ${response.status}`,
        response.status,
        data,
        url
      );
    }

    return data;
  } catch (error) {
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
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean>) =>
    request<T>(endpoint, { method: 'GET', params }),
  
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
