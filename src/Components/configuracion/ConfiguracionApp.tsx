"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { getProfile, updateProfile } from "@/lib/api/users";
import type { UserProfile } from "@/types/api";

const ConfiguracionApp = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("cuenta");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: false,
    newsletter: true,
  });
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const tabs = [
    { id: "cuenta", label: "Cuenta", icon: "/setting.svg" },
    { id: "notificaciones", label: "Notificaciones", icon: "/setting.svg" },
    { id: "privacidad", label: "Privacidad", icon: "/setting.svg" },
    { id: "apariencia", label: "Apariencia", icon: "/setting.svg" },
  ];

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProfile();
      setProfile(data);
      setFormData({
        username: data.username || "",
        email: data.email || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el perfil');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const updated = await updateProfile(formData);
      setProfile(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-texInactivo">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchProfile}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-subprimary transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
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
                <div className="w-20 h-20 bg-categorico rounded-full flex items-center justify-center text-2xl font-bold overflow-hidden">
                  {profile?.avatar ? (
                    <Image 
                      src={profile.avatar} 
                      alt={profile.username || "Avatar"} 
                      width={80} 
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    getInitials(profile?.username || profile?.first_name)
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{profile?.first_name || profile?.username || "Usuario"}</h3>
                  <p className="text-texInactivo text-sm">{profile?.email}</p>
                  <button className="text-primary text-sm mt-1 hover:underline">
                    Cambiar foto
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 text-red-400 p-4 rounded-xl">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-texInactivo mb-2">Nombre de usuario</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full bg-subdeep border border-categorico rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-texInactivo mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-subdeep border border-categorico rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                  />
                </div>
                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-subprimary transition disabled:opacity-50"
                >
                  {isSaving ? "Guardando..." : "Guardar cambios"}
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
            </div>
          )}

          {activeTab === "privacidad" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Configuración de privacidad</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-subdeep rounded-xl">
                  <h3 className="font-medium mb-2">Visibilidad del perfil</h3>
                  <select className="w-full bg-deep border border-categorico rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none">
                    <option>Público</option>
                    <option>Solo amigos</option>
                    <option>Privado</option>
                  </select>
                </div>

                <div className="p-4 bg-subdeep rounded-xl">
                  <h3 className="font-medium mb-2">Historial de juegos</h3>
                  <select className="w-full bg-deep border border-categorico rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none">
                    <option>Visible para todos</option>
                    <option>Solo amigos</option>
                    <option>Oculto</option>
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
                    <button className="w-24 h-16 bg-dark rounded-xl border-2 border-primary flex items-center justify-center">
                      <span className="text-sm">Oscuro</span>
                    </button>
                    <button className="w-24 h-16 bg-gray-200 rounded-xl border-2 border-transparent flex items-center justify-center opacity-50">
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
                  <select className="w-full bg-deep border border-categorico rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none">
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
