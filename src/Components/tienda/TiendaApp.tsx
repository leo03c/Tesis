"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useFavorites } from "@/contexts/FavoritesContext";
import { getGames } from "@/services/gamesService";
import type { Game } from "@/services/gamesService";
import { APIError } from "@/services/api";
import Loading from "@/Components/loading/Loading";

const izq = "/icons/izquierdaC.svg";
const der = "/icons/derechaC.svg";
const coraB = "/icons/coraB.svg"; // Blank/gray heart
const coraR = "/icons/coraR.svg"; // Red heart
const star = "/icons/star 5.svg";
const pic4 = "/pic4.jpg";

const TiendaApp = () => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [direction, setDirection] = useState(0);
  const [juegos, setJuegos] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 640 ? 1 : 3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await getGames();
        setJuegos(response.results);
        setError(null);
        setApiUrl(null);
      } catch (err) {
        console.error('Error fetching games:', err);
        if (err instanceof APIError) {
          setError(err.message);
          setApiUrl(err.url);
        } else {
          setError('No se pudieron cargar los juegos');
          setApiUrl(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const totalPages = Math.ceil(juegos.length / itemsPerPage);

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
  const visibleGames = juegos.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tienda de Juegos</h1>
        <p className="text-texInactivo">Descubre los mejores juegos y ofertas exclusivas</p>
      </div>

      {/* Featured Section */}
      <div className="my-4 rounded-3xl bg-deep text-white py-10 px-6">
        {loading ? (
          <Loading message="Cargando juegos de la tienda..." />
        ) : error || juegos.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-texInactivo mb-2'>
              {error || 'No hay juegos disponibles en la tienda'}
            </p>
            {apiUrl && (
              <p className='text-texInactivo text-xs mt-2'>
                URL: <span className='text-primary'>{apiUrl}</span>
              </p>
            )}
          </div>
        ) : (
        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-primary">Destacados</h2>
            <div className="hidden sm:flex items-center gap-2">
              <a href="#" className="text-primary text-xl hover:underline">
                Ver todos
              </a>
              <button onClick={prevPage} disabled={currentPage === 0}>
                <Image src={izq} alt="izquierda" width={44} height={44} />
              </button>
              <button onClick={nextPage} disabled={currentPage >= totalPages - 1}>
                <Image src={der} alt="derecha" width={44} height={44} />
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="overflow-hidden">
            <div
              key={currentPage}
              className={`${
                direction === 1 ? "slide-from-right" : direction === -1 ? "slide-from-left" : ""
              } grid grid-cols-1 sm:grid-cols-3 gap-6`}
            >
              {visibleGames.map((juego, i) => (
                <div key={i} className="bg-subdeep rounded-xl overflow-hidden md:shadow-md relative">
                  {/* Image */}
                  <div className="w-full aspect-[4/3] relative">
                    <Image
                      src={juego.image || pic4}
                      alt={juego.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover rounded-t-xl"
                    />
                    <button 
                      onClick={() => toggleFavorite(juego.id)}
                      className="absolute top-2 right-2 transition-transform hover:scale-110"
                    >
                      <Image 
                        src={isFavorite(juego.id) ? coraR : coraB} 
                        alt="heart" 
                        width={56} 
                        height={56} 
                      />
                    </button>
                    {juego.price && juego.price > 0 && (
                      <div className="absolute top-2 left-2 bg-primary px-3 py-1 rounded-lg text-sm font-bold">
                        OFERTA
                      </div>
                    )}
                  </div>

                  {/* Content */}
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
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-base font-semibold">{juego.title}</h3>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, k) => (
                          <Image
                            key={k}
                            src={star}
                            alt="estrella"
                            width={14}
                            height={14}
                          />
                        ))}
                        <span className="text-xs font-medium ml-1">
                          {parseFloat(juego.rating || '0').toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-baseline">
                        <span className="text-xl font-bold text-primary">
                          {parseFloat(juego.price) === 0 ? "GRATIS" : `$${juego.final_price}`}
                        </span>
                      </div>
                      <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm hover:bg-subprimary transition">
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile buttons */}
          <div className="flex justify-end gap-2 mt-6 sm:hidden">
            <button onClick={prevPage} disabled={currentPage === 0}>
              <Image src={izq} alt="izquierda" width={44} height={44} />
            </button>
            <button onClick={nextPage} disabled={currentPage >= totalPages - 1}>
              <Image src={der} alt="derecha" width={44} height={44} />
            </button>
          </div>
        </div>
        )}

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
    </div>
  );
};

export default TiendaApp;
