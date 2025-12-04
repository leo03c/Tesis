// Settings service - User settings operations

import { api, API_BASE_URL, getAuthToken } from './api';
import type {
  AccountSettings,
  NotificationSettings,
  PrivacySettings,
  AppearanceSettings,
  UpdateAccountRequest,
  UpdatePasswordRequest,
} from '@/types';

export interface AllSettings {
  account: AccountSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  appearance: AppearanceSettings;
}

export const settingsService = {
  // Get all settings
  async getAllSettings(): Promise<AllSettings> {
    return api.get<AllSettings>('/settings');
  },

  // Account settings
  async getAccountSettings(): Promise<AccountSettings> {
    return api.get<AccountSettings>('/settings/account');
  },

  async updateAccountSettings(data: UpdateAccountRequest): Promise<AccountSettings> {
    return api.put<AccountSettings>('/settings/account', data);
  },

  async updatePassword(data: UpdatePasswordRequest): Promise<void> {
    return api.put<void>('/settings/account/password', data);
  },

  async updateAvatar(avatarFile: File): Promise<AccountSettings> {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_BASE_URL}/settings/account/avatar`,
      {
        method: 'PUT',
        headers,
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update avatar');
    }

    return response.json();
  },

  async deleteAccount(): Promise<void> {
    return api.delete<void>('/settings/account');
  },

  // Notification settings
  async getNotificationSettings(): Promise<NotificationSettings> {
    return api.get<NotificationSettings>('/settings/notifications');
  },

  async updateNotificationSettings(data: NotificationSettings): Promise<NotificationSettings> {
    return api.put<NotificationSettings>('/settings/notifications', data);
  },

  // Privacy settings
  async getPrivacySettings(): Promise<PrivacySettings> {
    return api.get<PrivacySettings>('/settings/privacy');
  },

  async updatePrivacySettings(data: PrivacySettings): Promise<PrivacySettings> {
    return api.put<PrivacySettings>('/settings/privacy', data);
  },

  // Appearance settings
  async getAppearanceSettings(): Promise<AppearanceSettings> {
    return api.get<AppearanceSettings>('/settings/appearance');
  },

  async updateAppearanceSettings(data: AppearanceSettings): Promise<AppearanceSettings> {
    return api.put<AppearanceSettings>('/settings/appearance', data);
  },
};

export default settingsService;
