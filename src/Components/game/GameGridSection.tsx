"use client";

import React from "react";
import Loading from "@/Components/loading/Loading";
import type { Game } from "@/services/gamesService";
import GameCard from "@/Components/game/GameCard";

interface GameGridSectionProps {
  title: string;
  games: Game[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  showFavorite?: boolean;
  isFavorite?: (id: number) => boolean;
  onToggleFavorite?: (id: number) => void;
}

const GameGridSection: React.FC<GameGridSectionProps> = ({
  title,
  games,
  loading = false,
  error = null,
  emptyMessage = "No hay juegos disponibles.",
  showFavorite = false,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <section className="my-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-primary">{title}</h2>
      </div>

      {loading ? (
        <Loading message="Cargando juegos..." />
      ) : error ? (
        <p className="text-texInactivo text-sm">{error}</p>
      ) : games.length === 0 ? (
        <p className="text-texInactivo text-sm">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              showFavorite={showFavorite}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default GameGridSection;
