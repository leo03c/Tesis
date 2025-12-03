"use client";

import React, { useState } from "react";
import Image from "next/image";

const pic4 = "/pic4.jpg";
const pic5 = "/pic5.jpg";
const pic6 = "/pic6.jpg";

const miCatalogo = [
  { title: "Mi Proyecto RPG", image: pic4, status: "En desarrollo", progress: 65, lastUpdated: "Hace 2 días" },
  { title: "Plataformas Retro", image: pic5, status: "Publicado", progress: 100, lastUpdated: "Hace 1 semana" },
  { title: "Shooter Espacial", image: pic6, status: "En revisión", progress: 90, lastUpdated: "Hace 3 días" },
  { title: "Puzzle Medieval", image: pic4, status: "Borrador", progress: 25, lastUpdated: "Hace 5 días" },
];

const CatalogoApp = () => {
  const [filter, setFilter] = useState("todos");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Publicado":
        return "bg-green-600";
      case "En desarrollo":
        return "bg-blue-600";
      case "En revisión":
        return "bg-yellow-600";
      case "Borrador":
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {miCatalogo.map((proyecto, i) => (
            <div key={i} className="bg-subdeep rounded-2xl overflow-hidden">
              {/* Image */}
              <div className="w-full aspect-video relative">
                <Image
                  src={proyecto.image}
                  alt={proyecto.title}
                  fill
                  className="object-cover"
                />
                <div className={`absolute top-3 right-3 ${getStatusColor(proyecto.status)} px-3 py-1 rounded-lg text-xs font-semibold`}>
                  {proyecto.status}
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
                  <span className="text-texInactivo text-sm">{proyecto.lastUpdated}</span>
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
