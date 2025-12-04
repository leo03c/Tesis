"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { newsService } from "@/services";
import type { FeaturedArticle } from "@/types";

const der = "/icons/derecha.svg";
const izq = "/icons/izquierda.svg";

// Fallback data for when API is unavailable
const fallbackArticles: FeaturedArticle[] = [
  {
    id: 1,
    title: 'Guía de iniciación de Fatal Fury: City of the Wolves',
    description:
      'Si sois neofuturistas, quizá no imagináis o entendéis la magnitud de Fatal Fury: City of the Wolves...',
    image: '/pic1.jpg',
  },
  {
    id: 2,
    title: 'Terror japonés',
    description:
      'El último capítulo de la historia original del universo de Dead by Daylight...',
    image: '/pic2.jpg',
  },
  {
    id: 3,
    title: 'Más terror japonés',
    description:
      'Una entrega que combina leyendas japonesas con la tensión clásica del survival horror...',
    image: '/pic3.jpg',
  },
  {
    id: 4,
    title: "Guía de Assassin's Creed Shadows",
    description:
      "Assassin's Creed Shadows lleva a los jugadores a un Japón en guerra durante el periodo Sengoku...",
    image: '/pic1.jpg',
  },
  {
    id: 5,
    title: 'Otro artículo interesante',
    description:
      'Este es un artículo adicional para probar la paginación y el comportamiento responsivo.',
    image: '/pic2.jpg',
  },
];

const ArticulosDestacados = () => {
  const [articles, setArticles] = useState<FeaturedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isMobile, setIsMobile] = useState(false);

  // dirección de la transición: 1 = next (entra desde la derecha), -1 = prev (entra desde la izquierda)
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const fetchFeaturedNews = async () => {
      try {
        setLoading(true);
        const response = await newsService.getFeaturedNews();
        setArticles(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching featured articles:', err);
        setError('No se pudieron cargar los artículos destacados');
        setArticles(fallbackArticles);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedNews();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isSmall = window.innerWidth < 640;
      setIsMobile(isSmall);
      setItemsPerPage(isSmall ? 1 : 3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(articles.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage((p) => p + 1);
      setTimeout(() => setDirection(0), 350);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage((p) => p - 1);
      setTimeout(() => setDirection(0), 350);
    }
  };

  const startIndex = currentPage * itemsPerPage;
  const visibleArticles = articles.slice(startIndex, startIndex + itemsPerPage);

  // Loading state
  if (loading) {
    return (
      <div className='w-full bg-dark text-white py-10 overflow-hidden'>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-texInactivo">Cargando artículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full bg-dark text-white py-10  overflow-hidden'>
      {/* Error message */}
      {error && (
        <div className="mb-4 mx-auto max-w-7xl p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400">
          {error}
        </div>
      )}
      <div className='max-w-7xl mx-auto relative'>

        {/* Encabezado con botones de paginación (solo escritorio) */}
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-primary'>Artículos destacados</h2>

          <div className='flex items-center gap-4'>
            <a href='#' className='text-primary font-primary text-xl hover:underline'>
              Ver todos
            </a>

            {!isMobile && (
              <div className='flex gap-2'>
                <button onClick={prevPage} disabled={currentPage === 0} aria-label="Anterior">
                  <Image src={izq} alt="Flecha izquierda" width={44} height={44} />
                </button>
                <button onClick={nextPage} disabled={currentPage >= totalPages - 1} aria-label="Siguiente">
                  <Image src={der} alt="Flecha derecha" width={44} height={44} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tarjetas - envoltorio con animación según dirección */}
        <div className="overflow-hidden">
          <div
            key={currentPage}
            className={`${direction === 1 ? "slide-from-right" : direction === -1 ? "slide-from-left" : ""} grid grid-cols-1 sm:grid-cols-3 gap-6`}
          >
            {visibleArticles.map((article, index) => (
              <div key={article.id || index} className='bg-dark rounded-xl overflow-hidden md:shadow-md flex flex-col justify-between'>
                {/* Imagen */}
                <div className="w-full aspect-[4/3] relative">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover rounded-t-xl"
                  />
                </div>

                {/* Contenido */}
                <div className='p-4 flex flex-col justify-between flex-grow'>
                  <div>
                    <h3 className='text-text text-xl font-primary mb-2 leading-snug'>
                      {article.title}
                    </h3>
                    <p className='text-sm text-text font-primary line-clamp-3 leading-snug'>
                      {article.description}
                    </p>
                  </div>

                  {/* Leer más + Navegación (solo móvil) */}
                  <div className='mt-6'>
                    <button
                      className={`bg-azulsub text-text text-sm font-primary rounded-2xl hover:bg-gray-200 transition
                      ${isMobile ? 'w-full py-4 px-6' : 'w-auto py-3 px-6'}`}>
                      LEER MÁS
                    </button>

                    {/* Navegación dentro de tarjeta (solo móvil) */}
                    {isMobile && (
                      <div className='flex justify-end gap-2 mt-4'>
                        <button onClick={prevPage} disabled={currentPage === 0} aria-label="Anterior">
                          <Image src={izq} alt="Flecha izquierda" width={44} height={44} />
                        </button>
                        <button onClick={nextPage} disabled={currentPage >= totalPages - 1} aria-label="Siguiente">
                          <Image src={der} alt="Flecha derecha" width={44} height={44} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Estilos de la animación (puedes mover esto a tu CSS global si prefieres) */}
      <style jsx>{`
        .slide-from-right {
          animation: slideFromRight 300ms ease both;
        }
        .slide-from-left {
          animation: slideFromLeft 300ms ease both;
        }
        @keyframes slideFromRight {
          from {
            transform: translateX(30%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideFromLeft {
          from {
            transform: translateX(-30%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ArticulosDestacados;
