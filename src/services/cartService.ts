/**
 * Cart Service - API endpoints for user's shopping cart
 * Backend base: /api/cart/
 */
import api, { APIError } from './api';
import type { Game } from './gamesService';

export interface CartItem {
  id: number;
  game: Game;
  added_date: string;
  price_at_time: string;
}

export interface CartResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CartItem[];
}

/**
 * Get user's cart items
 * Requires authentication
 * ⚠️ 401 se maneja como estado normal
 */
export const getCart = async (
  params?: Record<string, string | number | boolean>
): Promise<CartResponse> => {
  try {
    return await api.get<CartResponse>('/cart/', params);
  } catch (error) {
    if (error instanceof APIError && error.status === 401) {
      // Usuario no logueado / sesión expirada
      return {
        count: 0,
        next: null,
        previous: null,
        results: [],
      };
    }
    throw error;
  }
};

/**
 * Add a game to cart
 * Requires authentication
 */
export const addToCart = async (gameId: number) => {
  try {
    return await api.post<CartItem>('/cart/', { game_id: gameId });
  } catch (error) {
    if (error instanceof APIError && error.status === 401) {
      throw new Error('Debes iniciar sesión para añadir al carrito');
    }
    throw error;
  }
};

/**
 * Remove a game from cart
 * Requires authentication
 */
export const removeFromCart = async (id: number) => {
  try {
    return await api.delete<void>(`/cart/${id}/`);
  } catch (error) {
    if (error instanceof APIError && error.status === 401) {
      throw new Error('Debes iniciar sesión para eliminar del carrito');
    }
    throw error;
  }
};

const cartService = {
  getCart,
  addToCart,
  removeFromCart,
};

export default cartService;
