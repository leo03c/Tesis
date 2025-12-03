"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useFavorites } from "@/lib/hooks/useFavorites";

const izq = "/icons/izquierdaC.svg";
const der = "/icons/derechaC.svg";
const star = "/icons/star 5.svg";

const FavoritosApp = () => {
  const { favorites, isLoading, error, removeFavorite } = useFavorites();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 640 ? 1 : 3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(favorites.length / itemsPerPage);

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
  const visibleGames = favorites.slice(startIndex, startIndex + itemsPerPage);

  const handleRemoveFavorite = async (id: number) => {
    try {
      await removeFavorite(id);
    } catch {
      // Error is handled in the hook
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-texInactivo">Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-subprimary transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Me Gustan</h1>
        <p className="text-texInactivo">Juegos que has marcado como favoritos ({favorites.length})</p>
      </div>

      {/* Favorites Grid */}
      {favorites.length > 0 && (
        <div className="my-4 rounded-3xl bg-deep text-white py-10 px-6">
          <div className="max-w-7xl mx-auto relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-primary">Tus Favoritos</h2>
              <div className="hidden sm:flex items-center gap-2">
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
                {visibleGames.map((favorite) => (
                  <div key={favorite.id} className="bg-subdeep rounded-xl overflow-hidden md:shadow-md relative group">
                    {/* Image */}
                    <div className="w-full aspect-[4/3] relative">
                      <Image
                        src={favorite.game.image || "/pic4.jpg"}
                        alt={favorite.game.title}
                        fill
                        className="object-cover rounded-t-xl"
                      />
                      <button 
                        onClick={() => handleRemoveFavorite(favorite.id)}
                        className="absolute top-2 right-2 bg-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 pb-6">
                      <div className="flex gap-2 mb-2 flex-wrap">
                        {favorite.game.tags?.map((tag) => (
                          <span
                            key={tag.id}
                            className="bg-categorico text-xs px-2 py-1 rounded-md text-white"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-base font-semibold">{favorite.game.title}</h3>
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
                            {(favorite.game.rating || 5.0).toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-texInactivo text-xs">Añadido: {formatDate(favorite.added_at)}</p>
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
      )}

      {/* Empty state message when no favorites */}
      {favorites.length === 0 && (
        <div className="rounded-3xl bg-deep py-20 px-6 text-center">
          <div className="w-20 h-20 bg-subdeep rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-texInactivo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No tienes favoritos aún</h3>
          <p className="text-texInactivo mb-6">Explora la tienda y marca juegos que te gusten</p>
          <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-subprimary transition">
            Explorar Tienda
          </button>
        </div>
      )}
    </div>
  );
};

export default FavoritosApp;
