'use client';
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getGameBySlug, getGames, createReview, getReviewsByGameId } from "@/services/gamesService";
import type { Game, CreateReviewInput, Review } from "@/services/gamesService";
import { APIError } from "@/services/api";
import { addToWishlist, getWishlist, removeFromWishlist } from "@/services/wishlistService";
import { addToCart, getCart, removeFromCart } from "@/services/cartService";
import { useSession } from 'next-auth/react';
import Loading from "@/Components/loading/Loading";
import { FaWindows, FaApple, FaLinux, FaXbox, FaPlaystation } from 'react-icons/fa';
import { BsNintendoSwitch } from 'react-icons/bs';
import { MdGamepad } from 'react-icons/md';

const der = "/icons/derecha.svg";
const izq = "/icons/izquierda.svg";

import StarRating from "@/Components/StarRating";
const yt = "/yt.svg";
const pic4 = "/pic4.jpg";

const renderPlatformIcon = (iconoName: string, nombreName: string, w: number = 16) => {
  const name = (iconoName || nombreName || '').toLowerCase();
  
  if (name.includes('windows') || name.includes('pc')) return <FaWindows size={w} title={nombreName} />;
  if (name.includes('apple') || name.includes('mac')) return <FaApple size={w} title={nombreName} />;
  if (name.includes('linux')) return <FaLinux size={w} title={nombreName} />;
  if (name.includes('xbox')) return <FaXbox size={w} title={nombreName} />;
  if (name.includes('playstation') || name.includes('ps')) return <FaPlaystation size={w} title={nombreName} />;
  if (name.includes('nintendo') || name.includes('switch')) return <BsNintendoSwitch size={w} title={nombreName} />;
  return <MdGamepad size={w} title={nombreName} />;
};

