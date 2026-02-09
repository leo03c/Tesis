"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from 'react-icons/fa'; // Importa los iconos de estrellas
import { useFavorites } from "@/contexts/FavoritesContext";
import { getFreeGames } from "@/services/gamesService";
import type { Game } from "@/services/gamesService";
import { APIError } from "@/services/api";
import Loading from "@/Components/loading/Loading";

const izq = "/icons/izquierdaC.svg";
const der = "/icons/derechaC.svg";
const coraB = "/icons/coraB.svg";
const coraR = "/icons/coraR.svg";
const pic4 = "/pic4.jpg";

const JuegosGratis = () => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string | null>(null);
  const [direction, setDirection] = useState(0);

  // Helper para formatear rating y calcular estrellas
  const getRatingInfo = (rating: string | number | undefined) => {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : (rating || 0);
    const ratingValue = typeof numRating === 'number' ? numRating : 0;
    const filledStars = Math.floor(ratingValue);
    const formattedRating = ratingValue.toFixed(1);
    
    return { ratingValue, filledStars, formattedRating };
  };

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 640 ? 1 : 3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchFreeGames = async () => {
      try {
        setLoading(true);
        const response = await getFreeGames();
        
        // La API devuelve un array directamente, no estructura paginada
        setGames(response || []);
        setError(null);
        setApiUrl(null);
      } catch (err) {
        console.error('Error fetching free games:', err);
        if (err instanceof APIError) {
          setError(err.message);
          setApiUrl(err.url);
        } else {
          setError('No se pudieron cargar los juegos gratis');
          setApiUrl(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFreeGames();
  }, []);

  const totalPages = Math.ceil(games.length / itemsPerPage);

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
  const visibleGames = games.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="my-4 rounded-3xl bg-deep text-white py-10 px-6">
        <h2 className="text-xl font-primary mb-6">Juegos gratis</h2>
        <Loading message="Cargando juegos gratis..." />
      </div>
    );
  }

  if (error || games.length === 0) {
    return (
      <div className="my-4 rounded-3xl bg-deep text-white py-10 px-6">
        <h2 className="text-xl font-primary mb-6">Juegos gratis</h2>
        <div className='text-center py-8'>
          <p className='text-texInactivo mb-2'>
            {error || 'No hay juegos gratis disponibles'}
          </p>
          {apiUrl && (
            <p className='text-texInactivo text-xs mt-2'>
              URL: <span className='text-primary'>{apiUrl}</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="my-4 rounded-3xl bg-deep text-white py-10 px-6">
      <div className="max-w-7xl mx-auto relative">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-primary">Juegos gratis</h2>
          <div className="hidden sm:flex items-center gap-2">
            <a href="#" className="text-primary text-xl hover:underline">
              Ver todos
            </a>
            <button 
              onClick={prevPage} 
              disabled={currentPage === 0}
              className={`p-2 rounded-full ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
            >
              <Image src={izq} alt="izquierda" width={44} height={44} />
            </button>
            <button 
              onClick={nextPage} 
              disabled={currentPage >= totalPages - 1}
              className={`p-2 rounded-full ${currentPage >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
            >
              <Image src={der} alt="derecha" width={44} height={44} />
            </button>
          </div>
        </div>

        {/* Tarjetas */}
        <div className="overflow-hidden">
          <div
            key={currentPage}
            className={`${
              direction === 1 ? "slide-from-right" : direction === -1 ? "slide-from-left" : ""
            } grid grid-cols-1 sm:grid-cols-3 gap-6`}
          >
            {visibleGames.map((juego) => {
              const { filledStars, formattedRating } = getRatingInfo(juego.rating);
              
              return (
                <Link key={juego.id} href={`/juego/${juego.slug}`}>
                  <div className="bg-deep rounded-xl overflow-hidden md:shadow-md relative cursor-pointer hover:scale-105 transition-transform duration-300">
                    {/* Imagen */}
                    <div className="w-full aspect-[4/3] relative">
                      <Image
                        src={juego.image || pic4}
                        alt={juego.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover rounded-t-xl"
                      />
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(juego.id);
                        }}
                        className="absolute top-2 right-2 transition-transform hover:scale-110 z-10"
                      >
                        <Image 
                          src={isFavorite(juego.id) ? coraR : coraB} 
                          alt="heart" 
                          width={56} 
                          height={56} 
                        />
                      </button>
                    </div>

                    {/* Contenido */}
                    <div className="p-4 pb-6">
                      <div className="flex gap-2 mb-2 flex-wrap">
                        {(juego.tags || []).slice(0, 3).map((tag) => (
                          <span
                            key={tag.id}
                            className="bg-categorico text-xs px-2 py-1 rounded-md text-white"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <h3 className="text-base font-semibold">{juego.title}</h3>
                        <div className="flex items-center gap-1">
                          {/* Estrellas con react-icons */}
                          {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="flex items-center">
                              {index < filledStars ? (
                                <FaStar className="text-yellow-500 text-sm" />
                              ) : (
                                <FaStar className="text-gray-400 text-sm" />
                              )}
                            </div>
                          ))}
                          <span className="text-xs font-medium ml-1">
                            {formattedRating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Botones móviles */}
        <div className="flex justify-end gap-2 mt-6 sm:hidden">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 0}
            className={`p-2 rounded-full ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
          >
            <Image src={izq} alt="izquierda" width={44} height={44} />
          </button>
          <button 
            onClick={nextPage} 
            disabled={currentPage >= totalPages - 1}
            className={`p-2 rounded-full ${currentPage >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
          >
            <Image src={der} alt="derecha" width={44} height={44} />
          </button>
        </div>
      </div>

      {/* Estilos de la animación */}
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

export default JuegosGratis;