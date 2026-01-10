"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { getFeaturedNews } from "@/services/newsService";
import type { NewsArticle } from "@/services/newsService";
import Loading from "@/Components/loading/Loading";

const der = "/icons/derecha.svg";
const izq = "/icons/izquierda.svg";
const pic1 = "/pic1.jpg";

const ArticulosDestacados = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [direction, setDirection] = useState(0);

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

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await getFeaturedNews();
        setArticles(response.results);
        setError(null);
      } catch (err) {
        console.error('Error fetching featured news:', err);
        setError('No se pudieron cargar los artículos');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
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

  if (loading) {
    return (
      <div className='w-full bg-dark text-white py-10'>
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-xl font-primary mb-6'>Artículos destacados</h2>
          <Loading message="Cargando artículos destacados..." />
        </div>
      </div>
    );
  }

  if (error || articles.length === 0) {
    return (
      <div className='w-full bg-dark text-white py-10'>
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-xl font-primary mb-6'>Artículos destacados</h2>
          <p className='text-texInactivo text-center py-8'>
            {error || 'No hay artículos destacados disponibles'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full bg-dark text-white py-10  overflow-hidden'>
      <div className='max-w-7xl mx-auto relative'>
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
        <div className="overflow-hidden">
          <div
            key={currentPage}
            className={`${direction === 1 ? "slide-from-right" : direction === -1 ? "slide-from-left" : ""} grid grid-cols-1 sm:grid-cols-3 gap-6`}
          >
            {visibleArticles.map((article, index) => (
              <div key={index} className='bg-dark rounded-xl overflow-hidden md:shadow-md flex flex-col justify-between'>
                <div className="w-full aspect-[4/3] relative">
                  <Image
                    src={article.image || pic1}
                    alt={article.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover rounded-t-xl"
                  />
                </div>
                <div className='p-4 flex flex-col justify-between flex-grow'>
                  <div>
                    <h3 className='text-text text-xl font-primary mb-2 leading-snug'>
                      {article.title}
                    </h3>
                    <p className='text-sm text-text font-primary line-clamp-3 leading-snug'>
                      {article.description}
                    </p>
                  </div>
                  <div className='mt-6'>
                    <button
                      className={`bg-azulsub text-text text-sm font-primary rounded-2xl hover:bg-gray-200 transition
                      ${isMobile ? 'w-full py-4 px-6' : 'w-auto py-3 px-6'}`}>
                      LEER MÁS
                    </button>
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
