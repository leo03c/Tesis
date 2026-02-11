"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import StarRating from "@/Components/StarRating";
import { getFeaturedGames, getGames } from "@/services/gamesService";
import type { Game } from "@/services/gamesService";
import { APIError } from "@/services/api";
import Loading from "@/Components/loading/Loading";
import { useFavorites } from '@/contexts/FavoritesContext';

const pic4 = "/pic4.jpg";

interface ICardProps {
  game: Game;
}

const Card = ({ game }: ICardProps) => {
  return (
    <Link href={`/juego/${game.slug}`}>
      <div className="w-full min-w-[200px] max-w-[263px] h-[70px] md:h-[84px] flex items-center gap-3 md:gap-4 p-2 md:p-3 bg-[#1C2C3B] rounded-2xl md:rounded-3xl text-white hover:bg-[#283B4C] transition-colors cursor-pointer">
        <div className="relative w-[50px] h-[50px] md:w-[67px] md:h-[70px] flex-shrink-0">
          <Image 
            src={game.image || pic4} 
            alt={game.title} 
            fill
            className="object-cover rounded-lg md:rounded-xl"
            sizes="(max-width: 768px) 50px, 67px"
          />
        </div>
        <span className="text-xs md:text-sm font-medium truncate pr-2">{game.title}</span>
      </div>
    </Link>
  );
};

const Carrusel = () => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [featuredGame, setFeaturedGame] = useState<Game | null>(null);
  const [otherGames, setOtherGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const [featuredResponse, gamesResponse] = await Promise.all([
          getFeaturedGames(),
          getGames()
        ]);
        
        // Primer juego destacado para la tarjeta principal
        if (featuredResponse.results.length > 0) {
          setFeaturedGame(featuredResponse.results[0]);
        }
        
        // Otros 5 juegos para las tarjetas laterales
        setOtherGames(gamesResponse.results.slice(0, 5));
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

    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loading message="Cargando juegos..." />
      </div>
    );
  }

  if (error || !featuredGame) {
    return (
      <div className='w-full h-96 flex items-center justify-center text-center'>
        <p className='text-texInactivo'>{error || 'No hay juegos disponibles'}</p>
      </div>
    );
  }

  // Calcular el rating una vez para reutilizarlo
  const rating = parseFloat(String(featuredGame.rating)) || 0;

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 w-full">
      {/* Tarjeta principal */}
      <Link href={`/juego/${featuredGame.slug}`} className="relative w-full lg:w-[50%] aspect-[1.65] rounded-2xl overflow-hidden cursor-pointer group">
        <Image 
          src={featuredGame.image || pic4} 
          alt={featuredGame.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="flex justify-between items-center p-4 lg:p-5 absolute top-0 w-full z-10">
          <div className="flex gap-3 lg:gap-5 text-white">
            {featuredGame.tags.slice(0, 2).map((tag) => (
              <span 
                key={tag.id}
                className="px-4 py-1 text-sm lg:text-base text-center bg-white/30 rounded-lg"
              >
                {tag.name}
              </span>
            ))}
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(featuredGame.id);
            }}
            className="w-10 h-10 lg:w-14 lg:h-14 flex justify-center items-center bg-[#283B4C] rounded-2xl hover:bg-[#1C2C3B] transition-colors"
          >
            <Image 
              src={isFavorite(featuredGame.id) ? '/icons/coraR.svg' : '/icons/coraB.svg'} 
              alt="Favorito" 
              width={56} 
              height={56} 
            />
          </button>
        </div>
        
        <div className="flex flex-col gap-3 lg:gap-5 absolute bottom-5 lg:bottom-8 left-5 lg:left-8 z-10">
          <h2 className="text-xl lg:text-2xl font-bold text-white">
            {featuredGame.title}
          </h2>
          <p className="w-full lg:w-[55%] text-white text-sm lg:text-base line-clamp-3">
            {featuredGame.description}
          </p>
          <span className="w-40 lg:w-44 h-12 lg:h-14 text-white bg-[#2993FA] hover:bg-[#2380E0] rounded-md text-sm lg:text-base transition-colors flex items-center justify-center">
            {parseFloat(featuredGame.price) === 0 ? 'GRATIS' : 'DESCARGAR'}
          </span>
        </div>
      </Link>

      {/* Contenedor secundario */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 w-full lg:w-[35%]">
        {/* Tarjeta secundaria con detalles */}
        <div className="w-full lg:w-[74%] p-6 lg:p-8 bg-[#1C2C3B] rounded-2xl flex flex-col justify-between">
          <div className="flex flex-col gap-4 lg:gap-5">
            <p className="text-white text-sm lg:text-base line-clamp-4">
              {featuredGame.description || 'Detalles de funcionalidad del videojuego...'}
            </p>
            
            {/* Fragmento corregido con react-icons */}
            <div className="flex items-center gap-2">
              <StarRating rating={rating} size="text-lg lg:text-xl" valueClass="font-bold text-white ml-2" />
            </div>
            
            <div className="flex gap-3 items-baseline">
              <span className="text-xl lg:text-2xl font-bold text-white">
                {parseFloat(featuredGame.price) === 0 
                  ? 'GRATIS' 
                  : `$${featuredGame.final_price}`}
              </span>
              {featuredGame.discount > 0 && (
                <span className="line-through text-white/60">
                  ${featuredGame.price}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3 lg:gap-4 mt-4 lg:mt-5">
            <div className="w-1/2 aspect-[1.08] relative">
              <Image
                fill
                className="rounded-xl object-cover"
                src={featuredGame.image || pic4}
                alt="Preview 1"
              />
            </div>
            <div className="w-1/2 aspect-[1.08] relative">
              <Image
                fill
                className="rounded-xl object-cover"
                src={featuredGame.image || pic4}
                alt="Preview 2"
              />
            </div>
          </div>
        </div>

        {/* Tarjetas laterales con otros juegos */}
        <div className="w-full lg:w-[15%]">
          <div className="flex flex-col gap-3 w-full">
            {otherGames.map((game) => (
              <Card key={game.id} game={game} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrusel;