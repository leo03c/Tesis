"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useFavorites } from "@/contexts/FavoritesContext";
import { getGamesByTagSlug, getTagBySlug } from "@/services/gamesService";
import type { Game } from "@/services/gamesService";
import { APIError } from "@/services/api";
import Loading from "@/Components/loading/Loading";

const coraB = "/icons/coraB.svg";
const coraR = "/icons/coraR.svg";
import StarRating from "@/Components/StarRating";
const pic4 = "/pic4.jpg";

const CategoriaDetalle = () => {
  const params = useParams();
  const slug = params.slug as string;
  const { isFavorite, toggleFavorite } = useFavorites();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>("");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const [gamesResponse, tagResponse] = await Promise.all([
          getGamesByTagSlug(slug),
          getTagBySlug(slug),
        ]);
        setGames(gamesResponse);
        setCategoryName(tagResponse?.name || slug);
        setError(null);
      } catch (err) {
        console.error('Error fetching games:', err);
        if (err instanceof APIError) {
          setError(err.message);
        } else {
          setError('No se pudieron cargar los juegos');
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchGames();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen text-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Cargando...</h1>
        </div>
        <div className="rounded-3xl bg-deep py-10 px-6">
          <Loading message="Cargando juegos de la categoría..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Error</h1>
        </div>
        <div className="rounded-3xl bg-deep py-10 px-6">
          <div className='text-center py-8'>
            <p className='text-texInactivo mb-2'>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
        <p className="text-texInactivo">
          {games.length} {games.length === 1 ? 'juego encontrado' : 'juegos encontrados'}
        </p>
      </div>

      {/* Games Grid */}
      <div className="rounded-3xl bg-deep py-10 px-6">
        {games.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-texInactivo mb-2'>No hay juegos en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games.map((juego) => (
              <Link key={juego.id} href={`/juego/${juego.slug}`}>
                <div className="bg-subdeep rounded-xl overflow-hidden md:shadow-md relative group cursor-pointer hover:scale-105 transition-transform">
                  {/* Imagen */}
                  <div className="w-full aspect-[4/3] relative">
                    <Image
                      src={juego.image || pic4}
                      alt={juego.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-base font-semibold truncate">{juego.title}</h3>
                      <StarRating rating={juego.rating} />
                    </div>
                    <p className="text-primary font-semibold">
                      {juego.final_price === "0.00" ? "GRATIS" : `$${juego.final_price}`}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriaDetalle;
