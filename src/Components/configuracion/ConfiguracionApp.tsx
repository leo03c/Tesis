"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";
import { signIn } from "next-auth/react";
import { getUserProfile, updateUserProfile, updateUserAvatar } from "@/services/authService";

const ConfiguracionApp = () => {
  const { user, isAuthenticated, refreshSession } = useUser();
  const [activeTab, setActiveTab] = useState("cuenta");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    avatar: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: false,
    newsletter: true,
  });

  const tabs = [
    { id: "cuenta", label: "Cuenta", icon: "/setting.svg" },
    { id: "notificaciones", label: "Notificaciones", icon: "/setting.svg" },
    { id: "privacidad", label: "Privacidad", icon: "/setting.svg" },
  ];

  // Cargar perfil del usuario
  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated) return;

      try {
        const profile = await getUserProfile();
        setProfileData({
          username: profile.username,
          email: profile.email,
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          avatar: profile.avatar || "",
        });
      } catch (err: any) {
        console.error("Error loading profile:", err);
        setError("No se pudo cargar el perfil");
      }
    };

    loadProfile();
  }, [isAuthenticated]);

  // Manejar cambio de foto
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar los 5MB');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await updateUserAvatar(file);
      
      setProfileData(prev => ({ ...prev, avatar: data.avatar }));
      setSuccess('Foto actualizada correctamente');
      await refreshSession();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error uploading avatar:', err);
      setError(err.message || 'Error al cambiar la foto');
    } finally {
      setLoading(false);
    }
  };

  // Guardar cambios del perfil
  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUserProfile({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
      });
      
      setSuccess("Perfil actualizado correctamente");
      await refreshSession();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData({ ...profileData, [field]: value });
    setError(null);
    setSuccess(null);
  };

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
                  {/* Avatar */}
                  <div className="flex items-center gap-4 p-4 bg-subdeep rounded-xl">
                    <div className="relative">
                      {profileData.avatar ? (
                        <div className="w-20 h-20 rounded-full overflow-hidden relative">
                          <Image
                            src={profileData.avatar.startsWith('http') ? profileData.avatar : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${profileData.avatar}`}
                            alt="Avatar"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-categorico rounded-full flex items-center justify-center text-2xl font-bold">
                          {profileData.first_name?.[0]?.toUpperCase() || profileData.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                      {loading && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{profileData.username}</h3>
                      <p className="text-texInactivo text-sm">{profileData.email}</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        className="text-primary text-sm mt-1 hover:underline disabled:opacity-50"
                      >
                        {loading ? 'Subiendo...' : 'Cambiar foto'}
                      </button>
                    </div>
                  </div>

                  {/* Mensajes */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg text-sm">
                      {success}
                    </div>
                  )}

                  {/* Formulario */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-texInactivo mb-2">Nombre de usuario</label>
                      <input
                        type="text"
                        value={profileData.username}
                        disabled
                        className="w-full bg-subdeep border border-categorico rounded-xl px-4 py-3 text-texInactivo cursor-not-allowed"
                      />
                      <p className="text-xs text-texInactivo mt-1">El nombre de usuario no se puede cambiar</p>
                    </div>

                    <div>
                      <label className="block text-sm text-texInactivo mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full bg-subdeep border border-categorico rounded-xl px-4 py-3 text-texInactivo cursor-not-allowed"
                      />
                      <p className="text-xs text-texInactivo mt-1">El email no se puede cambiar</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-texInactivo mb-2">Nombre</label>
                      <input
                        type="text"
                        value={profileData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        className="w-full bg-subdeep border border-categorico rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                        placeholder="Tu nombre"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-texInactivo mb-2">Apellido</label>
                      <input
                        type="text"
                        value={profileData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        className="w-full bg-subdeep border border-categorico rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
                        placeholder="Tu apellido"
                      />
                    </div>

                    <button 
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-subprimary transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  </div>
                </>
              )}
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
                      className={`relative w-12 h-6 rounded-full transition ${
                        notifications[item.key] ? "bg-primary" : "bg-categorico"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
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
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionApp;