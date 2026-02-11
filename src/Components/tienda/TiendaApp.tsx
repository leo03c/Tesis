"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useFavorites } from "@/contexts/FavoritesContext";
import {
  getBestOffers,
  getFreeGames,
  getGames,
  getMostDownloaded,
  getPlatforms,
  getTags,
  getTopRated,
} from "@/services/gamesService";
import type { Game, Tag, Platform } from "@/services/gamesService";
import { APIError } from "@/services/api";
import Loading from "@/Components/loading/Loading";
import GameCard from "@/Components/game/GameCard";
import GameCarouselSection from "@/Components/game/GameCarouselSection";

const izq = "/icons/izquierdaC.svg";
const der = "/icons/derechaC.svg";
const defaultOrdering = "-rating";

const TiendaApp = () => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [direction, setDirection] = useState(0);
  const [juegos, setJuegos] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState(defaultOrdering);
  const [tagFilter, setTagFilter] = useState<string>("");
  const [platformFilter, setPlatformFilter] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<string>("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [sectionErrors, setSectionErrors] = useState<Record<string, string | null>>({});
  const [sectionApiUrls, setSectionApiUrls] = useState<Record<string, string | null>>({});
  const [topRated, setTopRated] = useState<Game[]>([]);
  const [mostDownloaded, setMostDownloaded] = useState<Game[]>([]);
  const [bestOffers, setBestOffers] = useState<Game[]>([]);
  const [freeGames, setFreeGames] = useState<Game[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 640 ? 1 : 3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [tagsResponse, platformsResponse] = await Promise.all([
          getTags(),
          getPlatforms(),
        ]);
        setTags(tagsResponse.results || []);
        setPlatforms(platformsResponse.results || []);
      } catch (err) {
        console.error("Error fetching filters:", err);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const params: Record<string, string | number | boolean> = {
          ordering,
        };
        if (search.trim()) {
          params.search = search.trim();
        }
        if (tagFilter) {
          params.tags = tagFilter;
        }
        if (platformFilter) {
          params.plataformas = platformFilter;
        }
        if (priceFilter) {
          params.price = priceFilter;
        }

        const response = await getGames(params);
        setJuegos(response.results);
        setError(null);
        setApiUrl(null);
      } catch (err) {
        console.error("Error fetching games:", err);
        if (err instanceof APIError) {
          setError(err.message);
          setApiUrl(err.url ?? null);
        } else {
          setError("No se pudieron cargar los juegos");
          setApiUrl(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [ordering, search, tagFilter, platformFilter, priceFilter]);

  useEffect(() => {
    const fetchSections = async () => {
      setSectionsLoading(true);
      const results = await Promise.allSettled([
        getTopRated(),
        getMostDownloaded(),
        getBestOffers(),
        getFreeGames(),
      ]);

      const nextErrors: Record<string, string | null> = {};
      const nextUrls: Record<string, string | null> = {};

      const mapResult = (
        key: string,
        result: PromiseSettledResult<Game[]>,
        setter: (games: Game[]) => void
      ) => {
        if (result.status === "fulfilled") {
          setter(result.value || []);
          nextErrors[key] = null;
          nextUrls[key] = null;
          return;
        }

        const reason = result.reason as unknown;
        const message = reason instanceof APIError ? reason.message : "No se pudieron cargar.";
        const url = reason instanceof APIError ? reason.url ?? null : null;
        setter([]);
        nextErrors[key] = message;
        nextUrls[key] = url;
      };

      mapResult("topRated", results[0], setTopRated);
      mapResult("mostDownloaded", results[1], setMostDownloaded);
      mapResult("bestOffers", results[2], setBestOffers);
      mapResult("freeGames", results[3], setFreeGames);

      setSectionErrors(nextErrors);
      setSectionApiUrls(nextUrls);
      setSectionsLoading(false);
    };

    fetchSections();
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

  const resetFilters = () => {
    setSearch("");
    setOrdering(defaultOrdering);
    setTagFilter("");
    setPlatformFilter("");
    setPriceFilter("");
  };

  return (
    <div className="min-h-screen text-white">
      {/* Header con estilo hero */}
      <div className="relative rounded-3xl bg-gradient-to-br from-deep via-subdeep to-deep overflow-hidden mb-8">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5"></div>
        <div className="relative py-12 px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
            Tienda de Juegos
          </h1>
          <p className="text-texInactivo text-lg max-w-2xl mx-auto">
            Descubre los mejores juegos, ofertas exclusivas y novedades
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="rounded-3xl bg-deep text-white py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar de Filtros */}
          <aside className="bg-gradient-to-b from-subdeep to-deep rounded-2xl p-6 h-fit border border-gray-800/50 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <h2 className="text-lg font-semibold">Filtros</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-xs text-texInactivo uppercase tracking-wide mb-2 block">Buscar</label>
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Nombre del juego..."
                    className="w-full rounded-xl bg-deep border border-gray-700/50 px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all pl-10"
                  />
                  <svg className="w-4 h-4 text-texInactivo absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <label className="text-xs text-texInactivo uppercase tracking-wide mb-2 block">Ordenar por</label>
                <select
                  value={ordering}
                  onChange={(e) => setOrdering(e.target.value)}
                  className="w-full rounded-xl bg-deep border border-gray-700/50 px-4 py-3 text-sm focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  <option value="-rating">Mejor valorados</option>
                  <option value="-download_count">Más descargados</option>
                  <option value="price">Precio: menor a mayor</option>
                  <option value="-price">Precio: mayor a menor</option>
                  <option value="-release_date">Más recientes</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-texInactivo uppercase tracking-wide mb-2 block">Categoría</label>
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="w-full rounded-xl bg-deep border border-gray-700/50 px-4 py-3 text-sm focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  <option value="">Todas las categorías</option>
                  {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-texInactivo uppercase tracking-wide mb-2 block">Plataforma</label>
                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="w-full rounded-xl bg-deep border border-gray-700/50 px-4 py-3 text-sm focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  <option value="">Todas las plataformas</option>
                  {platforms.map((platform) => (
                    <option key={platform.id} value={platform.id}>
                      {platform.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-texInactivo uppercase tracking-wide mb-2 block">Precio</label>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full rounded-xl bg-deep border border-gray-700/50 px-4 py-3 text-sm focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  <option value="">Todos los precios</option>
                  <option value="0">Gratis</option>
                  <option value="1">De pago</option>
                </select>
              </div>
              <button
                onClick={resetFilters}
                className="w-full rounded-xl border border-gray-700/50 px-4 py-3 text-sm hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Limpiar filtros
              </button>
            </div>
          </aside>

          {/* Catálogo Principal */}
          <div>
            {loading ? (
              <Loading message="Cargando juegos..." />
            ) : error ? (
              <div className="text-center py-12 bg-subdeep/30 rounded-2xl border border-gray-800/50">
                <svg className="w-16 h-16 text-texInactivo mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-texInactivo text-lg mb-2">{error}</p>
                {apiUrl && (
                  <p className="text-texInactivo text-xs">
                    API: <span className="text-primary">{apiUrl}</span>
                  </p>
                )}
              </div>
            ) : juegos.length === 0 ? (
              <div className="text-center py-12 bg-subdeep/30 rounded-2xl border border-gray-800/50">
                <svg className="w-16 h-16 text-texInactivo mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-texInactivo text-lg">No se encontraron juegos</p>
                <p className="text-texInactivo text-sm mt-2">Intenta ajustar los filtros</p>
              </div>
            ) : (
              <div>
                {/* Header del catálogo */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold">Catálogo</h2>
                    <p className="text-texInactivo text-sm">{juegos.length} juegos encontrados</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-3">
                    <span className="text-texInactivo text-sm">
                      Página {currentPage + 1} de {totalPages}
                    </span>
                    <div className="flex gap-1">
                      <button 
                        onClick={prevPage} 
                        disabled={currentPage === 0}
                        className={`p-2 rounded-lg border border-gray-700/50 transition-all ${currentPage === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:border-primary hover:text-primary'}`}
                      >
                        <Image src={izq} alt="anterior" width={24} height={24} />
                      </button>
                      <button 
                        onClick={nextPage} 
                        disabled={currentPage >= totalPages - 1}
                        className={`p-2 rounded-lg border border-gray-700/50 transition-all ${currentPage >= totalPages - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:border-primary hover:text-primary'}`}
                      >
                        <Image src={der} alt="siguiente" width={24} height={24} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Grid de juegos */}
                <div className="overflow-hidden">
                  <div
                    key={currentPage}
                    className={`${
                      direction === 1
                        ? "slide-from-right"
                        : direction === -1
                          ? "slide-from-left"
                          : ""
                    } grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5`}
                  >
                    {visibleGames.map((juego) => (
                      <GameCard
                        key={juego.id}
                        game={juego}
                        showFavorite
                        isFavorite={isFavorite}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                </div>

                {/* Paginación móvil */}
                <div className="flex justify-center items-center gap-4 mt-6 sm:hidden">
                  <button 
                    onClick={prevPage} 
                    disabled={currentPage === 0}
                    className={`p-2 rounded-lg border border-gray-700/50 ${currentPage === 0 ? 'opacity-40' : ''}`}
                  >
                    <Image src={izq} alt="anterior" width={32} height={32} />
                  </button>
                  <span className="text-texInactivo text-sm">
                    {currentPage + 1} / {totalPages}
                  </span>
                  <button 
                    onClick={nextPage} 
                    disabled={currentPage >= totalPages - 1}
                    className={`p-2 rounded-lg border border-gray-700/50 ${currentPage >= totalPages - 1 ? 'opacity-40' : ''}`}
                  >
                    <Image src={der} alt="siguiente" width={32} height={32} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Secciones de carrusel */}
        <div className="mt-12 space-y-2">
          <GameCarouselSection
            title="Mejor valorados"
            games={topRated}
            loading={sectionsLoading}
            error={sectionErrors.topRated}
            apiUrl={sectionApiUrls.topRated}
            showFavorite
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
          <GameCarouselSection
            title="Más descargados"
            games={mostDownloaded}
            loading={sectionsLoading}
            error={sectionErrors.mostDownloaded}
            apiUrl={sectionApiUrls.mostDownloaded}
            showFavorite
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
          <GameCarouselSection
            title="Mejores ofertas"
            games={bestOffers}
            loading={sectionsLoading}
            error={sectionErrors.bestOffers}
            apiUrl={sectionApiUrls.bestOffers}
            showFavorite
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
          <GameCarouselSection
            title="Juegos Gratis"
            games={freeGames}
            loading={sectionsLoading}
            error={sectionErrors.freeGames}
            apiUrl={sectionApiUrls.freeGames}
            showFavorite
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
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

export default TiendaApp;
