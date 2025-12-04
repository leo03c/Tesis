"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { newsService } from "@/services";
import type { News } from "@/types";

// Fallback data for when API is unavailable
const fallbackNoticias: News[] = [
  {
    id: 1,
    title: "Guía de iniciación de Fatal Fury: City of the Wolves",
    description:
      "Si no sois entendidos, quizá no alcancéis a entender la magnitud de Fatal Fury: City of the Wolves ni por qué hay tanta expectación ante el inminente regreso de esta saga de SNK.",
    image: "/pic1.jpg",
    createdAt: "",
  },
  {
    id: 2,
    title: "Terror japonés",
    description:
      "El último capítulo de la historia original del universo de Dead by Daylight, Doomed Course, recuerda más a las historias de piratas (en parte por su isla, la Adiestradora Canina)...",
    image: "/pic2.jpg",
    createdAt: "",
  },
  {
    id: 3,
    title: "Guía de Assassin's Creed Shadows",
    description:
      "Assassin's Creed Shadows lleva a los jugadores a un viaje inolvidable por un Japón en guerra durante el período Sengoku. Os enfrentaréis a una enorme cantidad de enemigos...",
    image: "/pic3.jpg",
    createdAt: "",
  },
  {
    id: 4,
    title: "Guía de iniciación de Fatal Fury: City of the Wolves",
    description:
      "Si no sois entendidos, quizá no alcancéis a entender la magnitud de Fatal Fury: City of the Wolves ni por qué hay tanta expectación ante el inminente regreso de esta saga de SNK.",
    image: "/pic1.jpg",
    createdAt: "",
  },
  {
    id: 5,
    title: "Terror japonés",
    description:
      "El último capítulo de la historia original del universo de Dead by Daylight, Doomed Course, recuerda más a las historias de piratas (en parte por su isla, la Adiestradora Canina)...",
    image: "/pic2.jpg",
    createdAt: "",
  },
  {
    id: 6,
    title: "Guía de Assassin's Creed Shadows",
    description:
      "Assassin's Creed Shadows lleva a los jugadores a un viaje inolvidable por un Japón en guerra durante el período Sengoku. Os enfrentaréis a una enorme cantidad de enemigos...",
    image: "/pic3.jpg",
    createdAt: "",
  },
];

const NoticiasPage: React.FC = () => {
  const [noticias, setNoticias] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);

  const not1 = "/noticia1.jpg";
  const not2 = "/noticia2.jpg";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await newsService.getNews({ page: currentPage, perPage: 9 });
        setNoticias(response.news);
        setTotalPages(response.totalPages);
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('No se pudieron cargar las noticias');
        setNoticias(fallbackNoticias);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (loading) {
    return (
      <main className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-texInactivo">Cargando noticias...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400">
          {error}
        </div>
      )}

      {/* Hero de noticias */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="relative w-full h-60 md:h-72 rounded-xl overflow-hidden">
          <Image
            src={not1}
            alt="Noticia principal 1"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute bottom-0 left-0 w-full  p-4">
            <h2 className="text-lg font-bold text-text">
              Hazte con gangas, juegos gratis y mucho más...
            </h2>
            <button className="mt-2 px-4 py-2 bg-subdeep text-white rounded-md text-sm hover:bg-deep">
              Leer más
            </button>
          </div>
        </div>

        <div className="relative w-full h-60 md:h-72 rounded-xl overflow-hidden">
          <Image
            src={not2}
            alt="Noticia principal 2"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute bottom-0 left-0 w-full  p-4">
            <h2 className="text-lg font-bold text-text">
              PLAYERUNKNOWN revela cómo Prologue...
            </h2>
            <button className="mt-2 px-4 py-2 bg-subdeep text-white rounded-md text-sm hover:bg-deep">
              Leer más
            </button>
          </div>
        </div>
      </section>

      {/* Grid de noticias */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {noticias.map((noticia) => (
          <div
            key={noticia.id}
            className="bg-transparent rounded-xl overflow-hidden flex flex-col"
          >
            <div className="relative w-full h-40">
              <Image
                src={noticia.image}
                alt={noticia.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold font-primary text-text mb-2">{noticia.title}</h3>
              <p className="text-sm text-gray-300 flex-grow font-primary">
                {noticia.description}
              </p>
              <button className="mt-4 px-6 py-3 bg-subdeep font-primary text-white rounded-2xl text-xs hover:deep self-start">
                LEER MÁS
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Paginación */}
      <section className="flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 rounded-md ${
              currentPage === page 
                ? 'bg-primary text-white' 
                : 'bg-subdeep text-white hover:bg-blue-600'
            }`}
          >
            {page}
          </button>
        ))}
      </section>
    </main>
  );
};

export default NoticiasPage;
