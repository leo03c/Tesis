"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { settingsService } from "@/services";
import type { AccountSettings, NotificationSettings, PrivacySettings, AppearanceSettings } from "@/types";

// Fallback data for when API is unavailable
const fallbackAccount: AccountSettings = {
  id: 1,
  username: "JuanDev",
  email: "juan@cosmox.com",
  initials: "JD",
  fullName: "Juan Desarrollador",
};

const fallbackNotifications: NotificationSettings = {
  email: true,
  push: true,
  updates: false,
  newsletter: true,
};

const fallbackPrivacy: PrivacySettings = {
  profileVisibility: "public",
  gameHistory: "visible",
};

const fallbackAppearance: AppearanceSettings = {
  theme: "dark",
  accentColor: "blue",
  language: "Español",
};

const ConfiguracionApp = () => {
  const [activeTab, setActiveTab] = useState("cuenta");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Settings state
  const [account, setAccount] = useState<AccountSettings>(fallbackAccount);
  const [notifications, setNotifications] = useState<NotificationSettings>(fallbackNotifications);
  const [privacy, setPrivacy] = useState<PrivacySettings>(fallbackPrivacy);
  const [appearance, setAppearance] = useState<AppearanceSettings>(fallbackAppearance);

  // Form state for account
  const [formUsername, setFormUsername] = useState("");
  const [formEmail, setFormEmail] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const settings = await settingsService.getAllSettings();
        setAccount(settings.account);
        setNotifications(settings.notifications);
        setPrivacy(settings.privacy);
        setAppearance(settings.appearance);
        setFormUsername(settings.account.username);
        setFormEmail(settings.account.email);
        setError(null);
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('No se pudieron cargar los ajustes');
        setFormUsername(fallbackAccount.username);
        setFormEmail(fallbackAccount.email);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveAccount = async () => {
    try {
      setSaving(true);
      const updatedAccount = await settingsService.updateAccountSettings({
        username: formUsername,
        email: formEmail,
      });
      setAccount(updatedAccount);
      setError(null);
    } catch (err) {
      console.error('Error saving account settings:', err);
      setError('No se pudieron guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleNotification = async (key: keyof NotificationSettings) => {
    const newNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifications);
    try {
      await settingsService.updateNotificationSettings(newNotifications);
    } catch (err) {
      console.error('Error updating notification settings:', err);
      // Revert on error
      setNotifications(notifications);
    }
  };

  const handlePrivacyChange = async (key: keyof PrivacySettings, value: string) => {
    const newPrivacy = { ...privacy, [key]: value } as PrivacySettings;
    setPrivacy(newPrivacy);
    try {
      await settingsService.updatePrivacySettings(newPrivacy);
    } catch (err) {
      console.error('Error updating privacy settings:', err);
      // Revert on error
      setPrivacy(privacy);
    }
  };

  const tabs = [
    { id: "cuenta", label: "Cuenta", icon: "/setting.svg" },
    { id: "notificaciones", label: "Notificaciones", icon: "/setting.svg" },
    { id: "privacidad", label: "Privacidad", icon: "/setting.svg" },
    { id: "apariencia", label: "Apariencia", icon: "/setting.svg" },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-texInactivo">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configuración</h1>
        <p className="text-texInactivo">Personaliza tu experiencia en CosmoX</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-deep rounded-2xl p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "text-texInactivo hover:bg-subdeep hover:text-white"
                }`}
              >
                <Image src={tab.icon} alt={tab.label} width={20} height={20} className="opacity-70" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-deep rounded-2xl p-6">
          {activeTab === "cuenta" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Información de la cuenta</h2>
              
              <div className="flex items-center gap-4 p-4 bg-subdeep rounded-xl">
                <div className="w-20 h-20 bg-categorico rounded-full flex items-center justify-center text-2xl font-bold">
                  {account.initials}
                </div>
                <div>
                  <h3 className="font-semibold">{account.fullName}</h3>
                  <p className="text-texInactivo text-sm">{account.email}</p>
                  <button className="text-primary text-sm mt-1 hover:underline">
                    Cambiar foto
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-texInactivo mb-2">Nombre de usuario</label>
                  <input
                    type="text"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    className="w-full bg-subdeep border border-categorico rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-texInactivo mb-2">Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-subdeep border border-categorico rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                  />
                </div>
                <button 
                  onClick={handleSaveAccount}
                  disabled={saving}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-subprimary transition disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "notificaciones" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Preferencias de notificaciones</h2>
              
              <div className="space-y-4">
                {[
                  { key: "email" as const, label: "Notificaciones por email", desc: "Recibe actualizaciones importantes en tu correo" },
                  { key: "push" as const, label: "Notificaciones push", desc: "Alertas en tiempo real en tu dispositivo" },
                  { key: "updates" as const, label: "Actualizaciones de juegos", desc: "Notificaciones cuando tus juegos se actualicen" },
                  { key: "newsletter" as const, label: "Newsletter", desc: "Ofertas y novedades semanales" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-subdeep rounded-xl">
                    <div>
                      <h3 className="font-medium">{item.label}</h3>
                      <p className="text-texInactivo text-sm">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleToggleNotification(item.key)}
                      className={`w-12 h-6 rounded-full transition ${
                        notifications[item.key] ? "bg-primary" : "bg-categorico"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition transform ${
                          notifications[item.key] ? "translate-x-6" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "privacidad" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Configuración de privacidad</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-subdeep rounded-xl">
                  <h3 className="font-medium mb-2">Visibilidad del perfil</h3>
                  <select 
                    value={privacy.profileVisibility}
                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                    className="w-full bg-deep border border-categorico rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                  >
                    <option value="public">Público</option>
                    <option value="friends">Solo amigos</option>
                    <option value="private">Privado</option>
                  </select>
                </div>

                <div className="p-4 bg-subdeep rounded-xl">
                  <h3 className="font-medium mb-2">Historial de juegos</h3>
                  <select 
                    value={privacy.gameHistory}
                    onChange={(e) => handlePrivacyChange('gameHistory', e.target.value)}
                    className="w-full bg-deep border border-categorico rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                  >
                    <option value="visible">Visible para todos</option>
                    <option value="friends">Solo amigos</option>
                    <option value="hidden">Oculto</option>
                  </select>
                </div>

                <button className="text-red-500 hover:text-red-400 text-sm">
                  Eliminar cuenta permanentemente
                </button>
              </div>
            </div>
          )}

          {activeTab === "apariencia" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Personalización</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-subdeep rounded-xl">
                  <h3 className="font-medium mb-4">Tema</h3>
                  <div className="flex gap-4">
                    <button className={`w-24 h-16 bg-dark rounded-xl border-2 ${appearance.theme === 'dark' ? 'border-primary' : 'border-transparent'} flex items-center justify-center`}>
                      <span className="text-sm">Oscuro</span>
                    </button>
                    <button className={`w-24 h-16 bg-gray-200 rounded-xl border-2 ${appearance.theme === 'light' ? 'border-primary' : 'border-transparent'} flex items-center justify-center opacity-50`}>
                      <span className="text-sm text-gray-800">Claro</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-subdeep rounded-xl">
                  <h3 className="font-medium mb-4">Color de acento</h3>
                  <div className="flex gap-3">
                    {["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-red-500", "bg-yellow-500"].map((color, i) => (
                      <button
                        key={i}
                        className={`w-8 h-8 ${color} rounded-full ${i === 0 ? "ring-2 ring-white" : ""}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-subdeep rounded-xl">
                  <h3 className="font-medium mb-2">Idioma</h3>
                  <select 
                    value={appearance.language}
                    className="w-full bg-deep border border-categorico rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                  >
                    <option>Español</option>
                    <option>English</option>
                    <option>Português</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionApp;
