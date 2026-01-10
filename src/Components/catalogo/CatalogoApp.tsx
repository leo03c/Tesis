"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getProjects } from "@/services/catalogService";
import type { Project } from "@/services/catalogService";
import Loading from "@/Components/loading/Loading";

const pic4 = "/pic4.jpg";

const CatalogoApp = () => {
  const [filter, setFilter] = useState("todos");
  const [miCatalogo, setMiCatalogo] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await getProjects();
        setMiCatalogo(response.results);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('No se pudieron cargar los proyectos');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

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
        ) : error || miCatalogo.length === 0 ? (
          <p className='text-texInactivo text-center py-8'>
            {error || 'No tienes proyectos en tu catálogo'}
          </p>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {miCatalogo.map((proyecto, i) => (
            <div key={i} className="bg-subdeep rounded-2xl overflow-hidden">
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
                    {proyecto.last_updated ? new Date(proyecto.last_updated).toLocaleDateString() : 'Sin fecha'}
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
