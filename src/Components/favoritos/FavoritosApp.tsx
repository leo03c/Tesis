"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from 'next-auth/react';
import { useFavorites } from "@/contexts/FavoritesContext";
import { getFavorites } from "@/services/favoritesService";
import type { Game } from "@/services/gamesService";
import { APIError } from "@/services/api";
import Loading from "@/Components/loading/Loading";

const izq = "/icons/izquierdaC.svg";
const der = "/icons/derechaC.svg";
import StarRating from "@/Components/StarRating";
const pic4 = "/pic4.jpg";
const coraB = "/icons/coraB.svg";
const coraR = "/icons/coraR.svg";

const FavoritosApp = () => {
  const { data: session, status } = useSession();
  const { toggleFavorite, isFavorite, favorites } = useFavorites();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [direction, setDirection] = useState(0);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiUrl, setApiUrl] = useState<string | null>(null);

  // Debug logs
  useEffect(() => {
    console.log('=== DEBUG FAVORITOS ===');
    console.log('Session status:', status);
    console.log('Session data:', session);
    console.log('Favorites from context:', favorites);
  }, [status, session, favorites]);

  useEffect(() => {
    const fetchFavorites = async () => {
      console.log('fetchFavorites called, status:', status);
      
      // Solo cargar si está autenticado
      if (status !== 'authenticated') {
        console.log('Not authenticated, skipping fetch');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching favorites...');
        const response = await getFavorites();
        console.log('Favorites response:', response);

        if (!response || !Array.isArray(response.results)) {
          console.error('La respuesta de la API de favoritos no tiene el formato esperado:', response);
          setAllGames([]);
          setApiUrl(null);
          return;
        }

        const games = response.results.map(fav => fav.game);
        console.log('Games extracted:', games);

        setAllGames(games);
        setApiUrl(null);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        if (err instanceof APIError) {
          console.error('API Error details:', {
            status: err.status,
            url: err.url,
            data: err.data
          });
          setApiUrl(err.url);
        }
        setAllGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [status]);

  const favoritos = useMemo(() => {
    const filtered = allGames.filter(game => isFavorite(game.id));
    console.log('Favoritos filtrados:', filtered.length, 'de', allGames.length);
    return filtered;
  }, [allGames, favorites]);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 640 ? 1 : 3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(favoritos.length / itemsPerPage);

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
  const visibleGames = favoritos.slice(startIndex, startIndex + itemsPerPage);

  // Mostrar loading mientras se verifica la sesión
  if (status === 'loading') {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <Loading message="Verificando sesión..." />
      </div>
    );
  }

  // Mostrar mensaje de login si no está autenticado
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen text-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Me Gustan</h1>
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
            <p className="text-texInactivo mb-4">Debes iniciar sesión para ver tus juegos favoritos</p>
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

  // Mostrar loading mientras carga los favoritos
  if (loading) {
    return (
      <div className="min-h-screen text-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Me Gustan</h1>
          <p className="text-texInactivo">Cargando tus juegos favoritos...</p>
        </div>
        <div className="my-4 rounded-3xl bg-deep text-white py-10 px-6">
          <Loading message="Cargando favoritos..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Me Gustan</h1>
        <p className="text-texInactivo">
          Juegos que has marcado como favoritos ({favoritos.length})
          {apiUrl && <span className="text-xs ml-2">| API: {apiUrl}</span>}
        </p>
      </div>

      <div className="my-4 rounded-3xl bg-deep text-white py-10 px-6">
        <div className="max-w-7xl mx-auto relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-primary">Tus Favoritos</h2>
            {favoritos.length > itemsPerPage && (
              <div className="hidden sm:flex items-center gap-2">
                <button onClick={prevPage} disabled={currentPage === 0}>
                  <Image src={izq} alt="izquierda" width={44} height={44} />
                </button>
                <button onClick={nextPage} disabled={currentPage >= totalPages - 1}>
                  <Image src={der} alt="derecha" width={44} height={44} />
                </button>
              </div>
            )}
          </div>

          {favoritos.length > 0 ? (
            <>
              <div className="overflow-hidden">
                <div
                  key={currentPage}
                  className={`${
                    direction === 1 ? "slide-from-right" : direction === -1 ? "slide-from-left" : ""
                  } grid grid-cols-1 sm:grid-cols-3 gap-6`}
                >
                  {visibleGames.map((juego) => (
                    <Link key={juego.id} href={`/juego/${juego.slug}`}>
                      <div className="bg-subdeep rounded-xl overflow-hidden md:shadow-md relative group cursor-pointer hover:scale-105 transition-transform">
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
                            type="button"
                            className="absolute right-3 top-3 z-10"
                          >
                            <Image
                              src={isFavorite(juego.id) ? coraR : coraB}
                              alt="heart"
                              width={56}
                              height={56}
                            />
                          </button>
                        </div>

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
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-base font-semibold">{juego.title}</h3>
                            <StarRating rating={juego.rating} />
                          </div>
                          <p className="text-texInactivo text-xs">
                            {parseFloat(juego.price) === 0 ? 'GRATIS' : `$${juego.final_price}`}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {favoritos.length > itemsPerPage && (
                <div className="flex justify-end gap-2 mt-6 sm:hidden">
                  <button onClick={prevPage} disabled={currentPage === 0}>
                    <Image src={izq} alt="izquierda" width={44} height={44} />
                  </button>
                  <button onClick={nextPage} disabled={currentPage >= totalPages - 1}>
                    <Image src={der} alt="derecha" width={44} height={44} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-subdeep rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-texInactivo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No tienes favoritos aún</h3>
              <p className="text-texInactivo mb-2">Explora la tienda y marca juegos que te gusten</p>
              <p className="text-xs text-texInactivo">
                Debug: allGames={allGames.length}, favorites={favorites.size}
              </p>
            </div>
          )}
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
    </div>
  );
};

export default FavoritosApp;
