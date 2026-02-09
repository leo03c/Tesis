"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from 'next-auth/react';
import { useCart } from "@/contexts/CartContext";
import { getCart } from "@/services/cartService";
import type { Game } from "@/services/gamesService";
import { APIError } from "@/services/api";
import Loading from "@/Components/loading/Loading";

const izq = "/icons/izquierdaC.svg";
const der = "/icons/derechaC.svg";
const star = "/icons/star 5.svg";
const pic4 = "/pic4.jpg";

const CarritoApp = () => {
  const { data: session, status } = useSession();
  const { toggleCart, isInCart, cartItems } = useCart();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [direction, setDirection] = useState(0);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [allPrices, setAllPrices] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [apiUrl, setApiUrl] = useState<string | null>(null);

  // Debug logs
  useEffect(() => {
    console.log('=== DEBUG CARRITO ===');
    console.log('Session status:', status);
    console.log('Session data:', session);
    console.log('Cart items from context:', cartItems);
  }, [status, session, cartItems]);

  useEffect(() => {
    const fetchCart = async () => {
      console.log('fetchCart called, status:', status);
      
      // Solo cargar si está autenticado
      if (status !== 'authenticated') {
        console.log('Not authenticated, skipping fetch');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching cart...');
        const response = await getCart();
        console.log('Cart response:', response);

        if (!response || !Array.isArray(response.results)) {
          console.error('La respuesta de la API de carrito no tiene el formato esperado:', response);
          setAllGames([]);
          setAllPrices(new Map());
          setApiUrl(null);
          return;
        }

        const games = response.results.map(item => item.game);
        const prices = new Map<number, string>();
        response.results.forEach(item => {
          prices.set(item.game.id, item.price_at_time);
        });
        console.log('Games extracted:', games);
        console.log('Prices extracted:', prices);

        setAllGames(games);
        setAllPrices(prices);
        setApiUrl(null);
      } catch (err) {
        console.error('Error fetching cart:', err);
        if (err instanceof APIError) {
          console.error('API Error details:', {
            status: err.status,
            url: err.url,
            data: err.data
          });
          setApiUrl(err.url);
        }
        setAllGames([]);
        setAllPrices(new Map());
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [status]);

  const carritoItems = useMemo(() => {
    const filtered = allGames.filter(game => isInCart(game.id));
    console.log('Carrito filtrados:', filtered.length, 'de', allGames.length);
    return filtered;
  }, [allGames, cartItems]);

  const totalPrice = useMemo(() => {
    return carritoItems.reduce((sum, game) => {
      const price = allPrices.get(game.id) || game.final_price;
      return sum + parseFloat(price || '0');
    }, 0);
  }, [carritoItems, allPrices]);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 640 ? 1 : 3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(carritoItems.length / itemsPerPage);

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
  const visibleGames = carritoItems.slice(startIndex, startIndex + itemsPerPage);

  const formatRating = (rating: string | number | undefined): string => {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    return (numRating || 0).toFixed(1);
  };

  // Mostrar loading mientras se verifica la sesión
  if (status === 'loading') {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <Loading message="Verificando sesión..." />
      </div>
    );
  }

  // Mostrar mensaje de login si no está autenticado
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen text-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mi Carrito</h1>
          <p className="text-texInactivo">Inicia sesión para ver tu carrito</p>
        </div>
        <div className="my-4 rounded-3xl bg-deep text-white py-20 px-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-subdeep rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-texInactivo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Inicia sesión</h3>
            <p className="text-texInactivo mb-4">Debes iniciar sesión para ver tu carrito de compras</p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar loading mientras carga el carrito
  if (loading) {
    return (
      <div className="min-h-screen text-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mi Carrito</h1>
          <p className="text-texInactivo">Cargando tu carrito...</p>
        </div>
        <div className="my-4 rounded-3xl bg-deep text-white py-10 px-6">
          <Loading message="Cargando carrito..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mi Carrito</h1>
        <p className="text-texInactivo">
          Juegos en tu carrito ({carritoItems.length})
          {carritoItems.length > 0 && ` - Total: $${totalPrice.toFixed(2)}`}
          {apiUrl && <span className="text-xs ml-2">| API: {apiUrl}</span>}
        </p>
      </div>

      <div className="my-4 rounded-3xl bg-deep text-white py-10 px-6">
        <div className="max-w-7xl mx-auto relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-primary">Tu Carrito</h2>
            {carritoItems.length > itemsPerPage && (
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

          {carritoItems.length > 0 ? (
            <>
              <div className="overflow-hidden">
                <div
                  key={currentPage}
                  className={`${
                    direction === 1 ? "slide-from-right" : direction === -1 ? "slide-from-left" : ""
                  } grid grid-cols-1 sm:grid-cols-3 gap-6`}
                >
                  {visibleGames.map((juego) => {
                    const priceAtTime = allPrices.get(juego.id);
                    return (
                      <Link key={juego.id} href={`/juego/${juego.slug}`}>
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
                                toggleCart(juego.id);
                              }}
                              className="absolute top-2 right-2 bg-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition z-10"
                            >
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

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
                                  {formatRating(juego.rating)}
                                </span>
                              </div>
                            </div>
                            <p className="text-texInactivo text-xs">
                              {priceAtTime && parseFloat(priceAtTime) === 0 
                                ? 'GRATIS' 
                                : `$${priceAtTime || juego.final_price}`}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {carritoItems.length > itemsPerPage && (
                <div className="flex justify-end gap-2 mt-6 sm:hidden">
                  <button onClick={prevPage} disabled={currentPage === 0}>
                    <Image src={izq} alt="izquierda" width={44} height={44} />
                  </button>
                  <button onClick={nextPage} disabled={currentPage >= totalPages - 1}>
                    <Image src={der} alt="derecha" width={44} height={44} />
                  </button>
                </div>
              )}

              {/* Resumen de Compra */}
              <div className="mt-8 p-6 bg-subdeep rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Resumen de Compra</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-texInactivo">Subtotal ({carritoItems.length} items)</span>
                  <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold mt-4 pt-4 border-t border-gray-700">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <button className="w-full mt-6 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold transition">
                  Proceder al Pago
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-subdeep rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-texInactivo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tu carrito está vacío</h3>
              <p className="text-texInactivo mb-4">Explora la tienda y añade juegos a tu carrito</p>
              <Link 
                href="/tienda-de-juegos"
                className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Ir a la Tienda
              </Link>
              <p className="text-xs text-texInactivo mt-4">
                Debug: allGames={allGames.length}, cartItems={cartItems.size}
              </p>
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

export default CarritoApp;
