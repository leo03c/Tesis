"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getProjects, Project } from "@/services/catalogService";
import Loading from "@/Components/loading/Loading";
import { useUser } from "@/contexts/UserContext";
import ModalCrearProyecto from "./ModalCrearProyecto";

const filters = ["todos", "publicado", "en desarrollo", "en revisión", "borrador"];
const placeholderImage = "/pic4.jpg";

// Map de filtros con los valores exactos del backend
const filterMap: Record<string, Project["status"] | null> = {
  todos: null,
  publicado: "publicado",
  "en desarrollo": "en_desarrollo",
  "en revisión": "en_revision",
  borrador: "borrador",
};

const CatalogoApp: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useUser();
  const [miCatalogo, setMiCatalogo] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isForbidden, setIsForbidden] = useState(false);
  const [filter, setFilter] = useState("todos");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getProjects();
        setMiCatalogo(response.results || []);
      } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && 'status' in err) {
          const status = (err as { status?: number }).status;
          if (status === 403) {
            setIsForbidden(true);
            return;
          }
        }
        console.warn("Error cargando catálogo:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isAuthenticated, user]);

  // Mostrar loading mientras se verifica la sesión
  if (isLoading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <Loading message="Verificando sesión..." />
      </div>
    );
  }

  // Mostrar mensaje de login si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen text-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mi Catálogo</h1>
          <p className="text-texInactivo">Inicia sesión para ver tus proyectos</p>
        </div>
        <div className="my-4 rounded-3xl bg-deep text-white py-20 px-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-subdeep rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-texInactivo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Inicia sesión</h3>
            <p className="text-texInactivo mb-4">Debes iniciar sesión para ver tus proyectos</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isForbidden) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center max-w-md bg-deep p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-3">Acceso restringido</h2>
          <p className="text-texInactivo">
            Solo los usuarios con rol{" "}
            <span className="text-primary font-semibold">DESARROLLADOR</span>{" "}
            pueden acceder al catálogo.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading message="Cargando catálogo..." />;
  }

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "publicado":
        return "bg-green-600";
      case "en_desarrollo":
        return "bg-blue-600";
      case "en_revision":
        return "bg-yellow-600";
      case "borrador":
      default:
        return "bg-gray-600";
    }
  };

  // Mostrar texto amigable para el estado
  const getStatusDisplay = (status: Project["status"]) => {
    switch (status) {
      case "publicado":
        return "Publicado";
      case "en_desarrollo":
        return "En desarrollo";
      case "en_revision":
        return "En revisión";
      case "borrador":
      default:
        return "Borrador";
    }
  };

  // Filtrar según el filtro seleccionado
  const filteredProjects = miCatalogo.filter((p) => {
    const statusFiltro = filterMap[filter];
    if (!statusFiltro) return true; // "todos"
    return p.status === statusFiltro;
  });

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mi Catálogo</h1>
          <p className="text-texInactivo">Gestiona tus juegos y proyectos</p>
        </div>
        <button
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-subprimary transition"
          onClick={() => setShowModal(true)}
        >
          + Nuevo Proyecto
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition ${
              filter === f
                ? "bg-primary text-white"
                : "bg-subdeep text-texInactivo hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="rounded-3xl bg-deep py-10 px-6">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-texInactivo mb-4">
              {filter === "todos"
                ? "No tienes proyectos en tu catálogo"
                : `No hay proyectos con estado "${filter}"`}
            </p>
            <button
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-subprimary transition"
              onClick={() => setShowModal(true)}
            >
              + Crear tu primer proyecto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proyecto) => (
              <div
                key={proyecto.id}
                className="bg-subdeep rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-transform"
              >
                {/* Image */}
                <div className="w-full aspect-video relative">
                  <Image
                    src={proyecto.image || placeholderImage}
                    alt={proyecto.title}
                    fill
                    className="object-cover"
                  />
                  <div
                    className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(
                      proyecto.status
                    )}`}
                  >
                    {proyecto.status_display || getStatusDisplay(proyecto.status)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-3">
                    {proyecto.title}
                  </h3>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-texInactivo">Progreso</span>
                      <span className="text-primary font-medium">
                        {proyecto.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-dark rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${proyecto.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-texInactivo text-sm">
                      {proyecto.last_updated
                        ? new Date(proyecto.last_updated).toLocaleDateString(
                            "es-ES"
                          )
                        : "Sin fecha"}
                    </span>
                    <button className="text-primary hover:text-subprimary text-sm font-medium">
                      Editar →
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Project Card */}
            <div
              className="bg-subdeep rounded-2xl border-2 border-dashed border-categorico hover:border-primary flex items-center justify-center min-h-[280px] cursor-pointer transition group"
              onClick={() => setShowModal(true)}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-categorico group-hover:bg-primary rounded-full flex items-center justify-center mx-auto mb-4 transition">
                  <span className="text-3xl" aria-hidden="true">
                    +
                  </span>
                </div>
                <p className="text-texInactivo group-hover:text-white transition">
                  Crear nuevo proyecto
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ModalCrearProyecto
          onClose={() => setShowModal(false)}
          onCreated={(newProject) =>
            setMiCatalogo((prev) => [newProject, ...prev])
          }
        />
      )}
    </div>
  );
};

export default CatalogoApp;