const Juego = () => {
  const params = useParams();
  const slug = params.slug as string;

  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/?$/, "");
  const normalizeImageSrc = (src?: string | null, fallback = pic4) => {
    if (!src) return fallback;
    if (src.startsWith("http")) return src;
    if (src.startsWith("/")) return src;
    if (!apiBase) return `/${src.replace(/^\/+/, "")}`;
    return `${apiBase}/${src.replace(/^\/+/, "")}`;
  };

  const { data: session, status } = useSession();
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        // Juego actual
        const gameData = await getGameBySlug(slug);
        setGame(gameData);

        if (gameData && gameData.id) {
          try {
            const revs = await getReviewsByGameId(gameData.id);
            if (revs && revs.results) {
              setReviews(revs.results);
            }
          } catch (err) { console.error('Error fetching reviews', err); }
        }

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
        const userId = Number(session?.user?.id);
        if (!userId) {
          throw new Error('No se pudo identificar el usuario');
        }
        const res = await addToWishlist(game.id, userId);
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
        const userId = Number(session?.user?.id);
        if (!userId) {
          throw new Error('No se pudo identificar el usuario');
        }
        const res = await addToCart(game.id, userId);
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

  const handleDownloadTxt = () => {
    if (!game) return;
    
    const content = `
Título: ${game.title}
Desarrollador: ${game.developer_name || 'Desconocido'}
Editor: ${game.editor || 'Desconocido'}
Fecha de estreno: ${new Date(game.release_date).toLocaleDateString()}
Clasificación: ${game.rating} / 5 Estrellas
Precio: ${game.price ? `$${game.price}` : 'Gratis'}
${game.discount && game.discount > 0 ? `Descuento: ${game.discount}%` : ''}

Descripción:
${game.description || 'Sin descripción.'}

Etiquetas:
${game.tags?.map(t => t.name).join(', ') || 'Ninguna'}

Plataformas:
${game.plataformas?.map(p => p.nombre).join(', ') || 'Ninguna'}
`.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${game.title.replace(/[^a-zA-Z0-9]/g, '_')}_datos.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Show the review modal after download
    setTimeout(() => {
      setShowReviewModal(true);
    }, 500);
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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewRating === 0) {
      showMessage("Por favor, selecciona una puntuación", "error");
      return;
    }
    
    if (status !== 'authenticated') {
      window.location.href = '/login';
      return;
    }

    if (!game) return;

    try {
      const reviewPayload: CreateReviewInput = { id_juego: game.id, id_usuario: Number(session?.user?.id), calificacion: Math.max(1, reviewRating * 2), comentario: reviewText, titulo: 'Reseña de ' + game.title };
      
      await createReview(reviewPayload);
      
      showMessage("¡Gracias por tu reseña!", "success");
      setShowReviewModal(false);
      setReviewText("");
      setReviewRating(0);

      // Actualizar vista local (estrellas y lista de reseñas)
      try {
        const updatedGame = await getGameBySlug(slug);
        setGame(updatedGame);
        const upRevs = await getReviewsByGameId(updatedGame.id);
        if (upRevs && upRevs.results) {
          setReviews(upRevs.results);
        }
      } catch (err) {}
    } catch (err: unknown) {
      const desc = err instanceof APIError ? err.message : 'Error al enviar reseña';
      showMessage(desc, "error");
    }
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
            src={normalizeImageSrc(game.image)}
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
              <Link
                key={g.id}
                href={`/juego/${g.slug}`}
                className="relative w-28 h-20 rounded-xl overflow-hidden border border-deep flex-shrink-0"
              >
                <Image
                  src={normalizeImageSrc(g.image)}
                  alt={g.title}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </Link>
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
            <button 
              onClick={handleDownloadTxt}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold text-sm shadow-md transition-colors hover:bg-primary/90"
            >
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
              <span key={plat.id} className="text-gray-400 hover:text-white transition-colors">
                {renderPlatformIcon(plat.icono, plat.nombre, 18)}
              </span>
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

      {/* SECCIÓN DE RESEÑAS */}
      <div className="md:col-span-3 mt-8 border-t border-deep pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-2xl font-bold">Reseñas de Usuarios ({reviews.length})</h3>
            <button
                onClick={() => {
                   if (status !== 'authenticated') { window.location.href = '/login'; return; }
                   setShowReviewModal(true);
                }}
                className="bg-primary/90 hover:bg-primary text-white font-bold py-2 px-6 rounded-xl transition-colors shadow-md text-sm border border-primary/50"
            >
                Dejar una reseña
            </button>
        </div>
        
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev, idx) => (
              <div key={rev.id || idx} className="bg-subdeep/40 border border-white/5 p-5 rounded-2xl flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/20 text-primary w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                    {rev.usuario?.username?.[0]?.toUpperCase() ?? rev.username_display?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <div className="flex-1">
                      <span className="font-semibold block leading-tight text-white/90">
                        {rev.usuario?.username || rev.username_display || 'Usuario anónimo'}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {rev.fecha_creacion ? new Date(rev.fecha_creacion).toLocaleDateString() : 'Reciente'}
                      </span>
                  </div>
                  <div className="bg-dark/50 p-1.5 rounded-lg border border-white/5">
                    <StarRating rating={rev.calificacion / 2} size="text-sm" />
                  </div>
                </div>
                {rev.titulo && <h4 className="font-bold text-white mb-2">{rev.titulo}</h4>}
                {rev.comentario ? (
                  <p className="text-sm text-gray-300 leading-relaxed max-h-32 overflow-y-auto pr-2 custom-scrollbar">{rev.comentario}</p>
                ) : (
                  <p className="text-sm text-gray-500 italic mt-auto pt-2">Sin comentarios.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-subdeep/30 border border-white/5 rounded-2xl p-8 text-center text-gray-400">
             <p className="mb-4">Este juego aún no tiene reseñas.</p>
             <button
                onClick={() => {
                   if (status !== 'authenticated') { window.location.href = '/login'; return; }
                   setShowReviewModal(true);
                }}
                className="text-primary hover:text-white transition-colors underline decoration-primary/30 underline-offset-4"
             >
                ¡Sé el primero en dejar tu opinión!
             </button>
          </div>
        )}
      </div>

      {/* Modal de Reseñas */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-deep rounded-2xl w-full max-w-md p-6 shadow-2xl border border-white/10 relative transform scale-100 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => { setShowReviewModal(false); setReviewRating(0); setReviewText(''); }}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-white mb-2">¡Gracias por descargar!</h3>
            <p className="text-sm text-texInactivo mb-6">Nos encantaría saber qué te parece {game.title}. Por favor, deja una reseña.</p>
            
            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-white/80">Tu puntuación</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`text-3xl transition-transform hover:scale-110 active:scale-95 ${
                        star <= reviewRating ? 'text-[#e5d63f] drop-shadow-[0_0_8px_rgba(229,214,63,0.5)]' : 'text-gray-600'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80" htmlFor="review">Comentario (opcional)</label>
                <textarea
                  id="review"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="¿Qué te gustó del juego?"
                  className="w-full bg-subdeep/50 border border-white/10 rounded-xl p-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none h-24"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
              >
                Enviar reseña
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Juego;
