"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";
import { signIn } from "next-auth/react";
import settingsService, {
  NotificationSettings,
  PrivacySettings,
  AppearanceSettings,
} from "@/services/settingsService";

const ConfiguracionApp = () => {
  const { user, isAuthenticated } = useUser();
  const [activeTab, setActiveTab] = useState("cuenta");
  
  // Form states
  const [accountForm, setAccountForm] = useState({
    name: "",
    email: "",
  });
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    updates: false,
    newsletter: true,
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profile_visibility: 'public',
    game_history_visibility: 'public',
  });

  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: 'dark',
    accent_color: '#3B82F6',
    language: 'es',
  });

  // Loading and message states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [slowLoading, setSlowLoading] = useState(false);

  // Load settings when component mounts or user changes
  useEffect(() => {
    if (isAuthenticated) {
      loadSettings();
    }
  }, [isAuthenticated]);

  // Update account form when user data changes
  useEffect(() => {
    if (user) {
      setAccountForm({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const loadSettings = async () => {
    setLoading(true);
    setSlowLoading(false);
    
    const slowLoadingTimer = setTimeout(() => {
      setSlowLoading(true);
    }, 3000);

    try {
      // Load all settings in parallel
      const [notifSettings, privacySettings, appearanceSettings] = await Promise.allSettled([
        settingsService.getNotificationSettings(),
        settingsService.getPrivacySettings(),
        settingsService.getAppearanceSettings(),
      ]);

      if (notifSettings.status === 'fulfilled') {
        setNotifications(notifSettings.value);
      }
      if (privacySettings.status === 'fulfilled') {
        setPrivacy(privacySettings.value);
      }
      if (appearanceSettings.status === 'fulfilled') {
        setAppearance(appearanceSettings.value);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      showMessage('error', 'No se pudieron cargar algunas configuraciones');
    } finally {
      clearTimeout(slowLoadingTimer);
      setLoading(false);
      setSlowLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const saveAccountSettings = async () => {
    setSaving(true);
    try {
      await settingsService.updateSettings({
        name: accountForm.name,
        email: accountForm.email,
      });
      showMessage('success', 'Información de cuenta actualizada correctamente');
    } catch (error: any) {
      console.error('Error saving account settings:', error);
      showMessage('error', error.message || 'Error al guardar la información');
    } finally {
      setSaving(false);
    }
  };

  const saveNotificationSettings = async () => {
    setSaving(true);
    try {
      await settingsService.updateNotificationSettings(notifications);
      showMessage('success', 'Preferencias de notificaciones guardadas');
    } catch (error: any) {
      console.error('Error saving notification settings:', error);
      showMessage('error', error.message || 'Error al guardar las notificaciones');
    } finally {
      setSaving(false);
    }
  };

  const savePrivacySettings = async () => {
    setSaving(true);
    try {
      await settingsService.updatePrivacySettings(privacy);
      showMessage('success', 'Configuración de privacidad actualizada');
    } catch (error: any) {
      console.error('Error saving privacy settings:', error);
      showMessage('error', error.message || 'Error al guardar la privacidad');
    } finally {
      setSaving(false);
    }
  };

  const saveAppearanceSettings = async () => {
    setSaving(true);
    try {
      await settingsService.updateAppearanceSettings(appearance);
      showMessage('success', 'Configuración de apariencia guardada');
    } catch (error: any) {
      console.error('Error saving appearance settings:', error);
      showMessage('error', error.message || 'Error al guardar la apariencia');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "cuenta", label: "Cuenta", icon: "/setting.svg" },
    { id: "notificaciones", label: "Notificaciones", icon: "/setting.svg" },
    { id: "privacidad", label: "Privacidad", icon: "/setting.svg" },
    { id: "apariencia", label: "Apariencia", icon: "/setting.svg" },
  ];

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configuración</h1>
        <p className="text-texInactivo">Personaliza tu experiencia en CosmoX</p>
      </div>

      {/* Message notification */}
      {message && (
        <div className={`mb-4 p-4 rounded-xl ${
          message.type === 'success' ? 'bg-green-900/20 border border-green-600 text-green-400' : 'bg-red-900/20 border border-red-600 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Slow loading warning */}
      {loading && slowLoading && (
        <div className="mb-4 p-4 rounded-xl bg-yellow-900/20 border border-yellow-600">
          <p className="text-yellow-400">La conexión está tardando más de lo esperado. Mostrando datos disponibles...</p>
        </div>
      )}

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
              
              {!isAuthenticated ? (
                <div className="p-8 bg-subdeep rounded-xl text-center">
                  <p className="text-texInactivo mb-4">Debes iniciar sesión para ver la información de tu cuenta</p>
                  <button 
                    onClick={() => signIn()}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-subprimary transition"
                  >
                    Iniciar sesión
                  </button>
                </div>
              ) : (
                <>
                  {loading && (
                    <div className="flex items-center justify-center p-8">
                      <div className="w-8 h-8 border-2 border-t-transparent border-primary rounded-full animate-spin" />
                      <span className="ml-3 text-texInactivo">Cargando configuración...</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 p-4 bg-subdeep rounded-xl">
                    <div className="w-20 h-20 bg-categorico rounded-full flex items-center justify-center text-2xl font-bold">
                      {accountForm.name?.[0]?.toUpperCase() ?? accountForm.email?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div>
                      <h3 className="font-semibold">{accountForm.name || 'Usuario'}</h3>
                      <p className="text-texInactivo text-sm">{accountForm.email || 'Sin email'}</p>
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
                        value={accountForm.name}
                        onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                        className="w-full bg-subdeep border border-categorico rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-texInactivo mb-2">Email</label>
                      <input
                        type="email"
                        value={accountForm.email}
                        onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                        className="w-full bg-subdeep border border-categorico rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                      />
                    </div>
                    <button 
                      onClick={saveAccountSettings}
                      disabled={saving}
                      className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-subprimary transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {saving && <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />}
                      {saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "notificaciones" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Preferencias de notificaciones</h2>
              
              {loading && (
                <div className="flex items-center justify-center p-8">
                  <div className="w-8 h-8 border-2 border-t-transparent border-primary rounded-full animate-spin" />
                  <span className="ml-3 text-texInactivo">Cargando configuración...</span>
                </div>
              )}
              
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
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
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
              
              <button 
                onClick={saveNotificationSettings}
                disabled={saving}
                className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-subprimary transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving && <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />}
                {saving ? 'Guardando...' : 'Guardar preferencias'}
              </button>
            </div>
          )}

          {activeTab === "privacidad" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Configuración de privacidad</h2>
              
              {loading && (
                <div className="flex items-center justify-center p-8">
                  <div className="w-8 h-8 border-2 border-t-transparent border-primary rounded-full animate-spin" />
                  <span className="ml-3 text-texInactivo">Cargando configuración...</span>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="p-4 bg-subdeep rounded-xl">
                  <h3 className="font-medium mb-2">Visibilidad del perfil</h3>
                  <select 
                    value={privacy.profile_visibility}
                    onChange={(e) => setPrivacy({ ...privacy, profile_visibility: e.target.value as any })}
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
                    value={privacy.game_history_visibility}
                    onChange={(e) => setPrivacy({ ...privacy, game_history_visibility: e.target.value as any })}
                    className="w-full bg-deep border border-categorico rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                  >
                    <option value="public">Visible para todos</option>
                    <option value="friends">Solo amigos</option>
                    <option value="hidden">Oculto</option>
                  </select>
                </div>

                <button 
                  onClick={savePrivacySettings}
                  disabled={saving}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-subprimary transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving && <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />}
                  {saving ? 'Guardando...' : 'Guardar configuración'}
                </button>

                <button className="text-red-500 hover:text-red-400 text-sm">
                  Eliminar cuenta permanentemente
                </button>
              </div>
            </div>
          )}

          {activeTab === "apariencia" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Personalización</h2>
              
              {loading && (
                <div className="flex items-center justify-center p-8">
                  <div className="w-8 h-8 border-2 border-t-transparent border-primary rounded-full animate-spin" />
                  <span className="ml-3 text-texInactivo">Cargando configuración...</span>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="p-4 bg-subdeep rounded-xl">
                  <h3 className="font-medium mb-4">Tema</h3>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setAppearance({ ...appearance, theme: 'dark' })}
                      className={`w-24 h-16 bg-dark rounded-xl border-2 ${appearance.theme === 'dark' ? 'border-primary' : 'border-transparent'} flex items-center justify-center`}
                    >
                      <span className="text-sm">Oscuro</span>
                    </button>
                    <button 
                      onClick={() => setAppearance({ ...appearance, theme: 'light' })}
                      className={`w-24 h-16 bg-gray-200 rounded-xl border-2 ${appearance.theme === 'light' ? 'border-primary' : 'border-transparent'} flex items-center justify-center opacity-50`}
                    >
                      <span className="text-sm text-gray-800">Claro</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-subdeep rounded-xl">
                  <h3 className="font-medium mb-4">Color de acento</h3>
                  <div className="flex gap-3">
                    {[
                      { color: "bg-blue-500", value: "#3B82F6" },
                      { color: "bg-purple-500", value: "#A855F7" },
                      { color: "bg-green-500", value: "#22C55E" },
                      { color: "bg-red-500", value: "#EF4444" },
                      { color: "bg-yellow-500", value: "#EAB308" }
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => setAppearance({ ...appearance, accent_color: item.value })}
                        className={`w-8 h-8 ${item.color} rounded-full ${appearance.accent_color === item.value ? "ring-2 ring-white" : ""}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-subdeep rounded-xl">
                  <h3 className="font-medium mb-2">Idioma</h3>
                  <select 
                    value={appearance.language}
                    onChange={(e) => setAppearance({ ...appearance, language: e.target.value })}
                    className="w-full bg-deep border border-categorico rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="pt">Português</option>
                  </select>
                </div>
                
                <button 
                  onClick={saveAppearanceSettings}
                  disabled={saving}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-subprimary transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving && <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />}
                  {saving ? 'Guardando...' : 'Guardar preferencias'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionApp;
