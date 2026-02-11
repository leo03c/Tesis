'use client';
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getGameBySlug, getGames } from "@/services/gamesService";
import type { Game } from "@/services/gamesService";
import { APIError } from "@/services/api";
import { addToWishlist, getWishlist, removeFromWishlist } from "@/services/wishlistService";
import { addToCart, getCart, removeFromCart } from "@/services/cartService";
import { useSession } from 'next-auth/react';
import Loading from "@/Components/loading/Loading";

const der = "/icons/derecha.svg";
const izq = "/icons/izquierda.svg";
const win = "/windows.svg";
import StarRating from "@/Components/StarRating";
const yt = "/yt.svg";
const pic4 = "/pic4.jpg";

const Juego = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { status } = useSession();
  const [game, setGame] = useState<Game | null>(null);
  const [gamesList, setGamesList] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState<number | null>(null);
  const [inCart, setInCart] = useState(false);
  const [cartItemId, setCartItemId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<'wishlist' | 'cart' | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        // Juego actual
        const gameData = await getGameBySlug(slug);
        setGame(gameData);

        // Todos los juegos para el carrusel
        const allGames = await getGames();
        setGamesList(allGames.results || []);

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

    if (slug) fetchGame();
  }, [slug]);

  // Verificar si el juego ya está en wishlist/cart
  useEffect(() => {
    const checkUserLists = async () => {
      if (status !== 'authenticated' || !game) return;
      try {
        const [wishlistRes, cartRes] = await Promise.all([
          getWishlist(),
          getCart(),
        ]);
        const wishlistMatch = wishlistRes.results.find(item => item.id_juego === game.id);
        if (wishlistMatch) {
          setInWishlist(true);
          setWishlistItemId(wishlistMatch.id);
        }
        const cartMatch = cartRes.results.find(item => item.id_juego === game.id);
        if (cartMatch) {
          setInCart(true);
          setCartItemId(cartMatch.id);
        }
      } catch (err) {
        console.error('Error checking user lists:', err);
      }
    };
    checkUserLists();
  }, [status, game]);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleToggleWishlist = async () => {
    if (status !== 'authenticated') {
      window.location.href = '/login';
      return;
    }
    if (!game || actionLoading) return;
    setActionLoading('wishlist');
    try {
      if (inWishlist && wishlistItemId) {
        await removeFromWishlist(wishlistItemId);
        setInWishlist(false);
        setWishlistItemId(null);
        showMessage('Eliminado de la lista de deseos', 'success');
      } else {
        const res = await addToWishlist(game.id);
        setInWishlist(true);
        setWishlistItemId(res.id);
        showMessage('Añadido a la lista de deseos', 'success');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al actualizar lista de deseos';
      showMessage(message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleCart = async () => {
    if (status !== 'authenticated') {
      window.location.href = '/login';
      return;
    }
    if (!game || actionLoading) return;
    setActionLoading('cart');
    try {
      if (inCart && cartItemId) {
        await removeFromCart(cartItemId);
        setInCart(false);
        setCartItemId(null);
        showMessage('Eliminado del carrito', 'success');
      } else {
        const res = await addToCart(game.id);
        setInCart(true);
        setCartItemId(res.id);
        showMessage('Añadido al carrito', 'success');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al actualizar carrito';
      showMessage(message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 140;
      scrollRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const youtube = () => window.open("https://www.youtube.com", "_blank");

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
        <p className="text-texInactivo">{error || 'Juego no encontrado'}</p>
      </div>
    );
  }

  return (
    <div className="bg-dark text-white mb-4 rounded-3xl max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Imagen principal y galería */}
      <div className="md:col-span-2">
        {/* Encabezado */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold">{game.title.toUpperCase()}</h1>
          <div className="mt-2">
            <StarRating rating={game.rating} size="text-base" valueClass="text-sm font-medium ml-1" />
          </div>
        </div>

        {/* Imagen principal con botón */}
        <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden mb-4">
          <Image
            src={game.image || pic4}
            alt={game.title}
            fill
            className="object-cover"
          />
          <button
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white font-bold py-3 px-6 rounded-xl shadow-md text-sm flex items-center"
            onClick={youtube}
          >
            <Image src={yt} alt="YouTube" width={16} height={16} className="me-2" />
            REPRODUCIR
          </button>
        </div>

        {/* Carrusel de todos los juegos */}
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => scroll("left")}>
            <Image src={izq} alt="Flecha izquierda" width={44} height={44} />
          </button>
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scroll-smooth no-scrollbar"
          >
            {gamesList.map((g) => (
              <div
                key={g.id}
                className="relative w-28 h-20 rounded-xl overflow-hidden border border-deep flex-shrink-0"
              >
                <Image
                  src={g.image || pic4}
                  alt={g.title}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <button onClick={() => scroll("right")}>
            <Image src={der} alt="Flecha derecha" width={44} height={44} />
          </button>
        </div>

        {/* Descripción del juego actual */}
        <p className="text-sm text-gray-300 mt-4">{game.description}</p>
      </div>

      {/* Información lateral del juego actual */}
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
            <button className="w-full bg-primary text-white py-3 rounded-lg font-bold text-sm shadow-md">
              DESCARGAR
            </button>
            <button
              onClick={handleToggleCart}
              disabled={actionLoading === 'cart'}
              className={`w-full py-3 rounded-lg font-semibold text-sm transition-colors ${
                inCart
                  ? 'bg-primary/20 text-primary border border-primary'
                  : 'bg-deep text-white hover:bg-deep/80'
              } disabled:opacity-50`}
            >
              {actionLoading === 'cart'
                ? 'PROCESANDO...'
                : inCart
                  ? '✓ EN EL CARRITO'
                  : 'AÑADIR AL CARRO'}
            </button>
            <button
              onClick={handleToggleWishlist}
              disabled={actionLoading === 'wishlist'}
              className={`w-full py-3 rounded-lg font-semibold text-sm transition-colors ${
                inWishlist
                  ? 'bg-primary/20 text-primary border border-primary'
                  : 'bg-deep text-white hover:bg-deep/80'
              } disabled:opacity-50`}
            >
              {actionLoading === 'wishlist'
                ? 'PROCESANDO...'
                : inWishlist
                  ? '✓ EN LA LISTA DE DESEOS'
                  : 'AÑADIR A LA LISTA DE DESEOS'}
            </button>
            {actionMessage && (
              <p className={`text-xs text-center mt-1 ${
                actionMessage.type === 'success' ? 'text-green-400' : 'text-red-400'
              }`}>
                {actionMessage.text}
              </p>
            )}
          </div>
        </div>

        {/* Detalles del juego */}
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
              <Image key={plat.id} src={plat.icono || win} alt={plat.nombre} width={14} height={14} />
            ))}
          </p>
          {game.tags && game.tags.length > 0 && (
            <div className="pt-2">
              <p className="text-white mb-1">CATEGORÍAS:</p>
              <div className="flex flex-wrap gap-1">
                {game.tags.map((tag) => (
                  <span key={tag.id} className="bg-categorico text-xs px-2 py-1 rounded-md text-white">
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
