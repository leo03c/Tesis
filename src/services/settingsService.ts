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
  profile?: {
    nombre_estudio?: string;
    sitio_web?: string;
    descripcion?: string;
    es_desarrollador?: boolean;
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

const settingsService = {
  getSettings,
  updateSettings,
  updateAvatar,
  getNotificationSettings,
  updateNotificationSettings,
};

export default settingsService;
