import api, { APIError } from './api';

const ensureSlash = (value: string) => {
  const withLeading = value.startsWith('/') ? value : `/${value}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
};

const ADMIN_USERS_ENDPOINT =
  process.env.NEXT_PUBLIC_ADMIN_USERS_ENDPOINT || '/users/admin/users';
const USERS_ENDPOINT = process.env.NEXT_PUBLIC_USERS_ENDPOINT || '/users';
const ADMIN_USERS_LIST_ENDPOINT =
  process.env.NEXT_PUBLIC_ADMIN_USERS_LIST_ENDPOINT || '/users/admin/list';
const ADMIN_USERS_DETAIL_BASE =
  process.env.NEXT_PUBLIC_ADMIN_USERS_DETAIL_BASE || '/users/admin';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  profile?: {
    rol?: string;
    es_administrador?: boolean;
  };
}

const normalizeList = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === 'object' && Array.isArray((payload as any).results)) {
    return (payload as any).results as T[];
  }
  return [];
};

const tryEndpoints = async <T>(
  handlers: Array<() => Promise<T>>
): Promise<T> => {
  let lastError: unknown = null;

  for (const handler of handlers) {
    try {
      return await handler();
    } catch (error) {
      lastError = error;
      if (error instanceof APIError && error.status === 404) {
        continue;
      }
      if (error instanceof APIError && error.status === 405) {
        continue;
      }
      if (error instanceof APIError && error.status === 403) {
        continue;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Operacion de admin no disponible');
};

export const deleteGameBySlug = (slug: string) =>
  api.delete(`/games/games/${slug}/`);

export const deleteProjectById = (id: number) =>
  api.delete(`/catalog/${id}/`);

export const deleteReviewById = (id: number) =>
  api.delete(`/reviews/resenas/${id}/`);

export const deleteByEndpoint = (endpoint: string) =>
  api.delete(ensureSlash(endpoint));

export const listAdminUsers = async (): Promise<AdminUser[]> => {
  const data = await tryEndpoints<AdminUser[] | { results: AdminUser[] }>([
    () => api.get(ensureSlash(ADMIN_USERS_LIST_ENDPOINT)),
    () => api.get(ensureSlash(ADMIN_USERS_ENDPOINT)),
    () => api.get(ensureSlash(USERS_ENDPOINT)),
  ]);

  return normalizeList<AdminUser>(data);
};

export const deleteUserById = async (id: number) =>
  tryEndpoints<unknown>([
    () => api.delete(`${ensureSlash(ADMIN_USERS_DETAIL_BASE)}${id}/`),
    () => api.delete(`${ensureSlash(ADMIN_USERS_ENDPOINT)}${id}/`),
    () => api.delete(`${ensureSlash(USERS_ENDPOINT)}${id}/`),
  ]);

export const updateUserRoleById = async (
  id: number,
  role: 'BASICO' | 'DEV' | 'ADMIN'
) =>
  tryEndpoints<unknown>([
    () => api.put(`${ensureSlash(ADMIN_USERS_DETAIL_BASE)}${id}/role/`, { rol: role }),
    () => api.put(`${ensureSlash(ADMIN_USERS_ENDPOINT)}${id}/role/`, { rol: role }),
    () =>
      api.patch(`${ensureSlash(USERS_ENDPOINT)}${id}/`, {
        profile: { rol: role },
        es_administrador: role === 'ADMIN',
        is_staff: role === 'ADMIN',
        is_superuser: role === 'ADMIN',
      }),
  ]);

export const revokeAdminRoleByUserId = async (id: number) =>
  updateUserRoleById(id, 'BASICO');

const adminService = {
  deleteGameBySlug,
  deleteProjectById,
  deleteReviewById,
  deleteByEndpoint,
  listAdminUsers,
  deleteUserById,
  updateUserRoleById,
  revokeAdminRoleByUserId,
};

export default adminService;
