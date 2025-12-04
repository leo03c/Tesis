// Settings-related types

export interface AccountSettings {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  initials: string;
  fullName: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  updates: boolean;
  newsletter: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  gameHistory: 'visible' | 'friends' | 'hidden';
}

export interface AppearanceSettings {
  theme: 'dark' | 'light';
  accentColor: string;
  language: string;
}

export interface UpdateAccountRequest {
  username?: string;
  email?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateAvatarRequest {
  avatar: File | string;
}
