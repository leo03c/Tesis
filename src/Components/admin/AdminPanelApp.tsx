"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import ConfirmModal from "@/Components/modals/ConfirmModal";
import settingsService, { DeveloperRequest, UserSettings } from "@/services/settingsService";
import { getGames, getTags, type Game, type Tag } from "@/services/gamesService";
import { getProjects, type Project } from "@/services/catalogService";
import { APIError } from "@/services/api";
import {
  deleteUserById,
  deleteByEndpoint,
  deleteGameBySlug,
  deleteProjectById,
  deleteReviewById,
  listAdminUsers,
  revokeAdminRoleByUserId,
  updateUserRoleById,
  type AdminUser,
} from "@/services/adminService";

type AdminTab = "solicitudes" | "juegos" | "proyectos" | "usuarios" | "avanzado";

interface DeleteAction {
  key: "game" | "project" | "review" | "custom";
  label: string;
  description: string;
  placeholder: string;
}

const actions: DeleteAction[] = [
  {
    key: "game",
    label: "Eliminar Juego por slug",
    description: "Borra un juego completo de la tienda.",
    placeholder: "ej: hollow-knight",
  },
  {
    key: "project",
    label: "Eliminar Proyecto por ID",
    description: "Elimina un proyecto del catalogo de desarrolladores.",
    placeholder: "ej: 42",
  },
  {
    key: "review",
    label: "Eliminar Resena por ID",
    description: "Borra una resena de la plataforma.",
    placeholder: "ej: 120",
  },
  {
    key: "custom",
    label: "Eliminar por endpoint (avanzado)",
    description: "Ejecuta DELETE en cualquier endpoint permitido por backend.",
    placeholder: "ej: /news/10/",
  },
];

