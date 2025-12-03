"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { getCatalog, deleteProject } from "@/lib/api/catalog";
import type { Project, PaginatedResponse } from "@/types/api";

const CatalogoApp = () => {
  const [catalog, setCatalog] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("todos");

  const fetchCatalog = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Project> = await getCatalog();
      setCatalog(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el catálogo');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const handleDeleteProject = async (id: number) => {
    try {
      await deleteProject(id);
      setCatalog(prev => prev.filter(p => p.id !== id));
    } catch {
      // Error handling
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-600";
      case "in_development":
        return "bg-blue-600";
      case "in_review":
        return "bg-yellow-600";
      case "draft":
        return "bg-gray-600";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published":
        return "Publicado";
      case "in_development":
        return "En desarrollo";
      case "in_review":
        return "En revisión";
      case "draft":
        return "Borrador";
      default:
        return status;
    }
  };

  const filteredCatalog = catalog.filter((proyecto) => {
    if (filter === "todos") return true;
    if (filter === "publicado") return proyecto.status === "published";
    if (filter === "en desarrollo") return proyecto.status === "in_development";
    if (filter === "en revisión") return proyecto.status === "in_review";
    if (filter === "borrador") return proyecto.status === "draft";
    return true;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Hoy";
    if (days === 1) return "Ayer";
    if (days < 7) return `Hace ${days} días`;
    if (days < 30) return `Hace ${Math.floor(days / 7)} semana${Math.floor(days / 7) > 1 ? 's' : ''}`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-texInactivo">Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchCatalog}
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
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mi Catálogo</h1>
          <p className="text-texInactivo">Gestiona tus juegos y proyectos</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-subprimary transition">
          + Nuevo Proyecto
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        {["todos", "publicado", "en desarrollo", "en revisión", "borrador"].map((f) => (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCatalog.map((proyecto) => (
            <div key={proyecto.id} className="bg-subdeep rounded-2xl overflow-hidden group">
              {/* Image */}
              <div className="w-full aspect-video relative">
                <Image
                  src={proyecto.image || "/pic4.jpg"}
                  alt={proyecto.title}
                  fill
                  className="object-cover"
                />
                <div className={`absolute top-3 right-3 ${getStatusColor(proyecto.status)} px-3 py-1 rounded-lg text-xs font-semibold`}>
                  {getStatusLabel(proyecto.status)}
                </div>
                <button
                  onClick={() => handleDeleteProject(proyecto.id)}
                  className="absolute top-3 left-3 bg-red-500 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-3">{proyecto.title}</h3>
                
                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-texInactivo">Progreso</span>
                    <span className="text-primary font-medium">{proyecto.progress}%</span>
                  </div>
                  <div className="w-full bg-dark rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${proyecto.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-texInactivo text-sm">{formatDate(proyecto.last_updated)}</span>
                  <button className="text-primary hover:text-subprimary text-sm font-medium">
                    Editar →
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add new project card */}
          <div className="bg-subdeep rounded-2xl border-2 border-dashed border-categorico hover:border-primary flex items-center justify-center min-h-[280px] cursor-pointer transition group">
            <div className="text-center">
              <div className="w-16 h-16 bg-categorico group-hover:bg-primary rounded-full flex items-center justify-center mx-auto mb-4 transition">
                <span className="text-3xl">+</span>
              </div>
              <p className="text-texInactivo group-hover:text-white transition">Crear nuevo proyecto</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogoApp;
