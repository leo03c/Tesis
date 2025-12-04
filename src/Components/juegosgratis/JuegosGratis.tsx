"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { gamesService } from "@/services";
import type { FreeGame } from "@/types";

const izq = "/icons/izquierdaC.svg";
const der = "/icons/derechaC.svg";
const coraR = "/icons/coraR.svg";
const star = "/icons/star 5.svg";

// Fallback data for when API is unavailable
const fallbackJuegos: FreeGame[] = [
  { id: 1, title: "Cat Quest II", image: "/pic4.jpg", tags: ["RPG"], rating: 5.0 },
  { id: 2, title: "Cat Quest III", image: "/pic4.jpg", tags: ["RPG"], rating: 3.0 },
  { id: 3, title: "Cat Quest IV", image: "/pic4.jpg", tags: ["RPG"], rating: 3.5 },
  { id: 4, title: "Arcadegeddon", image: "/pic5.jpg", tags: ["AVENTURA", "RPG"], rating: 4.5 },
  { id: 5, title: "River City Girls", image: "/pic6.jpg", tags: ["RPG"], rating: 5.0 },
];

const JuegosGratis = () => {
  const [juegos, setJuegos] = useState<FreeGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // dirección de la transición: 1 = next (entra desde la derecha), -1 = prev (entra desde la izquierda)
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const fetchFreeGames = async () => {
      try {
        setLoading(true);
        const response = await gamesService.getFreeGames();
        setJuegos(response.games);
        setError(null);
      } catch (err) {
        console.error('Error fetching free games:', err);
        setError('No se pudieron cargar los juegos gratis');
        setJuegos(fallbackJuegos);
      } finally {
        setLoading(false);
      }
    };
    fetchFreeGames();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 640 ? 1 : 3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(juegos.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage((p) => p + 1);
      // limpiar clase de dirección después de la animación
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

  // Loading state
  if (loading) {
    return (
      <div className="my-4 rounded-3xl bg-deep text-white py-10 px-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-texInactivo">Cargando juegos gratis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-4 rounded-3xl bg-deep text-white py-10 px-6">
      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400">
          {error}
        </div>
      )}
      <div className="max-w-7xl mx-auto relative">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-primary">Juegos gratis</h2>
          <div className="hidden sm:flex items-center gap-2">
            <a href="#" className="text-primary text-xl hover:underline">
              Ver todos
            </a>
            <button onClick={prevPage} disabled={currentPage === 0}>
              <Image src={izq} alt="izquierda" width={44} height={44} />
            </button>
            <button onClick={nextPage} disabled={currentPage >= totalPages - 1}>
              <Image src={der} alt="derecha" width={44} height={44} />
            </button>
          </div>
        </div>

        {/* Tarjetas - envoltorio con animación según dirección */}
        <div className="overflow-hidden">
          <div
            // al cambiar currentPage se monta una nueva grid con la clase de animación
            key={currentPage}
            className={`${
              direction === 1 ? "slide-from-right" : direction === -1 ? "slide-from-left" : ""
            } grid grid-cols-1 sm:grid-cols-3 gap-6`}
          >
            {visibleGames.map((juego, i) => (
              <div key={i} className="bg-deep rounded-xl overflow-hidden md:shadow-md relative">
                {/* Imagen */}
                <div className="w-full aspect-[4/3] relative">
                  <Image
                    src={juego.image}
                    alt={juego.title}
                    fill
                    className="object-cover rounded-t-xl"
                  />
                  <div className="absolute top-2 right-2">
                    <Image src={coraR} alt="heart" width={56} height={56} />
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-4 pb-6">
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {juego.tags.map((tag, j) => (
                      <span
                        key={j}
                        className="bg-categorico text-xs px-2 py-1 rounded-md text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold">{juego.title}</h3>
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
                        {juego.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botones móviles */}
        <div className="flex justify-end gap-2 mt-6 sm:hidden">
          <button onClick={prevPage} disabled={currentPage === 0}>
            <Image src={izq} alt="izquierda" width={44} height={44} />
          </button>
          <button onClick={nextPage} disabled={currentPage >= totalPages - 1}>
            <Image src={der} alt="derecha" width={44} height={44} />
          </button>
        </div>
      </div>

      {/* Estilos de la animación (puedes mover esto a tu CSS global si prefieres) */}
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
  );
};

export default JuegosGratis;
