"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import StarRating from "@/Components/StarRating";
import type { Game } from "@/services/gamesService";

const pic4 = "/pic4.jpg";
const coraB = "/icons/coraB.svg";
const coraR = "/icons/coraR.svg";

interface GameCardProps {
  game: Game;
  showFavorite?: boolean;
  isFavorite?: (id: number) => boolean;
  onToggleFavorite?: (id: number) => void;
}

const GameCard: React.FC<GameCardProps> = ({
  game,
  showFavorite = false,
  isFavorite,
  onToggleFavorite,
}) => {
  const priceValue = parseFloat(game.price || "0");
  const hasOffer = priceValue > 0 && (game.discount || 0) > 0;
  const favoriteActive = showFavorite && isFavorite ? isFavorite(game.id) : false;

  return (
    <Link href={`/juego/${game.slug}`}>
      <div className="bg-subdeep rounded-xl overflow-hidden md:shadow-md relative cursor-pointer hover:scale-105 transition-transform">
        <div className="w-full aspect-[4/3] relative">
          <Image
            src={game.image || pic4}
            alt={game.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover rounded-t-xl"
          />
          {showFavorite && onToggleFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(game.id);
              }}
              className="absolute top-2 right-2 transition-transform hover:scale-110 z-10"
              aria-label={favoriteActive ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
              <Image
                src={favoriteActive ? coraR : coraB}
                alt="favorito"
                width={56}
                height={56}
              />
            </button>
          )}
          {hasOffer && (
            <div className="absolute top-2 left-2 bg-primary px-3 py-1 rounded-lg text-sm font-bold">
              OFERTA
            </div>
          )}
        </div>

        <div className="p-4 pb-6">
          <div className="flex gap-2 mb-2 flex-wrap">
            {(game.tags || []).slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="bg-categorico text-xs px-2 py-1 rounded-md text-white"
              >
                {tag.name}
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-semibold">{game.title}</h3>
            <StarRating rating={game.rating} />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-baseline">
              <span className="text-xl font-bold text-primary">
                {priceValue === 0 ? "GRATIS" : `$${game.final_price}`}
              </span>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm hover:bg-subprimary transition">
              Comprar
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