const AdminPanelApp = () => {
  const { isAuthenticated, isLoading } = useUser();
  const [profile, setProfile] = useState<UserSettings | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("solicitudes");

  const [selectedAction, setSelectedAction] = useState<DeleteAction>(actions[0]);
  const [inputValue, setInputValue] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [games, setGames] = useState<Game[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingModerationData, setLoadingModerationData] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<
    | { kind: "game"; slug: string; label: string }
    | { kind: "project"; id: number; label: string }
    | { kind: "review"; id: number; label: string }
    | { kind: "user"; id: number; label: string }
    | null
  >(null);
  const [revokeTarget, setRevokeTarget] = useState<AdminUser | null>(null);
  const [isRevokingAdmin, setIsRevokingAdmin] = useState(false);
  const [roleDrafts, setRoleDrafts] = useState<Record<number, "BASICO" | "DEV" | "ADMIN">>({});
  const [roleChangeTarget, setRoleChangeTarget] = useState<{
    user: AdminUser;
    role: "BASICO" | "DEV" | "ADMIN";
  } | null>(null);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const [requests, setRequests] = useState<DeveloperRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestModal, setRequestModal] = useState<{
    open: boolean;
    request: DeveloperRequest | null;
    status: "aprobada" | "rechazada";
  }>({ open: false, request: null, status: "aprobada" });
  const [updatingRequest, setUpdatingRequest] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated) {
        setLoadingProfile(false);
        return;
      }

      try {
        const data = await settingsService.getSettings();
        setProfile(data);
      } catch {
        setError("No se pudo cargar el perfil para validar permisos.");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [isAuthenticated]);

  const loadRequests = async () => {
    try {
      setLoadingRequests(true);
      const data = await settingsService.getAdminDeveloperRequests();
      setRequests(data);
    } catch {
      setError("No se pudieron cargar las solicitudes de desarrollador.");
    } finally {
      setLoadingRequests(false);
    }
  };

  const loadModerationData = async () => {
    try {
      setLoadingModerationData(true);
      const [gamesResponse, projectsResponse, tagsResponse] = await Promise.all([
        getGames({ page_size: 50 }),
        getProjects(),
        getTags(),
      ]);

      setGames(gamesResponse.results || []);
      setProjects(projectsResponse.results || []);
      setTags(tagsResponse.results || []);
    } catch {
      setError("No se pudieron cargar los datos de moderacion.");
    } finally {
      setLoadingModerationData(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await listAdminUsers();
      setUsers(data);
    } catch (error) {
      if (error instanceof APIError && error.status === 401) {
        setError("401 al cargar usuarios: token expirado o sesion invalida. Vuelve a iniciar sesion.");
        return;
      }
      if (error instanceof APIError && error.status === 403) {
        setError("403 al cargar usuarios: tu token no tiene permisos para administracion de usuarios.");
      } else {
        setError("No se pudieron cargar los usuarios para administracion.");
      }
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadRequests();
      loadModerationData();
      loadUsers();
    }
  }, [isAuthenticated]);

  const roleValue = String(profile?.profile?.rol ?? "").toUpperCase();
  const isAdmin =
    roleValue === "ADMIN" ||
    roleValue === "ADMINISTRADOR" ||
    Boolean(profile?.profile?.es_administrador || profile?.is_staff || profile?.is_superuser);

  const pendingRequests = useMemo(
    () => requests.filter((request) => request.status === "pendiente"),
    [requests]
  );

  const filteredGames = useMemo(() => {
    if (!searchTerm.trim()) return games;
    const query = searchTerm.toLowerCase();
    return games.filter(
      (game) => game.title.toLowerCase().includes(query) || game.slug.toLowerCase().includes(query)
    );
  }, [games, searchTerm]);

  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) return projects;
    const query = searchTerm.toLowerCase();
    return projects.filter(
      (project) => project.title.toLowerCase().includes(query) || String(project.id).includes(query)
    );
  }, [projects, searchTerm]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const query = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        String(user.id).includes(query)
    );
  }, [users, searchTerm]);

  const isUserAdmin = (user: AdminUser) => {
    const roleValue = String(user.profile?.rol ?? "").toUpperCase();
    return (
      roleValue === "ADMIN" ||
      roleValue === "ADMINISTRADOR" ||
      Boolean(user.profile?.es_administrador || user.is_staff || user.is_superuser)
    );
  };

  const getEffectiveUserRole = (user: AdminUser): "BASICO" | "DEV" | "ADMIN" => {
    const roleValue = String(user.profile?.rol ?? "").toUpperCase();
    if (
      roleValue === "ADMIN" ||
      roleValue === "ADMINISTRADOR" ||
      Boolean(user.profile?.es_administrador || user.is_staff || user.is_superuser)
    ) {
      return "ADMIN";
    }
    if (roleValue === "DEV" || roleValue === "DESARROLLADOR" || roleValue === "DEVELOPER") {
      return "DEV";
    }
    return "BASICO";
  };

  const runDeleteAction = async () => {
    setIsDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      if (selectedAction.key === "game") {
        await deleteGameBySlug(inputValue.trim());
      }

      if (selectedAction.key === "project") {
        const id = Number(inputValue);
        if (!id) throw new Error("ID de proyecto invalido");
        await deleteProjectById(id);
      }

      if (selectedAction.key === "review") {
        const id = Number(inputValue);
        if (!id) throw new Error("ID de resena invalido");
        await deleteReviewById(id);
      }

      if (selectedAction.key === "custom") {
        await deleteByEndpoint(inputValue.trim());
      }

      setSuccess(`${selectedAction.label} ejecutado correctamente.`);
      setInputValue("");
      setIsDeleteModalOpen(false);
    } catch (e) {
      const message =
        e instanceof APIError && e.status === 401
          ? "401: sesion expirada o token invalido. Inicia sesion nuevamente."
          :
        e instanceof APIError && e.status === 403
          ? "403: el backend denego la accion. Verifica permisos ADMIN o endpoint correcto."
          : e instanceof Error
            ? e.message
            : "Error al ejecutar la accion.";
      setError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteSelectedTarget = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      if (deleteTarget.kind === "game") {
        await deleteGameBySlug(deleteTarget.slug);
        setGames((prev) => prev.filter((game) => game.slug !== deleteTarget.slug));
      }

      if (deleteTarget.kind === "project") {
        await deleteProjectById(deleteTarget.id);
        setProjects((prev) => prev.filter((project) => project.id !== deleteTarget.id));
      }

      if (deleteTarget.kind === "review") {
        await deleteReviewById(deleteTarget.id);
      }

      if (deleteTarget.kind === "user") {
        await deleteUserById(deleteTarget.id);
        setUsers((prev) => prev.filter((user) => user.id !== deleteTarget.id));
      }

      setSuccess(`Elemento eliminado: ${deleteTarget.label}`);
      setDeleteTarget(null);
    } catch (e) {
      const message =
        e instanceof APIError && e.status === 401
          ? "401: sesion expirada o token invalido. Inicia sesion nuevamente."
          :
        e instanceof APIError && e.status === 403
          ? "403: no autorizado para eliminar este elemento."
          : e instanceof Error
            ? e.message
            : "No se pudo eliminar el elemento.";
      setError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRevokeAdmin = async () => {
    if (!revokeTarget) return;

    setIsRevokingAdmin(true);
    setError(null);
    setSuccess(null);

    try {
      await revokeAdminRoleByUserId(revokeTarget.id);
      setSuccess(`Rol admin revocado para ${revokeTarget.username}.`);
      setRevokeTarget(null);
      await loadUsers();
    } catch (e) {
      const message =
        e instanceof APIError && e.status === 401
          ? "401: sesion expirada o token invalido. Inicia sesion nuevamente."
          :
        e instanceof APIError && e.status === 403
          ? "403: no autorizado para revocar rol admin."
          : e instanceof Error
            ? e.message
            : "No se pudo revocar el rol admin.";
      setError(message);
    } finally {
      setIsRevokingAdmin(false);
    }
  };

  const handleApplyRoleChange = async () => {
    if (!roleChangeTarget) return;

    setIsUpdatingRole(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUserRoleById(roleChangeTarget.user.id, roleChangeTarget.role);
      setSuccess(
        `Rol actualizado para ${roleChangeTarget.user.username}: ${roleChangeTarget.role}.`
      );
      setRoleChangeTarget(null);
      await loadUsers();
    } catch (e) {
      const message =
        e instanceof APIError && e.status === 401
          ? "401: sesion expirada o token invalido. Inicia sesion nuevamente."
          : e instanceof APIError && e.status === 403
            ? "403: no autorizado para cambiar roles de usuario."
            : e instanceof Error
              ? e.message
              : "No se pudo actualizar el rol del usuario.";
      setError(message);
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const handleUpdateRequestStatus = async () => {
    if (!requestModal.request) return;

    setUpdatingRequest(true);
    setError(null);
    setSuccess(null);

    try {
      await settingsService.updateDeveloperRequestStatus(requestModal.request.id, requestModal.status);
      await loadRequests();
      setSuccess(
        requestModal.status === "aprobada"
          ? "Solicitud aprobada correctamente."
          : "Solicitud rechazada correctamente."
      );
      setRequestModal({ open: false, request: null, status: "aprobada" });
    } catch {
      setError("No se pudo actualizar la solicitud.");
    } finally {
      setUpdatingRequest(false);
    }
  };

  if (isLoading || loadingProfile) {
    return <div className="min-h-screen text-white p-8">Cargando panel admin...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen text-white p-8">
        <h1 className="text-3xl font-bold">Panel Admin</h1>
        <p className="text-texInactivo mt-2">Debes iniciar sesion para acceder.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen text-white p-8">
        <h1 className="text-3xl font-bold">Panel Admin</h1>
        <p className="text-red-400 mt-2">Acceso denegado. Solo administradores.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Panel Admin</h1>
        <p className="text-gray-400 mt-2">
          Moderacion avanzada: borrado de contenido y aprobacion de solicitudes de desarrollador.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button onClick={() => setActiveTab("solicitudes")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "solicitudes" ? "bg-primary text-white" : "bg-subdeep text-gray-300 hover:text-white"}`}>
          Solicitudes
        </button>
        <button onClick={() => setActiveTab("juegos")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "juegos" ? "bg-primary text-white" : "bg-subdeep text-gray-300 hover:text-white"}`}>
          Juegos
        </button>
        <button onClick={() => setActiveTab("proyectos")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "proyectos" ? "bg-primary text-white" : "bg-subdeep text-gray-300 hover:text-white"}`}>
          Proyectos
        </button>
        <button onClick={() => setActiveTab("usuarios")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "usuarios" ? "bg-primary text-white" : "bg-subdeep text-gray-300 hover:text-white"}`}>
          Usuarios
        </button>
        <button onClick={() => setActiveTab("avanzado")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "avanzado" ? "bg-primary text-white" : "bg-subdeep text-gray-300 hover:text-white"}`}>
          Herramientas avanzadas
        </button>
      </div>

      {error && <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300 px-5 py-4">{error}</div>}
      {success && <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 text-green-300 px-5 py-4">{success}</div>}

      {activeTab !== "solicitudes" && activeTab !== "avanzado" && (
        <div className="mb-6">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, slug o ID..."
            className="w-full bg-subdeep border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
      )}

      {activeTab === "solicitudes" && (
        <section className="bg-subdeep rounded-3xl border border-gray-800/60 shadow-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold">Solicitudes de Desarrollador</h2>
          <p className="text-sm text-gray-400 mt-1">Aprueba o rechaza solicitudes pendientes.</p>
          {loadingRequests ? (
            <div className="mt-6 text-gray-400">Cargando solicitudes...</div>
          ) : pendingRequests.length === 0 ? (
            <div className="mt-6 text-gray-400">No hay solicitudes pendientes.</div>
          ) : (
            <div className="mt-6 space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.id} className="bg-deep border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{request.username}</p>
                    <p className="text-sm text-gray-400">{request.email}</p>
                    <p className="text-sm text-gray-300 mt-2">
                      Motivo: <span className="text-gray-200">{request.reason?.trim() || "Sin motivo especificado."}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Solicitud: {new Date(request.createdAt).toLocaleString("es-ES")}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setRequestModal({ open: true, request, status: "aprobada" })} className="px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/40 text-green-300 hover:bg-green-500 hover:text-white transition">Aprobar</button>
                    <button onClick={() => setRequestModal({ open: true, request, status: "rechazada" })} className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500 hover:text-white transition">Rechazar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "juegos" && (
        <section className="bg-subdeep rounded-3xl border border-gray-800/60 shadow-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold">Moderacion de Juegos</h2>
          <p className="text-sm text-gray-400 mt-1">Lista de juegos recientes. Elimina directamente por fila.</p>
          {loadingModerationData ? (
            <div className="mt-6 text-gray-400">Cargando juegos...</div>
          ) : filteredGames.length === 0 ? (
            <div className="mt-6 text-gray-400">No hay juegos para mostrar.</div>
          ) : (
            <div className="mt-6 space-y-3">
              {filteredGames.map((game) => (
                <div key={game.id} className="bg-deep border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{game.title}</p>
                    <p className="text-sm text-gray-400">Slug: {game.slug}</p>
                    <p className="text-xs text-gray-500 mt-1">ID: {game.id}</p>
                  </div>
                  <button onClick={() => setDeleteTarget({ kind: "game", slug: game.slug, label: game.title })} className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500 hover:text-white transition">Eliminar juego</button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "proyectos" && (
        <section className="bg-subdeep rounded-3xl border border-gray-800/60 shadow-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold">Moderacion de Proyectos</h2>
          <p className="text-sm text-gray-400 mt-1">Gestiona y elimina proyectos del catalogo.</p>
          {loadingModerationData ? (
            <div className="mt-6 text-gray-400">Cargando proyectos...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="mt-6 text-gray-400">No hay proyectos para mostrar.</div>
          ) : (
            <div className="mt-6 space-y-3">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-deep border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{project.title}</p>
                    <p className="text-sm text-gray-400">Estado: {project.status_display || project.status}</p>
                    <p className="text-xs text-gray-500 mt-1">ID: {project.id}</p>
                  </div>
                  <button onClick={() => setDeleteTarget({ kind: "project", id: project.id, label: project.title })} className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500 hover:text-white transition">Eliminar proyecto</button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "usuarios" && (
        <section className="bg-subdeep rounded-3xl border border-gray-800/60 shadow-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold">Administracion de Usuarios</h2>
          <p className="text-sm text-gray-400 mt-1">Revoca rol de admin o elimina cuentas de usuario.</p>
          {loadingUsers ? (
            <div className="mt-6 text-gray-400">Cargando usuarios...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="mt-6 text-gray-400">No hay usuarios para mostrar.</div>
          ) : (
            <div className="mt-6 space-y-3">
              {filteredUsers.map((user) => {
                const userAdmin = isUserAdmin(user);
                const isSelf = profile?.id === user.id;
                const currentRole = getEffectiveUserRole(user);
                const selectedRole = roleDrafts[user.id] ?? currentRole;
                return (
                  <div key={user.id} className="bg-deep border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{user.username}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {user.id} · Rol actual: {currentRole}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <select
                        value={selectedRole}
                        onChange={(event) =>
                          setRoleDrafts((prev) => ({
                            ...prev,
                            [user.id]: event.target.value as "BASICO" | "DEV" | "ADMIN",
                          }))
                        }
                        disabled={isSelf}
                        className="bg-subdeep border border-gray-700 rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50"
                      >
                        <option value="BASICO">BASICO</option>
                        <option value="DEV">DEV</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <button
                        onClick={() => setRoleChangeTarget({ user, role: selectedRole })}
                        disabled={isSelf || selectedRole === currentRole}
                        className="px-4 py-2 rounded-lg bg-blue-500/15 border border-blue-500/40 text-blue-300 hover:bg-blue-500 hover:text-white transition disabled:opacity-50"
                      >
                        Aplicar rol
                      </button>
                      <button
                        onClick={() => setRevokeTarget(user)}
                        disabled={!userAdmin || isSelf}
                        className="px-4 py-2 rounded-lg bg-yellow-500/15 border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500 hover:text-white transition disabled:opacity-50"
                      >
                        Revocar admin
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ kind: "user", id: user.id, label: user.username })}
                        disabled={isSelf}
                        className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                      >
                        Eliminar usuario
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {activeTab === "avanzado" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <section className="bg-subdeep rounded-3xl border border-gray-800/60 shadow-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold">Borrado Global</h2>
            <p className="text-sm text-gray-400 mt-1">Usa estas acciones con cuidado. Algunas dependen de permisos backend.</p>
            <div className="mt-6 space-y-3">
              {actions.map((action) => (
                <button key={action.key} onClick={() => { setSelectedAction(action); setInputValue(""); }} className={`w-full text-left px-4 py-3 rounded-xl border transition ${selectedAction.key === action.key ? "bg-primary/20 border-primary/40 text-white" : "bg-deep border-gray-800 text-gray-300 hover:border-gray-700"}`}>
                  <p className="font-semibold">{action.label}</p>
                  <p className="text-xs opacity-80 mt-0.5">{action.description}</p>
                </button>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              <label className="block text-sm text-gray-300">Parametro requerido</label>
              <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={selectedAction.placeholder} className="w-full bg-deep border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
              <button onClick={() => setIsDeleteModalOpen(true)} disabled={!inputValue.trim()} className="w-full bg-red-500/15 border border-red-500/40 text-red-300 py-3 rounded-xl font-semibold hover:bg-red-500 hover:text-white transition disabled:opacity-50">Ejecutar Eliminacion</button>
            </div>
          </section>

          <section className="bg-subdeep rounded-3xl border border-gray-800/60 shadow-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold">Resumen de plataforma</h2>
            <p className="text-sm text-gray-400 mt-1">Vista rapida de contenido registrado.</p>
            <div className="mt-6 space-y-3">
              <div className="bg-deep border border-gray-800 rounded-xl p-4 flex items-center justify-between"><span className="text-gray-300">Juegos</span><span className="font-bold text-white">{games.length}</span></div>
              <div className="bg-deep border border-gray-800 rounded-xl p-4 flex items-center justify-between"><span className="text-gray-300">Proyectos</span><span className="font-bold text-white">{projects.length}</span></div>
              <div className="bg-deep border border-gray-800 rounded-xl p-4 flex items-center justify-between"><span className="text-gray-300">Categorias</span><span className="font-bold text-white">{tags.length}</span></div>
              <div className="bg-deep border border-gray-800 rounded-xl p-4 flex items-center justify-between"><span className="text-gray-300">Solicitudes pendientes</span><span className="font-bold text-white">{pendingRequests.length}</span></div>
            </div>
            <p className="text-xs text-gray-500 mt-6">Nota: la eliminacion de categorias/usuarios depende de endpoints que actualmente no estan expuestos en la API publica.</p>
          </section>
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={runDeleteAction}
        title="Confirmar accion de borrado"
        message="Esta accion puede eliminar informacion de forma permanente. Deseas continuar?"
        confirmText="Si, eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={isDeleting}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={deleteSelectedTarget}
        title="Confirmar eliminacion"
        message={`Se eliminara de forma permanente: ${deleteTarget?.label ?? "elemento"}. Esta accion no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={isDeleting}
      />

      <ConfirmModal
        isOpen={requestModal.open}
        onClose={() => setRequestModal({ open: false, request: null, status: "aprobada" })}
        onConfirm={handleUpdateRequestStatus}
        title={requestModal.status === "aprobada" ? "Aprobar solicitud" : "Rechazar solicitud"}
        message={requestModal.status === "aprobada" ? "La cuenta quedara marcada como aprobada para desarrollador." : "La solicitud sera rechazada y no tendra permisos de desarrollador."}
        confirmText={requestModal.status === "aprobada" ? "Aprobar" : "Rechazar"}
        cancelText="Cancelar"
        type={requestModal.status === "aprobada" ? "success" : "warning"}
        isLoading={updatingRequest}
      />

      <ConfirmModal
        isOpen={Boolean(revokeTarget)}
        onClose={() => setRevokeTarget(null)}
        onConfirm={handleRevokeAdmin}
        title="Revocar rol admin"
        message={`Se revocaran privilegios de administrador a ${revokeTarget?.username ?? "este usuario"}.`}
        confirmText="Revocar"
        cancelText="Cancelar"
        type="warning"
        isLoading={isRevokingAdmin}
      />

      <ConfirmModal
        isOpen={Boolean(roleChangeTarget)}
        onClose={() => setRoleChangeTarget(null)}
        onConfirm={handleApplyRoleChange}
        title="Confirmar cambio de rol"
        message={`Se cambiara el rol de ${roleChangeTarget?.user.username ?? "usuario"} a ${roleChangeTarget?.role ?? "BASICO"}.`}
        confirmText="Aplicar"
        cancelText="Cancelar"
        type="info"
        isLoading={isUpdatingRole}
      />
    </div>
  );
};

export default AdminPanelApp;
