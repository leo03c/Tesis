/**
 * Settings Service - API endpoints for user settings
 * Backend base: /api/users/profile/
 * 
 * NOTE: Backend currently only has /api/users/profile/ endpoint.
 * Settings like notifications, privacy, and appearance are not yet implemented separately.
 */
import api from './api';

export interface UserSettings {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  bio?: string;
  fecha_nacimiento?: string;
  pais?: string;
  profile?: {
    nombre_estudio?: string;
    sitio_web?: string;
    descripcion?: string;
    es_desarrollador?: boolean;
    verificado?: boolean;
  };
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  updates: boolean;
  newsletter: boolean;
}

export interface PrivacySettings {
  profile_visibility: 'public' | 'friends' | 'private';
  game_history_visibility: 'public' | 'friends' | 'hidden';
}

export interface AppearanceSettings {
  theme: 'dark' | 'light';
  accent_color: string;
  language: string;
}

/**
 * Get current user's profile/settings
 * Backend endpoint: /api/users/profile/
 */
export const getSettings = () => 
  api.get<UserSettings>('/users/profile');

/**
 * Update current user's profile/settings
 * Backend endpoint: /api/users/profile/
 */
export const updateSettings = (data: Partial<UserSettings>) => 
  api.patch<UserSettings>('/users/profile', data);

/**
 * Get notification settings
 * NOTE: This endpoint is not yet implemented in the backend.
 * Settings will be stored locally until backend implementation is ready.
 */
export const getNotificationSettings = (): Promise<NotificationSettings> => {
  // Return default settings from localStorage or defaults
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('notification_settings');
    if (stored) {
      return Promise.resolve(JSON.parse(stored));
    }
  }
  return Promise.resolve({
    email: true,
    push: true,
    updates: true,
    newsletter: false,
  });
};

/**
 * Update notification settings
 * NOTE: This endpoint is not yet implemented in the backend.
 * Settings will be stored locally until backend implementation is ready.
 */
export const updateNotificationSettings = (data: Partial<NotificationSettings>): Promise<NotificationSettings> => {
  if (typeof window !== 'undefined') {
    const current = JSON.parse(localStorage.getItem('notification_settings') || '{}');
    const updated = { ...current, ...data };
    localStorage.setItem('notification_settings', JSON.stringify(updated));
    return Promise.resolve(updated);
  }
  return Promise.resolve(data as NotificationSettings);
};

/**
 * Get privacy settings
 * NOTE: This endpoint is not yet implemented in the backend.
 * Settings will be stored locally until backend implementation is ready.
 */
export const getPrivacySettings = (): Promise<PrivacySettings> => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('privacy_settings');
    if (stored) {
      return Promise.resolve(JSON.parse(stored));
    }
  }
  return Promise.resolve({
    profile_visibility: 'public',
    game_history_visibility: 'public',
  });
};

/**
 * Update privacy settings
 * NOTE: This endpoint is not yet implemented in the backend.
 * Settings will be stored locally until backend implementation is ready.
 */
export const updatePrivacySettings = (data: Partial<PrivacySettings>): Promise<PrivacySettings> => {
  if (typeof window !== 'undefined') {
    const current = JSON.parse(localStorage.getItem('privacy_settings') || '{}');
    const updated = { ...current, ...data };
    localStorage.setItem('privacy_settings', JSON.stringify(updated));
    return Promise.resolve(updated);
  }
  return Promise.resolve(data as PrivacySettings);
};

/**
 * Get appearance settings
 * NOTE: This endpoint is not yet implemented in the backend.
 * Settings will be stored locally until backend implementation is ready.
 */
export const getAppearanceSettings = (): Promise<AppearanceSettings> => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('appearance_settings');
    if (stored) {
      return Promise.resolve(JSON.parse(stored));
    }
  }
  return Promise.resolve({
    theme: 'dark',
    accent_color: '#2993FA',
    language: 'es',
  });
};

/**
 * Update appearance settings
 * NOTE: This endpoint is not yet implemented in the backend.
 * Settings will be stored locally until backend implementation is ready.
 */
export const updateAppearanceSettings = (data: Partial<AppearanceSettings>): Promise<AppearanceSettings> => {
  if (typeof window !== 'undefined') {
    const current = JSON.parse(localStorage.getItem('appearance_settings') || '{}');
    const updated = { ...current, ...data };
    localStorage.setItem('appearance_settings', JSON.stringify(updated));
    return Promise.resolve(updated);
  }
  return Promise.resolve(data as AppearanceSettings);
};

/**
 * Change password
 * NOTE: This endpoint is not yet implemented in the backend.
 */
export const changePassword = (oldPassword: string, newPassword: string): Promise<{ success: boolean }> => {
  console.warn('Password change endpoint not yet implemented in backend');
  return Promise.resolve({ success: false });
};

/**
 * Delete account
 * NOTE: This endpoint is not yet implemented in the backend.
 */
export const deleteAccount = (): Promise<void> => {
  console.warn('Account deletion endpoint not yet implemented in backend');
  return Promise.resolve();
};

const settingsService = {
  getSettings,
  updateSettings,
  getNotificationSettings,
  updateNotificationSettings,
  getPrivacySettings,
  updatePrivacySettings,
  getAppearanceSettings,
  updateAppearanceSettings,
  changePassword,
  deleteAccount,
};

export default settingsService;
