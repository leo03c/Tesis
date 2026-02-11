/**
 * Cart Service - API endpoints for user's shopping cart
 * Backend base: /api/cart/
 */
import api, { APIError } from './api';

export interface CartGame {
  id: number;
  title: string;
  slug: string;
  price: string;
  final_price: string;
  rating: string;
  image: string;
}

export interface CartItem {
  id: number;
  id_usuario: number;
  id_juego: number;
  juego: CartGame;
  fecha_agregado: string;
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
 */
export const getCart = async (
  params?: Record<string, string | number | boolean>
): Promise<CartResponse> => {
  try {
    return await api.get<CartResponse>('/cart/', params);
  } catch (error) {
    if (error instanceof APIError && error.status === 401) {
      return { count: 0, next: null, previous: null, results: [] };
    }
    throw error;
  }
};

/**
 * Add a game to cart
 * Requires authentication
 */
export const addToCart = async (gameId: number, userId: number): Promise<CartItem> => {
  try {
    return await api.post<CartItem>('/cart/', { id_juego: gameId, id_usuario: userId });
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
export const removeFromCart = async (id: number): Promise<void> => {
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
