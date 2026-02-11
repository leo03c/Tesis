"use client";

import { useEffect, useState } from "react";
import Carrusel from "./Carrusel";
import Listado from "./Listado";
import { useFavorites } from "@/contexts/FavoritesContext";
import { APIError } from "@/services/api";
import {
  getBestOffers,
  getFreeGames,
  getMostDownloaded,
  getTopRated,
} from "@/services/gamesService";
import type { Game } from "@/services/gamesService";
import GameCarouselSection from "@/Components/game/GameCarouselSection";

const HomeApp = () => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [sectionErrors, setSectionErrors] = useState<Record<string, string | null>>({});
  const [sectionApiUrls, setSectionApiUrls] = useState<Record<string, string | null>>({});
  const [topRated, setTopRated] = useState<Game[]>([]);
  const [mostDownloaded, setMostDownloaded] = useState<Game[]>([]);
  const [bestOffers, setBestOffers] = useState<Game[]>([]);
  const [freeGames, setFreeGames] = useState<Game[]>([]);

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

  return (
    <div>
      <div>
        <Carrusel />
      </div>
      <div className="mt-10">
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
          title="Mas descargados"
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
       <div>
        <Listado />
      </div>
    </div>
  );
};
export default HomeApp