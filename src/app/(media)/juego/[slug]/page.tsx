"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getGameBySlug } from "@/services/gamesService";
import type { Game } from "@/services/gamesService";
import { APIError } from "@/services/api";
import Loading from "@/Components/loading/Loading";

const der = "/icons/derecha.svg";
const izq = "/icons/izquierda.svg";
const carr1 = "/carr1.png";
const carr2 = "/carr2.png";
const carr3 = "/carr3.png";
const carr4 = "/carr4.png";
const carr5 = "/carr5.png";
const win = "/windows.svg";
const star = "/icons/Star 5.svg";
const yt = "/yt.svg";
const pic4 = "/pic4.jpg";

const Juego = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const carrImages = [carr1, carr2, carr3, carr4, carr5, carr1];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        const gameData = await getGameBySlug(slug);
        setGame(gameData);
        setError(null);
      } catch (err) {
        console.error('Error fetching game:', err);
        if (err instanceof APIError) {
          setError(err.message);
        } else {
          setError('No se pudo cargar el juego');
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchGame();
    }
  }, [slug]);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 140;
      scrollRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const youtube = () => {
    window.open("https://www.youtube.com", "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading message="Cargando juego..." />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-texInactivo mb-2">{error || 'Juego no encontrado'}</p>
        </div>
      </div>
    );
  }

  // Helper para formatear rating
  const formatRating = (rating: string | number | undefined): string => {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    return (numRating || 0).toFixed(1);
  };

  return (
    <div className="bg-dark text-white mb-4 rounded-3xl max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Imagen principal y galería */}
      <div className="md:col-span-2">
        {/* Encabezado */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold">{game.title.toUpperCase()}</h1>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Image key={i} src={star} alt={`Estrella ${i + 1}`} width={16} height={16} />
            ))}
            <span className="text-sm font-medium ml-1">{formatRating(game.rating)}</span>
          </div>
        </div>

        {/* Imagen principal con botón */}
        <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden mb-4">
          <Image
            src={game.image || pic4}
            alt={game.title || "Imagen principal del juego"}
            fill
            className="object-cover"
          />
          <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white font-bold py-3 px-6 rounded-xl shadow-md text-sm flex items-center "
          onClick={()=> youtube()}>
            <Image src={yt} alt="Logo de YouTube" width={16} height={16} className="me-2" />
            REPRODUCIR
          </button>
        </div>

        {/* Carrusel */}
        <div className="flex items-center gap-2">
          <button onClick={() => scroll("left")}>
            <Image src={izq} alt="Flecha izquierda" width={44} height={44} />
          </button>
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scroll-smooth no-scrollbar"
          >
            {carrImages.map((src, i) => (
              <div
                key={i}
                className="relative w-28 h-20 rounded-xl overflow-hidden border border-deep flex-shrink-0"
              >
                <Image src={src} alt={`Imagen carrusel ${i + 1}`} fill sizes="112px" className="object-cover" />
              </div>
            ))}
          </div>
          <button onClick={() => scroll("right")}>
            <Image src={der} alt="Flecha derecha" width={44} height={44} />
          </button>
        </div>

        {/* Descripción */}
        <p className="text-sm text-gray-300 mt-4">
          {game.description}
        </p>
      </div>

      {/* Información lateral */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">{game.title}</h2>

        {/* Precio y botones */}
        <div className="text-sm">
          <p className="inline-block text-xs text-gray-400 mb-1 bg-subdeep px-2 py-0.5 rounded-md">
            {game.final_price === "0.00" ? "JUEGO GRATIS" : "JUEGO BASE"}
          </p>
          <p className="text-white font-semibold">
            {game.final_price === "0.00" ? "GRATIS" : `$${game.final_price}`}
          </p>
          {game.discount > 0 && (
            <p className="text-xs text-primary mb-2">
              -{game.discount}% de descuento
            </p>
          )}
          <p className="text-xs text-gray-500 mb-4">
            Puede incluir compras dentro de la aplicación
          </p>

          <div className="space-y-2">
            <button className="w-full  bg-primary text-white py-3 rounded-lg font-bold text-sm shadow-md">
              DESCARGAR
            </button>
            <button className="w-full  bg-deep text-white  py-3 rounded-lg font-semibold text-sm">
              AÑADIR AL CARRO
            </button>
            <button className="w-full  bg-deep text-white  py-3 rounded-lg font-semibold text-sm">
              AÑADIR A LA LISTA DE DESEOS
            </button>
          </div>
        </div>

        {/* Detalles */}
        <div className="text-xs text-gray-400 space-y-1 pt-2">
          <p className="border-b border-deep py-1">
            <span className="text-white">DESARROLLADOR:</span> {game.developer_name}
          </p>
          <p className="border-b border-deep py-1">
            <span className="text-white">EDITOR:</span> {game.editor}
          </p>
          <p className="border-b border-deep py-1">
            <span className="text-white">FECHA DE ESTRENO:</span> {new Date(game.release_date).toLocaleDateString()}
          </p>
          <p className="flex items-center gap-2 border-b border-deep py-1">
            <span className="text-white">PLATAFORMA:</span>
            {game.plataformas.map((plat) => (
              <Image key={plat.id} src={plat.icono || win} alt={`Icono plataforma ${plat.nombre}`} width={14} height={14} />
            ))}
          </p>
          {game.tags && game.tags.length > 0 && (
            <div className="pt-2">
              <p className="text-white mb-1">CATEGORÍAS:</p>
              <div className="flex flex-wrap gap-1">
                {game.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="bg-categorico text-xs px-2 py-1 rounded-md text-white"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Juego;
