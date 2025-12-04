"use client";

import React, { useState } from "react";
import Image from "next/image";

const pic4 = "/pic4.jpg";
const pic5 = "/pic5.jpg";
const pic6 = "/pic6.jpg";

const libreria = [
  { title: "League of Legends", image: pic4, hoursPlayed: 1250, lastPlayed: "Hace 2 horas", installed: true },
  { title: "God of War", image: pic5, hoursPlayed: 45, lastPlayed: "Hace 3 días", installed: true },
  { title: "Cyberpunk 2077", image: pic6, hoursPlayed: 120, lastPlayed: "Hace 1 semana", installed: false },
  { title: "Control", image: pic4, hoursPlayed: 30, lastPlayed: "Hace 2 semanas", installed: false },
  { title: "Hogwarts Legacy", image: pic5, hoursPlayed: 80, lastPlayed: "Ayer", installed: true },
  { title: "Elden Ring", image: pic6, hoursPlayed: 200, lastPlayed: "Hace 5 días", installed: true },
];

const LibreriaApp = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("todos");

  const filteredGames = libreria.filter((game) => {
    if (filter === "instalados") return game.installed;
    if (filter === "no-instalados") return !game.installed;
    return true;
  });

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mi Librería</h1>
          <p className="text-texInactivo">{libreria.length} juegos en tu colección</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition ${viewMode === "grid" ? "bg-primary" : "bg-subdeep"}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition ${viewMode === "list" ? "bg-primary" : "bg-subdeep"}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        {[
          { key: "todos", label: "Todos" },
          { key: "instalados", label: "Instalados" },
          { key: "no-instalados", label: "No instalados" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === f.key
                ? "bg-primary text-white"
                : "bg-subdeep text-texInactivo hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Games */}
      <div className="rounded-3xl bg-deep py-10 px-6">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGames.map((game, i) => (
              <div key={i} className="bg-subdeep rounded-2xl overflow-hidden group">
                <div className="w-full aspect-[4/3] relative">
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button className="bg-primary text-white px-6 py-2 rounded-xl font-semibold hover:bg-subprimary transition">
                      {game.installed ? "Jugar" : "Instalar"}
                    </button>
                  </div>
                  {game.installed && (
                    <div className="absolute top-2 right-2 bg-green-500 w-3 h-3 rounded-full" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 truncate">{game.title}</h3>
                  <p className="text-texInactivo text-sm">{game.hoursPlayed}h jugadas</p>
                  <p className="text-texInactivo text-xs">{game.lastPlayed}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGames.map((game, i) => (
              <div
                key={i}
                className="bg-subdeep rounded-xl p-4 flex items-center gap-4 hover:bg-categorico transition"
              >
                <div className="w-20 h-14 relative flex-shrink-0">
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    sizes="80px"
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{game.title}</h3>
                  <p className="text-texInactivo text-sm">{game.lastPlayed}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-white font-medium">{game.hoursPlayed}h</p>
                  <p className="text-texInactivo text-xs">Tiempo jugado</p>
                </div>
                <div className="flex items-center gap-2">
                  {game.installed && (
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                      Instalado
                    </span>
                  )}
                  <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-subprimary transition">
                    {game.installed ? "Jugar" : "Instalar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-deep rounded-2xl p-6 text-center">
          <p className="text-3xl font-bold text-primary">
            {libreria.reduce((acc, g) => acc + g.hoursPlayed, 0)}h
          </p>
          <p className="text-texInactivo">Total jugado</p>
        </div>
        <div className="bg-deep rounded-2xl p-6 text-center">
          <p className="text-3xl font-bold text-primary">{libreria.length}</p>
          <p className="text-texInactivo">Juegos</p>
        </div>
        <div className="bg-deep rounded-2xl p-6 text-center">
          <p className="text-3xl font-bold text-primary">
            {libreria.filter((g) => g.installed).length}
          </p>
          <p className="text-texInactivo">Instalados</p>
        </div>
      </div>
    </div>
  );
};

export default LibreriaApp;
