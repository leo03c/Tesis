"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from 'next-auth/react';
import { getWishlist, removeFromWishlist } from "@/services/wishlistService";
import type { WishlistItem } from "@/services/wishlistService";
import Loading from "@/Components/loading/Loading";

const izq = "/icons/izquierdaC.svg";
const der = "/icons/derechaC.svg";
import StarRating from "@/Components/StarRating";
const pic4 = "/pic4.jpg";

const WishlistApp = () => {
  const { status } = useSession();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [direction, setDirection] = useState(0);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (status !== 'authenticated') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getWishlist();
        setItems(response.results || []);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [status]);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 640 ? 1 : 3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRemove = async (item: WishlistItem) => {
    try {
      await removeFromWishlist(item.id);
      setItems(prev => prev.filter(i => i.id !== item.id));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  const totalPages = Math.ceil(items.length / itemsPerPage);

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
  const visibleItems = items.slice(startIndex, startIndex + itemsPerPage);

  if (status === 'loading') {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <Loading message="Verificando sesion..." />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen text-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Lista de deseos</h1>
          <p className="text-texInactivo">Inicia sesion para ver tu lista de deseos</p>
        </div>
        <div className="my-4 rounded-3xl bg-deep text-white py-20 px-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-subdeep rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-texInactivo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Inicia sesion</h3>
            <p className="text-texInactivo mb-4">Debes iniciar sesion para ver tu lista de deseos</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Iniciar sesion
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen text-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Lista de deseos</h1>
          <p className="text-texInactivo">Cargando tu lista de deseos...</p>
        </div>
        <div className="my-4 rounded-3xl bg-deep text-white py-10 px-6">
          <Loading message="Cargando lista de deseos..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Lista de deseos</h1>
        <p className="text-texInactivo">Juegos en tu lista ({items.length})</p>
      </div>

      <div className="my-4 rounded-3xl bg-deep text-white py-10 px-6">
        <div className="max-w-7xl mx-auto relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-primary">Tu lista</h2>
            {items.length > itemsPerPage && (
              <div className="hidden sm:flex items-center gap-2">
                <button onClick={prevPage} disabled={currentPage === 0}>
                  <Image src={izq} alt="izquierda" width={44} height={44} />
                </button>
                <button onClick={nextPage} disabled={currentPage >= totalPages - 1}>
                  <Image src={der} alt="derecha" width={44} height={44} />
                </button>
              </div>
            )}
          </div>

          {items.length > 0 ? (
            <>
              <div className="overflow-hidden">
                <div
                  key={currentPage}
                  className={`${
                    direction === 1 ? "slide-from-right" : direction === -1 ? "slide-from-left" : ""
                  } grid grid-cols-1 sm:grid-cols-3 gap-6`}
                >
                  {visibleItems.map((item) => {
                    const juego = item.juego;
                    return (
                      <Link key={item.id} href={`/juego/${juego.slug}`}>
                        <div className="bg-subdeep rounded-xl overflow-hidden md:shadow-md relative group cursor-pointer hover:scale-105 transition-transform">
                          <div className="w-full aspect-[4/3] relative">
                            <Image
                              src={juego.image || pic4}
                              alt={juego.title}
                              fill
                              sizes="(max-width: 640px) 100vw, 33vw"
                              className="object-cover rounded-t-xl"
                            />
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleRemove(item);
                              }}
                              className="absolute top-2 right-2 bg-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition z-10"
                            >
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

                          <div className="p-4 pb-6">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-base font-semibold">{juego.title}</h3>
                              <StarRating rating={juego.rating} />
                            </div>
                            <p className="text-texInactivo text-xs">
                              {parseFloat(juego.final_price) === 0 ? 'GRATIS' : `$${juego.final_price}`}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {items.length > itemsPerPage && (
                <div className="flex justify-end gap-2 mt-6 sm:hidden">
                  <button onClick={prevPage} disabled={currentPage === 0}>
                    <Image src={izq} alt="izquierda" width={44} height={44} />
                  </button>
                  <button onClick={nextPage} disabled={currentPage >= totalPages - 1}>
                    <Image src={der} alt="derecha" width={44} height={44} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-subdeep rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-texInactivo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tu lista esta vacia</h3>
              <p className="text-texInactivo mb-4">Explora la tienda y agrega juegos a tu lista</p>
              <Link
                href="/tienda-de-juegos"
                className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Ir a la Tienda
              </Link>
            </div>
          )}
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

export default WishlistApp;
