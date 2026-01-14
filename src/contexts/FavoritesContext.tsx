'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import favoritesService from '@/services/favoritesService';

interface FavoritesContextType {
  favorites: Set<number>;
  isLoading: boolean;
  toggleFavorite: (gameId: number) => Promise<void>;
  isFavorite: (gameId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [favoriteIds, setFavoriteIds] = useState<Map<number, number>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Solo cargar favoritos si el usuario está autenticado
    if (status === 'authenticated' && session?.accessToken) {
      loadFavorites();
    } else {
      // Limpiar favoritos si no está autenticado
      setFavorites(new Set());
      setFavoriteIds(new Map());
      setIsLoading(false);
    }
  }, [session, status]);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const response = await favoritesService.getFavorites();
      const gameIds = new Set<number>();
      const idMap = new Map<number, number>();
      
      response.results.forEach(fav => {
        gameIds.add(fav.game.id);
        idMap.set(fav.game.id, fav.id);
      });
      
      setFavorites(gameIds);
      setFavoriteIds(idMap);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites(new Set());
      setFavoriteIds(new Map());
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (gameId: number) => {
    // Verificar autenticación
    if (status !== 'authenticated' || !session?.accessToken) {
      console.warn('User not authenticated');
      // Redirigir al login o mostrar modal
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return;
    }

    const isFav = favorites.has(gameId);

    // Actualización optimista de UI
    if (isFav) {
      setFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(gameId);
        return newSet;
      });
    } else {
      setFavorites(prev => new Set(prev).add(gameId));
    }

    try {
      if (isFav) {
        const favoriteId = favoriteIds.get(gameId);
        if (favoriteId) {
          await favoritesService.removeFavorite(favoriteId);
          setFavoriteIds(prev => {
            const newMap = new Map(prev);
            newMap.delete(gameId);
            return newMap;
          });
        }
      } else {
        const response = await favoritesService.addFavorite(gameId);
        setFavoriteIds(prev => new Map(prev).set(gameId, response.id));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revertir cambio optimista si falla
      if (isFav) {
        setFavorites(prev => new Set(prev).add(gameId));
      } else {
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(gameId);
          return newSet;
        });
      }
    }
  };

  const isFavorite = (gameId: number) => {
    return favorites.has(gameId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isLoading, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
