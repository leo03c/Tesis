/**
 * Settings Service - API endpoints for user settings
 * Backend base: /api/users/me/
 * 
 * NOTE: Frontend was calling /api/settings which should be /api/users/me/
 */
import api from './api';

export interface UserSettings {
  id: number;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
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
 * Backend endpoint: /api/users/me/
 */
export const getSettings = () => 
  api.get<UserSettings>('/users/me');

/**
 * Update current user's profile/settings
 * Backend endpoint: /api/users/me/
 */
export const updateSettings = (data: Partial<UserSettings>) => 
  api.patch<UserSettings>('/users/me', data);

/**
 * Get notification settings
 * Backend endpoint: /api/users/me/notifications/
 */
export const getNotificationSettings = () => 
  api.get<NotificationSettings>('/users/me/notifications');

/**
 * Update notification settings
 * Backend endpoint: /api/users/me/notifications/
 */
export const updateNotificationSettings = (data: Partial<NotificationSettings>) => 
  api.patch<NotificationSettings>('/users/me/notifications', data);

/**
 * Get privacy settings
 * Backend endpoint: /api/users/me/privacy/
 */
export const getPrivacySettings = () => 
  api.get<PrivacySettings>('/users/me/privacy');

/**
 * Update privacy settings
 * Backend endpoint: /api/users/me/privacy/
 */
export const updatePrivacySettings = (data: Partial<PrivacySettings>) => 
  api.patch<PrivacySettings>('/users/me/privacy', data);

/**
 * Get appearance settings
 * Backend endpoint: /api/users/me/appearance/
 */
export const getAppearanceSettings = () => 
  api.get<AppearanceSettings>('/users/me/appearance');

/**
 * Update appearance settings
 * Backend endpoint: /api/users/me/appearance/
 */
export const updateAppearanceSettings = (data: Partial<AppearanceSettings>) => 
  api.patch<AppearanceSettings>('/users/me/appearance', data);

/**
 * Change password
 * Backend endpoint: /api/users/me/password/
 */
export const changePassword = (oldPassword: string, newPassword: string) => 
  api.post<{ success: boolean }>('/users/me/password', { 
    old_password: oldPassword, 
    new_password: newPassword 
  });

/**
 * Delete account
 * Backend endpoint: /api/users/me/
 */
export const deleteAccount = () => 
  api.delete<void>('/users/me');

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
