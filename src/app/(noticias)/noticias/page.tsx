"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { getNews } from "@/lib/api/news";
import type { Article, PaginatedResponse } from "@/types/api";

const NoticiasPage: React.FC = () => {
  const [noticias, setNoticias] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const not1 = "/noticia1.jpg";
  const not2 = "/noticia2.jpg";

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Article> = await getNews();
      setNoticias(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las noticias');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  if (isLoading) {
    return (
      <main className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-texInactivo">Cargando noticias...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchNews}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-subprimary transition"
          >
            Reintentar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      {/* Hero de noticias */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="relative w-full h-60 md:h-72 rounded-xl overflow-hidden">
          <Image
            src={noticias[0]?.image || not1}
            alt="Noticia principal 1"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute bottom-0 left-0 w-full  p-4">
            <h2 className="text-lg font-bold text-text">
              {noticias[0]?.title || "Hazte con gangas, juegos gratis y mucho más..."}
            </h2>
            <button className="mt-2 px-4 py-2 bg-subdeep text-white rounded-md text-sm hover:bg-deep">
              Leer más
            </button>
          </div>
        </div>

        <div className="relative w-full h-60 md:h-72 rounded-xl overflow-hidden">
          <Image
            src={noticias[1]?.image || not2}
            alt="Noticia principal 2"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute bottom-0 left-0 w-full  p-4">
            <h2 className="text-lg font-bold text-text">
              {noticias[1]?.title || "PLAYERUNKNOWN revela cómo Prologue..."}
            </h2>
            <button className="mt-2 px-4 py-2 bg-subdeep text-white rounded-md text-sm hover:bg-deep">
              Leer más
            </button>
          </div>
        </div>
      </section>

      {/* Grid de noticias */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {noticias.length === 0 ? (
          <div className="col-span-3 text-center py-10">
            <p className="text-texInactivo">No hay noticias disponibles</p>
          </div>
        ) : (
          noticias.slice(2).map((noticia) => (
            <div
              key={noticia.id}
              className="bg-transparent rounded-xl overflow-hidden flex flex-col"
            >
              <div className="relative w-full h-40">
                <Image
                  src={noticia.image || "/pic1.jpg"}
                  alt={noticia.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold font-primary text-text mb-2">{noticia.title}</h3>
                <p className="text-sm text-gray-300 flex-grow font-primary">
                  {noticia.excerpt || noticia.content?.slice(0, 150) || ""}
                </p>
                <button className="mt-4 px-6 py-3 bg-subdeep font-primary text-white rounded-2xl text-xs hover:deep self-start">
                  LEER MÁS
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Paginación */}
      <section className="flex justify-center space-x-2">
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            className="px-4 py-2 bg-subdeep text-white rounded-md hover:bg-blue-600"
          >
            {page}
          </button>
        ))}
      </section>
    </main>
  );
};

export default NoticiasPage;
