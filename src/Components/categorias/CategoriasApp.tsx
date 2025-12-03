"use client";

import React from "react";
import Image from "next/image";

const categorias = [
  { name: "Acción", icon: "/category.svg", count: 245, color: "bg-red-600" },
  { name: "Aventura", icon: "/category.svg", count: 189, color: "bg-blue-600" },
  { name: "RPG", icon: "/category.svg", count: 156, color: "bg-purple-600" },
  { name: "Deportes", icon: "/category.svg", count: 98, color: "bg-green-600" },
  { name: "Estrategia", icon: "/category.svg", count: 134, color: "bg-yellow-600" },
  { name: "Simulación", icon: "/category.svg", count: 87, color: "bg-pink-600" },
  { name: "Terror", icon: "/category.svg", count: 65, color: "bg-gray-600" },
  { name: "Indie", icon: "/category.svg", count: 312, color: "bg-teal-600" },
  { name: "Multijugador", icon: "/category.svg", count: 178, color: "bg-orange-600" },
  { name: "Mundo Abierto", icon: "/category.svg", count: 95, color: "bg-cyan-600" },
  { name: "Carreras", icon: "/category.svg", count: 56, color: "bg-lime-600" },
  { name: "Puzzle", icon: "/category.svg", count: 124, color: "bg-indigo-600" },
];

const CategoriasApp = () => {
  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Categorías</h1>
        <p className="text-texInactivo">Explora juegos por género</p>
      </div>

      {/* Categories Grid */}
      <div className="rounded-3xl bg-deep py-10 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categorias.map((categoria, i) => (
            <div
              key={i}
              className="group bg-subdeep hover:bg-categorico rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <div className={`${categoria.color} p-3 rounded-xl`}>
                  <Image
                    src={categoria.icon}
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
                  <p className="text-texInactivo text-sm">{categoria.count} juegos</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Categories */}
      <div className="mt-8 rounded-3xl bg-deep py-10 px-6">
        <h2 className="text-xl font-bold mb-6">Categorías Populares</h2>
        <div className="flex flex-wrap gap-3">
          {["Acción", "RPG", "Indie", "Aventura", "Multijugador", "Estrategia"].map((cat, i) => (
            <span
              key={i}
              className="bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium hover:bg-primary hover:text-white cursor-pointer transition"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriasApp;
