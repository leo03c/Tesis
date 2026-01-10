"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getTags } from "@/services/gamesService";
import type { Tag } from "@/services/gamesService";
import Loading from "@/Components/loading/Loading";

const CategoriasApp = () => {
  const [categorias, setCategorias] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await getTags();
        setCategorias(response.results);
        setError(null);
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError('No se pudieron cargar las categorías');
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const getColorClass = (index: number) => {
    const colors = [
      "bg-red-600", "bg-blue-600", "bg-purple-600", "bg-green-600",
      "bg-yellow-600", "bg-pink-600", "bg-gray-600", "bg-teal-600",
      "bg-orange-600", "bg-cyan-600", "bg-lime-600", "bg-indigo-600"
    ];
    return colors[index % colors.length];
  };
  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Categorías</h1>
        <p className="text-texInactivo">Explora juegos por género</p>
      </div>

      {/* Categories Grid */}
      <div className="rounded-3xl bg-deep py-10 px-6">
        {loading ? (
          <Loading message="Cargando categorías..." />
        ) : error || categorias.length === 0 ? (
          <p className='text-texInactivo text-center py-8'>
            {error || 'No hay categorías disponibles'}
          </p>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categorias.map((categoria, i) => (
            <div
              key={i}
              className="group bg-subdeep hover:bg-categorico rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <div className={`${getColorClass(i)} p-3 rounded-xl`}>
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
                  <p className="text-texInactivo text-sm">{categoria.game_count || 0} juegos</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Popular Categories */}
      {!loading && categorias.length > 0 && (
      <div className="mt-8 rounded-3xl bg-deep py-10 px-6">
        <h2 className="text-xl font-bold mb-6">Categorías Populares</h2>
        <div className="flex flex-wrap gap-3">
          {categorias.slice(0, 6).map((cat, i) => (
            <span
              key={i}
              className="bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium hover:bg-primary hover:text-white cursor-pointer transition"
            >
              {cat.name}
            </span>
          ))}
        </div>
      </div>
      )}
    </div>
  );
};

export default CategoriasApp;
