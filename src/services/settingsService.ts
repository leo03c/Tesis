/**
 * Settings Service - API endpoints for user settings
 * Backend base: /api/users/me/
 */
import api from './api';

export interface UserSettings {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  profile?: {
    nombre_estudio?: string;
    sitio_web?: string;
    descripcion?: string;
    rol?: 'BASICO' | 'DEV' | 'ADMIN' | string;
    es_desarrollador?: boolean;
    es_administrador?: boolean;
    verificado?: boolean;
  };
}

/**
 * Obtener perfil del usuario autenticado
 * GET /api/users/me/
 */
export const getSettings = () => 
  api.get<UserSettings>('/users/me/');

/**
 * Actualizar perfil del usuario autenticado
 * PATCH /api/users/me/
 * Se puede actualizar first_name, last_name y avatar
 */
export const updateSettings = (data: Partial<UserSettings>) => 
  api.patch<UserSettings>('/users/me/', data);

/**
 * Actualizar avatar (subida de archivo)
 */
export const updateAvatar = (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);

  return api.patch<UserSettings>('/users/me/', formData);
};

/**
 * NOTA: Notificaciones, privacidad y apariencia aún no están en backend
 * Se mantienen en localStorage
 */

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  updates: boolean;
  newsletter: boolean;
}

export interface DeveloperRequest {
  id: number;
  userId: number;
  username: string;
  email: string;
  reason?: string;
  status: 'pendiente' | 'aprobada' | 'rechazada';
  createdAt: string;
}

const DEV_REQUESTS_KEY = 'developer_role_requests';
const DEV_REQUESTS_ENDPOINT =
  process.env.NEXT_PUBLIC_DEV_REQUESTS_ENDPOINT || '/users/developer-request';
const ADMIN_DEV_REQUESTS_ENDPOINT =
  process.env.NEXT_PUBLIC_ADMIN_DEV_REQUESTS_ENDPOINT || '/users/admin/developer-requests';

type BackendDeveloperRequest = {
  id: number;
  user?: number;
  user_id?: number;
  user_email?: string;
  user_name?: string;
  motivo?: string;
  estado?: string;
  created_at?: string;
  status?: string;
  createdAt?: string;
  userId?: number;
  username?: string;
  email?: string;
  reason?: string;
};

const normalizeList = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === 'object' && Array.isArray((payload as any).results)) {
    return (payload as any).results as T[];
  }
  return [];
};

const normalizeRequestStatus = (value: string | undefined): DeveloperRequest['status'] => {
  const status = String(value ?? '').toUpperCase();
  if (status === 'APPROVED' || status === 'ACCEPTED' || status === 'APROBADA') {
    return 'aprobada';
  }
  if (status === 'REJECTED' || status === 'RECHAZADA') {
    return 'rechazada';
  }
  return 'pendiente';
};

const mapBackendRequest = (request: BackendDeveloperRequest): DeveloperRequest => ({
  id: request.id,
  userId: request.user_id ?? request.user ?? request.userId ?? 0,
  username: request.user_name ?? request.username ?? 'Usuario',
  email: request.user_email ?? request.email ?? '',
  reason: request.motivo ?? request.reason,
  status: normalizeRequestStatus(request.estado ?? request.status),
  createdAt: request.created_at ?? request.createdAt ?? new Date().toISOString(),
});

const readDeveloperRequests = (): DeveloperRequest[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(DEV_REQUESTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeDeveloperRequests = (requests: DeveloperRequest[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DEV_REQUESTS_KEY, JSON.stringify(requests));
};

export const getNotificationSettings = (): Promise<NotificationSettings> => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('notification_settings');
    if (stored) return Promise.resolve(JSON.parse(stored));
  }
  return Promise.resolve({ email: true, push: true, updates: true, newsletter: false });
};

export const updateNotificationSettings = (data: Partial<NotificationSettings>): Promise<NotificationSettings> => {
  if (typeof window !== 'undefined') {
    const current = JSON.parse(localStorage.getItem('notification_settings') || '{}');
    const updated = { ...current, ...data };
    localStorage.setItem('notification_settings', JSON.stringify(updated));
    return Promise.resolve(updated);
  }
  return Promise.resolve(data as NotificationSettings);
};

export const getDeveloperRequests = async (): Promise<DeveloperRequest[]> => {
  try {
    const response = await api.get<BackendDeveloperRequest[] | { results: BackendDeveloperRequest[] }>(
      DEV_REQUESTS_ENDPOINT
    );
    const requests = normalizeList<BackendDeveloperRequest>(response).map(mapBackendRequest);
    return requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    const requests = readDeveloperRequests();
    return requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
};

export const getAdminDeveloperRequests = async (): Promise<DeveloperRequest[]> => {
  const response = await api.get<BackendDeveloperRequest[] | { results: BackendDeveloperRequest[] }>(
    ADMIN_DEV_REQUESTS_ENDPOINT
  );

  const requests = normalizeList<BackendDeveloperRequest>(response).map(mapBackendRequest);
  return requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const createDeveloperRequest = async (input: {
  userId: number;
  username: string;
  email: string;
  reason: string;
}): Promise<DeveloperRequest> => {
  try {
    const created = await api.post<DeveloperRequest | BackendDeveloperRequest>(DEV_REQUESTS_ENDPOINT, {
      userId: input.userId,
      username: input.username,
      email: input.email,
      motivo: input.reason,
      reason: input.reason,
    });

    if ('created_at' in (created as any) || 'estado' in (created as any)) {
      return mapBackendRequest(created as BackendDeveloperRequest);
    }

    return created as DeveloperRequest;
  } catch {
    // Fallback local si backend aun no expone endpoint.
  }

  const requests = readDeveloperRequests();
  const existing = requests.find(
    (request) => request.userId === input.userId && request.status === 'pendiente'
  );

  if (existing) {
    return existing;
  }

  const newRequest: DeveloperRequest = {
    id: Date.now(),
    userId: input.userId,
    username: input.username,
    email: input.email,
    reason: input.reason,
    status: 'pendiente',
    createdAt: new Date().toISOString(),
  };

  writeDeveloperRequests([newRequest, ...requests]);
  return newRequest;
};

export const updateDeveloperRequestStatus = async (
  requestId: number,
  status: 'aprobada' | 'rechazada'
): Promise<DeveloperRequest | null> => {
  const accion = status === 'aprobada' ? 'accept' : 'reject';
  const updated = await api.put<BackendDeveloperRequest>(
    `${ADMIN_DEV_REQUESTS_ENDPOINT}/${requestId}`,
    { accion }
  );

  return mapBackendRequest(updated);
};

const settingsService = {
  getSettings,
  updateSettings,
  updateAvatar,
  getNotificationSettings,
  updateNotificationSettings,
  getDeveloperRequests,
  getAdminDeveloperRequests,
  createDeveloperRequest,
  updateDeveloperRequestStatus,
};

export default settingsService;
