"use client";

import React from "react";
import Image from "next/image";
import { useTags } from "@/lib/hooks/useGames";

const categoryColors = [
  "bg-red-600",
  "bg-blue-600", 
  "bg-purple-600",
  "bg-green-600",
  "bg-yellow-600",
  "bg-pink-600",
  "bg-gray-600",
  "bg-teal-600",
  "bg-orange-600",
  "bg-cyan-600",
  "bg-lime-600",
  "bg-indigo-600",
];

const CategoriasApp = () => {
  const { tags, isLoading, error } = useTags();

  if (isLoading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-texInactivo">Cargando categorías...</p>
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
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-subprimary transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Get top 6 tags for popular section
  const popularTags = [...tags]
    .sort((a, b) => (b.games_count || 0) - (a.games_count || 0))
    .slice(0, 6);

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Categorías</h1>
        <p className="text-texInactivo">Explora juegos por género</p>
      </div>

      {/* Categories Grid */}
      <div className="rounded-3xl bg-deep py-10 px-6">
        {tags.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-texInactivo">No hay categorías disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tags.map((categoria, i) => (
              <div
                key={categoria.id}
                className="group bg-subdeep hover:bg-categorico rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <div className={`${categoryColors[i % categoryColors.length]} p-3 rounded-xl`}>
                    <Image
                      src="/category.svg"
                      alt={categoria.name}
                      width={32}
                      height={32}
                      className="filter brightness-0 invert"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary transition">
                      {categoria.name}
                    </h3>
                    <p className="text-texInactivo text-sm">{categoria.games_count || 0} juegos</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popular Categories */}
      {popularTags.length > 0 && (
        <div className="mt-8 rounded-3xl bg-deep py-10 px-6">
          <h2 className="text-xl font-bold mb-6">Categorías Populares</h2>
          <div className="flex flex-wrap gap-3">
            {popularTags.map((tag) => (
              <span
                key={tag.id}
                className="bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium hover:bg-primary hover:text-white cursor-pointer transition"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriasApp;
