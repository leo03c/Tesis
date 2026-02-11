"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from 'next-auth/react';
import { getCart, removeFromCart } from "@/services/cartService";
import type { CartItem } from "@/services/cartService";
import Loading from "@/Components/loading/Loading";

const izq = "/icons/izquierdaC.svg";
const der = "/icons/derechaC.svg";
import StarRating from "@/Components/StarRating";
const pic4 = "/pic4.jpg";

const CarritoApp = () => {
  const { status } = useSession();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [direction, setDirection] = useState(0);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [showCheckout, setShowCheckout] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      if (status !== 'authenticated') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getCart();
        const safeItems = (response.results || []).filter((item) => item?.juego);
        setItems(safeItems);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [status]);

  const handleRemove = async (item: CartItem) => {
    try {
      await removeFromCart(item.id);
      setItems(prev => prev.filter(i => i.id !== item.id));
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const totalPrice = items.reduce((sum, item) => {
    return sum + parseFloat(item?.juego?.final_price || '0');
  }, 0);

  useEffect(() => {
    if (checkoutStatus !== 'success') {
      return;
    }

    const timer = window.setTimeout(() => {
      setCheckoutStatus('idle');
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [checkoutStatus]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 640 ? 1 : 3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleCheckout = () => {
    if (items.length === 0 || checkoutStatus === 'processing') {
      return;
    }

    setCheckoutError(null);
    setShowCheckout(true);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const validateCard = () => {
    const normalizedNumber = cardNumber.replace(/\s+/g, '');
    if (cardName.trim().length < 3) {
      return 'Ingresa el nombre del titular.';
    }
    if (!/^\d{13,19}$/.test(normalizedNumber)) {
      return 'El numero de tarjeta debe tener entre 13 y 19 digitos.';
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExp.trim())) {
      return 'La fecha debe tener formato MM/AA.';
    }
    const [mm, yy] = cardExp.split('/').map(Number);
    const expDate = new Date(2000 + yy, mm, 0);
    const now = new Date();
    if (expDate < new Date(now.getFullYear(), now.getMonth(), 1)) {
      return 'La tarjeta esta vencida.';
    }
    if (!/^\d{3,4}$/.test(cardCvc.trim())) {
      return 'El CVC debe tener 3 o 4 digitos.';
    }
    return null;
  };

  const handleConfirmPayment = async (event: React.FormEvent) => {
    event.preventDefault();

    if (checkoutStatus === 'processing') {
      return;
    }

    const validationError = validateCard();
    if (validationError) {
      setCheckoutError(validationError);
      return;
    }

    setCheckoutError(null);
    setCheckoutStatus('processing');

    window.setTimeout(async () => {
      try {
        await Promise.all(items.map(item => removeFromCart(item.id)));
        setItems([]);
        setShowCheckout(false);
        setCheckoutStatus('success');
        setCardName('');
        setCardNumber('');
        setCardExp('');
        setCardCvc('');
        showToast('Pago simulado exitoso. Gracias por tu compra.', 'success');
      } catch (err) {
        console.error('Error clearing cart after checkout:', err);
        setCheckoutStatus('error');
        setCheckoutError('No se pudo completar el pago. Intenta de nuevo.');
        showToast('No se pudo completar el pago. Intenta de nuevo.', 'error');
      }
    }, 1500);
  };

  const startIndex = currentPage * itemsPerPage;
  const visibleItems = items.slice(startIndex, startIndex + itemsPerPage);

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
          Juegos en tu carrito ({items.length})
          {items.length > 0 && ` - Total: $${totalPrice.toFixed(2)}`}
        </p>
      </div>

      <div className="my-4 rounded-3xl bg-deep text-white py-10 px-6">
        <div className="max-w-7xl mx-auto relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-primary">Tu Carrito</h2>
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
                    if (!juego) {
                      return null;
                    }
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

              {/* Resumen de Compra */}
              <div className="mt-8 p-6 bg-subdeep rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Resumen de Compra</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-texInactivo">Subtotal ({items.length} items)</span>
                  <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold mt-4 pt-4 border-t border-gray-700">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <button
                  className="w-full mt-6 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60"
                  onClick={handleCheckout}
                  disabled={items.length === 0 || checkoutStatus === 'processing'}
                >
                  {checkoutStatus === 'processing' ? 'Procesando pago...' : 'Proceder al Pago'}
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
            </div>
          )}
        </div>

        {showCheckout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="bg-deep text-white w-full max-w-md rounded-2xl p-6 relative">
              <button
                onClick={() => setShowCheckout(false)}
                className="absolute right-4 top-4 text-texInactivo hover:text-white"
                aria-label="Cerrar"
              >
                ✕
              </button>
              <h3 className="text-xl font-semibold mb-4">Pago simulado</h3>
              <p className="text-sm text-texInactivo mb-4">
                Ingresa una tarjeta de prueba para completar la compra.
              </p>
              {toast && (
                <div
                  className={`mb-3 rounded-lg px-3 py-2 text-xs border ${
                    toast.type === 'success'
                      ? 'bg-emerald-500/15 text-emerald-200 border-emerald-500/40'
                      : 'bg-red-500/15 text-red-200 border-red-500/40'
                  }`}
                >
                  {toast.message}
                </div>
              )}
              <form onSubmit={handleConfirmPayment} className="space-y-3">
                <div>
                  <label className="text-xs text-texInactivo">Nombre del titular</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full mt-1 bg-subdeep border border-gray-700 rounded-lg px-3 py-2 text-sm"
                    placeholder="Nombre y apellido"
                  />
                </div>
                <div>
                  <label className="text-xs text-texInactivo">Numero de tarjeta</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full mt-1 bg-subdeep border border-gray-700 rounded-lg px-3 py-2 text-sm"
                    placeholder="4242 4242 4242 4242"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-texInactivo">Vencimiento</label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full mt-1 bg-subdeep border border-gray-700 rounded-lg px-3 py-2 text-sm"
                      placeholder="MM/AA"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-texInactivo">CVC</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full mt-1 bg-subdeep border border-gray-700 rounded-lg px-3 py-2 text-sm"
                      placeholder="123"
                    />
                  </div>
                </div>
                {checkoutError && (
                  <p className="text-xs text-red-400">{checkoutError}</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60"
                  disabled={checkoutStatus === 'processing'}
                >
                  {checkoutStatus === 'processing' ? 'Procesando...' : `Pagar $${totalPrice.toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>
        )}


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
