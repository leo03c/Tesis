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
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [favoriteIds, setFavoriteIds] = useState<Map<number, number>>(new Map()); // gameId -> favoriteId
  const [isLoading, setIsLoading] = useState(false);

  // Load favorites when user is authenticated
  useEffect(() => {
    if (session) {
      loadFavorites();
    } else {
      setFavorites(new Set());
      setFavoriteIds(new Map());
    }
  }, [session]);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const response = await favoritesService.getFavorites();
      const gameIds = new Set<number>();
      const idMap = new Map<number, number>();
      
      response.results.forEach(fav => {
        gameIds.add(fav.game);
        idMap.set(fav.game, fav.id);
      });
      
      setFavorites(gameIds);
      setFavoriteIds(idMap);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (gameId: number) => {
    if (!session) {
      console.warn('Please log in to manage your favorites');
      // TODO: Show user-friendly notification/toast
      return;
    }

    const isFav = favorites.has(gameId);

    try {
      if (isFav) {
        // Remove from favorites
        const favoriteId = favoriteIds.get(gameId);
        if (favoriteId) {
          await favoritesService.removeFavorite(favoriteId);
          setFavorites(prev => {
            const newSet = new Set(prev);
            newSet.delete(gameId);
            return newSet;
          });
          setFavoriteIds(prev => {
            const newMap = new Map(prev);
            newMap.delete(gameId);
            return newMap;
          });
        }
      } else {
        // Add to favorites
        const response = await favoritesService.addFavorite(gameId);
        setFavorites(prev => new Set(prev).add(gameId));
        setFavoriteIds(prev => new Map(prev).set(gameId, response.id));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // TODO: Implement toast notification to show error to user
      // For now, we just log the error
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
