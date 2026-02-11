"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/contexts/FavoritesContext";
import { APIError } from "@/services/api";
import {
  getBestOffers,
  getFreeGames,
  getGames,
  getMostDownloaded,
  getTags,
  getTopRated,
} from "@/services/gamesService";
import type { Game, Tag } from "@/services/gamesService";
import Loading from "@/Components/loading/Loading";
import GameCarouselSection from "@/Components/game/GameCarouselSection";
import GameGridSection from "@/Components/game/GameGridSection";

const fallbackHero = "/pic4.jpg";

const DescubrirApp = () => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [sectionErrors, setSectionErrors] = useState<Record<string, string | null>>({});
  const [sectionApiUrls, setSectionApiUrls] = useState<Record<string, string | null>>({});

  const [topRated, setTopRated] = useState<Game[]>([]);
  const [mostDownloaded, setMostDownloaded] = useState<Game[]>([]);
  const [bestOffers, setBestOffers] = useState<Game[]>([]);
  const [freeGames, setFreeGames] = useState<Game[]>([]);
  const [latestGames, setLatestGames] = useState<Game[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchSections = async () => {
      setSectionsLoading(true);
      const results = await Promise.allSettled([
        getMostDownloaded(),
        getTopRated(),
        getBestOffers(),
        getFreeGames(),
        getGames({ ordering: "-release_date", page_size: 6 }),
        getTags(),
      ]);

      const nextErrors: Record<string, string | null> = {};
      const nextUrls: Record<string, string | null> = {};

      const mapArrayResult = (
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

      const mapListResult = (
        key: string,
        result: PromiseSettledResult<{ results: Game[] }>,
        setter: (games: Game[]) => void
      ) => {
        if (result.status === "fulfilled") {
          setter(result.value?.results || []);
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

      const mapTagsResult = (
        key: string,
        result: PromiseSettledResult<{ results: Tag[] }>,
        setter: (items: Tag[]) => void
      ) => {
        if (result.status === "fulfilled") {
          setter(result.value?.results || []);
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

      mapArrayResult("mostDownloaded", results[0], setMostDownloaded);
      mapArrayResult("topRated", results[1], setTopRated);
      mapArrayResult("bestOffers", results[2], setBestOffers);
      mapArrayResult("freeGames", results[3], setFreeGames);
      mapListResult("latestGames", results[4], setLatestGames);
      mapTagsResult("tags", results[5], setTags);

      setSectionErrors(nextErrors);
      setSectionApiUrls(nextUrls);
      setSectionsLoading(false);
    };

    fetchSections();
  }, []);

  const heroGame = useMemo(() => {
    return (
      topRated[0] ||
      mostDownloaded[0] ||
      bestOffers[0] ||
      freeGames[0] ||
      latestGames[0] ||
      null
    );
  }, [topRated, mostDownloaded, bestOffers, freeGames, latestGames]);

  return (
    <div className="min-h-screen text-white">
      <section className="relative rounded-3xl bg-gradient-to-br from-deep via-subdeep to-deep overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_#5b8cff_0%,_transparent_55%)]" />
        <div className="relative px-6 py-12 lg:px-10 lg:py-16 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-1 text-xs uppercase tracking-[0.2em] text-primary">
              Explora la tienda
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Descubre nuevas aventuras, clasicos y ofertas exclusivas
            </h1>
            <p className="text-texInactivo text-lg max-w-xl">
              Recomendaciones frescas basadas en lo mas jugado, lanzamientos recientes y categorias que marcan tendencia.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/tienda-de-juegos"
                className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-subprimary transition"
              >
                Ir a la tienda
              </Link>
              <Link
                href="/categorias"
                className="px-6 py-3 rounded-xl border border-gray-700 text-white hover:border-primary transition"
              >
                Explorar categorias
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-texInactivo">
              <div className="px-3 py-2 rounded-lg bg-subdeep/60">Top valorados</div>
              <div className="px-3 py-2 rounded-lg bg-subdeep/60">Ofertas activas</div>
              <div className="px-3 py-2 rounded-lg bg-subdeep/60">Novedades</div>
            </div>
          </div>

          <div className="relative">
            {sectionsLoading ? (
              <div className="bg-subdeep/60 rounded-3xl p-8">
                <Loading message="Cargando recomendado..." />
              </div>
            ) : heroGame ? (
              <Link
                href={`/juego/${heroGame.slug}`}
                className="block bg-subdeep/70 rounded-3xl overflow-hidden border border-gray-800 hover:border-primary transition"
              >
                <div className="relative h-64">
                  <Image
                    src={heroGame.image || fallbackHero}
                    alt={heroGame.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-primary">
                      Recomendado hoy
                    </p>
                    <h2 className="text-2xl font-semibold mt-2">{heroGame.title}</h2>
                    <p className="text-sm text-texInactivo mt-2 line-clamp-2">
                      {heroGame.description || "Descubre mas sobre este lanzamiento destacado."}
                    </p>
                  </div>
                </div>
                <div className="p-5 flex items-center justify-between text-sm text-texInactivo">
                  <span>{heroGame.developer_name || "Estudio destacado"}</span>
                  <span className="text-primary font-semibold">Ver detalles</span>
                </div>
              </Link>
            ) : (
              <div className="bg-subdeep/60 rounded-3xl p-8 text-texInactivo text-sm">
                No hay recomendaciones disponibles por ahora.
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mt-10 space-y-2">
        <GameCarouselSection
          title="Tendencias"
          games={mostDownloaded}
          loading={sectionsLoading}
          error={sectionErrors.mostDownloaded}
          apiUrl={sectionApiUrls.mostDownloaded}
          showFavorite
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />
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
          title="Mejores ofertas"
          games={bestOffers}
          loading={sectionsLoading}
          error={sectionErrors.bestOffers}
          apiUrl={sectionApiUrls.bestOffers}
          showFavorite
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />
        <GameGridSection
          title="Novedades"
          games={latestGames}
          loading={sectionsLoading}
          error={sectionErrors.latestGames}
          emptyMessage="No hay novedades disponibles."
          showFavorite
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />
        <GameCarouselSection
          title="Juegos gratis"
          games={freeGames}
          loading={sectionsLoading}
          error={sectionErrors.freeGames}
          apiUrl={sectionApiUrls.freeGames}
          showFavorite
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />
      </div>

      <section className="mt-10 rounded-3xl bg-deep py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-primary">Explorar por categorias</h2>
            <Link href="/categorias" className="text-primary text-sm hover:underline">
              Ver todas
            </Link>
          </div>

          {sectionsLoading ? (
            <Loading message="Cargando categorias..." />
          ) : sectionErrors.tags ? (
            <p className="text-texInactivo text-sm">{sectionErrors.tags}</p>
          ) : tags.length === 0 ? (
            <p className="text-texInactivo text-sm">No hay categorias disponibles.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {tags.slice(0, 10).map((tag) => (
                <Link
                  key={tag.id}
                  href={`/categoria/${tag.slug}`}
                  className="group rounded-2xl border border-gray-800 px-4 py-3 bg-subdeep/40 hover:border-primary transition"
                >
                  <div className="text-sm font-semibold text-white group-hover:text-primary">
                    {tag.name}
                  </div>
                  <div className="text-xs text-texInactivo mt-1">Explorar juegos</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DescubrirApp;
