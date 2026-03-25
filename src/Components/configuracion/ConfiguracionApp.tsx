"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";
import { signIn } from "next-auth/react";
import settingsService, { UserSettings } from "@/services/settingsService";
import { APIError } from "@/services/api";
import { FaUserCircle, FaCamera, FaSpinner, FaIdBadge, FaEnvelope, FaExclamationCircle, FaCheckCircle, FaLock, FaBell, FaShieldAlt, FaToggleOn, FaToggleOff, FaTrashAlt, FaPen, FaGamepad } from "react-icons/fa";
import ConfirmModal from "@/Components/modals/ConfirmModal";

const ConfiguracionApp = () => {
  const { isAuthenticated, refreshSession } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estado local para los toggles (Simulado/Persistente temporalmente)
  const [preferences, setPreferences] = useState({
    promotions: true,
    wishlist: true,
    twoFactor: false,
    publicProfile: true
  });
  
  // Estado para modal de confirmacion de eliminacion
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState<UserSettings>({
    id: 0,
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    avatar: "",
    profile: {},
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated) return;
      try {
        const profile = await settingsService.getSettings();
        setProfileData(profile);
      } catch (err: unknown) {
        console.error("Error loading profile:", err);
        setError("No se pudo cargar el perfil");
      }
    };
    loadProfile();
  }, [isAuthenticated]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Por favor selecciona una imagen válida");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no debe superar los 5MB");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await settingsService.updateAvatar(file);
      const avatarUrl = data.avatar?.startsWith('http')
        ? data.avatar
        : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${data.avatar}`;
      setProfileData((prev) => ({ ...prev, avatar: data.avatar }));
      setSuccess("Foto actualizada correctamente");
      await refreshSession({ image: avatarUrl });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error uploading avatar:", err);
      const message = err instanceof Error ? err.message : "Error al cambiar la foto";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: Partial<UserSettings> = {
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
      };

      await settingsService.updateSettings(payload);

      setSuccess("Perfil actualizado correctamente");
      await refreshSession();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      console.error("Error updating profile:", err);
      let message = "Error al actualizar el perfil";
      if (err instanceof APIError && err.data) {
        const data = err.data;
        if (typeof data === 'object' && data !== null) {
          const errorDetails = Object.entries(data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
          if (errorDetails) {
            message = errorDetails;
          }
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserSettings, value: string) => {
    setProfileData({ ...profileData, [field]: value });
    setError(null);
    setSuccess(null);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      // TODO: conectar con endpoint real cuando exista en backend.
      await new Promise((resolve) => setTimeout(resolve, 900));
      setSuccess("Solicitud de eliminación enviada correctamente.");
      setIsDeleteModalOpen(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("No se pudo procesar la solicitud de eliminación.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen text-white max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 ">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">Configuración</h1>
        <p className="text-gray-400 mt-2 text-lg">Administra los ajustes de tu cuenta y tus preferencias.</p>
      </div>

      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center p-12 bg-subdeep rounded-3xl border border-gray-800 text-center shadow-xl">
          <div className="w-24 h-24 bg-deep rounded-full flex items-center justify-center mb-6 border border-gray-700 shadow-inner">
            <FaLock className="text-4xl text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Acceso Restringido</h2>
          <p className="text-gray-400 mb-8 max-w-md">
            Debes iniciar sesión para visualizar y modificar la información de esta cuenta.
          </p>
          <button
            onClick={() => signIn()}
            className="bg-primary hover:bg-subprimary text-white px-8 py-3.5 rounded-xl font-bold transition flex items-center gap-2 shadow-[0_0_20px_1px_rgba(255,51,102,0.3)] hover:shadow-[0_0_25px_3px_rgba(255,51,102,0.4)]"
          >
            <FaUserCircle className="text-xl" />
            Iniciar sesión
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-8 pb-10">
          
          {/* Alertas */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-2xl flex items-center gap-4 shadow-lg animate-fade-in">
              <FaExclamationCircle className="text-2xl shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-5 py-4 rounded-2xl flex items-center gap-4 shadow-lg animate-fade-in">
              <FaCheckCircle className="text-2xl shrink-0" />
              <p className="font-medium">{success}</p>
            </div>
          )}

          {/* User ID Card */}
           <div className="bg-subdeep/95 rounded-3xl border border-gray-800/60 overflow-hidden shadow-2xl">
            {/* Header pattern / banner */}
            <div className="h-44 relative overflow-hidden bg-deep/90">
              <div className="absolute inset-0 bg-[url('/icons/grid-pattern.svg')] opacity-10"></div>
              <div className="absolute -top-20 -left-16 h-64 w-64 rounded-full bg-primary/20"></div>
              <div className="absolute -right-20 -bottom-28 h-72 w-72 rounded-full bg-cyan-400/10"></div>
            </div>
            
            <div className="px-6 sm:px-10 pb-10 -mt-20 relative">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8">
                {/* Avatar */}
                <div 
                  className="relative group cursor-pointer shrink-0 z-10"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-subdeep relative bg-deep shadow-2xl group-hover:scale-[1.02] transition-transform duration-300">
                    {profileData.avatar ? (
                      <Image
                        src={
                          profileData.avatar.startsWith("http")
                            ? profileData.avatar
                            : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${profileData.avatar}`
                        }
                        alt="Avatar de usuario"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl font-bold bg-linear-to-br from-gray-800 to-gray-900 text-gray-400">
                        {profileData.first_name?.[0]?.toUpperCase() ||
                         profileData.username?.[0]?.toUpperCase() ||
                         "U"}
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <FaCamera className="text-3xl text-white/90" />
                    </div>

                    {/* Loading Overlay */}
                    {loading && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <FaSpinner className="text-white text-3xl animate-spin" />
                      </div>
                    )}
                  </div>
                  
                  {/* Badge Editar */}
                  <div className="absolute bottom-2 right-4 bg-primary w-9 h-9 rounded-full flex items-center justify-center border-4 border-subdeep shadow-lg text-white pointer-events-none group-hover:bg-subprimary transition-colors">
                     <FaPen className="text-xs" />
                  </div>
                  
                  {/* Etiqueta Estado Conectado */}
                  <div className="absolute top-4 right-5 w-4 h-4 bg-green-500 rounded-full border-4 border-subdeep shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                </div>

                {/* Info Rápida Mejorada */}
                <div className="text-center sm:text-left flex-1 mb-2">
                  <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 mb-1">
                    <h3 className="text-3xl font-bold text-white tracking-tight">
                      {profileData.username || "Cargando..."}
                    </h3>
                    {profileData.username && (
                      <span className="bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-[0_0_10px_rgba(255,51,102,0.1)]">
                        {profileData.profile?.es_desarrollador ? <><FaGamepad className="text-sm" /> DESARROLLADOR</> : <><FaGamepad className="text-sm" /> JUGADOR</>}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-2">
                    <p className="text-gray-400 text-sm font-medium flex items-center gap-2">
                       <FaEnvelope className="text-gray-500"/>
                       {profileData.email || "cargando@correo.com"}
                    </p>
                    <p className="hidden sm:block text-gray-700 text-xs">•</p>
                    <p className="text-green-400/90 text-sm font-bold flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                       Cuenta Activa
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Informacion Personal - Form */}
            <div className="bg-subdeep rounded-3xl border border-gray-800/60 shadow-xl flex flex-col overflow-hidden">
              <div className="border-b border-gray-800/60 p-6 sm:p-8 bg-gray-900/20">
                <h2 className="text-xl font-bold">Información Personal</h2>
                <p className="text-sm text-gray-400 mt-1">Cómo te ven los demás usuarios en la plataforma y tus compras.</p>
              </div>
              <div className="p-6 sm:p-8 space-y-6 flex-1 bg-subdeep">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nombre real</label>
                  <input
                    type="text"
                    value={profileData.first_name || ""}
                    onChange={(e) => handleInputChange("first_name", e.target.value)}
                    className="w-full bg-deep border border-gray-700/80 rounded-xl px-5 py-3.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition placeholder-gray-600 shadow-inner"
                    placeholder="Escribe tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Apellidos</label>
                  <input
                    type="text"
                    value={profileData.last_name || ""}
                    onChange={(e) => handleInputChange("last_name", e.target.value)}
                    className="w-full bg-deep border border-gray-700/80 rounded-xl px-5 py-3.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition placeholder-gray-600 shadow-inner"
                    placeholder="Escribe tus apellidos"
                  />
                </div>
              </div>
              <div className="p-6 sm:px-8 bg-gray-900/40 border-t border-gray-800/60 flex justify-end">
                <button
                  onClick={() => setIsSaveModalOpen(true)}
                  disabled={loading}
                  className="bg-primary hover:bg-subprimary text-white px-8 py-3 rounded-xl font-bold transition shadow-[0_0_15px_1px_rgba(255,51,102,0.2)] disabled:opacity-50 flex items-center gap-3"
                >
                  {loading && <FaSpinner className="animate-spin text-lg" />}
                  Guardar cambios
                </button>
              </div>
            </div>

            {/* Informacion de la Cuenta (Solo Lectura) */}
            <div className="bg-subdeep rounded-3xl border border-gray-800/60 shadow-xl flex flex-col overflow-hidden">
              <div className="border-b border-gray-800/60 p-6 sm:p-8 bg-gray-900/20">
                <h2 className="text-xl font-bold text-white">Datos de la Cuenta</h2>
                <p className="text-sm text-gray-400 mt-1">Credenciales de acceso únicas vinculadas al sistema.</p>
              </div>
              <div className="p-6 sm:p-8 space-y-8 flex-1 bg-subdeep">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nombre de Usuario</label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={profileData.username}
                      disabled
                      className="w-full bg-deep/60 border border-gray-800 text-gray-500 rounded-xl px-5 py-3.5 cursor-not-allowed group-hover:border-gray-700/50 transition font-medium"
                    />
                    <FaIdBadge className="absolute right-5 top-[18px] text-gray-600 text-lg group-hover:text-gray-500 transition" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-medium">Este es tu identificador público en reseñas y foros.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Correo Electrónico</label>
                  <div className="relative group">
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full bg-deep/60 border border-gray-800 text-gray-500 rounded-xl px-5 py-3.5 cursor-not-allowed group-hover:border-gray-700/50 transition font-medium"
                    />
                    <FaEnvelope className="absolute right-5 top-[18px] text-gray-600 text-lg group-hover:text-gray-500 transition" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-medium">Usado para la facturación y recuperación de contraseña.</p>
                </div>
              </div>
            </div>

            {/* Notificaciones y Privacidad */}
            <div className="bg-subdeep rounded-3xl border border-gray-800/60 shadow-xl flex flex-col overflow-hidden md:col-span-2">
              <div className="border-b border-gray-800/60 p-6 sm:p-8 bg-gray-900/20">
                <h2 className="text-xl font-bold flex items-center gap-3 text-white"><FaBell className="text-primary"/> Preferencias y Privacidad</h2>
                <p className="text-sm text-gray-400 mt-1">Configura cómo interactuamos contigo y la visibilidad de tu cuenta.</p>
              </div>
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-subdeep">
                
                {/* Toggles col 1 */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-deep/80 rounded-2xl border border-gray-800/60 hover:border-gray-700 transition">
                    <div>
                      <p className="font-bold text-gray-200">Notificaciones Promocionales</p>
                      <p className="text-xs text-gray-500 mt-0.5">Recibir ofertas y descuentos al correo</p>
                    </div>
                    {preferences.promotions ? <FaToggleOn onClick={() => setPreferences(p => ({...p, promotions: false}))} className="text-4xl text-primary cursor-pointer drop-shadow-[0_0_10px_rgba(255,51,102,0.5)]" /> : <FaToggleOff onClick={() => setPreferences(p => ({...p, promotions: true}))} className="text-4xl text-gray-600 cursor-pointer" />}
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-deep/80 rounded-2xl border border-gray-800/60 hover:border-gray-700 transition">
                    <div>
                      <p className="font-bold text-gray-200">Alertas de Deseos</p>
                      <p className="text-xs text-gray-500 mt-0.5">Avisos cuando un título baje de precio</p>
                    </div>
                    {preferences.wishlist ? <FaToggleOn onClick={() => setPreferences(p => ({...p, wishlist: false}))} className="text-4xl text-primary cursor-pointer drop-shadow-[0_0_10px_rgba(255,51,102,0.5)]" /> : <FaToggleOff onClick={() => setPreferences(p => ({...p, wishlist: true}))} className="text-4xl text-gray-600 cursor-pointer" />}
                  </div>
                </div>

                {/* Toggles col 2 */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-deep/80 rounded-2xl border border-gray-800/60 hover:border-gray-700 transition">
                    <div className="flex gap-3 items-center">
                      <FaShieldAlt className="text-gray-400 text-xl" />
                      <div>
                        <p className="font-bold text-gray-200">Seguridad 2FA</p>
                        <p className="text-xs text-gray-500 mt-0.5">{preferences.twoFactor ? "Validación de dos pasos activa" : "Validación de dos pasos inactiva"}</p>
                      </div>
                    </div>
                    {preferences.twoFactor ? <FaToggleOn onClick={() => setPreferences(p => ({...p, twoFactor: false}))} className="text-4xl text-primary cursor-pointer drop-shadow-[0_0_10px_rgba(255,51,102,0.5)]" /> : <FaToggleOff onClick={() => setPreferences(p => ({...p, twoFactor: true}))} className="text-4xl text-gray-600 cursor-pointer" />}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-deep/80 rounded-2xl border border-gray-800/60 hover:border-gray-700 transition">
                    <div>
                      <p className="font-bold text-gray-200">Perfil Público</p>
                      <p className="text-xs text-gray-500 mt-0.5">Permitir que vean tu librería y reseñas</p>
                    </div>
                    {preferences.publicProfile ? <FaToggleOn onClick={() => setPreferences(p => ({...p, publicProfile: false}))} className="text-4xl text-primary cursor-pointer drop-shadow-[0_0_10px_rgba(255,51,102,0.5)]" /> : <FaToggleOff onClick={() => setPreferences(p => ({...p, publicProfile: true}))} className="text-4xl text-gray-600 cursor-pointer" />}
                  </div>
                </div>

              </div>
            </div>

            {/* Zona de peligro - Eliminar cuenta */}
            <div className="bg-red-500/5 rounded-3xl border border-red-500/20 shadow-xl flex flex-col md:col-span-2 overflow-hidden mt-4">
               <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                 <div>
                   <h2 className="text-xl font-bold flex items-center gap-3 text-red-500"><FaTrashAlt /> Zona de Peligro</h2>
                   <p className="text-sm border-l-2 border-red-500/50 pl-3 text-gray-400 mt-2 max-w-2xl leading-relaxed">
                     Una vez que elimines tu cuenta, no hay marcha atrás. Perderás permanentemente tu librería de juegos, progreso en la nube, reseñas, cartera y catálogo de proyectos creados.
                   </p>
                 </div>
                 <button
                   onClick={() => setIsDeleteModalOpen(true)}
                   className="px-6 py-3.5 border border-red-500/50 text-red-400 bg-red-500/10 rounded-xl font-bold hover:bg-red-500 hover:text-white hover:shadow-[0_0_20px_#ef444450] transition-all shrink-0"
                 >
                   Solicitar Eliminación
                 </button>
               </div>
            </div>
          </div>
        </div>

        <ConfirmModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          onConfirm={async () => {
            await handleSaveProfile();
            setIsSaveModalOpen(false);
          }}
          title="Guardar Cambios"
          message="Se actualizará la información de tu perfil con los nuevos datos ingresados."
          confirmText="Guardar"
          cancelText="Cancelar"
          type="info"
          isLoading={loading}
        />

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Eliminar Cuenta"
          message="Esta acción es irreversible. Se enviará la solicitud de eliminación de tu cuenta y se perderá el acceso a tus datos vinculados."
          confirmText="Confirmar Eliminación"
          cancelText="Cancelar"
          type="danger"
          isLoading={isDeleting}
        />
        </>
      )}
    </div>
  );
};

export default ConfiguracionApp;
