"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const izq = "/icons/izquierdaC.svg";
const der = "/icons/derechaC.svg";
const star = "/icons/star 5.svg";
const pic4 = "/pic4.jpg";
const pic5 = "/pic5.jpg";
const pic6 = "/pic6.jpg";

const favoritos = [
  { title: "Cat Quest II", image: pic4, tags: ["RPG"], rating: 5.0, addedDate: "15 Nov 2024" },
  { title: "Arcadegeddon", image: pic5, tags: ["AVENTURA", "RPG"], rating: 4.5, addedDate: "10 Nov 2024" },
  { title: "River City Girls", image: pic6, tags: ["BEAT'EM UP"], rating: 5.0, addedDate: "5 Nov 2024" },
  { title: "Hollow Knight", image: pic4, tags: ["METROIDVANIA"], rating: 4.9, addedDate: "1 Nov 2024" },
  { title: "Celeste", image: pic5, tags: ["PLATAFORMAS"], rating: 4.8, addedDate: "28 Oct 2024" },
];

const FavoritosApp = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [direction, setDirection] = useState(0);

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

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Me Gustan</h1>
        <p className="text-texInactivo">Juegos que has marcado como favoritos ({favoritos.length})</p>
      </div>

      {/* Favorites Grid */}
      <div className="my-4 rounded-3xl bg-deep text-white py-10 px-6">
        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-primary">Tus Favoritos</h2>
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={prevPage} disabled={currentPage === 0}>
                <Image src={izq} alt="izquierda" width={44} height={44} />
              </button>
              <button onClick={nextPage} disabled={currentPage >= totalPages - 1}>
                <Image src={der} alt="derecha" width={44} height={44} />
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="overflow-hidden">
            <div
              key={currentPage}
              className={`${
                direction === 1 ? "slide-from-right" : direction === -1 ? "slide-from-left" : ""
              } grid grid-cols-1 sm:grid-cols-3 gap-6`}
            >
              {visibleGames.map((juego, i) => (
                <div key={i} className="bg-subdeep rounded-xl overflow-hidden md:shadow-md relative group">
                  {/* Image */}
                  <div className="w-full aspect-[4/3] relative">
                    <Image
                      src={juego.image}
                      alt={juego.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover rounded-t-xl"
                    />
                    <button className="absolute top-2 right-2 bg-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {/* Content */}
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
                    <div className="flex justify-between items-center mb-2">
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
                    <p className="text-texInactivo text-xs">Añadido: {juego.addedDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile buttons */}
          <div className="flex justify-end gap-2 mt-6 sm:hidden">
            <button onClick={prevPage} disabled={currentPage === 0}>
              <Image src={izq} alt="izquierda" width={44} height={44} />
            </button>
            <button onClick={nextPage} disabled={currentPage >= totalPages - 1}>
              <Image src={der} alt="derecha" width={44} height={44} />
            </button>
          </div>
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

      {/* Empty state message when no favorites */}
      {favoritos.length === 0 && (
        <div className="rounded-3xl bg-deep py-20 px-6 text-center">
          <div className="w-20 h-20 bg-subdeep rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-texInactivo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No tienes favoritos aún</h3>
          <p className="text-texInactivo mb-6">Explora la tienda y marca juegos que te gusten</p>
          <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-subprimary transition">
            Explorar Tienda
          </button>
        </div>
      )}
    </div>
  );
};

export default FavoritosApp;
