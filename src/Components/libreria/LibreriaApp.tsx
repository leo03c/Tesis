"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getLibrary } from "@/services/libraryService";
import type { LibraryGame } from "@/services/libraryService";
import { APIError } from "@/services/api";
import Loading from "@/Components/loading/Loading";
import { useSession } from "next-auth/react"; // <-- importamos useSession

const pic4 = "/pic4.jpg";

const LibreriaApp = () => {
  const { status } = useSession(); // <-- obtenemos estado de sesión
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("todos");
  const [libreria, setLibreria] = useState<LibraryGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }

    const fetchLibrary = async () => {
      try {
        setLoading(true);
        const response = await getLibrary();
        setLibreria(response.results);
        setError(null);
        setApiUrl(null);
      } catch (err) {
        console.error("Error fetching library:", err);
        if (err instanceof APIError) {
          if (err.status === 401) {
            setError("No autorizado. Por favor, inicia sesión para acceder a tu librería.");
          } else {
            setError(err.message);
          }
          setApiUrl(err.url ?? null);
        } else {
          setError("No se pudo cargar la librería");
          setApiUrl(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [status]);

  // Mostrar mensaje de login si no está autenticado
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen text-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mi Librería</h1>
          <p className="text-texInactivo">Inicia sesión para ver tus favoritos</p>
        </div>
        <div className="my-4 rounded-3xl bg-deep text-white py-20 px-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-subdeep rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-texInactivo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Inicia sesión</h3>
            <p className="text-texInactivo mb-4">Debes iniciar sesión para ver su librería</p>
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

  const filteredGames = libreria.filter((game) => {
    if (filter === "instalados") return game.installed;
    if (filter === "no-instalados") return !game.installed;
    return true;
  });

  const formatLastPlayed = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
  };

  const totalHoursPlayed = libreria
    .filter((g) => g.installed)
    .reduce((acc, g) => acc + Number(g.hours_played || 0), 0);

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
            {/* Grid icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition ${viewMode === "list" ? "bg-primary" : "bg-subdeep"}`}
          >
            {/* List icon */}
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
        {loading ? (
          <Loading message="Cargando tu librería..." />
        ) : error || libreria.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-texInactivo mb-2'>
              {error || 'Tu librería está vacía'}
            </p>
            {apiUrl && (
              <p className='text-texInactivo text-xs mt-2'>
                URL: <span className='text-primary'>{apiUrl}</span>
              </p>
            )}
          </div>
        ) : filteredGames.length === 0 ? (
          <p className='text-texInactivo text-center py-8'>
            No hay juegos que coincidan con el filtro seleccionado
          </p>
        ) : (
          <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredGames.map((game, i) => (
                <div key={i} className="bg-subdeep rounded-2xl overflow-hidden group">
                  <div className="w-full aspect-[4/3] relative">
                    <Image
                      src={game.image || pic4}
                      alt={game.title || `Imagen de ${game.title || 'juego'}`}
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
                    <p className="text-texInactivo text-sm">
                      {Number(game.hours_played || 0).toLocaleString('es-ES', { maximumFractionDigits: 0 })}h jugadas
                    </p>
                    <p className="text-texInactivo text-xs">{formatLastPlayed(game.last_played)}</p>
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
                      src={game.image || pic4}
                      alt={game.title || `Imagen de ${game.title || 'juego'}`}
                      fill
                      sizes="80px"
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{game.title}</h3>
                    <p className="text-texInactivo text-sm">{formatLastPlayed(game.last_played)}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-white font-medium">
                      {Number(game.hours_played || 0).toLocaleString('es-ES', { maximumFractionDigits: 0 })}h
                    </p>
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
          </>
        )}
      </div>

      {/* Stats */}
      {!loading && libreria.length > 0 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-deep rounded-2xl p-6 text-center">
            <p className="text-3xl font-bold text-primary">
              {totalHoursPlayed.toLocaleString('es-ES', { maximumFractionDigits: 0 })}h
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
      )}
    </div>
  );
};

export default LibreriaApp;
