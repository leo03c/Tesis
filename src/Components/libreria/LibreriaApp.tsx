"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { libraryService } from "@/services";
import type { LibraryGame } from "@/types";

// Fallback data for when API is unavailable
const fallbackLibreria: LibraryGame[] = [
  { id: 1, gameId: 1, title: "League of Legends", image: "/pic4.jpg", hoursPlayed: 1250, lastPlayed: "Hace 2 horas", installed: true, addedAt: "" },
  { id: 2, gameId: 2, title: "God of War", image: "/pic5.jpg", hoursPlayed: 45, lastPlayed: "Hace 3 días", installed: true, addedAt: "" },
  { id: 3, gameId: 3, title: "Cyberpunk 2077", image: "/pic6.jpg", hoursPlayed: 120, lastPlayed: "Hace 1 semana", installed: false, addedAt: "" },
  { id: 4, gameId: 4, title: "Control", image: "/pic4.jpg", hoursPlayed: 30, lastPlayed: "Hace 2 semanas", installed: false, addedAt: "" },
  { id: 5, gameId: 5, title: "Hogwarts Legacy", image: "/pic5.jpg", hoursPlayed: 80, lastPlayed: "Ayer", installed: true, addedAt: "" },
  { id: 6, gameId: 6, title: "Elden Ring", image: "/pic6.jpg", hoursPlayed: 200, lastPlayed: "Hace 5 días", installed: true, addedAt: "" },
];

const LibreriaApp = () => {
  const [libreria, setLibreria] = useState<LibraryGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        setLoading(true);
        const response = await libraryService.getLibrary();
        setLibreria(response.library);
        setError(null);
      } catch (err) {
        console.error('Error fetching library:', err);
        setError('No se pudo cargar la librería');
        setLibreria(fallbackLibreria);
      } finally {
        setLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  const filteredGames = libreria.filter((game) => {
    if (filter === "instalados") return game.installed;
    if (filter === "no-instalados") return !game.installed;
    return true;
  });

  const totalHoursPlayed = libreria.reduce((acc, g) => acc + g.hoursPlayed, 0);
  const installedCount = libreria.filter((g) => g.installed).length;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-texInactivo">Cargando librería...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400">
          {error}
        </div>
      )}

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
            {totalHoursPlayed}h
          </p>
          <p className="text-texInactivo">Total jugado</p>
        </div>
        <div className="bg-deep rounded-2xl p-6 text-center">
          <p className="text-3xl font-bold text-primary">{libreria.length}</p>
          <p className="text-texInactivo">Juegos</p>
        </div>
        <div className="bg-deep rounded-2xl p-6 text-center">
          <p className="text-3xl font-bold text-primary">
            {installedCount}
          </p>
          <p className="text-texInactivo">Instalados</p>
        </div>
      </div>
    </div>
  );
};

export default LibreriaApp;
