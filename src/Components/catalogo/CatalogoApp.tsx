"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getProjects } from "@/services/catalogService";
import type { Project } from "@/services/catalogService";
import Loading from "@/Components/loading/Loading";
import { useUser } from "@/contexts/UserContext";

const pic4 = "/pic4.jpg";

const CatalogoApp = () => {
  const [filter, setFilter] = useState("todos");
  const [miCatalogo, setMiCatalogo] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchProjects = async () => {
      // Solo cargar si hay usuario autenticado
      if (!user) {
        setLoading(false);
        setError("Debes iniciar sesión para ver tus proyectos");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getProjects();
        setMiCatalogo(response.results || []);
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        const errorMessage = err?.message || err?.detail || 'No se pudieron cargar los proyectos';
        setError(errorMessage);
        setMiCatalogo([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const statusTranslation: Record<Project['status'], string> = {
    'published': 'Publicado',
    'in_development': 'En desarrollo',
    'in_review': 'En revisión',
    'draft': 'Borrador'
  };

  const getStatusColor = (status: Project['status']) => {
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

  const filteredProjects = miCatalogo.filter((proyecto) => {
    if (filter === "todos") return true;
    const statusMap: Record<string, Project['status']> = {
      "publicado": "published",
      "en desarrollo": "in_development",
      "en revisión": "in_review",
      "borrador": "draft"
    };
    return proyecto.status === statusMap[filter];
  });

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
        {loading ? (
          <Loading message="Cargando proyectos..." />
        ) : error ? (
          <div className='text-center py-8'>
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-lg inline-block">
              <p className="font-semibold mb-1">Error al cargar proyectos</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-texInactivo mb-4'>
              {filter === "todos" 
                ? 'No tienes proyectos en tu catálogo' 
                : `No tienes proyectos con el estado "${filter}"`
              }
            </p>
            <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-subprimary transition">
              + Crear tu primer proyecto
            </button>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proyecto) => (
            <div key={proyecto.id} className="bg-subdeep rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-transform">
              {/* Image */}
              <div className="w-full aspect-video relative">
                <Image
                  src={proyecto.image || pic4}
                  alt={proyecto.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className={`absolute top-3 right-3 ${getStatusColor(proyecto.status)} px-3 py-1 rounded-lg text-xs font-semibold`}>
                  {statusTranslation[proyecto.status]}
                </div>
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
                  <span className="text-texInactivo text-sm">
                    {proyecto.last_updated ? new Date(proyecto.last_updated).toLocaleDateString('es-ES') : 'Sin fecha'}
                  </span>
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
        )}
      </div>
    </div>
  );
};

export default CatalogoApp;
