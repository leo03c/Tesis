'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import cartService from '@/services/cartService';

interface CartContextType {
  cartItems: Set<number>;
  isLoading: boolean;
  toggleCart: (gameId: number) => Promise<void>;
  isInCart: (gameId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<Set<number>>(new Set());
  const [cartIds, setCartIds] = useState<Map<number, number>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Solo cargar carrito si el usuario está autenticado
    if (status === 'authenticated' && session?.accessToken) {
      loadCart();
    } else {
      // Limpiar carrito si no está autenticado
      setCartItems(new Set());
      setCartIds(new Map());
      setIsLoading(false);
    }
  }, [session, status]);

  const loadCart = async () => {
    setIsLoading(true);
    try {
      const response = await cartService.getCart();
      const gameIds = new Set<number>();
      const idMap = new Map<number, number>();
      
      response.results.forEach(item => {
        gameIds.add(item.game.id);
        idMap.set(item.game.id, item.id);
      });
      
      setCartItems(gameIds);
      setCartIds(idMap);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems(new Set());
      setCartIds(new Map());
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCart = async (gameId: number) => {
    // Verificar autenticación
    if (status !== 'authenticated' || !session?.accessToken) {
      console.warn('User not authenticated');
      // Redirigir al login o mostrar modal
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return;
    }

    const isInCartNow = cartItems.has(gameId);

    // Actualización optimista de UI
    if (isInCartNow) {
      setCartItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(gameId);
        return newSet;
      });
    } else {
      setCartItems(prev => new Set(prev).add(gameId));
    }

    try {
      if (isInCartNow) {
        const cartId = cartIds.get(gameId);
        if (cartId) {
          await cartService.removeFromCart(cartId);
          setCartIds(prev => {
            const newMap = new Map(prev);
            newMap.delete(gameId);
            return newMap;
          });
        }
      } else {
        const response = await cartService.addToCart(gameId);
        setCartIds(prev => new Map(prev).set(gameId, response.id));
      }
    } catch (error) {
      console.error('Error toggling cart:', error);
      // Revertir cambio optimista si falla
      if (isInCartNow) {
        setCartItems(prev => new Set(prev).add(gameId));
      } else {
        setCartItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(gameId);
          return newSet;
        });
      }
    }
  };

  const isInCart = (gameId: number) => {
    return cartItems.has(gameId);
  };

  return (
    <CartContext.Provider value={{ cartItems, isLoading, toggleCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
