/**
 * Wishlist Service - API endpoints for user's wishlist
 * Backend base: /api/wishlist/
 */
import api, { APIError } from './api';

export interface WishlistGame {
  id: number;
  title: string;
  slug: string;
  price: string;
  final_price: string;
  rating: string;
  image: string;
}

export interface WishlistItem {
  id: number;
  id_usuario: number;
  id_juego: number;
  juego: WishlistGame;
  fecha_agregado: string;
}

export interface WishlistResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: WishlistItem[];
}

/**
 * Get user's wishlist
 * Requires authentication
 */
export const getWishlist = async (
  params?: Record<string, string | number | boolean>
): Promise<WishlistResponse> => {
  try {
    return await api.get<WishlistResponse>('/wishlist/', params);
  } catch (error) {
    if (error instanceof APIError && error.status === 401) {
      return { count: 0, next: null, previous: null, results: [] };
    }
    throw error;
  }
};

/**
 * Add a game to wishlist
 * Requires authentication
 */
export const addToWishlist = async (gameId: number): Promise<WishlistItem> => {
  try {
    return await api.post<WishlistItem>('/wishlist/', { id_juego: gameId });
  } catch (error) {
    if (error instanceof APIError && error.status === 401) {
      throw new Error('Debes iniciar sesión para añadir a la lista de deseos');
    }
    throw error;
  }
};

/**
 * Remove a game from wishlist
 * Requires authentication
 */
export const removeFromWishlist = async (id: number): Promise<void> => {
  try {
    return await api.delete<void>(`/wishlist/${id}/`);
  } catch (error) {
    if (error instanceof APIError && error.status === 401) {
      throw new Error('Debes iniciar sesión para eliminar de la lista de deseos');
    }
    throw error;
  }
};

const wishlistService = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};

export default wishlistService;
